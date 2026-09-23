// Controller-facing helpers: talk to the Express API, return parsed JSON to the View.

export const getTodos = async () => {
  const response = await fetch('/api/todos');
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
};

export const createTodo = async (todo) => {
  const formData = new FormData();
  formData.append('description', todo.description);

  const response = await fetch('/api/todo/create', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create todo');
  }

  return response.json();
};

export const removeTodo = async (id) => {
  const response = await fetch(`/api/todo/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }

  return response;
};
