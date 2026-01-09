"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { Download, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GalleryPage({ params }: { params: { id: string } }) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }, []);

    // Mock matched photos
    const photos = [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80&w=800"
    ];

    return (
        <div className="space-y-6">
            <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />

            <div className="flex items-center justify-between">
                <Link href={`/event/${params.id}`} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold">3 Photos Found!</h1>
                <div className="w-6" />
            </div>

            <div className="grid grid-cols-1 gap-6">
                {photos.map((src, i) => (
                    <div key={i} className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-lg">
                        <img src={src} className="w-full h-auto" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 text-white">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="px-4 py-2 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:bg-gray-200">
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pt-8">
                <p className="text-gray-500 text-sm">Not you? <Link href={`/event/${params.id}/scan`} className="text-purple-400 underline">Try scanning again</Link></p>
            </div>
        </div>
    );
}
