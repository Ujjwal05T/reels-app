import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Film, Upload, User, Menu, LogIn, LogOut, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useNotification } from "./Notification";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    showNotification(`Switched to ${newTheme} theme`, "success");
  };
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen ">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      {/* Page content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile navbar */}
        <div className="navbar bg-base-100 lg:hidden sticky top-0 z-30 shadow-sm">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost drawer-button">
             {theme === 'light' ? <Menu size={20} className="text-black" /> : <Menu size={20} className="text-white" />}
            </label>
          </div>
          <div className="flex-1">
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              ReelsApp
            </Link>
          </div>
          {/* Add theme toggle button to mobile navbar */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-circle"
          >
            {theme === 'light' ? <Moon size={20} className="text-black" /> : <Sun size={20} />}
          </button>
        </div>
        
        {/* Main content */}
        <main className="flex-grow p-4 md:p-8 bg-base-100">
          {children}
        </main>
      </div>
      
      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-64 min-h-full bg-base-200 text-base-content flex flex-col">
          <div className="mb-8 px-4">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">ReelsApp</h1>
          </div>
          
          {/* User info if logged in */}
          {session && (
            <div className="px-4 py-3 mb-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary/20 text-primary rounded-full w-10">
                    <span className="text-lg">{session.user?.email?.substring(0, 1).toUpperCase()}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium">{session.user?.email?.split("@")[0]}</p>
                  <p className="text-xs text-base-content/70">{session.user?.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <ul className="space-y-2">
            <li>
              <Link 
                href="/" 
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-base-300/50'
                }`}
              >
                <Home size={18} />
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/reels" 
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isActive('/reels') 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-base-300/50'
                }`}
              >
                <Film size={18} />
                Reels
              </Link>
            </li>
            {session && (
              <li>
                <Link 
                  href="/upload" 
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    isActive('/upload') 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'hover:bg-base-300/50'
                  }`}
                >
                  <Upload size={18} />
                  Upload
                </Link>
              </li>
            )}
          </ul>
          
          <div className="mt-auto">
            <div className="divider"></div>
            
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme}
              className="btn btn-outline w-[95%] gap-2 mb-3"
            >
              {theme === 'light' ? (
                <>
                  <Moon size={18} />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun size={18} />
                  Light Mode
                </>
              )}
            </button>
            
            { session ? (
              <button 
                onClick={handleSignOut}
                className="btn btn-outline btn-error w-[95%] gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            ) : (
              <>
              <Link 
                href="/login"
                className="btn btn-primary w-[95%] gap-2"
                onClick={() => showNotification("Please sign in to continue", "info")}
              >
                <LogIn size={18} />
                Sign In
              </Link>
              </>
            )}
            
            <div className="mt-6 px-4 py-3 bg-primary/5 rounded-lg">
              <p className="text-sm text-base-content/70">
                Enjoy creating and sharing your reels!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}