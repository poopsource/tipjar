import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

// Color coding for bill denominations
const getBillColor = (denomination: number) => {
  switch(denomination) {
    case 100: return { bg: "#06623b", text: "#ffffff" }; // Green for 100s
    case 50: return { bg: "#c67137", text: "#ffffff" };  // Orange for 50s
    case 20: return { bg: "#2b54a1", text: "#ffffff" };  // Blue for 20s
    case 10: return { bg: "#7b3594", text: "#ffffff" };  // Purple for 10s
    case 5: return { bg: "#b82e5d", text: "#ffffff" };   // Pink for 5s
    case 1: return { bg: "#777777", text: "#ffffff" };   // Gray for 1s
    default: return { bg: "#2a4240", text: "#aad4ca" };
  }
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {  
  return (
    <div className="bg-[#2d4845] rounded-lg overflow-hidden animate__animated animate__fadeIn">
      <div className="flex justify-between items-center p-4">
        <h3 className="font-medium text-white text-lg">{partner.name}</h3>
        <span className="text-[#e57697] text-3xl font-bold">${partner.rounded}</span>
      </div>
      
      <div className="bg-[#1e3330] p-2 px-4">
        <p className="text-white text-sm">
          <span className="text-[#aad4ca]">Hours:</span> 
          <span className="ml-2 font-bold text-[#ffcc66]">{partner.hours}</span>
        </p>
      </div>
      
      <div className="bg-[#2a4240] p-3 px-4">
        <p className="text-[#aad4ca] text-sm flex flex-wrap items-center">
          <span className="font-medium mr-1">{partner.hours}</span> × 
          <span className="mx-1 text-[#76d7c4] font-medium">${hourlyRate}</span> = 
          <span className="mx-1 text-[#ffcc66]">${(partner.hours * hourlyRate).toFixed(2)}</span> → 
          <span className="ml-1 text-[#e57697] font-bold">${partner.rounded}</span>
        </p>
      </div>
      
      <div className="bg-[#1e3330] p-3 px-4">
        <p className="text-[#aad4ca] text-xs mb-2">BILLS NEEDED:</p>
        <div className="flex flex-wrap gap-2">
          {partner.billBreakdown.map((bill, index) => {
            const colors = getBillColor(bill.denomination);
            return (
              <span 
                key={index} 
                className="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                style={{ backgroundColor: colors.bg, color: colors.text }}
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
