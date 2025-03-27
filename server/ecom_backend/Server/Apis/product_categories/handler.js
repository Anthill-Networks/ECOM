const categoryService = require('./service');

class CategoryHandler {
  async createCategory(req, res) {
    try {
      //check access from token
      if(req.user.user_role == 'admin'){
        req.body.company_id = req.user.company_id;
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }

      const companyId = req.user.company_id;
      const result = await categoryService.createCategory({
        ...req.body, 
        user_id: req.user.user_id, 
        company_id: companyId
      });
      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoryById(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await categoryService.getCategoryById(req.params.id, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //list
  async getAllCategories(req, res) {
    try {
      //filter based on query
      const query = {};
      if (req.query.name) {
        query.name = req.query.name;
      }

      //filter based on token
      if(req.user.user_role == 'admin'){
        query.company_id = req.user.company_id;
      }
      else{
        query.company_id = req.user.company_id;
        query.is_active = true;
      }

      const result = await categoryService.getAllCategories(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      //if it has access
      if(req.user.user_role == 'admin'){
      }
      else{
        res.status(401).json({ message: 'Unauthorized' });
      }

      const companyId = req.user.company_id;

      //if req has is_active field then update is_category_active field in product
      if(req.body.is_active == false || req.body.is_active == true){
        await categoryService.updateProductCategory(req.params.id, req.body.is_active, companyId);
      }

      const result = await categoryService.updateCategory(req.params.id, req.body, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await categoryService.deleteCategory(req.params.id, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CategoryHandler();
