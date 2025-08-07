async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch(`/api/carts/6893def890c787ca530f7d3b/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: parseInt(quantity) })
        });

        if (response.ok) {
            alert('Producto agregado al carrito exitosamente');
        } else {
            alert('Error al agregar producto al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar producto al carrito');
    }
}

async function addToCartFromDetail(productId) {
    const quantity = document.getElementById('quantity').value;
    await addToCart(productId, quantity);
}