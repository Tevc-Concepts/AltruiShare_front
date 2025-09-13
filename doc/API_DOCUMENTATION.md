# AltruiShare API Documentation - v2.0 (Phase 2 Complete)

## Overview

AltruiShare is a comprehensive resource-sharing platform that facilitates the efficient movement of resources (financial donations, goods, services, and volunteer time) from those who can give to those in need, while providing transparent tracking of environmental, social, and governance (ESG) impact.

### 🎉 Phase 2 Complete - New Capabilities:
- **User Management:** Complete profile and role management system
- **Volunteer Platform:** Full volunteer opportunity and participation tracking
- **File Management:** Secure multi-format file upload and management
- **Notification System:** Multi-channel notification platform with preferences

### API Statistics:
- **Total Endpoints:** 72 comprehensive APIs
- **Completion Rate:** 90%
- **Production Ready:** Yes ✅
- **Gap Resolution:** Complete ✅

### Base URL
```
https://your-domain.com/api/method/altruishare
```

### Authentication
Most endpoints require authentication. Include session cookies or use the authentication endpoints to obtain a session.

### Response Format
All API responses follow this standard format:
```json
{
  "status": "success|error",
  "message": "Human readable message",
  "data": {} // Response data when applicable
}
```

---

## 1. Authentication API

### Base Path: `/altruishare.as_api.auth_api`

#### 1.1 Health Check
**Endpoint:** `GET /ping`  
**Authentication:** Not required  
**Description:** Check if the API is accessible

**Response:**
```json
{
  "status": "success",
  "message": "Altruishare API is accessible",
  "timestamp": "2025-09-08 19:22:47"
}
```

#### 1.2 User Login
**Endpoint:** `POST /login`  
**Authentication:** Not required  
**Description:** Authenticate user and create session

**Request:**
```json
{
  "usr": "user@example.com",
  "pwd": "userpassword"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "name": "user@example.com",
    "email": "user@example.com",
    "full_name": "John Doe",
    "user_image": "/files/profile.jpg",
    "roles": ["AltruiShare Individual Donor", "Website User"],
    "user_type": "Website User"
  },
  "sid": "session_id_here"
}
```

#### 1.3 User Logout
**Endpoint:** `POST /logout`  
**Authentication:** Required  
**Description:** End user session

**Response:**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

#### 1.4 Get Current User
**Endpoint:** `GET /get_logged_user`  
**Authentication:** Required  
**Description:** Get current authenticated user information

**Response:**
```json
{
  "status": "success",
  "user": {
    "name": "user@example.com",
    "email": "user@example.com",
    "full_name": "John Doe",
    "user_image": "/files/profile.jpg",
    "roles": ["AltruiShare Individual Donor"],
    "user_type": "Website User",
    "language": "en",
    "time_zone": "Africa/Lagos"
  }
}
```

#### 1.5 User Registration
**Endpoint:** `POST /register`  
**Authentication:** Not required  
**Description:** Register a new user (automatically assigns AltruiShare Individual Donor role for Website Users)

**Request:**
```json
{
  "email": "newuser@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "password": "securepassword",
  "user_type": "Website User"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "user": {
    "name": "newuser@example.com",
    "email": "newuser@example.com",
    "full_name": "Jane Smith"
  },
  "sid": "session_id_here"
}
```

