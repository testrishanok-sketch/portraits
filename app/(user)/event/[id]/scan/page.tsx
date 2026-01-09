"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { Camera, RefreshCw, Loader2, User } from "lucide-react";
import * as faceAI from "@/lib/face-recognition";
import { cn } from "@/lib/utils";

export default function SelfieScanPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [status, setStatus] = useState("Align your face and take a photo");
    const [modelLoading, setModelLoading] = useState(true);

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

            setStatus("Face Found! Searching for matches...");

            // Mock query latency
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success - Redirect to Gallery with "mock" user ID or descriptor hash
            // In real app, we'd pass the descriptor to Supabase RPC
            router.push(`/event/${params.id}/gallery?match=true`);

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
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img src={imgSrc} alt="Selfie" className="w-full h-full object-cover" />
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
