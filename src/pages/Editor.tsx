
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CodeEditor from '@/components/CodeEditor';
import CollaborationPanel from '@/components/CollaborationPanel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileIcon, FolderIcon, ArrowLeftIcon, ArrowRightIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const Editor = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const groupId = searchParams.get('groupId');
  const { isAuthenticated, user } = useAuth();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  
  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if no project ID
  if (!projectId || !groupId) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch project details
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;
        
        // Fetch project files (create the table if it doesn't exist yet)
        const { data: files, error: filesError } = await supabase
          .from('project_files')
          .select('*')
          .eq('project_id', projectId)
          .order('path', { ascending: true });
          
        if (filesError) throw filesError;
        
        // If there are no files, create a default one
        if (!files || files.length === 0) {
          const defaultFileName = `index.${project.language || 'js'}`;
          const defaultContent = `// Welcome to your new ${project.language || 'JavaScript'} project!\n\nconsole.log("Hello, world!");`;
          
          const { data: newFile, error: newFileError } = await supabase
            .from('project_files')
            .insert({
              project_id: projectId,
              path: defaultFileName,
              content: defaultContent,
              is_directory: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (newFileError) throw newFileError;
          
          setProjectFiles([{
            id: newFile.id,
            name: defaultFileName,
            type: 'file',
            path: defaultFileName,
            content: defaultContent
          }]);
          
          setActiveFile(newFile.id);
          setFileContent(defaultContent);
        } else {
          // Organize files into a tree structure
          const organizedFiles = files.map(file => ({
            id: file.id,
            name: file.path.split('/').pop() || file.path,
            type: file.is_directory ? 'folder' : 'file',
            path: file.path,
            content: file.content,
            parentPath: file.path.includes('/') 
              ? file.path.substring(0, file.path.lastIndexOf('/')) 
              : null
          }));
          
          setProjectFiles(organizedFiles);
          
          // Select the first file automatically
          if (files.length > 0) {
            const firstFile = files.find(f => !f.is_directory);
            if (firstFile) {
              setActiveFile(firstFile.id);
              setFileContent(firstFile.content || '');
            }
          }
        }
        
        setProjectData(project);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error('Failed to load project data');
        setIsLoading(false);
      }
    };
    
    loadProjectData();
  }, [projectId]);
  
  const handleFileClick = async (fileId: string) => {
    try {
      const file = projectFiles.find(f => f.id === fileId);
      if (!file) return;
      
      if (file.type === 'folder') {
        // Toggle folder expanded state
        setExpandedFolders(prev => 
          prev.includes(fileId)
            ? prev.filter(id => id !== fileId)
            : [...prev, fileId]
        );
      } else {
        // Load file content
        setActiveFile(fileId);
        setFileContent(file.content || '');
        toast.info(`Opened ${file.name}`);
      }
    } catch (error) {
      console.error('Error opening file:', error);
      toast.error('Failed to open file');
    }
  };
  
  const handleSaveFile = async () => {
    if (!activeFile) return;
    
    try {
      // Find current file
      const currentFile = projectFiles.find(f => f.id === activeFile);
      if (!currentFile) return;
      
      // Save the file content to the database
      const { error } = await supabase
        .from('project_files')
        .update({ 
          content: fileContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeFile);
        
      if (error) throw error;
      
      // Also update the project's updated_at timestamp
      await supabase
        .from('projects')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', projectId);
        
      // Update local state
      setProjectFiles(prev => 
        prev.map(file => 
          file.id === activeFile 
            ? { ...file, content: fileContent } 
            : file
        )
      );
      
      toast.success('File saved successfully');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    }
  };
  
  const createNewFile = async () => {
    const fileName = prompt('Enter file name:');
    if (!fileName || !fileName.trim()) return;
    
    try {
      const { data: newFile, error } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          path: fileName,
          content: '',
          is_directory: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      const newFileObj = {
        id: newFile.id,
        name: fileName,
        type: 'file',
        path: newFile.path,
        content: ''
      };
      
      setProjectFiles(prev => [...prev, newFileObj]);
      setActiveFile(newFile.id);
      setFileContent('');
      
      toast.success(`Created new file: ${fileName}`);
    } catch (error) {
      console.error('Error creating file:', error);
      toast.error('Failed to create file');
    }
  };
  
  const renderFileTree = (items: any[]) => {
    // Group items into folders and files
    const rootItems = items.filter(item => !item.parentPath);
    
    return rootItems.map(item => (
      <div key={item.id}>
        <div 
          className={cn(
            "flex items-center py-1 px-3 rounded-md text-sm",
            "hover:bg-secondary/60 cursor-pointer",
            item.id === activeFile && "bg-primary/10 text-primary",
          )}
          onClick={() => handleFileClick(item.id)}
        >
          {item.type === 'folder' ? (
            <FolderIcon size={16} className="mr-2 flex-shrink-0 text-amber-500" />
          ) : (
            <FileIcon size={16} className="mr-2 flex-shrink-0 text-blue-500" />
          )}
          <span className="truncate">{item.name}</span>
        </div>
        {item.type === 'folder' && expandedFolders.includes(item.id) && 
          renderNestedFiles(items, item.path)}
      </div>
    ));
  };
  
  const renderNestedFiles = (allItems: any[], parentPath: string) => {
    const children = allItems.filter(item => item.parentPath === parentPath);
    
    return (
      <div className="pl-4">
        {children.map(item => (
          <div key={item.id}>
            <div 
              className={cn(
                "flex items-center py-1 px-3 rounded-md text-sm",
                "hover:bg-secondary/60 cursor-pointer",
                item.id === activeFile && "bg-primary/10 text-primary",
              )}
              onClick={() => handleFileClick(item.id)}
            >
              {item.type === 'folder' ? (
                <FolderIcon size={16} className="mr-2 flex-shrink-0 text-amber-500" />
              ) : (
                <FileIcon size={16} className="mr-2 flex-shrink-0 text-blue-500" />
              )}
              <span className="truncate">{item.name}</span>
            </div>
            {item.type === 'folder' && expandedFolders.includes(item.id) && 
              renderNestedFiles(allItems, item.path)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-16 flex overflow-hidden">
        <div
          className={cn(
            "h-full border-r transition-all duration-300 overflow-hidden",
            "glass-panel",
            isSidebarCollapsed ? "w-0 opacity-0" : "w-64 opacity-100"
          )}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <h2 className="font-medium text-sm">Project Files</h2>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={createNewFile}
                  title="Create new file"
                >
                  +
                  <span className="sr-only">New file</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsSidebarCollapsed(true)}
                >
                  <ArrowLeftIcon size={14} />
                  <span className="sr-only">Collapse sidebar</span>
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {isLoading ? (
                <div className="p-4 text-sm text-muted-foreground">Loading files...</div>
              ) : projectFiles.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No files found. Create a new file to get started.</div>
              ) : (
                renderFileTree(projectFiles)
              )}
            </div>
          </div>
        </div>
        
        {isSidebarCollapsed && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-20 z-10 h-8 w-8 rounded-full shadow-md"
            onClick={() => setIsSidebarCollapsed(false)}
          >
            <ArrowRightIcon size={14} />
            <span className="sr-only">Expand sidebar</span>
          </Button>
        )}
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold">
                  {isLoading ? 'Loading project...' : projectData?.name || 'Untitled Project'}
                </h1>
                <span className="ml-2 text-xs text-muted-foreground">
                  {projectData ? 
                    `Last edited: ${new Date(projectData.updated_at).toLocaleString()}` : 
                    'Loading...'}
                </span>
              </div>
              <Button 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleSaveFile}
                disabled={!activeFile || isLoading}
              >
                <SaveIcon size={14} />
                Save
              </Button>
            </div>
            <CodeEditor 
              initialCode={fileContent} 
              onChange={setFileContent}
              language={projectData?.language || 'javascript'}
              readOnly={isLoading || !activeFile}
            />
          </div>
          
          <div className="hidden md:block w-80 border-l p-0">
            <CollaborationPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