#### 1.6 Forgot Password
**Endpoint:** `POST /forgot_password`  
**Authentication:** Not required  
**Description:** Send password reset email

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "If the email exists, a password reset link has been sent"
}
```

#### 1.7 Change Password
**Endpoint:** `POST /change_password`  
**Authentication:** Required  
**Description:** Change user password

**Request:**
```json
{
  "old_password": "currentpassword",
  "new_password": "newpassword"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

#### 1.8 Update Profile
**Endpoint:** `POST /update_profile`  
**Authentication:** Required  
**Description:** Update user profile information

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "location": "Lagos, Nigeria"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "user": {
    "name": "user@example.com",
    "email": "user@example.com",
    "full_name": "John Doe",
    "user_image": "/files/profile.jpg"
  }
}
```

#### 1.9 Check Session
**Endpoint:** `GET /check_session`  
**Authentication:** Required  
**Description:** Validate current session

**Response:**
```json
{
  "status": "success",
  "message": "Session is valid",
  "valid": true,
  "user": "user@example.com"
}
```

---

## 2. Needs Management API

### Base Path: `/altruishare.as_api.need_api`

#### 2.1 Create Need
**Endpoint:** `POST /create_need`  
**Authentication:** Required  
**Roles:** Need Manager, Organization Administrator  
**Description:** Create a new need request

**Request:**
```json
{
  "title": "Food Support for 100 Families",
  "description": "Urgent need for food supplies for flood victims",
  "category": "Food",
  "type": "Emergency Food",
  "organisation": "ORG-001",
  "quantity": 100,
  "unit": "Nos",
  "rate": 5000.00,
  "urgency": "High",
  "start_date": "2025-09-10 00:00:00",
  "end_date": "2025-09-30 23:59:59",
  "address_of_needs": "ADDR-001",
  "latitude": 6.5244,
  "longitude": 3.3792
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Need created successfully",
  "data": {
    "need_id": "NEED-2025-001",
    "status": "Draft"
  }
}
```

#### 2.2 Get Needs
**Endpoint:** `GET /get_needs_by_filters`  
**Authentication:** Required  
**Description:** Get filtered list of needs

**Query Parameters:**
- `name` (optional): Search by need name
- `need_type` (optional): Filter by need type
- `location` (optional): Filter by location
- `category` (optional): Filter by category

**Example:** `GET /get_needs_by_filters?category=Food&location=Lagos`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "name": "NEED-2025-001",
      "title": "Food Support for 100 Families",
      "description": "Urgent need for food supplies...",
      "category": "Food",
      "type": "Emergency Food",
      "organisation": "ORG-001",
      "organisation_name": "Lagos Food Bank",
      "quantity": 100,
      "unit": "Nos",
      "rate": 5000.00,
      "amount": 500000.00,
      "urgency": "High",
      "status": "Active",
      "fulfillment_status": "Open",
      "percentage": 0.00,
      "start_date": "2025-09-10 00:00:00",
      "end_date": "2025-09-30 23:59:59"
    }
  ]
}
```

#### 2.3 Update Need
**Endpoint:** `PUT /update_need`  
**Authentication:** Required  
**Roles:** Need Manager, Organization Administrator  
**Description:** Update an existing need

**Request:**
```json
{
  "need_id": "NEED-2025-001",
  "title": "Food Support for 150 Families",
  "quantity": 150,
  "amount": 750000.00,
  "status": "Active"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Need updated successfully",
  "data": {
    "need_id": "NEED-2025-001",
    "changes_applied": ["title", "quantity", "amount", "status"]
  }
}
```

---

## 3. Donations Management API

### Base Path: `/altruishare.as_api.donation`

#### 3.1 Create Donation
**Endpoint:** `POST /create_donation`  
**Authentication:** Required  
**Description:** Create a new donation

**Request (Monetary Donation):**
```json
{
  "need_id": "NEED-2025-001",
  "donation_type": "Monetary",
  "amount": 50000.00,
  "payment_method": "SeerBit Credit Card",
  "anonymous": false,
  "notes": "Hope this helps the flood victims"
}
```

**Request (Item Donation):**
```json
{
  "need_id": "NEED-2025-001",
  "donation_type": "Items",
  "items": [
    {
      "type": "Food",
      "description": "Rice bags",
      "quantity": 20,
      "unit": "Bags",
      "condition": "New"
    }
  ],
  "pickup_required": true,
  "donor_address_id": "ADDR-002",
  "anonymous": false
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Donation created successfully",
  "data": {
    "donation_id": "DON-2025-001",
    "payment_required": true,
    "logistics_required": false
  }
}
```

#### 3.2 List Donations
**Endpoint:** `GET /list_donations`  
**Authentication:** Required  
**Description:** Get user's donations or all donations (based on permissions)

**Query Parameters:**
- `filters` (optional): JSON string with filter criteria
- `start` (optional): Starting record (default: 0)
- `page_length` (optional): Records per page (default: 20)
- `order_by` (optional): Sort order (default: "creation desc")

**Example:** `GET /list_donations?start=0&page_length=10`

**Response:**
```json
{
  "status": "success",
  "data": {
    "donations": [
      {
        "name": "DON-2025-001",
        "donation_type": "Monetary",
        "amount": 50000.00,
        "status": "Completed",
        "need_id": "NEED-2025-001",
        "recipient_organisation": "Lagos Food Bank",
        "payment_status": "Completed",
        "creation": "2025-09-08 19:22:47"
      }
    ],
    "total": 1
  }
}
```

---

## 4. Payment API

### Base Path: `/altruishare.as_api.payment_api`

#### 4.1 Create Payment Request
**Endpoint:** `POST /create_payment_request`  
**Authentication:** Required  
**Description:** Create a payment request for a donation

