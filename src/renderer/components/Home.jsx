import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ThemeToggle } from "./ui/theme-toggle";

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
      const status = await window.electronAPI.auth.status();
      setAuthStatus(status);
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const checkPermissions = async () => {
    try {
      const canCreateUsers =
        await window.electronAPI.auth.hasPermission("user:create");
      const isAdmin = await window.electronAPI.auth.hasRole("admin");
      console.log("Can create users:", canCreateUsers);
      console.log("Is admin:", isAdmin);
    } catch (error) {
      console.error("Error checking permissions:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    checkAuthStatus();
    checkPermissions();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              POS Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome,{" "}
              <span className="font-semibold">{user?.username || "User"}</span>!
            </p>
            {authStatus && (
              <p className="text-sm text-muted-foreground mt-1">
                Auth Status:{" "}
                {authStatus.isAuthenticated
                  ? "✅ Authenticated"
                  : "❌ Not Authenticated"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="destructive" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create User Card */}
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>Add a new user to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-username">Username</Label>
                  <Input
                    id="create-username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-password">Password</Label>
                  <Input
                    id="create-password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create User"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Users List Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Users List</CardTitle>
                  <CardDescription>Manage existing users</CardDescription>
                </div>
                <Button variant="outline" onClick={fetchUsers}>
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No users found</p>
                  <p className="text-sm mt-2">
                    Click "Refresh" to load users or create a new user
                  </p>
                </div>
              ) : (
                <div className="border rounded-md">
                  <div className="max-h-80 overflow-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left p-3 font-medium text-sm">
                            ID
                          </th>
                          <th className="text-left p-3 font-medium text-sm">
                            Username
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-t">
                            <td className="p-3 text-sm text-muted-foreground">
                              {user.id}
                            </td>
                            <td className="p-3 text-sm font-medium">
                              {user.username}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
