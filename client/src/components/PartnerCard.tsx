import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

// Get a CSS class based on denomination
const getBillClass = (denomination: number): string => {
  switch(denomination) {
    case 100: return "bg-spring-green text-app-darker";
    case 50: return "bg-spring-blue text-app-darker";
    case 20: return "bg-spring-lavender text-app-darker";
    case 10: return "bg-spring-pink text-app-darker";
    case 5: return "bg-spring-peach text-app-darker";
    case 1: return "bg-spring-yellow text-app-darker";
    default: return "bg-spring-green text-app-darker";
  }
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {  
  return (
    <Card className="animate-fade-in overflow-hidden">
      <CardHeader className="spring-header flex flex-row justify-between items-center py-3">
        <h3 className="font-medium text-lg text-text-white">{partner.name}</h3>
        <span className="text-2xl font-bold text-spring-accent">${partner.rounded}</span>
      </CardHeader>
      
      <CardContent className="spring-body p-3">
        <div className="flex items-center mb-2">
          <span className="font-medium text-spring-yellow">Hours:</span>
          <span className="ml-2 text-text-white">{partner.hours}</span>
        </div>
        
        <div className="text-sm flex flex-wrap items-center text-text-white">
          <span className="mr-1">{partner.hours}</span> × 
          <span className="mx-1 text-spring-blue">${hourlyRate}</span> = 
          <span className="mx-1 text-spring-yellow">${(partner.hours * hourlyRate).toFixed(2)}</span> → 
          <span className="ml-1 font-bold text-spring-accent">${partner.rounded}</span>
        </div>
      </CardContent>
      
      <CardFooter className="spring-footer p-3">
        <div className="w-full">
          <div className="mb-2 text-sm font-medium text-spring-yellow">Bills:</div>
          <div className="flex flex-wrap gap-2">
            {partner.billBreakdown.map((bill, index) => {
              const billClass = getBillClass(bill.denomination);
              return (
                <Badge 
                  key={index} 
                  variant="outline"
                  className={`px-3 py-1 rounded-full text-sm font-medium ${billClass}`}
                >
                  {bill.quantity}×${bill.denomination}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
