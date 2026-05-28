---
trigger: always_on
---

# Angular v20+ & TypeScript Master Rules

---
description: Applies to all Angular project files (.ts, .html, .scss) to ensure v20+ standards.
globs: ["**/*.ts", "**/*.html"]
---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## 1. Core Principles
- **Strict Compliance**: Follow Angular v20+ standards. Never provide legacy solutions (pre-v17).
- **Change Detection**: Always set `changeDetection: ChangeDetectionStrategy.OnPush` in the `@Component` decorator.
- **Architecture**: Always use standalone components. Note: `standalone: true` is the default in v20+, do NOT include it in the decorator.

## 2. TypeScript Best Practices
- Use strict type checking.
- Avoid the `any` type; use `unknown` when the type is uncertain.
- Prefer type inference when the type is obvious.

## 3. Angular Modern API (Mandatory)
- **Dependency Injection**: Use the `inject()` function instead of constructor injection.
- **Signals Management**:
    - Use signals for local component state.
    - Use `computed()` for derived state.
    - Use `input()`, `input.required()`, and `output()` instead of decorators.
    - Do NOT use `mutate` on signals; use `update` or `set` instead.
- **Host Bindings**: Do NOT use `@HostBinding` or `@HostListener`. Use the `host` object inside the `@Component` or `@Directive` decorator instead.

## 4. Templates & UI
- **Control Flow**: Use native syntax (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, or `*ngSwitch`.
- **Images**: Use `NgOptimizedImage` for all static images.
- **Styling**: Do NOT use `ngClass` or `ngStyle`. Use `[class.name]` and `[style.property]` bindings instead.
- **Forms**: Prefer Reactive Forms over Template-driven ones.

## 5. Accessibility & Quality
- **Compliance**: Code MUST follow WCAG AA minimums (focus management, ARIA attributes, color contrast).
- **Performance**: Implement lazy loading for feature routes.
- **Structure**: Keep components small and focused on a single responsibility.
- **Paths**: Use relative paths for external templates or styles (relative to the TS file).

## 6. Constraints
- Do not assume globals like `new Date()` are available in templates.
- State transformations must be pure and predictable.