import React, { useEffect, useState } from 'react';
import './Todo.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const Todo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const apiurl = "http://localhost:9000";
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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
          toast.success(editMode ? "Task Updated Successfully" : "Task Added Successfully");
          setTitle('');
          setDescription('');
          setDomain('');
          setError(null);
          setEditMode(false);
        } else {
          res.json().then(data => {
            setError(data.error || "An error occurred");
            toast.error(data.error || "An error occurred");
          });
        }
      }).catch(() => {
        setError("An error occurred");
        toast.error("An error occurred");
      });
    } else {
      setError("All fields are required");
      toast.error("All fields are required");
    }
  };

  const getItems = () => {
    fetch(`${apiurl}/todos`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((error) => {
        setError(error.toString());
        toast.error(error.toString());
      });
  };

  const handleDelete = (id) => {
    fetch(`${apiurl}/todos/${id}`, {
      method: "DELETE"
    }).then((res) => {
      if (res.ok) {
        getItems();
        toast.success("Task Deleted Successfully");
        closeModal();
      } else {
        res.json().then(data => {
          toast.error(data.error || "An error occurred");
        });
      }
    }).catch(() => {
      setError("An error occurred");
      toast.error("An error occurred");
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

  const openModal = (id) => {
    setItemToDelete(id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className='App'>
      <h1>Crud MERN TO Do APP</h1>
      <h3>{editMode ? "Edit Task" : "Add a new task"}</h3>
      <div>
        <input
          type="text"
          placeholder='Title'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <input
          type="Date"
          placeholder='Date'
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
      <div className="task-table">
  <div className="task-header">
    <span>Title</span>
    <span>Date</span>
    <span>Domain</span>
    <span>Actions</span>
  </div>
  <ul>
    {items.map((item) => (
      <li key={item._id}>
        <span>{item.title}</span>
        <span>{item.description}</span>
        <span>{item.domain}</span>
        <div>
          <button onClick={() => openModal(item._id)}>Delete</button>
          <button onClick={() => handleUpdate(item._id)}>Update</button>
        </div>
      </li>
    ))}
  </ul>
</div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Confirmation"
        ariaHideApp={false}
      >
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this task?</p>
        <button onClick={() => handleDelete(itemToDelete)}>Yes</button>
        <button onClick={closeModal} className='no'>No</button>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Todo;
