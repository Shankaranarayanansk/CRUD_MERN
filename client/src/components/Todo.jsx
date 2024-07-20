import React, { useEffect, useState } from 'react';
import './Todo.css'
const Todo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const apiurl = "http://localhost:9000";
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  const handleSubmit = () => {
    if (title.trim() !== "" && description.trim() !== "" && domain.trim() !== "") {
      const method = editMode ? "PUT" : "POST";
      const url = editMode ? `${apiurl}/todos/${currentItemId}` : `${apiurl}/todos`;
      
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, domain })
      }).then((res) => {
        if (res.ok) {
          getItems();
          setSuccess(editMode ? "Task Updated Successfully" : "Task Added Successfully");
          setTitle('');
          setDescription('');
          setDomain('');
          setError(null);
          setEditMode(false);
          setTimeout(() => {
            setSuccess(null);
          }, 3000);
        } else {
          res.json().then(data => {
            setError(data.error || "An error occurred");
          });
        }
      }).catch(() => {
        setError("An error occurred");
      });
    } else {
      setError("All fields are required");
    }
  };

  const getItems = () => {
    fetch(`${apiurl}/todos`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((error) => setError(error.toString()));
  };

  const handleDelete = (id) => {
    fetch(`${apiurl}/todos/${id}`, {
      method: "DELETE"
    }).then((res) => {
      if (res.ok) {
        getItems();
        setSuccess("Task Deleted Successfully");
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        res.json().then(data => {
          setError(data.error || "An error occurred");
        });
      }
    }).catch(() => {
      setError("An error occurred");
    });
  };

  const handleUpdate = (id) => {
    const item = items.find(item => item._id === id);
    setTitle(item.title);
    setDescription(item.description);
    setDomain(item.domain);
    setEditMode(true);
    setCurrentItemId(id);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className='App'>
      <h1>Todo List</h1>
      <h3>{editMode ? "Edit Task" : "Add a new task"}</h3>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div>
        <input
          type="text"
          placeholder='Title'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <input
          type="text"
          placeholder='Description'
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <input
          type="text"
          placeholder='Domain'
          onChange={(e) => setDomain(e.target.value)}
          value={domain}
        />
        <button onClick={handleSubmit}>{editMode ? "Update" : "Add"}</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Tasks</h3>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.title} - {item.description} - {item.domain}
            <div>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
              <button onClick={() => handleUpdate(item._id)}>Update</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