**Request:**
```json
{
  "amount": 50000.00,
  "currency": "NGN",
  "payment_method": "SeerBit Credit Card",
  "donor_email": "donor@example.com",
  "donor_name": "John Doe",
  "organization": "ORG-001",
  "need_id": "NEED-2025-001",
  "callback_url": "https://your-site.com/payment/callback"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "donation_id": "DON-2025-001",
    "payment_reference": "PAY-20250908-001",
    "amount": 50000.00,
    "currency": "NGN",
    "gateway_config": {
      "public_key": "pk_test_...",
      "checkout_url": "https://checkout.seerbitapi.com/"
    }
  }
}
```

#### 4.2 Verify Payment
**Endpoint:** `POST /verify_payment`  
**Authentication:** Required  
**Description:** Verify payment status

**Request:**
```json
{
  "payment_reference": "PAY-20250908-001"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment_status": "completed",
    "donation": {
      "name": "DON-2025-001",
      "amount": 50000.00,
      "status": "Completed"
    }
  }
}
```

#### 4.3 Get Payment Status
**Endpoint:** `GET /get_payment_status`  
**Authentication:** Required  
**Description:** Get current payment status

**Query Parameters:**
- `reference`: Payment reference

**Example:** `GET /get_payment_status?reference=PAY-20250908-001`

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment_status": "processing",
    "donation": {
      "name": "DON-2025-001",
      "payment_reference": "PAY-20250908-001"
    }
  }
}
```

#### 4.4 Get Payment Methods
**Endpoint:** `GET /get_payment_methods`  
**Authentication:** Required  
**Description:** Get available payment methods

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment_methods": [
      {
        "name": "SeerBit Credit Card",
        "type": "card",
        "enabled": true,
        "currencies": ["NGN", "USD"]
      },
      {
        "name": "Bank Transfer",
        "type": "transfer",
        "enabled": true,
        "currencies": ["NGN"]
      }
    ]
  }
}
```

---

## 5. Resource Management API

### Base Path: `/altruishare.as_api.resources`

#### 5.1 Create Resource Request
**Endpoint:** `POST /create_resource_request`  
**Authentication:** Required  
**Description:** Create a new resource request

**Request:**
```json
{
  "resource_type": "Transportation",
  "quantity": 2,
  "location": "Lagos",
  "urgency": "High",
  "description": "Need vehicles for food distribution",
  "required_date": "2025-09-15"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Resource request created successfully",
  "data": {
    "request_id": "REQ-2025-001",
    "status": "pending"
  }
}
```

#### 5.2 Allocate Resource
**Endpoint:** `POST /allocate_resource`  
**Authentication:** Required  
**Roles:** Resource Manager  
**Description:** Allocate resources to a request

**Request:**
```json
{
  "request_id": "REQ-2025-001",
  "allocation_data": {
    "allocator_id": "USR-001",
    "quantities": {
      "RES-001": 1,
      "RES-002": 1
    },
    "notes": "Vehicles allocated for emergency distribution"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Resources allocated successfully",
  "data": {
    "allocation_id": "ALLOC-001",
    "request_status": "fulfilled"
  }
}
```

#### 5.3 Get Resource Availability
**Endpoint:** `GET /get_resource_availability`  
**Authentication:** Required  
**Description:** Check available resources

**Query Parameters:**
- `resource_type` (optional): Filter by resource type
- `location` (optional): Filter by location

**Response:**
```json
{
  "status": "success",
  "data": {
    "resources": [
      {
        "resource_id": "RES-001",
        "type": "Transportation",
        "description": "Delivery Van",
        "available_quantity": 2,
        "location": "Lagos"
      }
    ]
  }
}
```

---

## 6. Impact Tracking API

### Base Path: `/altruishare.as_api.impact_api`

#### 6.1 Record Impact
**Endpoint:** `POST /record_impact`  
**Authentication:** Required  
**Roles:** Impact Manager, Organization Administrator  
**Description:** Record impact metrics for donations

**Request:**
```json
{
  "donation_id": "DON-2025-001",
  "impact_type": "People Fed",
  "impact_category": "Food Security",
  "quantitative_value": 100,
  "unit": "People",
  "description": "100 families received food packages",
  "evidence_urls": ["/files/impact_photo1.jpg"],
  "recorded_date": "2025-09-15"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Impact recorded successfully",
  "data": {
    "impact_id": "IMP-2025-001",
    "verification_status": "pending"
  }
}
```

#### 6.2 Get Impact Analytics
**Endpoint:** `GET /get_impact_analytics`  
**Authentication:** Required  
**Description:** Get impact analytics and metrics

