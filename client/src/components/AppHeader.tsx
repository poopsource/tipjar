import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import HistoryModal from "@/components/HistoryModal";
import starbucksLogoGlow from "../assets/starbucks-logo-glow.png";

export default function AppHeader() {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [location] = useLocation();
  
  return (
    <header className="bg-[#1e5b45] shadow-md animate-fadeIn">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-300">
              <img 
                src={starbucksLogoGlow} 
                alt="Starbucks"
                className="w-full h-full object-contain group-hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="transition-all">
              <h1 className="text-xl sm:text-2xl font-bold text-[#f0e1c1] group-hover:text-white transition-colors duration-300">TipJar</h1>
              <div className="hidden sm:block text-xs text-[#f0e1c1] opacity-80">Starbucks Tip Distribution</div>
              <div className="h-0.5 bg-[#f0e1c1] w-0 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>
        </Link>
        
        <div className="flex items-center">
          <Button 
            variant="outline"
            className="p-1 sm:p-2 rounded-full bg-[#143d2a] hover:bg-[#f0e1c1] hover:text-[#143d2a] transition-all duration-300 border-none"
            size="icon"
            onClick={() => setShowHistoryModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
