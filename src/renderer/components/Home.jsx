import { useEffect, useState } from "react";

const Home = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await window.electronAPI.user.list();
      setUsers(response || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Error fetching users: " + error.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await window.electronAPI.user.create({
        username,
        password,
      });

      alert(`User "${username}" created successfully!`);
      setUsername("");
      setPassword("");
      await fetchUsers();
    } catch (error) {
      console.error("[RENDERER] Error creating user:", error);
      alert("Error creating user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const res = await window.electronAPI.auth.status();
      setAuthStatus(res.data);
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    checkAuthStatus();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "2px solid #eee",
          paddingBottom: "1rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: "#333" }}>POS Dashboard</h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            Welcome, <strong>{user?.username || "User"}</strong>!
          </p>
          {authStatus && (
            <p
              style={{
                margin: "0.25rem 0 0 0",
                color: "#888",
                fontSize: "0.9rem",
              }}
            >
              Auth Status:{" "}
              {authStatus.isAuthenticated
                ? "✅ Authenticated"
                : "❌ Not Authenticated"}
            </p>
          )}
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
      >
        <div>
          <h2 style={{ color: "#333", marginBottom: "1rem" }}>
            Create New User
          </h2>
          <form onSubmit={handleCreateUser}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#555",
                }}
              >
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#555",
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: loading ? "#ccc" : "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "1rem",
              }}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ color: "#333", margin: 0 }}>Users List</h2>
            <button
              onClick={fetchUsers}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Refresh
            </button>
          </div>

          {users.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                backgroundColor: "#f9f9f9",
                borderRadius: "4px",
                color: "#666",
              }}
            >
              <p>No users found</p>
              <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Click "Refresh" to load users or create a new user
              </p>
            </div>
          ) : (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                maxHeight: "300px",
                overflow: "auto",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead
                  style={{
                    backgroundColor: "#f5f5f5",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  <tr>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                        color: "#333",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                        color: "#333",
                      }}
                    >
                      Username
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "0.75rem", color: "#666" }}>
                        {user.id}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem",
                          color: "#333",
                          fontWeight: "500",
                        }}
                      >
                        {user.username}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
