# AI Studio App Development Rules

This document outlines the core technologies and best practices for developing the AI Studio application.

## Tech Stack Overview

*   **Frontend Framework:** React (with TypeScript)
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui (built on Radix UI)
*   **Icons:** Lucide React
*   **AI Integration:** Google GenAI SDK (for Gemini API interactions)
*   **PDF Generation:** jspdf and html2canvas
*   **Routing:** React Router (planned for future use, currently using conditional rendering for modals)
*   **Build Tool:** Vite
*   **Local Data Storage:** Browser's LocalStorage (for client-side persistence like calendar tasks)
*   **Environment Variables:** Managed via Vite's `loadEnv` for API keys.

## Library Usage Rules

*   **React & TypeScript:** All new components and logic should be written using React with TypeScript for type safety and maintainability.
*   **Tailwind CSS:** All styling must be done using Tailwind CSS utility classes. Avoid custom CSS files unless absolutely necessary for global styles.
*   **shadcn/ui & Radix UI:**
    *   Prioritize using pre-built components from `shadcn/ui` where applicable.
    *   Do **not** modify the `shadcn/ui` component files directly. If a component needs customization beyond what props allow, create a new component that wraps or extends the `shadcn/ui` component.
*   **Lucide React:** Use icons from the `lucide-react` library for all icon needs.
*   **React Router:** For managing application routes and navigation between different pages. All main routes should be defined in `src/App.tsx`.
*   **Google GenAI SDK:** Use this library for all interactions with the Gemini API (e.g., generating proposals, reports, or chatbot responses).
*   **jspdf & html2canvas:** These libraries are specifically for client-side PDF generation from HTML content.
*   **File Structure:**
    *   `src/pages/`: For top-level views or "pages" of the application.
    *   `src/components/`: For reusable UI components.
    *   `src/services/`: For API interaction logic (e.g., `geminiService.ts`).
    *   `src/data/`: For static data (e.g., `npoData.ts`).
    *   `src/types.ts`: For shared TypeScript interfaces and types.
*   **Component Granularity:** Always create a new, separate file for every new React component or custom hook, no matter how small. Aim for components that are concise and focused on a single responsibility.
*   **Responsiveness:** All UI designs must be responsive and adapt well to different screen sizes (mobile, tablet, desktop) using Tailwind's responsive utilities.
*   **Error Handling:** Do not implement `try/catch` blocks for API calls or other operations unless explicitly requested. Errors should generally be allowed to bubble up for centralized handling and debugging.
*   **Simplicity & Elegance:** Prioritize simple, elegant, and maintainable code. Avoid over-engineering solutions. Implement only what is requested, without adding unnecessary complexity.