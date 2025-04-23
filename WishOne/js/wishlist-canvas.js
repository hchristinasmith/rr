// Wishlist Canvas JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const canvas = document.getElementById('wishlist-canvas');
    const draggableItems = document.getElementById('draggable-items');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-items');
    const createGroupBtn = document.getElementById('create-group-btn');
    const clearCanvasBtn = document.getElementById('clear-canvas-btn');
    const canvasTotal = document.getElementById('canvas-total');
    const selectionTotal = document.getElementById('selection-total');
    
    // State
    let canvasItems = [];
    let groups = [];
    let selectedItems = [];
    let selectedGroup = null;
    let isDragging = false;
    let draggedItem = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let nextGroupId = 1;
    
    // Initialize the Item Manager
    ItemManager.init({
        addBtnId: 'add-item-btn',
        modalId: 'item-modal',
        closeBtnId: 'close-item-modal',
        cancelBtnId: 'cancel-item',
        formId: 'item-form',
        onInit: function() {
            // Setup image preview
            const imageInput = document.getElementById('item-image');
            const imagePreview = document.getElementById('image-preview');
            
            if (imageInput && imagePreview) {
                imageInput.addEventListener('input', function() {
                    if (this.value) {
                        imagePreview.style.backgroundImage = `url(${this.value})`;
                        imagePreview.style.display = 'block';
                    } else {
                        imagePreview.style.backgroundImage = 'none';
                        imagePreview.style.display = 'none';
                    }
                });
            }
        }
    });
    
    // Initialize the canvas
    initCanvas();
    
    // Subscribe to data store events
    WishOneStore.on('itemsUpdated', function(items) {
        // Refresh the draggable items panel
        setupDraggableItems();
    });
    
    WishOneStore.on('itemUpdated', function(item) {
        // Update the item on the canvas if it exists
        const canvasItem = canvasItems.find(ci => ci.id === item.id);
        if (canvasItem) {
            // Update the canvas item with new data
            const itemElement = document.querySelector(`.canvas-item[data-id="${item.id}"]`);
            if (itemElement) {
                itemElement.querySelector('.item-name').textContent = item.name;
                itemElement.querySelector('.item-price').textContent = `$${item.price.toFixed(2)}`;
                
                // Update category class
                const oldCategory = itemElement.getAttribute('data-category');
                itemElement.classList.remove(`category-${oldCategory}`);
                itemElement.classList.add(`category-${item.category}`);
                itemElement.setAttribute('data-category', item.category);
                
                // Update price attribute
                itemElement.setAttribute('data-price', item.price);
                
                // Update image if available
                const imageElement = itemElement.querySelector('.item-image');
                if (imageElement) {
                    if (item.image) {
                        imageElement.style.backgroundImage = `url(${item.image})`;
                        imageElement.innerHTML = '';
                    } else {
                        imageElement.style.backgroundImage = 'none';
                        // Add icon based on category
                        const icon = getCategoryIcon(item.category);
                        imageElement.innerHTML = `<i class="fas ${icon}"></i>`;
                    }
                }
            }
            
            // Update canvas item data
            Object.assign(canvasItem, item);
            
            // Update totals
            updateTotals();
            updateGroupTotals();
        }
    });
    
    WishOneStore.on('itemDeleted', function(item) {
        // Remove the item from the canvas if it exists
        removeCanvasItem(item.id);
    });
    
    // Initialize event listeners
    function initCanvas() {
        // Filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterItems(filter);
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchItems(searchTerm);
        });
        
        // Clear canvas button
        clearCanvasBtn.addEventListener('click', clearCanvas);
        
        // Create group button
        createGroupBtn.addEventListener('click', createGroup);
        
        // Setup drag and drop for items in the panel
        setupDraggableItems();
        
        // Canvas click handler (for deselection)
        canvas.addEventListener('click', function(e) {
            if (e.target === canvas) {
                deselectAll();
            }
        });
        
        // Canvas drop handler
        canvas.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        canvas.addEventListener('drop', function(e) {
            e.preventDefault();
            
            // Get the drop position relative to the canvas
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // If an item is being dragged from the panel
            if (draggedItem && draggedItem.classList.contains('wishlist-item')) {
                const itemId = draggedItem.getAttribute('data-id');
                const itemName = draggedItem.querySelector('.item-name').textContent;
                const itemPrice = parseFloat(draggedItem.getAttribute('data-price'));
                const itemCategory = draggedItem.getAttribute('data-category');
                
                // Create a new item on the canvas
                createCanvasItem(itemId, itemName, itemPrice, itemCategory, x, y);
            }
        });
        
        // Handle keyboard events for deleting items
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedItems.length > 0) {
                    deleteSelectedItems();
                }
                if (selectedGroup) {
                    deleteSelectedGroup();
                }
            }
        });
    }
    
    // Setup draggable items in the panel
    function setupDraggableItems() {
        // Clear existing items
        draggableItems.innerHTML = '';
        
        // Get items from the data store
        const items = WishOneStore.getItems();
        
        // Create draggable items
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `wishlist-item category-${item.category}`;
            itemElement.setAttribute('draggable', 'true');
            itemElement.setAttribute('data-id', item.id);
            itemElement.setAttribute('data-category', item.category);
            itemElement.setAttribute('data-price', item.price);
            
            // Get icon based on category
            const icon = getCategoryIcon(item.category);
            
            // Create HTML content
            let imageContent;
            if (item.image) {
                imageContent = `<div class="item-image" style="background-image: url(${item.image});"></div>`;
            } else {
                imageContent = `
                    <div class="item-image" style="background-color: #f0f0f0;">
                        <i class="fas ${icon}"></i>
                    </div>
                `;
            }
            
            itemElement.innerHTML = `
                ${imageContent}
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-actions">
                    <button class="edit-item" data-id="${item.id}" title="Edit Item">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            `;
            
            // Add drag event listeners
            itemElement.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', item.id);
                e.dataTransfer.effectAllowed = 'copy';
                this.classList.add('dragging');
            });
            
            itemElement.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
            
            // Add edit button event listener
            const editBtn = itemElement.querySelector('.edit-item');
            if (editBtn) {
                editBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const itemId = parseInt(this.getAttribute('data-id'));
                    ItemManager.editItem(itemId);
                });
            }
            
            draggableItems.appendChild(itemElement);
        });
        
        // Show placeholder if no items
        if (items.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'empty-items-placeholder';
            placeholder.innerHTML = `
                <p>No items in your wishlist yet.</p>
                <button id="empty-add-btn" class="btn secondary-btn">Add Your First Item</button>
            `;
            
            draggableItems.appendChild(placeholder);
            
            // Add event listener to the empty add button
            const emptyAddBtn = document.getElementById('empty-add-btn');
            if (emptyAddBtn) {
                emptyAddBtn.addEventListener('click', function() {
                    ItemManager.openModal();
                });
            }
        }
    }
    
    // Helper function to get icon based on category
    function getCategoryIcon(category) {
        switch(category) {
            case 'clothing':
                return 'fa-tshirt';
            case 'tech':
                return 'fa-laptop';
            case 'home':
                return 'fa-couch';
            case 'beauty':
                return 'fa-spa';
            case 'fitness':
                return 'fa-dumbbell';
            case 'travel':
                return 'fa-plane';
            case 'gifts':
                return 'fa-gift';
            default:
                return 'fa-box';
        }
    }
    
    // Create a new item on the canvas
    function createCanvasItem(id, name, price, category, x, y, image = null) {
        // Get the full item data from the store
        const storeItem = WishOneStore.getItem(parseInt(id));
        const itemData = storeItem || { id, name, price, category, image };
        
        // Create canvas item element
        const itemElement = document.createElement('div');
        itemElement.className = `canvas-item category-${category}`;
        itemElement.setAttribute('data-id', id);
        itemElement.setAttribute('data-category', category);
        itemElement.setAttribute('data-price', price);
        itemElement.style.left = `${x}px`;
        itemElement.style.top = `${y}px`;
        
        // Prepare image content
        let imageContent;
        if (image || (storeItem && storeItem.image)) {
            const imageUrl = image || storeItem.image;
            imageContent = `<div class="item-image" style="background-image: url(${imageUrl});"></div>`;
        } else {
            // Get icon based on category
            const icon = getCategoryIcon(category);
            imageContent = `
                <div class="item-image" style="background-color: #f0f0f0;">
                    <i class="fas ${icon}"></i>
                </div>
            `;
        }
        
        itemElement.innerHTML = `
            <div class="item-header">
                <div class="item-drag-handle"><i class="fas fa-grip-horizontal"></i></div>
                <div class="item-actions">
                    <button class="edit-canvas-item" title="Edit Item"><i class="fas fa-edit"></i></button>
                    <button class="remove-item" title="Remove Item"><i class="fas fa-times"></i></button>
                </div>
            </div>
            ${imageContent}
            <div class="item-details">
                <h4 class="item-name">${name}</h4>
                <p class="item-price">$${parseFloat(price).toFixed(2)}</p>
            </div>
        `;
        
        // Add the item to the canvas
        canvas.appendChild(itemElement);
        
        // Add to canvas and canvas items array
        canvas.appendChild(itemElement);
        canvasItems.push({
            id: parseInt(id),
            element: itemElement,
            name: name,
            price: parseFloat(price),
            category: category,
            image: image || (storeItem ? storeItem.image : null),
            x: x,
            y: y,
            width: itemElement.offsetWidth,
            height: itemElement.offsetHeight,
            inGroup: null
        });
        
        // Setup drag functionality
        setupCanvasItemDrag(itemElement);
        
        // Add click event for selection
        itemElement.addEventListener('click', function(e) {
            if (!isDragging && e.target.closest('.remove-item')) {
                // Remove item
                const itemId = this.getAttribute('data-id');
                removeCanvasItem(itemId);
            } else if (!isDragging && e.target.closest('.edit-canvas-item')) {
                // Edit item
                const itemId = parseInt(this.getAttribute('data-id'));
                ItemManager.editItem(itemId);
            } else if (!isDragging && !e.target.closest('.item-actions')) {
                // Select/deselect item
                toggleItemSelection(this);
            }
        });
        
        // Update canvas total
        updateTotals();
        
        // Hide placeholder if there are items
        togglePlaceholder();
        
        return item;
    }
    
    // Setup drag functionality for canvas items
    function setupCanvasItemDrag(item) {
        item.addEventListener('mousedown', function(e) {
            // Only handle left mouse button
            if (e.button !== 0) return;
            
            // Prevent default to avoid text selection
            e.preventDefault();
            
            // If the item is not selected, select it
            if (!item.classList.contains('selected')) {
                deselectAll();
                selectItem(item);
            }
            
            // Calculate offset for dragging
            const rect = item.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            
            // Start dragging
            isDragging = true;
            
            // Add mousemove and mouseup listeners to document
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
        
        function handleMouseMove(e) {
            if (!isDragging) return;
            
            const canvasRect = canvas.getBoundingClientRect();
            
            // Move all selected items
            selectedItems.forEach(selectedItem => {
                // Get the item data
                const itemData = canvasItems.find(i => i.element === selectedItem);
                
                // Calculate new position
                const x = e.clientX - canvasRect.left - dragOffsetX;
                const y = e.clientY - canvasRect.top - dragOffsetY;
                
                // Update position
                selectedItem.style.left = `${x}px`;
                selectedItem.style.top = `${y}px`;
                
                // Update item data
                if (itemData) {
                    itemData.x = x;
                    itemData.y = y;
                }
            });
            
            // Update group totals
            updateGroupTotals();
        }
        
        function handleMouseUp() {
            isDragging = false;
            
            // Remove event listeners
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            // Check if items are in a group
            checkItemsInGroups();
        }
    }
    
    // Remove an item from the canvas
    function removeCanvasItem(id) {
        // Find the item
        const itemIndex = canvasItems.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
            // Remove from DOM
            canvas.removeChild(canvasItems[itemIndex].element);
            
            // Remove from selection if selected
            const selIndex = selectedItems.indexOf(canvasItems[itemIndex].element);
            if (selIndex !== -1) {
                selectedItems.splice(selIndex, 1);
            }
            
            // Remove from array
            canvasItems.splice(itemIndex, 1);
            
            // Update totals
            updateTotals();
            
            // Show placeholder if no items
            togglePlaceholder();
            
            // Update group totals
            updateGroupTotals();
        }
    }
    
    // Select an item
    function selectItem(item) {
        item.classList.add('selected');
        selectedItems.push(item);
        updateSelectionTotal();
    }
    
    // Deselect an item
    function deselectItem(item) {
        item.classList.remove('selected');
        const index = selectedItems.indexOf(item);
        if (index !== -1) {
            selectedItems.splice(index, 1);
        }
        updateSelectionTotal();
    }
    
    // Toggle item selection
    function toggleItemSelection(item) {
        if (item.classList.contains('selected')) {
            deselectItem(item);
        } else {
            selectItem(item);
        }
    }
    
    // Deselect all items and groups
    function deselectAll() {
        // Deselect items
        selectedItems.forEach(item => {
            item.classList.remove('selected');
        });
        selectedItems = [];
        
        // Deselect group
        if (selectedGroup) {
            selectedGroup.classList.remove('selected');
            selectedGroup = null;
        }
        
        updateSelectionTotal();
    }
    
    // Delete selected items
    function deleteSelectedItems() {
        // Create a copy of the array to avoid issues when modifying during iteration
        const itemsToDelete = [...selectedItems];
        
        itemsToDelete.forEach(item => {
            const id = item.getAttribute('data-id');
            removeCanvasItem(id);
        });
        
        selectedItems = [];
        updateSelectionTotal();
    }
    
    // Filter items in the panel
    function filterItems(filter) {
        const items = draggableItems.querySelectorAll('.wishlist-item');
        
        items.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Search items in the panel
    function searchItems(term) {
        const items = draggableItems.querySelectorAll('.wishlist-item');
        
        items.forEach(item => {
            const name = item.querySelector('.item-name').textContent.toLowerCase();
            
            if (name.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Create a new group
    function createGroup() {
        // If no items are selected, create an empty group
        if (selectedItems.length === 0) {
            createEmptyGroup(100, 100);
            return;
        }
        
        // Calculate group bounds
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        
        selectedItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            const x = parseInt(item.style.left);
            const y = parseInt(item.style.top);
            const width = rect.width;
            const height = rect.height;
            
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
        });
        
        // Add padding
        minX -= 20;
        minY -= 40; // Extra space for the header
        maxX += 20;
        maxY += 20;
        
        // Create group element
        const groupId = `group-${nextGroupId++}`;
        const group = document.createElement('div');
        group.className = 'item-group';
        group.setAttribute('data-id', groupId);
        group.style.left = `${minX}px`;
        group.style.top = `${minY}px`;
        group.style.width = `${maxX - minX}px`;
        group.style.height = `${maxY - minY}px`;
        
        group.innerHTML = `
            <div class="group-header">
                <h4 class="group-title">Group ${nextGroupId - 1}</h4>
                <div class="group-actions">
                    <button class="action-btn rename-btn" title="Rename"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <div class="group-total">$0.00</div>
        `;
        
        // Add to canvas
        canvas.insertBefore(group, canvas.firstChild);
        
        // Add to groups array
        groups.push({
            id: groupId,
            element: group,
            name: `Group ${nextGroupId - 1}`,
            items: []
        });
        
        // Setup group drag
        setupGroupDrag(group);
        
        // Add selected items to the group
        selectedItems.forEach(item => {
            const itemId = item.getAttribute('data-id');
            const itemData = canvasItems.find(i => i.id === itemId);
            
            if (itemData) {
                itemData.groupId = groupId;
                
                // Add to group's items array
                const groupData = groups.find(g => g.id === groupId);
                if (groupData) {
                    groupData.items.push(itemData);
                }
            }
        });
        
        // Setup group selection
        group.addEventListener('mousedown', function(e) {
            // Only if clicking the group itself, not its children
            if (e.target === group || e.target.classList.contains('group-header') || 
                e.target.classList.contains('group-title')) {
                e.stopPropagation();
                deselectAll();
                selectGroup(group);
            }
        });
        
        // Setup delete button
        const deleteBtn = group.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteGroup(groupId);
        });
        
        // Setup rename button
        const renameBtn = group.querySelector('.rename-btn');
        renameBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            renameGroup(groupId);
        });
        
        // Update group total
        updateGroupTotal(groupId);
        
        return group;
    }
    
    // Create an empty group
    function createEmptyGroup(x, y) {
        const groupId = `group-${nextGroupId++}`;
        const group = document.createElement('div');
        group.className = 'item-group';
        group.setAttribute('data-id', groupId);
        group.style.left = `${x}px`;
        group.style.top = `${y}px`;
        group.style.width = '200px';
        group.style.height = '150px';
        
        group.innerHTML = `
            <div class="group-header">
                <h4 class="group-title">Group ${nextGroupId - 1}</h4>
                <div class="group-actions">
                    <button class="action-btn rename-btn" title="Rename"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <div class="group-total">$0.00</div>
        `;
        
        // Add to canvas
        canvas.insertBefore(group, canvas.firstChild);
        
        // Add to groups array
        groups.push({
            id: groupId,
            element: group,
            name: `Group ${nextGroupId - 1}`,
            items: []
        });
        
        // Setup group drag
        setupGroupDrag(group);
        
        // Setup group selection
        group.addEventListener('mousedown', function(e) {
            // Only if clicking the group itself, not its children
            if (e.target === group || e.target.classList.contains('group-header') || 
                e.target.classList.contains('group-title')) {
                e.stopPropagation();
                deselectAll();
                selectGroup(group);
            }
        });
        
        // Setup delete button
        const deleteBtn = group.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteGroup(groupId);
        });
        
        // Setup rename button
        const renameBtn = group.querySelector('.rename-btn');
        renameBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            renameGroup(groupId);
        });
        
        return group;
    }
    
    // Setup drag functionality for groups
    function setupGroupDrag(group) {
        group.addEventListener('mousedown', function(e) {
            // Only if clicking the group itself or its header
            if (e.target === group || e.target.classList.contains('group-header') || 
                e.target.classList.contains('group-title')) {
                // Only handle left mouse button
                if (e.button !== 0) return;
                
                // Prevent default to avoid text selection
                e.preventDefault();
                
                // Calculate offset for dragging
                const rect = group.getBoundingClientRect();
                dragOffsetX = e.clientX - rect.left;
                dragOffsetY = e.clientY - rect.top;
                
                // Start dragging
                isDragging = true;
                
                // Add mousemove and mouseup listeners to document
                document.addEventListener('mousemove', handleGroupMove);
                document.addEventListener('mouseup', handleGroupUp);
            }
        });
        
        function handleGroupMove(e) {
            if (!isDragging) return;
            
            const canvasRect = canvas.getBoundingClientRect();
            
            // Calculate new position
            const x = e.clientX - canvasRect.left - dragOffsetX;
            const y = e.clientY - canvasRect.top - dragOffsetY;
            
            // Update position
            group.style.left = `${x}px`;
            group.style.top = `${y}px`;
            
            // Move all items in the group
            const groupId = group.getAttribute('data-id');
            const groupItems = canvasItems.filter(item => item.groupId === groupId);
            
            groupItems.forEach(item => {
                // Calculate the relative position within the group
                const relX = parseInt(item.element.style.left) - parseInt(group.style.left);
                const relY = parseInt(item.element.style.top) - parseInt(group.style.top);
                
                // Update position
                item.element.style.left = `${x + relX}px`;
                item.element.style.top = `${y + relY}px`;
                
                // Update item data
                item.x = x + relX;
                item.y = y + relY;
            });
        }
        
        function handleGroupUp() {
            isDragging = false;
            
            // Remove event listeners
            document.removeEventListener('mousemove', handleGroupMove);
            document.removeEventListener('mouseup', handleGroupUp);
        }
    }
    
    // Select a group
    function selectGroup(group) {
        group.classList.add('selected');
        selectedGroup = group;
    }
    
    // Delete a group
    function deleteGroup(groupId) {
        // Find the group
        const groupIndex = groups.findIndex(group => group.id === groupId);
        
        if (groupIndex !== -1) {
            // Remove group element from DOM
            canvas.removeChild(groups[groupIndex].element);
            
            // Release all items from the group
            canvasItems.forEach(item => {
                if (item.groupId === groupId) {
                    item.groupId = null;
                }
            });
            
            // Remove from selection if selected
            if (selectedGroup && selectedGroup.getAttribute('data-id') === groupId) {
                selectedGroup = null;
            }
            
            // Remove from array
            groups.splice(groupIndex, 1);
        }
    }
    
    // Delete selected group
    function deleteSelectedGroup() {
        if (selectedGroup) {
            const groupId = selectedGroup.getAttribute('data-id');
            deleteGroup(groupId);
        }
    }
    
    // Rename a group
    function renameGroup(groupId) {
        const group = groups.find(g => g.id === groupId);
        
        if (group) {
            const newName = prompt('Enter a new name for the group:', group.name);
            
            if (newName && newName.trim() !== '') {
                group.name = newName.trim();
                
                // Update the DOM
                const titleElement = group.element.querySelector('.group-title');
                if (titleElement) {
                    titleElement.textContent = newName.trim();
                }
            }
        }
    }
    
    // Check if items are in any group
    function checkItemsInGroups() {
        // For each group
        groups.forEach(group => {
            const groupRect = group.element.getBoundingClientRect();
            const groupLeft = parseInt(group.element.style.left);
            const groupTop = parseInt(group.element.style.top);
            const groupRight = groupLeft + groupRect.width;
            const groupBottom = groupTop + groupRect.height;
            
            // Clear the group's items
            group.items = [];
            
            // Check each item
            canvasItems.forEach(item => {
                const itemRect = item.element.getBoundingClientRect();
                const itemLeft = parseInt(item.element.style.left);
                const itemTop = parseInt(item.element.style.top);
                const itemRight = itemLeft + itemRect.width;
                const itemBottom = itemTop + itemRect.height;
                
                // Check if the item is fully contained in the group
                if (itemLeft >= groupLeft && itemRight <= groupRight &&
                    itemTop >= groupTop && itemBottom <= groupBottom) {
                    // Add to group
                    item.groupId = group.id;
                    group.items.push(item);
                } else if (item.groupId === group.id) {
                    // If it was in this group but no longer is
                    item.groupId = null;
                }
            });
            
            // Update the group total
            updateGroupTotal(group.id);
        });
        
        // Check for overlapping items that aren't in a group
        checkForOverlappingItems();
    }
    
    // Update the total for a specific group
    function updateGroupTotal(groupId) {
        const group = groups.find(g => g.id === groupId);
        
        if (group) {
            // Calculate total
            let total = 0;
            group.items.forEach(item => {
                total += item.price;
            });
            
            // Update the DOM
            const totalElement = group.element.querySelector('.group-total');
            if (totalElement) {
                totalElement.textContent = `$${total.toFixed(2)}`;
            }
        }
    }
    
    // Update all group totals
    function updateGroupTotals() {
        groups.forEach(group => {
            updateGroupTotal(group.id);
        });
    }
    
    // Check for overlapping items and create automatic groups
    function checkForOverlappingItems() {
        // Get ungrouped items
        const ungroupedItems = canvasItems.filter(item => item.groupId === null);
        
        // If less than 2 ungrouped items, no need to check for overlaps
        if (ungroupedItems.length < 2) return;
        
        // Track which items have been processed
        const processedItems = new Set();
        
        // For each ungrouped item
        for (let i = 0; i < ungroupedItems.length; i++) {
            const item1 = ungroupedItems[i];
            
            // Skip if already processed
            if (processedItems.has(item1.id)) continue;
            
            // Items that overlap with this item
            const overlappingItems = [item1];
            processedItems.add(item1.id);
            
            // Get item1 bounds
            const item1Rect = item1.element.getBoundingClientRect();
            const item1Left = parseInt(item1.element.style.left);
            const item1Top = parseInt(item1.element.style.top);
            const item1Right = item1Left + item1Rect.width;
            const item1Bottom = item1Top + item1Rect.height;
            
            // Check against other ungrouped items
            for (let j = 0; j < ungroupedItems.length; j++) {
                if (i === j) continue; // Skip self
                
                const item2 = ungroupedItems[j];
                
                // Skip if already processed
                if (processedItems.has(item2.id)) continue;
                
                // Get item2 bounds
                const item2Rect = item2.element.getBoundingClientRect();
                const item2Left = parseInt(item2.element.style.left);
                const item2Top = parseInt(item2.element.style.top);
                const item2Right = item2Left + item2Rect.width;
                const item2Bottom = item2Top + item2Rect.height;
                
                // Check for overlap (at least 30% overlap to consider it a group)
                const overlapThreshold = 0.3;
                
                // Calculate overlap area
                const overlapLeft = Math.max(item1Left, item2Left);
                const overlapTop = Math.max(item1Top, item2Top);
                const overlapRight = Math.min(item1Right, item2Right);
                const overlapBottom = Math.min(item1Bottom, item2Bottom);
                
                // If there is an overlap
                if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
                    const overlapWidth = overlapRight - overlapLeft;
                    const overlapHeight = overlapBottom - overlapTop;
                    const overlapArea = overlapWidth * overlapHeight;
                    
                    const item1Area = (item1Right - item1Left) * (item1Bottom - item1Top);
                    const item2Area = (item2Right - item2Left) * (item2Bottom - item2Top);
                    
                    const overlapRatio1 = overlapArea / item1Area;
                    const overlapRatio2 = overlapArea / item2Area;
                    
                    // If either overlap ratio exceeds threshold
                    if (overlapRatio1 > overlapThreshold || overlapRatio2 > overlapThreshold) {
                        overlappingItems.push(item2);
                        processedItems.add(item2.id);
                    }
                }
            }
            
            // If we found overlapping items, create a group
            if (overlappingItems.length > 1) {
                createAutoGroup(overlappingItems);
            }
        }
    }
    
    // Create an automatic group for overlapping items
    function createAutoGroup(items) {
        // Calculate group bounds
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        
        items.forEach(item => {
            const rect = item.element.getBoundingClientRect();
            
            const x = parseInt(item.element.style.left);
            const y = parseInt(item.element.style.top);
            const width = rect.width;
            const height = rect.height;
            
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
        });
        
        // Add padding
        minX -= 20;
        minY -= 40; // Extra space for the header
        maxX += 20;
        maxY += 20;
        
        // Create group element
        const groupId = `group-${nextGroupId++}`;
        const group = document.createElement('div');
        group.className = 'item-group auto-group';
        group.setAttribute('data-id', groupId);
        group.style.left = `${minX}px`;
        group.style.top = `${minY}px`;
        group.style.width = `${maxX - minX}px`;
        group.style.height = `${maxY - minY}px`;
        
        group.innerHTML = `
            <div class="group-header">
                <h4 class="group-title">Group ${nextGroupId - 1}</h4>
                <div class="group-actions">
                    <button class="action-btn rename-btn" title="Rename"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <div class="group-total">$0.00</div>
        `;
        
        // Add to canvas
        canvas.insertBefore(group, canvas.firstChild);
        
        // Add to groups array
        const groupData = {
            id: groupId,
            element: group,
            name: `Group ${nextGroupId - 1}`,
            items: []
        };
        
        groups.push(groupData);
        
        // Setup group drag
        setupGroupDrag(group);
        
        // Add items to the group
        items.forEach(item => {
            item.groupId = groupId;
            groupData.items.push(item);
        });
        
        // Setup group selection
        group.addEventListener('mousedown', function(e) {
            // Only if clicking the group itself, not its children
            if (e.target === group || e.target.classList.contains('group-header') || 
                e.target.classList.contains('group-title')) {
                e.stopPropagation();
                deselectAll();
                selectGroup(group);
            }
        });
        
        // Setup delete button
        const deleteBtn = group.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteGroup(groupId);
        });
        
        // Setup rename button
        const renameBtn = group.querySelector('.rename-btn');
        renameBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            renameGroup(groupId);
        });
        
        // Update group total
        updateGroupTotal(groupId);
        
        return group;
    }
    
    // Update the canvas total
    function updateTotals() {
        // Calculate canvas total
        let total = 0;
        canvasItems.forEach(item => {
            total += item.price;
        });
        
        // Update the DOM
        canvasTotal.textContent = `$${total.toFixed(2)}`;
        
        // Update selection total
        updateSelectionTotal();
    }
    
    // Update the selection total
    function updateSelectionTotal() {
        // Calculate selection total
        let total = 0;
        selectedItems.forEach(item => {
            const price = parseFloat(item.getAttribute('data-price'));
            total += price;
        });
        
        // Update the DOM
        selectionTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Toggle placeholder visibility
    function togglePlaceholder() {
        const placeholder = canvas.querySelector('.canvas-placeholder');
        
        if (canvasItems.length === 0) {
            placeholder.style.display = 'flex';
        } else {
            placeholder.style.display = 'none';
        }
    }
    
    // Clear the canvas
    function clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas? This will remove all items and groups.')) {
            // Remove all items
            while (canvasItems.length > 0) {
                const item = canvasItems[0];
                canvas.removeChild(item.element);
                canvasItems.shift();
            }
            
            // Remove all groups
            while (groups.length > 0) {
                const group = groups[0];
                canvas.removeChild(group.element);
                groups.shift();
            }
            
            // Clear selection
            selectedItems = [];
            selectedGroup = null;
            
            // Update totals
            updateTotals();
            
            // Show placeholder
            togglePlaceholder();
        }
    }
});
