
import { supabase, Group, GroupMember } from '@/lib/supabase';
import { toast } from 'sonner';

export async function fetchUserGroups() {
  try {
    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession?.session?.user) {
      return [];
    }

    const userId = userSession.session.user.id;

    // Get all groups where the user is a member
    const { data: memberships, error: membershipError } = await supabase
      .from('group_members')
      .select('group_id, role')
      .eq('user_id', userId);

    if (membershipError) {
      throw membershipError;
    }

    if (!memberships.length) {
      return [];
    }

    const groupIds = memberships.map(membership => membership.group_id);

    // Fetch the actual groups
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('*')
      .in('id', groupIds);

    if (groupsError) {
      throw groupsError;
    }

    // Enrich groups with member counts and project counts
    const enrichedGroups = await Promise.all(groups.map(async (group) => {
      // Get member count
      const { count: memberCount, error: memberCountError } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', group.id);

      // Get project count
      const { count: projectCount, error: projectCountError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', group.id);

      // Find user's role in this group
      const userMembership = memberships.find(m => m.group_id === group.id);
      const isAdmin = userMembership?.role === 'admin';

      return {
        ...group,
        memberCount: memberCount || 0,
        projectCount: projectCount || 0,
        isAdmin
      };
    }));

    return enrichedGroups;
  } catch (error) {
    console.error('Error fetching groups:', error);
    toast.error('Failed to load groups');
    return [];
  }
}

export async function fetchGroupDetails(groupId: string) {
  try {
    const { data: group, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) {
      throw error;
    }

    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession?.session?.user) {
      return { ...group, isAdmin: false };
    }

    const userId = userSession.session.user.id;

    // Check if user is admin
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (membershipError) {
      return { ...group, isAdmin: false };
    }

    return {
      ...group,
      isAdmin: membership.role === 'admin'
    };
  } catch (error) {
    console.error('Error fetching group details:', error);
    toast.error('Failed to load group details');
    return null;
  }
}

export async function createGroup(name: string, description?: string) {
  try {
    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession?.session?.user) {
      toast.error('You must be logged in to create a group');
      return null;
    }

    const userId = userSession.session.user.id;

    // Insert the new group
    const { data: group, error } = await supabase
      .from('groups')
      .insert({
        name,
        description,
        owner_id: userId
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add the creator as an admin
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: userId,
        role: 'admin'
      });

    if (memberError) {
      throw memberError;
    }

    toast.success(`Group "${name}" created successfully!`);
    return group;
  } catch (error) {
    console.error('Error creating group:', error);
    toast.error('Failed to create group');
    return null;
  }
}

export async function inviteToGroup(groupId: string, emails: string[]) {
  try {
    // In a real implementation, this would send emails to users
    // For now, let's just add the users who already exist in our system
    
    // Get users with these emails
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .in('email', emails);

    if (usersError) {
      throw usersError;
    }

    if (users.length === 0) {
      toast.info('No users found with the provided emails');
      return 0;
    }

    // Check which users are already members
    const { data: existingMembers, error: existingMembersError } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', groupId)
      .in('user_id', users.map(u => u.id));

    if (existingMembersError) {
      throw existingMembersError;
    }

    const existingMemberIds = existingMembers.map(m => m.user_id);
    const newUsers = users.filter(u => !existingMemberIds.includes(u.id));

    if (newUsers.length === 0) {
      toast.info('All provided emails are already members of this group');
      return 0;
    }

    // Add new members
    const membersToInsert = newUsers.map(user => ({
      group_id: groupId,
      user_id: user.id,
      role: 'member'
    }));

    const { error: insertError } = await supabase
      .from('group_members')
      .insert(membersToInsert);

    if (insertError) {
      throw insertError;
    }

    toast.success(`${newUsers.length} members added to the group`);
    return newUsers.length;
  } catch (error) {
    console.error('Error inviting to group:', error);
    toast.error('Failed to send invitations');
    return 0;
  }
}

export async function fetchGroupMembers(groupId: string) {
  try {
    // Get all members of this group with their roles
    const { data: memberships, error: membershipError } = await supabase
      .from('group_members')
      .select('user_id, role, joined_at')
      .eq('group_id', groupId);

    if (membershipError) {
      throw membershipError;
    }

    if (!memberships.length) {
      return [];
    }

    // Get the actual user details
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, avatar')
      .in('id', memberships.map(m => m.user_id));

    if (usersError) {
      throw usersError;
    }

    // Combine the data
    const members = memberships.map(membership => {
      const user = users.find(u => u.id === membership.user_id);
      return {
        id: membership.user_id,
        name: user?.name || 'Unknown User',
        email: user?.email || '',
        avatar: user?.avatar,
        role: membership.role,
        joinedAt: membership.joined_at
      };
    });

    return members;
  } catch (error) {
    console.error('Error fetching group members:', error);
    toast.error('Failed to load group members');
    return [];
  }
}

export async function updateMemberRole(groupId: string, userId: string, role: 'admin' | 'moderator' | 'member') {
  try {
    const { error } = await supabase
      .from('group_members')
      .update({ role })
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    toast.success('Member role updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating member role:', error);
    toast.error('Failed to update member role');
    return false;
  }
}

export async function removeMember(groupId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    toast.success('Member removed from group');
    return true;
  } catch (error) {
    console.error('Error removing member:', error);
    toast.error('Failed to remove member');
    return false;
  }
}

