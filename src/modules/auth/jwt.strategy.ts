import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'src/common/config';
import { PrismaService } from 'src/config/database';
import { JwtPayload } from './auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.privateKeySecret,
    });
  }

  async validate(payload: JwtPayload) {
    // let user: any;

    // if (payload.userType === 'STUDENT') {
    //   user = await this.prisma.student.findUnique({
    //     where: {
    //       id: payload.id,
    //     },
    //   });
    // } else if (payload.userType === 'FACULTY') {
    //   user = await this.prisma.faculty.findUnique({
    //     where: {
    //       id: payload.id,
    //     },
    //   });
    // }

    // if (!user) {
    //   throw new UnauthorizedException('User not found');
    // }

    // if (user.status && user.status !== 'ACTIVE') {
    //   throw new UnauthorizedException('User is inactive');
    // }

    return {
      id: payload.id,
      code: payload.code,
      userType: payload.userType,
      roles: payload.roles,
      // email: payload.email,
      // ...user,
    };
  }
}