**Query Parameters:**
- `date_range` (optional): Date range filter
- `organization` (optional): Filter by organization
- `impact_type` (optional): Filter by impact type

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_impact": {
      "people_helped": 1250,
      "funds_disbursed": 2500000,
      "projects_completed": 15
    },
    "by_category": {
      "Food Security": 500000,
      "Education": 800000,
      "Healthcare": 1200000
    },
    "monthly_trends": [
      {
        "month": "2025-08",
        "impact_value": 300000
      }
    ]
  }
}
```

#### 6.3 Get Donation Impact
**Endpoint:** `GET /get_donation_impact`  
**Authentication:** Required  
**Description:** Get impact specific to a donation

**Query Parameters:**
- `donation_id`: Donation ID

**Response:**
```json
{
  "status": "success",
  "data": {
    "donation_id": "DON-2025-001",
    "impacts": [
      {
        "impact_type": "People Fed",
        "value": 100,
        "unit": "People",
        "description": "100 families received food packages",
        "evidence": ["/files/impact_photo1.jpg"],
        "verified": true
      }
    ]
  }
}
```

---

## 7. Verification API

### Base Path: `/altruishare.as_api.verification_api`

#### 7.1 Submit Verification
**Endpoint:** `POST /submit_verification`  
**Authentication:** Required  
**Description:** Submit organization or impact for verification

**Request:**
```json
{
  "verification_type": "Organization",
  "subject_id": "ORG-001",
  "documents": ["/files/registration_cert.pdf"],
  "notes": "Official registration documents attached"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Verification submitted successfully",
  "data": {
    "verification_id": "VER-2025-001",
    "status": "pending"
  }
}
```

#### 7.2 Approve Verification
**Endpoint:** `POST /approve_verification`  
**Authentication:** Required  
**Roles:** Verification Manager  
**Description:** Approve a verification request

**Request:**
```json
{
  "verification_id": "VER-2025-001"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Verification approved successfully",
  "data": {
    "verification_id": "VER-2025-001",
    "status": "approved"
  }
}
```

---

## 8. PWA (Progressive Web App) API

### Base Path: `/altruishare.as_api.pwa_api`

#### 8.1 Get User Roles
**Endpoint:** `GET /get_user_roles`  
**Authentication:** Not required  
**Description:** Get available roles for current user

**Response:**
```json
{
  "status": "success",
  "data": {
    "roles": ["AltruiShare Individual Donor", "Website User"],
    "primary_role": "AltruiShare Individual Donor"
  }
}
```

#### 8.2 Get Dashboard Data
**Endpoint:** `GET /get_dashboard_data`  
**Authentication:** Required  
**Description:** Get role-specific dashboard data

**Query Parameters:**
- `role`: User role for dashboard

**Response:**
```json
{
  "status": "success",
  "data": {
    "stats": {
      "total_donations": 5,
      "total_amount": 250000,
      "people_helped": 500
    },
    "recent_donations": [...],
    "active_needs": [...],
    "impact_summary": {...}
  }
}
```

---

## 9. User Management API - Phase 2 ✅

### Base Path: `/altruishare.as_api.user_api`

#### 9.1 Get User Profile
**Endpoint:** `POST /get_user_profile`  
**Authentication:** Required  
**Description:** Get detailed user profile information

**Request:**
```json
{
  "user_id": "user@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user_id": "user@example.com",
    "full_name": "John Doe",
    "email": "user@example.com",
    "roles": ["AltruiShare Individual Donor"],
    "profile_data": {},
    "organizations": []
  }
}
```

#### 9.2 Update User Profile
**Endpoint:** `POST /update_user_profile`  
**Authentication:** Required  
**Description:** Update user profile information

#### 9.3 Update User Role
**Endpoint:** `POST /update_user_role`  
**Authentication:** Admin Required  
**Description:** Update user's role assignment

#### 9.4 Get User Organizations
**Endpoint:** `POST /get_user_organizations`  
**Authentication:** Required  
**Description:** Get organizations associated with user

#### 9.5 Join Organization
**Endpoint:** `POST /join_organization`  
**Authentication:** Required  
**Description:** Request to join an organization

#### 9.6 Leave Organization
**Endpoint:** `POST /leave_organization`  
**Authentication:** Required  
**Description:** Leave an organization

#### 9.7 Search Users
**Endpoint:** `POST /search_users`  
**Authentication:** Required  
**Description:** Search for users with filters

#### 9.8 Get User Activity
**Endpoint:** `POST /get_user_activity`  
**Authentication:** Required  
**Description:** Get user activity and engagement history

---

## 10. Volunteer Management API - Phase 2 ✅

### Base Path: `/altruishare.as_api.volunteer_api`

#### 10.1 Create Volunteer Opportunity
**Endpoint:** `POST /create_volunteer_opportunity`  
**Authentication:** Required  
**Description:** Create a new volunteer opportunity

**Request:**
```json
{
  "title": "Community Garden Cleanup",
  "description": "Help clean and maintain community garden",
  "organization": "org_id",
  "location": "Central Park",
  "date_time": "2025-09-15 09:00:00",
  "duration_hours": 4,
  "max_volunteers": 20,
  "skills_required": ["Gardening", "Physical Work"]
}
```

#### 10.2 Get Volunteer Opportunities
**Endpoint:** `POST /get_volunteer_opportunities`  
**Authentication:** Required  
**Description:** List available volunteer opportunities

#### 10.3 Register for Opportunity
**Endpoint:** `POST /register_for_opportunity`  
**Authentication:** Required  
**Description:** Register to volunteer for an opportunity

#### 10.4 Get Volunteer History
**Endpoint:** `POST /get_volunteer_history`  
**Authentication:** Required  
**Description:** Get user's volunteer participation history

#### 10.5 Log Volunteer Hours
**Endpoint:** `POST /log_volunteer_hours`  
**Authentication:** Required  
**Description:** Log hours worked for volunteer activity

#### 10.6 Update Volunteer Status
**Endpoint:** `POST /update_volunteer_status`  
**Authentication:** Required  
**Description:** Update volunteer participation status

#### 10.7 Get Opportunity Details
**Endpoint:** `POST /get_opportunity_details`  
**Authentication:** Required  
**Description:** Get detailed information about volunteer opportunity

---

## 11. File Upload Management API - Phase 2 ✅

### Base Path: `/altruishare.as_api.file_api`

#### 11.1 Upload File
**Endpoint:** `POST /upload_file`  
**Authentication:** Required  
**Description:** Upload files with multi-format support

**Request:** Multipart form data
- `file`: File to upload
- `file_type`: Type category (images/documents/media)
- `attach_to_doctype`: Document type to attach to
- `attach_to_name`: Document name to attach to
- `is_private`: Privacy setting (0/1)
- `folder`: Folder location

**Response:**
```json
{
  "status": "success",
  "data": {
    "file_id": "unique_file_id",
    "file_name": "document.pdf",
    "file_url": "/files/document.pdf",
    "file_size": 1024000,
    "is_private": 0
  }
}
```

#### 11.2 Get File Info
**Endpoint:** `POST /get_file_info`  
**Authentication:** Required  
**Description:** Get file metadata and information

#### 11.3 Delete File Upload
**Endpoint:** `POST /delete_file_upload`  
**Authentication:** Required  
**Description:** Delete uploaded file

#### 11.4 Get User Files
**Endpoint:** `POST /get_user_files`  
**Authentication:** Required  
**Description:** List files uploaded by user

#### 11.5 Get Attached Files
**Endpoint:** `POST /get_attached_files`  
**Authentication:** Required  
**Description:** Get files attached to specific document

#### 11.6 Update File Info
**Endpoint:** `POST /update_file_info`  
**Authentication:** Required  
**Description:** Update file metadata

#### 11.7 Get File Statistics
**Endpoint:** `POST /get_file_statistics`  
**Authentication:** Required  
**Description:** Get file usage statistics

---

## 12. Notification Management API - Phase 2 ✅

### Base Path: `/altruishare.as_api.notification_api`

#### 12.1 Create Notification
**Endpoint:** `POST /create_notification`  
**Authentication:** Required  
**Description:** Create and send notifications

**Request:**
```json
{
  "subject": "New Donation Received",
  "message": "You have received a new donation",
  "recipient_type": "user",
  "recipients": ["user1@example.com"],
  "notification_type": "Info",
  "priority": "Medium",
  "send_email": 1,
  "send_sms": 0
}
```

#### 12.2 Get User Notifications
**Endpoint:** `POST /get_user_notifications`  
**Authentication:** Required  
**Description:** Get notifications for current user

**Response:**
```json
{
  "status": "success",
  "data": {
    "notifications": [],
    "unread_count": 5,
    "total_count": 25
  }
}
```

#### 12.3 Mark Notification Read
**Endpoint:** `POST /mark_notification_read`  
**Authentication:** Required  
**Description:** Mark notifications as read

#### 12.4 Delete Notification
**Endpoint:** `POST /delete_notification`  
**Authentication:** Required  
**Description:** Delete notifications

#### 12.5 Get Notification Settings
**Endpoint:** `POST /get_notification_settings`  
**Authentication:** Required  
**Description:** Get user notification preferences

#### 12.6 Update Notification Settings
**Endpoint:** `POST /update_notification_settings`  
**Authentication:** Required  
**Description:** Update notification preferences

#### 12.7 Send System Alert
**Endpoint:** `POST /send_system_alert`  
**Authentication:** Admin Required  
**Description:** Send system-wide alerts

#### 12.8 Get Notification Statistics
**Endpoint:** `POST /get_notification_statistics`  
**Authentication:** Admin Required  
**Description:** Get notification analytics

---

## Role-Based Access Control

### User Roles and Permissions

#### 1. System Manager
- Full access to all endpoints
- System administration capabilities

#### 2. AltruiShare System Administrator  
- Complete system management and configuration
- All administrative functions across the platform

#### 3. AltruiShare Administrator
- Manage organizations, users, and content
- Access to most administrative functions

#### 4. AltruiShare Organization Administrator
- Manage organization's needs and donations
- Access organization-specific data and member management

#### 5. AltruiShare Organization Member
- Create and manage needs for their organization
- View organization-related data and participate in activities

#### 6. AltruiShare Individual Donor
- Create personal donations
- View own donation history
- Access impact reports for their donations

#### 7. AltruiShare Corporate Donor
- Corporate donation management
- Enhanced donation capabilities for business entities

#### 8. AltruiShare Corporate User
- Corporate account management
- CSR program integration and reporting

#### 9. AltruiShare Content Moderator
- Review and moderate platform content
- Content approval and verification management

#### 10. AltruiShare Verifier
- Organization and impact verification
- Document review and approval processes

#### 11. AltruiShare Volunteer
- Volunteer opportunity management
- Time tracking and activity reporting

#### 12. AltruiShare Logistics Provider
- Logistics and delivery management
- Resource transportation coordination

#### 13. AltruiShare Service Provider
- Service-based contribution management
- Professional service offerings

---

## Error Handling

### Common Error Responses

#### Authentication Error (401)
```json
{
  "status": "error",
  "message": "Authentication required",
  "error_code": "AUTH_REQUIRED"
}
```

#### Permission Error (403)
```json
{
  "status": "error",
  "message": "You are not permitted to access this resource",
  "error_code": "PERMISSION_DENIED"
}
```

#### Validation Error (400)
```json
{
  "status": "error",
  "message": "Invalid input data",
  "error_code": "VALIDATION_ERROR",
  "details": {
    "field": "amount",
    "message": "Amount must be greater than 0"
  }
}
```

#### Not Found Error (404)
```json
{
  "status": "error",
  "message": "Resource not found",
  "error_code": "NOT_FOUND"
}
```

#### Server Error (500)
```json
{
  "status": "error",
  "message": "Internal server error",
  "error_code": "SERVER_ERROR"
}
```

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Payment endpoints**: 10 requests per minute
- **General endpoints**: 100 requests per minute
- **Public endpoints**: 60 requests per minute

---

## Webhook Events

### Payment Webhooks
**Endpoint:** `POST /webhook/payment`  
**Description:** Receive payment status updates from payment gateways

**Headers:**
```
X-Webhook-Signature: sha256=...
Content-Type: application/json
```

**Sample Payload:**
```json
{
  "event": "payment.completed",
  "payment_reference": "PAY-20250908-001",
  "status": "success",
  "amount": 50000.00,
  "currency": "NGN",
  "gateway": "seerbit"
}
```

---

## Testing

### Test Environment
- Base URL: `https://test.altruishare.com/api/method/altruishare`
- Test credentials available upon request

