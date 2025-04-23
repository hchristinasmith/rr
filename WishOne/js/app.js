// DOM Elements - Wishlist
const addItemBtn = document.getElementById('add-item-btn');
const addItemModal = document.getElementById('add-item-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelAddBtn = document.getElementById('cancel-add');
const addItemForm = document.getElementById('add-item-form');
const itemsContainer = document.getElementById('items-container');
const emptyState = document.getElementById('empty-state');
const emptyAddBtn = document.getElementById('empty-add-btn');
const sortBySelect = document.getElementById('sort-by');

// DOM Elements - Expenses
const addExpenseBtn = document.getElementById('add-expense-btn');
const addExpenseModal = document.getElementById('add-expense-modal');
const closeExpenseModalBtn = document.getElementById('close-expense-modal');
const cancelExpenseBtn = document.getElementById('cancel-expense');
const addExpenseForm = document.getElementById('add-expense-form');

// DOM Elements - Savings
const addSavingsBtn = document.getElementById('add-savings-btn');

// App State
let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budget = JSON.parse(localStorage.getItem('budget')) || {
    monthly: 1200,
    savings: 300
};
let savings = JSON.parse(localStorage.getItem('savings')) || {
    total: 650,
    allocations: [
        { itemId: 1, amount: 120 },
        { itemId: 2, amount: 400 },
        { itemId: 3, amount: 130 }
    ]
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Initialize user dropdown
    initUserDropdown();
});

// Wishlist Event Listeners
addItemBtn.addEventListener('click', openModal);
if (emptyAddBtn) emptyAddBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelAddBtn.addEventListener('click', closeModal);
addItemForm.addEventListener('submit', handleAddItem);
sortBySelect.addEventListener('change', handleSort);

// Expense Event Listeners
if (addExpenseBtn) addExpenseBtn.addEventListener('click', openExpenseModal);
if (closeExpenseModalBtn) closeExpenseModalBtn.addEventListener('click', closeExpenseModal);
if (cancelExpenseBtn) cancelExpenseBtn.addEventListener('click', closeExpenseModal);
if (addExpenseForm) addExpenseForm.addEventListener('submit', handleAddExpense);

// Savings Event Listeners
if (addSavingsBtn) addSavingsBtn.addEventListener('click', openSavingsDialog);

// Modal Functions
function openModal() {
    addItemModal.style.display = 'flex';
}

function closeModal() {
    addItemModal.style.display = 'none';
    addItemForm.reset();
}

function openExpenseModal() {
    addExpenseModal.style.display = 'flex';
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
}

function closeExpenseModal() {
    addExpenseModal.style.display = 'none';
    addExpenseForm.reset();
}

function openSavingsDialog() {
    const amount = prompt('How much would you like to add to your savings?', '50');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        addToSavings(parseFloat(amount));
    }
}

// Item Management
function handleAddItem(e) {
    e.preventDefault();
    
    const newItem = {
        id: Date.now(),
        name: document.getElementById('item-name').value,
        price: parseFloat(document.getElementById('item-price').value),
        category: document.getElementById('item-category').value,
        priority: document.getElementById('item-priority').value,
        link: document.getElementById('item-link').value || '',
        notes: document.getElementById('item-notes').value || '',
        dateAdded: new Date().toISOString()
    };
    
    wishlistItems.push(newItem);
    saveItems();
    renderItems();
    closeModal();
}

function handleAddExpense(e) {
    e.preventDefault();
    
    const newExpense = {
        id: Date.now(),
        name: document.getElementById('expense-name').value,
        amount: parseFloat(document.getElementById('expense-amount').value),
        category: document.getElementById('expense-category').value,
        date: document.getElementById('expense-date').value,
        dateAdded: new Date().toISOString()
    };
    
    expenses.push(newExpense);
    saveExpenses();
    closeExpenseModal();
    // Update budget display
    // This would typically update a budget display component
    alert(`Expense of $${newExpense.amount} added for ${newExpense.name}`);
}

