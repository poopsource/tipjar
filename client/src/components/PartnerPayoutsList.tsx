import { Card, CardContent } from "@/components/ui/card";
import { DistributionData, PartnerPayout } from "@shared/schema";
import PartnerCard from "./PartnerCard";

type PartnerPayoutsListProps = {
  distributionData: DistributionData;
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
        <h2 className="text-xl font-bold mb-3 text-white">Calculation:</h2>
        <p className="text-[#aad4ca] mb-4">
          Total Tips: ${totalAmount.toFixed(2)} ÷ Total Hours: {totalHours} = ${hourlyRate} per hour
        </p>
        
        <div className="bg-[#1e3330] p-3 rounded-lg">
          <h3 className="text-white mb-2">Bills Needed:</h3>
          <div className="flex gap-3">
            {Object.entries(billsNeeded).map(([bill, count], index) => (
              <span key={index} className="text-[#aad4ca]">
                {count} × {bill}
              </span>
            ))}
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
