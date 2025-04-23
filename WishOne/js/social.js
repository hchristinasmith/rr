// Social Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize user dropdown menu
    initUserDropdown();
    
    // Initialize share wishlist functionality
    initShareWishlist();
    
    // Initialize visibility settings
    initVisibilitySettings();
    
    // Initialize gift buttons
    initGiftButtons();
    
    // Initialize view friend wishlist buttons
    initViewFriendButtons();
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

// Initialize share wishlist functionality
function initShareWishlist() {
    const shareBtn = document.querySelector('.primary-btn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            // Generate a shareable link
            const shareableLink = generateShareableLink();
            
            // Create a temporary input to copy the link
            const tempInput = document.createElement('input');
            tempInput.value = shareableLink;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Show confirmation message
            alert('Wishlist link copied to clipboard: ' + shareableLink);
        });
    }
}

// Generate a shareable link for the wishlist
function generateShareableLink() {
    // In a real app, this would generate a unique link with proper authentication
    // For this demo, we'll just create a dummy link
    const userId = 'user123';
    const timestamp = Date.now();
    return `https://wishone.app/share/${userId}?t=${timestamp}`;
}

// Initialize visibility settings
function initVisibilitySettings() {
    const visibilitySelect = document.getElementById('visibility-setting');
    
    if (visibilitySelect) {
        // Load saved setting (in a real app, this would come from a database)
        const savedSetting = localStorage.getItem('wishlistVisibility') || 'friends';
        visibilitySelect.value = savedSetting;
        
        // Save setting when changed
        visibilitySelect.addEventListener('change', function() {
            const newSetting = this.value;
            localStorage.setItem('wishlistVisibility', newSetting);
            
            // Show confirmation message
            const messages = {
                'public': 'Your wishlist is now public and visible to everyone.',
                'friends': 'Your wishlist is now visible to friends only.',
                'private': 'Your wishlist is now private.'
            };
            
            // Create a notification element
            showNotification(messages[newSetting]);
        });
    }
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

// Initialize gift buttons
function initGiftButtons() {
    const giftButtons = document.querySelectorAll('.gift-btn');
    
    giftButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activityItem = this.closest('.activity-item');
            const itemName = activityItem.querySelector('.item-name').textContent;
            
            // Toggle gifting status
            if (this.classList.contains('gifting')) {
                this.classList.remove('gifting');
                this.innerHTML = '<i class="fas fa-gift"></i>';
                this.title = "I'll gift this";
                showNotification(`Removed "${itemName}" from your gift list.`);
            } else {
                this.classList.add('gifting');
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.title = "You're gifting this";
                showNotification(`Added "${itemName}" to your gift list. The owner won't be notified.`);
            }
        });
    });
}

// Initialize view friend wishlist buttons
function initViewFriendButtons() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const friendItem = this.closest('.friend-item');
            const friendName = friendItem.querySelector('.friend-name').textContent;
            
            // In a real app, this would navigate to the friend's wishlist
            // For this demo, we'll just show a message
            showNotification(`Viewing ${friendName}'s wishlist...`);
            
            // Simulate loading a friend's wishlist
            setTimeout(() => {
                // This would be replaced with actual navigation in a real app
                alert(`This would show ${friendName}'s wishlist in a real application.`);
            }, 500);
        });
    });
}
