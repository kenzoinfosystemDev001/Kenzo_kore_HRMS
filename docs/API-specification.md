# Kenzo HRMS - API Specification

## 1. Overview
The Kenzo HRMS API is a RESTful API. It uses standard HTTP verbs, JSON payloads, and relies on standard HTTP status codes.

- **Base URL:** `https://api.kenzohrms.com/api/v1`
- **Content-Type:** `application/json`

## 2. Authentication
Authentication is handled via JWT (JSON Web Tokens).

**Header:**
```http
Authorization: Bearer <your_access_token>
```
- Access tokens expire in 15 minutes.
- Refresh tokens (HTTP-only cookie) are used to obtain new access tokens.

## 3. Standard Response Format
**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Must be a valid email" }
    ]
  }
}
```

## 4. Endpoints

### 4.1 Authentication (`/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/auth/login` | Authenticate user and return tokens |
| POST | `/auth/refresh` | Refresh access token using cookie |
| POST | `/auth/logout` | Invalidate current session |
| GET | `/auth/me` | Get current authenticated user profile |

### 4.2 Organization (`/organization`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/organization/departments` | List all departments |
| POST | `/organization/departments` | Create a new department |
| GET | `/organization/branches` | List all branches |

### 4.3 Employees (`/employees`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/employees` | List employees (supports filters & pagination) |
| POST | `/employees` | Create a new employee |
| GET | `/employees/:id` | Get employee details (360 view) |
| PATCH| `/employees/:id` | Update employee details |

### 4.4 Attendance (`/attendance`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/attendance/clock-in` | Record clock-in time and location |
| POST | `/attendance/clock-out` | Record clock-out time |
| GET | `/attendance/records` | Get attendance history |
| POST | `/attendance/regularize` | Request attendance regularization |

### 4.5 Leave (`/leaves`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/leaves/types` | List available leave types |
| GET | `/leaves/balances` | Get current user's leave balances |
| POST | `/leaves/requests` | Apply for leave |
| PATCH| `/leaves/requests/:id/approve`| Approve/Reject a leave request (Managers) |

### 4.6 Payroll (`/payroll`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/payroll/payslips` | List payslips for the current user |
| GET | `/payroll/payslips/:id/pdf` | Download payslip PDF |
| POST | `/payroll/runs` | Initiate a payroll run (Payroll Officer) |

## 5. Rate Limiting
APIs are rate-limited per IP and per Tenant.
- Standard limit: 100 requests / minute / IP
- Headers included in response: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 6. Webhooks
Tenants can configure webhooks to receive real-time updates for events such as:
- `employee.created`, `employee.terminated`
- `leave.approved`, `leave.rejected`
- `payroll.processed`
