const Product = require('../models/Product');

class ProductManager {
    async getProducts(options = {}) {

        console.log('ProductManager recibió options:', JSON.stringify(options, null, 2));

        const {
            limit = 10,
            page = 1,
            sort,
            query = {}
        } = options;

        console.log('Query procesado:', JSON.stringify(query, null, 2));

        let filterQuery = {};

        if (query.category) {
            console.log('Aplicando filtro de categoría:', query.category);
            filterQuery.category = new RegExp(query.category, 'i');
        }

        if (query.status !== undefined) {
            console.log('Aplicando filtro de status:', query.status);
            filterQuery.status = query.status === 'true' || query.status === true;
        }

        if (query.minPrice || query.maxPrice) {
            filterQuery.price = {};
            if (query.minPrice) {
                filterQuery.price.$gte = parseFloat(query.minPrice);
            }
            if (query.maxPrice) {
                filterQuery.price.$lte = parseFloat(query.maxPrice);
            }
        }

        if (query.search) {
            filterQuery.$or = [
                { title: new RegExp(query.search, 'i') },
                { description: new RegExp(query.search, 'i') }
            ];
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
            const prevPage = page > 1 ? parseInt(page) - 1 : null;
            const nextPage = parseInt(page) < totalPages ? parseInt(page) + 1 : null;

            const buildQueryString = (pageNum) => {
                const params = new URLSearchParams();
                params.append('page', pageNum);
                params.append('limit', limit);

                if (sort) params.append('sort', sort);
                if (query.category) params.append('query[category]', query.category);
                if (query.status !== undefined) params.append('query[status]', query.status);
                if (query.minPrice) params.append('query[minPrice]', query.minPrice);
                if (query.maxPrice) params.append('query[maxPrice]', query.maxPrice);
                if (query.search) params.append('query[search]', query.search);

                return params.toString();
            };

            const prevLink = prevPage ? `${baseUrl}?${buildQueryString(prevPage)}` : null;
            const nextLink = nextPage ? `${baseUrl}?${buildQueryString(nextPage)}` : null;

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