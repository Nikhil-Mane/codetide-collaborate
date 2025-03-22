
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, FolderPlus } from 'lucide-react';

export const AuthButtons: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="cursor-pointer flex w-full">
              <FolderPlus className="mr-2 h-4 w-4" />
              <span>My Project Groups</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/editor" className="cursor-pointer flex w-full">
              <User className="mr-2 h-4 w-4" />
              <span>Code Editor</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer flex w-full">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={logout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm" className="rounded-md">
        <Link to="/login">Log in</Link>
      </Button>
      <Button asChild size="sm" className="rounded-md">
        <Link to="/signup">Sign up</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
