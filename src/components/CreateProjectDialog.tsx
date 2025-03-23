
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createProject } from '@/services/projectService';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, { message: "Project name must be at least 2 characters" }),
  description: z.string().optional(),
  language: z.string().min(1, { message: "Please select a programming language" }),
});

type CreateProjectFormValues = z.infer<typeof formSchema>;

interface CreateProjectDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  groupId,
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      language: '',
    },
  });

  const onSubmit = async (values: CreateProjectFormValues) => {
    try {
      const newProject = await createProject(
        groupId,
        values.name,
        values.language,
        values.description
      );
      
      if (newProject) {
        form.reset();
        onOpenChange(false);
        
        // Navigate to the editor with this project
        navigate(`/editor?projectId=${newProject.id}&groupId=${groupId}`);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new coding project for your team to collaborate on.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Authentication System" {...field} />
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
                      placeholder="Describe what this project is about..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Language</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={form.formState.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
