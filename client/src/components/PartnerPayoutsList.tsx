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
      <div className="card mb-8 shadow-soft">
        <div className="card-header">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#93EC93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="text-xl font-semibold tracking-tight text-[#f5f5f5]">
              Calculation Details
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="p-5 rounded-lg mb-5 bg-[#364949] gradient-border animate-fadeUp">
            <div className="text-xs text-[#9fd6e9] mb-2">Formula</div>
            <div className="flex flex-wrap items-center">
              <div className="bg-[#1E3535] px-4 py-2 rounded-md mr-3 mb-2 formula-item">
                <span className="text-[#ffeed6] text-sm mr-1">Total Tips:</span> 
                <span className="font-bold text-[#dd7895]">${totalAmount.toFixed(2)}</span>
              </div>
              
              <span className="mx-2 text-[#ffeed6] text-lg mb-2">÷</span>
              
              <div className="bg-[#1E3535] px-4 py-2 rounded-md mr-3 mb-2 formula-item">
                <span className="text-[#ffeed6] text-sm mr-1">Total Hours:</span>
                <span className="font-bold text-[#f5f5f5]">{totalHours}</span>
              </div>
              
              <span className="mx-2 text-[#ffeed6] text-lg mb-2">=</span>
              
              <div className="bg-[#1E3535] px-4 py-2 rounded-md mb-2 formula-item">
                <span className="font-bold text-[#9fd6e9]">
                  ${(Math.floor(hourlyRate * 100) / 100).toFixed(2)}
                </span>
                <span className="text-[#ffeed6] text-sm ml-1">per hour</span>
              </div>
            </div>
          </div>
          
          <div className="animate-fadeUp" style={{animationDelay: "0.1s"}}>
            <h3 className="flex items-center font-medium mb-3 text-[#f5f5f5]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#93EC93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Total Bills Needed:
            </h3>
            <div className="p-5 rounded-lg bg-[#364949] shadow-soft">
              <div className="flex flex-wrap gap-3">
                {Object.entries(billsNeeded).map(([bill, count], index) => {
                  const billClass = getBillClass(bill);
                  return (
                    <div 
                      key={index} 
                      className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-md hover:scale-105 ${billClass}`}
                      style={{animationDelay: `${0.1 + (index * 0.05)}s`}}
                    >
                      <div className="flex items-center">
                        <span className="font-bold mr-1">{count}</span> × {bill}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
        {partnerPayouts.map((partner, index) => (
          <div key={index} style={{animationDelay: `${0.1 + (index * 0.05)}s`}}>
            <PartnerCard partner={partner} hourlyRate={hourlyRate} />
          </div>
        ))}
      </div>
    </div>
  );
}
