import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { config } from 'src/common/config';
import { JwtPayload } from './auth.dto';

@Injectable()
export class JwtDecodeMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      console.log(authHeader);
      const token = authHeader.substring(10);

      try {
        const decoded: JwtPayload = this.jwtService.verify(token, {
          secret: config.privateKeySecret,
        });

        req['user'] = {
          id: decoded.id,
          code: decoded.code,
          userType: decoded.userType,
          roles: decoded.roles,
        };
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
    next();
  }
}
