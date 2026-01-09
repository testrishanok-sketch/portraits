"use client";

import { useState, useEffect, use } from "react";
import Confetti from "react-confetti";
import { Download, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }, []);

    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);

        // Load matches from Scan Page
        const storedMatches = localStorage.getItem('matched_photos');
        if (storedMatches) {
            try {
                const parsed = JSON.parse(storedMatches);
                setPhotos(parsed);
            } catch (e) {
                console.error("Failed to parse matches", e);
            }
        }
    }, []);

    if (photos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="text-6xl">😕</div>
                <h2 className="text-xl font-bold">No photos found yet.</h2>
                <p className="text-gray-400 max-w-xs">We couldn't find a match in the current uploads. Try scanning again later!</p>
                <Link href={`/event/${id}/scan`} className="bg-white text-black px-6 py-3 rounded-full font-bold">
                    Scan Again
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />

            <div className="flex items-center justify-between">
                <Link href={`/event/${id}`} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold">3 Photos Found!</h1>
                <div className="w-6" />
            </div>

            <div className="grid grid-cols-1 gap-8">
                {photos.map((src, i) => (
                    <div key={i} className="flex flex-col gap-3">
                        {/* Image Card */}
                        <div className="relative group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl aspect-[3/4]">
                            <img src={src} className="w-full h-full object-cover" alt="Your matching photo" />
                        </div>

                        {/* Action Buttons (Always Visible) */}
                        <div className="flex gap-2">
                            <a
                                href={src}
                                download={`event-photo-${i}.jpg`}
                                className="flex-1 bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all shadow-lg"
                            >
                                <Download className="w-5 h-5" />
                                Download
                            </a>
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: 'My Event Photo',
                                            text: 'Check out my photo from portraits.in!',
                                            url: src
                                        }).catch(console.error);
                                    } else {
                                        navigator.clipboard.writeText(src);
                                        alert("Link copied!");
                                    }
                                }}
                                className="w-12 bg-neutral-800 text-white rounded-xl flex items-center justify-center hover:bg-neutral-700 active:scale-95 transition-all"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pt-8">
                <p className="text-gray-500 text-sm">Not you? <Link href={`/event/${id}/scan`} className="text-purple-400 underline">Try scanning again</Link></p>
            </div>
        </div>
    );
}
