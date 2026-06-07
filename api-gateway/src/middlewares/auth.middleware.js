const jwt = require('jsonwebtoken');

const protect = (options = {}) => {
  return (req, res, next) => {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = auth.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      return next();
    } catch (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
  };
};

module.exports = { protect };
