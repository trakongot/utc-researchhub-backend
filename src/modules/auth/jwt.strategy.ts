import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserT } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'src/common/config';
import {
  getPermissionsForRoles,
  RolePermissions,
} from '../../common/constant/permissions';
import { AuthPayload, TokenPayload } from '../../common/interface';
import { PrismaService } from '../../common/modules/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.privateKeySecret,
    });
  }

  async validate(payload: TokenPayload): Promise<AuthPayload> {
    if (!payload?.id || !payload?.userType) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const userType = payload.userType as UserT;

    if (userType === UserT.STUDENT) {
      const student = await this.prisma.student.findUnique({
        where: { id: payload.id },
        select: { id: true, status: true, departmentId: true },
      });

      if (!student || student.status !== 'ACTIVE') {
        throw new UnauthorizedException('Student not found or inactive');
      }

      return {
        id: payload.id,
        userType,
        roles: ['STUDENT'],
        permissions: RolePermissions.STUDENT,
        departmentId: student.departmentId || undefined,
      };
    }

    if (userType === UserT.FACULTY) {
      const faculty = await this.prisma.faculty.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          status: true,
          FacultyRoles: { select: { role: true } },
          departmentId: true,
        },
      });

      if (!faculty || faculty.status !== 'ACTIVE') {
        throw new UnauthorizedException('Faculty not found or inactive');
      }

      const roles = faculty.FacultyRoles.map((r) => r.role) || [];
      const permissions = getPermissionsForRoles(roles);

      return {
        id: payload.id,
        userType,
        roles,
        permissions,
        departmentId: faculty.departmentId || undefined,
      };
    }

    throw new UnauthorizedException('Token không đúng');
  }
}
