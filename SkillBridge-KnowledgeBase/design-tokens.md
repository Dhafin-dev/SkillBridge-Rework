# Design Tokens Specification — SkillBridge Rework

This document serves as the machine-readable design token registry for SkillBridge. It defines the CSS Custom Properties for colors, typography, spacing, shadows, and responsive breakpoints.

---

## 1. Color Tokens (CSS Variables)

```css
:root {
  /* Brand Primary (Indigo & Royal Blue) */
  --color-primary: #4F46E5;          /* Indigo 600 */
  --color-primary-hover: #4338CA;    /* Indigo 700 */
  --color-primary-light: #EEF2FF;    /* Indigo 50 */
  --color-primary-focus: rgba(79, 70, 229, 0.25);

  /* Brand Secondary & Accents */
  --color-secondary: #0D9488;        /* Teal 600 */
  --color-secondary-light: #F0FDFA;  /* Teal 50 */
  --color-accent-amber: #D97706;     /* Amber 600 */

  /* Neutral Surface & Backgrounds */
  --color-bg-app: #F8FAFC;           /* Slate 50 */
  --color-surface-card: #FFFFFF;     /* Pure White */
  --color-surface-muted: #F1F5F9;    /* Slate 100 */
  --color-surface-elevated: #FFFFFF; /* High Elevation */

  /* Borders & Dividers */
  --color-border-subtle: #E2E8F0;    /* Slate 200 */
  --color-border-focus: #4F46E5;     /* Indigo 600 */

  /* Text & Typography */
  --color-text-main: #0F172A;        /* Slate 900 */
  --color-text-secondary: #475569;   /* Slate 600 */
  --color-text-muted: #94A3B8;       /* Slate 400 */
  --color-text-inverse: #FFFFFF;     /* White */

  /* Semantic Feedback */
  --color-success: #10B981;          /* Emerald 500 */
  --color-success-bg: #ECFDF5;       /* Emerald 50 */
  --color-warning: #F59E0B;          /* Amber 500 */
  --color-warning-bg: #FFFBEB;       /* Amber 50 */
  --color-danger: #EF4444;           /* Red 500 */
  --color-danger-bg: #FEF2F2;        /* Red 50 */
  --color-info: #3B82F6;             /* Blue 500 */
  --color-info-bg: #EFF6FF;          /* Blue 50 */
}
```

---

## 2. Typography Tokens

```css
:root {
  --font-family-base: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-code: 'JetBrains Mono', 'Fira Code', monospace;

  /* Font Sizes & Line Heights */
  --font-size-xs: 0.75rem;    /* 12px */
  --line-height-xs: 1.0rem;

  --font-size-sm: 0.875rem;   /* 14px */
  --line-height-sm: 1.25rem;

  --font-size-base: 1.0rem;   /* 16px */
  --line-height-base: 1.5rem;

  --font-size-lg: 1.125rem;   /* 18px */
  --line-height-lg: 1.75rem;

  --font-size-xl: 1.25rem;    /* 20px */
  --line-height-xl: 1.75rem;

  --font-size-2xl: 1.5rem;    /* 24px */
  --line-height-2xl: 2.0rem;

  --font-size-3xl: 1.875rem;  /* 30px */
  --line-height-3xl: 2.25rem;

  --font-size-4xl: 2.25rem;   /* 36px */
  --line-height-4xl: 2.5rem;

  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}
```

---

## 3. Spacing & Metric Scale (8px Baseline)

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1.0rem;   /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2.0rem;   /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3.0rem;  /* 48px */
  --space-16: 4.0rem;  /* 64px */
}
```

---

## 4. Radius & Elevation Tokens

```css
:root {
  /* Border Radii */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* Box Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

---

## 5. Responsive Breakpoint Standards

| Token Name | Viewport Minimum | Target Form Factor |
|---|---|---|
| `sm` | `640px` | Large Mobile / Phablet |
| `md` | `768px` | Tablet Portrait |
| `lg` | `1024px` | Tablet Landscape / Small Laptop |
| `xl` | `1280px` | Standard Desktop Viewport |
| `2xl` | `1536px` | Wide Desktop Monitor |
