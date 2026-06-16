import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        role: session.user.role as 'admin' | 'teacher' | 'student',
        departmentId: (session.user as any).departmentId,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      };
    }
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    next();
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      data: null,
      error: "Unauthorized: Session required"
    });
  }
  next();
};

export const requireRole = (allowedRoles: ('admin' | 'teacher' | 'student')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: "Unauthorized: Session required"
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: `Forbidden: Insufficient permissions. Requires one of: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};
