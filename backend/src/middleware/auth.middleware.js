import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded=jwt.verify(token, config.tokenSecret);
    console.log(decoded.user)
    req.user=decoded.user;
    return next();
  } catch (err) {
    console.error('Error: ', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authMiddleware;
