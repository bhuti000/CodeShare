// ============================================
// ROLE-BASED ACCESS CONTROL MIDDLEWARE
// ============================================

/**
 * Check if user has required role
 * @param {string|string[]} requiredRoles - Role(s) required
 * @returns {Function} Middleware function
 */
export const authorize = (requiredRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Convert single role to array
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      // Check if user has required role
      if (!roles.includes(req.user.role)) {
        console.log(`❌ Access denied for user ${req.user._id} with role ${req.user.role}`);
        return res.status(403).json({ 
          message: "Insufficient permissions",
          requiredRole: roles,
          userRole: req.user.role
        });
      }

      console.log(`✅ Access granted for user ${req.user._id} with role ${req.user.role}`);
      next();
    } catch (err) {
      console.error("❌ Authorization error:", err);
      res.status(500).json({ message: "Authorization error" });
    }
  };
};

/**
 * Check if user is owner of resource
 * @param {string} resourceOwnerId - Owner ID to check
 * @returns {boolean} True if user is owner
 */
export const isOwner = (req, resourceOwnerId) => {
  return req.user._id.toString() === resourceOwnerId.toString();
};

/**
 * Check if user is admin or owner
 * @param {string} resourceOwnerId - Owner ID to check
 * @returns {boolean} True if user is admin or owner
 */
export const isAdminOrOwner = (req, resourceOwnerId) => {
  return req.user.role === "admin" || isOwner(req, resourceOwnerId);
};

/**
 * Middleware to check if user is owner or admin
 */
export const checkOwnerOrAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Admin can do anything
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user is owner (will be checked in route handler)
    next();
  } catch (err) {
    console.error("❌ Owner check error:", err);
    res.status(500).json({ message: "Error checking permissions" });
  }
};

// ============================================
// ROLE DEFINITIONS
// ============================================

export const ROLES = {
  ADMIN: "admin",      // Full access
  EDITOR: "editor",    // Can create/edit snippets
  VIEWER: "viewer"     // Read-only access
};

export const ROLE_PERMISSIONS = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canModerateComments: true
  },
  editor: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: false,
    canViewAnalytics: false,
    canModerateComments: false
  },
  viewer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canModerateComments: false
  }
};

/**
 * Get permissions for a role
 * @param {string} role - User role
 * @returns {Object} Permissions object
 */
export const getPermissions = (role) => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.viewer;
};

/**
 * Check if user has permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (role, permission) => {
  const permissions = getPermissions(role);
  return permissions[permission] || false;
};
