const productService = require('./service');

class ProductHandler {
  async createProduct(req, res) {
    try {
      let data = req.body;
      const companyId = req.user.company_id;
      
      //get category active status
      const category = await productService.getCategoryById(req.body.category_id, companyId); 
      if(!category.is_active){
        data.is_category_active = false;
      }else{
        data.is_category_active = true;
      }

      data.company_id = companyId;
    
      const result = await productService.createProduct({
        ...data, 
        user_id: req.user.user_id, 
        company_id: companyId
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await productService.getProductById(req.params.id, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getAllProducts(req, res) {
    try {
      // Prepare query parameters
      const query = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
        company_id: req.user.company_id,
      };

      //category filter
      if (req.query.categoryId) {
        query.categoryId = req.query.categoryId;
      }

      const result = await productService.getAllProducts(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await productService.updateProduct(req.params.id, req.body, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await productService.deleteProduct(req.params.id, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new ProductHandler();
