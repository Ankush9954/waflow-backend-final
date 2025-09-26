export const requireTenant = (req, res, next) => {
  if (!req.user?.tenantId) {
    return res.status(400).json({ message: 'TenantId missing in request' });
  }
  next();
};
