function formatDate(value) {
  if (!value) {
    return "";
  }

  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString();
}

function TaskItem({
  task,
  onComplete,
  onEdit,
  onDelete,
  isBusy,
}) {
  return (
    <li className={`task-item ${task.isCompleted ? "completed" : ""}`}>
      <div className="task-content">
        <h3>{task.title}</h3>

        {task.description && <p>{task.description}</p>}

        {task.dueDate && (
          <p className="task-meta">
            Due: {formatDate(task.dueDate)}
          </p>
        )}

        <p className="task-status">
          Status: {task.isCompleted ? "Completed" : "Not completed"}
        </p>
      </div>

      <div className="task-actions">
        <button
          type="button"
          onClick={() => onComplete(task.id)}
          disabled={task.isCompleted || isBusy}
        >
          {task.isCompleted ? "Completed" : "Mark Complete"}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => onEdit(task)}
          disabled={isBusy}
        >
          Edit
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(task.id)}
          disabled={isBusy}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;