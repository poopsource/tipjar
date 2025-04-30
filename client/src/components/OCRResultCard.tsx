import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import { DownloadIcon, SparklesIcon } from "lucide-react";

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
    <Card className="animate-fade-in overflow-hidden">
      <CardHeader className="spring-header flex flex-row justify-between items-center">
        <CardTitle className="text-text-white">
          Extracted Data
        </CardTitle>
        <Button 
          size="sm" 
          onClick={handleDownload}
          disabled={!extractedText}
          className="bg-spring-lavender text-app-darker hover:bg-spring-lavender/90"
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardHeader>
      
      <CardContent className="spring-body p-4 h-48 overflow-y-auto font-mono text-sm">
        {extractedText ? (
          extractedText.split('\n').map((line, index) => (
            <p key={index} className="text-text-white">{line}</p>
          ))
        ) : (
          <p className="text-center py-4 text-spring-yellow">
            No data extracted yet. Upload a schedule or enter manually.
          </p>
        )}
      </CardContent>
      
      <CardFooter className="spring-footer text-sm flex items-center">
        <SparklesIcon className="h-4 w-4 mr-2 text-spring-yellow" />
        <span className="text-spring-yellow">Processed with Google Gemini 1.5 Flash</span>
      </CardFooter>
    </Card>
  );
}
