"use client";

import { ShieldAlert } from "lucide-react";

export function AdminAccessBanner() {
    return (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 sm:p-5 mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <ShieldAlert className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-900">
                        ⚠️ Administrator Account Active
                    </p>
                    <p className="text-xs text-yellow-800 mt-0.5">
                        You are currently logged in with administrator access. Exercise extreme caution when making changes.
                    </p>
                </div>
            </div>
        </div>
    );
}