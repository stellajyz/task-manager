const API_URL = import.meta.env.VITE_API_URL;

async function ensureSuccess(response, message) {
  if (response.ok) {
    return;
  }

  let details = "";

  try {
    details = await response.text();
  } catch {
    // Ignore response-reading errors.
  }

  throw new Error(
    details
      ? `${message}: ${details}`
      : `${message} (${response.status})`
  );
}

export async function getTasks() {
  const response = await fetch(API_URL);

  await ensureSuccess(response, "Failed to load tasks");

  return response.json();
}

export async function createTask(task) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  await ensureSuccess(response, "Failed to create task");

  return response.json();
}

export async function updateTask(id, task) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  await ensureSuccess(response, "Failed to update task");
}

export async function markTaskCompleted(id) {
  const response = await fetch(`${API_URL}/${id}/complete`, {
    method: "PATCH",
  });

  await ensureSuccess(response, "Failed to complete task");
}

export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  await ensureSuccess(response, "Failed to delete task");
}