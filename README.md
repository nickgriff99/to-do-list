# To-Do List

A small task list. You can add a task and delete one. There is no "done" state; the count on the page is the number of rows.

The UI is a React app in `view`. The API is Express in this folder. Postgres stores the rows. The React dev server proxies `/api` to the API, so the browser only talks to port 3000.

## Layout

| Path | What it is |
| --- | --- |
| `index.js` | Express. Listens on `PORT` or 8000. Routes live under `/api` only. |
| `routes/todo.js` | `POST /api/todo/create`, `GET /api/todos`, `DELETE /api/todo/:id` |
| `controller/index.js` | Reads the create request as form data (`description`). |
| `model/todo.js` | SQL against the `todo` table. |
| `model/database.js` | `pg` pool from the env vars below. |
| `model/todo.sql` | Creates the `todo` database and table. |
| `view/` | React UI. `npm start` here opens port 3000. |

`todo` has `todo_id` (serial) and `description` (varchar 225, required).

## Run it

Postgres has to be up first, with the database and table from `model/todo.sql`. Copy the connection into `.env`:

```
DB_USER=
DB_HOST=localhost
DB_DATABASE=todo
DB_PASSWORD=
DB_PORT=5432
PORT=8000
```

Do not set `PGSSLMODE=require` in the terminal that starts the API. That flag is for a hosted Postgres server. This app's local database does not speak SSL, and every `/api/todos` call will fail with a generic 500.

Two terminals, from this directory:

```
npm start
```

```
cd view
npm start
```

Open http://localhost:3000. http://localhost:8000 has no page; Express answers `Cannot GET /`.
