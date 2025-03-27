const OrderRepository = require('../../repos/orders');
const { getDbConnection } = require('../../firebase/dbConfig');
const { v4: uuidv4 } = require('uuid');

class OrderService {
  constructor() {
    this.orderRepo = null;
  }

  // Initialize repository with correct database connection
  initializeRepo(companyId) {
    const dbConnection = getDbConnection(companyId);
    this.orderRepo = new OrderRepository(dbConnection);
  }

  async createOrder(data) {
    this.initializeRepo(data.company_id);
    data.id = uuidv4();
    const result = await this.orderRepo.createOrder(data);
    return result;
  }

  async getOrderById(id, companyId) {
    this.initializeRepo(companyId);
    const result = await this.orderRepo.getOrderById(id);
    return result;
  }

  async getAllOrders(query) {
    this.initializeRepo(query.company_id);
    const result = await this.orderRepo.getAllOrders(query);
    return result;
  }

  async updateOrder(id, data, companyId) {
    this.initializeRepo(companyId);
    const result = await this.orderRepo.updateOrder(id, data);
    return result;
  }

  async deleteOrder(id, companyId) {
    this.initializeRepo(companyId);
    const result = await this.orderRepo.deleteOrder(id);
    return result;
  }
}

module.exports = new OrderService();
