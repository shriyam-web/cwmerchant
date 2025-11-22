"use client";

import { ShieldAlert } from "lucide-react";

export function AdminAccessBanner() {
    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 sm:p-5 mb-6 shadow-sm dark:shadow-gray-900/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <ShieldAlert className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">
                        ⚠️ Administrator Account Active
                    </p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-0.5">
                        You are currently logged in with administrator access. Exercise extreme caution when making changes.
                    </p>
                </div>
            </div>
        </div>
    );
}