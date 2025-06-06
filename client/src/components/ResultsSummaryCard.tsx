import { formatCurrency, formatDate } from "@/lib/utils";
import { Clock, DollarSign, TrendingUp, Calendar } from "lucide-react";

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
    <div className="starbucks-card starbucks-fade-in">
      <div className="starbucks-card-header">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-starbucks-forest" />
          <div>
            <h2 className="text-xl font-semibold text-starbucks-forest">Distribution Summary</h2>
            <p className="text-sm text-muted-foreground">Overview of tip calculation</p>
          </div>
        </div>
      </div>
      
      <div className="starbucks-card-body">
        <div className="starbucks-grid-responsive mb-6">
          <div className="starbucks-summary-card starbucks-slide-up" style={{animationDelay: "0.1s"}}>
            <div className="starbucks-summary-label">
              <Clock className="w-4 h-4" />
              Total Hours
            </div>
            <div className="starbucks-summary-value">{totalHours}</div>
          </div>
          
          <div className="starbucks-summary-card starbucks-slide-up" style={{animationDelay: "0.2s"}}>
            <div className="starbucks-summary-label">
              <DollarSign className="w-4 h-4" />
              Hourly Rate
            </div>
            <div className="starbucks-summary-value starbucks-summary-value-coffee">
              ${(Math.floor(hourlyRate * 100) / 100).toFixed(2)}
            </div>
          </div>
          
          <div className="starbucks-summary-card starbucks-slide-up" style={{animationDelay: "0.3s"}}>
            <div className="starbucks-summary-label">
              <TrendingUp className="w-4 h-4" />
              Total Distributed
            </div>
            <div className="starbucks-summary-value starbucks-summary-value-accent">
              {formatCurrency(totalAmount)}
            </div>
          </div>
        </div>
        
        <div className="starbucks-calculation starbucks-slide-up" style={{animationDelay: "0.4s"}}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-starbucks-forest" />
              <span className="font-medium text-starbucks-forest">Distribution Date</span>
            </div>
            <span className="starbucks-status-success">{currentDate}</span>
          </div>
          
          <div className="starbucks-calculation-formula">
            <span className="starbucks-calculation-value">
              Total Tips: {formatCurrency(totalAmount)}
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
      </div>
    </div>
  );
}