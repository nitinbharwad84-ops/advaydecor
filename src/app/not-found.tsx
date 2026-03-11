'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Search, Sparkles } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-20 bg-[#fdfbf7] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <motion.div 
                className="absolute top-20 left-[10%] opacity-[0.03] pointer-events-none"
                animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <Sparkles size={120} />
            </motion.div>
            <motion.div 
                className="absolute bottom-20 right-[10%] opacity-[0.03] pointer-events-none"
                animate={{ 
                    y: [0, 20, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <ShoppingBag size={150} />
            </motion.div>

            <div className="max-w-2xl w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <div className="relative inline-block">
                        <span className="text-[140px] md:text-[180px] font-bold text-[#00b4d8] leading-none opacity-[0.07] tracking-tighter select-none">
                            404
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Search className="w-20 h-20 md:w-24 md:h-24 text-[#00b4d8] opacity-80" strokeWidth={1.5} />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-display font-semibold text-[#0a0a23] mb-6 leading-tight">
                        Lost in the <span className="text-[#00b4d8]">Decor?</span>
                    </h1>
                    <p className="text-lg text-[#64648b] mb-12 max-w-lg mx-auto leading-relaxed font-light">
                        The piece of beauty you are looking for seems to have vanished. 
                        Let's find your way back to creating a home you love.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                >
                    <Link
                        href="/"
                        className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#0a0a23] text-white rounded-full font-medium transition-all hover:bg-[#1a1a3e] shadow-xl hover:shadow-[#0a0a23]/20 w-full sm:w-auto overflow-hidden"
                    >
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <Home size={18} />
                        <span>Back to Home</span>
                    </Link>
                    
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-[#0a0a23] border border-[#e8e4dc] rounded-full font-medium hover:border-[#00b4d8] hover:text-[#00b4d8] transition-all w-full sm:w-auto"
                    >
                        <ShoppingBag size={18} />
                        <span>Explore Shop</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-20 pt-10 border-t border-[#f0ece4] text-sm text-[#9e9eb8]"
                >
                    <p className="mb-2 italic opacity-80">"Art should be found in every corner of your home."</p>
                    <p>
                        Need assistance? Contact us at 
                        <a href="mailto:help@advaydecor.in" className="ml-1 text-[#00b4d8] hover:underline font-medium transition-all">
                            help@advaydecor.in
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
