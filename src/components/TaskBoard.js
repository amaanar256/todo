import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";

const ItemType = "TASK";

const Task = ({ task, moveTask, deleteTask }) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={ref} className={`task ${task.status} ${isDragging ? "opacity-50" : ""}`}>
      <span>{task.text}</span>
      <span className="task-time">{task.time}</span>
      <button className="delete-btn" onClick={() => deleteTask(task.id)}>❌</button>
    </div>
  );
};

const Column = ({ title, status, tasks, moveTask, deleteTask }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (draggedItem) => {
      moveTask(draggedItem.id, draggedItem.status, status);
    },
  });

  return (
    <div ref={drop} className="column">
      <h2>{title}</h2>
      {tasks.map((task) => (
        <Task key={task.id} task={task} moveTask={moveTask} deleteTask={deleteTask} />
      ))}
    </div>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  const addTask = () => {
    if (taskText.trim() !== "") {
      const newTask = {
        id: tasks.length + 1,
        text: taskText,
        status: "pending",
        time: format(new Date(), "hh:mm a"), // Add time when task is created
      };
      setTasks([...tasks, newTask]);
      setTaskText("");
    }
  };

  const moveTask = (taskId, fromStatus, toStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: toStatus } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>Task Board</h1>
      <div className="task-board">
        <Column title="Pending" status="pending" tasks={tasks.filter((t) => t.status === "pending")} moveTask={moveTask} deleteTask={deleteTask} />
        <Column title="In Progress" status="in-progress" tasks={tasks.filter((t) => t.status === "in-progress")} moveTask={moveTask} deleteTask={deleteTask} />
        <Column title="Complete" status="complete" tasks={tasks.filter((t) => t.status === "complete")} moveTask={moveTask} deleteTask={deleteTask} />
      </div>

      <div className="task-form">
        <input type="text" value={taskText} onChange={(e) => setTaskText(e.target.value)} placeholder="Enter task..." />
        <button onClick={addTask}>Add Task</button>
      </div>
    </DndProvider>
  );
};

export default TaskBoard;
