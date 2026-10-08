# Security Specification & Test Payloads for LEEDO Portal

## 1. Data Invariants
1. Apps must have valid `id`, `title`, and `url` strings, with lengths constrained (`title` <= 100, `url` <= 1000).
2. Categories must have valid `id` and `name` strings, with length constrained (`name` <= 80).
3. Notices must have valid `id`, `title`, `content` strings.
4. Employees have valid `eid` and constrained fields. Only valid employee records can be created or updated.
5. Settings document contains valid backgroundConfig and/or customLogo.
6. Catch-all rejects any unauthorized path writes.

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. Ghost Field Injection: Adding `__shadowAdmin: true` to an App payload.
2. Huge String Payload: Title with > 10,000 characters to attempt resource exhaustion.
3. Invalid ID Injection: App ID with forbidden symbols (e.g. `../../../root`).
4. Type Confusion on App order: Setting `order` to a string instead of number.
5. Category with empty or missing name.
6. Notice with content exceeding 100,000 characters.
7. Employee with invalid role (e.g. `role: "super_root_god"`).
8. Arbitrary write to unmapped collection `/unauthorized_secrets/123`.
9. Settings injection with negative blur or invalid type.
10. Malformed URL scheme or non-string URL in App document.
11. Attempting to delete without valid document ID.
12. Bulk modification bypassing schema validation.
