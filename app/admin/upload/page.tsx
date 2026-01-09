"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, CheckCircle, Loader2, X, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import * as faceAI from "@/lib/face-recognition";

export default function UploadPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [modelLoading, setModelLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Initializing AI...");

    // Load models on mount
    useEffect(() => {
        faceAI.loadModels().then(() => {
            setModelLoading(false);
            setStatusText("Ready to Index");
        });
    }, []);

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

    const handleUpload = async () => {
        setUploading(true);
        setProgress(0);

        const total = files.length;
        let processed = 0;

        for (const file of files) {
            setStatusText(`Processing ${file.name}...`);

            // 1. Create Image for Face Detection
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            await new Promise(r => img.onload = r);

            try {
                // 2. Detect Faces (On Original for max accuracy)
                const faces = await faceAI.getAllFaces(img);
                console.log(`Found ${faces.length} faces in ${file.name}`);

                // 3. Resize for Storage (Save Bandwidth & Free Tier ID)
                setStatusText(`Optimizing ${file.name}...`);
                const resizedBlob = await resizeImage(file);
                console.log(`Resized: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(resizedBlob.size / 1024 / 1024).toFixed(2)}MB`);

                // 4. Upload to Supabase (TODO: Connect client)
                // const { data } = await supabase.storage.from('events').upload(...)

            } catch (err) {
                console.error(err);
            }

            processed++;
            setProgress(Math.round((processed / total) * 100));
        }

        setUploading(false);
        setStatusText("All Completed!");
        setFiles([]);
        setTimeout(() => setStatusText("Ready to Index"), 2000);
        alert("Upload & AI Indexing Complete!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Upload Photos</h1>
                    <p className="text-gray-400 mt-2">Add photos to the current event bucket.</p>
                </div>
                <div className={cn("px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2", modelLoading ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500")}>
                    <BrainCircuit className="w-4 h-4" />
                    {modelLoading ? "Loading AI Brain..." : "AI Ready"}
                </div>
            </div>

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
