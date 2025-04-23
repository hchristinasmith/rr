document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const products = document.querySelectorAll('.product');
    let total = 0;
    let itemsInCart = new Set();

    // Make products draggable
    products.forEach(product => {
        product.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', product.dataset.productId);
            product.classList.add('dragging');
        });

        product.addEventListener('dragend', () => {
            product.classList.remove('dragging');
        });
    });

    // Drop zone event handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const productId = e.dataTransfer.getData('text/plain');
        const product = document.querySelector(`[data-product-id="${productId}"]`);
        
        if (!itemsInCart.has(productId)) {
            // Create a new draggable item in the drop zone
            const droppedItem = createDroppedItem(product, e.clientX, e.clientY);
            dropZone.appendChild(droppedItem);
            
            // Add to cart
            addToCart(product);
            itemsInCart.add(productId);
        }
    });

    function createDroppedItem(product, x, y) {
        const item = document.createElement('div');
        item.className = 'dropped-item';
        item.draggable = true;
        item.innerHTML = `
            <img src="${product.querySelector('img').src}" alt="${product.querySelector('h3').textContent}" style="width: 100px;">
            <p>${product.querySelector('h3').textContent}</p>
        `;

        // Position the item where it was dropped
        const rect = dropZone.getBoundingClientRect();
        item.style.left = `${x - rect.left - 50}px`;
        item.style.top = `${y - rect.top - 50}px`;

        // Make the dropped item draggable within the drop zone
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'moving');
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });

        return item;
    }

    function addToCart(product) {
        const price = parseFloat(product.querySelector('p').textContent.replace('$', ''));
        total += price;

        const li = document.createElement('li');
        li.textContent = `${product.querySelector('h3').textContent} - ${product.querySelector('p').textContent}`;
        cartItems.appendChild(li);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Make items draggable within the drop zone
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dropped-item.dragging');
        if (draggingItem) {
            const rect = dropZone.getBoundingClientRect();
            draggingItem.style.left = `${e.clientX - rect.left - 50}px`;
            draggingItem.style.top = `${e.clientY - rect.top - 50}px`;
        }
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (itemsInCart.size > 0) {
            alert('Thank you for your purchase! Total: ' + cartTotal.textContent);
            // Reset the cart
            cartItems.innerHTML = '';
            dropZone.innerHTML = '<p class="drop-instruction">Drag items here to create your collection</p>';
            cartTotal.textContent = '$0.00';
            total = 0;
            itemsInCart.clear();
        } else {
            alert('Your cart is empty!');
        }
    });
});
