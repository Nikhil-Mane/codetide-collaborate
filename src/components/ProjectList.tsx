
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCode, Clock, Users } from 'lucide-react';

interface ProjectListProps {
  groupId: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ groupId }) => {
  // Mock data - will be replaced with actual API calls
  const projects = [
    {
      id: '1',
      name: 'Authentication System',
      description: 'User authentication and authorization service',
      lastUpdated: '2 hours ago',
      memberCount: 4,
      language: 'JavaScript',
    },
    {
      id: '2',
      name: 'Dashboard UI',
      description: 'Frontend dashboard components and layouts',
      lastUpdated: '1 day ago',
      memberCount: 3,
      language: 'TypeScript',
    },
    {
      id: '3',
      name: 'API Integration',
      description: 'External API integration and middleware',
      lastUpdated: '3 days ago',
      memberCount: 2,
      language: 'Python',
    },
  ];

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FileCode size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No projects yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first project to start collaborating with your team
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <Badge variant="outline" className="bg-secondary">
                {project.language}
              </Badge>
            </div>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{project.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{project.memberCount} members</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-2">
            <Link to={`/editor?projectId=${project.id}&groupId=${groupId}`}>
              <Button size="sm">Open Editor</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