function addToSavings(amount) {
    savings.total += amount;
    saveSavings();
    alert(`$${amount} added to your savings. New total: $${savings.total}`);
}

// Storage Functions
function saveItems() {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
}

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function saveBudget() {
    localStorage.setItem('budget', JSON.stringify(budget));
}

function saveSavings() {
    localStorage.setItem('savings', JSON.stringify(savings));
}

// Rendering Functions
function renderItems() {
    if (!itemsContainer) return;
    
    if (wishlistItems.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    // Clear current items except the empty state
    const currentItems = itemsContainer.querySelectorAll('.item-card');
    currentItems.forEach(item => {
        if (!item.classList.contains('empty-state')) {
            item.remove();
        }
    });
    
    // Render each item
    wishlistItems.forEach(item => {
        // Calculate saved amount and progress
        const itemSavings = getSavingsForItem(item.id);
        const progress = item.price > 0 ? (itemSavings / item.price) * 100 : 0;
        const remaining = item.price - itemSavings;
        
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
            <div class="item-header">
                <span class="item-priority priority-${item.priority}">${capitalizeFirstLetter(item.priority)}</span>
                <span class="item-category">${capitalizeFirstLetter(item.category)}</span>
            </div>
            <div class="item-image" style="background-color: #eee;"></div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
                <div class="item-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>$${itemSavings.toFixed(2)} saved</span>
                        <span>${progress.toFixed(0)}%</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="action-btn edit-btn" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn add-savings-btn" data-id="${item.id}">
                        <i class="fas fa-piggy-bank"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        itemsContainer.appendChild(itemCard);
        
        // Add event listeners to the buttons
        const editBtn = itemCard.querySelector('.edit-btn');
        const addSavingsBtn = itemCard.querySelector('.add-savings-btn');
        const deleteBtn = itemCard.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => editItem(item.id));
        addSavingsBtn.addEventListener('click', () => addItemSavings(item.id));
        deleteBtn.addEventListener('click', () => deleteItem(item.id));
    });
}

// Helper Functions
function getSavingsForItem(itemId) {
    const allocation = savings.allocations.find(a => a.itemId === itemId);
    return allocation ? allocation.amount : 0;
}

function getNextAffordableItem() {
    // Find the item with the highest percentage of savings
    let highestProgress = -1;
    let nextItem = null;
    
    wishlistItems.forEach(item => {
        const itemSavings = getSavingsForItem(item.id);
        const progress = item.price > 0 ? (itemSavings / item.price) * 100 : 0;
        
        if (progress < 100 && progress > highestProgress) {
            highestProgress = progress;
            nextItem = {
                ...item,
                savings: itemSavings,
                progress: progress
            };
        }
    });
    
    return nextItem;
}

// Item Actions
function editItem(id) {
    // This would open the edit modal with the item details
    alert('Edit functionality will be implemented in a future update.');
}

function addItemSavings(id) {
    const item = wishlistItems.find(item => item.id === id);
    if (!item) return;
    
    const currentSavings = getSavingsForItem(item.id);
    const amount = parseFloat(prompt(`How much would you like to add to your savings for ${item.name}?\nCurrent: $${currentSavings.toFixed(2)} of $${item.price.toFixed(2)}`, '10'));
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    
    // Check if we already have an allocation for this item
    const allocationIndex = savings.allocations.findIndex(a => a.itemId === item.id);
    
    if (allocationIndex >= 0) {
        // Update existing allocation
        const newAmount = savings.allocations[allocationIndex].amount + amount;
        
        if (newAmount > item.price) {
            if (confirm(`This would exceed the item price. Set savings to the full price of $${item.price.toFixed(2)}?`)) {
                savings.allocations[allocationIndex].amount = item.price;
            } else {
                return;
            }
        } else {
            savings.allocations[allocationIndex].amount = newAmount;
        }
    } else {
        // Create new allocation
        savings.allocations.push({
            itemId: item.id,
            amount: Math.min(amount, item.price)
        });
    }
    
    saveSavings();
    renderItems();
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        // Remove the item
        wishlistItems = wishlistItems.filter(item => item.id !== id);
        
        // Remove any savings allocations for this item
        savings.allocations = savings.allocations.filter(a => a.itemId !== id);
        
        saveItems();
        saveSavings();
        renderItems();
    }
}

