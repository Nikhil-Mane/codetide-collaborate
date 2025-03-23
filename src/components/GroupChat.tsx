
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { fetchGroupChatMessages, sendChatMessage, subscribeToGroupChat } from '@/services/chatService';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      const fetchedMessages = await fetchGroupChatMessages(groupId);
      setMessages(fetchedMessages);
      setIsLoading(false);
    };

    loadMessages();

    // Set up real-time subscription
    const unsubscribe = subscribeToGroupChat(groupId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      unsubscribe();
    };
  }, [groupId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    
    try {
      setIsSending(true);
      const newMessage = await sendChatMessage(groupId, message);
      
      if (newMessage) {
        // The message will be added via the subscription
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
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
        {isLoading ? (
          // Loading state
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-20 mr-2" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-16 w-48" />
              </div>
            </div>
          ))
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No messages yet. Be the first to send one!</p>
          </div>
        ) : (
          messages.map((msg) => (
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isSending || isLoading || !user}
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
            disabled={!message.trim() || isSending || isLoading || !user}
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
