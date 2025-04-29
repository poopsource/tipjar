import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

type PartnerCardProps = {
  partner: PartnerPayout;
};

export default function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <div className="bg-[hsl(var(--dark-bg))] rounded-lg p-4 border border-[hsl(var(--dark-border))] card-hover animate__animated animate__fadeIn">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-white">{partner.name}</h3>
        <span className="bg-[hsl(var(--starbucks-green))] bg-opacity-20 text-[hsl(var(--starbucks-light))] px-2 py-1 rounded-md text-xs">
          {partner.hours} hrs
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Payout Amount</span>
          <span className="font-mono font-bold">{formatCurrency(partner.payout)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Rounded Amount</span>
          <span className="font-mono font-bold">{formatCurrency(partner.rounded)}</span>
        </div>
      </div>
      
      <div className="border-t border-[hsl(var(--dark-border))] pt-3">
        <p className="text-sm text-gray-400 mb-2">Bill Breakdown</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {partner.billBreakdown.map((bill, index) => (
            <span key={index} className="bg-[hsl(var(--dark-surface))] px-2 py-1 rounded">
              {bill.quantity} × ${bill.denomination}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
