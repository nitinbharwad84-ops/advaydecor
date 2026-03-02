'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Home, Info, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service like Sentry or console
        console.error('Runtime Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#fdfbf7]">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-[#0a0a23] mb-4">
                        Something Went Wrong
                    </h1>

                    <p className="text-[#64648b] max-w-md mx-auto mb-10 leading-relaxed text-lg">
                        Our apologies for the inconvenience. A technical hiccup occurred while loading this page. Our team has been notified.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => reset()}
                            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#0a0a23] text-white rounded-full font-bold shadow-xl hover:bg-[#1c1c3d] transition-all"
                        >
                            <RefreshCcw size={20} />
                            Try Again
                        </motion.button>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-[#0a0a23] border border-[#e8e4dc] rounded-full font-bold hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <Home size={20} />
                            Return Home
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 p-6 bg-white rounded-2xl border border-[#f0ece4] shadow-sm flex items-start gap-4 text-left max-w-lg mx-auto"
                >
                    <div className="bg-[#00b4d815] p-2 rounded-lg">
                        <Info size={20} className="text-[#00b4d8]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#0a0a23] text-sm mb-1 uppercase tracking-wider">Helpful Tip</h3>
                        <p className="text-[#64648b] text-sm leading-relaxed">
                            Try refreshing your browser page or clearing your cache if the "Try Again" button doesn't resolve the issue immediately.
                        </p>
                    </div>
                </motion.div>

                {error.digest && (
                    <p className="mt-8 text-xs text-[#9e9eb8] font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
