// Authentication handling
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    
    // Handle login form
    const loginForm = document.querySelector('form[action=""]');
    if (loginForm && window.location.pathname.includes('login.html')) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
        const result = await API.login({ email, password });
        
        if (result.error) {
            showNotification(result.error, 'error');
            return;
        }

        AuthUtils.setToken(result.token);
        AuthUtils.setUser(result.user);
        
        showNotification('Login successful!', 'success');
        
        // Redirect to home page after short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

function handleLogout() {
    AuthUtils.logout();
}

function updateAuthUI() {
    const isLoggedIn = AuthUtils.isLoggedIn();
    const user = AuthUtils.getUser();
    
    // Update navigation menu
    const loginLink = document.querySelector('a[href="login.html"]');
    if (loginLink) {
        if (isLoggedIn) {
            loginLink.textContent = `Hi, ${user.name}`;
            loginLink.href = '#';
            loginLink.onclick = (e) => {
                e.preventDefault();
                showUserMenu();
            };
        } else {
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
        }
    }
}

function showUserMenu() {
    const user = AuthUtils.getUser();
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-content">
            <p>Welcome, ${user.name}!</p>
            <a href="my-orders.html">My Orders</a>
            <a href="#" onclick="AuthUtils.logout()">Logout</a>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .user-menu {
            position: fixed;
            top: 70px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            padding: 10px;
            min-width: 150px;
        }
        .user-menu-content a {
            display: block;
            padding: 5px 0;
            text-decoration: none;
            color: #333;
        }
        .user-menu-content a:hover {
            color: #6c5ce7;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(menu);
    
    // Remove menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function removeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        });
    }, 100);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
        .notification-success { background: #27ae60; }
        .notification-error { background: #e74c3c; }
        .notification-info { background: #3498db; }
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}