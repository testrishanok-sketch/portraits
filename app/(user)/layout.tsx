import { Camera } from "lucide-react";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-center">
                    <div className="flex items-center gap-2 font-bold tracking-wider">
                        <Camera className="w-5 h-5 text-purple-400" />
                        <span>EVENTCAM</span>
                    </div>
                </div>
            </header>

            <main className="pt-20 pb-10 px-4 max-w-md mx-auto">
                {children}
            </main>
        </div>
    );
}
