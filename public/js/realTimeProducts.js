const socket = io();

const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');
const productsList = document.getElementById('productsList');

socket.on('productAdded', (product) => {
    console.log('Nuevo producto agregado:', product);
    addProductToDOM(product);
});

socket.on('productDeleted', (productId) => {
    console.log('Producto eliminado:', productId);
    removeProductFromDOM(productId);
});

socket.on('productsUpdated', (products) => {
    console.log('Lista de productos actualizada:', products);
    updateProductsList(products);
});

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(addProductForm);
    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        status: true
    };

    socket.emit('addProduct', product);

    addProductForm.reset();
});

deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productId = parseInt(document.getElementById('deleteId').value);

    socket.emit('deleteProduct', productId);

    deleteProductForm.reset();
});

function addProductToDOM(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-id', product.id);

    productCard.innerHTML = `
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p><strong>Código:</strong> ${product.code}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <p><strong>Categoría:</strong> ${product.category}</p>
        <p><strong>Estado:</strong> ${product.status ? '✅ Disponible' : '❌ No disponible'}</p>
    `;

    productsList.appendChild(productCard);
}

function removeProductFromDOM(productId) {
    const productCard = document.querySelector(`[data-id="${productId}"]`);
    if (productCard) {
        productCard.remove();
    }
}

function updateProductsList(products) {
    productsList.innerHTML = '';
    products.forEach(product => {
        addProductToDOM(product);
    });
}