'use client';

import { UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push('/admin/profile');
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 bottom-auto flex items-center justify-end p-4 border-b border-gray-200 border-solid
     z-50 transform transition-transform bg-white duration-300 ease-in-out">
      {/* Right: Admin Profile */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">admin</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 outline-none">
              <UserIcon className="h-6 w-6 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={handleViewProfile}
              className="cursor-pointer"
            >
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