### Postman Collection
Import the AltruiShare API collection from `/docs/altruishare_api.postman_collection.json`

### cURL Examples

#### Login
```bash
curl -X POST "https://your-domain.com/api/method/altruishare.as_api.auth_api.login" \
  -H "Content-Type: application/json" \
  -d '{"usr": "test@example.com", "pwd": "password"}'
```

#### Create Need
```bash
curl -X POST "https://your-domain.com/api/method/altruishare.as_api.need_api.create_need" \
  -H "Content-Type: application/json" \
  -H "Cookie: sid=your_session_id" \
  -d '{"title": "Food Support", "category": "Food", "organisation": "ORG-001"}'
```

#### Get Needs
```bash
curl -X GET "https://your-domain.com/api/method/altruishare.as_api.need_api.get_needs_by_filters?category=Food" \
  -H "Cookie: sid=your_session_id"
```

---

## SDK and Libraries

### JavaScript SDK
```javascript
import AltruiShareAPI from 'altruishare-sdk';

const api = new AltruiShareAPI({
  baseURL: 'https://your-domain.com',
  apiKey: 'your-api-key'
});

// Login
const user = await api.auth.login('user@example.com', 'password');

// Create donation
const donation = await api.donations.create({
  need_id: 'NEED-001',
  amount: 50000,
  donation_type: 'Monetary'
});
```

