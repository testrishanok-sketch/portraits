"use client";

import { useRef, useState, useCallback, useEffect, use } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { Camera, RefreshCw, Loader2, User, FlipHorizontal } from "lucide-react";
import * as faceAI from "@/lib/face-recognition";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function SelfieScanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [status, setStatus] = useState("Align your face and take a photo");
    const [modelLoading, setModelLoading] = useState(true);
    const [mirrored, setMirrored] = useState(true); // Default to mirrored

    useEffect(() => {
        faceAI.loadModels().then(() => setModelLoading(false));
    }, []);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImgSrc(imageSrc);
            handleScan(imageSrc);
        }
    }, [webcamRef]);

    const handleScan = async (imageSrc: string) => {
        setScanning(true);
        setStatus("Scanning face...");

        try {
            const img = document.createElement('img');
            img.src = imageSrc;
            await new Promise(r => img.onload = r);

            const descriptor = await faceAI.getFaceDescriptor(img);

            if (!descriptor) {
                setStatus("No face detected. Please try again.");
                setScanning(false);
                setImgSrc(null);
                return;
            }

            setStatus("Face Found! Searching database...");

            // 1. Fetch all face descriptors for this event
            // Note: In this prototype, we use the Demo Event ID if id is '1'
            const queryId = id === '1' ? 'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0' : id;

            const { data: faces, error } = await supabase
                .from('faces')
                .select('photo_url, descriptor')
                .eq('event_id', queryId);

            if (error || !faces) {
                console.error(error);
                setStatus("Error connecting to event database.");
                setScanning(false);
                return;
            }

            // 2. Client-side Matching
            const matches: string[] = [];
            // High threshold for loose matching, lower (e.g. 0.45) for strict
            const THRESHOLD = 0.5;

            // Convert the Float32Array from the selfie
            const probe = descriptor;

            for (const face of faces) {
                // Convert database array back to Float32Array
                const storedDescriptor = new Float32Array(face.descriptor);
                const distance = faceAI.euclideanDistance(probe, storedDescriptor);

                if (distance < THRESHOLD) {
                    matches.push(face.photo_url);
                }
            }

            // remove duplicates properly using Set
            const uniqueMatches = Array.from(new Set(matches));

            if (uniqueMatches.length > 0) {
                // Pass matches to gallery via URL or LocalStorage
                // For simplicity, we use LocalStorage here to handle large lists
                localStorage.setItem('matched_photos', JSON.stringify(uniqueMatches));
                router.push(`/event/${id}/gallery?match=true`);
            } else {
                setStatus("No photos found matching you.");
                setScanning(false);
            }

        } catch (e) {
            console.error(e);
            setStatus("Error processing image.");
            setScanning(false);
        }
    };

    const retake = () => {
        setImgSrc(null);
        setScanning(false);
        setStatus("Align your face and take a photo");
    };

    return (
        <div className="flex flex-col h-full min-h-[80vh] py-4">
            <h1 className="text-xl font-bold text-center mb-6">Take a Selfie</h1>

            <div className="relative aspect-[3/4] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 mx-auto w-full max-w-sm">
                {modelLoading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-2" />
                        <p className="text-sm">Loading Face AI...</p>
                    </div>
                )}

                {!imgSrc ? (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            mirrored={mirrored}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "user" }}
                            className="w-full h-full object-cover"
                        />
                        {/* Mirror Toggle Button */}
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setMirrored(!mirrored)}
                                className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                            >
                                <FlipHorizontal className={cn("w-5 h-5 transition-transform", mirrored ? "text-purple-400" : "text-white")} />
                            </button>
                        </div>
                    </>
                ) : (
                    <img src={imgSrc} alt="Selfie" className={cn("w-full h-full object-cover", mirrored && "scale-x-[-1]")} />
                )}

                {/* Overlay Guide */}
                {!imgSrc && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-48 h-64 border-2 border-purple-500/50 rounded-[40%] animate-pulse" />
                    </div>
                )}
            </div>

            <div className="mt-8 text-center space-y-6">
                <p className={cn("font-medium transition-colors", scanning ? "text-purple-400 animate-pulse" : "text-gray-400")}>
                    {status}
                </p>

                {!imgSrc ? (
                    <button
                        onClick={capture}
                        disabled={modelLoading}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto hover:bg-gray-200 active:scale-95 transition-all outline-4 outline-offset-4 outline-purple-500/0 hover:outline-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="w-16 h-16 border-4 border-black rounded-full" />
                    </button>
                ) : (
                    <div className="flex justify-center gap-4">
                        {scanning ? (
                            <div className="flex items-center gap-2 px-6 py-3 bg-neutral-800 rounded-full">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <button onClick={retake} className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors">
                                <RefreshCw className="w-4 h-4" />
                                Retake
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
