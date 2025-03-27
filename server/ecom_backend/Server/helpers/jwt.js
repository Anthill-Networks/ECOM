const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';

function createToken(company_id, user_id, role) {
  return jwt.sign(
    { company_id, user_id, user_role: role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function createRefreshToken(user_id) {
  return jwt.sign(
    { user_id },
    REFRESH_SECRET,
    { expiresIn: '30d' }
  );
}

function authorize(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      user_id: decoded.user_id,
      company_id: decoded.company_id,
      user_role: decoded.user_role
    };

    if (req.body.company_id != decoded.company_id && req.params.company_id != decoded.company_id && req.query.company_id != decoded.company_id) {
      return res.status(401).json({ message: 'Unauthorized' , company_id_from_body: req.body.company_id , company_id_from_params: req.params.company_id , company_id_from_token: decoded.company_id , company_id_from_query: req.query.company_id });
    }

    // console.log(req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Similar to authorize but doesn't return error if no token
function softAuthorize(req, res, next) {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        user_id: decoded.user_id,
        company_id: decoded.company_id,
        user_role: decoded.user_role
      };
    }
    next();
  } catch (error) {
    next();
  }
}

module.exports = {
  createToken,
  createRefreshToken,
  authorize,
  softAuthorize
};
