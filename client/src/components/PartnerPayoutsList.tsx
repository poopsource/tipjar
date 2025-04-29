import { Card, CardContent } from "@/components/ui/card";
import { PartnerPayout } from "@shared/schema";
import PartnerCard from "./PartnerCard";

type PartnerPayoutsListProps = {
  partnerPayouts: PartnerPayout[];
};

export default function PartnerPayoutsList({ partnerPayouts }: PartnerPayoutsListProps) {
  if (!partnerPayouts || partnerPayouts.length === 0) {
    return null;
  }
  
  return (
    <Card className="animate__animated animate__fadeIn">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <i className="fas fa-users mr-2 text-[hsl(var(--starbucks-green))]"></i>
          Partner Payouts
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partnerPayouts.map((partner, index) => (
            <PartnerCard key={index} partner={partner} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
