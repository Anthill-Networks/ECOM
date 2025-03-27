const CompanyRepository = require('../../repos/company');
const { getDbConnection } = require('../../firebase/dbConfig');
const { v4: uuidv4 } = require('uuid');

class CompanyService {
  constructor() {
    this.companyRepo = null;
  }

  // Initialize repository with correct database connection
  initializeRepo(companyId = 'default') {
    const dbConnection = getDbConnection(companyId);
    this.companyRepo = new CompanyRepository(dbConnection);
  }

  async createCompany(data) {
    this.initializeRepo();
    data.id = uuidv4();
    const result = await this.companyRepo.createCompany(data);
    return result;
  }

  async getCompanyById(id) {
    this.initializeRepo();
    const result = await this.companyRepo.getCompanyById(id);
    return result;
  }

  async getAllCompanies(query) {
    this.initializeRepo();
    const result = await this.companyRepo.getAllCompanies(query);
    return result;
  }

  async updateCompany(id, data) {
    this.initializeRepo();
    const result = await this.companyRepo.updateCompany(id, data);
    return result;
  }

  async deleteCompany(id) {
    this.initializeRepo();
    const result = await this.companyRepo.deleteCompany(id);
    return result;
  }
}

module.exports = new CompanyService();
