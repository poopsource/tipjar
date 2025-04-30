import { Card, CardContent } from "@/components/ui/card";
import { DistributionData, PartnerPayout } from "@shared/schema";
import PartnerCard from "./PartnerCard";

type PartnerPayoutsListProps = {
  distributionData: DistributionData;
};

export default function PartnerPayoutsList({ distributionData }: PartnerPayoutsListProps) {
  const { partnerPayouts, hourlyRate, totalAmount, totalHours } = distributionData;
  
  if (!partnerPayouts || partnerPayouts.length === 0) {
    return null;
  }
  
  // Calculate bills needed for entire distribution
  const billsNeeded: Record<string, number> = {};
  
  partnerPayouts.forEach(partner => {
    partner.billBreakdown.forEach(bill => {
      const key = `$${bill.denomination}`;
      billsNeeded[key] = (billsNeeded[key] || 0) + bill.quantity;
    });
  });
  
  return (
    <div className="animate__animated animate__fadeIn">
      <div className="mb-8 p-5 bg-[#2d4845] rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Calculation</h2>
        
        <div className="bg-[#3a5a56] p-4 rounded-lg mb-5">
          <div className="flex flex-wrap items-center">
            <span className="text-[#b3d1cb] mr-1">Total Tips:</span> 
            <span className="text-white font-bold mr-4">${totalAmount.toFixed(2)}</span>
            
            <span className="text-[#b3d1cb] mx-1">÷</span>
            
            <span className="text-[#b3d1cb] mx-1">Total Hours:</span>
            <span className="text-white font-bold mr-4">{totalHours}</span>
            
            <span className="text-[#b3d1cb] mx-1">=</span>
            
            <span className="text-white font-bold mx-1">${hourlyRate}</span>
            <span className="text-[#b3d1cb]">per hour</span>
          </div>
        </div>
        
        <h3 className="text-white font-medium mb-2">Total Bills Needed:</h3>
        <div className="bg-[#3a5a56] p-4 rounded-lg">
          <div className="flex flex-wrap gap-3">
            {Object.entries(billsNeeded).map(([bill, count], index) => (
              <span 
                key={index} 
                className="px-4 py-2 rounded bg-[#2d4845] text-white text-sm"
              >
                {count} × {bill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {partnerPayouts.map((partner, index) => (
          <PartnerCard key={index} partner={partner} hourlyRate={hourlyRate} />
        ))}
      </div>
    </div>
  );
}
