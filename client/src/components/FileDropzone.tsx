import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import { readFileAsDataURL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  UploadCloudIcon,
  Loader2Icon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon
} from "lucide-react";

enum DropzoneState {
  IDLE = "idle",
  DRAGGING = "dragging",
  PROCESSING = "processing",
  SUCCESS = "success",
  ERROR = "error"
}

export default function FileDropzone() {
  const [dropzoneState, setDropzoneState] = useState<DropzoneState>(DropzoneState.IDLE);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { setPartnerHours, setExtractedText } = useTipContext();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropzoneState(DropzoneState.DRAGGING);
  };
  
  const handleDragLeave = () => {
    setDropzoneState(DropzoneState.IDLE);
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files.length) {
      await processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await processFile(e.target.files[0]);
    }
  };
  
  const openManualEntry = () => {
    // Dispatch a custom event to be handled by Home.tsx
    const event = new CustomEvent('openManualEntry');
    window.dispatchEvent(event);
    
    // Reset the dropzone state
    setDropzoneState(DropzoneState.IDLE);
    setErrorMessage(null);
  };
  
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    setDropzoneState(DropzoneState.PROCESSING);
    setFileName(file.name);
    setErrorMessage(null);
    
    try {
      const dataUrl = await readFileAsDataURL(file);
      
      // Send the image to the server for OCR processing
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Extract specific error message from the server response
        const errorMsg = result.error || 'OCR processing failed';
        setErrorMessage(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Always set the extracted text if available to show everything OCR found
      if (result.extractedText) {
        setExtractedText(result.extractedText);
      }
      
      if (result.partnerHours && result.partnerHours.length > 0) {
        setPartnerHours(result.partnerHours);
        setDropzoneState(DropzoneState.SUCCESS);
        
        setTimeout(() => {
          setDropzoneState(DropzoneState.IDLE);
        }, 3000);
        
        toast({
          title: "Schedule processed",
          description: `Successfully extracted ${result.partnerHours.length} partners`,
        });
      } else {
        // No partners found in the image
        setErrorMessage("No partner information detected in the image. Please try a different image or use manual entry.");
        setDropzoneState(DropzoneState.ERROR);
        
        toast({
          title: "Processing issue",
          description: "OCR detected text but couldn't identify partner hours. Try manual entry instead.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error(error);
      setDropzoneState(DropzoneState.ERROR);
      
      // If we have a specific error message from the API, use it
      // Otherwise use a generic message
      const errorMsg = errorMessage || "Failed to extract partner information from the image";
      
      toast({
        title: "Processing failed",
        description: errorMsg,
        variant: "destructive"
      });
      
      setTimeout(() => {
        setDropzoneState(DropzoneState.IDLE);
      }, 5000);
    }
  };
  
  const renderDropzoneContent = () => {
    switch (dropzoneState) {
      case DropzoneState.DRAGGING:
        return (
          <>
            <UploadCloudIcon className="h-16 w-16 mb-4 text-spring-green" />
            <p className="mb-2 text-text-white">Release to upload</p>
          </>
        );
        
      case DropzoneState.PROCESSING:
        return (
          <>
            <Loader2Icon className="h-16 w-16 mb-4 text-spring-green animate-spin" />
            <p className="mb-2 text-text-white">Processing image...</p>
            <p className="text-sm text-spring-yellow">Using Gemini API for OCR</p>
          </>
        );
        
      case DropzoneState.SUCCESS:
        return (
          <>
            <CheckCircleIcon className="h-16 w-16 mb-4 text-spring-green" />
            <p className="mb-2 text-text-white">File processed successfully!</p>
            {fileName && <p className="text-sm text-spring-yellow">{fileName}</p>}
          </>
        );
        
      case DropzoneState.ERROR:
        return (
          <>
            <XCircleIcon className="h-16 w-16 mb-4 text-spring-pink" />
            <p className="mb-2 text-text-white">Processing failed</p>
            {errorMessage ? (
              <p className="text-sm text-spring-yellow mb-2">{errorMessage}</p>
            ) : (
              <p className="text-sm text-spring-yellow mb-2">Please try again or use manual entry</p>
            )}
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                openManualEntry();
              }}
              className="mt-2 spring-button-primary"
            >
              <FileTextIcon className="h-4 w-4 mr-2" />
              Switch to Manual Entry
            </Button>
          </>
        );
        
      default:
        return (
          <>
            <UploadCloudIcon className="h-16 w-16 mb-4 text-spring-green" />
            <p className="mb-2 text-text-white">Drag & drop your schedule image here</p>
            <p className="text-sm text-spring-yellow">or</p>
            <Button 
              className="mt-3 spring-button-primary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </Button>
          </>
        );
    }
  };
  
  const getDropzoneClasses = () => {
    const baseClasses = "border-2 border-dashed border-spring-green/50 rounded-lg p-8 mb-6 text-center cursor-pointer transition-all duration-300 animate-fade-in bg-app-card hover:bg-app-card/90";
    
    if (dropzoneState === DropzoneState.DRAGGING) {
      return `${baseClasses} border-spring-green bg-spring-green/10`;
    }
    
    return baseClasses;
  };
  
  return (
    <>
      <div
        className={getDropzoneClasses()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {renderDropzoneContent()}
      </div>
      <input
        type="file"
        id="fileInput"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileInputChange}
      />
    </>
  );
}
