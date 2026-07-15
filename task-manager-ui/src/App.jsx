import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import {
  createTask,
  deleteTask,
  getTasks,
  markTaskCompleted,
  updateTask,
} from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadTasks() {
      try {
        const data = await getTasks();

        if (!ignore) {
          setTasks(data);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
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

  async function handleSave(taskData) {
    setError("");
    setIsSaving(true);

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, taskData);

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskToEdit.id
              ? {
                  ...task,
                  ...taskData,
                }
              : task
          )
        );

        setTaskToEdit(null);
      } else {
        const newTask = await createTask(taskData);

        setTasks((currentTasks) => [
          newTask,
          ...currentTasks,
        ]);
      }

      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleComplete(id) {
    setError("");
    setBusyTaskId(id);

    try {
      await markTaskCompleted(id);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                isCompleted: true,
              }
            : task
        )
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyTaskId(null);
    }
  }

  function handleEdit(task) {
    setTaskToEdit(task);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    setTaskToEdit(null);
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!shouldDelete) {
      return;
    }

    setError("");
    setBusyTaskId(id);

    try {
      await deleteTask(id);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );

      if (taskToEdit?.id === id) {
        setTaskToEdit(null);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyTaskId(null);
    }
  }

  return (
    <main className="app-container">
      <h1>Task Manager</h1>

      <TaskForm
        key={taskToEdit?.id ?? "new"}
        taskToEdit={taskToEdit}
        onSave={handleSave}
        onCancel={handleCancelEdit}
        isSaving={isSaving}
      />

      {error && <p className="error-message">Error: {error}</p>}

      <section className="tasks-section">
        <h2>Tasks</h2>

        {isLoading ? (
          <p>Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onComplete={handleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
            busyTaskId={busyTaskId}
          />
        )}
      </section>
    </main>
  );
}

export default App;