# Kenzo HRMS — Part 1 Target Architecture Specification

**Document Version**: 1.0.0  
**Target Organization**: Kenzo InfoSystems Pvt. Ltd.  
**Auditor**: CTO / Principal Software Architect  
**Status**: APPROVED & IMPLEMENTED  

---

## 1. High-Level Target System Topology

```mermaid
graph TD
    Client[Next.js 15 Web Client] -->|HTTPS REST API| NestJS[NestJS Enterprise Backend API]
    NestJS --> Auth[JwtAuthGuard & ThrottlerGuard]
    Auth --> TenantCtx[TenantContext & RBAC Validation]
    TenantCtx --> Service[Domain Services]
    Service --> TxEngine[Prisma Transaction Engine]
    TxEngine --> PostgreSQL[(Neon PostgreSQL - Single Source of Truth)]
```

---

## 2. Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as Next.js Web Client
    participant API as NestJS Auth Controller
    participant DB as Neon PostgreSQL DB

    User->>Client: Enter Email & Password
    Client->>API: POST /api/auth/login
    API->>DB: Query User & Role details
    DB-->>API: User record + passwordHash
    API->>API: Verify bcrypt password hash
    API-->>Client: Return Access Token & Session metadata
    Client->>Client: Store Access Token in Bearer header
    Client->>API: GET /api/auth/me (Bearer Token)
    API-->>Client: Return User Profile & Permissions
```

---

## 3. Employee Creation & Cross-Device Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant Web as Admin Browser
    participant API as NestJS API
    participant DB as Neon PostgreSQL
    actor Employee as New Employee (Browser B)

    Admin->>Web: Submit New Employee Form
    Web->>API: POST /api/employees (Bearer Token)
    API->>API: Validate DTO & User Permissions
    API->>DB: prisma.$transaction(Create User, Employee, UserRole, AuditLog)
    DB-->>API: Transaction Committed (UUID generated)
    API-->>Web: 201 Created (Employee Data)
    Web->>Web: Refetch / Invalidate Query Cache
    Employee->>API: POST /api/auth/login (New Employee Credentials)
    API->>DB: Query User Profile
    DB-->>API: Verified Account
    API-->>Employee: Authenticated Session Granted
```

---

## 4. Multi-Device Real-Time Sync Flow

```mermaid
sequenceDiagram
    autonumber
    participant Dev1 as Device 1 (Chrome)
    participant API as NestJS API
    participant DB as Neon PostgreSQL
    participant Dev2 as Device 2 (Edge / Mobile)

    Dev1->>API: POST /api/leave/requests
    API->>DB: Save Leave Request
    DB-->>API: Persisted Record
    API-->>Dev1: Success Response
    Dev2->>API: GET /api/leave/requests (3s Polling Loop)
    API->>DB: Fetch Latest Requests
    DB-->>API: Updated Requests Array
    API-->>Dev2: Render Fresh Data on Device 2
```
