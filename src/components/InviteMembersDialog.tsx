
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus, X } from 'lucide-react';

interface InviteMembersDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InviteMembersDialog: React.FC<InviteMembersDialogProps> = ({
  groupId,
  open,
  onOpenChange,
}) => {
  const [email, setEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  const handleAddEmail = () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (invitedEmails.includes(email)) {
      toast.error('This email has already been added');
      return;
    }

    setInvitedEmails([...invitedEmails, email]);
    setEmail('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setInvitedEmails(invitedEmails.filter(e => e !== emailToRemove));
  };

  const handleSendInvites = async () => {
    if (invitedEmails.length === 0) {
      toast.error('Please add at least one email address');
      return;
    }

    try {
      console.log('Sending invites to:', invitedEmails, 'for group:', groupId);
      // TODO: Replace with actual API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Invitations sent to ${invitedEmails.length} email(s)`);
      setInvitedEmails([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Failed to send invitations. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Invite team members to join this project group.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-end gap-2 mt-2">
          <div className="flex-1">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              placeholder="colleague@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddEmail();
                }
              }}
            />
          </div>
          <Button type="button" onClick={handleAddEmail}>
            Add
          </Button>
        </div>
        
        {invitedEmails.length > 0 && (
          <div className="mt-4">
            <Label>Pending invites</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {invitedEmails.map((invitedEmail) => (
                <div 
                  key={invitedEmail}
                  className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                >
                  <span className="mr-1">{invitedEmail}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveEmail(invitedEmail)}
                    className="text-secondary-foreground/70 hover:text-secondary-foreground"
                  >
                    <X size={14} />
                    <span className="sr-only">Remove</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendInvites} className="flex items-center gap-2">
            <UserPlus size={16} />
            Send Invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersDialog;
