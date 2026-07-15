import { useEffect, useState } from "react";
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

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main>
      <h1>Task Manager</h1>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>
              {task.description && <p>{task.description}</p>}
              <p>{task.isCompleted ? "Completed" : "Not completed"}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;