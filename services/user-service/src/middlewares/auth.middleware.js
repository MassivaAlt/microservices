const jwtUtil = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const token = auth.split(' ')[1];
  try {
    const payload = jwtUtil.verifyToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
