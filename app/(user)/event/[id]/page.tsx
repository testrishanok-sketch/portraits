import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";

export default async function EventLandingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in duration-700">

            <div className="relative w-40 h-40">
                <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 animate-pulse" />
                <div className="relative w-full h-full bg-neutral-900 rounded-full flex items-center justify-center border border-white/10">
                    <Camera className="w-16 h-16 text-purple-400" />
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                    Welcome!
                </h1>
                <p className="text-gray-400 text-lg max-w-xs mx-auto">
                    We used AI to find your photos from the event. Take a quick selfie to see them.
                </p>
            </div>

            <Link
                href={`/event/${id}/scan`}
                className="group relative w-full max-w-xs bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all hover:scale-105"
            >
                <span>Find My Photos</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-xs text-gray-600">
                Privacy First: Your selfie is processed instantly and never permanently stored.
            </p>
        </div>
    );
}
