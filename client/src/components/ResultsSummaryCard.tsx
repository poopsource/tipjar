import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useTipContext } from "@/context/TipContext";
import { DownloadIcon, SaveIcon, HistoryIcon, Loader2Icon } from "lucide-react";

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
    <Card className="animate-fade-in overflow-hidden mb-8">
      <CardHeader className="spring-header">
        <CardTitle className="text-text-white">Distribution Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="spring-body p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="rounded-lg p-4 bg-app-card">
            <p className="text-sm mb-1 text-spring-yellow">Total Hours</p>
            <p className="text-2xl font-bold text-text-white">{totalHours}</p>
          </div>
          <div className="rounded-lg p-4 bg-app-card">
            <p className="text-sm mb-1 text-spring-yellow">Hourly Rate</p>
            <p className="text-2xl font-bold text-spring-blue">
              ${(Math.floor(hourlyRate * 100) / 100).toFixed(2).replace(/\.?0+$/, '')}
            </p>
          </div>
          <div className="rounded-lg p-4 bg-app-card">
            <p className="text-sm mb-1 text-spring-yellow">Total Distributed</p>
            <p className="text-2xl font-bold text-spring-accent">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-spring-yellow">Distribution Date</h3>
          <p className="text-text-white">{currentDate}</p>
        </div>
      </CardContent>
        
      <CardFooter className="spring-footer flex justify-between space-x-4">
        <Button 
          className="flex-1 spring-button-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <SaveIcon className="h-4 w-4 mr-2" />
          )}
          Save
        </Button>
        <Button 
          className="flex-1 spring-button-secondary"
          onClick={handleDownload}
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button 
          className="flex-1 bg-spring-peach text-app-darker hover:bg-spring-peach/90"
          onClick={onHistoryClick}
        >
          <HistoryIcon className="h-4 w-4 mr-2" />
          History
        </Button>
      </CardFooter>
    </Card>
  );
}
