import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Menu, Plus, Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ✅ Function to load user from localStorage
  const loadUser = () => {
    const u = localStorage.getItem("user");
    if (u) {
      try {
        const userData = JSON.parse(u);
        console.log("📖 Header loaded user from localStorage:", userData);
        setUser(userData);
      } catch (err) {
        console.error("❌ Failed to parse user data:", err);
        setUser(null);
      }
    } else {
      console.log("📖 No user data in localStorage");
      setUser(null);
    }
  };

  useEffect(() => {
    // Load user on mount
    console.log("🔄 Header mounted, loading user...");
    loadUser();

    // ✅ Listen for storage changes (when LoginSuccess updates localStorage)
    const handleStorageChange = (e) => {
      console.log("📡 Storage change detected:", e);
      loadUser();
    };

    // ✅ Listen for custom event (for same-tab changes)
    const handleUserLoggedIn = () => {
      console.log("📡 userLoggedIn event received");
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLoggedIn);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null); // ✅ Update state immediately
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Code2 className="h-6 w-6" />
          <span className="font-bold text-xl">CodeShare</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/explore" className="transition-colors hover:text-foreground/80">
            Explore
          </Link>
          <Link to="/docs" className="transition-colors hover:text-foreground/80">
            Docs
          </Link>
          <Link to="/pricing" className="transition-colors hover:text-foreground/80">
            Pricing
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Button size="sm" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>

          {user && (
            <Link to="/create">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Snippet
              </Button>
            </Link>
          )}

          {/* If NOT logged in */}
          {!user && (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}

          {/* If logged in */}
          {user && (
            <>
              <span className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                {user.name}
              </span>
              <Button variant="destructive" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
