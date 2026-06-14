# CareerDNA Platform QA Audit Report

This report presents a comprehensive quality assurance audit of the CareerDNA web application platform. The audit covers route validation, visual and layout constraints, browser console warnings, file upload parsing reliability, local storage synchronization, dead code analysis, duplicate logic checks, and architectural security parameters.

---

## Executive Summary

- **Compilation & Routing**: **PASS** (Fresh Next.js production build succeeded with zero TypeScript compiler or Turbopack warnings).
- **Environment Configuration**: **MOCK MODE ACTIVE** (Supabase variables are missing, meaning sandbox authentication and local storage database emulation are operational).
- **Primary Risks Identified**: Synchronous `localStorage` parsing of large files in render loops, duplicate target career profiles and keyword matrices, and a lack of rate limiting/size validation in `/api/resume`.

---

## Severity Level Definitions

* **Critical**: Causes client/server crashes, security vulnerabilities, or blocks main user flows (registration, login, analysis).
* **High**: Restricts core feature integrations or introduces substantial performance/resource bugs.
* **Medium**: Visual anomalies, console warnings, responsive layout overflow, or structural security anti-patterns.
* **Low**: Code cleanup opportunities, minor design inconsistencies, or code duplication.

---

## Detailed QA Audit Findings (12 Points)

### 1. Broken Features
* **Windows File Locks During Concurrent Builds [Severity: High]**
  * *Description*: When the Next.js development server (`npm run dev`) is active in a Windows workspace environment, it maintains locks on compiled files (e.g., `job-matching.segments`). Attempting to run `npm run build` concurrently fails with `EPERM: operation not permitted, unlink`.
  * *Remediation*: Developers must terminate active dev processes or run a clean command (`Remove-Item -Recurse -Force .next`) before compiling release packages on Windows hosts.
* **Sandbox Data Portability [Severity: Medium]**
  * *Description*: In Supabase Mock Auth Mode, all data (user records, resume history logs, interview sessions, tailoring states) resides entirely in browser-scoped `localStorage`. Clearing browser cache or switching client instances completely deletes all user history.
  * *Remediation*: This behavior is expected in mock sandbox settings, but warning labels should be added to notify users that sandbox profiles are non-portable.

### 2. Runtime Errors
* **Initial Chart Container Hydration Bounds [Severity: Medium]**
  * *Description*: Responsive grids container dimensions evaluate to `0` or `-1` during the initial mounting phases of charts in Recharts. This can cause brief rendering glitches during transition animations.
  * *Remediation*: Ensure the component has mounted client-side before rendering Recharts elements, which is correctly addressed by the `mounted` state wrappers, but layout shifts can still occur.

### 3. Console Errors
* **Recharts ResponsiveContainer Layout Warnings [Severity: Medium]**
  * *Description*: The browser developer tools console logs warnings stating: `The width(-1) and height(-1) of chart should be greater than 0, please check the style of container...`. This is caused by `<ResponsiveContainer width="100%" height="100%">` resolving layout dimensions inside parent grid/flex containers before those containers have finished rendering.
  * *Remediation*: Wrap Recharts components in relative-positioned wrapper divs with defined min-width/min-height properties, or supply fixed heights (e.g., `height={220}`) instead of percentage parameters.

### 4. UI Issues
* **Print Layout Panel Exclusions [Severity: Low]**
  * *Description*: The "Print Report" buttons on `/dashboard/resume-analyzer` and `/dashboard/resume-builder` invoke native print operations, but the pages lack print-specific media queries (`@media print`) to hide sidebar navigation menus and button headers.
  * *Remediation*: Add clean utility styling overrides to the global stylesheet:
    ```css
    @media print {
      aside, header, button, nav, .print-hide {
        display: none !important;
      }
      main {
        padding: 0 !important;
        background: white !important;
        color: black !important;
      }
    }
    ```
* **Scrollbar Design Inconsistency [Severity: Low]**
  * *Description*: Scroll panels utilize custom tailwind/CSS classes (like `no-scrollbar` or default browser bars), leading to minor styling differences between panels across Windows, macOS, and Linux browsers.
  * *Remediation*: Standardize custom scroll bar thumb and track layouts in `src/app/globals.css`.

