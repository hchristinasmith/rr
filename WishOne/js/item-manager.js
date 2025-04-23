// Wish One Item Manager
// Component for adding, editing, and managing wishlist items

const ItemManager = (function() {
    // DOM Elements
    let addItemBtn;
    let addItemModal;
    let closeModalBtn;
    let cancelAddBtn;
    let addItemForm;
    let editingItemId = null;
    
    // Initialize the component
    function init(options = {}) {
        // Get DOM elements
        addItemBtn = document.getElementById(options.addBtnId || 'add-item-btn');
        addItemModal = document.getElementById(options.modalId || 'add-item-modal');
        closeModalBtn = document.getElementById(options.closeBtnId || 'close-modal');
        cancelAddBtn = document.getElementById(options.cancelBtnId || 'cancel-add');
        addItemForm = document.getElementById(options.formId || 'add-item-form');
        
        // Set up event listeners
        if (addItemBtn) {
            addItemBtn.addEventListener('click', openModal);
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        if (cancelAddBtn) {
            cancelAddBtn.addEventListener('click', closeModal);
        }
        
        if (addItemForm) {
            addItemForm.addEventListener('submit', handleAddItem);
        }
        
        // Optional callback when initialization is complete
        if (options.onInit && typeof options.onInit === 'function') {
            options.onInit();
        }
    }
    
    // Open the add/edit item modal
    function openModal() {
        if (addItemModal) {
            addItemModal.classList.add('active');
            
            // Reset form if not editing
            if (!editingItemId) {
                addItemForm.reset();
            }
        }
    }
    
    // Close the modal
    function closeModal() {
        if (addItemModal) {
            addItemModal.classList.remove('active');
            editingItemId = null;
            
            // Reset form
            if (addItemForm) {
                addItemForm.reset();
                
                // Update submit button text
                const submitBtn = addItemForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.textContent = 'Add Item';
                }
            }
        }
    }
    
    // Handle form submission for adding/editing items
    function handleAddItem(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(addItemForm);
        const itemData = {
            name: formData.get('item-name'),
            price: parseFloat(formData.get('item-price')),
            category: formData.get('item-category'),
            priority: formData.get('item-priority'),
            link: formData.get('item-link') || '',
            image: formData.get('item-image') || '',
            notes: formData.get('item-notes') || ''
        };
        
        // Validate required fields
        if (!itemData.name || isNaN(itemData.price) || itemData.price <= 0) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Add or update item in the store
        if (editingItemId) {
            WishOneStore.updateItem(editingItemId, itemData);
            showNotification('Item updated successfully', 'success');
        } else {
            WishOneStore.addItem(itemData);
            showNotification('Item added successfully', 'success');
        }
        
        // Close the modal
        closeModal();
    }
    
    // Open the modal to edit an existing item
    function editItem(id) {
        const item = WishOneStore.getItem(id);
        if (item && addItemForm) {
            // Set form fields
            addItemForm.elements['item-name'].value = item.name;
            addItemForm.elements['item-price'].value = item.price;
            addItemForm.elements['item-category'].value = item.category;
            addItemForm.elements['item-priority'].value = item.priority;
            
            if (addItemForm.elements['item-link']) {
                addItemForm.elements['item-link'].value = item.link || '';
            }
            
            if (addItemForm.elements['item-image']) {
                addItemForm.elements['item-image'].value = item.image || '';
            }
            
            if (addItemForm.elements['item-notes']) {
                addItemForm.elements['item-notes'].value = item.notes || '';
            }
            
            // Update submit button text
            const submitBtn = addItemForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Update Item';
            }
            
            // Set editing item ID
            editingItemId = id;
            
            // Open the modal
            openModal();
        }
    }
    
    // Delete an item
    function deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            WishOneStore.deleteItem(id);
            showNotification('Item deleted successfully', 'success');
        }
    }
    
    // Show a notification message
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set message and type
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.classList.add('active');
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    }
    
    // Public API
    return {
        init: init,
        openModal: openModal,
        closeModal: closeModal,
        editItem: editItem,
        deleteItem: deleteItem,
        showNotification: showNotification
    };
})();

// Add notification styles if not already in the main CSS
if (!document.querySelector('style#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: #333;
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            transform: translateY(-100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
        }
        
        .notification.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification.success {
            background-color: #4CAF50;
        }
        
        .notification.error {
            background-color: #F44336;
        }
        
        .notification.info {
            background-color: #2196F3;
        }
    `;
    document.head.appendChild(style);
}
