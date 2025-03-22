
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, Users, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { generateRandomUser } from '@/utils/editorUtils';

// Generate some random users for the collaboration panel
const users = Array(5).fill(0).map(() => generateRandomUser());

export const CollaborationPanel: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState<'people' | 'chat'>('people');
  const [isCollapsed, setIsCollapsed] = React.useState(isMobile);

  // Auto-collapse panel on mobile
  React.useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  // Chat messages for demo
  const chatMessages = [
    { id: 1, user: users[0], message: "Hey everyone! Just joined the session.", time: "10:32 AM" },
    { id: 2, user: users[1], message: "Welcome! We're working on the authentication module.", time: "10:33 AM" },
    { id: 3, user: users[2], message: "Has anyone fixed the login issue yet?", time: "10:35 AM" },
    { id: 4, user: users[0], message: "I'll take a look at it now.", time: "10:36 AM" },
    { id: 5, user: users[3], message: "Great. Let me know if you need help with testing.", time: "10:38 AM" },
  ];

  if (isCollapsed) {
    return (
      <div className="fixed right-4 bottom-4 z-10">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsCollapsed(false)}
        >
          <Users size={20} />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
            {users.length}
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "glass-panel flex flex-col h-full border rounded-lg overflow-hidden",
      "w-full md:w-80 animate-slide-left"
    )}>
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-medium">Collaboration</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setIsCollapsed(true)}
        >
          <span className="sr-only">Close panel</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b flex">
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors relative",
            activeTab === 'people' 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab('people')}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Users size={16} />
            People
          </div>
          {activeTab === 'people' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors relative",
            activeTab === 'chat' 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab('chat')}
        >
          <div className="flex items-center justify-center gap-1.5">
            <MessageSquare size={16} />
            Chat
            <Badge variant="secondary" className="h-5 ml-0.5 bg-secondary/80">5</Badge>
          </div>
          {activeTab === 'chat' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'people' && (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">ACTIVE NOW ({users.length})</h4>
              {users.map((user) => (
                <div key={user.id} className="flex items-center p-2 rounded-md hover:bg-secondary/50 transition-colors">
                  <div 
                    className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white font-medium text-sm"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.status}
                    </p>
                  </div>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
            
            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">INVITE OTHERS</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter email address"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1 h-6 text-xs"
                >
                  Invite
                </Button>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Or share link: 
                <button className="ml-1 text-primary hover:underline">
                  Copy link
                </button>
              </p>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
                    style={{ backgroundColor: msg.user.color }}
                  >
                    {msg.user.name.charAt(0)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center">
                      <p className="font-medium text-sm">{msg.user.name}</p>
                      <span className="text-xs text-muted-foreground ml-2">{msg.time}</span>
                    </div>
                    <p className="text-sm break-words">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t mt-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm"
                />
                <Button
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0 h-full aspect-square"
                >
                  <span className="sr-only">Send</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;
