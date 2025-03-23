
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, MoreHorizontal, User, Shield, UserX } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchGroupMembers, updateMemberRole, removeMember } from '@/services/groupService';
import { Skeleton } from '@/components/ui/skeleton';

interface GroupMembersProps {
  groupId: string;
  isAdmin: boolean;
}

const GroupMembers: React.FC<GroupMembersProps> = ({ groupId, isAdmin }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  
  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      const data = await fetchGroupMembers(groupId);
      setMembers(data);
      setIsLoading(false);
    };

    loadMembers();
  }, [groupId]);

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    
    try {
      const success = await removeMember(groupId, memberToRemove);
      
      if (success) {
        // Update the members list
        setMembers(members.filter(m => m.id !== memberToRemove));
      }
      
      setMemberToRemove(null);
    } catch (error) {
      console.error('Error in removing member:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const handlePromoteToModerator = async (userId: string) => {
    try {
      const success = await updateMemberRole(groupId, userId, 'moderator');
      
      if (success) {
        // Update the members list
        setMembers(members.map(m => 
          m.id === userId ? { ...m, role: 'moderator' } : m
        ));
      }
    } catch (error) {
      console.error('Error promoting member:', error);
      toast.error('Failed to update member role');
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

  if (isLoading) {
    return (
      <Card className="border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-medium">Group Members</h3>
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-medium">Group Members ({members.length})</h3>
        </div>
        <div className="divide-y">
          {members.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No members found
            </div>
          ) : (
            members.map((member) => (
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
                        {member.role !== 'moderator' && (
                          <DropdownMenuItem 
                            onClick={() => handlePromoteToModerator(member.id)}
                            className="cursor-pointer"
                          >
                            <Shield className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Make moderator</span>
                          </DropdownMenuItem>
                        )}
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
            ))
          )}
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
