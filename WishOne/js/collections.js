// Collections Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize user dropdown menu
    initUserDropdown();
    
    // Initialize collection modal
    initCollectionModal();
    
    // Initialize collection actions
    initCollectionActions();
    
    // Load collections from localStorage
    loadCollections();
});

// Initialize user dropdown menu
function initUserDropdown() {
    const userBtn = document.querySelector('.user-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userBtn && dropdownMenu) {
        // Toggle dropdown on click
        userBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownMenu.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
    }
}

// Initialize collection modal
function initCollectionModal() {
    const createCollectionBtn = document.getElementById('create-collection-btn');
    const addCollectionCard = document.querySelector('.add-collection');
    const collectionModal = document.getElementById('collection-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const collectionForm = document.getElementById('collection-form');
    
    // Open modal when clicking the create button
    if (createCollectionBtn) {
        createCollectionBtn.addEventListener('click', function() {
            collectionModal.classList.add('active');
        });
    }
    
    // Open modal when clicking the add collection card
    if (addCollectionCard) {
        addCollectionCard.addEventListener('click', function() {
            collectionModal.classList.add('active');
        });
    }
    
    // Close modal when clicking the close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            collectionModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking the cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            collectionModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === collectionModal) {
            collectionModal.classList.remove('active');
        }
    });
    
    // Handle form submission
    if (collectionForm) {
        collectionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('collection-name').value;
            const description = document.getElementById('collection-description').value;
            
            if (!name) {
                alert('Please enter a collection name');
                return;
            }
            
            // Create new collection
            const newCollection = {
                id: 'col_' + Date.now(),
                name: name,
                description: description,
                items: [],
                totalPrice: 0,
                savedAmount: 0,
                createdAt: new Date().toISOString()
            };
            
            // Save collection
            saveCollection(newCollection);
            
            // Reset form
            collectionForm.reset();
            
            // Close modal
            collectionModal.classList.remove('active');
            
            // Reload collections
            loadCollections();
        });
    }
}

// Initialize collection actions
function initCollectionActions() {
    // Edit buttons
    document.querySelectorAll('.action-btn[title="Edit"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const collectionCard = this.closest('.collection-card');
            const collectionId = collectionCard.dataset.id;
            
            // In a real app, this would open an edit modal with the collection data
            alert('Edit collection: ' + collectionId);
        });
    });
    
    // Share buttons
    document.querySelectorAll('.action-btn[title="Share"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const collectionCard = this.closest('.collection-card');
            const collectionName = collectionCard.querySelector('h3').textContent;
            
            // Generate a shareable link
            const shareableLink = generateShareableLink(collectionCard.dataset.id);
            
            // Create a temporary input to copy the link
            const tempInput = document.createElement('input');
            tempInput.value = shareableLink;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Show confirmation message
            alert(`Link to "${collectionName}" copied to clipboard: ${shareableLink}`);
        });
    });
    
    // View all items links
    document.querySelectorAll('.view-more .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const collectionCard = this.closest('.collection-card');
            const collectionName = collectionCard.querySelector('h3').textContent;
            
            // In a real app, this would navigate to a detailed view of the collection
            alert(`Viewing all items in "${collectionName}"`);
        });
    });
}

// Generate a shareable link for a collection
function generateShareableLink(collectionId) {
    // In a real app, this would generate a unique link with proper authentication
    // For this demo, we'll just create a dummy link
    return `https://wishone.app/collection/${collectionId}`;
}

// Save collection to localStorage
function saveCollection(collection) {
    // Get existing collections
    let collections = JSON.parse(localStorage.getItem('wishoneCollections')) || [];
    
    // Add new collection
    collections.push(collection);
    
    // Save to localStorage
    localStorage.setItem('wishoneCollections', JSON.stringify(collections));
    
    // Show success message
    showNotification(`Collection "${collection.name}" created successfully`);
}

// Load collections from localStorage
function loadCollections() {
    // In a real app, this would fetch collections from a database
    // For this demo, we'll just use the existing HTML structure
    
    // Get collections from localStorage
    const collections = JSON.parse(localStorage.getItem('wishoneCollections')) || [];
    
    // If we have collections in localStorage, we could render them here
    if (collections.length > 0) {
        console.log(`Loaded ${collections.length} collections from localStorage`);
    }
    
    // Add data-id attributes to collection cards for demo purposes
    document.querySelectorAll('.collection-card:not(.add-collection)').forEach((card, index) => {
        card.setAttribute('data-id', `demo_collection_${index + 1}`);
    });
}

// Show a temporary notification
function showNotification(message) {
    // Check if a notification already exists and remove it
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification styles if not already in the main CSS
if (!document.querySelector('style#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            font-family: 'Libre Franklin', sans-serif;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}
