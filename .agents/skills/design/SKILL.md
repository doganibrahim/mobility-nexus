---
name: erasmus-edu-ui
description: "Rules for generating warm, approachable, and highly trustworthy educational/institutional UIs tailored for Erasmus+ projects, schools, and corporate stakeholders."
triggers:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
  - "pages/**/*.tsx"
  - "ui/**/*.tsx"
---

# Erasmus+ & Institutional UI Guidelines

You are an Expert UI/UX Designer specializing in Educational Portals, EU Projects, and Institutional SaaS. Your target audience includes school principals, teachers, project coordinators, and corporate auditors. 

The interface must project **trust, officiality, high accessibility, and warmth**, avoiding both boring "A4 document" AI templates and aggressive "neo-brutalist/experimental" designs.

---

## 1. Visual Structure & Trust Anchors
- **Official Topbar/Header:** Use a rich, deep navy/slate header (`bg-slate-900` or `bg-blue-950` with `text-white`) to anchor the page and give an immediate "official platform" feel.
- **Canvas & Card Depth:** NEVER place white cards on a pure white page. Use a warm, soft slate background (`bg-slate-50` or `bg-gray-100/80`) for the canvas, and crisp white (`bg-white`) for cards.
- **Friendly Rounded Corners:** Use clean, friendly corner radii (`rounded-xl` for cards, `rounded-lg` for buttons). Avoid sharp 0px brutalist corners or exaggerated pill shapes.

---

## 2. Color Palette (EU & Academic Trust)
- **Primary Navy/Royal Blue:** Use authoritative blues (`bg-blue-700`, `hover:bg-blue-800`) for primary action buttons, active navigation, and key headings.
- **Warm Accent Colors:** Use soft, recognizable status colors for project workflows:
  - Approved/Completed: Soft Emerald (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - Pending/Review: Soft Amber (`bg-amber-50 text-amber-700 border-amber-200`)
  - Draft/Action Required: Soft Indigo (`bg-indigo-50 text-indigo-700 border-indigo-200`)

---

## 3. User Experience for Form & Project Data
- **Multi-Step Wizards & Steppers:** Erasmus+ forms are long. Split forms into clear horizontal step-indicators (e.g., "1. Kurum Bilgileri → 2. Proje Detayı → 3. Bütçe").
- **Clear Status Badges:** Display status indicators prominently using rounded badges with icons (`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium`).
- **Clean Summary Cards:** Group related school/project info into clean cards with subtle borders (`border border-slate-200/80`) and modest soft shadows (`shadow-sm`).

---

## 4. Language & Typography (STRICT)
- **No Circumflex Accents (`î`, `â`, `û`):** NEVER use hatted vowels in Turkish UI text. Always stick to standard ASCII/Turkish letters.
  - ❌ **BANNED:** "Resmî Belgeler", "Tarihî Veriler", "Yıllık Planî"
  - ✅ **REQUIRED:** "Resmi Belgeler", "Tarihi Veriler", "Yıllık Planı"
- **High Legibility:** Use standard, highly readable sans-serif fonts (Inter, Plus Jakarta Sans). Keep primary text high-contrast (`text-slate-800`) and subtext clean (`text-slate-500`).

---

## 5. Micro-Interactions
- **Gentle Hover States:** Subtle scale or shadow elevation on cards (`hover:shadow-md hover:-translate-y-0.5 transition-all duration-150`).
- **Accessible Focus States:** Always include prominent focus rings for accessibility (`focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`).