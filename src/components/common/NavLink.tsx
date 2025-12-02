import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils"; // ShadCN utility for class merging
import type { ReactNode } from "react";

interface NavLinkProps {
  to: string;
  href?: string; // Support both 'to' and 'href' for compatibility
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

export function NavLink({
  to,
  href,
  children,
  className,
  activeClassName = "text-primary font-medium",
  exact = false,
  ...props
}: NavLinkProps) {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Use 'to' prop if provided, otherwise fall back to 'href'
  const linkTo = to || href || "";
  
  // Handle both exact and startsWith matches
  const isActive = exact ? pathname === linkTo : pathname.startsWith(linkTo);

  return (
    <Link
      to={linkTo}
      {...props}
      className={cn(
        "transition-colors text-muted-foreground hover:text-foreground",
        className,
        isActive && activeClassName
      )}
    >
      {children}
    </Link>
  );
}
