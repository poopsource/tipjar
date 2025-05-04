import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import FileDropzone from "@/components/FileDropzone";
import ResultsSummaryCard from "@/components/ResultsSummaryCard";
import PartnerPayoutsList from "@/components/PartnerPayoutsList";
import ManualEntryModal from "@/components/ManualEntryModal";
import HistoryModal from "@/components/HistoryModal";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTipContext } from "@/context/TipContext";
import { apiRequest } from "@/lib/queryClient";
import { PartnerHours } from "@shared/schema";
import { calculateHourlyRate } from "@/lib/utils";

export default function Home() {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [tipAmount, setTipAmount] = useState<number | ''>('');
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { toast } = useToast();
  const { 
    partnerHours, 
    setPartnerHours, 
    distributionData, 
    setDistributionData,
    extractedText,
    setExtractedText
  } = useTipContext();

  // Listen for the custom event to open manual entry modal
  useEffect(() => {
    const handleOpenManualEntry = () => {
      setIsManualMode(true);
      setShowManualEntryModal(true);
    };
    
    window.addEventListener('openManualEntry', handleOpenManualEntry);
    
    return () => {
      window.removeEventListener('openManualEntry', handleOpenManualEntry);
    };
  }, []);

  const handleToggleManualMode = (checked: boolean) => {
    setIsManualMode(checked);
    if (checked) {
      setShowManualEntryModal(true);
    }
  };

  const handleCalculate = async () => {
    if (!partnerHours.length) {
      toast({
        title: "No partner data",
        description: "Please upload a schedule or enter partner information manually",
        variant: "destructive"
      });
      return;
    }

    if (!tipAmount) {
      toast({
        title: "Missing tip amount",
        description: "Please enter the total tip amount",
        variant: "destructive"
      });
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const totalHours = partnerHours.reduce((sum, partner) => sum + partner.hours, 0);
      const hourlyRate = calculateHourlyRate(Number(tipAmount), totalHours);
      
      const res = await apiRequest(
        "POST", 
        "/api/distributions/calculate", 
        {
          partnerHours,
          totalAmount: Number(tipAmount),
          totalHours,
          hourlyRate
        }
      );
      
      const calculatedData = await res.json();
      setDistributionData(calculatedData);
      
      toast({
        title: "Distribution calculated",
        description: "Tip distribution calculated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Calculation failed",
        description: "An error occurred while calculating the distribution",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <main>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Input Section */}
        <div className="md:col-span-1">
          <div className="card animate-fadeIn">
            <div className="card-body">
              <h2 className="flex items-center mb-4 text-xl font-bold">
                Upload Schedule
              </h2>
              
              <FileDropzone />
              

              
              <div className="mb-6">
                <label htmlFor="tipAmount" className="input-label">
                  Total Tip Amount ($)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute top-0 bottom-0 left-0 flex items-center pl-3">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    id="tipAmount"
                    type="number"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value ? Number(e.target.value) : '')}
                    className="input-field input-field-dollar"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleCalculate} 
                className="btn btn-primary btn-full"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <span className="animate-spin mr-2">↻</span>
                    Calculating...
                  </>
                ) : (
                  <>
                    Calculate Distribution
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Middle/Right Column - Results Section */}
        <div className="md:col-span-2">
          {distributionData && (
            <>
              <ResultsSummaryCard 
                totalHours={distributionData.totalHours}
                hourlyRate={distributionData.hourlyRate}
                totalAmount={distributionData.totalAmount}
                onHistoryClick={() => setShowHistoryModal(true)}
              />
              
              <PartnerPayoutsList distributionData={distributionData} />
            </>
          )}
        </div>
      </div>
        
      {showManualEntryModal && (
        <ManualEntryModal
          isOpen={showManualEntryModal}
          onClose={() => {
            setShowManualEntryModal(false);
            if (!partnerHours.length) {
              setIsManualMode(false);
            }
          }}
        />
      )}
      
      {showHistoryModal && (
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </main>
  );
}
