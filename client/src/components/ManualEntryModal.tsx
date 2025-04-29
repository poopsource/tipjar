import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import { parseManualEntry } from "@/lib/utils";

type ManualEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ManualEntryModal({ isOpen, onClose }: ManualEntryModalProps) {
  const [manualInput, setManualInput] = useState("");
  const { toast } = useToast();
  const { setPartnerHours, setExtractedText } = useTipContext();
  
  const handleSave = () => {
    if (!manualInput.trim()) {
      toast({
        title: "No data entered",
        description: "Please enter partner information",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const parsedData = parseManualEntry(manualInput);
      
      if (parsedData.length === 0) {
        toast({
          title: "Invalid format",
          description: "Please use the format: Name: hours",
          variant: "destructive"
        });
        return;
      }
      
      setPartnerHours(parsedData);
      setExtractedText(manualInput);
      
      toast({
        title: "Partners saved",
        description: `${parsedData.length} partners have been added`,
      });
      
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error parsing data",
        description: "Please check your input format",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[hsl(var(--dark-surface))] text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Manual Partner Entry</DialogTitle>
          <DialogDescription className="text-gray-300">
            Enter partner names and hours, one per line in the format: 
            <span className="font-mono bg-[hsl(var(--dark-bg))] px-2 py-1 rounded ml-2">Name: hours</span>
          </DialogDescription>
        </DialogHeader>
        
        <Textarea
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          className="h-64 bg-[hsl(var(--dark-bg))] border-[hsl(var(--dark-border))] font-mono resize-none"
          placeholder="John Smith: 32
Maria Garcia: 24
David Johnson: 40"
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-[hsl(var(--starbucks-green))]"
            onClick={handleSave}
          >
            Save Partners
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
