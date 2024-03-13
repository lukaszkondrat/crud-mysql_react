import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

const API_URL = "http://localhost:3001";

const App = () => {
  const [items, setItems] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [editItem, setEditItem] = useState({
    name: "",
    description: "",
  });
  const [newItem, setNewItem] = useState({ name: "", description: "" });
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/items`);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:" + error);
      }
    };

    fetchData();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      setUserLoggedIn(true);
      setCredentials({ username: "", password: "" });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignup = async (username, password) => {
    try {
      if (username !== "" && password !== "") {
        await axios.post(`${API_URL}/register`, {
          username,
          password,
        });
      }
      setCredentials({ username: "", password: "" });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleAddItem = async (name, description) => {
    try {
      await axios.post(`${API_URL}/items`, {
        name,
        description,
      });
      setNewItem({ name: "", description: "" });

      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleUpdateItem = async (id, name, description) => {
    try {
      await axios.put(`${API_URL}/items/${id}`, {
        name,
        description,
      });
      setEditItem({ name: "", description: "" });

      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/items/${id}`);
      setNewItem({ name: "", description: "" });

      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      {!userLoggedIn ? (
        <>
          <h1>Simple Website</h1>
          <input
            type="text"
            placeholder="username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({
                username: e.target.value,
                password: credentials.password,
              })
            }
          />
          <input
            type="text"
            placeholder="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({
                username: credentials.username,
                password: e.target.value,
              })
            }
          />
          <button
            onClick={() =>
              handleLogin(credentials.username, credentials.password)
            }
          >
            Login
          </button>
          <button
            onClick={() =>
              handleSignup(credentials.username, credentials.password)
            }
          >
            Sign up
          </button>
        </>
      ) : (
        <div>
          <h2>Items</h2>
          <ul>
            {items.map((item) => (
              <div className="items">
                <li key={item.id}>
                  <div className="item">
                    <span className="name">{item.name}</span>
                    <span className="description">{item.description}</span>
                    <button onClick={() => handleDeleteItem(item.id)}>X</button>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="new name"
                      onChange={(e) =>
                        setEditItem({
                          name: e.target.value,
                          description: editItem.description,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="new description"
                      onChange={(e) =>
                        setEditItem({
                          name: editItem.name,
                          description: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() =>
                        handleUpdateItem(
                          item.id,
                          editItem.name,
                          editItem.description
                        )
                      }
                    >
                      edit
                    </button>
                  </div>
                </li>
              </div>
            ))}
          </ul>
          <h2>Add new item</h2>
          <div className="new-item">
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({
                  name: e.target.value,
                  description: newItem.description,
                })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ name: newItem.name, description: e.target.value })
              }
            />
            <button
              onClick={() => handleAddItem(newItem.name, newItem.description)}
            >
              Add Item
            </button>
          </div>
          <button onClick={() => setUserLoggedIn(false)}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;
