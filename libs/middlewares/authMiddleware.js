import jwt from 'jsonwebtoken';
import redis from '../utils/redisClient.js';
import Auth from '../../services/auth-service/src/models/authModel.js';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Redis session validation
    const redisToken = await redis.get(`session:${userId}`);
    if (!redisToken || redisToken !== token)
      return res.status(403).json({ message: 'Session expired or invalid token' });

    // Fetch cached user or from DB
    let userData = await redis.get(`user:${userId}`);
    if (userData) {
      userData = JSON.parse(userData);
    } else {
      const user = await Auth.findById(userId).select('-password');
      if (!user) return res.status(401).json({ message: 'User not found' });
      userData = user.toObject();

      // Cache user including tenantId
      await redis.set(`user:${userId}`, JSON.stringify(userData), { ex: 86400 });
    }

    // Attach user to request
    req.user = {
      id: userData._id.toString(),
      role: userData.role,
      email: userData.email,
      tenantId: userData.tenantId, // ✅ always available
      isFirstLogin: userData.isFirstLogin,
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default authenticateToken;
