import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  const fetchTasks = async () => {
    const res = await fetch('http://192.168.56.1:5000/tasks');
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTaskText.trim()) return;
    const res = await fetch('http://192.168.56.1:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTaskText }),
    });
    if (res.ok) {
      const addedTask = await res.json();
      setTasks(prev => [...prev, addedTask]);
      setNewTaskText('');
    }
  };

  const toggleTask = async (id, completed) => {
    const res = await fetch(`http://192.168.56.1:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    if (res.ok) {
      const updatedTask = await res.json();
      setTasks(prev => prev.map(t => (t.id === id ? updatedTask : t)));
    }
  };

  const deleteTask = async (id) => {
    const res = await fetch(`http://192.168.56.1:5000/tasks/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'Arial' }}>
      <h1>יומן משימות</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="הכנס משימה חדשה"
          style={{ width: '70%', padding: '8px' }}
        />
        <button onClick={addTask} style={{ padding: '8px 16px', marginLeft: '10px' }}>
          הוסף
        </button>
      </div>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li
            key={task.id}
            style={{
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              background: '#f0f0f0',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id, task.completed)}
              style={{ marginRight: '10px' }}
            />
            <span
              style={{
                flexGrow: 1,
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              מחק
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
