class CompanyRepository {
  constructor(dbConnection) {
    this.db = dbConnection; // Your database connection
  }

  // Utility to get current ISO date
  static getCurrentISODate() {
    return new Date().toISOString();
  }

  async createCompany(data) {
    try {
      // Set timestamps as ISO strings
      data.createdAt = CompanyRepository.getCurrentISODate();
      data.updatedAt = CompanyRepository.getCurrentISODate();
      const { id } = data;

      // Use a batch write to improve performance
      const batch = this.db.batch();
      const companyRef = this.db.collection('companies').doc(id);
      batch.set(companyRef, data);
      await batch.commit();
      return { id, ...data };
    } catch (error) {
      console.error("Error creating company: ", error);
      throw new Error("Failed to create company");
    }
  }

  async getCompanyById(companyId) {
    try {
      const doc = await this.db.collection('companies').doc(companyId).get();
      if (!doc.exists) {
        throw new Error("Company not found");
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error("Error fetching company: ", error);
      throw new Error("Failed to fetch company");
    }
  }
 
  //get all companies
  async getAllCompanies(query) {
    let ref = this.db.collection('companies');
    // Apply filters if provided

    const snapshot = await ref.get();
    const companies = [];
    snapshot.forEach(doc => {
      companies.push({ id: doc.id, ...doc.data() });
    });
    return companies;
  }
  

  async getTotalRecords(query) {
    let ref = this.db.collection('companies');

    // Apply filters if provided
    if (query.name) {
      ref = ref.where('name', '==', query.name);
    }
    if (query.categoryId) {
      ref = ref.where('categoryId', '==', query.categoryId);
    }

    const snapshot = await ref.get();
    return snapshot.size;
  }



  async updateCompany(companyId, updatedData) {
    try {
      updatedData.updatedAt = CompanyRepository.getCurrentISODate(); // Set updatedAt to current date
      await this.db.collection('companies').doc(companyId).update(updatedData);
      return { id: companyId, ...updatedData };
    } catch (error) {
      console.error("Error updating company: ", error);
      throw new Error("Failed to update company");
    }
  }

  async deleteCompany(companyId) {
    try {
      await this.db.collection('companies').doc(companyId).delete();
      return { id: companyId };
    } catch (error) {
      console.error("Error deleting company: ", error);
      throw new Error("Failed to delete company");
    }
  }
}

module.exports = CompanyRepository;