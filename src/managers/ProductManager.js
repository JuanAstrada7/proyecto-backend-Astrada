const Product = require('../models/Product');

class ProductManager {
    async getProducts(options = {}) {
        const {
            limit = 10,
            page = 1,
            sort,
            query = {}
        } = options;

        let filterQuery = {};

        if (query.category) {
            filterQuery.category = query.category;
        }

        if (query.status !== undefined) {
            filterQuery.status = query.status === 'true' || query.status === true;
        }

        const queryOptions = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit)
        };

        if (sort) {
            const sortOrder = sort === 'asc' ? 1 : -1;
            queryOptions.sort = { price: sortOrder };
        }

        try {
            const products = await Product.find(filterQuery)
                .limit(queryOptions.limit)
                .skip(queryOptions.skip)
                .sort(queryOptions.sort || {});

            const totalDocs = await Product.countDocuments(filterQuery);
            const totalPages = Math.ceil(totalDocs / queryOptions.limit);

            const baseUrl = '/api/products';
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;

            const prevLink = prevPage
                ? `${baseUrl}?page=${prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query.category ? `&query[category]=${query.category}` : ''}${query.status !== undefined ? `&query[status]=${query.status}` : ''}`
                : null;

            const nextLink = nextPage
                ? `${baseUrl}?page=${nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query.category ? `&query[category]=${query.category}` : ''}${query.status !== undefined ? `&query[status]=${query.status}` : ''}`
                : null;

            return {
                status: 'success',
                payload: products,
                totalPages,
                prevPage,
                nextPage,
                page: parseInt(page),
                hasPrevPage: prevPage !== null,
                hasNextPage: nextPage !== null,
                prevLink,
                nextLink
            };
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al obtener producto: ${error.message}`);
        }
    }

    async addProduct(productData) {
        try {
            const newProduct = new Product(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw new Error(`Error al agregar producto: ${error.message}`);
        }
    }

    async updateProduct(id, updateData) {
        try {
            const product = await Product.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product;
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}

module.exports = ProductManager;