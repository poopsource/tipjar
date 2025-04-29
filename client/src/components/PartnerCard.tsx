import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {
  // For the calculation display
  const exactCalculation = `${partner.hours} × $${hourlyRate} = $${(partner.hours * hourlyRate).toFixed(2)} → $${partner.rounded}`;
  
  return (
    <div className="bg-[#2d4845] rounded-lg overflow-hidden animate__animated animate__fadeIn">
      <div className="flex justify-between items-center p-4">
        <h3 className="font-medium text-white text-lg">{partner.name}</h3>
        <span className="text-[#e57697] text-2xl font-bold">${partner.rounded}</span>
      </div>
      
      <div className="bg-[#1e3330] p-2 px-4">
        <p className="text-white text-sm">{partner.hours} hours</p>
      </div>
      
      <div className="bg-[#2a4240] p-3 px-4">
        <p className="text-[#aad4ca] text-sm">{exactCalculation}</p>
      </div>
      
      <div className="bg-[#1e3330] p-3 px-4">
        <div className="flex flex-wrap gap-2">
          {partner.billBreakdown.map((bill, index) => (
            <span key={index} className="bg-[#2a4240] text-[#aad4ca] px-3 py-1 rounded-full text-sm">
              {bill.quantity}×${bill.denomination}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
