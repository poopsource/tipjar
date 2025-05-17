import { useLocation, Link } from "wouter";

export default function AppTabs() {
  const [location] = useLocation();
  
  return (
    <div className="mb-8 border-b border-border">
      <div className="flex space-x-4">
        <Link href="/">
          <a 
            className={`px-4 py-3 font-medium text-sm relative transition-colors
              ${location === '/' 
                ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-primary hover:bg-opacity-8 rounded-t-sm'
              }`}
          >
            Tip Distribution
          </a>
        </Link>
        <Link href="/partners">
          <a 
            className={`px-4 py-3 font-medium text-sm relative transition-colors
              ${location === '/partners' 
                ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-primary hover:bg-opacity-8 rounded-t-sm'
              }`}
          >
            Partners
          </a>
        </Link>
      </div>
    </div>
  );
}
