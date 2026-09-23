import React, { useState, useEffect } from 'react';
import './App.css';
import { getTodos, createTodo, removeTodo } from './util';

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482 41.03 41.03 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zm-3.877 3.316a.75.75 0 10-1.492.168l.554 6.2A2.75 2.75 0 007.925 16H7.9l-.554-6.2a.75.75 0 011.492-.168l.554 6.2a1.25 1.25 0 01-1.245 1.368H7.9l-.554-6.2zM13 9.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zm1.246-2.434a.75.75 0 00-1.492-.168l-.554 6.2a.75.75 0 101.492.168l.554-6.2z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.63-1.516 2.63H3.72c-1.347 0-2.189-1.463-1.515-2.63L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const EmptyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="h-10 w-10 text-slate-300 dark:text-slate-600"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const App = () => {
  const [todo, setTodo] = useState({
    description: '',
  });
  const [todoList, setTodoList] = useState();
  const [error, setError] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Fetch todos from the API and sync into view state
  const fetchTodos = async () => {
    try {
      const todos = await getTodos();
      setTodoList(todos);
    } catch (err) {
      setError(err.message);
      setTodoList((current) => current ?? []);
    }
  };

  // Create a handleDelete() function to remove to-do list with matching id
  const handleDelete = async (id) => {
    try {
      await removeTodo(id);
      setError(undefined);
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // Plays a fade-out transition before the item actually leaves the list
  const handleDeleteClick = async (id) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    await new Promise((resolve) => {
      setTimeout(resolve, 180);
    });
    await handleDelete(id);
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Create a handleSubmit() function to add new to-do list
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todo.description.trim()) return;
    setSubmitting(true);
    try {
      await createTodo(todo);
      setTodo({ description: '' });
      setError(undefined);
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Initialize todoList
    fetchTodos();
  }, []);

  const isLoading = todoList === undefined;
  const isEmpty = !isLoading && todoList.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/60 dark:shadow-black/30">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            To-Do List
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isLoading
              ? 'Loading your tasks...'
              : `${todoList.length} task${todoList.length === 1 ? '' : 's'} remaining`}
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2">
          <input
            type="text"
            value={todo.description}
            onChange={(event) => setTodo({ ...todo, description: event.target.value })}
            placeholder="What needs doing?"
            aria-label="New task description"
            className="flex-1 min-w-0 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          />
          <button
            type="submit"
            disabled={submitting || !todo.description.trim()}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          >
            <PlusIcon />
            <span className="hidden sm:inline">Add</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <WarningIcon />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6">
          {isLoading && (
            <ul className="space-y-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className="h-11 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700/60"
                />
              ))}
            </ul>
          )}

          {isEmpty && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <EmptyIcon />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                All caught up
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Add a task above to get started.
              </p>
            </div>
          )}

          {!isLoading && !isEmpty && (
            <ol className="space-y-2">
              {todoList.map((todoItem) => (
                <li
                  key={todoItem.todo_id}
                  className={`group flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5 transition-all duration-200 ease-out animate-fade-in-up dark:bg-slate-900/60 ${
                    deletingIds.has(todoItem.todo_id)
                      ? 'opacity-0 scale-95'
                      : 'opacity-100 scale-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="break-words text-sm text-slate-700 dark:text-slate-200">
                    {todoItem.description}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(todoItem.todo_id)}
                    aria-label={`Delete "${todoItem.description}"`}
                    className="shrink-0 rounded-md p-1.5 text-slate-400 opacity-100 transition hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500/40 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
