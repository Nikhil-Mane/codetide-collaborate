
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ProjectGroupsList from '@/components/ProjectGroupsList';
import CreateGroupDialog from '@/components/CreateGroupDialog';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-6xl mx-auto px-4 py-8 pt-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Project Groups</h1>
          <Button 
            onClick={() => setIsCreateGroupOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            New Group
          </Button>
        </div>

        <ProjectGroupsList />
        
        <CreateGroupDialog 
          open={isCreateGroupOpen} 
          onOpenChange={setIsCreateGroupOpen} 
        />
      </main>
    </div>
  );
};

export default Dashboard;
