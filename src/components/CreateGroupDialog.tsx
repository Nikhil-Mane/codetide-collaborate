
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: "Group name must be at least 2 characters" }),
  description: z.string().optional(),
});

type CreateGroupFormValues = z.infer<typeof formSchema>;

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (values: CreateGroupFormValues) => {
    try {
      console.log('Creating group:', values);
      // TODO: Replace with actual API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Group "${values.name}" created successfully!`);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project Group</DialogTitle>
          <DialogDescription>
            Create a group to collaborate with team members on coding projects.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Frontend Team" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this group is for..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Group</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
