
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FolderPlus, Settings } from 'lucide-react';
import InviteMembersDialog from './InviteMembersDialog';
import { fetchUserGroups } from '@/services/groupService';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectGroupsList = () => {
  const [activeInviteGroup, setActiveInviteGroup] = useState<string | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      setIsLoading(true);
      const fetchedGroups = await fetchUserGroups();
      setGroups(fetchedGroups);
      setIsLoading(false);
    };

    loadGroups();
  }, []);

  const handleInvite = (groupId: string) => {
    setActiveInviteGroup(groupId);
  };

  const handleCloseInvite = () => {
    setActiveInviteGroup(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No groups yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first project group to start collaborating with your team
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{group.name}</CardTitle>
              {group.isAdmin && (
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Admin
                </Badge>
              )}
            </div>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{group.memberCount} members</span>
              </div>
              <div className="flex items-center gap-1">
                <FolderPlus size={16} />
                <span>{group.projectCount} projects</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => handleInvite(group.id)}>
              Invite
            </Button>
            <Link to={`/groups/${group.id}`}>
              <Button size="sm">View Group</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}

      {activeInviteGroup && (
        <InviteMembersDialog 
          groupId={activeInviteGroup} 
          open={!!activeInviteGroup} 
          onOpenChange={handleCloseInvite} 
        />
      )}
    </div>
  );
};

export default ProjectGroupsList;
