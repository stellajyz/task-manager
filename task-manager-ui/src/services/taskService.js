const API_URL = import.meta.env.VITE_API_URL;

export async function getTasks() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to load tasks: ${response.status}`);
  }

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

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.status}`);
  }

  return response.json();
}