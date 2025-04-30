import { DistributionData } from "@shared/schema";
import PartnerCard from "./PartnerCard";

type PartnerPayoutsListProps = {
  distributionData: DistributionData;
};

// Map each bill denomination to a color
const getBillClass = (billStr: string): string => {
  switch(billStr) {
    case "$100": return "bg-[#93ec93] text-[#364949]";
    case "$50": return "bg-[#9fd6e9] text-[#364949]";
    case "$20": return "bg-[#d2b0e3] text-[#364949]";
    case "$10": return "bg-[#dd7895] text-[#364949]";
    case "$5": return "bg-[#ffd1ba] text-[#364949]";
    case "$1": return "bg-[#ffeed6] text-[#364949]";
    default: return "bg-[#93ec93] text-[#364949]";
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
    <div className="animate-fadeIn">
      <div className="card mb-8">
        <div className="card-header">
          <div className="text-2xl font-semibold tracking-tight text-[#f5f5f5]">
            Calculation
          </div>
        </div>
        
        <div className="card-body">
          <div className="p-4 rounded-lg mb-5 bg-[#364949]">
            <div className="flex flex-wrap items-center">
              <span className="mr-1 text-[#ffeed6]">Total Tips:</span> 
              <span className="font-bold mr-4 text-[#dd7895]">${totalAmount.toFixed(2)}</span>
              
              <span className="mx-1 text-[#ffeed6]">÷</span>
              
              <span className="mx-1 text-[#ffeed6]">Total Hours:</span>
              <span className="font-bold mr-4 text-[#f5f5f5]">{totalHours}</span>
              
              <span className="mx-1 text-[#ffeed6]">=</span>
              
              <span className="font-bold mx-1 text-[#9fd6e9]">
                ${(Math.floor(hourlyRate * 100) / 100).toFixed(2)}
              </span>
              <span className="text-[#ffeed6]">per hour</span>
            </div>
          </div>
          
          <h3 className="font-medium mb-2 text-[#f5f5f5]">Total Bills Needed:</h3>
          <div className="p-4 rounded-lg bg-[#364949]">
            <div className="flex flex-wrap gap-3">
              {Object.entries(billsNeeded).map(([bill, count], index) => {
                const billClass = getBillClass(bill);
                return (
                  <span 
                    key={index} 
                    className={`px-4 py-2 rounded-full text-sm font-medium ${billClass}`}
                  >
                    {count} × {bill}
                  </span>
                );
              })}
            </div>
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
