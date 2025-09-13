export enum UserRole {
    DONOR = 'donor',
    CORPORATE = 'corporate',
    NGO = 'ngo',
    SERVICE_PROVIDER = 'service_provider',
    LOGISTICS = 'logistics',
    VOLUNTEER = 'volunteer'
}

export enum Capability {
    CREATE_NEED = 'create_need',
    MANAGE_NEED = 'manage_need',
    DONATE_FUNDS = 'donate_funds',
    DONATE_IN_KIND = 'donate_in_kind',
    VIEW_IMPACT = 'view_impact',
    MANAGE_LOGISTICS = 'manage_logistics',
    SCHEDULE_PICKUP = 'schedule_pickup',
    CONFIRM_DELIVERY = 'confirm_delivery',
    VIEW_NOTIFICATIONS = 'view_notifications',
    MANAGE_VOLUNTEER_OPPS = 'manage_volunteer_opportunities',
    VOLUNTEER_SIGNUP = 'volunteer_signup',
    LOG_HOURS = 'log_hours',
    VIEW_LEADERBOARD = 'view_leaderboard',
    VIEW_BADGES = 'view_badges',
    MANAGE_ORG_VERIFICATION = 'manage_org_verification',
    UPLOAD_FILES = 'upload_files',
    PAYMENT_REQUEST = 'payment_request',
    PAYMENT_VERIFY = 'payment_verify',
    ACCESS_CORPORATE_DASH = 'access_corporate_dashboard',
    ACCESS_CAMPAIGNS = 'access_campaigns',
    ACCESS_EMPLOYEE_ENGAGEMENT = 'access_employee_engagement'
}

export type RoleCapabilities = Record<UserRole, Capability[]>;
