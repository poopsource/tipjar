import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import { readFileAsDataURL } from "@/lib/utils";
import {
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  FileText,
  Image as ImageIcon
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
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    setState(DropzoneState.PROCESSING);
    setFileName(file.name);
    setErrorMessage(null);
    
    try {
      const dataUrl = await readFileAsDataURL(file);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        const errorMsg = result.error || 'OCR processing failed';
        setErrorMessage(errorMsg);
        throw new Error(errorMsg);
      }
      
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
          title: "Schedule processed",
          description: `Successfully extracted ${result.partnerHours.length} partners`,
        });
      } else {
        setErrorMessage("No partner information detected in the schedule. Please try a different file.");
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
      
      const errorMsg = errorMessage || "Failed to extract partner information from the schedule";
      
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
          <div className="starbucks-scale-in">
            <div className="w-16 h-16 bg-starbucks-forest/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-starbucks-forest animate-bounce" />
            </div>
            <p className="text-starbucks-forest font-medium">Drop your schedule here</p>
          </div>
        );
        
      case DropzoneState.PROCESSING:
        return (
          <div className="starbucks-fade-in">
            <div className="w-16 h-16 bg-starbucks-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-starbucks-coffee animate-spin" />
            </div>
            <p className="text-starbucks-coffee font-medium mb-2">Processing schedule...</p>
            <div className="w-48 h-2 bg-starbucks-beige rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-starbucks-gold animate-starbucks-shimmer"></div>
            </div>
          </div>
        );
        
      case DropzoneState.SUCCESS:
        return (
          <div className="starbucks-scale-in">
            <div className="w-16 h-16 bg-starbucks-forest/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-starbucks-forest" />
            </div>
            <p className="text-starbucks-forest font-medium mb-3">Schedule processed successfully!</p>
            {fileName && (
              <div className="starbucks-status-success inline-flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm truncate max-w-[180px]">{fileName}</span>
              </div>
            )}
          </div>
        );
        
      case DropzoneState.ERROR:
        return (
          <div className="starbucks-scale-in">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium mb-3">Processing failed</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 max-w-[280px] mx-auto">
              <p className="text-sm text-red-700">
                {errorMessage || "Please try again with a different schedule"}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setState(DropzoneState.IDLE);
              }}
              className="starbucks-btn starbucks-btn-secondary"
            >
              Try Again
            </button>
          </div>
        );
        
      default:
        return (
          <div className="starbucks-fade-in">
            <div className="w-16 h-16 bg-starbucks-sage/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-starbucks-sage" />
            </div>
            <h3 className="text-lg font-medium text-starbucks-forest mb-2">Upload Partner Schedule</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
              Drag and drop your schedule image here, or click to browse
            </p>
            <button 
              className="starbucks-btn starbucks-btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Upload className="w-4 h-4" />
              Choose File
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              Supports PNG, JPG, JPEG, GIF
            </p>
          </div>
        );
    }
  };
  
  const getDropzoneClasses = () => {
    const baseClasses = "starbucks-upload-zone";
    
    switch (state) {
      case DropzoneState.DRAGGING:
        return `${baseClasses} dragover border-starbucks-forest bg-starbucks-forest/5`;
      case DropzoneState.PROCESSING:
        return `${baseClasses} border-starbucks-gold/50 bg-starbucks-gold/5`;
      case DropzoneState.SUCCESS:
        return `${baseClasses} border-starbucks-forest/50 bg-starbucks-forest/5`;
      case DropzoneState.ERROR:
        return `${baseClasses} border-red-300 bg-red-50`;
      default:
        return baseClasses;
    }
  };
  
  return (
    <>
      <div
        className={getDropzoneClasses()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {renderDropzoneContent()}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileInputChange}
      />
    </>
  );
}