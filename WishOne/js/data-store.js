// Wish One Data Store
// Centralized data management for wishlist items across the application

const WishOneStore = (function() {
    // Private store
    let _wishlistItems = [];
    let _collections = [];
    let _expenses = [];
    let _budget = {
        monthly: 1200,
        savings: 300
    };
    let _savings = {
        total: 0,
        allocations: []
    };
    
    // Event system for updates
    const _events = {};
    
    // Initialize store from localStorage
    function init() {
        _wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        _collections = JSON.parse(localStorage.getItem('collections')) || [];
        _expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        _budget = JSON.parse(localStorage.getItem('budget')) || _budget;
        _savings = JSON.parse(localStorage.getItem('savings')) || _savings;
        
        // If no items exist, add sample data
        if (_wishlistItems.length === 0) {
            addSampleData();
        }
    }
    
    // Save data to localStorage
    function _saveToStorage() {
        localStorage.setItem('wishlistItems', JSON.stringify(_wishlistItems));
        localStorage.setItem('collections', JSON.stringify(_collections));
        localStorage.setItem('expenses', JSON.stringify(_expenses));
        localStorage.setItem('budget', JSON.stringify(_budget));
        localStorage.setItem('savings', JSON.stringify(_savings));
    }
    
    // Trigger event
    function _triggerEvent(eventName, data) {
        if (_events[eventName]) {
            _events[eventName].forEach(callback => callback(data));
        }
    }
    
    // Add sample data for testing
    function addSampleData() {
        // Sample wishlist items
        _wishlistItems = [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 150,
                category: "tech",
                priority: "high",
                link: "https://example.com/headphones",
                image: "https://via.placeholder.com/150",
                notes: "Noise cancelling for work and travel",
                dateAdded: new Date().toISOString()
            },
            {
                id: 2,
                name: "New Phone",
                price: 800,
                category: "tech",
                priority: "medium",
                link: "https://example.com/phone",
                image: "https://via.placeholder.com/150",
                notes: "Current one is getting slow",
                dateAdded: new Date().toISOString()
            },
            {
                id: 3,
                name: "Desk Chair",
                price: 250,
                category: "home",
                priority: "medium",
                link: "https://example.com/chair",
                image: "https://via.placeholder.com/150",
                notes: "Better ergonomics for home office",
                dateAdded: new Date().toISOString()
            },
            {
                id: 4,
                name: "Winter Coat",
                price: 180,
                category: "clothing",
                priority: "low",
                link: "https://example.com/coat",
                image: "https://via.placeholder.com/150",
                notes: "For next winter season",
                dateAdded: new Date().toISOString()
            }
        ];
        
        // Sample collections
        _collections = [
            {
                id: 1,
                name: "Home Office Setup",
                description: "Items for my ideal home office",
                items: [1, 3],
                dateCreated: new Date().toISOString(),
                isPublic: true
            },
            {
                id: 2,
                name: "Tech Upgrades",
                description: "Tech items I want to upgrade this year",
                items: [1, 2],
                dateCreated: new Date().toISOString(),
                isPublic: false
            }
        ];
        
        // Sample expenses
        _expenses = [
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
        _savings = {
            total: 650,
            allocations: [
                { itemId: 1, amount: 120 },
                { itemId: 2, amount: 400 },
                { itemId: 3, amount: 130 }
            ]
        };
        
        _saveToStorage();
        _triggerEvent('itemsUpdated', _wishlistItems);
        _triggerEvent('collectionsUpdated', _collections);
    }
    
    // Public API
    return {
        // Initialize the store
        init: init,
        
        // Event subscription
        on: function(eventName, callback) {
            if (!_events[eventName]) {
                _events[eventName] = [];
            }
            _events[eventName].push(callback);
        },
        
        // Event unsubscription
        off: function(eventName, callback) {
            if (_events[eventName]) {
                _events[eventName] = _events[eventName].filter(cb => cb !== callback);
            }
        },
        
        // Get all wishlist items
        getItems: function() {
            return [..._wishlistItems];
        },
        
        // Get a single item by ID
        getItem: function(id) {
            return _wishlistItems.find(item => item.id === id);
        },
        
        // Add a new item
        addItem: function(item) {
            // Generate a new ID if not provided
            if (!item.id) {
                const maxId = _wishlistItems.reduce((max, item) => Math.max(max, item.id), 0);
                item.id = maxId + 1;
            }
            
            // Add dateAdded if not provided
            if (!item.dateAdded) {
                item.dateAdded = new Date().toISOString();
            }
            
            _wishlistItems.push(item);
            _saveToStorage();
            _triggerEvent('itemsUpdated', _wishlistItems);
            _triggerEvent('itemAdded', item);
            
            return item;
        },
        
        // Update an existing item
        updateItem: function(id, updates) {
            const index = _wishlistItems.findIndex(item => item.id === id);
            if (index !== -1) {
                _wishlistItems[index] = { ..._wishlistItems[index], ...updates };
                _saveToStorage();
                _triggerEvent('itemsUpdated', _wishlistItems);
                _triggerEvent('itemUpdated', _wishlistItems[index]);
                return _wishlistItems[index];
            }
            return null;
        },
        
        // Delete an item
        deleteItem: function(id) {
            const index = _wishlistItems.findIndex(item => item.id === id);
            if (index !== -1) {
                const deletedItem = _wishlistItems[index];
                _wishlistItems.splice(index, 1);
                
                // Remove from collections
                _collections.forEach(collection => {
                    collection.items = collection.items.filter(itemId => itemId !== id);
                });
                
                // Remove from savings allocations
                _savings.allocations = _savings.allocations.filter(alloc => alloc.itemId !== id);
                
                _saveToStorage();
                _triggerEvent('itemsUpdated', _wishlistItems);
                _triggerEvent('itemDeleted', deletedItem);
                _triggerEvent('collectionsUpdated', _collections);
                return deletedItem;
            }
            return null;
        },
        
        // Get all collections
        getCollections: function() {
            return [..._collections];
        },
        
        // Get a single collection by ID
        getCollection: function(id) {
            return _collections.find(collection => collection.id === id);
        },
        
        // Add a new collection
        addCollection: function(collection) {
            // Generate a new ID if not provided
            if (!collection.id) {
                const maxId = _collections.reduce((max, collection) => Math.max(max, collection.id), 0);
                collection.id = maxId + 1;
            }
            
            // Add dateCreated if not provided
            if (!collection.dateCreated) {
                collection.dateCreated = new Date().toISOString();
            }
            
            _collections.push(collection);
            _saveToStorage();
            _triggerEvent('collectionsUpdated', _collections);
            _triggerEvent('collectionAdded', collection);
            
            return collection;
        },
        
        // Update an existing collection
        updateCollection: function(id, updates) {
            const index = _collections.findIndex(collection => collection.id === id);
            if (index !== -1) {
                _collections[index] = { ..._collections[index], ...updates };
                _saveToStorage();
                _triggerEvent('collectionsUpdated', _collections);
                _triggerEvent('collectionUpdated', _collections[index]);
                return _collections[index];
            }
            return null;
        },
        
        // Delete a collection
        deleteCollection: function(id) {
            const index = _collections.findIndex(collection => collection.id === id);
            if (index !== -1) {
                const deletedCollection = _collections[index];
                _collections.splice(index, 1);
                _saveToStorage();
                _triggerEvent('collectionsUpdated', _collections);
                _triggerEvent('collectionDeleted', deletedCollection);
                return deletedCollection;
            }
            return null;
        },
        
        // Add an item to a collection
        addItemToCollection: function(collectionId, itemId) {
            const collection = this.getCollection(collectionId);
            if (collection) {
                if (!collection.items.includes(itemId)) {
                    collection.items.push(itemId);
                    this.updateCollection(collectionId, { items: collection.items });
                    return true;
                }
            }
            return false;
        },
        
        // Remove an item from a collection
        removeItemFromCollection: function(collectionId, itemId) {
            const collection = this.getCollection(collectionId);
            if (collection) {
                const updatedItems = collection.items.filter(id => id !== itemId);
                if (updatedItems.length !== collection.items.length) {
                    this.updateCollection(collectionId, { items: updatedItems });
                    return true;
                }
            }
            return false;
        },
        
        // Get items in a collection
        getCollectionItems: function(collectionId) {
            const collection = this.getCollection(collectionId);
            if (collection) {
                return collection.items.map(itemId => this.getItem(itemId)).filter(Boolean);
            }
            return [];
        },
        
        // Get collections containing an item
        getItemCollections: function(itemId) {
            return _collections.filter(collection => collection.items.includes(itemId));
        },
        
        // Get budget info
        getBudget: function() {
            return { ..._budget };
        },
        
        // Update budget
        updateBudget: function(updates) {
            _budget = { ..._budget, ...updates };
            _saveToStorage();
            _triggerEvent('budgetUpdated', _budget);
            return _budget;
        },
        
        // Get savings info
        getSavings: function() {
            return { ..._savings };
        },
        
        // Update savings
        updateSavings: function(updates) {
            _savings = { ..._savings, ...updates };
            _saveToStorage();
            _triggerEvent('savingsUpdated', _savings);
            return _savings;
        },
        
        // Get savings for a specific item
        getItemSavings: function(itemId) {
            const allocation = _savings.allocations.find(alloc => alloc.itemId === itemId);
            return allocation ? allocation.amount : 0;
        },
        
        // Add savings for an item
        addItemSavings: function(itemId, amount) {
            const allocation = _savings.allocations.find(alloc => alloc.itemId === itemId);
            if (allocation) {
                allocation.amount += amount;
            } else {
                _savings.allocations.push({ itemId, amount });
            }
            _savings.total += amount;
            _saveToStorage();
            _triggerEvent('savingsUpdated', _savings);
            return this.getItemSavings(itemId);
        },
        
        // Get all expenses
        getExpenses: function() {
            return [..._expenses];
        },
        
        // Add a new expense
        addExpense: function(expense) {
            // Generate a new ID if not provided
            if (!expense.id) {
                const maxId = _expenses.reduce((max, expense) => Math.max(max, expense.id), 0);
                expense.id = maxId + 1;
            }
            
            // Add dateAdded if not provided
            if (!expense.dateAdded) {
                expense.dateAdded = new Date().toISOString();
            }
            
            _expenses.push(expense);
            _saveToStorage();
            _triggerEvent('expensesUpdated', _expenses);
            return expense;
        },
        
        // Get next affordable item
        getNextAffordableItem: function() {
            const sortedItems = [..._wishlistItems].sort((a, b) => {
                const aSavings = this.getItemSavings(a.id);
                const bSavings = this.getItemSavings(b.id);
                const aRemaining = a.price - aSavings;
                const bRemaining = b.price - bSavings;
                return aRemaining - bRemaining;
            });
            
            return sortedItems.find(item => {
                const savings = this.getItemSavings(item.id);
                return savings < item.price;
            });
        }
    };
})();

// Initialize the store when the script loads
document.addEventListener('DOMContentLoaded', function() {
    WishOneStore.init();
});
