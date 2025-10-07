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
            👋 Welcome! Your account is currently pending approval. <br /><br />
            Please complete your profile details 📝 and allow up to 48 hours ⏳ for administrator review. <br /><br />
            Once approved, you’ll receive an email confirmation 📩 and your profile will go live. ✅
          </DialogDescription>


        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onClose}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
