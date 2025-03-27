const OrderRepository = require('../../repos/orders');
const { getDbConnection } = require('../../firebase/dbConfig');
const RazorpayService = require("./razorpay");
const { v4: uuidv4 } = require('uuid');
const OrderItemsRepository = require('../../repos/ordersItems');
const ProductVarientRepository = require('../../repos/ProductVarients');

class OrderService {
  constructor() {
    this.orderRepo = null;
    this.orderItemsRepo = null;
    this.productRepo = null;
  }

  // Initialize repositories with correct database connection
  initializeRepo(companyId) {
    const dbConnection = getDbConnection(companyId);
    this.orderRepo = new OrderRepository(dbConnection);
    this.orderItemsRepo = new OrderItemsRepository(dbConnection);
    this.productRepo = new ProductVarientRepository(dbConnection);
  }

  async createOrder(data) {
    this.initializeRepo(data.company_id);
    data.id = uuidv4();
    const { order_items, total_amount, ...orderData } = data;

    // Create an order record in the database
    const primaryResult = await this.orderRepo.createOrder({...orderData, total_amount});

    // Initiate payment with Razorpay
    const razorpayOrder = await RazorpayService.createPaymentOrder(total_amount, data.id, data.company_id);

    if (order_items) {
      for (const item of order_items) {
        item.order_id = data.id;
        await this.orderItemsRepo.createOrder(item);
      }
    }

    return { primaryResult, razorpayOrder };  
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

  async createOrderItem(data) {
    this.initializeRepo(data.company_id);
    data.id = uuidv4();
    const result = await this.orderRepo.createOrderItem(data);
    return result;
  }
}

module.exports = new OrderService();
