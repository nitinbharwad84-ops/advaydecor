'use client';

import { useEffect } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { RefreshCcw, Home, Info, AlertOctagon } from 'lucide-react';
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
        <LazyMotion features={domAnimation}>
            <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gradient-to-b from-[#fdfbf7] to-white overflow-hidden">
                <div className="max-w-2xl w-full text-center relative z-10 flex flex-col items-center">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center w-full"
                    >
                        {/* Error Icon */}
                        <m.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
                            className="relative mb-8"
                        >
                            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
                            <div className="relative flex items-center justify-center w-24 h-24 bg-red-50 text-red-500 rounded-full border border-red-100 shadow-sm">
                                <AlertOctagon strokeWidth={1.5} className="w-12 h-12" />
                            </div>
                        </m.div>

                        {/* Title & Description */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a23] mb-4">
                            Something went wrong
                        </h1>

                        <p className="text-base sm:text-lg text-[#64648b] max-w-lg mx-auto mb-10 leading-relaxed px-4">
                            Our apologies for the inconvenience. A technical hiccup occurred while loading this page.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center mb-12 px-4">
                            <m.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => reset()}
                                className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-[#0a0a23] px-8 py-4 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-[#0a0a23]/20 transition-all duration-300"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <RefreshCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500 ease-out" />
                                    Try Again
                                </span>
                            </m.button>

                            <Link href="/" className="w-full sm:w-auto">
                                <m.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0a0a23] font-medium rounded-full border border-[#e8e4dc] hover:border-[#0a0a23] hover:bg-gray-50 transition-all duration-300 shadow-sm"
                                >
                                    <Home size={18} className="text-[#64648b] group-hover:text-[#0a0a23] transition-colors" />
                                    Return Home
                                </m.div>
                            </Link>
                        </div>
                    </m.div>

                    {/* Helpful Tip */}
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 w-full max-w-lg mx-auto text-left flex gap-4 items-start shadow-sm"
                    >
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full shrink-0 mt-0.5">
                            <Info size={18} strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900 text-sm mb-1 uppercase tracking-wider">
                                Helpful Tip
                            </h3>
                            <p className="text-blue-800/80 text-sm leading-relaxed">
                                Try refreshing your browser page or clearing your cache if the "Try Again" button doesn't resolve the issue.
                            </p>
                        </div>
                    </m.div>

                    {error.digest && (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 pt-6 border-t border-gray-100 w-full max-w-lg"
                        >
                            <p className="text-xs text-gray-400 font-mono bg-white inline-block px-3 py-1 rounded-md border border-gray-100">
                                Error ID: {error.digest}
                            </p>
                        </m.div>
                    )}
                </div>
            </div>
        </LazyMotion>
    );
}