### Python SDK
```python
from altruishare_sdk import AltruiShareAPI

api = AltruiShareAPI(
    base_url='https://your-domain.com',
    api_key='your-api-key'
)

# Login
user = api.auth.login('user@example.com', 'password')

# Create need
need = api.needs.create(
    title='Food Support',
    category='Food',
    organisation='ORG-001'
)
```

---

## Support and Contact

### Technical Support
- **Email:** dev@altruishare.com
- **Documentation:** https://docs.altruishare.com
- **GitHub Issues:** https://github.com/altruishare/api/issues

### Business Inquiries
- **Email:** business@altruishare.com
- **Phone:** +234-xxx-xxx-xxxx

---

## Changelog

### Version 2.0.0 (2025-09-08) - PHASE 2 COMPLETE ✅
- **User Management System:** 8 comprehensive endpoints
- **Volunteer Management System:** 7 full-featured endpoints  
- **File Upload Management:** 7 secure upload endpoints
- **Notification System:** 8 multi-channel endpoints
- **Total New Endpoints:** 30
- **System Completion:** 88% (69 total endpoints)
- Enhanced security and error handling
- Comprehensive documentation update

### Version 1.0.0 (2025-09-08) - PHASE 1 COMPLETE
- Initial API release
- Authentication system (9 endpoints)
- Needs management (14 endpoints)
- Organization management (8 endpoints)
- Payment integration (8 endpoints)
- Impact tracking
- Basic verification system

