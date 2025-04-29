import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AppTabs from "@/components/AppTabs";
import FileDropzone from "@/components/FileDropzone";
import OCRResultCard from "@/components/OCRResultCard";
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
    <main className="container mx-auto px-4 pt-6 pb-16">
      <AppTabs />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column - Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="animate__animated animate__fadeIn">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <i className="fas fa-file-upload mr-2 text-[hsl(var(--starbucks-green))]"></i>
                Upload Schedule
              </h2>
              
              <FileDropzone />
              
              <div className="flex items-center justify-between my-6">
                <div className="h-px bg-[hsl(var(--dark-border))] flex-grow"></div>
                <span className="px-4 text-gray-400">or</span>
                <div className="h-px bg-[hsl(var(--dark-border))] flex-grow"></div>
              </div>
              
              <div className="mb-6 flex items-center justify-between">
                <Label htmlFor="manual-mode" className="font-medium text-white">
                  Manual Partner Entry
                </Label>
                <Switch
                  id="manual-mode"
                  checked={isManualMode}
                  onCheckedChange={handleToggleManualMode}
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="tipAmount" className="block text-sm font-medium text-gray-400 mb-1">
                  Total Tip Amount ($)
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <Input
                    id="tipAmount"
                    type="number"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value ? Number(e.target.value) : '')}
                    className="pl-8"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleCalculate} 
                className="w-full bg-[hsl(var(--starbucks-green))]"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Calculating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-calculator mr-2"></i>
                    Calculate Distribution
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <OCRResultCard />
        </div>
        
        {/* Middle/Right Column - Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {distributionData && (
            <>
              <ResultsSummaryCard 
                totalHours={distributionData.totalHours}
                hourlyRate={distributionData.hourlyRate}
                totalAmount={distributionData.totalAmount}
                onHistoryClick={() => setShowHistoryModal(true)}
              />
              
              <PartnerPayoutsList partnerPayouts={distributionData.partnerPayouts} />
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
