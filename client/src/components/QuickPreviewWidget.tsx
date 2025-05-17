import React, { useState, useEffect } from 'react';
import { useTipContext } from "@/context/TipContext";
import { calculateHourlyRate, calculatePayout, formatCurrency, roundToNearestDollar } from "@/lib/utils";
import { ArrowRight, ChevronDown, ChevronUp, DollarSign, Clock, Users } from "lucide-react";

const QuickPreviewWidget: React.FC = () => {
  const { partnerHours } = useTipContext();
  const [tipAmount, setTipAmount] = useState<number | ''>('');
  const [showPreview, setShowPreview] = useState(false);
  const [quickResults, setQuickResults] = useState<{
    totalHours: number;
    hourlyRate: number;
    topPartners: Array<{name: string, hours: number, payout: number, roundedPayout: number}>;
    totalRounded: number;
    difference: number;
  } | null>(null);

  // Calculate preview when tip amount changes
  useEffect(() => {
    if (tipAmount && partnerHours.length > 0) {
      const totalHours = partnerHours.reduce((sum, partner) => sum + partner.hours, 0);
      const hourlyRate = calculateHourlyRate(Number(tipAmount), totalHours);
      
      // Calculate for all partners to get accurate rounded totals
      const allPartnerPayouts = partnerHours.map(partner => {
        const exactPayout = calculatePayout(partner.hours, hourlyRate);
        const roundedPayout = roundToNearestDollar(exactPayout);
        return {
          name: partner.name,
          hours: partner.hours,
          payout: exactPayout,
          roundedPayout
        };
      });
      
      // Get total after rounding
      const totalAfterRounding = allPartnerPayouts.reduce((sum, p) => sum + p.roundedPayout, 0);
      
      // Sort partners by hours (descending) and get top 3 for display
      const topPartners = [...allPartnerPayouts]
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 3);

      setQuickResults({
        totalHours,
        hourlyRate,
        topPartners,
        totalRounded: totalAfterRounding,
        difference: totalAfterRounding - Number(tipAmount)
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
        <div className="flex items-center">
          <Users className="h-5 w-5 text-[#f0e1c1] mr-2" />
          <h3 className="text-[#f0e1c1] text-lg font-medium">Quick Calculation Preview</h3>
        </div>
        <button className="text-[#f0e1c1] hover:text-white transition-colors">
          {showPreview ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      {showPreview && (
        <div className="mt-3 animate-fadeIn">
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute top-0 bottom-0 left-0 flex items-center pl-3">
                <DollarSign className="h-4 w-4 text-[#f0e1c1]" />
              </div>
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value ? Number(e.target.value) : '')}
                className="h-9 w-full bg-[#0d2d1e] text-white border border-[#275343] rounded-lg py-1 px-2 pl-8 focus:outline-none focus:ring-1 focus:ring-[#f0e1c1] focus:border-transparent transition-all"
                placeholder="Enter amount for preview"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          {quickResults && (
            <div className="mt-2 text-sm">
              <div className="flex justify-between items-center">
                <div className="w-1/2 pr-2">
                  <div className="flex items-center text-[#f0e1c1] mb-2">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    <span>Total Hours:</span>
                  </div>
                  <div className="bg-[#0d2d1e] py-1.5 px-2 rounded-md text-white">
                    <span className="font-medium">{quickResults.totalHours.toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-1/2 pl-2">
                  <div className="flex items-center text-[#f0e1c1] mb-2">
                    <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                    <span>Hourly Rate:</span>
                  </div>
                  <div className="bg-[#0d2d1e] py-1.5 px-2 rounded-md text-white">
                    <span className="font-medium">{formatCurrency(quickResults.hourlyRate)}/hr</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 mb-2 flex items-center text-[#f0e1c1]">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                <span>Top Partner Estimates:</span>
              </div>
              <div className="bg-[#0d2d1e] rounded-md p-2 mb-3">
                {quickResults.topPartners.map((partner, index) => (
                  <div key={index} className="flex justify-between text-[#f0e1c1] mb-1.5 text-xs last:mb-0">
                    <span className="truncate max-w-[130px]">{partner.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span>{partner.hours.toFixed(1)}h</span>
                      <ArrowRight className="h-3 w-3 opacity-50" />
                      <span className="font-medium">{formatCurrency(partner.roundedPayout)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-2 p-2 rounded-md ${Math.abs(quickResults.difference) > 1 ? 'bg-[#1e3028]' : 'bg-[#0d2d1e]'}`}>
                <div className="flex justify-between text-xs">
                  <span className="text-[#f0e1c1]">Total After Rounding:</span>
                  <span className="text-white font-medium">{formatCurrency(quickResults.totalRounded)}</span>
                </div>
                {Math.abs(quickResults.difference) > 0.01 && (
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-[#f0e1c1]">Difference:</span>
                    <span className={`font-medium ${quickResults.difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {quickResults.difference > 0 ? '+' : ''}{formatCurrency(quickResults.difference)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 text-xs text-[#f0e1c1] italic opacity-70">
                This is an estimate. Calculate distribution for final amounts.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickPreviewWidget;