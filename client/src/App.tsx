import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { TipContextProvider } from "@/context/TipContext";

function AppNav() {
  const [location] = useLocation();
  
  return (
    <div className="mb-8 border-b border-[#006241]">
      <div className="flex items-center justify-center relative">
        <a href="/" 
           onClick={(e) => { e.preventDefault(); window.location.href='/' }}
           className="py-3">
          <img 
            src="/tipjar-logo.png" 
            alt="TipJar Logo" 
            className="h-12 sm:h-14 animate-fadeIn"
          />
        </a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TipContextProvider>
          <div className="flex-grow w-full bg-transparent text-[#006241] min-h-screen">
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
              <AppNav />
              <div className="flex-grow">
                <Router />
              </div>
            </main>
          </div>
          <Toaster />
        </TipContextProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
