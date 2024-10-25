
const PRODUCTS = [
    {
        id: 1,
        imageSrc: "./public/chicken.png",
        name: "Chicken",
        price: "69$",
        description: "Chicken Fajitas served with rice, beans, tortillas, guacamole, salsa, and sour cream."
    },
    {
        id: 2,
        imageSrc: "./public/fajitas.png",
        name: "Fajitas",
        price: "169$",
        description: "Fajitas served with rice, beans, guacamole, salsa, and sour cream."
    },
    {
        id: 3,
        imageSrc: "./public/chicken_masala.png",
        name: "Chicken Masala",
        price: "269$",
        description: "Chicken Masala served with vegetables, rice, and traditional spices."
    }
];


const CART_ITEMS = [];



function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("translate-x-full");
}

window.addEventListener('DOMContentLoaded', (_event) => {
    const productContainer = document.querySelector('.product_container');
    const sidebarItemsContainer = document.getElementById('sidebar_product__container');
    const totalPriceElement = document.querySelector('.total_price');
    const sidebar = document.getElementById("sidebar");
    const closeSidebarButton = document.querySelector('.close');
    const sidebarTotalProducts = document.getElementById('sidebar_total_products');
    const totalCartItem = document.getElementById('total_cart_item');

    totalCartItem.textContent = '0';
    sidebarTotalProducts.textContent = '0 item';

    // Function to update the total price
    function updateTotalPrice() {
        const totalPrice = CART_ITEMS.reduce((acc, item) => {
            return acc + (item.pricePerItem * item.quantity);
        }, 0);
        totalPriceElement.textContent = `${totalPrice.toFixed(2)}$`;
    }

    // Function to update cart count and total products
    function updateCartCount() {
        sidebarTotalProducts.textContent = CART_ITEMS.length > 1 ? `${CART_ITEMS.length} items` : `${CART_ITEMS.length} item`;
        totalCartItem.textContent = CART_ITEMS.length;
    }

    // Function to render cart items
    function renderCartItems() {
        sidebarItemsContainer.innerHTML = '';

        CART_ITEMS.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'relative flex items-end justify-between border-white border-2 p-2 rounded-md mb-2'; // Added margin for spacing

            cartItem.innerHTML = `
            <div class="flex gap-4">
                <img src="${item.imageSrc}" alt="${item.name}" class="w-[50px] h-[90px] object-contain rounded-md" />
                <div>
                    <p class="text-md font-semibold text-white">${item.name}</p>
                    <p class="text-sm text-white">${item.price}/each</p>
                    <div class="flex justify-around items-center">
                        <button class="py-1 px-2 bg-gray-200 rounded-md decrement">-</button>
                        <span class="px-4 py-[1px] bg-white item_quantity">${item.quantity || 1}</span>
                        <button class="py-1 px-1 bg-gray-200 rounded-md increment">+</button>
                    </div>
                </div>
            </div>
            <div class="inline-flex items-end text-white sidebar_indivisual_item_price">${(item.pricePerItem * (item.quantity || 1)).toFixed(2)}$</div>
            <button class="absolute top-[-10px] right-[-10px] bg-white rounded-lg delete-item">
                <img src="./public/delete.png" alt="Delete" />
            </button>
        `;

            sidebarItemsContainer.appendChild(cartItem);

            const quantityElement = cartItem.querySelector('.item_quantity');
            const itemPriceElement = cartItem.querySelector('.sidebar_indivisual_item_price');
            let quantity = item.quantity || 1;
            const pricePerItem = parseFloat(item.price.replace('$', ''));

            // Handle increment button click
            cartItem.querySelector('.increment').addEventListener('click', () => {
                quantity++;
                item.quantity = quantity;
                quantityElement.textContent = quantity;
                itemPriceElement.textContent = `${(pricePerItem * quantity).toFixed(2)}$`; // Update price
                updateTotalPrice();
            });

            // Handle decrement button click
            cartItem.querySelector('.decrement').addEventListener('click', () => {
                if (quantity > 1) {
                    quantity--;
                    item.quantity = quantity;
                    quantityElement.textContent = quantity;
                    itemPriceElement.textContent = `${(pricePerItem * quantity).toFixed(2)}$`; // Update price
                    updateTotalPrice();
                }
            });

            // Handle delete button click
            cartItem.querySelector('.delete-item').addEventListener('click', () => {
                const index = CART_ITEMS.indexOf(item);
                if (index !== -1) {
                    CART_ITEMS.splice(index, 1);
                    renderCartItems();
                    updateTotalPrice();
                    updateCartCount();


                    const productButton = document.querySelector(`button[data-id="${item.id}"]`);
                    if (productButton) {
                        productButton.disabled = false;
                        productButton.classList.remove('bg-gray-400');
                        productButton.classList.add('bg-[#fd5442]');
                        productButton.textContent = 'Add to Cart';
                    }
                }
            });
        });

        updateTotalPrice();
        updateCartCount();
    }

    // Function to handle adding items to the cart
    PRODUCTS.forEach(product => {

        const productParentContainer = document.createElement('div');
        productParentContainer.className = `bg-white rounded-lg shadow-lg p-4 text-left data-id = ${product.id}`;

        const img = document.createElement('img');
        img.src = product.imageSrc;
        img.alt = product.name;
        img.className = 'w-full h-[120px] object-cover rounded-t-lg';
        productParentContainer.appendChild(img);

        const h3 = document.createElement('h3');
        h3.className = 'text-lg font-bold mt-2';
        h3.textContent = product.name;
        productParentContainer.appendChild(h3);

        const price = document.createElement('p');
        price.className = 'text-gray-500';
        price.textContent = `${product.price} each`;
        productParentContainer.appendChild(price);

        const description = document.createElement('p');
        description.className = 'text-sm text-gray-500 mt-2';
        description.textContent = product.description;
        productParentContainer.appendChild(description);

        const addToCartButton = document.createElement('button');
        addToCartButton.className = 'mt-4 bg-[#fd5442] text-white w-full py-2 rounded-lg';
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.dataset.id = product.id;
        productParentContainer.appendChild(addToCartButton);

        addToCartButton.addEventListener('click', () => {
            if (!CART_ITEMS.some(item => item.id === product.id)) {
                CART_ITEMS.push({
                    ...product,
                    quantity: 1,
                    pricePerItem: parseFloat(product.price.replace('$', ''))
                });
                renderCartItems();

                addToCartButton.disabled = true;
                addToCartButton.classList.add('bg-gray-400');
                addToCartButton.classList.remove('bg-[#fd5442]');
                addToCartButton.textContent = 'Already in Cart';

                sidebar.classList.remove("translate-x-full");
            }
        });

        // Create and append "Customize" button
        const customizeButton = document.createElement('button');
        customizeButton.className = 'mt-2 border border-[#fd5442] text-[#fd5442] w-full py-2 rounded-lg';
        customizeButton.textContent = 'Customize';
        productParentContainer.appendChild(customizeButton);


        productContainer.appendChild(productParentContainer);
    });


    closeSidebarButton.addEventListener('click', () => {
        sidebar.classList.add("translate-x-full");
    });
});
