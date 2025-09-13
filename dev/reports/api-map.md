# AltruiShare API Mapping

Base URL Env: `NEXT_PUBLIC_API_BASE` -> http://localhost:8000/api/method/altruishare

| Domain Feature | Action / Capability | HTTP | Endpoint Suffix | Full Example | Notes |
|----------------|---------------------|------|-----------------|--------------|-------|
| Auth | Login | POST | .as_api.auth_api.login | {base}.as_api.auth_api.login | Returns sid cookie |
| Auth | Logout | POST | .as_api.auth_api.logout | {base}.as_api.auth_api.logout | Invalidates session |
| Auth | Register | POST | .as_api.auth_api.register | {base}.as_api.auth_api.register | Creates user |
| Auth | Logged User | GET | .as_api.auth_api.get_logged_user | {base}.as_api.auth_api.get_logged_user | Requires session |
| Auth | Ping | GET | .as_api.auth_api.ping | {base}.as_api.auth_api.ping | Health check |
| Roles | Get Roles | GET | .as_api.pwa_api.get_user_roles | {base}.as_api.pwa_api.get_user_roles | Role array |
| Needs | List / Filter | GET | .as_api.need_api.get_needs_by_filters | {base}.as_api.need_api.get_needs_by_filters?status=Open | Filter params |
| Needs | Create Need | POST | .as_api.need_api.create_need | {base}.as_api.need_api.create_need | Auth + role required |
| Needs | Update Need | POST | .as_api.need_api.update_need | {base}.as_api.need_api.update_need | Auth + role |
| Donations | Create Donation | POST | .as_api.donation.create_donation | {base}.as_api.donation.create_donation | Returns donation id |
| Donations | List Donations | GET | .as_api.donation.list_donations | {base}.as_api.donation.list_donations | Pagination? |
| Payment | Create Payment Request | POST | .as_api.payment_api.create_payment_request | {base}.as_api.payment_api.create_payment_request | Initiates payment |
| Payment | Verify Payment | POST | .as_api.payment_api.verify_payment | {base}.as_api.payment_api.verify_payment | Confirms status |
| Impact | Analytics | GET | .as_api.impact_api.get_impact_analytics | {base}.as_api.impact_api.get_impact_analytics | Dashboard data |
| Volunteers | List Opportunities | GET | .as_api.volunteer_api.list_opportunities | {base}.as_api.volunteer_api.list_opportunities | TBD exact name |
| Volunteers | Log Hours | POST | .as_api.volunteer_api.log_hours | {base}.as_api.volunteer_api.log_hours | TBD confirm |
| Notifications | List Notifications | GET | .as_api.notification_api.list_notifications | {base}.as_api.notification_api.list_notifications | Pagination? |
| Notifications | Mark Read | POST | .as_api.notification_api.mark_read | {base}.as_api.notification_api.mark_read | Single/bulk |
| Files | Upload File | POST | .as_api.file_api.upload_file | {base}.as_api.file_api.upload_file | multipart/form-data |

Legend: `{base}` = http://localhost:8000/api/method/altruishare

Pending confirmation endpoints (volunteer, some notification specifics) will be validated when backend provides swagger or docs.

## Notes

- Response envelope normalized in axios interceptor; errors bubble naturally.
- Role-based gating via `Protected` component and guest preview mode on landing.
- UI primitives added: Button, Card (with subcomponents), Input, Badge (status & variant support).
- Tailwind tokens extended (brand gradients, soft shadows, semantic status colors success/warning/danger).
- Offline utilities: notification action queue + new offline fallback route `/offline` (edge runtime) with retry & back actions.
- PWA service worker auto-registers; next step could wire a navigation guard to push users to `/offline` when `!navigator.onLine`.
- Online status detection hook (`useOnlineStatus`) and `OfflineBanner` integrated into root layout for real-time connectivity UX.
