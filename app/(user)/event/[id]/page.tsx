import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function EventLandingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Event Name
    // Fallback ID logic is only for the very old '1' URL, new ones work naturally
    const queryId = id === '1' ? 'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0' : id;
    const { data: event } = await supabase.from('events').select('name').eq('id', queryId).single();

    const eventName = event?.name || "Welcome to the Event";

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-12 animate-in fade-in duration-700">

            {/* Hero Section */}
            <div className="relative">
                {/* <div className="absolute -inset-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse" /> */}
                <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center border border-neutral-100 shadow-xl">
                    <Camera className="w-12 h-12 text-black" />
                </div>
            </div>

            {/* Text Content */}
            <div className="space-y-4 max-w-sm mx-auto px-6">
                <h1 className="text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
                    {eventName}
                </h1>
                <p className="text-lg text-neutral-500 font-medium">
                    Find your photos instantly.
                </p>
            </div>

            {/* Action Button */}
            <Link
                href={`/event/${id}/scan`}
                className="group relative w-full max-w-xs bg-black text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all hover:scale-105 shadow-xl font-[family-name:var(--font-outfit)]"
            >
                <span>Find My Photos</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Footer / Branding */}
            <div className="pt-12 space-y-3">
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">
                    Find your photos
                </p>
                <div className="flex items-center justify-center text-neutral-900">
                    <span className="font-bold tracking-tighter font-[family-name:var(--font-outfit)]">portraits.in</span>
                </div>
            </div>
        </div>
    );
}
