const CartRepository = require('../../repos/cart');
const { getDbConnection } = require('../../firebase/dbConfig');
const { v4: uuidv4 } = require('uuid');

class CartService {
  constructor() {
    this.cartRepo = null;
  }

  // Initialize repository with correct database connection
  initializeRepo(companyId) {
    const dbConnection = getDbConnection(companyId);
    this.cartRepo = new CartRepository(dbConnection);
  }

  async createCart(data) {
    this.initializeRepo(data.company_id);
    data.id = uuidv4();
    const result = await this.cartRepo.createCart(data);
    return result;
  }

  async getCartByUserId(userId, companyId) {
    this.initializeRepo(companyId);
    const result = await this.cartRepo.getCartByUserId(userId);
    return result;
  }

  async addItemToCart(userId, item, companyId) {
    this.initializeRepo(companyId);
    item.id = uuidv4();
    const result = await this.cartRepo.addItemToCart(userId, item);
    return result;
  }

  async removeItemFromCart(userId, itemId, companyId) {
    this.initializeRepo(companyId);
    const result = await this.cartRepo.removeItemFromCart(userId, itemId);
    return result;
  }

  async updateCart(userId, updatedItems, companyId) {
    this.initializeRepo(companyId);
    const result = await this.cartRepo.updateCart(userId, updatedItems);
    return result;
  }

  async deleteCart(userId, companyId) {
    this.initializeRepo(companyId);
    const result = await this.cartRepo.deleteCart(userId);
    return result;
  }

  async getItemCount(userId, companyId) {
    this.initializeRepo(companyId);
    const result = await this.cartRepo.getItemCount(userId);
    return result;
  }
}

module.exports = new CartService();
