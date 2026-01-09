import { Camera } from "lucide-react";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: "EventCam - Find Your Photos",
    description: "AI-powered event photo finder",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevent zooming issues on input
    themeColor: "#000000",
};

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 supports-[backdrop-filter]:bg-black/60">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-center relative">
                    <div className="flex items-center gap-2 font-bold tracking-wider">
                        <Camera className="w-5 h-5 text-purple-400" />
                        <span>portraits.in</span>
                    </div>
                </div>
            </header>

            <main className="pt-20 pb-10 px-4 max-w-md mx-auto min-h-[calc(100vh-80px)]">
                {children}
            </main>
        </div>
    );
}
