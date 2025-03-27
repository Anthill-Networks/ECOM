class CategoryRepository {
    constructor(db) {
      this.db = db;
      this.collection = this.db.collection('categories');
    }

    static getCurrentISODate() {
      return new Date().toISOString();
    }
  
    async createCategory(data) {
      data.createdAt = CategoryRepository.getCurrentISODate();
      data.updatedAt = CategoryRepository.getCurrentISODate();
      const { id } = data;

      // Use a batch write to improve performance
      const batch = this.db.batch();
      const companyRef = this.collection.doc(id);
      batch.set(companyRef, data);
      await batch.commit();
      return { id, ...data };
    }
  
    async getCategoryById(id) {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('Category not found');
      }
    }

    //list withou pagination
    async getAllCategories(query) {
      let ref = this.collection;
      if (query.name) {
          ref = ref.where('name', '==', query.name);
      }
      if (query.company_id) {
          ref = ref.where('company_id', '==', query.company_id);
      }

      if (query.is_active) {
          ref = ref.where('is_active', '==', query.is_active);
      }


      const snapshot = await ref.get();
      const categories = [];
      snapshot.forEach(doc => {
          categories.push({ id: doc.id, ...doc.data() });
      });
      return categories;  // Return the list of categories
  }
  
  // Function to count total records
  async getTotalRecords(query) {
      let ref = this.collection;
      if (query.name) {
          ref = ref.where('name', '==', query.name);
      }
      const snapshot = await ref.get();
      return snapshot.size; // Return the total number of records
  }
  
  
    async updateCategory(id, data) {
      data.updatedAt = new Date();
      const docRef = this.collection.doc(id);
      await docRef.update(data);
      const updatedCategory = await docRef.get();
      return { id: updatedCategory.id, ...updatedCategory.data() };
    }
  
    async deleteCategory(id) {
      const docRef = this.collection.doc(id);
      await docRef.delete();
      return { id, message: 'Category deleted successfully' };
    }

    //updateProductCategory
    async updateProductCategory(id, data) {
      // Reference to the products with the specified category_id
      const productRef = this.db.collection('ecom_products').where('category_id', '==', id);
      const snapshot = await productRef.get();
  
      // Check if any products were found
      if (snapshot.empty) {
        console.log("Empty")
          return { message: 'No products found for this category' };
      }
  
      const batch = this.db.batch(); // Create a batch operation
  
      // Loop through the documents in the snapshot
      snapshot.forEach(doc => {
        console.log(snapshot)
          const productDocRef = this.db.collection('ecom_products').doc(doc.id);
          batch.update(productDocRef, { is_category_active: data }); // Queue the update
      });
  
      // Commit the batch operation
      await batch.commit();
  
      return { message: 'Category updated successfully' };
  }
  
    
  }
  
module.exports = CategoryRepository;
  