import { useState } from "react";
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
    <div className="card animate-fadeIn mt-6">
      <div className="card-header">
        <div className="text-2xl font-semibold tracking-tight text-[#f5f5f5]">
          Extracted Data
        </div>
        <button 
          className="btn btn-lavender h-9 mt-1.5"
          onClick={handleDownload}
          disabled={!extractedText}
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download
        </button>
      </div>
      
      <div className="bg-[#3a5c5c] h-48 overflow-y-auto font-mono text-sm p-4">
        {extractedText ? (
          extractedText.split('\n').map((line, index) => (
            <p key={index} className="text-[#f5f5f5] m-0">{line}</p>
          ))
        ) : (
          <p className="text-center py-4 text-[#ffeed6]">
            No data extracted yet. Upload a schedule or enter manually.
          </p>
        )}
      </div>
      
      <div className="card-footer p-4 pb-6">
        <SparklesIcon className="h-4 w-4 mr-2 text-[#ffeed6]" />
        <span className="text-[#ffeed6]">Processed with Google Gemini 1.5 Flash</span>
      </div>
    </div>
  );
}
