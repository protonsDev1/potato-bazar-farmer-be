import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { USER_ROLES } from "../database/models/user";
import SubAdminPermission from "../database/models/subAdminPermission";
import { WEB_ACTIONS } from "./constants/permissions";
import SubAdminWebPermission from "../database/models/subAdminWebPermission";
import { Op } from "sequelize";
import UserSession from "../database/models/userSession";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: { id: number; email?: string; role: string };
}

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "User has been deactivated. Please contact the admin",
      });
    }

    if (user.isDeleted) {
      return res.status(403).json({
        message: "User is deleted. Please login on mobile app to restore user.",
      });
    }

    const session = await UserSession.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!session || !session.token)
      return res.status(401).json({
        success: false,
        message: "You have logged out. Please login again.",
      });

    if (session.token !== token)
      return res.status(401).json({
        success: false,
        message: "You are logged in on another device.",
      });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export const optionalAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      req.user = null;
      return next();
    }

    const session = await UserSession.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!session || !session.token)
      return res.status(401).json({
        success: false,
        message: "You have logged out. Please login again.",
      });

    if (session.token !== token)
      return res.status(401).json({
        success: false,
        message: "You are logged in on another device.",
      });

    req.user = user;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};

export const superAdminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is super admin
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return res
        .status(403)
        .json({ message: "Access Denied: You are not a super admin" });
    }

    const session = await UserSession.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!session || !session.token)
      return res.status(401).json({
        success: false,
        message: "You have logged out. Please login again.",
      });

    if (session.token !== token)
      return res.status(401).json({
        success: false,
        message: "You are logged in on another device.",
      });

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

export const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access Denied: You are not an admin" });
    }

    const session = await UserSession.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!session || !session.token)
      return res.status(401).json({
        success: false,
        message: "You have logged out. Please login again.",
      });

    if (session.token !== token)
      return res.status(401).json({
        success: false,
        message: "You are logged in on another device.",
      });

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

export const checkPermissionMiddleware = (permissions: string | string[]) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No Token Provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.isActive) {
        return res.status(403).json({
          message: "User has been deactivated. Please contact the admin",
        });
      }

      const session = await UserSession.findOne({
        where: {
          userId: user.id,
        },
      });

      if (!session || !session.token)
        return res.status(401).json({
          success: false,
          message: "You have logged out. Please login again.",
        });

      if (session.token !== token)
        return res.status(401).json({
          success: false,
          message: "You are logged in on another device.",
        });

      // Attach user to request object
      req.user = user;

      switch (user.role) {
        case USER_ROLES.SUPER_ADMIN:
          return next(); // always allowed

        case USER_ROLES.SUB_ADMIN: {
          const allowedPermissions = Array.isArray(permissions)
            ? permissions
            : [permissions];

          const hasPermission = await SubAdminPermission.findOne({
            where: {
              userId: user.id,
              permission: { [Op.in]: allowedPermissions },
            },
          });
          if (!hasPermission) {
            return res.status(403).json({
              message: `${
                USER_ROLES.SUB_ADMIN
              } does not have '${allowedPermissions.join(", ")}' permission.`,
            });
          }
          return next();
        }

        default:
          return res.status(403).json({
            message: `Only ${USER_ROLES.SUPER_ADMIN} and ${USER_ROLES.SUB_ADMIN} with valid permission are authorized.`,
          });
      }
    } catch (error) {
      return res.status(401).json({ message: "Invalid or Expired Token" });
    }
  };
};

export const mandiAgentAndSuperAdminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "User has been deactivated. Please contact the admin",
      });
    }

    if (
      user.role !== USER_ROLES.SUPER_ADMIN &&
      user.role != USER_ROLES.MANDI_AGENT
    )
      return res.status(403).json({
        message:
          "Access Denied: You are neither a mandi agent nor a super admin.",
      });

    const session = await UserSession.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!session || !session.token)
      return res.status(401).json({
        success: false,
        message: "You have logged out. Please login again.",
      });

    if (session.token !== token)
      return res.status(401).json({
        success: false,
        message: "You are logged in on another device.",
      });

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

export const checkOtpVerified = async (req, res, next) => {
  const { mobile } = req.body;

  const user = await User.findOne({ where: { mobile } });

  if (!user.otpVerified)
    return res.status(401).json({ message: "Otp not verified." });

  next();
};

export const adminOrSubAdminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "User has been deactivated. Please contact the admin",
      });
    }

    // Check if user is admin or sub admin web
    if (
      ![USER_ROLES.ADMIN, USER_ROLES.SUB_ADMIN_WEB].includes(
        user.role as USER_ROLES
      )
    ) {
      return res
        .status(403)
        .json({ message: "Access Denied: Unauthorized role" });
    }

    const session = await UserSession.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!session || !session.token)
      return res.status(401).json({
        success: false,
        message: "You have logged out. Please login again.",
      });

    if (session.token !== token)
      return res.status(401).json({
        success: false,
        message: "You are logged in on another device.",
      });

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

export const superAdminOrSubAdminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "User has been deactivated. Please contact the admin",
      });
    }

    // Check if user is admin or sub admin web
    if (
      ![USER_ROLES.SUPER_ADMIN, USER_ROLES.SUB_ADMIN].includes(
        user.role as USER_ROLES
      )
    ) {
      return res
        .status(403)
        .json({ message: "Access Denied: Unauthorized role" });
    }

    const session = await UserSession.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!session || !session.token)
      return res.status(401).json({
        success: false,
        message: "You have logged out. Please login again.",
      });

    if (session.token !== token)
      return res.status(401).json({
        success: false,
        message: "You are logged in on another device.",
      });

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

export const checkWebPermissionMiddleware =
  (module: string, action: string, isAgentAllowed: boolean) =>
  async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No Token Provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.isActive) {
        return res.status(403).json({
          message: "User has been deactivated. Please contact the admin",
        });
      }

      const session = await UserSession.findOne({
        where: {
          userId: user.id,
        },
      });

      if (!session || !session.token)
        return res.status(401).json({
          success: false,
          message: "You have logged out. Please login again.",
        });

      if (session.token !== token)
        return res.status(401).json({
          success: false,
          message: "You are logged in on another device.",
        });

      req.user = user;

      if (
        user.role === USER_ROLES.ADMIN ||
        (isAgentAllowed && user.role === USER_ROLES.AGENT) // agent allowed only when flag is true
      ) {
        return next();
      }

      if (user.role === USER_ROLES.SUB_ADMIN_WEB) {
        const userPermissions = await SubAdminWebPermission.findAll({
          where: { userId: user.id },
        });

        const hasPermission = userPermissions.some(
          (p) =>
            p.module === module &&
            (p.action === action || p.action === WEB_ACTIONS.ALL)
        );

        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: `Access denied: Missing required action '${action}' in ${module}`,
          });
        }
        return next();
      }

      return res.status(403).json({
        message: "Access denied: Unauthorized role",
      });
    } catch (error) {
      return res.status(401).json({ message: "Invalid or Expired Token" });
    }
  };

export const runMiddleware = (req, res, middleware): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    middleware(req, res, (err?: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export const createOrUpdateSession = async ({ userId, token }) => {
  const user = await UserSession.findOne({ where: { userId } });

  if (user) await UserSession.update({ token }, { where: { userId } });
  else
    await UserSession.create({
      userId,
      token,
    });
};
