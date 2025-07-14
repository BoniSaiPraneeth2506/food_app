// Food management
document.addEventListener('DOMContentLoaded', function() {
    loadFoods();
    
    // Handle search form
    const searchForm = document.querySelector('form[action="food-search.html"]') || 
                      document.querySelector('form[action=""]');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
});

async function loadFoods() {
    try {
        const response = await API.getFoods();
        const foods = response.foods || response; // Handle both paginated and simple response
        
        if (foods.error) {
            console.error('Error loading foods:', foods.error);
            return;
        }

        updateFoodDisplay(foods);
        
    } catch (error) {
        console.error('Error loading foods:', error);
    }
}

async function handleSearch(e) {
    e.preventDefault();
    
    const searchInput = e.target.querySelector('input[type="search"]');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    if (!searchTerm) {
        loadFoods();
        return;
    }

    try {
        const response = await API.getFoods({ search: searchTerm });
        const foods = response.foods || response; // Handle both paginated and simple response
        updateFoodDisplay(foods);
        
        // Update search result header if on search page
        const searchHeader = document.querySelector('.food-search h2');
        if (searchHeader) {
            searchHeader.innerHTML = `Foods on your search <a href="#" class="text-white">"${searchTerm}"</a>`;
        }
        
    } catch (error) {
        console.error('Error searching foods:', error);
    }
}

function updateFoodDisplay(foods) {
    const foodGrid = document.querySelector('.grid-2');
    if (!foodGrid) return;

    // Clear existing food items
    foodGrid.innerHTML = '';

    foods.forEach(food => {
        const foodBox = document.createElement('div');
        foodBox.className = 'food-menu-box';
        foodBox.innerHTML = `
            <form action="">
                <div class="food-menu-img">
                    <img src="${food.image}" alt="${food.name}" class="img-responsive img-curve">
                </div>
                <div class="food-menu-desc">
                    <h4>${food.name}</h4>
                    <p class="food-price">$${food.price.toFixed(2)}</p>
                    <p class="food-details">${food.description}</p>
                    <input type="number" value="1" min="1" data-food-id="${food.id}">
                    <input type="submit" class="btn-primary" value="Add To Cart">
                </div>
            </form>
        `;
        
        foodGrid.appendChild(foodBox);
    });
}

async function loadFoodsByCategory(category) {
    try {
        const response = await API.getFoods({ category });
        const foods = response.foods || response; // Handle both paginated and simple response
        updateFoodDisplay(foods);
        
        // Update category header
        const categoryHeader = document.querySelector('.food-search h2');
        if (categoryHeader) {
            categoryHeader.innerHTML = `Foods on <a href="#" class="text-white">"${category}"</a>`;
        }
        
    } catch (error) {
        console.error('Error loading foods by category:', error);
    }
}

// Export for use in other files
window.loadFoods = loadFoods;
window.loadFoodsByCategory = loadFoodsByCategory;