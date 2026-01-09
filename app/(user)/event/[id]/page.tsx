import Link from "next/link";
import { Camera, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function EventLandingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Event Name
    // Fallback ID logic is only for the very old '1' URL, new ones work naturally
    const queryId = id === '1' ? 'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0' : id;
    const { data: event } = await supabase.from('events').select('name').eq('id', queryId).single();

    const eventName = event?.name || "Welcome to the Event";

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-10 animate-in fade-in duration-700">

            {/* Hero Section */}
            <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse" />
                <div className="relative w-32 h-32 bg-neutral-900 rounded-full flex items-center justify-center border-4 border-neutral-800 shadow-2xl">
                    <Camera className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                    AI Ready
                </div>
            </div>

            {/* Text Content */}
            <div className="space-y-4 max-w-sm mx-auto">
                <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
                    {eventName}
                </h1>
                <p className="text-xl text-gray-400 font-medium">
                    Find your photos instantly.
                </p>
            </div>

            {/* Action Button */}
            <Link
                href={`/event/${id}/scan`}
                className="group relative w-full max-w-xs bg-white text-black font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
                <span>Find My Photos</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Footer / Branding */}
            <div className="pt-12 space-y-2">
                <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">
                    Powered by
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Camera className="w-4 h-4" />
                    <span className="font-bold tracking-tight text-white">portraits.in</span>
                </div>
            </div>
        </div>
    );
}
