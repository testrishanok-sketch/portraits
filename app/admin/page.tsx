import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Your Events
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your photo Events and QR codes.</p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    New Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Empty State / New Event Card */}
                <Link href="/admin/events/new" className="group relative border border-dashed border-neutral-700 bg-neutral-900/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-purple-500/50 hover:bg-purple-900/10 transition-all cursor-pointer h-64">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-400" />
                    </div>
                    <p className="font-semibold text-gray-300 group-hover:text-white">Create New Event</p>
                </Link>

                {/* Placeholder for existing event */}
                <div className="border border-neutral-800 bg-neutral-900 rounded-2xl overflow-hidden hover:border-neutral-700 transition-colors group">
                    <div className="h-32 bg-gradient-to-br from-purple-900 to-black relative">
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold mb-1">Rishabh & Anjali Wedding</h3>
                        <p className="text-sm text-gray-500 mb-4">Jan 09, 2026 • 24 Photos</p>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-neutral-800 hover:bg-neutral-700 py-2 rounded-lg text-sm font-medium transition-colors">
                                Manage
                            </button>
                            <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                                Download QR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
