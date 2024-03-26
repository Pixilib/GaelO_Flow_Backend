import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
const jwtService = new JwtService();

export function logger(req: Request, res: Response, next: NextFunction) {
  const { method, url, ip } = req;
  const timestamp = new Date().toISOString();

  const bearer = req.headers.authorization;
  const decoded = bearer ? jwtService.decode(bearer.split(' ')[1]) : null;
  const roleName = decoded ? decoded.role.Name : '-';
  const id = decoded ? decoded.userId : '-';

  console.log(`${ip} ${timestamp} ${roleName} ${id} ${method} ${url}`);
  next();
}
