import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Partners from "@/pages/Partners";
import { TipContextProvider } from "@/context/TipContext";

function AppNav() {
  const [location] = useLocation();
  
  return (
    <div className="mb-8 border-b border-[#f5f5f5]">
      <div className="flex">
        <a href="/" 
           onClick={(e) => { e.preventDefault(); window.location.href='/' }}
           className={location === "/" ? "nav-link-active" : "nav-link"}>
          Tip Distribution
        </a>
        <a href="/partners" 
           onClick={(e) => { e.preventDefault(); window.location.href='/partners' }}
           className={location === "/partners" ? "nav-link-active" : "nav-link"}>
          Partners
        </a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/partners" component={Partners} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TipContextProvider>
          <div className="flex-grow w-full bg-[#2F4F4F] text-[#f5f5f5] min-h-screen">
            <main className="max-w-7xl mx-auto py-6 px-4">
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
