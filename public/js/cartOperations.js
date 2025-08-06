// Operaciones del carrito de compras
async function updateQuantity(cartId, productId) {
    try {
        const quantity = document.getElementById(`quantity-input-${productId}`).value;
        
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: parseInt(quantity) })
        });
        
        if (response.ok) {
            window.location.reload();
        } else {
            alert('Error al actualizar la cantidad');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar la cantidad');
    }
}

async function removeProduct(cartId, productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            window.location.reload();
        } else {
            alert('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
    }
}

async function clearCart(cartId) {
    if (!confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            window.location.reload();
        } else {
            alert('Error al vaciar el carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al vaciar el carrito');
    }
}