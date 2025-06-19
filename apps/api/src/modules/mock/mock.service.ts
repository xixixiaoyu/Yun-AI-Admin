import { Injectable } from '@nestjs/common';
import { MockDataService, UserStatus, RoleStatus, PermissionStatus } from '../../common/mock/mock-data.service';

@Injectable()
export class MockService {
  constructor(private readonly mockDataService: MockDataService) {}

  async resetAllData() {
    await this.mockDataService.resetData();
  }

  async initializeData() {
    await this.mockDataService.initializeData();
  }

  async getDataStatus() {
    const users = this.mockDataService.getUsers();
    const roles = this.mockDataService.getRoles();
    const permissions = this.mockDataService.getPermissions();

    return {
      users: {
        total: users.length,
        active: users.filter(u => u.status === UserStatus.ACTIVE).length,
        inactive: users.filter(u => u.status === UserStatus.INACTIVE).length,
        banned: users.filter(u => u.status === UserStatus.BANNED).length,
        pending: users.filter(u => u.status === UserStatus.PENDING).length,
      },
      roles: {
        total: roles.length,
        active: roles.filter(r => r.status === RoleStatus.ACTIVE).length,
        inactive: roles.filter(r => r.status === RoleStatus.INACTIVE).length,
        system: roles.filter(r => r.type === 'system').length,
        custom: roles.filter(r => r.type === 'custom').length,
      },
      permissions: {
        total: permissions.length,
        active: permissions.filter(p => p.status === PermissionStatus.ACTIVE).length,
        inactive: permissions.filter(p => p.status === PermissionStatus.INACTIVE).length,
        menu: permissions.filter(p => p.type === 'menu').length,
        button: permissions.filter(p => p.type === 'button').length,
        api: permissions.filter(p => p.type === 'api').length,
      },
      lastInitialized: new Date().toISOString(),
    };
  }

  async getUsersCount() {
    const users = this.mockDataService.getUsers();
    const statusCounts = {};
    
    Object.values(UserStatus).forEach(status => {
      statusCounts[status] = users.filter(u => u.status === status).length;
    });

    return {
      total: users.length,
      byStatus: statusCounts,
      byRole: this.getUserCountByRoles(users),
    };
  }

  async getRolesCount() {
    const roles = this.mockDataService.getRoles();
    const statusCounts = {};
    
    Object.values(RoleStatus).forEach(status => {
      statusCounts[status] = roles.filter(r => r.status === status).length;
    });

    return {
      total: roles.length,
      byStatus: statusCounts,
      byType: {
        system: roles.filter(r => r.type === 'system').length,
        custom: roles.filter(r => r.type === 'custom').length,
      },
    };
  }

  async getPermissionsCount() {
    const permissions = this.mockDataService.getPermissions();
    const statusCounts = {};
    
    Object.values(PermissionStatus).forEach(status => {
      statusCounts[status] = permissions.filter(p => p.status === status).length;
    });

    return {
      total: permissions.length,
      byStatus: statusCounts,
      byType: {
        menu: permissions.filter(p => p.type === 'menu').length,
        button: permissions.filter(p => p.type === 'button').length,
        api: permissions.filter(p => p.type === 'api').length,
      },
      tree: this.mockDataService.buildPermissionTree().length,
    };
  }

  private getUserCountByRoles(users: any[]) {
    const roleCounts = {};
    const roles = this.mockDataService.getRoles();
    
    roles.forEach(role => {
      roleCounts[role.code] = users.filter(u => u.roles.includes(role.code)).length;
    });
    
    return roleCounts;
  }
}
