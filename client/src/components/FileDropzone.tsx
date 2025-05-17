import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import { readFileAsDataURL } from "@/lib/utils";
import {
  UploadIcon,
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
  const [state, setState] = useState<DropzoneState>(DropzoneState.IDLE);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { setPartnerHours, setExtractedText } = useTipContext();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState(DropzoneState.DRAGGING);
  };
  
  const handleDragLeave = () => {
    setState(DropzoneState.IDLE);
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
  
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a report image file",
        variant: "destructive"
      });
      return;
    }
    
    setState(DropzoneState.PROCESSING);
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
        setState(DropzoneState.SUCCESS);
        
        setTimeout(() => {
          setState(DropzoneState.IDLE);
        }, 3000);
        
        toast({
          title: "Report processed",
          description: `Successfully extracted ${result.partnerHours.length} partners`,
        });
      } else {
        // No partners found in the report
        setErrorMessage("No partner information detected in the report. Please try a different file.");
        setState(DropzoneState.ERROR);
        
        toast({
          title: "Processing issue",
          description: "OCR detected text but couldn't identify partner hours.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error(error);
      setState(DropzoneState.ERROR);
      
      // If we have a specific error message from the API, use it
      // Otherwise use a generic message
      const errorMsg = errorMessage || "Failed to extract partner information from the report";
      
      toast({
        title: "Processing failed",
        description: errorMsg,
        variant: "destructive"
      });
      
      setTimeout(() => {
        setState(DropzoneState.IDLE);
      }, 5000);
    }
  };
  
  const renderDropzoneContent = () => {
    switch (state) {
      case DropzoneState.DRAGGING:
        return (
          <>
            <div className="flex justify-center items-center mb-4">
              <div className="bg-[#0C3B2E] p-4 rounded-full">
                <UploadIcon className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
            <p className="text-white text-center mb-4">Release to upload</p>
          </>
        );
        
      case DropzoneState.PROCESSING:
        return (
          <>
            <div className="flex justify-center items-center mb-4">
              <div className="bg-[#0C3B2E] p-4 rounded-full">
                <Loader2Icon className="h-8 w-8 text-white animate-spin" />
              </div>
            </div>
            <p className="text-white text-center mb-4">Processing report...</p>
            <div className="max-w-[180px] mx-auto bg-[#0C3B2E] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-[#76A687] shimmer"></div>
            </div>
          </>
        );
        
      case DropzoneState.SUCCESS:
        return (
          <>
            <div className="flex justify-center items-center mb-4">
              <div className="bg-[#0C3B2E] p-4 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-[#76A687]" />
              </div>
            </div>
            <p className="text-white text-center mb-2">File processed successfully!</p>
            {fileName && (
              <div className="flex items-center justify-center bg-[#0C3B2E] rounded-full px-4 py-2 mx-auto max-w-max">
                <FileTextIcon className="h-4 w-4 text-white mr-2" />
                <p className="text-xs text-white m-0 truncate max-w-[180px]">{fileName}</p>
              </div>
            )}
          </>
        );
        
      case DropzoneState.ERROR:
        return (
          <>
            <div className="flex justify-center items-center mb-4">
              <div className="bg-[#0C3B2E] p-4 rounded-full">
                <XCircleIcon className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <p className="text-white text-center mb-2">Processing failed</p>
            <div className="bg-[#0C3B2E] rounded-lg p-3 mb-4 max-w-[230px] mx-auto">
              <p className="text-xs text-white">
                {errorMessage || "Please try again with a different report"}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setState(DropzoneState.IDLE);
              }}
              className="bg-[#F3EDD7] hover:bg-opacity-90 text-[#0C3B2E] font-semibold text-sm rounded-full py-2 px-5 transition-all"
            >
              Try Again
            </button>
          </>
        );
        
      default:
        return (
          <>
            <div className="flex justify-center items-center mb-4">
              <div className="bg-[#0C3B2E] p-4 rounded-full">
                <UploadIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-white text-center mb-4">Upload your partner hours report</p>
            <button 
              className="w-full py-3 bg-[#F3EDD7] hover:bg-opacity-90 text-[#0C3B2E] font-semibold rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Upload Report
            </button>
            <p className="text-center text-sm text-gray-400 mt-4">Supported formats: PNG, JPG, GIF</p>
          </>
        );
    }
  };
  
  return (
    <>
      <div
        className="w-full text-center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
