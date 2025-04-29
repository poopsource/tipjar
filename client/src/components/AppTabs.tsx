import { Link, useLocation } from "wouter";

export default function AppTabs() {
  const [location] = useLocation();
  
  return (
    <div className="mb-8 border-b border-[hsl(var(--dark-border))]">
      <div className="flex space-x-2">
        <Link href="/" 
          className={`px-4 py-3 border-b-2 ${
            location === '/' 
              ? 'border-[hsl(var(--starbucks-green))] text-white font-semibold' 
              : 'border-transparent text-gray-400 hover:text-white transition-colors'
          }`}>
          Tip Distribution
        </Link>
        <Link href="/partners" 
          className={`px-4 py-3 border-b-2 ${
            location === '/partners' 
              ? 'border-[hsl(var(--starbucks-green))] text-white font-semibold' 
              : 'border-transparent text-gray-400 hover:text-white transition-colors'
          }`}>
          Partners
        </Link>
      </div>
    </div>
  );
}
