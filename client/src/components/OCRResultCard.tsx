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
    <Card className="animate__animated animate__fadeIn">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <i className="fas fa-file-alt mr-2 text-[hsl(var(--starbucks-green))]"></i>
            Extracted Data
          </h2>
          <div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDownload}
              disabled={!extractedText}
            >
              <i className="fas fa-download"></i>
            </Button>
          </div>
        </div>
        
        <div className="bg-[hsl(var(--dark-bg))] p-4 rounded-lg text-gray-300 h-48 overflow-y-auto font-mono text-sm">
          {extractedText ? (
            extractedText.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">
              No data extracted yet. Upload a schedule or enter manually.
            </p>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-400 flex items-center">
          <i className="fas fa-magic mr-2 text-[hsl(var(--starbucks-light))]"></i>
          <span>Processed with Google Gemini 1.5 Flash</span>
        </div>
      </CardContent>
    </Card>
  );
}
