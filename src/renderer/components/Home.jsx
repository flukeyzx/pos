import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/auth-context";
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

const Home = () => {
  const { user, logout, logoutLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const {
    data: users = [],
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await window.electronAPI.user.list();
      return response || [];
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await window.electronAPI.user.create(userData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUsername("");
      setPassword("");
      alert(`User "${username}" created successfully!`);
    },
    onError: (error) => {
      console.error("[RENDERER] Error creating user:", error);
      alert("Error creating user: " + error.message);
    },
  });

  const { data: authStatus } = useQuery({
    queryKey: ["auth", "status"],
    queryFn: async () => {
      const status = await window.electronAPI.auth.status();
      return status;
    },
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    await createUserMutation.mutateAsync({ username, password });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? "Logging out..." : "Logout"}
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
                    disabled={createUserMutation.isPending}
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
                    disabled={createUserMutation.isPending}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending ? "Creating..." : "Create User"}
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
                <Button
                  variant="outline"
                  onClick={refetchUsers}
                  disabled={usersLoading}
                >
                  {usersLoading ? "Refreshing..." : "Refresh"}
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
