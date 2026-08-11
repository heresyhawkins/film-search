# Film Search

A movie search app built with [Vite](https://vite.dev), [React](https://react.dev) and [TypeScript](https://www.typescriptlang.org), powered by the [TMDB API](https://developer.themoviedb.org/reference/getting-started).

## Getting Started

Create a `.env` file from the example and add your TMDB read access token:

```bash
cp .env.example .env
```

```env
VITE_API_URL=https://api.themoviedb.org/3
VITE_API_TOKEN=your_tmdb_read_access_token
```

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Scripts

- `npm run dev` — start the Vite dev server.
- `npm run build` — type-check and build for production into `dist/`.
- `npm run preview` — preview the production build locally.
- `npm run lint` — run ESLint.
- `npm run typecheck` — run the TypeScript compiler without emitting.
- `npm run format` — format the codebase with Prettier.

## Project Structure

```
index.html            # Vite entry HTML
src/
  main.tsx            # React entry point
  App.tsx             # Root view
  api/tmdb.ts         # TMDB API client
  components/         # Reusable UI components
  constants/          # Shared constants
  types/              # Types and Zod schemas
  utils/              # Helpers
  assets/             # SVG icons imported as React components
  styles/             # Global CSS (reset + app styles)
public/               # Static files served as-is
```

## Search behavior

TMDB has no single endpoint that combines a free-text query with a genre filter:
`/search/movie` ignores `with_genres` and `/discover/movie` ignores `query`. The UI
therefore treats title and genre as mutually exclusive — searching by title clears the
selected genre and vice versa. See `src/api/tmdb.ts` for details.
