import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {  
  return (
    <div className="bg-[#2d4845] rounded-lg overflow-hidden animate__animated animate__fadeIn">
      <div className="flex justify-between items-center p-4">
        <h3 className="font-medium text-white text-lg">{partner.name}</h3>
        <span className="text-white text-2xl font-bold">${partner.rounded}</span>
      </div>
      
      <div className="bg-[#3a5a56] p-3">
        <div className="flex items-center mb-2">
          <span className="text-[#b3d1cb] font-medium">Hours:</span>
          <span className="ml-2 text-white">{partner.hours}</span>
        </div>
        
        <div className="text-[#b3d1cb] text-sm">
          {partner.hours} × ${hourlyRate} = ${(partner.hours * hourlyRate).toFixed(2)} → ${partner.rounded}
        </div>
      </div>
      
      <div className="p-3 bg-[#2d4845]">
        <div className="text-[#b3d1cb] mb-2 text-sm font-medium">Bills:</div>
        <div className="flex flex-wrap gap-2">
          {partner.billBreakdown.map((bill, index) => (
            <span 
              key={index} 
              className="bg-[#3a5a56] text-white px-3 py-1 rounded text-sm"
            >
              {bill.quantity}×${bill.denomination}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
