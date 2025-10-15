# Repository Overview

This project is a **Next.js 13+ (App Router)** application written in **TypeScript**. It leverages **Tailwind CSS**, **React Hook Form**, **Zod**, and a collection of ShadCN UI components located under `components/ui` to build a merchant-facing dashboard and related pages.

## Project Structure Highlights

- **app/**: Route segments for the Next.js application, including dashboard, register, and marketing pages.
- **components/**: Reusable React components. Dashboard-specific code lives under `components/dashboard`, with UI primitives in `components/ui`.
- **constants/**, **data/**, **hooks/**, **lib/**: Shared utilities, data sets (e.g., `data/allCities.json`), custom hooks, and library helpers (MongoDB, auth context, email, etc.).
- **models/**: Mongoose schemas and TypeScript interfaces for domain entities.
- **public/**: Static assets such as images and favicons.

## Key Dependencies & Tooling

- **Next.js** for SSR/SSG and routing (`next`, `react`, `react-dom`).
- **TypeScript** with strict configuration (`tsconfig.json`).
- **Tailwind CSS / PostCSS** and **autoprefixer** for styling.
- **ShadCN UI** components tailored under `components/ui`.
- **React Hook Form** and **Zod** for form handling and validation.
- **Lucide-react** for iconography.

## Useful Scripts (from `package.json`)

1. `npm run dev` — Start the development server.
2. `npm run build` — Create a production build.
3. `npm start` — Run the production server.
4. `npm run lint` — Execute ESLint using the configured rules.

## Coding Conventions

- Prefer **TypeScript** with strict typing; interfaces and types live close to their usage or under `models/`.
- UI components follow **ShadCN** conventions; keep shared UI elements under `components/ui`.
- Centralize reusable logic (hooks, utilities) within `hooks/` and `lib/`.
- Maintain form schemas with **Zod** alongside React Hook Form logic for validation consistency.
- Tailwind CSS classes are used for styling; global styles are in `app/globals.css`.

## Testing & Quality

- Lint before committing (`npm run lint`).
- The project does not currently include automated tests; follow existing patterns if adding tests.
- Ensure accessibility considerations align with ShadCN and Tailwind best practices.

## Environment & Configuration

- Environment variables are read from `.env.local` (example file not provided). Ensure your local environment mirrors production-sensitive values securely.
- Update `next.config.js` and `tailwind.config.ts` when adjusting build or styling settings.

## Contribution Tips

- For large components, prefer splitting into smaller modules under appropriate directories (e.g., `components/dashboard/products-management/`).
- Keep API requests and server utilities within the `app/api/` hierarchy or `lib/` helpers.
- When adding data-dependent features, update the relevant schemas under `models/` and seed data in `data/` if needed.