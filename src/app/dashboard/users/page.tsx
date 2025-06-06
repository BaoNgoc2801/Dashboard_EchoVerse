"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { UserSearch } from '@/components/dashboard/user-search';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchAllUsers, UserItem } from '@/service/user.service';
import { EditRoleModal } from '@/components/modals/edit-role';
import { DeleteUserModal } from '@/components/modals/delete-user';
import { CreateRoleModal } from '@/components/modals/create-role';

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleDeleteUser = (userId: number) => {
    const updatedUsers = filteredUsers.filter(user => user.id !== userId);
    setFilteredUsers(updatedUsers);

    toast({
      title: "User deleted",
      description: "The user has been successfully deleted.",
    });
  };

  if (loading) {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <div className="h-10 w-full max-w-sm rounded-md bg-muted mb-4"></div>
          <div className="rounded-md border">
            <div className="h-10 w-full bg-muted"></div>
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-16 w-full bg-card border-t"></div>
            ))}
          </div>
        </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Failed to load users.</div>;
  }

  return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <div className="flex gap-2">
            <UserSearch onSearch={setSearchTerm} />
            <Button onClick={() => setShowCreateRole(true)}>
              <Plus className="mr-2" size={16} /> Create Role
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Users</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <UsersTable
                users={filteredUsers}
                onEditUser={setEditUserId}
                onDeleteUser={setDeleteUserId}
            />
          </TabsContent>
        </Tabs>

        {editUserId !== null && (
            <EditRoleModal
                user={filteredUsers.find(u => u.id === editUserId)!}
                onClose={() => setEditUserId(null)}
            />
        )}

        {deleteUserId !== null && (
            <DeleteUserModal
                open={true}
                username={filteredUsers.find(u => u.id === deleteUserId)?.username || ''}
                onClose={() => setDeleteUserId(null)}
                onConfirm={() => {
                  handleDeleteUser(deleteUserId);
                  setDeleteUserId(null);
                }}
            />
        )}

        {showCreateRole && (
            <CreateRoleModal onClose={() => setShowCreateRole(false)} />
        )}
      </div>
  );
}

interface UsersTableProps {
  users: UserItem[];
  onEditUser: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
}

function UsersTable({ users, onEditUser, onDeleteUser }: UsersTableProps) {
  return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
            ) : (
                users.map((user, index) => (
                    <TableRow key={user.id} className="group">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/users/${user.id}`} className="hover:underline">
                          {user.username}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {(user.roles || []).map(role => role.name).join(', ')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditUser(user.id)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteUser(user.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
  );
}
