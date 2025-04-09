import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://fir-16dc9-default-rtdb.firebaseio.com/data";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("not-started");

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(`${API_URL}.json`);
      const data = await res.json();
      const loadedTasks = [];

      for (let key in data) {
        loadedTasks.push({ id: key, ...data[key] });
      }

      setTasks(loadedTasks);
    };

    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!taskName.trim()) return;

    const newTask = { name: taskName, status };

    const res = await fetch(`${API_URL}.json`, {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();

    setTasks(prev => [...prev, { id: data.name, ...newTask }]);
    setTaskName("");
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}.json`, {
      method: "DELETE"
    });
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Edit task
  const updateTask = async (id, oldName) => {
    const newName = prompt("Edit task name:", oldName);
    if (!newName) return;

    await fetch(`${API_URL}/${id}.json`, {
      method: "PATCH",
      body: JSON.stringify({ name: newName }),
      headers: { "Content-Type": "application/json" }
    });

    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, name: newName } : task))
    );
  };

  const countByStatus = (statusType) =>
    tasks.filter(task => task.status === statusType).length;

  return (
    <div className="container">
      <nav className="navbar">
        <h2>Task Manager</h2>
        <div className="status-counts">
          <span>Completed: {countByStatus("completed")}</span>
          <span>Ongoing: {countByStatus("ongoing")}</span>
          <span>Not Started: {countByStatus("not-started")}</span>
        </div>
      </nav>

      <div className="task-input">
        <input
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder="Enter task name"
        />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="not-started">Not Started</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="task-list">
        {["completed", "ongoing", "not-started"].map(statusType => (
          <div key={statusType} className="task-category">
            <h3>{statusType.toUpperCase()}</h3>
            <ul>
              {tasks
                .filter(task => task.status === statusType)
                .map(task => (
                  <li key={task.id}>
                    {task.name}
                    <button onClick={() => updateTask(task.id, task.name)}>✏️</button>
                    <button onClick={() => deleteTask(task.id)}>🗑️</button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
