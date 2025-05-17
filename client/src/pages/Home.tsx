import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileDropzone from "@/components/FileDropzone";
import ResultsSummaryCard from "@/components/ResultsSummaryCard";
import PartnerPayoutsList from "@/components/PartnerPayoutsList";
import { useTipContext } from "@/context/TipContext";
import { apiRequest } from "@/lib/queryClient";
import { calculateHourlyRate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center py-6 px-4 bg-[#164734]">
      <div className="w-full max-w-md">
        <div className="bg-[#1e5b45] rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Starbucks Logo */}
          <div className="flex flex-col items-center justify-center pt-8 pb-4">
            <div className="relative w-28 h-28 bg-[#1e5b45] rounded-full flex items-center justify-center p-2">
              <svg viewBox="0 0 512 512" className="w-full h-full">
                <circle cx="256" cy="256" r="256" fill="#1e5b45"/>
                <path d="M256,100c-42.7,0-76.5,13.3-97.4,34.2c-20.3,20.4-27,44.5-27.3,69.2c-0.1,4.9,3.8,8.9,8.7,8.9h0.3
                  c4.7,0,8.5-3.7,8.7-8.4c0.5-10.1,1.4-18.3,3.9-25.5c2-6.1,5-11.6,8.9-16.6c3.8-5,8.5-9.5,13.8-13.7c5.2-4.1,11-7.8,17.2-11
                  c6.2-3.2,12.8-5.8,19.5-7.9c6.7-2.1,13.7-3.7,20.6-4.7c6.9-1.1,13.9-1.6,20.7-1.6c6.8,0,13.8,0.5,20.7,1.6
                  c6.9,1.1,13.9,2.7,20.6,4.7c6.7,2.1,13.3,4.7,19.5,7.9c6.2,3.2,12,6.9,17.2,11c5.2,4.1,9.9,8.7,13.8,13.7
                  c3.8,5,6.8,10.5,8.9,16.6c2.4,7.2,3.3,15.4,3.9,25.5c0.2,4.7,4,8.4,8.7,8.4h0.3c4.9,0,8.7-4,8.7-8.9c-0.3-24.7-7-48.8-27.3-69.2
                  C332.5,113.3,298.7,100,256,100z" fill="#fff"/>
                <path d="M372.9,264.9c0,0-7.5,3.2-14.4,6.4c-7,3.2-13.3,6.4-19.3,8.2c-6,1.8-15.5,4.2-15.5,4.2s-7-0.8-11.5-2
                  c-4.6-1.3-9.9-3.1-16.5-3.9c-6.6-0.7-14.3-0.7-20.9,0c-6.6,0.7-11.9,2.6-16.5,3.9c-4.6,1.3-11.5,2-11.5,2s-9.5-2.4-15.5-4.2
                  c-6-1.8-12.3-5-19.3-8.2c-6.9-3.2-14.4-6.4-14.4-6.4c-8.9-4-16.3,5.2-10.2,12.7l0,0c4.6,5.7,9.6,10.9,14.4,15.5
                  c5.4,5.1,10.7,9.5,16.1,13.7c5.3,4.1,10.7,8,16,11.6c5.3,3.6,10.5,7,15.8,10.1c5.2,3.1,10.5,6,15.7,8.6c5.2,2.6,10.4,5,15.5,7.2
                  c0.9,0.4,1.8,0.8,2.8,1.2c2,5.1,3.6,19.7,4.3,39c0.1,3.1,2.4,5.5,5.5,5.5h1.6c3,0,5.4-2.5,5.5-5.5c0.7-19.5,2.3-34.1,4.3-38.9
                  c0.8-0.3,1.6-0.7,2.5-1.1c5.1-2.2,10.3-4.6,15.5-7.2c5.2-2.6,10.5-5.5,15.7-8.6c5.3-3.1,10.5-6.5,15.8-10.1
                  c5.3-3.6,10.7-7.5,16-11.6c5.4-4.1,10.7-8.6,16.1-13.7c4.8-4.6,9.8-9.8,14.4-15.5l0,0C389.1,270.1,381.8,260.9,372.9,264.9z" fill="#fff"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mt-4 text-white">Partner Report</h1>
          </div>

          {/* Dropzone Section */}
          <div className="px-6 py-4">
            <div className="bg-[#143d2a] rounded-xl p-6 mb-6">
              <div className="text-center mb-2">
                <p className="text-[#f0e1c1] text-lg">Upload your partner hours report</p>
              </div>
              <FileDropzone />
              <p className="text-xs text-center text-[#f0e1c1] opacity-70 mt-3">
                Supported formats: PNG, JPG, GIF
              </p>
            </div>

            {/* Total Tip Amount */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#f0e1c1]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <h2 className="text-[#f0e1c1] text-lg font-medium">Total Tip Amount</h2>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute top-0 bottom-0 left-0 flex items-center pl-4">
                  <span className="text-[#f0e1c1] font-medium">$</span>
                </div>
                <input
                  id="tipAmount"
                  type="number"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value ? Number(e.target.value) : '')}
                  className="h-12 w-full bg-[#143d2a] text-white border border-[#275343] rounded-lg py-2 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-[#f0e1c1] focus:border-transparent transition-all"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
              
            {/* Calculate Button */}
            <button 
              onClick={handleCalculate} 
              className="bg-[#f0e1c1] text-[#164734] hover:bg-[#e6d2a8] transition-all duration-300 inline-flex h-12 w-full justify-center items-center gap-2 whitespace-nowrap font-medium rounded-full px-6 py-3 shadow-md hover:shadow-lg"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#164734]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Calculate Distribution
                </div>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-[#f0e1c1] py-4 text-sm bg-[#143d2a] mt-4">
            <p>Made by William Walsh</p>
            <p>Starbucks Store #66900</p>
          </div>
        </div>
        
        {/* Results Section */}
        {distributionData && (
          <div className="mt-6 animate-fadeIn">
            <ResultsSummaryCard 
              totalHours={distributionData.totalHours}
              hourlyRate={distributionData.hourlyRate}
              totalAmount={distributionData.totalAmount}
            />
            
            <PartnerPayoutsList distributionData={distributionData} />
          </div>
        )}
      </div>
    </div>
  );
}
