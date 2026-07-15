import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onComplete,
  onEdit,
  onDelete,
  busyTaskId,
}) {
  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          isBusy={busyTaskId === task.id}
        />
      ))}
    </ul>
  );
}

export default TaskList;