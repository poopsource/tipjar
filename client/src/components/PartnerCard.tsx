import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { starbucksTheme } from "@/lib/colorTheme";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

// Get a pastel color based on denomination
const getBillColor = (denomination: number) => {
  switch(denomination) {
    case 100: return starbucksTheme.accentGreen; // Spring green
    case 50: return starbucksTheme.springBlue;   // Spring blue
    case 20: return starbucksTheme.springLavender; // Spring lavender
    case 10: return starbucksTheme.springPink;     // Spring pink
    case 5: return starbucksTheme.springPeach;     // Spring peach
    case 1: return starbucksTheme.springYellow;    // Spring yellow
    default: return starbucksTheme.accentGreen;
  }
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {  
  return (
    <div className="rounded-lg overflow-hidden animate__animated animate__fadeIn" style={{ backgroundColor: starbucksTheme.secondaryGreen }}>
      <div className="flex justify-between items-center p-4">
        <h3 className="font-medium text-lg" style={{ color: starbucksTheme.textLight }}>{partner.name}</h3>
        <span className="text-2xl font-bold" style={{ color: starbucksTheme.springAccent }}>${partner.rounded}</span>
      </div>
      
      <div className="p-3" style={{ backgroundColor: starbucksTheme.primaryGreen }}>
        <div className="flex items-center mb-2">
          <span className="font-medium" style={{ color: starbucksTheme.springYellow }}>Hours:</span>
          <span className="ml-2" style={{ color: starbucksTheme.textLight }}>{partner.hours}</span>
        </div>
        
        <div className="text-sm flex flex-wrap items-center" style={{ color: starbucksTheme.textLight }}>
          <span className="mr-1">{partner.hours}</span> × 
          <span className="mx-1" style={{ color: starbucksTheme.springBlue }}>${hourlyRate}</span> = 
          <span className="mx-1" style={{ color: starbucksTheme.springYellow }}>${(partner.hours * hourlyRate).toFixed(2)}</span> → 
          <span className="ml-1 font-bold" style={{ color: starbucksTheme.springAccent }}>${partner.rounded}</span>
        </div>
      </div>
      
      <div className="p-3" style={{ backgroundColor: starbucksTheme.darkBg }}>
        <div className="mb-2 text-sm font-medium" style={{ color: starbucksTheme.springYellow }}>Bills:</div>
        <div className="flex flex-wrap gap-2">
          {partner.billBreakdown.map((bill, index) => {
            const bgColor = getBillColor(bill.denomination);
            return (
              <span 
                key={index} 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: bgColor, 
                  color: "#333"
                }}
              >
                {bill.quantity}×${bill.denomination}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
