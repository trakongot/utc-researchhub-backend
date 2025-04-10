// src/modules/auth/refresh-token.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserT } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'src/common/config';
import { getPermissionsForRoles } from 'src/common/constant/permissions';
import { AuthPayload, TokenPayload } from 'src/common/interface';
import { PrismaService } from '../../common/modules/prisma/prisma.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.refreshKeySecret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: TokenPayload): Promise<AuthPayload> {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Token làm mới hết hạn');
    }

    if (!payload || !payload.id || !payload.userType) {
      throw new UnauthorizedException('Token làm mới không hợp lệ');
    }
    const userType = payload.userType as UserT;
    let user;

    try {
      if (userType === UserT.STUDENT) {
        user = await this.prisma.student.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            email: true,
            refreshToken: true,
          },
        });
      } else if (userType === UserT.FACULTY) {
        user = await this.prisma.faculty.findUnique({
          where: { id: payload.id, status: 'ACTIVE' },
          select: {
            id: true,
            email: true,
            refreshToken: true,
            FacultyRole: { select: { role: true } },
          },
        });
      } else {
        throw new UnauthorizedException('Loại tài khoản không hợp lệ');
      }

      // Check if user exists and has refresh token
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException(
          'Không tìm thấy tài khoản hoặc không có token làm mới',
        );
      }

      // Verify refresh token matches stored hash
      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Token làm mới không hợp lệ');
      }

      // Get user roles
      const roles =
        userType === UserT.FACULTY
          ? (user as any)?.FacultyRole?.map((r) => r.role) || []
          : ['STUDENT'];

      // Get permissions for roles
      const permissions = getPermissionsForRoles(roles);

      // Return full validated user data
      return {
        id: user.id,
        userType,
        roles,
        permissions,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Lỗi token làm mới');
    }
  }
}
