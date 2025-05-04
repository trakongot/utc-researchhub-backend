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
      throw new UnauthorizedException('Refresh token không tồn tại');
    }

    if (!payload?.id || !payload?.userType) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const userType = payload.userType as UserT;

    const user =
      userType === UserT.STUDENT
        ? await this.prisma.student.findUnique({
            where: { id: payload.id },
            select: { id: true, email: true, refreshToken: true },
          })
        : userType === UserT.FACULTY
          ? await this.prisma.faculty.findUnique({
              where: { id: payload.id, status: 'ACTIVE' },
              select: {
                id: true,
                email: true,
                refreshToken: true,
                FacultyRoles: { select: { role: true } },
              },
            })
          : null;

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(
        'Không tìm thấy tài khoản hoặc refresh token không tồn tại',
      );
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    const roles =
      userType === UserT.FACULTY
        ? (user as any)?.FacultyRole?.map((r) => r.role) || []
        : ['STUDENT'];

    const permissions = getPermissionsForRoles(roles);

    return {
      id: user.id,
      userType,
      roles,
      permissions,
    };
  }
}
