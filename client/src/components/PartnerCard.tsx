import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

// Get a CSS class based on denomination
const getBillClass = (denomination: number): string => {
  switch(denomination) {
    case 100: return "bg-[#93ec93] text-[#364949]";
    case 50: return "bg-[#9fd6e9] text-[#364949]";
    case 20: return "bg-[#d2b0e3] text-[#364949]";
    case 10: return "bg-[#dd7895] text-[#364949]";
    case 5: return "bg-[#ffd1ba] text-[#364949]";
    case 1: return "bg-[#ffeed6] text-[#364949]";
    default: return "bg-[#93ec93] text-[#364949]";
  }
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {  
  return (
    <div className="card animate-fadeIn overflow-hidden">
      <div className="card-header flex flex-row justify-between items-center py-3">
        <h3 className="font-medium text-lg text-[#f5f5f5] m-0 truncate pr-2">{partner.name}</h3>
        <span className="text-2xl font-bold text-[#dd7895] whitespace-nowrap">${partner.rounded}</span>
      </div>
      
      <div className="card-body p-3">
        <div className="flex items-center mb-2">
          <span className="font-medium text-[#ffeed6]">Hours:</span>
          <span className="ml-2 text-[#f5f5f5]">{partner.hours}</span>
        </div>
        
        <div className="text-sm flex flex-wrap items-center text-[#f5f5f5] break-words">
          <span className="mr-1">{partner.hours}</span> × 
          <span className="mx-1 text-[#9fd6e9]">${(Math.floor(hourlyRate * 100) / 100).toFixed(2)}</span><span> = </span>
          <span className="mx-1 text-[#ffeed6]">${(partner.hours * hourlyRate).toFixed(2)}</span><span> → </span>
          <span className="ml-1 font-bold text-[#dd7895]">${partner.rounded}</span>
        </div>
      </div>
      
      <div className="card-footer p-3">
        <div className="w-full">
          <div className="mb-2 text-sm font-medium text-[#ffeed6]">Bills:</div>
          <div className="flex flex-wrap gap-2">
            {partner.billBreakdown.map((bill, index) => {
              const billClass = getBillClass(bill.denomination);
              return (
                <div 
                  key={index} 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${billClass}`}
                >
                  {bill.quantity}×${bill.denomination}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
