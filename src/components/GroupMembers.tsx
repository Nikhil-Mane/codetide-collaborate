
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, MoreHorizontal, User, Shield, UserX } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GroupMembersProps {
  groupId: string;
  isAdmin: boolean;
}

const GroupMembers: React.FC<GroupMembersProps> = ({ groupId, isAdmin }) => {
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  
  // Mock data - will be replaced with actual API calls
  const members = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      joinedAt: '2 months ago',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'moderator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      joinedAt: '1 month ago',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'member',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      joinedAt: '3 weeks ago',
    },
    {
      id: '4',
      name: 'Alice Williams',
      email: 'alice@example.com',
      role: 'member',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      joinedAt: '2 weeks ago',
    },
    {
      id: '5',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'member',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      joinedAt: '1 week ago',
    },
  ];

  const handleRemoveMember = async () => {
    try {
      if (!memberToRemove) return;
      
      console.log('Removing member:', memberToRemove, 'from group:', groupId);
      // TODO: Replace with actual API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const memberName = members.find(m => m.id === memberToRemove)?.name || 'Member';
      toast.success(`${memberName} has been removed from the group`);
      setMemberToRemove(null);
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member. Please try again.');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="flex items-center text-amber-500">
            <Crown size={14} className="mr-1" />
            Admin
          </span>
        );
      case 'moderator':
        return (
          <span className="flex items-center text-blue-500">
            <Shield size={14} className="mr-1" />
            Moderator
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-500">
            <User size={14} className="mr-1" />
            Member
          </span>
        );
    }
  };

  return (
    <>
      <Card className="border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-medium">Group Members ({members.length})</h3>
        </div>
        <div className="divide-y">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">{getRoleBadge(member.role)}</div>
                {isAdmin && member.role !== 'admin' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                        <span className="sr-only">Member options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => toast.success(`${member.name} promoted to moderator`)}
                        className="cursor-pointer"
                      >
                        <Shield className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Make moderator</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setMemberToRemove(member.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        <span>Remove from group</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member from the group? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setMemberToRemove(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRemoveMember} 
              variant="destructive"
            >
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupMembers;
