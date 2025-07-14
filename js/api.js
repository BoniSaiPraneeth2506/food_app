// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Auth utilities
const AuthUtils = {
    getToken() {
        return localStorage.getItem('authToken');
    },

    setToken(token) {
        localStorage.setItem('authToken', token);
    },

    removeToken() {
        localStorage.removeItem('authToken');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    removeUser() {
        localStorage.removeItem('user');
    },

    isLoggedIn() {
        return !!this.getToken();
    },

    logout() {
        this.removeToken();
        this.removeUser();
        window.location.href = 'login.html';
    }
};

// API calls
const API = {
    // Auth endpoints
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        return response.json();
    },

    async getProfile() {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${AuthUtils.getToken()}`
            }
        });
        return response.json();
    },

    // Food endpoints
    async getFoods(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/food?${queryString}`);
        return response.json();
    },

    async getFood(id) {
        const response = await fetch(`${API_BASE_URL}/food/${id}`);
        return response.json();
    },

    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/food/categories/all`);
        return response.json();
    },

    // Cart endpoints
    async getCart() {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: {
                'Authorization': `Bearer ${AuthUtils.getToken()}`
            }
        });
        return response.json();
    },

    async addToCart(foodId, quantity = 1) {
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthUtils.getToken()}`
            },
            body: JSON.stringify({ foodId, quantity })
        });
        return response.json();
    },

    async updateCartItem(cartId, quantity) {
        const response = await fetch(`${API_BASE_URL}/cart/update/${cartId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthUtils.getToken()}`
            },
            body: JSON.stringify({ quantity })
        });
        return response.json();
    },

    async removeFromCart(cartId) {
        const response = await fetch(`${API_BASE_URL}/cart/remove/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthUtils.getToken()}`
            }
        });
        return response.json();
    },

    async clearCart() {
        const response = await fetch(`${API_BASE_URL}/cart/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthUtils.getToken()}`
            }
        });
        return response.json();
    },

    // Order endpoints
    async createOrder(orderData) {
        const response = await fetch(`${API_BASE_URL}/orders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthUtils.getToken()}`
            },
            body: JSON.stringify(orderData)
        });
        return response.json();
    },

    async getMyOrders() {
        const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
            headers: {
                'Authorization': `Bearer ${AuthUtils.getToken()}`
            }
        });
        return response.json();
    },

    async getOrder(orderId) {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${AuthUtils.getToken()}`
            }
        });
        return response.json();
    }
};

// Export for use in other files
window.API = API;
window.AuthUtils = AuthUtils;