import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface WelcomePendingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomePendingModal({ isOpen, onClose }: WelcomePendingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Let the magic begin!
          </DialogTitle>
          <DialogDescription className="text-left">
            Your account is pending approval. In the meantime, you can fill in the details and please wait up to 48 hours for profile approval. You'll receive an email confirmation once your profile goes live.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onClose}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
