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
    themeColor: "#ffffff",
};

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white text-neutral-900 selection:bg-purple-100">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-center relative">
                    <div className="flex items-center font-bold tracking-tighter text-black">
                        <span className="font-[family-name:var(--font-outfit)] text-xl">portraits.in</span>
                    </div>
                </div>
            </header>

            <main className="pt-20 pb-10 px-4 max-w-md mx-auto min-h-[calc(100vh-80px)]">
                {children}
            </main>
        </div>
    );
}
