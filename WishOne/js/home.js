// Home page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Handle signup form submission
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // In a real application, this would send the data to a server
                // For now, we'll just simulate success and redirect to the app
                alert('Thanks for signing up! Redirecting to your new account...');
                
                // Clear the form
                emailInput.value = '';
                
                // Redirect to the app page after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }
    
    // Add header background on scroll
    const header = document.querySelector('.home-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'white';
                header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
            } else {
                header.style.backgroundColor = 'transparent';
                header.style.boxShadow = 'none';
            }
        });
    }
});
