import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import { readFileAsDataURL } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

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
      
      if (result.partnerHours && result.partnerHours.length > 0) {
        setPartnerHours(result.partnerHours);
        setExtractedText(result.extractedText);
        setDropzoneState(DropzoneState.SUCCESS);
        
        setTimeout(() => {
          setDropzoneState(DropzoneState.IDLE);
        }, 3000);
        
        toast({
          title: "Schedule processed",
          description: "Partner hours have been extracted successfully",
        });
      } else {
        // No partners found in the image
        setErrorMessage("No partner information detected in the image. Please try a different image or use manual entry.");
        throw new Error("No partner information detected");
      }
    } catch (error: any) {
      console.error(error);
      setDropzoneState(DropzoneState.ERROR);
      
      // If we have a specific error message from the API, use it
      // Otherwise use a generic message
      const errorMsg = errorMessage || "Failed to extract partner information from the image";
      
      // Check if there was a response with suggestManualEntry flag
      const suggestManual = error.response?.suggestManualEntry || false;
      
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
            <i className="fas fa-cloud-upload-alt text-4xl mb-4 text-[hsl(var(--starbucks-green))]"></i>
            <p className="mb-2">Release to upload</p>
          </>
        );
        
      case DropzoneState.PROCESSING:
        return (
          <>
            <i className="fas fa-spinner fa-spin text-4xl mb-4 text-[hsl(var(--starbucks-green))]"></i>
            <p className="mb-2">Processing image...</p>
            <p className="text-sm text-gray-400">Using Gemini API for OCR</p>
          </>
        );
        
      case DropzoneState.SUCCESS:
        return (
          <>
            <i className="fas fa-check-circle text-4xl mb-4 text-[hsl(var(--starbucks-green))]"></i>
            <p className="mb-2">File processed successfully!</p>
            {fileName && <p className="text-sm text-gray-400">{fileName}</p>}
          </>
        );
        
      case DropzoneState.ERROR:
        return (
          <>
            <i className="fas fa-times-circle text-4xl mb-4 text-red-500"></i>
            <p className="mb-2">Processing failed</p>
            {errorMessage ? (
              <p className="text-sm text-gray-400 mb-2">{errorMessage}</p>
            ) : (
              <p className="text-sm text-gray-400 mb-2">Please try again or use manual entry</p>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                openManualEntry();
              }}
              className="mt-2 px-4 py-2 bg-[hsl(var(--starbucks-green))] text-white rounded-md hover:bg-opacity-90 transition-all"
            >
              Switch to Manual Entry
            </button>
          </>
        );
        
      default:
        return (
          <>
            <i className="fas fa-cloud-upload-alt text-4xl mb-4 text-[hsl(var(--starbucks-green))]"></i>
            <p className="mb-2">Drag & drop your schedule image here</p>
            <p className="text-sm text-gray-400">or</p>
            <button 
              className="mt-3 px-4 py-2 bg-[hsl(var(--starbucks-green))] text-white rounded-md hover:bg-opacity-90 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </button>
          </>
        );
    }
  };
  
  const getDropzoneClasses = () => {
    const baseClasses = "dropzone rounded-lg p-8 mb-6 text-center cursor-pointer hover:bg-opacity-30 transition-all animate__animated animate__fadeIn";
    
    if (dropzoneState === DropzoneState.DRAGGING) {
      return `${baseClasses} active`;
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
