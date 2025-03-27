const CategoryRepository = require('../../repos/product_category');
const { getDbConnection } = require('../../firebase/dbConfig');
const { v4: uuidv4 } = require('uuid');

class CategoryService {
  constructor() {
    this.categoryRepo = null;
  }

  // Initialize repository with correct database connection
  initializeRepo(companyId) {
    const dbConnection = getDbConnection(companyId);
    this.categoryRepo = new CategoryRepository(dbConnection);
  }

  async createCategory(data) {
    this.initializeRepo(data.company_id);
    data.id = uuidv4();
    const result = await this.categoryRepo.createCategory(data);
    return result;
  }

  async getCategoryById(id, companyId) {
    this.initializeRepo(companyId);
    const result = await this.categoryRepo.getCategoryById(id);
    return result;
  }

  //list
  async getAllCategories(query) {
    this.initializeRepo(query.company_id);
    const result = await this.categoryRepo.getAllCategories(query);
    return result;
  }

  async updateCategory(id, data, companyId) {
    this.initializeRepo(companyId);
    const result = await this.categoryRepo.updateCategory(id, data);
    return result;
  }

  //update is_category_active field in product
  async updateProductCategory(id, isActive, companyId) {
    this.initializeRepo(companyId);
    const result = await this.categoryRepo.updateProductCategory(id, isActive);
    return result;
  }

  async deleteCategory(id, companyId) {
    this.initializeRepo(companyId);
    const result = await this.categoryRepo.deleteCategory(id);
    return result;
  }
}

module.exports = new CategoryService();
