const orderService = require('./service');

class OrderHandler {
  async createOrder(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await orderService.createOrder({
        ...req.body, 
        user_id: req.user.user_id, 
        company_id: companyId
      });
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await orderService.getOrderById(req.params.id, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const query = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
        userId: req.query.userId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        company_id: req.user.company_id,
      };

      const result = await orderService.getAllOrders(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await orderService.updateOrder(req.params.id, req.body, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await orderService.deleteOrder(req.params.id, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new OrderHandler();
