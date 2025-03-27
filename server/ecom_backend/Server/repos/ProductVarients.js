class ProductvarientRepository {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('ecom_Productvarients');
    }

    static getCurrentISODate() {
        return new Date().toISOString();
    }

    // Create a new Productvarient
    async createProductvarient(data) {
        // Set createdAt and updatedAt timestamps
        data.created_at = ProductvarientRepository.getCurrentISODate();
        data.updated_at = ProductvarientRepository.getCurrentISODate();

        // Reference for the new Productvarient document
        const ProductvarientRef = this.collection.doc(data.id); // Use data.id for document ID

        // Set the document data
        await ProductvarientRef.set(data);

        // Return the created Productvarient data
        return { id: data.id, ...data };
    }

    // Get a Productvarient by ID
    async getProductvarientById(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            throw new Error('Productvarient not found');
        }
    }

    // Get all Productvarients by category ID with pagination
    async getAllProductvarients(query) {
        let baseQuery = this.collection;

        // Filter by name if provided
        if (query.name) {
            baseQuery = baseQuery.where('name', '==', query.name);
        }

  
        if (query.product_id){
            baseQuery = baseQuery.where('product_id', '==', query.product_id);
        }

        if (query.company_id){
            baseQuery = baseQuery.where('company_id', '==', query.company_id);
        }

        // Pagination
        const page = query.page || 1;
        const limit = query.limit || 10;

        // Initialize an array for Productvarients
        const Productvarients = [];
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
                Productvarients.push({ id: doc.id, ...doc.data() });
            });
        } catch (error) {
            console.error("Error fetching Productvarients:", error);
            throw new Error('Error fetching Productvarients');
        }

        // Pagination details
        const totalRecords = await this.getTotalProductvarientsByCategory(query.categoryId);
        const totalPages = Math.ceil(totalRecords / limit);
        const currentPage = page;

        const pagination = { totalRecords, totalPages, currentPage };

        return { pagination , Productvarients};
    }

    // Function to count total Productvarients by category
    async getTotalProductvarientsByCategory(categoryId) {
        if(!categoryId) {
            const snapshot = await this.collection.get();
            return snapshot.size; // Return the total number of records
        }
        const snapshot = await this.collection.where('categoryId', '==', categoryId).get();
        return snapshot.size; // Return the total number of records
    }

    // Update a Productvarient by ID
    async updateProductvarient(id, data) {
        data.updated_at = ProductvarientRepository.getCurrentISODate();
        const docRef = this.collection.doc(id);
        await docRef.update(data);
        const updatedProductvarient = await docRef.get();
        return { id: updatedProductvarient.id, ...updatedProductvarient.data() };
    }

    // Delete a Productvarient by ID
    async deleteProductvarient(id) {
        const docRef = this.collection.doc(id);
        await docRef.delete();
        return { id, message: 'Productvarient deleted successfully' };
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

module.exports = ProductvarientRepository;