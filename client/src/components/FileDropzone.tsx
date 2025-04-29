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
    
    try {
      const dataUrl = await readFileAsDataURL(file);
      
      // Send the image to the server for OCR processing
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('OCR processing failed');
      }
      
      const result = await response.json();
      
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
    } catch (error) {
      console.error(error);
      setDropzoneState(DropzoneState.ERROR);
      
      toast({
        title: "Processing failed",
        description: "Failed to extract partner information from the image",
        variant: "destructive"
      });
      
      setTimeout(() => {
        setDropzoneState(DropzoneState.IDLE);
      }, 3000);
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
            <p className="text-sm text-gray-400">Please try again or use manual entry</p>
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
              onClick={() => fileInputRef.current?.click()}
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
