import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import { readFileAsDataURL } from "@/lib/utils";
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
            <div className="mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 text-[#93ec93] mx-auto">
              <UploadCloudIcon className="h-full w-full" />
            </div>
            <p className="text-[#f5f5f5] m-0 mb-1 sm:mb-2 text-sm sm:text-base">Release to upload</p>
          </>
        );
        
      case DropzoneState.PROCESSING:
        return (
          <>
            <div className="mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 text-[#93ec93] mx-auto">
              <Loader2Icon className="h-full w-full animate-spin" />
            </div>
            <p className="text-[#f5f5f5] m-0 mb-1 sm:mb-2 text-sm sm:text-base">Processing image...</p>
            <p className="text-xs sm:text-sm text-[#ffeed6] m-0">Using Gemini API for OCR</p>
          </>
        );
        
      case DropzoneState.SUCCESS:
        return (
          <>
            <div className="mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 text-[#93ec93] mx-auto">
              <CheckCircleIcon className="h-full w-full" />
            </div>
            <p className="text-[#f5f5f5] m-0 mb-1 sm:mb-2 text-sm sm:text-base">File processed successfully!</p>
            {fileName && <p className="text-xs sm:text-sm text-[#ffeed6] m-0 truncate max-w-full">{fileName}</p>}
          </>
        );
        
      case DropzoneState.ERROR:
        return (
          <>
            <div className="mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto">
              <XCircleIcon className="h-full w-full" />
            </div>
            <p className="text-[#f5f5f5] m-0 mb-1 sm:mb-2 text-sm sm:text-base">Processing failed</p>
            {errorMessage ? (
              <p className="text-xs sm:text-sm text-[#ffeed6] m-0 mb-1 sm:mb-2">{errorMessage}</p>
            ) : (
              <p className="text-xs sm:text-sm text-[#ffeed6] m-0 mb-1 sm:mb-2">Please try again or use manual entry</p>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                openManualEntry();
              }}
              className="text-xs sm:text-sm font-medium text-[#364949] bg-[#93ec93] inline-flex h-8 sm:h-10 justify-center gap-2 whitespace-nowrap border-0 rounded-md px-3 sm:px-4 py-1 sm:py-2 mt-2 sm:mt-3"
            >
              <FileTextIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Switch to Manual Entry
            </button>
          </>
        );
        
      default:
        return (
          <>
            <div className="mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 text-[#93ec93] mx-auto">
              <UploadCloudIcon className="h-full w-full" />
            </div>
            <p className="text-[#f5f5f5] m-0 mb-1 sm:mb-2 text-sm sm:text-base">Drag & drop your schedule image here</p>
            <p className="text-xs sm:text-sm text-[#ffeed6] m-0">or</p>
            <button 
              className="text-xs sm:text-sm font-medium text-[#364949] bg-[#93ec93] inline-flex h-8 sm:h-10 justify-center gap-2 whitespace-nowrap border-0 rounded-md px-3 sm:px-4 py-1 sm:py-2 mt-2 sm:mt-3"
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
  
  return (
    <>
      <div
        className="animate-fadeIn mb-6 cursor-pointer bg-[#3c5d5d] text-center transition-all duration-300 ease-in-out border-[1.11111px] border-dashed border-[rgba(147,236,147,0.5)] rounded-lg p-4 sm:p-6 md:p-8"
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
