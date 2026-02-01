import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserCog, AlertCircle, Shield, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Tables, Database } from '@/integrations/supabase/types';

type UserRole = Tables<'user_roles'>;
type Profile = Tables<'profiles'>;
type AppRole = Database['public']['Enums']['app_role'];

interface UserWithRole {
  profile: Profile;
  role: UserRole | null;
}

const roleLabels: Record<AppRole, string> = {
  admin: 'Administrator',
  enrollment_staff: 'Enrollment Staff',
  read_only: 'Read Only',
};

const roleColors: Record<AppRole, string> = {
  admin: 'bg-purple-100 text-purple-800',
  enrollment_staff: 'bg-blue-100 text-blue-800',
  read_only: 'bg-gray-100 text-gray-800',
};

export default function UsersPage() {
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => ({
        profile,
        role: roles?.find((r) => r.user_id === profile.user_id) || null,
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    try {
      const existingRole = users.find((u) => u.profile.user_id === userId)?.role;

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });

        if (error) throw error;
      }

      toast({
        title: 'Role updated',
        description: `User role has been updated to ${roleLabels[newRole]}.`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Admin Only</h2>
        <p className="text-muted-foreground">
          Only administrators can access user management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage staff accounts and role assignments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Staff Users
          </CardTitle>
          <CardDescription>
            Assign roles to control portal access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-primary">Loading users...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(({ profile, role }) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.full_name || 'No name'}
                      {profile.user_id === user?.id && (
                        <Badge variant="outline" className="ml-2">You</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {profile.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={role?.role || 'none'}
                        onValueChange={(value) => {
                          if (value !== 'none') {
                            handleRoleChange(profile.user_id, value as AppRole);
                          }
                        }}
                        disabled={profile.user_id === user?.id}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue>
                            {role?.role ? (
                              <Badge className={roleColors[role.role]}>
                                {roleLabels[role.role]}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">No role</span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-purple-600" />
                              Administrator
                            </div>
                          </SelectItem>
                          <SelectItem value="enrollment_staff">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-blue-600" />
                              Enrollment Staff
                            </div>
                          </SelectItem>
                          <SelectItem value="read_only">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-gray-600" />
                              Read Only
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(profile.created_at), 'MMM d, yyyy')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={roleColors.admin}>Administrator</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full access to all features</li>
                <li>• Manage user roles</li>
                <li>• Delete records</li>
                <li>• Configure settings</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={roleColors.enrollment_staff}>Enrollment Staff</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create and edit leads</li>
                <li>• Manage pipeline</li>
                <li>• Create tasks</li>
                <li>• Track referrals</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={roleColors.read_only}>Read Only</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View all records</li>
                <li>• Generate reports</li>
                <li>• Cannot create or edit</li>
                <li>• Cannot delete records</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
