import React from "react";
import { Button } from "@/components/ui/button";

interface ProfileRemovedNoticeProps {
  onClose: () => void;
}

export default function ProfileRemovedNotice({ onClose }: ProfileRemovedNoticeProps) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-4 rounded shadow-lg flex items-center space-x-4 max-w-sm">
      <div>
        <strong>Your profile has been removed.</strong>
        <p>Please contact support if you believe this is an error.</p>
      </div>
      <Button variant="outline" onClick={onClose} className="text-white border-white hover:bg-red-700">
        Close
      </Button>
    </div>
  );
}
