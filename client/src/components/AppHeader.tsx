import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import HistoryModal from "@/components/HistoryModal";

export default function AppHeader() {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [location] = useLocation();
  
  return (
    <header className="bg-card shadow-md-1 animate-fadeIn z-10">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-md-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-foreground group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="transition-all">
              <h1 className="text-xl sm:text-2xl font-medium text-foreground group-hover:text-primary transition-colors duration-300">TipJar</h1>
              <div className="hidden sm:block text-xs text-muted-foreground font-roboto">Smart Tip Distribution</div>
              <div className="h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost"
            className="p-2 rounded-full hover:bg-primary hover:bg-opacity-8 transition-all duration-300 text-muted-foreground hover:text-primary"
            size="icon"
            onClick={() => setShowHistoryModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Button>
          
          <Button 
            variant="ghost"
            className="p-2 rounded-full hover:bg-primary hover:bg-opacity-8 transition-all duration-300 text-muted-foreground hover:text-primary"
            size="icon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Button>
        </div>
      </div>
      
      {showHistoryModal && (
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </header>
  );
}
