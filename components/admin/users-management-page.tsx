"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button, Input } from "@/components/ui/controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/card";
import { Container } from "@/components/ui/layout/containers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/layout/table";
import { toast } from "sonner";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/feedback/badge";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  password: string | null;
  createdAt: string;
  invite?: {
    expiresAt: string;
  } | null;
}

export function UsersManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: "SALES",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.username || !formData.email) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create user");
      }

      toast.success("User created and invite sent");
      setFormData({ name: "", username: "", email: "", role: "SALES" });
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create user",
      );
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  const handleResendInvite = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/resend-invite`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to resend invite");

      toast.success("Invite resent");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to resend invite");
      console.error(error);
    }
  };

  const getStatus = (user: User) => {
    if (user.password) {
      return { label: "Active", color: "text-green-600" };
    }
    if (user.invite) {
      const isExpired = new Date(user.invite.expiresAt) < new Date();
      return isExpired
        ? { label: "Invite Expired", color: "text-red-600" }
        : { label: "Pending Setup", color: "text-yellow-600" };
    }
    return { label: "Unknown", color: "text-gray-600" };
  };

  const isCurrentUser = (userId: string) => session?.user?.id === userId;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <Container spacing="block" className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage team members and their roles
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="size-4" />
          Add User
        </Button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>
              The user will receive an email with a link to set their password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <div className="flex gap-2">
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="SUPPORT">Support</option>
                  <option value="SALES">Sales</option>
                  <option value="HR">HR</option>
                </select>
                <Button type="submit">Create User</Button>
                <Button
                  type="button"
                  variant="unstyled"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>{users.length} users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow hoverable={false}>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const status = getStatus(user);
                const canDelete =
                  !isCurrentUser(user.id) && user.role !== "DEV";
                const canResendInvite =
                  !user.password &&
                  user.invite &&
                  new Date(user.invite.expiresAt) < new Date();

                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge size="sm" className="mx-auto">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {canResendInvite && (
                          <button
                            onClick={() => handleResendInvite(user.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Resend invite"
                          >
                            <RotateCcw className="size-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete user"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}
