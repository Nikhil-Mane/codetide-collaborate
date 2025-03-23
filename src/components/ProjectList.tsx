
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCode, Clock, Users } from 'lucide-react';
import { fetchGroupProjects } from '@/services/projectService';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectListProps {
  groupId: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ groupId }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const data = await fetchGroupProjects(groupId);
      setProjects(data);
      setIsLoading(false);
    };

    loadProjects();
  }, [groupId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-2">
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

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
