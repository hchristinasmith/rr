// Login page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = passwordInput.value;
            const rememberMe = document.getElementById('remember').checked;
            
            // In a real application, this would validate credentials with a server
            // For now, we'll simulate a successful login
            if (email && password) {
                // Set login status in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                
                // Store user info if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('userEmail', email);
                } else {
                    localStorage.removeItem('userEmail');
                }
                
                // Show success message
                alert('Login successful! Redirecting to your dashboard...');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500);
            } else {
                alert('Please enter both email and password.');
            }
        });
    }
    
    // Toggle password visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Auto-fill email if remembered
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = savedEmail;
            document.getElementById('remember').checked = true;
        }
    }
});
