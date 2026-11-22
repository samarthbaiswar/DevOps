# Planify • Premium To-Do List & Task Management

A production-quality To-Do web application engineered to match the visual language, color palette, typography, and interactive components of the Behance reference:
👉 **Design Reference:** [Behance To-Do List Reference](https://www.behance.net/gallery/110951483/To-do-list/modules/792858509)

---

## 🎨 Visual System & Behance Design Compliance

- **Exact Color Palette**:
  - Primary Brand Blue: `#246BFD` (buttons, active navigation pills, progress curves)
  - Deep Navy Backgrounds: `#142453`, `#181A20`, `#18213C`, `#181D2F`, `#222A43`
  - Cards & Containers: `#1F2438`, `#252834` with subtle border `#2C334D`
  - Accent Coral / Urgent: `#F67A7A`
  - Star / Important Amber: `#FFB524`
  - Success Green: `#22C55E`
- **Typography**: Google Fonts **Poppins** for bold headings, day numbers, counters; **Roboto** for crisp interface copy and descriptions.
- **Brand Identity**: Hexagonal vector logo with 3 ascending chart bars and top-right green check badge.
- **Mobile Mockup & Desktop Modes**: Includes a one-click toggle to view the application in either a wide desktop dashboard layout or an authentic smartphone frame mockup matching the Behance presentation slides.

---

## ✨ Features & Capabilities

1. **Task Management**:
   - Create, edit, and delete tasks.
   - Circular animated checkbox with Web Audio API chime.
   - Category tags with custom colors.
   - Due date and time indicators (`14:00`, `15:30`).
   - Star / Important toggle (`★` gold).
   - Priority indicators (Low, Medium, High).
   - Task detail popover / drawer.

2. **Calendar Views**:
   - **Daily Week Strip**: Horizontal scrollable date pills showing day name, date number, active selection, and task dots.
   - **Monthly Grid**: Full 7-column calendar overview showing task density and day navigation.
   - Agenda list displaying tasks scheduled for the active date.

3. **Categories & Projects**:
   - Horizontal gradient category cards (Work, Meet, Personal, Home, Study).
   - Create custom categories with a 7-color palette selector.
   - Task counts per category.

4. **Analytics & Progress**:
   - **Daily Progress Bar**: Live completion percentage and encouragement message.
   - **Behance Spline Area Chart**: Interactive SVG curve graph for Month, Week, and Year progress.
   - Lifetime statistics (`Total tasks: 100`, `Completed: 20`, completion rate).

5. **Delightful Interactive UX**:
   - Web Audio API synthesizer for tactile sound effects (chimes, clicks, deletes).
   - Confetti celebration modal upon completing all tasks for the day.
   - 3-step onboarding walkthrough tutorial modal.
   - Toast notifications for actions.
   - Real-time search and multi-criteria sorting (due date, priority, title).
   - LocalStorage persistence for all tasks, categories, and user preferences.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)

### Development
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Visit `http://localhost:5173` in your browser.

### Production Build
```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```
