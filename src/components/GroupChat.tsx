
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GroupChatProps {
  groupId: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
}

const GroupChat: React.FC<GroupChatProps> = ({ groupId }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for initial messages - will be replaced with actual API calls
  useEffect(() => {
    // Simulate fetching messages from API
    const initialMessages: ChatMessage[] = [
      {
        id: '1',
        userId: '2',
        userName: 'Jane Smith',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        content: 'Hello everyone! How are we doing with the authentication module?',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: '2',
        userId: '3',
        userName: 'Bob Johnson',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        content: 'I\'ve completed the login form, but still working on the password reset feature.',
        timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      },
      {
        id: '3',
        userId: '4',
        userName: 'Alice Williams',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        content: 'Great progress! I\'ll help with the email verification part.',
        timestamp: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
      }
    ];
    
    setMessages(initialMessages);
  }, [groupId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would be sent to a backend API
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: user!.id,
      userName: user!.name,
      userAvatar: user!.avatar,
      content: message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
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
  };

  return (
    <Card className="border rounded-lg overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="font-medium">Group Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              flex max-w-[80%] ${msg.userId === user?.id ? 'flex-row-reverse' : 'flex-row'}
            `}>
              <Avatar className="h-8 w-8 flex-shrink-0 mx-2">
                <AvatarImage src={msg.userAvatar} alt={msg.userName} />
                <AvatarFallback>{msg.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className={`
                  rounded-lg px-4 py-2 inline-block
                  ${msg.userId === user?.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'}
                `}>
                  {msg.content}
                </div>
                <div className={`
                  text-xs text-muted-foreground mt-1
                  ${msg.userId === user?.id ? 'text-right' : 'text-left'}
                `}>
                  {msg.userId !== user?.id && (
                    <span className="font-medium mr-2">{msg.userName}</span>
                  )}
                  {formatTimestamp(msg.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={!message.trim()}
          >
            <Send size={18} />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GroupChat;
