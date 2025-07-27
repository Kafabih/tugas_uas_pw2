import { Request, Response, NextFunction } from 'express';

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;  // `role` is part of the decoded JWT

    // Map numeric role to string role
    const roleMapping: { [key: number]: string } = {
      1: "superadmin",
      2: "teacher",
      3: "student",
    };

    const userRoleString = roleMapping[userRole];

    console.log("Mapped user role:", userRoleString);  // Log the mapped role for debugging

    if (!userRole || !roles.includes(userRoleString)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' });
    }

    next();
  };
};
