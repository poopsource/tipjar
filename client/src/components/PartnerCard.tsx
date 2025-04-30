import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { starbucksTheme } from "@/lib/colorTheme";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {  
  return (
    <div className="rounded-lg overflow-hidden animate__animated animate__fadeIn" style={{ backgroundColor: starbucksTheme.secondaryGreen }}>
      <div className="flex justify-between items-center p-4">
        <h3 className="font-medium text-lg" style={{ color: starbucksTheme.textLight }}>{partner.name}</h3>
        <span className="text-2xl font-bold" style={{ color: starbucksTheme.springPink }}>${partner.rounded}</span>
      </div>
      
      <div className="p-3" style={{ backgroundColor: starbucksTheme.primaryGreen }}>
        <div className="flex items-center mb-2">
          <span className="font-medium" style={{ color: starbucksTheme.accentGreen }}>Hours:</span>
          <span className="ml-2" style={{ color: starbucksTheme.textLight }}>{partner.hours}</span>
        </div>
        
        <div className="text-sm" style={{ color: starbucksTheme.accentGreen }}>
          {partner.hours} × ${hourlyRate} = ${(partner.hours * hourlyRate).toFixed(2)} → ${partner.rounded}
        </div>
      </div>
      
      <div className="p-3" style={{ backgroundColor: starbucksTheme.secondaryGreen }}>
        <div className="mb-2 text-sm font-medium" style={{ color: starbucksTheme.accentGreen }}>Bills:</div>
        <div className="flex flex-wrap gap-2">
          {partner.billBreakdown.map((bill, index) => (
            <span 
              key={index} 
              className="px-3 py-1 rounded text-sm"
              style={{ 
                backgroundColor: starbucksTheme.primaryGreen, 
                color: starbucksTheme.textLight 
              }}
            >
              {bill.quantity}×${bill.denomination}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
