"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, CheckCircle, Loader2, X, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import * as faceAI from "@/lib/face-recognition";
import { supabase } from "@/lib/supabase";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Sub-component that uses useSearchParams

function UploadContent() {

    // ... Refactoring handleUpload to expose `uploadFile(file)` function ...

    const searchParams = useSearchParams();
    const eventIdParam = searchParams.get('id');
    const [events, setEvents] = useState<any[]>([]);

    // State
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [modelLoading, setModelLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Initializing AI...");

    // 1. If NO ID: Show Event Selector
    useEffect(() => {
        if (!eventIdParam) {
            supabase.from('events').select('*').order('created_at', { ascending: false })
                .then(({ data }) => setEvents(data || []));
        }
    }, [eventIdParam]);

    if (!eventIdParam) {
        return (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Select Event</h1>
                    <p className="text-gray-400">Where do you want to upload photos?</p>
                </div>
                <div className="grid gap-4">
                    {events.map(event => (
                        <a href={`/admin/upload?id=${event.id}`} key={event.id} className="block p-6 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 hover:border-purple-500/50 transition-all flex items-center justify-between group">
                            <span className="font-semibold text-lg">{event.name}</span>
                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <Upload className="w-4 h-4" />
                            </div>
                        </a>
                    ))}
                    {events.length === 0 && (
                        <div className="text-center p-8 bg-neutral-900 rounded-2xl border border-dashed border-neutral-800">
                            <p className="text-gray-500">No events found.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const EVENT_ID = eventIdParam;

    // 2. Load models
    useEffect(() => {
        faceAI.loadModels().then(() => {
            setModelLoading(false);
            setStatusText("Ready to Index");
        });
    }, []);

    // 3. Ensure the Event exists in DB on load (Fixes Foreign Key Error)
    useEffect(() => {
        const checkEvent = async () => {
            const { data } = await supabase.from('events').select('id').eq('id', EVENT_ID).single();
            if (!data) {
                console.log("Event missing, creating demo event...");
                await supabase.from('events').insert({
                    id: EVENT_ID,
                    name: 'Demo Event',
                    slug: 'demo'
                });
            }
        };
        checkEvent();
    }, [EVENT_ID]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    // Helper to resize image
    const resizeImage = (file: File): Promise<Blob> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 1920;
                    const MAX_HEIGHT = 1920;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob!);
                    }, 'image/jpeg', 0.85); // 85% Quality JPEG
                }
                img.src = e.target?.result as string;
            }
            reader.readAsDataURL(file);
        });
    };

    const [isLive, setIsLive] = useState(false);
    const [processedFiles] = useState(new Set<string>());
    const [liveLogs, setLiveLogs] = useState<string[]>([]);

    // Core Upload Function (Reusable)
    const uploadOneFile = async (file: File) => {
        try {
            setStatusText(`Processing ${file.name}...`);
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            await new Promise(r => img.onload = r);

            // 1. Detect Faces
            const faces = await faceAI.getAllFaces(img);

            // 2. Resize
            const resizedBlob = await resizeImage(file);

            // 3. Upload to Storage
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const { error: fileError } = await supabase.storage
                .from('events')
                .upload(`${EVENT_ID}/${fileName}`, resizedBlob);

            if (fileError) throw fileError;

            const photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events/${EVENT_ID}/${fileName}`;

            // 4. Save to DB
            for (const face of faces) {
                await supabase.from('faces').insert({
                    event_id: EVENT_ID,
                    photo_url: photoUrl,
                    descriptor: Array.from(face.descriptor)
                });
            }
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    // Live Directory Watcher
    const startLiveSync = async () => {
        try {
            // @ts-ignore
            const handle = await window.showDirectoryPicker();
            setIsLive(true);
            setLiveLogs(prev => [`📂 Watching folder: ${handle.name}`, ...prev]);

            setInterval(async () => {
                for await (const entry of handle.values()) {
                    if (entry.kind === 'file' && !processedFiles.has(entry.name)) {
                        const file = await entry.getFile();
                        if (file.type.startsWith('image/')) {
                            processedFiles.add(entry.name);
                            setLiveLogs(prev => [`📸 Found: ${entry.name}`, ...prev]);
                            await uploadOneFile(file);
                            setLiveLogs(prev => [`✅ Uploaded: ${entry.name}`, ...prev]);
                        }
                    }
                }
            }, 3000);
        } catch (e) {
            console.error("Live Sync cancelled");
        }
    };

    const handleUpload = async () => {
        setUploading(true);
        setProgress(0);
        let processed = 0;
        for (const file of files) {
            await uploadOneFile(file);
            processed++;
            setProgress(Math.round((processed / files.length) * 100));
        }
        setUploading(false);
        setStatusText("Completed!");
        setFiles([]);
        alert("Upload Done!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Upload Photos</h1>
                    <p className="text-gray-400 mt-2">Adding to Event ID: <span className="font-mono text-purple-400">{EVENT_ID.slice(0, 8)}...</span></p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={startLiveSync}
                        disabled={isLive || modelLoading}
                        className={cn("px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all", isLive ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-purple-500 text-white hover:bg-purple-600")}
                    >
                        <BrainCircuit className="w-4 h-4" />
                        {isLive ? "Live Sync Active" : "Start Live Sync"}
                    </button>
                    {!isLive && (
                        <div className={cn("px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2", modelLoading ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500")}>
                            {modelLoading ? "Loading AI..." : "AI Ready"}
                        </div>
                    )}
                </div>
            </div>

            {/* Live Logs */}
            {isLive && (
                <div className="bg-black border border-neutral-800 rounded-xl p-4 font-mono text-xs text-green-400 h-32 overflow-y-auto">
                    {liveLogs.length === 0 && <p className="text-gray-500">Waiting for photos...</p>}
                    {liveLogs.map((log, i) => (
                        <div key={i}>{log}</div>
                    ))}
                </div>
            )}

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed border-neutral-700 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-neutral-900/50 hover:border-purple-500/50 min-h-[400px]",
                    isDragActive && "border-purple-500 bg-purple-500/10"
                )}
            >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                    <Upload className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drag & Drop photos here</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    or click to browse from your camera folder. Supports JPG, PNG.
                </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-300">{files.length} Photos Selected</h4>
                        <button onClick={() => setFiles([])} className="text-sm text-red-400 hover:text-red-300">Clear All</button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto pr-2">
                        {files.map((file, i) => (
                            <div key={i} className="relative aspect-square bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 group">
                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                <button onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, idx) => idx !== i)) }} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-neutral-800">
                        {uploading ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-purple-400 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {statusText}
                                    </span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleUpload}
                                disabled={modelLoading}
                                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Start Upload & Indexing
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Default export wrapping in Suspense
export default function UploadPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Upload Tool...</div>}>
            <UploadContent />
        </Suspense>
    );
}
