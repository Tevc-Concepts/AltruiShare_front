import { Capability, RoleCapabilities, UserRole } from './role.types';

export const ROLE_CAPABILITIES: RoleCapabilities = {
  [UserRole.DONOR]: [
    Capability.DONATE_FUNDS,
    Capability.DONATE_IN_KIND,
    Capability.VIEW_IMPACT,
    Capability.VIEW_NOTIFICATIONS,
    Capability.VIEW_BADGES,
    Capability.VIEW_LEADERBOARD,
    Capability.UPLOAD_FILES
  ],
  [UserRole.CORPORATE]: [
    Capability.DONATE_FUNDS,
    Capability.DONATE_IN_KIND,
    Capability.VIEW_IMPACT,
    Capability.ACCESS_CORPORATE_DASH,
    Capability.ACCESS_CAMPAIGNS,
    Capability.ACCESS_EMPLOYEE_ENGAGEMENT,
    Capability.VIEW_NOTIFICATIONS,
    Capability.VIEW_LEADERBOARD,
    Capability.VIEW_BADGES,
    Capability.UPLOAD_FILES
  ],
  [UserRole.NGO]: [
    Capability.CREATE_NEED,
    Capability.MANAGE_NEED,
    Capability.DONATE_IN_KIND,
    Capability.VIEW_IMPACT,
    Capability.MANAGE_ORG_VERIFICATION,
    Capability.VIEW_NOTIFICATIONS,
    Capability.UPLOAD_FILES
  ],
  [UserRole.SERVICE_PROVIDER]: [
    Capability.DONATE_IN_KIND,
    Capability.SCHEDULE_PICKUP,
    Capability.CONFIRM_DELIVERY,
    Capability.VIEW_IMPACT,
    Capability.VIEW_NOTIFICATIONS,
    Capability.UPLOAD_FILES
  ],
  [UserRole.LOGISTICS]: [
    Capability.MANAGE_LOGISTICS,
    Capability.SCHEDULE_PICKUP,
    Capability.CONFIRM_DELIVERY,
    Capability.VIEW_IMPACT,
    Capability.VIEW_NOTIFICATIONS,
    Capability.UPLOAD_FILES
  ],
  [UserRole.VOLUNTEER]: [
    Capability.VOLUNTEER_SIGNUP,
    Capability.LOG_HOURS,
    Capability.VIEW_BADGES,
    Capability.VIEW_LEADERBOARD,
    Capability.VIEW_IMPACT,
    Capability.VIEW_NOTIFICATIONS,
    Capability.UPLOAD_FILES
  ]
};

export function hasCapability(roles: UserRole[] | undefined, capability: Capability): boolean {
  if (!roles || roles.length === 0) return false;
  return roles.some(r => ROLE_CAPABILITIES[r]?.includes(capability));
}
