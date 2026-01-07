import { useState, useEffect } from "react";

const App = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("Api Hit fetchUsers");
      const data = await window.electronAPI.user.list();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("[RENDERER] About to call user.create with:", {
        username,
        password,
      });
      const result = await window.electronAPI.user.create({
        username,
        password,
      });
      console.log("[RENDERER] user.create successful:", result);
      setUsername("");
      setPassword("");
      // Refresh the user list
      await fetchUsers();
    } catch (error) {
      console.error("[RENDERER] Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Management</h1>

      <form onSubmit={handleCreateUser} style={{ marginBottom: "20px" }}>
        <h2>Create User</h2>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ marginRight: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginRight: "10px" }}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>

      <div>
        <h2>Users List</h2>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.username} (ID: {user.id})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
