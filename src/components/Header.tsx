import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { DropletIcon, Settings, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header appearance change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass-morphism shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 max-w-5xl px-4 mx-auto">
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary transition-transform hover:scale-105"
        >
          <DropletIcon className="w-8 h-8" />
          <span className="hidden font-medium text-xl sm:inline-block">
            WellRemind
          </span>
        </Link>

        <nav className="flex items-center space-x-1">
          <Link
            to="/"
            className={cn(
              "micro-button px-4 text-sm",
              location.pathname === "/"
                ? "bg-primary text-white"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            )}
          >
            <Activity className="w-4 h-4 mr-2" />
            Home
          </Link>

          <Link
            to="/settings"
            className={cn(
              "micro-button w-10 px-0",
              location.pathname === "/settings"
                ? "bg-primary text-white"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            )}
          >
            <Settings className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
