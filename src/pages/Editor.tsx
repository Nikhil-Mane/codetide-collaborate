
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
  const { isAuthenticated } = useAuth();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  
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
        
        // Fetch project files
        const { data: files, error: filesError } = await supabase
          .from('project_files')
          .select('*')
          .eq('project_id', projectId)
          .order('path', { ascending: true });
          
        if (filesError) throw filesError;
        
        // Organize files into a tree structure
        const organizedFiles = organizeFilesIntoTree(files);
        
        setProjectData(project);
        setProjectFiles(organizedFiles);
        
        // If there are files, select the first one
        if (files.length > 0) {
          setActiveFile(files[0].id);
          setFileContent(files[0].content || '');
        } else {
          setFileContent('// No files in this project yet. Create a new file to get started.');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error('Failed to load project data');
        setIsLoading(false);
      }
    };
    
    loadProjectData();
  }, [projectId]);
  
  // Helper function to organize files into a tree structure
  const organizeFilesIntoTree = (files: any[]) => {
    if (!files || files.length === 0) {
      return [];
    }
    
    // This is just placeholder implementation
    // In a real app, you'd organize by path segments
    
    // For now, let's create a simple structure similar to the mock data
    return files.map(file => ({
      id: file.id,
      name: file.path.split('/').pop(),
      type: file.is_directory ? 'folder' : 'file',
      active: false,
      path: file.path,
      content: file.content
    }));
  };
  
  const handleFileClick = async (fileId: string) => {
    try {
      const file = projectFiles.find(f => f.id === fileId);
      if (!file) return;
      
      if (file.type === 'folder') {
        // Toggle folder open/closed
        // In a real implementation, you'd update the expandedFolders state
      } else {
        // Load file content
        setActiveFile(fileId);
        
        // In a real implementation, you might fetch the content from the server
        // if it's not already cached
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
      // Save the file content to the database
      const { error } = await supabase
        .from('project_files')
        .update({ content: fileContent })
        .eq('id', activeFile);
        
      if (error) throw error;
      
      toast.success('File saved successfully');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    }
  };

  // This is temporary - in a production app you'd use the actual project files
  // Instead of static ones when the backend integration is not complete
  type FileItem = {
    id: string;
    name: string;
    type: string;
    active?: boolean;
    children?: FileItem[];
  };
  
  const sampleFiles: FileItem[] = [
    { id: '1', name: 'index.html', type: 'file' },
    { id: '2', name: 'styles', type: 'folder', children: [
      { id: '21', name: 'main.css', type: 'file' },
      { id: '22', name: 'components.css', type: 'file' },
    ]},
    { id: '3', name: 'scripts', type: 'folder', children: [
      { id: '31', name: 'app.js', type: 'file', active: true },
      { id: '32', name: 'utils.js', type: 'file' },
      { id: '33', name: 'api.js', type: 'file' },
    ]},
    { id: '4', name: 'package.json', type: 'file' },
    { id: '5', name: 'README.md', type: 'file' },
  ];

  const [expandedFolders, setExpandedFolders] = useState<string[]>(['2', '3']);
  
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };
  
  const renderFileTree = (items: typeof sampleFiles, level = 0) => {
    return items.map(item => (
      <React.Fragment key={item.id}>
        <div 
          className={cn(
            "flex items-center py-1 px-3 rounded-md text-sm",
            "hover:bg-secondary/60 cursor-pointer",
            'type' in item && item.active && "bg-primary/10 text-primary",
          )}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              toast.info(`Opened ${item.name}`);
            }
          }}
        >
          {item.type === 'folder' ? (
            <FolderIcon size={16} className="mr-2 flex-shrink-0 text-amber-500" />
          ) : (
            <FileIcon size={16} className="mr-2 flex-shrink-0 text-blue-500" />
          )}
          <span className="truncate">{item.name}</span>
        </div>
        {item.type === 'folder' && expandedFolders.includes(item.id) && 
          'children' in item && renderFileTree(item.children, level + 1)}
      </React.Fragment>
    ));
  };

  const sampleCode = `import React, { useState, useEffect } from 'react';

// Sample React component for the collaborative code editor
function CollaborativeEditor() {
  const [content, setContent] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  
  useEffect(() => {
    // Connect to WebSocket server for real-time updates
    const ws = new WebSocket('wss://api.example.com/editor');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'content-update') {
        setContent(data.content);
      } else if (data.type === 'collaborators-update') {
        setCollaborators(data.collaborators);
      }
    };
    
    return () => {
      ws.close();
    };
  }, []);
  
  const handleChange = (newContent) => {
    setContent(newContent);
    // Send content updates to server
    // ...
  };
  
  return (
    <div className="editor-container">
      <div className="collaborators-list">
        {collaborators.map((user) => (
          <div key={user.id} className="user-badge">
            {user.name}
          </div>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        className="code-area"
      />
    </div>
  );
}

export default CollaborativeEditor;`;

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
            <div className="flex-1 overflow-y-auto py-2">
              {/* When backend integration is complete, use projectFiles instead */}
              {renderFileTree(sampleFiles)}
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
                  {projectData?.name || 'Loading project...'}
                </h1>
                <span className="ml-2 text-xs text-muted-foreground">
                  Last edited: {projectData ? new Date(projectData.updated_at).toLocaleString() : 'Loading...'}
                </span>
              </div>
              <Button 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleSaveFile}
                disabled={!activeFile}
              >
                <SaveIcon size={14} />
                Save
              </Button>
            </div>
            <CodeEditor 
              initialCode={fileContent || sampleCode} 
              onChange={setFileContent} 
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
