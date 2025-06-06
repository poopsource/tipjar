import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileDropzone from "@/components/FileDropzone";
import ResultsSummaryCard from "@/components/ResultsSummaryCard";
import PartnerPayoutsList from "@/components/PartnerPayoutsList";
import { useTipContext } from "@/context/TipContext";
import { apiRequest } from "@/lib/queryClient";
import { calculateHourlyRate } from "@/lib/utils";
import { Coffee, Calculator, Users, DollarSign } from "lucide-react";

export default function Home() {
  const [tipAmount, setTipAmount] = useState<number | ''>('');
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { toast } = useToast();
  const { 
    partnerHours, 
    distributionData, 
    setDistributionData
  } = useTipContext();

  const handleCalculate = async () => {
    if (!partnerHours.length) {
      toast({
        title: "No partner data",
        description: "Please upload a schedule with partner information",
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="starbucks-container py-6 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-starbucks-forest rounded-xl flex items-center justify-center shadow-medium">
              <Coffee className="w-6 h-6 text-starbucks-warm-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-starbucks-forest">TipJar</h1>
              <p className="text-sm text-muted-foreground">Smart tip distribution for partners</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{partnerHours.length} partners</span>
            </div>
            {distributionData && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>${distributionData.totalAmount.toFixed(2)} total</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="starbucks-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="starbucks-card starbucks-fade-in">
              <div className="starbucks-card-header">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-starbucks-forest" />
                  <div>
                    <h2 className="text-lg font-semibold text-starbucks-forest">Calculate Distribution</h2>
                    <p className="text-sm text-muted-foreground">Upload schedule and enter tip amount</p>
                  </div>
                </div>
              </div>
              
              <div className="starbucks-card-body space-y-6">
                <FileDropzone />
                
                <div className="space-y-3">
                  <label htmlFor="tipAmount" className="starbucks-label">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Total Tip Amount
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </div>
                    <input
                      id="tipAmount"
                      type="number"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(e.target.value ? Number(e.target.value) : '')}
                      className="starbucks-input pl-8"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={handleCalculate} 
                  className="starbucks-btn starbucks-btn-primary w-full"
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4" />
                      Calculate Distribution
                    </>
                  )}
                </button>
              </div>
              
              <div className="starbucks-card-footer border-t border-border/30 text-center text-sm text-muted-foreground">
                <div className="font-medium text-starbucks-forest">Made by William Walsh</div>
                <div className="text-xs">Starbucks Store #66900</div>
              </div>
            </div>
            
            {/* Mobile Results Indicator */}
            {distributionData && (
              <div className="lg:hidden mt-6 starbucks-card p-4 text-center starbucks-slide-up">
                <div className="flex items-center justify-center gap-2 text-starbucks-forest">
                  <div className="w-2 h-2 bg-starbucks-gold rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Scroll down to see distribution results</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Results Section */}
          <div className="lg:col-span-2">
            {distributionData ? (
              <div className="space-y-8 starbucks-slide-up">
                <ResultsSummaryCard 
                  totalHours={distributionData.totalHours}
                  hourlyRate={distributionData.hourlyRate}
                  totalAmount={distributionData.totalAmount}
                />
                
                <PartnerPayoutsList distributionData={distributionData} />
              </div>
            ) : (
              <div className="starbucks-card h-full flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-starbucks-beige rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Coffee className="w-8 h-8 text-starbucks-sage" />
                  </div>
                  <h3 className="text-lg font-medium text-starbucks-forest mb-2">Ready to Calculate</h3>
                  <p className="text-muted-foreground max-w-md">
                    Upload your partner schedule and enter the total tip amount to get started with the distribution calculation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}