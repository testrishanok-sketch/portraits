import Link from "next/link";
import { Calendar, Upload, Settings, Camera } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-neutral-900 text-white">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 z-50">
                <Camera className="w-5 h-5 text-purple-500 mr-2" />
                <span className="font-bold text-lg">portraits.in</span>
            </div>

            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-neutral-800 p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-2 mb-8 text-xl font-bold tracking-tight">
                    <Camera className="w-6 h-6 text-purple-500" />
                    <span>portraits.in</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-800 transition-colors">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span>Events</span>
                    </Link>
                    <Link href="/admin/upload" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-800 transition-colors">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span>Upload</span>
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-neutral-800">
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-800 transition-colors">
                        <Settings className="w-5 h-5 text-gray-400" />
                        <span>Settings</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-black pt-16 md:pt-0 pb-20 md:pb-0">
                <div className="p-4 md:p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-neutral-900 border-t border-neutral-800 flex items-center justify-around z-50">
                <Link href="/admin" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white p-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-[10px]">Events</span>
                </Link>
                <Link href="/admin/upload" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white p-2">
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px]">Upload</span>
                </Link>
                <Link href="/admin/settings" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white p-2">
                    <Settings className="w-5 h-5" />
                    <span className="text-[10px]">Settings</span>
                </Link>
            </div>
        </div>
    );
}
