// Cart management
let cartData = { items: [], total: 0, count: 0 };

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Handle add to cart forms
    document.addEventListener('submit', handleAddToCart);
    
    // Handle cart item removal
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-delete')) {
            e.preventDefault();
            handleRemoveFromCart(e.target);
        }
    });
});

async function loadCart() {
    if (!AuthUtils.isLoggedIn()) {
        updateCartUI({ items: [], total: 0, count: 0 });
        return;
    }

    try {
        const result = await API.getCart();
        if (!result.error) {
            cartData = result;
            updateCartUI(result);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

async function handleAddToCart(e) {
    // Check if this is a food form submission
    const form = e.target;
    const addToCartBtn = form.querySelector('input[value="Add To Cart"]');
    
    if (!addToCartBtn) return;
    
    e.preventDefault();
    
    if (!AuthUtils.isLoggedIn()) {
        showNotification('Please login to add items to cart', 'error');
        return;
    }

    const quantityInput = form.querySelector('input[type="number"]');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    // Get food ID from the form or image source
    const foodImg = form.querySelector('img');
    let foodId = 1; // Default
    
    if (foodImg) {
        const imgSrc = foodImg.src;
        if (imgSrc.includes('p1.jpg')) foodId = 1;
        else if (imgSrc.includes('s1.jpg')) foodId = 2;
        else if (imgSrc.includes('b1.jpg')) foodId = 3;
    }

    try {
        const result = await API.addToCart(foodId, quantity);
        
        if (result.error) {
            showNotification(result.error, 'error');
            return;
        }

        showNotification('Item added to cart!', 'success');
        loadCart(); // Refresh cart
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add item to cart', 'error');
    }
}

async function handleRemoveFromCart(deleteBtn) {
    if (!AuthUtils.isLoggedIn()) return;

    const cartId = deleteBtn.dataset.cartId;
    if (!cartId) {
        // For static cart items, just remove the row
        deleteBtn.closest('tr').remove();
        return;
    }

    try {
        const result = await API.removeFromCart(cartId);
        
        if (result.error) {
            showNotification(result.error, 'error');
            return;
        }

        showNotification('Item removed from cart', 'success');
        loadCart(); // Refresh cart
        
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Failed to remove item', 'error');
    }
}

function updateCartUI(cart) {
    // Update cart badge
    const badge = document.querySelector('.badge');
    if (badge) {
        badge.textContent = cart.count || 0;
    }

    // Update cart content
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    const cartTable = cartContent.querySelector('.cart-table tbody') || cartContent.querySelector('.cart-table');
    if (!cartTable) return;

    // Clear existing items (except header)
    const rows = cartTable.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index > 0 && !row.querySelector('th')) { // Keep header and total row
            row.remove();
        }
    });

    // Add cart items
    cart.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="Food"></td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><a href="#" class="btn-delete" data-cart-id="${item.id}">&times;</a></td>
        `;
        
        // Insert before total row
        const totalRow = cartTable.querySelector('tr:last-child');
        cartTable.insertBefore(row, totalRow);
    });

    // Update total
    const totalCell = cartTable.querySelector('th:nth-child(5)');
    if (totalCell) {
        totalCell.textContent = `$${cart.total}`;
    }
}

// Export for use in other files
window.loadCart = loadCart;
window.cartData = cartData;