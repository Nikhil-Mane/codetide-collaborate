
import React, { useState } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Settings, FolderPlus, User, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import InviteMembersDialog from '@/components/InviteMembersDialog';
import ProjectList from '@/components/ProjectList';
import GroupChat from '@/components/GroupChat';
import GroupMembers from '@/components/GroupMembers';

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isInviteMembersOpen, setIsInviteMembersOpen] = useState(false);
  
  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Mock data - will be replaced with actual API calls
  const groupData = {
    id: groupId,
    name: 'Frontend Team',
    description: 'Group for frontend development tasks and collaboration',
    memberCount: 5,
    projectCount: 3,
    isAdmin: true,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-6xl mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-medium">{groupData.name}</span>
            </div>
            <h1 className="text-3xl font-bold">{groupData.name}</h1>
            <p className="text-muted-foreground">{groupData.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsInviteMembersOpen(true)}
              className="flex items-center gap-2"
            >
              <Users size={16} />
              Invite Members
            </Button>
            {groupData.isAdmin && (
              <Button variant="outline" className="flex items-center gap-2">
                <Settings size={16} />
                Settings
              </Button>
            )}
            <Button 
              onClick={() => setIsCreateProjectOpen(true)}
              className="flex items-center gap-2"
            >
              <FolderPlus size={16} />
              New Project
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderPlus size={16} />
              Projects
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users size={16} />
              Members
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Group Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-6">
            <ProjectList groupId={groupId!} />
          </TabsContent>
          
          <TabsContent value="members" className="mt-6">
            <GroupMembers groupId={groupId!} isAdmin={groupData.isAdmin} />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <GroupChat groupId={groupId!} />
          </TabsContent>
        </Tabs>

        <CreateProjectDialog 
          groupId={groupId!}
          open={isCreateProjectOpen} 
          onOpenChange={setIsCreateProjectOpen} 
        />
        
        <InviteMembersDialog 
          groupId={groupId!}
          open={isInviteMembersOpen} 
          onOpenChange={setIsInviteMembersOpen} 
        />
      </main>
    </div>
  );
};

export default GroupDetail;
