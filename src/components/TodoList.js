import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = "TASK";

const TaskItem = ({ task, index, moveTask, removeTask }) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <li
      ref={(node) => ref(drop(node))}
      className={`flex justify-between items-center bg-gray-100 p-2 mt-2 cursor-grab ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task}
      <button onClick={() => removeTask(index)} className="text-red-500">X</button>
    </li>
  );
};

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">To-Do List (Drag & Drop)</h2>
        <div className="flex">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="border p-2 flex-grow"
            placeholder="Enter task..."
          />
          <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 ml-2">
            Add
          </button>
        </div>
        <ul className="mt-4">
          {tasks.map((t, index) => (
            <TaskItem key={index} index={index} task={t} moveTask={moveTask} removeTask={removeTask} />
          ))}
        </ul>
      </div>
    </DndProvider>
  );
};

export default TodoList;
