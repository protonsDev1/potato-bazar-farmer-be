import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { USER_ROLES } from "../database/models/user";
import SubAdminPermission from "../database/models/subAdminPermission";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: { id: number; email?: string; role: string };
}

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   

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

    req.user = user ? user : null;
  } catch (error) {
    req.user = null;
  }

  next();
};

export const superAdminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is super admin
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: 'Access Denied: You are not a super admin' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or Expired Token' });
  }
};

export const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: You are not an admin' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or Expired Token' });
  }
};

export const checkPermissionMiddleware = (permission: string) => {
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

      // Attach user to request object
      req.user = user;

      switch (user.role) {
        case USER_ROLES.SUPER_ADMIN:
          return next(); // always allowed

        case USER_ROLES.SUB_ADMIN: {
          const exists = await SubAdminPermission.findOne({
            where: { userId: user.id, permission },
          });
          if (!exists) {
            return res.status(403).json({
              message: `${USER_ROLES.SUB_ADMIN} does not have '${permission}' permission.`,
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

export const checkOtpVerified = async (req, res, next) => {
  const { mobile } = req.body;

  const user= await User.findOne({where:{mobile}});

  if(!user.otpVerified)
    return res.status(401).json({message:"Otp not verified."});

  next();
};

