# Kenzo HRMS - Security Checklist

This document outlines the security controls and best practices implemented within Kenzo HRMS to protect sensitive employee and corporate data.

## 1. Authentication Security
- [x] Enforce strong password policies (min 12 chars, uppercase, number, symbol).
- [x] Implement Multi-Factor Authentication (MFA) using TOTP (Authenticator apps).
- [x] Use secure, HTTP-only, SameSite cookies for refresh tokens.
- [x] Implement brute-force protection (lockout after 5 failed attempts).
- [x] Ensure tokens have short expiration times (e.g., 15 mins for access tokens).
- [x] Support Single Sign-On (SSO) via SAML 2.0 or OpenID Connect.

## 2. Authorization (RBAC & Multi-Tenancy)
- [x] Enforce strict tenant isolation on every database query.
- [x] Apply Principle of Least Privilege (PoLP) for all default roles.
- [x] Validate authorization (permissions and scopes) on every API endpoint.
- [x] Prevent Insecure Direct Object References (IDOR) by validating entity ownership.

## 3. Data Encryption
- [x] Encrypt all data at rest using AES-256 (Database and S3 Object Storage).
- [x] Encrypt all data in transit using TLS 1.3.
- [x] Hash passwords using Argon2id or bcrypt (cost factor >= 12).
- [x] Mask sensitive data (e.g., SSN, Bank Accounts) in API responses and UI unless explicitly requested.

## 4. Input Validation & Sanitization
- [x] Validate all incoming request payloads using strict schema validation (e.g., Zod or class-validator).
- [x] Sanitize user inputs to prevent XSS (Cross-Site Scripting).
- [x] Use parameterized queries (handled by Prisma) to prevent SQL Injection.
- [x] Validate file uploads (check MIME type, file extension, and enforce size limits).
- [x] Scan uploaded documents for malware.

## 5. Web Application Security
- [x] Implement CSRF (Cross-Site Request Forgery) tokens for state-changing operations.
- [x] Configure strict Content Security Policy (CSP) headers.
- [x] Use Helmet.js to set standard HTTP security headers (X-Frame-Options, HSTS, X-Content-Type-Options).
- [x] Hide server technology signatures (e.g., `X-Powered-By`).

## 6. Infrastructure & API Security
- [x] Implement global Rate Limiting to mitigate DDoS and scraping.
- [x] Deploy behind a Web Application Firewall (WAF).
- [x] Restrict database access only to application servers (VPC peering/private subnets).

## 7. Audit & Compliance
- [x] Maintain comprehensive Audit Logs for all data mutations (who, what, when, IP).
- [x] Ensure logs cannot be tampered with (append-only storage).
- [x] Provide GDPR compliance tools (Right to be Forgotten, Data Export).
- [x] Implement Automated Data Retention policies (e.g., purge candidate data after 2 years).

## 8. Secrets Management
- [x] Never commit secrets or API keys to version control.
- [x] Use a secure secrets manager (AWS Secrets Manager, HashiCorp Vault) for production.
- [x] Rotate keys and database credentials periodically.
