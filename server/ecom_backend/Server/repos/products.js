class ProductRepository {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('ecom_products');
    }

    static getCurrentISODate() {
        return new Date().toISOString();
    }

    // Create a new product
    async createProduct(data) {
        // Set createdAt and updatedAt timestamps
        data.created_at = ProductRepository.getCurrentISODate();
        data.updated_at = ProductRepository.getCurrentISODate();

        // Reference for the new product document
        const productRef = this.collection.doc(data.id); // Use data.id for document ID

        // Set the document data
        await productRef.set(data);

        // Return the created product data
        return { id: data.id, ...data };
    }

    // Get a product by ID
    async getProductById(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            throw new Error('Product not found');
        }
    }

    // Get all products by category ID with pagination
    async getAllProducts(query) {
        let baseQuery = this.collection;

        // Filter by name if provided
        if (query.name) {
            baseQuery = baseQuery.where('name', '==', query.name);
        }

        // Filter by company_id if provided
        if (query.company_id) {
            baseQuery = baseQuery.where('company_id', '==', query.company_id);
        }

        // Filter by category if provided
        if (query.categoryId) {
            baseQuery = baseQuery.where('categoryId', '==', query.categoryId);
        }

        // Pagination
        const page = query.page || 1;
        const limit = query.limit || 10;

        // Initialize an array for products
        const products = [];
        let snapshot;

        // Fetch documents for the current page
        try {
            if (page > 1) {
                // Get the last document from the previous page
                const previousSnapshot = await baseQuery.limit((page - 1) * limit).get();
                if (previousSnapshot.docs.length > 0) {
                    const lastDoc = previousSnapshot.docs[previousSnapshot.docs.length - 1];
                    baseQuery = baseQuery.startAfter(lastDoc);
                }
            }

            snapshot = await baseQuery.limit(limit).get();
            snapshot.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
                //fetch all vsrient
                
            });
        } catch (error) {
            console.error("Error fetching Products:", error);
            throw new Error('Error fetching Products');
        }

        // Pagination details
        const totalRecords = await this.getTotalProductsByCategory(query.categoryId);
        const totalPages = Math.ceil(totalRecords / limit);
        const currentPage = page;

        const pagination = { totalRecords, totalPages, currentPage };

        return { pagination , products};
    }

    // Function to count total products by category
    async getTotalProductsByCategory(categoryId) {
        if(!categoryId) {
            const snapshot = await this.collection.get();
            return snapshot.size; // Return the total number of records
        }
        const snapshot = await this.collection.where('categoryId', '==', categoryId).get();
        return snapshot.size; // Return the total number of records
    }

    // Update a product by ID
    async updateProduct(id, data) {
        data.updated_at = ProductRepository.getCurrentISODate();
        const docRef = this.collection.doc(id);
        await docRef.update(data);
        const updatedProduct = await docRef.get();
        return { id: updatedProduct.id, ...updatedProduct.data() };
    }

    // Delete a product by ID
    async deleteProduct(id) {
        const docRef = this.collection.doc(id);
        await docRef.delete();
        return { id, message: 'Product deleted successfully' };
    }

    // Get category by ID
    async getCategoryById(id) {
        const docRef = this.db.collection('categories').doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            throw new Error('Category not found');
        }
    }
}

module.exports = ProductRepository;