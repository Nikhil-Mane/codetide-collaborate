
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export async function fetchGroupChatMessages(groupId: string) {
  try {
    // Get messages for this group with user details
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select(`
        id,
        content,
        created_at,
        user_id,
        users:user_id (
          name,
          avatar
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // Format the messages
    return messages.map(message => ({
      id: message.id,
      userId: message.user_id,
      userName: message.users ? message.users.name : 'Unknown User',
      userAvatar: message.users ? message.users.avatar : null,
      content: message.content,
      timestamp: message.created_at
    }));
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    toast.error('Failed to load chat messages');
    return [];
  }
}

export async function sendChatMessage(groupId: string, content: string) {
  try {
    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession?.session?.user) {
      toast.error('You must be logged in to send messages');
      return null;
    }

    const userId = userSession.session.user.id;

    // Insert the message
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        group_id: groupId,
        user_id: userId,
        content,
        created_at: new Date().toISOString()
      })
      .select(`
        id,
        content,
        created_at,
        user_id,
        users:user_id (
          name,
          avatar
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    return {
      id: message.id,
      userId: message.user_id,
      userName: message.users ? message.users.name : 'Unknown User',
      userAvatar: message.users ? message.users.avatar : null,
      content: message.content,
      timestamp: message.created_at
    };
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
    return null;
  }
}

export function subscribeToGroupChat(groupId: string, onNewMessage: (message: any) => void) {
  // Set up real-time subscription for new messages
  const subscription = supabase
    .channel(`chat:${groupId}`)
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'chat_messages',
      filter: `group_id=eq.${groupId}`
    }, async (payload) => {
      // When a new message is inserted, fetch the full details and notify
      const { data: message } = await supabase
        .from('chat_messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          users:user_id (
            name,
            avatar
          )
        `)
        .eq('id', payload.new.id)
        .single();

      if (message) {
        onNewMessage({
          id: message.id,
          userId: message.user_id,
          userName: message.users ? message.users.name : 'Unknown User',
          userAvatar: message.users ? message.users.avatar : null,
          content: message.content,
          timestamp: message.created_at
        });
      }
    })
    .subscribe();

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}
