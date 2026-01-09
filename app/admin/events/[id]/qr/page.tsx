"use client";

import { use, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function EventQRPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [url, setUrl] = useState("");

    useEffect(() => {
        // Generate the full URL for the guest to scan
        // This works both on localhost and deployment
        const origin = window.location.origin;
        setUrl(`${origin}/event/${id}`);
    }, [id]);

    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-8">
            <div className="absolute top-8 left-8 print:hidden">
                <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="text-center space-y-8 max-w-md w-full">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight">Scan for Photos 📸</h1>
                    <p className="text-xl text-gray-500">Find your pictures instantly with AI</p>
                </div>

                <div className="border-4 border-black p-8 rounded-3xl bg-white shadow-2xl mx-auto inline-block">
                    {url && (
                        <div className="h-64 w-64">
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={url}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <p className="font-mono text-sm text-gray-400 break-all">{url}</p>

                    <button
                        onClick={() => window.print()}
                        className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 w-full hover:scale-105 transition-transform print:hidden"
                    >
                        <Printer className="w-6 h-6" />
                        Print This Page
                    </button>
                    <p className="text-sm text-gray-500 print:hidden">Tip: Print this and stick it at existing at the venue entry!</p>
                </div>
            </div>
        </div>
    );
}
