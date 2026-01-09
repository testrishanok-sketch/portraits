"use client";

import Link from "next/link";
import { Plus, ArrowRight, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Event = {
    id: string;
    name: string;
    created_at: string;
    slug: string;
}

export default function AdminDashboard() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
            if (data) setEvents(data);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your events and photos.</p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors shadow-lg shadow-purple-500/10 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    New Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create New Event Card (Mobile Friendly) */}
                <Link href="/admin/events/new" className="group relative border border-dashed border-neutral-700 bg-neutral-900/50 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-purple-500/50 hover:bg-purple-900/10 transition-all cursor-pointer h-64 active:scale-95">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors shadow-lg">
                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-400" />
                    </div>
                    <p className="font-semibold text-gray-300 group-hover:text-white">Create New Event</p>
                </Link>

                {/* Loading State */}
                {loading && (
                    <div className="h-64 border border-neutral-800 bg-neutral-900 rounded-3xl animate-pulse" />
                )}

                {/* Event Cards */}
                {events.map(event => (
                    <div key={event.id} className="group relative border border-neutral-800 bg-neutral-900 rounded-3xl overflow-hidden hover:border-neutral-700 transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col h-64">
                        {/* Card Header Gradient */}
                        <div className="h-28 bg-gradient-to-br from-indigo-900 via-purple-900 to-neutral-900 relative">
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="absolute bottom-4 left-6 right-4">
                                <h3 className="text-xl font-bold text-white truncate">{event.name}</h3>
                                <p className="text-xs text-purple-200 mt-1 font-mono opacity-60">ID: {event.id.slice(0, 8)}</p>
                            </div>
                        </div>

                        {/* Card Actions */}
                        <div className="p-6 flex-1 flex flex-col justify-end">
                            <div className="grid grid-cols-[1fr,auto,auto] gap-2">
                                <Link href={`/admin/upload?id=${event.id}`} className="flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 py-2.5 rounded-xl text-sm font-medium transition-colors text-white">
                                    Manage
                                </Link>
                                <Link href={`/event/${event.id}`} target="_blank" className="p-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-gray-400 hover:text-white transition-colors" title="View Public Page">
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href={`/admin/events/${event.id}/qr`} className="p-2.5 bg-white text-black hover:bg-gray-200 rounded-xl transition-colors" title="Get QR Code">
                                    <QrCode className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
