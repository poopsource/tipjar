import React, { useState, useEffect } from 'react';
import { useTipContext } from "@/context/TipContext";
import { calculateHourlyRate, calculatePayout, formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const QuickPreviewWidget: React.FC = () => {
  const { partnerHours } = useTipContext();
  const [tipAmount, setTipAmount] = useState<number | ''>('');
  const [showPreview, setShowPreview] = useState(false);
  const [quickResults, setQuickResults] = useState<{
    totalHours: number;
    hourlyRate: number;
    topPartners: Array<{name: string, hours: number, payout: number}>;
  } | null>(null);

  // Calculate preview when tip amount changes
  useEffect(() => {
    if (tipAmount && partnerHours.length > 0) {
      const totalHours = partnerHours.reduce((sum, partner) => sum + partner.hours, 0);
      const hourlyRate = calculateHourlyRate(Number(tipAmount), totalHours);
      
      // Sort partners by hours (descending) and get top 3
      const sortedPartners = [...partnerHours]
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 3)
        .map(partner => ({
          name: partner.name,
          hours: partner.hours,
          payout: calculatePayout(partner.hours, hourlyRate)
        }));

      setQuickResults({
        totalHours,
        hourlyRate,
        topPartners: sortedPartners
      });
    } else {
      setQuickResults(null);
    }
  }, [tipAmount, partnerHours]);

  if (!partnerHours.length) {
    return null; // Don't show widget if there are no partner hours uploaded
  }

  return (
    <div className="bg-[#143d2a] rounded-xl p-4 mb-4 shadow-lg border border-[#275343] overflow-hidden">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setShowPreview(!showPreview)}
      >
        <h3 className="text-[#f0e1c1] text-lg font-medium">Quick Calculation Preview</h3>
        <button className="text-[#f0e1c1] hover:text-white transition-colors">
          {showPreview ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {showPreview && (
        <div className="mt-3 animate-fadeIn">
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute top-0 bottom-0 left-0 flex items-center pl-3">
                <span className="text-[#f0e1c1] font-medium">$</span>
              </div>
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value ? Number(e.target.value) : '')}
                className="h-9 w-full bg-[#0d2d1e] text-white border border-[#275343] rounded-lg py-1 px-2 pl-7 focus:outline-none focus:ring-1 focus:ring-[#f0e1c1] focus:border-transparent transition-all"
                placeholder="Enter amount for preview"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          {quickResults && (
            <div className="mt-2 text-sm">
              <div className="flex justify-between text-[#f0e1c1] mb-2">
                <span>Total Hours:</span>
                <span className="font-medium">{quickResults.totalHours.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#f0e1c1] mb-2">
                <span>Hourly Rate:</span>
                <span className="font-medium">{formatCurrency(quickResults.hourlyRate)}/hr</span>
              </div>
              
              <div className="text-white mt-3 mb-2">Top Partner Estimates:</div>
              {quickResults.topPartners.map((partner, index) => (
                <div key={index} className="flex justify-between text-[#f0e1c1] mb-1 text-xs">
                  <span className="truncate max-w-[150px]">{partner.name}</span>
                  <div className="flex gap-2">
                    <span>{partner.hours.toFixed(2)} hrs</span>
                    <ArrowRight className="h-4 w-4 text-[#f0e1c1] opacity-50" />
                    <span className="font-medium">{formatCurrency(partner.payout)}</span>
                  </div>
                </div>
              ))}
              
              <div className="mt-3 text-xs text-[#f0e1c1] italic opacity-70">
                This is an estimate. Calculate for exact amounts.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickPreviewWidget;