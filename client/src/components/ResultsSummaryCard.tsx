import { formatCurrency, formatDate } from "@/lib/utils";

type ResultsSummaryCardProps = {
  totalHours: number;
  hourlyRate: number;
  totalAmount: number;
};

export default function ResultsSummaryCard({
  totalHours,
  hourlyRate,
  totalAmount
}: ResultsSummaryCardProps) {
  const currentDate = formatDate(new Date());
  
  return (
    <div className="card animate-fadeIn mb-8">
      <div className="card-header">
        <div className="text-2xl font-semibold tracking-tight text-[#f5f5f5]">
          Distribution Summary
        </div>
      </div>
      
      <div className="card-body p-5">
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <div className="summary-box">
            <p className="summary-label">Total Hours</p>
            <p className="summary-value">{totalHours}</p>
          </div>
          <div className="summary-box">
            <p className="summary-label">Hourly Rate</p>
            <p className="summary-value-blue">
              ${(Math.floor(hourlyRate * 100) / 100).toFixed(2).replace(/\.?0+$/, '')}
            </p>
          </div>
          <div className="summary-box">
            <p className="summary-label">Total Distributed</p>
            <p className="summary-value-accent">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-[#ffeed6] m-0">Distribution Date</h3>
          <p className="text-[#f5f5f5] m-0">{currentDate}</p>
        </div>
      </div>
        

    </div>
  );
}
