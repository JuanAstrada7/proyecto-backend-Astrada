# proyecto-backend-Astrada

# F1 Toys Store

Tienda de juguetes de Fórmula 1 con sistema completo de gestión de productos, carritos y WebSockets en tiempo real.

## Instalación Rápida

# Clonar repositorio
git clone
cd proyecto-backend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

**Servidor corriendo en:** http://localhost:8080

## Endpoints

- `/` | **Home** - Productos con filtros |
- `/products/:id` | **Detalle** de producto |
- `/carts/:id` | **Carrito** específico |
- `/realtimeproducts` | **Gestión** en tiempo real |
- `/api/products` | **API** de productos |
- `/api/carts` | **API** de carritos |

## Funcionalidades Principales

**Gestión de Productos**
- Filtros avanzados (categoría, precio, disponibilidad)
- Búsqueda por texto
- Paginación profesional
- Ordenamiento por precio
- CRUD completo

**Sistema de Carritos**
- Agregar/eliminar productos
- Actualizar cantidades
- Gestión de stock
- Carritos persistentes

**Características Técnicas**
- WebSockets en tiempo real
- API REST completa
- MongoDB con Mongoose
- Diseño responsive
- Handlebars templates

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- Handlebars + CSS3
- Socket.IO

**F1 Toys Store**