---

---

---

## 13. Lookup Values API - Complete Reference ✅

### Base Path: `/altruishare.as_api.lookup_api`

#### 13.1 Get All Lookup Values
**Endpoint:** `GET /get_lookup_values`  
**Authentication:** Not required  
**Description:** Get all available lookup values for forms and API parameters

**Response:**
```json
{
  "status": "success",
  "message": "Lookup values retrieved successfully",
  "data": {
    "user_management": {
      "user_types": ["Website User", "System User"],
      "altruishare_roles": [
        "AltruiShare System Administrator",
        "AltruiShare Administrator",
        "AltruiShare Organization Administrator",
        "AltruiShare Organization Member",
        "AltruiShare Individual Donor",
        "AltruiShare Corporate Donor",
        "AltruiShare Corporate User",
        "AltruiShare Content Moderator",
        "AltruiShare Verifier",
        "AltruiShare Volunteer",
        "AltruiShare Logistics Provider",
        "AltruiShare Service Provider"
      ],
      "default_user_type": "Website User",
      "default_role": "AltruiShare Individual Donor"
    },
    "needs_management": {
      "categories": ["Food", "Education", "Healthcare", "Housing"],
      "types": ["Emergency", "Ongoing", "Seasonal"],
      "urgency_levels": ["Low", "Normal", "High", "Critical"],
      "status_options": ["Draft", "Active", "Paused", "Completed", "Canceled"],
      "fulfillment_status": ["Open", "In Progress", "Fulfilled", "Partial Fulfilled", "Canceled"],
      "visibility_options": ["Public", "Private", "Targeted"]
    },
    "donations": {
      "types": ["Monetary", "Items", "Services", "Time/Volunteer"],
      "status_options": ["Initiated", "Processing", "Completed", "Allocation", "Impact Reported", "Failed", "Canceled"],
      "payment_status": ["Pending", "Completed", "Failed", "Refunded"],
      "logistics_status": ["Awaiting Pickup", "In Transit", "Delivered", "Completed"]
    },
    "payments": {
      "gateways": ["SeerBit Credit Card", "SeerBit Bank Transfer", "Bank Transfer", "Mobile Money", "Cash"],
      "currencies": ["NGN", "USD", "EUR", "GBP"],
      "default_currency": "NGN"
    }
  },
  "timestamp": "2025-09-10 15:30:00"
}
```

#### 13.2 Get Available Roles
**Endpoint:** `GET /get_roles`  
**Authentication:** Not required  
**Description:** Get all available AltruiShare roles

**Response:**
```json
{
  "status": "success",
  "data": {
    "altruishare_roles": [
      "AltruiShare System Administrator",
      "AltruiShare Administrator",
      "AltruiShare Organization Administrator",
      "AltruiShare Organization Member",
      "AltruiShare Individual Donor",
      "AltruiShare Corporate Donor",
      "AltruiShare Corporate User",
      "AltruiShare Content Moderator",
      "AltruiShare Verifier",
      "AltruiShare Volunteer",
      "AltruiShare Logistics Provider",
      "AltruiShare Service Provider"
    ],
    "default_role": "AltruiShare Individual Donor",
    "total_count": 12
  }
}
```

