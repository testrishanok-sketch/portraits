"use client";

import { use, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EventQRPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [url, setUrl] = useState("");
    const [eventName, setEventName] = useState("Event Name");

    useEffect(() => {
        const origin = window.location.origin;
        setUrl(`${origin}/event/${id}`);

        // Fetch Event Name
        supabase.from('events').select('name').eq('id', id).single().then(({ data }) => {
            if (data) setEventName(data.name);
        });
    }, [id]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center font-sans print:p-0">

            {/* Backdrop for Screen (Hidden in Print) */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-100 to-white -z-10 print:hidden" />

            {/* Poster Container (Represents the physical paper) */}
            <div className="bg-white max-w-[600px] w-full aspect-[2/3] relative flex flex-col items-center justify-between py-24 px-12 shadow-2xl print:shadow-none print:w-full print:aspect-auto print:h-screen print:py-12">

                {/* Header Section */}
                <div className="space-y-2">
                    <p className="tracking-[0.3em] font-medium text-neutral-500 text-sm uppercase">Capture The</p>
                    <h1 className="font-[family-name:var(--font-great-vibes)] text-8xl text-black leading-[0.8]">Moments</h1>
                </div>

                {/* Subtitle - Simplified */}
                <div className="space-y-1">
                    <p className="text-sm font-medium tracking-widest text-neutral-800 uppercase">Please Scan Code</p>
                    <p className="text-xs text-neutral-400 tracking-wider">TO FIND YOUR PHOTOS INSTANTLY</p>
                </div>

                {/* QR Code Only (No Camera Graphic) */}
                <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center my-8">
                    <div className="relative z-10 bg-white p-4 rounded-3xl shadow-xl border border-neutral-100 print:shadow-none print:border-4 print:border-black">
                        {url && (
                            <QRCode
                                size={200}
                                style={{ height: "auto", maxWidth: "100%", width: "200px" }}
                                value={url}
                                viewBox={`0 0 256 256`}
                            />
                        )}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="w-full space-y-6 mt-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-outfit)] font-black tracking-[0.2em] uppercase text-neutral-900">
                            {eventName}
                        </h2>
                        <div className="w-full h-1 bg-black rounded-full" />
                    </div>

                    <div className="flex items-center justify-center gap-3 text-neutral-600 text-sm md:text-base font-bold tracking-[0.3em] font-[family-name:var(--font-outfit)] uppercase">
                        <span>PORTRAITS.IN</span>
                        <span className="text-black">•</span>
                        <span>LIVE GALLERY</span>
                    </div>
                </div>

            </div>

            {/* Print Action Button (Hidden in Print) */}
            <button
                onClick={() => window.print()}
                className="fixed bottom-8 right-8 bg-black text-white px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform print:hidden flex items-center gap-2 z-50"
            >
                🖨️ Print Poster
            </button>
            {/* Hidden Back Button */}
            <div className="fixed top-4 left-4 opacity-0 hover:opacity-100 transition-opacity print:hidden">
                <Link href="/admin" className="p-2 bg-neutral-100 rounded-lg text-xs">Back</Link>
            </div>
        </div>
    );
}
