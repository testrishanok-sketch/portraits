"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Connect to Supabase to create event
        setTimeout(() => {
            setLoading(false);
            router.push("/admin/upload");
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                <h1 className="text-2xl font-bold mb-2">Create New Event</h1>
                <p className="text-gray-400 mb-8">Set up a new bucket for storing photos and faces.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Event Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Rishabh & Anjali Wedding"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Date</label>
                        <input
                            type="date"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className={cn(
                            "w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center",
                            loading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Event & Start Uploading"}
                    </button>
                </form>
            </div>
        </div>
    );
}
