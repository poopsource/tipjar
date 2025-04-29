import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import HistoryModal from "@/components/HistoryModal";

export default function AppHeader() {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [location] = useLocation();
  
  return (
    <header className="bg-[hsl(var(--starbucks-dark))] shadow-md animate__animated animate__fadeIn">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-10 h-10 bg-[hsl(var(--starbucks-green))] rounded-full flex items-center justify-center">
              <i className="fas fa-mug-hot text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-white">TipJar</h1>
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="flex items-center bg-[hsl(var(--dark-surface))] hover:bg-opacity-80 transition-all border-none"
            onClick={() => setShowHistoryModal(true)}
          >
            <i className="fas fa-history mr-2"></i>
            <span className="hidden sm:inline">History</span>
          </Button>
          
          <Button 
            variant="outline"
            className="p-2 rounded-full bg-[hsl(var(--dark-surface))] hover:bg-opacity-80 transition-all border-none" 
            size="icon"
          >
            <i className="fas fa-cog"></i>
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
