import { Capability, UserRole } from '../../../entities/role';

export interface MenuItem {
    label: string;
    path: string;
    icon?: string; // placeholder for icon key/name
    capability?: Capability; // optional capability required
}

export interface MenuSection {
    id: string;
    label: string;
    items: MenuItem[];
    roles?: UserRole[]; // optional restriction by role
}

export const BASE_MENU_SECTIONS: MenuSection[] = [
    {
        id: 'core',
        label: 'Core',
        items: [
            { label: 'Home', path: '/', icon: 'home' },
            { label: 'Needs', path: '/needs', icon: 'needs', capability: Capability.MANAGE_NEED },
            { label: 'Donate', path: '/donate', icon: 'donate', capability: Capability.DONATE_FUNDS },
            { label: 'Impact', path: '/impact', icon: 'impact', capability: Capability.VIEW_IMPACT }
        ]
    },
    {
        id: 'operations',
        label: 'Operations',
        items: [
            { label: 'Logistics', path: '/logistics', icon: 'logistics', capability: Capability.MANAGE_LOGISTICS },
            { label: 'Volunteer Opps', path: '/volunteer', icon: 'volunteer', capability: Capability.VOLUNTEER_SIGNUP },
            { label: 'Hours Log', path: '/volunteer/hours', icon: 'hours', capability: Capability.LOG_HOURS }
        ]
    },
    {
        id: 'engagement',
        label: 'Engagement',
        items: [
            { label: 'Leaderboards', path: '/leaderboards', icon: 'leaderboard', capability: Capability.VIEW_LEADERBOARD },
            { label: 'Badges', path: '/badges', icon: 'badges', capability: Capability.VIEW_BADGES },
            { label: 'Campaigns', path: '/campaigns', icon: 'campaigns', capability: Capability.ACCESS_CAMPAIGNS }
        ]
    },
    {
        id: 'org',
        label: 'Organization',
        items: [
            { label: 'Verification', path: '/verification', icon: 'verify', capability: Capability.MANAGE_ORG_VERIFICATION },
            { label: 'Settings', path: '/settings', icon: 'settings' }
        ]
    }
];
