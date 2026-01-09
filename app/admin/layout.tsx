import Link from "next/link";
import { Calendar, Upload, Settings, Camera } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-neutral-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-neutral-800 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-8 text-xl font-bold tracking-tight">
                    <Camera className="w-6 h-6 text-purple-500" />
                    <span>EventCam</span>
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
            <main className="flex-1 overflow-auto bg-black">
                <div className="p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