### 5. Mobile Responsiveness Issues
* **Horizontal Overflow of Wide Tables [Severity: Medium]**
  * *Description*: Highly detailed metrics lists (such as keyword match matrices or certifications grids) do not wrap cleanly on viewport screens under 360px width, causing horizontal layout scrollbars to appear.
  * *Remediation*: Use responsive flex boxes with `flex-wrap` and overflow scroll boundaries inside cards.
* **Tight Double Column Input Fields [Severity: Low]**
  * *Description*: Double-column input grids (e.g., First Name / Last Name inputs on profile and registration pages) become cramped on portrait smartphone screens.
  * *Remediation*: Ensure forms use `grid grid-cols-1 sm:grid-cols-2` layout classes.

### 6. Accessibility (a11y) Issues
* **Missing ARIA Labels on Icon-Only Controls [Severity: Medium]**
  * *Description*: Interactive icon-only buttons (such as the certification delete trash icon or the experience addition button) lack `aria-label` properties, preventing screen readers from describing their actions.
  * *Remediation*: Add descriptive `aria-label` attributes to all button tags (e.g., `aria-label="Remove certification"`).
* **Color Contrast Guidelines [Severity: Low]**
  * *Description*: Some dark templates use low-contrast text (e.g., gray description text `text-slate-500` or `text-slate-600` on background `bg-slate-950`), which may fail WCAG AA compliance checks in low ambient light.
  * *Remediation*: Increase text color lightness to at least `slate-400` for primary description panels.

### 7. Performance Bottlenecks
* **Synchronous LocalStorage Parsing [Severity: High]**
  * *Description*: Large objects (such as raw parsed resume texts and version logs) are loaded and parsed via `JSON.parse(localStorage.getItem(...))` directly in rendering cycles. Because `localStorage` access is synchronous and blocking, as version history lists grow, it will block the JavaScript main thread, causing frame drops and input lag.
  * *Remediation*: Move large content caching to IndexedDB or offload history parsing to custom React hooks that cache parsed values in memory.

### 8. Security Concerns
* **Plain Text Sandbox Password Storage [Severity: Medium]**
  * *Description*: In mock sandbox mode, registration credentials (including passwords) are saved in plain text inside `localStorage` under `careerdna_mock_users`. While a mock helper, it presents a risk if users register with their actual passwords.
  * *Remediation*: Add warnings alerting users not to input real passwords when registering in local sandbox mode.
* **Server-Side File Size and Rate Limiting Gaps [Severity: High]**
  * *Description*: `/api/resume` processes files and converts them into array buffers on the server. There is no server-side validation limiting the maximum payload size, and the endpoint lacks rate-limiting mechanisms, making it vulnerable to Denial of Service (DoS) attacks via memory exhaustion.
  * *Remediation*: Implement size limits on multipart form requests (e.g., max 5MB) and introduce rate-limiting middlewares.

### 9. Dead Code
* **Mock Career Matrix Redundancy [Severity: Low]**
  * *Description*: `mockCareers` inside the main dashboard overview page (`page.tsx`) duplicates names and metrics defined in other sub-modules.
  * *Remediation*: Extract career data into a shared database table or global config.

### 10. Unused Components
* **Clean Directory Structuring [Severity: Low]**
  * *Description*: No orphaned view components or dead directories are present. All subdirectories in `src/app/dashboard/` resolve to active routing entry points.

### 11. Duplicate Logic
* **Target Careers Selector List Duplication [Severity: Medium]**
  * *Description*: The `targetCareers` options list is declared independently inside 7 separate frontend files.
  * *Remediation*: Move `targetCareers` to a shared configuration file (`src/lib/constants.ts`) and import it.
* **Role Keywords Array Duplication [Severity: High]**
  * *Description*: Technical keyword maps are defined in both `src/lib/analyzer.ts` and `/dashboard/skill-gap/page.tsx`, causing inconsistencies if skills are added or updated in only one file.
  * *Remediation*: Consolidate all skill categorizations and keyword synsets directly inside `analyzer.ts` and export them.

### 12. Improvement Opportunities
* **Centralized Client State Context [Severity: High]**
  * *Description*: Currently, separate modules (analyzer, tailors, overview, gaps) make independent synchronous calls to `localStorage` to retrieve the latest analyzed resume details.
  * *Remediation*: Build a centralized React Context (e.g., `ResumeProvider` / `useResume()`) that handles loading, parsing, caching, and state synchronization across all views.
