
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export async function fetchGroupProjects(groupId: string) {
  try {
    // Get all projects for this group
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('group_id', groupId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Enrich with member counts for each project
    const enrichedProjects = await Promise.all(projects.map(async (project) => {
      // For now we'll assume all group members have access to all projects
      // This could be refined with a project_members table later
      const { count: memberCount, error: memberCountError } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId);

      if (memberCountError) {
        console.error('Error fetching project member count:', memberCountError);
      }

      return {
        ...project,
        memberCount: memberCount || 0,
        // Format the last updated time
        lastUpdated: formatTimeAgo(new Date(project.updated_at))
      };
    }));

    return enrichedProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    toast.error('Failed to load projects');
    return [];
  }
}

export async function createProject(
  groupId: string, 
  name: string, 
  language: string, 
  description?: string
) {
  try {
    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession?.session?.user) {
      toast.error('You must be logged in to create a project');
      return null;
    }

    const now = new Date().toISOString();

    // Insert the new project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        group_id: groupId,
        language,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success(`Project "${name}" created successfully!`);
    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    toast.error('Failed to create project');
    return null;
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
}