function handleSort() {
    const sortBy = sortBySelect.value;
    
    switch (sortBy) {
        case 'priority':
            wishlistItems.sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            break;
        case 'price-high':
            wishlistItems.sort((a, b) => b.price - a.price);
            break;
        case 'price-low':
            wishlistItems.sort((a, b) => a.price - b.price);
            break;
        case 'progress':
            wishlistItems.sort((a, b) => {
                const progressA = a.price > 0 ? (getSavingsForItem(a.id) / a.price) : 0;
                const progressB = b.price > 0 ? (getSavingsForItem(b.id) / b.price) : 0;
                return progressB - progressA;
            });
            break;
    }
    
    renderItems();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Sample data for initial testing
function addSampleData() {
    if (wishlistItems.length === 0) {
        wishlistItems = [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 150,
                category: "tech",
                priority: "high",
                link: "",
                notes: "Noise cancelling for work and travel",
                dateAdded: new Date().toISOString()
            },
            {
                id: 2,
                name: "New Phone",
                price: 800,
                category: "tech",
                priority: "medium",
                link: "",
                notes: "Current one is getting slow",
                dateAdded: new Date().toISOString()
            },
            {
                id: 3,
                name: "Desk Chair",
                price: 250,
                category: "home",
                priority: "medium",
                link: "",
                notes: "Better ergonomics for home office",
                dateAdded: new Date().toISOString()
            },
            {
                id: 4,
                name: "Winter Coat",
                price: 180,
                category: "clothing",
                priority: "low",
                link: "",
                notes: "For next winter season",
                dateAdded: new Date().toISOString()
            }
        ];
        
        // Sample expenses
        expenses = [
            {
                id: 101,
                name: "Groceries",
                amount: 120,
                category: "food",
                date: "2025-04-15",
                dateAdded: new Date().toISOString()
            },
            {
                id: 102,
                name: "Internet Bill",
                amount: 60,
                category: "housing",
                date: "2025-04-10",
                dateAdded: new Date().toISOString()
            },
            {
                id: 103,
                name: "Movie Tickets",
                amount: 30,
                category: "entertainment",
                date: "2025-04-05",
                dateAdded: new Date().toISOString()
            }
        ];
        
        // Sample savings allocations
        savings = {
            total: 650,
            allocations: [
                { itemId: 1, amount: 120 },
                { itemId: 2, amount: 400 },
                { itemId: 3, amount: 130 }
            ]
        };
        
        // Sample budget
        budget = {
            monthly: 1200,
            savings: 300
        };
        
        saveItems();
        saveExpenses();
        saveSavings();
        saveBudget();
        renderItems();
    }
}

// Uncomment to add sample data
// addSampleData();

// User Authentication Functions
function initUserDropdown() {
    const userBtn = document.querySelector('.user-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userBtn && dropdownMenu) {
        // Toggle dropdown on click
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
    }
}

function checkUserLogin() {
    // In a real app, this would check if the user is logged in
    // For now, we'll simulate a logged-in user
    const isLoggedIn = localStorage.getItem('isLoggedIn') || 'true';
    
    if (isLoggedIn !== 'true') {
        // Redirect to home page if not logged in
        window.location.href = 'home.html';
    }
}

function logoutUser() {
    // Clear user session
    localStorage.setItem('isLoggedIn', 'false');
    
    // Redirect to home page
    window.location.href = 'home.html';
}
