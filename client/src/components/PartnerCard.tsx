import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

// Get a CSS class based on denomination - Material 3 color palette
const getBillClass = (denomination: number): string => {
  switch(denomination) {
    case 20: return "bg-tertiary text-tertiary-foreground"; // Purple for $20
    case 10: return "bg-secondary text-secondary-foreground"; // Pink for $10
    case 5: return "bg-accent text-accent-foreground";  // Accent for $5
    case 1: return "bg-muted text-foreground";  // Muted for $1
    default: return "bg-primary text-primary-foreground"; // Primary fallback
  }
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {  
  return (
    <div className="bg-card animate-fadeUp overflow-hidden shadow-md-2 rounded-lg">
      <div className="bg-primary/5 flex flex-row justify-between items-center p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3 border border-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="font-medium text-lg text-foreground m-0 truncate pr-2">{partner.name}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">Payout</span>
          <span className="text-2xl font-medium text-secondary whitespace-nowrap animate-pulse">${partner.rounded}</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-4 bg-background rounded-lg p-3 shadow-md-1">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-foreground">Hours:</span>
          </div>
          <span className="bg-muted px-4 py-1.5 rounded-full text-foreground text-sm font-medium shadow-md-1">{partner.hours}</span>
        </div>
        
        <div className="bg-background rounded-lg p-4 mb-4 shadow-md-1">
          <div className="text-xs mb-2 text-muted-foreground font-medium">Calculation</div>
          <div className="text-sm flex flex-wrap items-center text-foreground break-words">
            <span className="mr-1 font-medium">{partner.hours}</span> 
            <span className="text-muted-foreground mx-1">×</span> 
            <span className="mx-1 text-primary font-medium">${(Math.floor(hourlyRate * 100) / 100).toFixed(2)}</span>
            <span className="text-muted-foreground mx-1">=</span>
            <span className="mx-1 text-muted-foreground font-medium">${(partner.hours * hourlyRate).toFixed(2)}</span>
            <span className="text-muted-foreground mx-1">→</span>
            <span className="ml-1 font-medium text-secondary">${partner.rounded}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-primary/5 p-4">
        <div className="w-full">
          <div className="mb-3 text-sm font-medium text-foreground flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Bill Breakdown:
          </div>
          <div className="flex flex-wrap gap-2">
            {[...partner.billBreakdown]
              .sort((a, b) => b.denomination - a.denomination) // Sort in descending order
              .map((bill, index) => {
                const billClass = getBillClass(bill.denomination);
                return (
                  <div 
                    key={index} 
                    className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-md-1 transition-all hover:shadow-md-2 hover:scale-105 ${billClass}`}
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
