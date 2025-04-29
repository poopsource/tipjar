import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Distribution } from "@shared/schema";
import { formatCurrency, formatDate } from "@/lib/utils";

type HistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const { data: distributions, isLoading } = useQuery<Distribution[]>({
    queryKey: ['/api/distributions'],
    enabled: isOpen,
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[hsl(var(--dark-surface))] text-white sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Distribution History</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-grow scrollbar-hidden mt-4">
          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ))
            ) : distributions && distributions.length > 0 ? (
              distributions.map((dist) => (
                <div 
                  key={dist.id}
                  className="bg-[hsl(var(--dark-bg))] rounded-lg p-4 border border-[hsl(var(--dark-border))] hover:border-[hsl(var(--starbucks-green))] transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{formatDate(dist.date)}</h3>
                    <span className="bg-[hsl(var(--starbucks-green))] bg-opacity-20 text-[hsl(var(--starbucks-light))] px-2 py-1 rounded-md text-xs">
                      {formatCurrency(dist.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <i className="fas fa-users mr-2"></i>
                    <span>
                      {Array.isArray(dist.partnerData) 
                        ? dist.partnerData.length 
                        : Object.keys(dist.partnerData).length} partners
                    </span>
                    <span className="mx-2">•</span>
                    <span>{dist.totalHours} total hours</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[hsl(var(--dark-bg))] rounded-lg p-6 text-center">
                <p className="text-gray-400">No distribution history yet</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
