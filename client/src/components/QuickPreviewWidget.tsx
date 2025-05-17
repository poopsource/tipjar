import React, { useState, useEffect } from 'react';
import { useTipContext } from "@/context/TipContext";
import { calculateHourlyRate, calculatePayout, formatCurrency, roundToNearestDollar } from "@/lib/utils";
import { ArrowRight, ChevronDown, ChevronUp, DollarSign, Clock, Users, Coffee } from "lucide-react";

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
    <div className="bg-[#003c28] rounded-xl p-4 mb-6 shadow-lg border border-[#004b32] overflow-hidden">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setShowPreview(!showPreview)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#f0e1c1] rounded-full flex items-center justify-center mr-3">
            <Coffee className="h-4 w-4 text-[#004324]" />
          </div>
          <h3 className="text-[#f0e1c1] text-lg font-medium">Tip Preview</h3>
        </div>
        <button className="w-7 h-7 bg-[#002e1e] rounded-full flex items-center justify-center text-[#f0e1c1] hover:text-white transition-colors">
          {showPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      
      {showPreview && (
        <div className="mt-4 animate-fadeIn">
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute top-0 bottom-0 left-0 flex items-center pl-3">
                <DollarSign className="h-4 w-4 text-[#f0e1c1]" />
              </div>
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value ? Number(e.target.value) : '')}
                className="h-10 w-full bg-[#002e1e] text-white border border-[#004b32] rounded-lg py-1 px-2 pl-8 focus:outline-none focus:ring-1 focus:ring-[#f0e1c1] focus:border-transparent transition-all"
                placeholder="Enter amount for preview"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          {quickResults && (
            <div className="mt-3 text-sm">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#002e1e] p-3 rounded-md">
                  <div className="flex items-center text-[#f0e1c1] mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Total Hours</span>
                  </div>
                  <div className="text-white text-lg font-semibold">
                    {quickResults.totalHours.toFixed(1)}
                  </div>
                </div>
                <div className="bg-[#002e1e] p-3 rounded-md">
                  <div className="flex items-center text-[#f0e1c1] mb-2">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>Hourly Rate</span>
                  </div>
                  <div className="text-white text-lg font-semibold">
                    {formatCurrency(quickResults.hourlyRate)}
                  </div>
                </div>
              </div>
              
              <div className="bg-[#002e1e] rounded-md p-3 mb-4">
                <div className="flex items-center text-[#f0e1c1] mb-3">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="font-medium">Partner Estimates</span>
                </div>
                <div className="space-y-2.5">
                  {quickResults.topPartners.map((partner, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-[#004b32] pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="w-7 h-7 bg-[#004b32] rounded-full flex items-center justify-center mr-2 text-xs text-[#f0e1c1]">
                          {partner.name.charAt(0)}
                        </div>
                        <span className="text-white truncate max-w-[120px]">{partner.name}</span>
                      </div>
                      <div className="flex items-center text-[#f0e1c1]">
                        <div className="text-xs bg-[#004b32] px-2 py-0.5 rounded-full mr-2">
                          {partner.hours.toFixed(1)}h
                        </div>
                        <span className="font-semibold">{formatCurrency(partner.roundedPayout)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`p-3 rounded-md ${Math.abs(quickResults.difference) > 1 ? 'bg-[#00482e]' : 'bg-[#002e1e]'} mb-3`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#f0e1c1]">Total After Rounding:</span>
                  <span className="text-white font-semibold">{formatCurrency(quickResults.totalRounded)}</span>
                </div>
                {Math.abs(quickResults.difference) > 0.01 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#f0e1c1] text-sm">Difference:</span>
                    <span className={`font-medium ${quickResults.difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {quickResults.difference > 0 ? '+' : ''}{formatCurrency(quickResults.difference)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-center py-2 px-3 bg-[#002e1e] rounded-md text-xs text-[#f0e1c1] italic">
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