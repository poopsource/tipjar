import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import { starbucksTheme } from "@/lib/colorTheme";

export default function OCRResultCard() {
  const { extractedText } = useTipContext();
  const { toast } = useToast();
  
  const handleDownload = () => {
    if (!extractedText) {
      toast({
        title: "No data to download",
        description: "Please process a schedule first",
        variant: "destructive"
      });
      return;
    }
    
    // Create a download link for the extracted text
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tipjar-extracted-data-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Extracted data is being downloaded",
    });
  };
  
  return (
    <div className="animate__animated animate__fadeIn rounded-lg overflow-hidden" style={{ backgroundColor: starbucksTheme.secondaryGreen }}>
      <div className="px-5 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center" style={{ color: starbucksTheme.textLight }}>
          Extracted Data
        </h2>
        <div>
          <Button 
            className="border-none"
            size="sm" 
            onClick={handleDownload}
            disabled={!extractedText}
            style={{ 
              backgroundColor: starbucksTheme.springLavender, 
              color: "#333" 
            }}
          >
            <i className="fas fa-download mr-2"></i>
            Download
          </Button>
        </div>
      </div>
      
      <div className="p-4 h-48 overflow-y-auto font-mono text-sm" 
           style={{ 
             backgroundColor: starbucksTheme.primaryGreen,
             color: starbucksTheme.textLight
           }}>
        {extractedText ? (
          extractedText.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))
        ) : (
          <p className="text-center py-4" style={{ color: starbucksTheme.springYellow }}>
            No data extracted yet. Upload a schedule or enter manually.
          </p>
        )}
      </div>
      
      <div className="px-5 py-3 text-sm flex items-center" 
           style={{ 
             backgroundColor: starbucksTheme.darkBg,
             color: starbucksTheme.springYellow
           }}>
        <i className="fas fa-magic mr-2"></i>
        <span>Processed with Google Gemini 1.5 Flash</span>
      </div>
    </div>
  );
}
