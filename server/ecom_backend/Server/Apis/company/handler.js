const companyService = require('./service');

class CompanyHandler {
  async createCompany(req, res) {
    try {
      // Only super admin can create companies
      if (req.user && req.user.user_role !== 'super_admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const result = await companyService.createCompany(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCompanyById(req, res) {
    try {
      // Check if user has access to this company
      if (req.user && req.user.user_role !== 'super_admin' && req.user.company_id !== req.params.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const result = await companyService.getCompanyById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getAllCompanies(req, res) {
    try {
      // Only super admin can see all companies
      if (req.user && req.user.user_role !== 'super_admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const query = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10
      };

      const result = await companyService.getAllCompanies(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCompany(req, res) {
    try {
      // Check if user has access to update this company
      if (req.user && req.user.user_role !== 'super_admin' && req.user.company_id !== req.params.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const result = await companyService.updateCompany(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteCompany(req, res) {
    try {
      // Only super admin can delete companies
      if (req.user && req.user.user_role !== 'super_admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const result = await companyService.deleteCompany(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new CompanyHandler();
