
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FolderPlus, Settings } from 'lucide-react';
import InviteMembersDialog from './InviteMembersDialog';

// Mock data - will be replaced with actual API calls
const mockGroups = [
  {
    id: '1',
    name: 'Frontend Team',
    description: 'Group for frontend development tasks',
    memberCount: 5,
    projectCount: 3,
    isAdmin: true,
  },
  {
    id: '2',
    name: 'Backend Team',
    description: 'Group for backend development and API work',
    memberCount: 3,
    projectCount: 2,
    isAdmin: false,
  },
  {
    id: '3',
    name: 'Design Team',
    description: 'UI/UX design collaboration',
    memberCount: 4,
    projectCount: 1,
    isAdmin: true,
  }
];

const ProjectGroupsList = () => {
  const [activeInviteGroup, setActiveInviteGroup] = useState<string | null>(null);

  const handleInvite = (groupId: string) => {
    setActiveInviteGroup(groupId);
  };

  const handleCloseInvite = () => {
    setActiveInviteGroup(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockGroups.map((group) => (
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
