import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";

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
    <div className="animate__animated animate__fadeIn bg-[#2d4845] rounded-lg overflow-hidden">
      <div className="px-5 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          Extracted Data
        </h2>
        <div>
          <Button 
            className="bg-[#437c6e] hover:bg-[#2d5e50] text-white border-none"
            size="sm" 
            onClick={handleDownload}
            disabled={!extractedText}
          >
            <i className="fas fa-download mr-2"></i>
            Download
          </Button>
        </div>
      </div>
      
      <div className="bg-[#1e3330] p-4 text-[#aad4ca] h-48 overflow-y-auto font-mono text-sm">
        {extractedText ? (
          extractedText.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))
        ) : (
          <p className="text-[#8ab5ab] text-center py-4">
            No data extracted yet. Upload a schedule or enter manually.
          </p>
        )}
      </div>
      
      <div className="px-5 py-3 bg-[#1e3330] text-sm text-[#8ab5ab] flex items-center">
        <i className="fas fa-magic mr-2"></i>
        <span>Processed with Google Gemini 1.5 Flash</span>
      </div>
    </div>
  );
}
