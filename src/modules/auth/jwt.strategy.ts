import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserT } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'src/common/config';
import {
  getPermissionsForRoles,
  PermissionT,
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

  /**
   * Validate JWT token payload and fetch current user information
   * This method is called automatically by Passport.js after token verification
   */
  async validate(payload: TokenPayload): Promise<AuthPayload> {
    let userExists = false;
    let roles: string[] = [];
    let permissions: string[] = [];

    // Handle student authentication
    if (payload.userType === UserT.STUDENT) {
      const student = await this.prisma.student.findUnique({
        where: { id: payload.id },
        select: { id: true, status: true },
      });
      userExists = !!student && student.status === 'ACTIVE';
      roles = ['STUDENT'];
      permissions = RolePermissions.STUDENT || [];
    }
    // Handle faculty authentication
    else if (payload.userType === UserT.FACULTY) {
      const faculty = await this.prisma.faculty.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          status: true,
          FacultyRole: { select: { role: true } },
        },
      });
      userExists = !!faculty && faculty.status === 'ACTIVE';
      roles = faculty?.FacultyRole?.map((r) => r.role) || [];
      permissions = getPermissionsForRoles(roles);
    }

    // Throw exception if user doesn't exist or is inactive
    if (!userExists) {
      throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khóa');
    }

    // Return authenticated user data with roles and permissions
    return {
      id: payload.id,
      userType: payload.userType,
      roles,
      permissions: permissions as PermissionT[],
    };
  }
}
