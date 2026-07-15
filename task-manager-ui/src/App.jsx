import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import { getTasks } from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadTasks() {
      try {
        const data = await getTasks();

        if (!ignore) {
          setTasks(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      ignore = true;
    };
  }, []);

  function handleTaskCreated(newTask) {
    setTasks((currentTasks) => [newTask, ...currentTasks]);
  }

  return (
    <main>
      <h1>Task Manager</h1>

      <TaskForm onTaskCreated={handleTaskCreated} />

      <h2>Tasks</h2>

      {isLoading && <p>Loading tasks...</p>}

      {error && <p>Error: {error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>No tasks yet.</p>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>

              {task.description && <p>{task.description}</p>}

              {task.dueDate && (
                <p>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}

              <p>
                Status: {task.isCompleted ? "Completed" : "Not completed"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;