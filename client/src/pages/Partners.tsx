import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppTabs from "@/components/AppTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Partner } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Partners() {
  const [newPartnerName, setNewPartnerName] = useState("");
  const { toast } = useToast();
  
  const { data: partners, isLoading, refetch } = useQuery<Partner[]>({
    queryKey: ['/api/partners'],
  });
  
  const handleAddPartner = async () => {
    if (!newPartnerName.trim()) {
      toast({
        title: "Partner name required",
        description: "Please enter a name for the partner",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await apiRequest("POST", "/api/partners", { name: newPartnerName.trim() });
      setNewPartnerName("");
      refetch();
      toast({
        title: "Partner added",
        description: `${newPartnerName} has been added to partners`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add partner",
        description: "An error occurred while adding the partner",
        variant: "destructive"
      });
    }
  };
  
  return (
    <main className="container mx-auto px-4 pt-6 pb-16">
      <AppTabs />
      
      <div className="max-w-3xl mx-auto mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <i className="fas fa-users mr-2 text-[hsl(var(--starbucks-green))]"></i>
              Manage Partners
            </h2>
            
            <div className="flex gap-4 mb-8">
              <Input
                placeholder="Enter partner name"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                className="flex-grow"
              />
              <Button 
                onClick={handleAddPartner}
                className="bg-[hsl(var(--starbucks-green))]"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Partner
              </Button>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Partner List</h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-[hsl(var(--starbucks-green))]"></i>
                  <p className="mt-2">Loading partners...</p>
                </div>
              ) : partners && partners.length > 0 ? (
                <div className="grid gap-4">
                  {partners.map((partner) => (
                    <div 
                      key={partner.id}
                      className="flex items-center justify-between p-4 bg-[hsl(var(--dark-bg))] rounded-lg border border-[hsl(var(--dark-border))]"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-[hsl(var(--starbucks-dark))] text-white">
                            {partner.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{partner.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-[hsl(var(--dark-bg))] rounded-lg border border-[hsl(var(--dark-border))]">
                  <p className="text-gray-400">No partners added yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
