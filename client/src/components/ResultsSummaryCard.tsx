import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useTipContext } from "@/context/TipContext";
import { starbucksTheme } from "@/lib/colorTheme";

type ResultsSummaryCardProps = {
  totalHours: number;
  hourlyRate: number;
  totalAmount: number;
  onHistoryClick: () => void;
};

export default function ResultsSummaryCard({
  totalHours,
  hourlyRate,
  totalAmount,
  onHistoryClick
}: ResultsSummaryCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { distributionData } = useTipContext();
  
  const currentDate = formatDate(new Date());
  
  const handleSave = async () => {
    if (!distributionData) return;
    
    setIsSaving(true);
    
    try {
      await apiRequest("POST", "/api/distributions", {
        totalAmount,
        totalHours,
        hourlyRate,
        partnerData: distributionData.partnerPayouts
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/distributions'] });
      
      toast({
        title: "Distribution saved",
        description: "Tip distribution has been saved to history",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Save failed",
        description: "An error occurred while saving the distribution",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDownload = () => {
    if (!distributionData) return;
    
    // Create HTML table for the distribution data
    let html = `
      <html>
        <head>
          <title>Tip Distribution - ${currentDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .header { margin-bottom: 20px; }
            .summary { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Tip Distribution</h1>
            <p>Date: ${currentDate}</p>
          </div>
          
          <div class="summary">
            <h2>Summary</h2>
            <p>Total Amount: ${formatCurrency(totalAmount)}</p>
            <p>Total Hours: ${totalHours}</p>
            <p>Hourly Rate: $${(Math.floor(hourlyRate * 100) / 100).toFixed(2).replace(/\.?0+$/, '')}</p>
          </div>
          
          <h2>Partner Payouts</h2>
          <table>
            <thead>
              <tr>
                <th>Partner</th>
                <th>Hours</th>
                <th>Payout</th>
                <th>Rounded</th>
                <th>Bill Breakdown</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    distributionData.partnerPayouts.forEach(partner => {
      const billBreakdown = partner.billBreakdown
        .map(bill => `${bill.quantity} × $${bill.denomination}`)
        .join(", ");
      
      html += `
        <tr>
          <td>${partner.name}</td>
          <td>${partner.hours}</td>
          <td>${formatCurrency(partner.payout)}</td>
          <td>${formatCurrency(partner.rounded)}</td>
          <td>${billBreakdown}</td>
        </tr>
      `;
    });
    
    html += `
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    // Create a blob and download
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tipjar-distribution-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Distribution data is being downloaded as HTML",
    });
  };
  
  return (
    <div className="animate__animated animate__fadeIn rounded-lg overflow-hidden mb-8" style={{ backgroundColor: starbucksTheme.secondaryGreen }}>
      <div className="p-5">
        <h2 className="text-xl font-bold mb-4" style={{ color: starbucksTheme.textLight }}>Distribution Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="rounded-lg p-4" style={{ backgroundColor: starbucksTheme.primaryGreen }}>
            <p className="text-sm mb-1" style={{ color: starbucksTheme.springYellow }}>Total Hours</p>
            <p className="text-2xl font-bold" style={{ color: starbucksTheme.textLight }}>{totalHours}</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: starbucksTheme.primaryGreen }}>
            <p className="text-sm mb-1" style={{ color: starbucksTheme.springYellow }}>Hourly Rate</p>
            <p className="text-2xl font-bold" style={{ color: starbucksTheme.springBlue }}>${(Math.floor(hourlyRate * 100) / 100).toFixed(2).replace(/\.?0+$/, '')}</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: starbucksTheme.primaryGreen }}>
            <p className="text-sm mb-1" style={{ color: starbucksTheme.springYellow }}>Total Distributed</p>
            <p className="text-2xl font-bold" style={{ color: starbucksTheme.springAccent }}>{formatCurrency(totalAmount)}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium" style={{ color: starbucksTheme.springYellow }}>Distribution Date</h3>
          <p style={{ color: starbucksTheme.textLight }}>{currentDate}</p>
        </div>
      </div>
        
      <div className="p-4 flex space-x-4" style={{ backgroundColor: starbucksTheme.darkBg }}>
        <Button 
          className="flex-1 border-none"
          style={{ 
            backgroundColor: starbucksTheme.accentGreen, 
            color: "#333"
          }}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <i className="fas fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fas fa-save mr-2"></i>
          )}
          Save
        </Button>
        <Button 
          className="flex-1 border-none"
          style={{ 
            backgroundColor: starbucksTheme.springBlue, 
            color: "#333"
          }}
          onClick={handleDownload}
        >
          <i className="fas fa-download mr-2"></i>
          Download
        </Button>
        <Button 
          className="flex-1 border-none"
          style={{ 
            backgroundColor: starbucksTheme.springPeach, 
            color: "#333"
          }}
          onClick={onHistoryClick}
        >
          <i className="fas fa-history mr-2"></i>
          History
        </Button>
      </div>
    </div>
  );
}
