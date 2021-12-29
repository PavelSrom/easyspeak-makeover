This is a progressive web application developed for a Bachelor project for the top-up degree in Web Development at Copenhagen Business Academy. The application demo is available [here](http://easyspeak-makeover.vercel.app/).

## Technology stack

- TypeScript
- Next.js (with API routes)
- MUI Material
- React Query
- Tailwind CSS
- Next Auth
- Firebase
- Prisma
- PostgreSQL

## Project folder structure

- `backend` - handlers for API endpoints
- `components` - independent "chunks" of UI for easier maintenance and development
- `contexts` - any custom global or local contexts for various purposes
- `hooks` - custom, reusable API and synchronous hooks
- `pages` - application pages, the way Next.js structures them
- `prisma` - Prisma's database schema
- `public` - the public folder exposed to the web
- `styles` - imported Tailwind CSS styles and MUI theme
- `types` - TypeScript types
- `ui` - custom, small, atomic units of UI
- `utils` - utility functionality and data

## Getting started

- Clone the repository via opening a terminal and typing `git clone {repo url}`
- Install all project dependencies via `npm install`
- Run `npm run dev` to start a local server on localhost:3000
