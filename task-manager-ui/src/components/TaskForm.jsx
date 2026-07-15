import { useState } from "react";

const EMPTY_FORM = {
  title: "",
  description: "",
  dueDate: "",
};

function getInitialForm(task) {
  if (!task) {
    return { ...EMPTY_FORM };
  }

  return {
    title: task.title ?? "",
    description: task.description ?? "",
    dueDate: task.dueDate?.slice(0, 10) ?? "",
  };
}

function TaskForm({ taskToEdit, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(() => getInitialForm(taskToEdit));
  const [validationError, setValidationError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedTitle = form.title.trim();

    if (!cleanedTitle) {
      setValidationError("Title is required.");
      return;
    }

    setValidationError("");

    const wasSuccessful = await onSave({
      title: cleanedTitle,
      description: form.description.trim() || null,
      dueDate: form.dueDate || null,
      isCompleted: taskToEdit?.isCompleted ?? false,
    });

    if (wasSuccessful && !taskToEdit) {
      setForm({ ...EMPTY_FORM });
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{taskToEdit ? "Edit Task" : "Create Task"}</h2>

      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        value={form.title}
        onChange={handleChange}
        maxLength={100}
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={form.description}
        onChange={handleChange}
        maxLength={500}
        rows={4}
      />

      <label htmlFor="dueDate">Due date</label>
      <input
        id="dueDate"
        name="dueDate"
        type="date"
        value={form.dueDate}
        onChange={handleChange}
      />

      {validationError && (
        <p className="error-message">{validationError}</p>
      )}

      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : taskToEdit
              ? "Save Changes"
              : "Create Task"}
        </button>

        {taskToEdit && (
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;