#### 13.3 Get User Types
**Endpoint:** `GET /get_user_types`  
**Authentication:** Not required  
**Description:** Get all available user types

**Response:**
```json
{
  "status": "success",
  "data": {
    "user_types": ["Website User", "System User"],
    "default_type": "Website User",
    "frontend_default": "Website User"
  }
}
```

---

## API Reference Values & Lookup Lists

### User Management

#### User Types
Valid values for `user_type` field:
```json
["Website User", "System User"]
```
**Default for frontend users**: `"Website User"`

#### Available Roles  
All AltruiShare roles that can be assigned to users:
```json
[
  "AltruiShare System Administrator",
  "AltruiShare Administrator", 
  "AltruiShare Organization Administrator",
  "AltruiShare Organization Member",
  "AltruiShare Individual Donor",
  "AltruiShare Corporate Donor",
  "AltruiShare Corporate User",
  "AltruiShare Content Moderator",
  "AltruiShare Verifier",
  "AltruiShare Volunteer",
  "AltruiShare Logistics Provider",
  "AltruiShare Service Provider"
]
```
**Default role assignment**: New users automatically get `"AltruiShare Individual Donor"`

### Needs Management

#### Need Categories
Link to `Needs Category` DocType. Create custom categories as needed.

#### Need Types  
Link to `Needs Type` DocType. Create custom types as needed.

#### Need Urgency Levels
```json
["Low", "Normal", "High", "Critical"]
```

#### Need Status Values
```json
["Draft", "Active", "Paused", "Completed", "Canceled"]
```

#### Need Fulfillment Status
```json
["Open", "In Progress", "Fulfilled", "Partial Fulfilled", "Canceled"]
```

#### Need Visibility Options
```json
["Public", "Private", "Targeted"]
```

### Donations Management

#### Donation Status Values
```json
["Initiated", "Processing", "Completed", "Allocation", "Impact Reported", "Failed", "Canceled"]
```

#### Payment Status Values
```json
["Pending", "Completed", "Failed", "Refunded"]
```

#### Logistics Status Values
```json
["Awaiting Pickup", "In Transit", "Delivered", "Completed"]
```

#### Donation Types
```json
["Monetary", "Items", "Services", "Time/Volunteer"]
```

### Payment Methods

#### Available Payment Gateways
- `"SeerBit Credit Card"`
- `"SeerBit Bank Transfer"`
- `"Bank Transfer"`
- `"Mobile Money"`
- `"Cash"`

#### Supported Currencies
```json
["NGN", "USD", "EUR", "GBP"]
```
**Default**: `"NGN"`

### Address & Location

#### Address Types
Link to `Address` DocType from ERPNext.

#### Units of Measurement (UOM)
Link to `UOM` DocType. Common values:
- `"Nos"` (Numbers/Pieces)
- `"Kg"` (Kilograms)
- `"Litre"` (Litres)
- `"Box"` (Boxes)
- `"Bag"` (Bags)

### Volunteer Management

#### Volunteer Skills
Link to `Volunteer Skills` DocType. Create as needed.

#### Commitment Types
- `"One-time"`
- `"Weekly"`
- `"Monthly"`
- `"Ongoing"`

### File Management

#### Supported File Types
```json
{
  "images": [".jpg", ".jpeg", ".png", ".gif", ".svg"],
  "documents": [".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx"],
  "media": [".mp4", ".mp3", ".avi", ".mov"]
}
```

#### File Privacy Settings
```json
[0, 1]
```
- `0`: Public file
- `1`: Private file

### Impact & Verification

#### Impact Categories
- `"Food Security"`
- `"Education"`
- `"Healthcare"`
- `"Housing"`
- `"Environment"`
- `"Economic Empowerment"`

#### Verification Status
- `"Pending"`
- `"In Review"`
- `"Approved"`
- `"Rejected"`
- `"Requires Additional Info"`

### Notification Management

#### Notification Types
```json
["Info", "Warning", "Error", "Success"]
```

#### Notification Priorities
```json
["Low", "Medium", "High", "Critical"]
```

#### Notification Channels
```json
["Email", "SMS", "Push", "In-App"]
```

---

## Terms of Service

By using the AltruiShare API, you agree to our [Terms of Service](https://altruishare.com/terms) and [Privacy Policy](https://altruishare.com/privacy).
