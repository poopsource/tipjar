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
    <div className="bg-card animate-scaleIn mb-8 rounded-lg shadow-md-2 overflow-hidden">
      <div className="bg-primary/5 p-5 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className="text-xl font-medium text-foreground m-0">
          Distribution Summary
        </h2>
      </div>
      
      <div className="p-6">
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-background rounded-lg p-4 shadow-md-1 animate-fadeUp" style={{animationDelay: "0.1s"}}>
            <p className="text-sm text-muted-foreground mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Total Hours
            </p>
            <p className="text-2xl font-medium text-foreground m-0">{totalHours}</p>
          </div>
          <div className="bg-background rounded-lg p-4 shadow-md-1 animate-fadeUp" style={{animationDelay: "0.2s"}}>
            <p className="text-sm text-muted-foreground mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hourly Rate
            </p>
            <p className="text-2xl font-medium text-primary m-0 animate-pulse">
              ${(Math.floor(hourlyRate * 100) / 100).toFixed(2).replace(/\.?0+$/, '')}
            </p>
          </div>
          <div className="bg-background rounded-lg p-4 shadow-md-1 animate-fadeUp" style={{animationDelay: "0.3s"}}>
            <p className="text-sm text-muted-foreground mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Total Distributed
            </p>
            <p className="text-2xl font-medium text-secondary m-0">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 mt-2 rounded-lg bg-primary/5 animate-fadeUp" style={{animationDelay: "0.4s"}}>
          <h3 className="text-base font-medium text-foreground m-0 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Distribution Date
          </h3>
          <p className="m-0 bg-card px-4 py-1.5 rounded-full text-sm font-medium shadow-md-1">{currentDate}</p>
        </div>
      </div>
    </div>
  );
}
