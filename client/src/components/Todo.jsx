import React, { useState } from 'react';

const Todo = () => {
  const [title,setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const apiurl = "http://localhost:9000";
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
     if (title.trim() !== "" && description.trim() !== "" && domain.trim() !== "") {
      fetch(apiurl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, domain })
      }).then((res) => {
        if (res.ok) {
          setItems([...items, { title, description, domain }]); // Update the items state
          setSuccess("Task Added Successfully");
          setTitle(''); // Clear input fields after successful submission
          setDescription('');
          setDomain('');
          setError(null); // Clear previous errors
          setTimeout(() => {
            setSuccess(null);
          }, 3000);//clear the message
        } else {
          res.json().then(data => {
            setError(data.error || "An error occurred"); // Set error message from response or default
          });
        }
      }).catch(() => {
        setError("An error occurred");
      });
    } else {
      setError("All fields are required");
    }
  };

  return (
    <div className='App'>
      <h1>Todo List</h1>
      <h3>Add a new task</h3>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div>
        <input
          type="text"
          placeholder='Add a new task'
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
        <button onClick={handleSubmit}>Add</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Tasks</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.title} - {item.description} - {item.domain}
          <div>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
          <button onClick={() => handleUpdate(item.id)}>Update</button>
          </div>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
