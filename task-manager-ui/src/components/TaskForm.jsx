import { useState } from "react";
import { createTask } from "../services/taskService";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedTitle = title.trim();

    if (!cleanedTitle) {
      setError("Title is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const newTask = await createTask({
        title: cleanedTitle,
        description: description.trim() || null,
        dueDate: dueDate || null,
      });

      onTaskCreated(newTask);

      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Task</h2>

      <div>
        <label htmlFor="title">Title</label>
        <br />

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <br />

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={500}
        />
      </div>

      <div>
        <label htmlFor="dueDate">Due date</label>
        <br />

        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      {error && <p>{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}

export default TaskForm;