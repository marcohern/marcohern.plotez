# Plotez

A web application for managing terrain plots. Draw plot boundaries on an interactive map, track area measurements in square meters and hectares, and organize plots into categories.

It is a demo that demosntrazte how to draw shapes on a map. Specifically a Google Maps viewportal.

## Features

- **Plots** — Create, view, edit, and delete terrain plots with name, description, and category
- **Interactive map** — Draw and edit polygon boundaries to define plot shapes
- **Area calculation** — Automatic area computation in m² and hectares from drawn coordinates
- **Categories** — Organize plots into named categories with inline create/edit/delete

## Tech Stack

| Layer       | Technology                  |
| ----------- | --------------------------- |
| Backend     | Laravel 13, PHP 8.3+        |
| Frontend    | React 19, React Router 7    |
| Build       | Vite 8, Laravel Vite Plugin |
| Styling     | Bootstrap 5.3               |
| HTTP client | Axios                       |
| Database    | SQLite (default)            |

## Getting Started

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 18+

### Setup

```bash
composer run setup
```

Installs PHP and Node dependencies, creates `.env`, generates the app key, and runs database migrations.

### Development

```bash
composer run dev
```

Starts all development processes concurrently:

- `php artisan serve` — Laravel app server at http://localhost:8000
- `npm run dev` — Vite HMR dev server
- `php artisan queue:listen` — Queue worker
- `php artisan pail` — Log viewer

### Production build

```bash
npm run build
php artisan serve
```

### Tests

```bash
composer run test
```

## Database Schema

```
categories
  id, name, description, created_at, updated_at

plots
  id, name, description, category_id (→ categories),
  coordinates (JSON), area_sqm (decimal), hectares (decimal),
  created_at, updated_at
```

## API Endpoints

```
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/{id}
DELETE /api/categories/{id}

GET    /api/plots
POST   /api/plots
GET    /api/plots/{id}
PATCH  /api/plots/{id}
DELETE /api/plots/{id}
```
