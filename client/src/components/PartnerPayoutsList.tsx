import { Card, CardContent } from "@/components/ui/card";
import { DistributionData, PartnerPayout } from "@shared/schema";
import PartnerCard from "./PartnerCard";

type PartnerPayoutsListProps = {
  distributionData: DistributionData;
};

// Color coding for bill denominations
const getBillColor = (denomination: string) => {
  switch(denomination) {
    case "$100": return { bg: "#06623b", text: "#ffffff" }; // Green for 100s
    case "$50": return { bg: "#c67137", text: "#ffffff" };  // Orange for 50s
    case "$20": return { bg: "#2b54a1", text: "#ffffff" };  // Blue for 20s
    case "$10": return { bg: "#7b3594", text: "#ffffff" };  // Purple for 10s
    case "$5": return { bg: "#b82e5d", text: "#ffffff" };   // Pink for 5s
    case "$1": return { bg: "#777777", text: "#ffffff" };   // Gray for 1s
    default: return { bg: "#2a4240", text: "#aad4ca" };
  }
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
        <h2 className="text-xl font-bold mb-4 text-white">TIP CALCULATION</h2>
        
        <div className="bg-[#1e3330] p-4 rounded-lg mb-5">
          <div className="flex flex-wrap items-center text-lg">
            <span className="text-[#aad4ca] mr-2">Total Tips:</span> 
            <span className="text-[#e57697] font-bold mr-4">${totalAmount.toFixed(2)}</span>
            
            <span className="text-[#aad4ca] mx-2">÷</span>
            
            <span className="text-[#aad4ca] mx-2">Total Hours:</span>
            <span className="text-[#ffcc66] font-bold mr-4">{totalHours}</span>
            
            <span className="text-[#aad4ca] mx-2">=</span>
            
            <span className="text-[#76d7c4] font-bold mx-2">${hourlyRate}</span>
            <span className="text-[#aad4ca]">per hour</span>
          </div>
        </div>
        
        <h3 className="text-white font-medium mb-2">TOTAL BILLS NEEDED:</h3>
        <div className="bg-[#1e3330] p-4 rounded-lg">
          <div className="flex flex-wrap gap-3">
            {Object.entries(billsNeeded).map(([bill, count], index) => {
              const colors = getBillColor(bill);
              return (
                <span 
                  key={index} 
                  className="px-4 py-2 rounded-full text-base font-medium"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {count} × {bill}
                </span>
              );
            })}
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
