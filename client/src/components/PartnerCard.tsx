import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { User, Clock, Calculator, Banknote } from "lucide-react";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

const getBillClass = (denomination: number): string => {
  switch(denomination) {
    case 20: return "starbucks-bill-20";
    case 10: return "starbucks-bill-10";
    case 5: return "starbucks-bill-5";
    case 1: return "starbucks-bill-1";
    default: return "starbucks-bill-1";
  }
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {  
  return (
    <div className="starbucks-partner-card starbucks-slide-up">
      <div className="starbucks-partner-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-starbucks-warm-white/20 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-starbucks-warm-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-starbucks-warm-white truncate">{partner.name}</h3>
            <p className="text-starbucks-warm-white/80 text-sm">Partner</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-starbucks-warm-white/80">Payout</div>
          <div className="text-2xl font-bold text-starbucks-warm-white">${partner.rounded}</div>
        </div>
      </div>
      
      <div className="starbucks-partner-body">
        <div className="starbucks-calculation mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-starbucks-forest" />
            <span className="font-medium text-starbucks-forest">Hours Worked:</span>
            <span className="starbucks-status-success">{partner.hours}</span>
          </div>
          
          <div className="starbucks-calculation-formula">
            <span className="starbucks-calculation-value">{partner.hours} hours</span>
            <span className="starbucks-calculation-operator">×</span>
            <span className="starbucks-calculation-value">${(Math.floor(hourlyRate * 100) / 100).toFixed(2)}</span>
            <span className="starbucks-calculation-operator">=</span>
            <span className="starbucks-calculation-value">${(partner.hours * hourlyRate).toFixed(2)}</span>
            <span className="starbucks-calculation-operator">→</span>
            <span className="starbucks-calculation-value font-bold text-starbucks-forest">${partner.rounded}</span>
          </div>
        </div>
      </div>
      
      <div className="starbucks-partner-footer border-t border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <Banknote className="w-4 h-4 text-starbucks-forest" />
          <span className="font-medium text-starbucks-forest">Bill Breakdown:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...partner.billBreakdown]
            .sort((a, b) => b.denomination - a.denomination)
            .map((bill, index) => (
              <div 
                key={index} 
                className={`starbucks-bill-badge ${getBillClass(bill.denomination)}`}
              >
                {bill.quantity}×${bill.denomination}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}