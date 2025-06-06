import { DistributionData } from "@shared/schema";
import PartnerCard from "./PartnerCard";
import { Calculator, Banknote, Users } from "lucide-react";

type PartnerPayoutsListProps = {
  distributionData: DistributionData;
};

const getBillClass = (billStr: string): string => {
  switch(billStr) {
    case "$20": return "starbucks-bill-20";
    case "$10": return "starbucks-bill-10";
    case "$5": return "starbucks-bill-5";
    case "$1": return "starbucks-bill-1";
    default: return "starbucks-bill-1";
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
    <div className="space-y-8">
      {/* Calculation Overview */}
      <div className="starbucks-card starbucks-fade-in">
        <div className="starbucks-card-header">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-starbucks-forest" />
            <div>
              <h2 className="text-xl font-semibold text-starbucks-forest">Calculation Details</h2>
              <p className="text-sm text-muted-foreground">Formula breakdown and bill requirements</p>
            </div>
          </div>
        </div>
        
        <div className="starbucks-card-body space-y-6">
          <div className="starbucks-calculation">
            <h3 className="font-medium text-starbucks-forest mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Distribution Formula
            </h3>
            <div className="starbucks-calculation-formula">
              <span className="starbucks-calculation-value">
                Total Tips: ${totalAmount.toFixed(2)}
              </span>
              <span className="starbucks-calculation-operator">÷</span>
              <span className="starbucks-calculation-value">
                Total Hours: {totalHours}
              </span>
              <span className="starbucks-calculation-operator">=</span>
              <span className="starbucks-calculation-value font-bold text-starbucks-forest">
                ${(Math.floor(hourlyRate * 100) / 100).toFixed(2)} per hour
              </span>
            </div>
          </div>
          
          <div className="starbucks-calculation">
            <h3 className="font-medium text-starbucks-forest mb-3 flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              Total Bills Needed
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(billsNeeded)
                .sort(([billA], [billB]) => {
                  const denominationA = parseInt(billA.replace('$', ''));
                  const denominationB = parseInt(billB.replace('$', ''));
                  return denominationB - denominationA;
                })
                .map(([bill, count], index) => {
                  const billClass = getBillClass(bill);
                  return (
                    <div 
                      key={index} 
                      className={`starbucks-bill-badge ${billClass} text-base px-4 py-2`}
                      style={{animationDelay: `${0.1 + (index * 0.05)}s`}}
                    >
                      <span className="font-bold">{count}</span> × {bill}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Partner Cards */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-starbucks-forest" />
          <h2 className="text-xl font-semibold text-starbucks-forest">Partner Payouts</h2>
          <span className="starbucks-status-success">{partnerPayouts.length} partners</span>
        </div>
        
        <div className="starbucks-grid-responsive">
          {partnerPayouts.map((partner, index) => (
            <div key={index} style={{animationDelay: `${0.1 + (index * 0.05)}s`}}>
              <PartnerCard partner={partner} hourlyRate={hourlyRate} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}