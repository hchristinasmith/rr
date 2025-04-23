// Room to Roam Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        menuToggle.classList.remove('active');
                    }
                    
                    // Scroll to the element
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const project = document.getElementById('project').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real implementation, you would send this data to a server
            // For now, just show a success message
            contactForm.innerHTML = `
                <div class="success-message">
                    <h3>Thank you for reaching out!</h3>
                    <p>We've received your message and will get back to you soon.</p>
                </div>
            `;
        });
    }
    
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .pillar, .process-step, .client-type');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add CSS for the mobile menu and scroll animations
    const style = document.createElement('style');
    style.textContent = `
        @media screen and (max-width: 768px) {
            nav {
                position: fixed;
                top: 80px;
                left: 0;
                width: 100%;
                background-color: var(--background-color);
                padding: 20px;
                box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                transform: translateY(-100%);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 999;
            }
            
            nav.active {
                transform: translateY(0);
                opacity: 1;
            }
            
            nav ul {
                flex-direction: column;
                align-items: center;
            }
            
            nav ul li {
                margin: 10px 0;
            }
            
            .menu-toggle.active i::before {
                content: "\\f00d";
            }
        }
        
        header.scrolled {
            padding: 10px 0;
            background-color: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .service-card, .pillar, .process-step, .client-type {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .service-card.visible, .pillar.visible, .process-step.visible, .client-type.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .success-message {
            text-align: center;
            padding: 40px 20px;
            background-color: rgba(0, 0, 0, 0.05);
            border-radius: var(--border-radius);
            animation: fadeIn 0.5s ease-out forwards;
        }
    `;
    
    document.head.appendChild(style);
});
