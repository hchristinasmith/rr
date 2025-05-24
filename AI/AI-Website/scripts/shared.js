// Add this function to determine the correct path to index.html
function getHomePath() {
    // Check if we're in a subdirectory (Tabs)
    const isInSubdirectory = window.location.pathname.includes('/Tabs/');
    return isInSubdirectory ? '../index.html' : 'index.html';
}

// Header HTML template
const headerTemplate = `
    <header>
        <nav>
            <div class="logo">
                <a href="${getHomePath()}" class="home-link">Arthur's Innocence</a>
            </div>
            
            <div class="nav-container">
                <div class="left-nav">
                    <a href="/Tabs/new-arrivals.html">New Arrivals</a>
                    <a href="/Tabs/shop.html">Shop</a>
                    <a href="/Tabs/collections.html">Collections</a>
                    <a href="/Tabs/on-the-gram.html">On The Gram</a>
                    <a href="/Tabs/our-story.html">Our Story</a>
                </div>

                <div class="right-nav">
                    <a href="/Tabs/from-bed-to-body.html">From Bed to Body</a>
                    <a href="/Tabs/sale.html">Sale</a>
                    <svg class="digital-flower" viewBox="0 0 100 100">
                        <g fill="none" stroke="#3d3d3d" stroke-width="1.5">
                            <path d="M50 20C52 10 48 10 50 20M50 80C52 90 48 90 50 80M20 50C10 52 10 48 20 50M80 50C90 52 90 48 80 50"/>
                            <path d="M35 35C28 28 32 28 35 35M65 65C72 72 68 72 65 65M35 65C28 72 32 72 35 65M65 35C72 28 68 28 65 35"/>
                            <path d="M50 35C55 35 55 25 50 25S45 35 50 35zM50 75C55 75 55 65 50 65S45 75 50 75zM35 50C35 55 25 55 25 50S35 45 35 50zM75 50C75 55 65 55 65 50S75 45 75 50z"/>
                        </g>
                        <circle cx="50" cy="50" r="4" fill="#3d3d3d"/>
                    </svg>
                    <div class="account-container">
                        <a href="/Tabs/account.html" class="nav-icon" title="Account"><i class="fas fa-user"></i></a>
                        <span class="account-name"></span>
                    </div>
                    <div class="cart-container">
                        <a href="/Tabs/cart.html" class="nav-icon" title="Cart">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count">0</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </header>
`;

// Initialize header
function initializeHeader() {
    document.body.insertAdjacentHTML('afterbegin', headerTemplate);
    initializeScrollBehavior();
    updateCartCount();
    checkAccountStatus();
    
    // Add click handler for logo
    const logoLink = document.querySelector('.home-link');
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = getHomePath();
    });
}

// Scroll behavior
function initializeScrollBehavior() {
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        const header = document.querySelector('header');
        const logo = document.querySelector('.logo');
        const scrollPosition = window.scrollY;
        const maxScroll = 100;

        if (scrollPosition <= maxScroll) {
            const moveDownAmount = scrollPosition * 0.5;
            logo.style.transform = `translate(0, ${moveDownAmount}px)`;
            
            if (scrollPosition === maxScroll) {
                nav.classList.add('scrolled');
                header.classList.add('scrolled');
            }
        } else {
            logo.style.transform = `translate(0, ${maxScroll * 0.5}px)`;
            nav.classList.add('scrolled');
            header.classList.add('scrolled');
        }

        if (scrollPosition === 0) {
            nav.classList.remove('scrolled');
            header.classList.remove('scrolled');
            logo.style.transform = 'translate(0, 0)';
        }
    });
}

// Cart functionality
function updateCartCount() {
    const cartCount = localStorage.getItem('cartCount') || 0;
    document.querySelector('.cart-count').textContent = cartCount;
}

// Account functionality
function checkAccountStatus() {
    const user = localStorage.getItem('currentUser');
    const accountName = document.querySelector('.account-name');
    
    if (user) {
        const userData = JSON.parse(user);
        accountName.textContent = userData.name || '';
    } else {
        // Only redirect if we're on the dashboard page
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'account.html';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeHeader); 