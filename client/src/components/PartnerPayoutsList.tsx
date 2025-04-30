import { Card, CardContent } from "@/components/ui/card";
import { DistributionData, PartnerPayout } from "@shared/schema";
import PartnerCard from "./PartnerCard";
import { starbucksTheme } from "@/lib/colorTheme";

type PartnerPayoutsListProps = {
  distributionData: DistributionData;
};

// Map each bill denomination to a spring color
const getBillColor = (billStr: string) => {
  switch(billStr) {
    case "$100": return starbucksTheme.accentGreen; // Spring green
    case "$50": return starbucksTheme.springBlue;   // Spring blue
    case "$20": return starbucksTheme.springLavender; // Spring lavender
    case "$10": return starbucksTheme.springPink;     // Spring pink
    case "$5": return starbucksTheme.springPeach;     // Spring peach
    case "$1": return starbucksTheme.springYellow;    // Spring yellow
    default: return starbucksTheme.accentGreen;
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
      <div className="mb-8 p-5 rounded-lg" style={{ backgroundColor: starbucksTheme.secondaryGreen }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: starbucksTheme.textLight }}>Calculation</h2>
        
        <div className="p-4 rounded-lg mb-5" style={{ backgroundColor: starbucksTheme.primaryGreen }}>
          <div className="flex flex-wrap items-center">
            <span className="mr-1" style={{ color: starbucksTheme.springYellow }}>Total Tips:</span> 
            <span className="font-bold mr-4" style={{ color: starbucksTheme.springAccent }}>${totalAmount.toFixed(2)}</span>
            
            <span className="mx-1" style={{ color: starbucksTheme.springYellow }}>÷</span>
            
            <span className="mx-1" style={{ color: starbucksTheme.springYellow }}>Total Hours:</span>
            <span className="font-bold mr-4" style={{ color: starbucksTheme.textLight }}>{totalHours}</span>
            
            <span className="mx-1" style={{ color: starbucksTheme.springYellow }}>=</span>
            
            <span className="font-bold mx-1" style={{ color: starbucksTheme.springBlue }}>${hourlyRate}</span>
            <span style={{ color: starbucksTheme.springYellow }}>per hour</span>
          </div>
        </div>
        
        <h3 className="font-medium mb-2" style={{ color: starbucksTheme.textLight }}>Total Bills Needed:</h3>
        <div className="p-4 rounded-lg" style={{ backgroundColor: starbucksTheme.darkBg }}>
          <div className="flex flex-wrap gap-3">
            {Object.entries(billsNeeded).map(([bill, count], index) => {
              const bgColor = getBillColor(bill);
              return (
                <span 
                  key={index} 
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: bgColor, 
                    color: "#333"
                  }}
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
