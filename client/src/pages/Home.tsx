import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileDropzone from "@/components/FileDropzone";
import ResultsSummaryCard from "@/components/ResultsSummaryCard";
import PartnerPayoutsList from "@/components/PartnerPayoutsList";
import { useTipContext } from "@/context/TipContext";
import { apiRequest } from "@/lib/queryClient";
import { calculateHourlyRate } from "@/lib/utils";
import StarbucksLogo from "@/components/StarbucksLogo";
import { ArrowRightIcon, UploadIcon, CalculatorIcon } from "lucide-react";

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
        description: "Please upload a report with partner information",
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
    <main className="max-w-full overflow-hidden flex justify-center items-center">
      <div className="w-full max-w-md p-6 bg-[#0C3B2E] rounded-3xl shadow-xl">
        <div className="flex flex-col items-center justify-center mb-6">
          <StarbucksLogo className="w-24 h-24 mb-4" />
          <h1 className="text-2xl font-bold text-white">Partner Report</h1>
        </div>
        
        <div className="bg-[#0F453A] p-6 rounded-xl mb-6">
          <FileDropzone />
        </div>
        
        <div className="bg-[#0F453A] p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <CalculatorIcon className="h-5 w-5 text-white mr-2" />
            <h2 className="text-lg font-semibold text-white">Total Tip Amount</h2>
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white font-bold">$</span>
            </div>
            <input
              type="number"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value ? Number(e.target.value) : '')}
              className="w-full pl-8 pr-3 py-3 bg-[#0C3B2E] text-white rounded-lg border border-[#1E5445] focus:outline-none focus:ring-2 focus:ring-[#76A687]"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          
          <button 
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full py-3 bg-[#F3EDD7] hover:bg-opacity-90 text-[#0C3B2E] font-semibold rounded-full flex items-center justify-center"
          >
            {isCalculating ? (
              <div className="flex items-center">
                <svg className="animate-spin mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </div>
            ) : (
              <div className="flex items-center">
                <ArrowRightIcon className="h-5 w-5 mr-2" />
                Calculate Distribution
              </div>
            )}
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-white font-medium">Made by William Walsh</p>
          <p className="text-sm text-gray-400">Starbucks Store #66900</p>
        </div>
        
        {/* Results Section - Only visible after calculation */}
        {distributionData && (
          <div className="mt-8">
            <ResultsSummaryCard 
              totalHours={distributionData.totalHours}
              hourlyRate={distributionData.hourlyRate}
              totalAmount={distributionData.totalAmount}
            />
            
            <PartnerPayoutsList distributionData={distributionData} />
          </div>
        )}
      </div>
    </main>
  );
}
