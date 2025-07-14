// Order management
document.addEventListener('DOMContentLoaded', function() {
    // Handle order form submission
    const orderForm = document.querySelector('.form form');
    if (orderForm && window.location.pathname.includes('order.html')) {
        orderForm.addEventListener('submit', handleOrderSubmission);
        loadOrderCart();
    }

    // Load orders if on my-orders page
    if (window.location.pathname.includes('my-orders.html')) {
        loadMyOrders();
    }
});

async function handleOrderSubmission(e) {
    e.preventDefault();
    
    if (!AuthUtils.isLoggedIn()) {
        showNotification('Please login to place an order', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const name = e.target.querySelector('input[placeholder*="name"]').value;
    const phone = e.target.querySelector('input[placeholder*="phone"]').value;
    const email = e.target.querySelector('input[placeholder*="email"]').value;
    const address = e.target.querySelector('input[placeholder*="address"]').value;

    if (!name || !phone || !email || !address) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    try {
        const result = await API.createOrder({
            deliveryAddress: address,
            phone: phone
        });

        if (result.error) {
            showNotification(result.error, 'error');
            return;
        }

        showNotification('Order placed successfully!', 'success');
        
        // Redirect to success page or orders page
        setTimeout(() => {
            window.location.href = 'my-orders.html';
        }, 2000);

    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Failed to place order. Please try again.', 'error');
    }
}

async function loadOrderCart() {
    if (!AuthUtils.isLoggedIn()) return;

    try {
        const cart = await API.getCart();
        
        if (cart.error) {
            console.error('Error loading cart:', cart.error);
            return;
        }

        updateOrderTable(cart);

    } catch (error) {
        console.error('Error loading order cart:', error);
    }
}

function updateOrderTable(cart) {
    const orderTable = document.querySelector('.tbl-full');
    if (!orderTable) return;

    // Clear existing rows except header and total
    const rows = orderTable.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index > 0 && !row.querySelector('th')) {
            row.remove();
        }
    });

    // Add cart items
    cart.items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${item.image}" alt="Food"></td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><a href="#" class="btn-delete" data-cart-id="${item.id}">&times;</a></td>
        `;
        
        // Insert before total row
        const totalRow = orderTable.querySelector('tr:last-child');
        orderTable.insertBefore(row, totalRow);
    });

    // Update total
    const totalCell = orderTable.querySelector('th:nth-child(6)');
    if (totalCell) {
        totalCell.textContent = `$${cart.total}`;
    }
}

async function loadMyOrders() {
    if (!AuthUtils.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const orders = await API.getMyOrders();
        
        if (orders.error) {
            showNotification(orders.error, 'error');
            return;
        }

        displayMyOrders(orders);

    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('Failed to load orders', 'error');
    }
}

function displayMyOrders(orders) {
    // Create orders container if it doesn't exist
    let ordersContainer = document.querySelector('.orders-container');
    if (!ordersContainer) {
        ordersContainer = document.createElement('div');
        ordersContainer.className = 'orders-container';
        
        const container = document.querySelector('.container');
        if (container) {
            container.appendChild(ordersContainer);
        }
    }

    ordersContainer.innerHTML = `
        <h2 class="text-center">My Orders</h2>
        <div class="heading-border"></div>
    `;

    if (orders.length === 0) {
        ordersContainer.innerHTML += '<p class="text-center">No orders found.</p>';
        return;
    }

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
            </div>
            <div class="order-details">
                <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>Total:</strong> $${parseFloat(order.total_amount).toFixed(2)}</p>
                <p><strong>Items:</strong> ${order.items}</p>
                <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
            </div>
        `;
        
        ordersContainer.appendChild(orderDiv);
    });

    // Add styles for orders
    const style = document.createElement('style');
    style.textContent = `
        .orders-container {
            padding: 20px 0;
        }
        .order-item {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin: 20px 0;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .order-status {
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
        }
        .status-pending { background: #f39c12; color: white; }
        .status-confirmed { background: #3498db; color: white; }
        .status-delivered { background: #27ae60; color: white; }
        .status-cancelled { background: #e74c3c; color: white; }
        .order-details p {
            margin: 8px 0;
        }
    `;
    document.head.appendChild(style);
}

// Export for use in other files
window.loadMyOrders = loadMyOrders;