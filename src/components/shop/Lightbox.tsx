'use client';

import { useState, useCallback, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '@/types';

interface LightboxProps {
    images: ProductImage[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [direction, setDirection] = useState(0);

    // Sync with external initialIndex when lightbox opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') navigatePrev();
            if (e.key === 'ArrowRight') navigateNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, currentIndex]);

    const navigateNext = useCallback(() => {
        if (currentIndex < images.length - 1) {
            setDirection(1);
            setCurrentIndex(prev => prev + 1);
        }
    }, [currentIndex, images.length]);

    const navigatePrev = useCallback(() => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
        const swipeThreshold = 50;
        const velocityThreshold = 300;

        if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
            navigateNext();
        } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
            navigatePrev();
        }
    };

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
    };

    const currentImage = images[currentIndex] || images[0];

    return (
        <AnimatePresence>
            {isOpen && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: 'rgba(10, 10, 35, 0.4)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        touchAction: 'none',
                    }}
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            zIndex: 10,
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                        aria-label="Close lightbox"
                    >
                        <X size={22} />
                    </button>

                    {/* Image Counter */}
                    <div style={{
                        position: 'absolute',
                        top: '1.25rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        zIndex: 10,
                    }}>
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Desktop Nav Arrows */}
                    {currentIndex > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
                            className="hidden md:flex"
                            style={{
                                position: 'absolute',
                                left: '1.5rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: '#fff',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    {currentIndex < images.length - 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); navigateNext(); }}
                            className="hidden md:flex"
                            style={{
                                position: 'absolute',
                                right: '1.5rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: '#fff',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                            aria-label="Next image"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}

                    {/* Swipeable Image Container */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '90%',
                            maxWidth: '700px',
                            maxHeight: '85vh',
                            aspectRatio: '1/1',
                            overflow: 'hidden',
                            borderRadius: '1.5rem',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <AnimatePresence mode="wait" custom={direction}>
                            <m.div
                                key={currentImage.id}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.15}
                                onDragEnd={handleDragEnd}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'grab',
                                    touchAction: 'pan-y',
                                }}
                                whileDrag={{ cursor: 'grabbing' }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={currentImage.image_url}
                                    alt={`Product view ${currentIndex + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        userSelect: 'none',
                                        pointerEvents: 'none',
                                    }}
                                    draggable={false}
                                />
                            </m.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Dot Indicators */}
                    {images.length > 1 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '1.5rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '0.5rem',
                            zIndex: 10,
                        }}>
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDirection(i > currentIndex ? 1 : -1);
                                        setCurrentIndex(i);
                                    }}
                                    style={{
                                        width: i === currentIndex ? '24px' : '8px',
                                        height: '8px',
                                        borderRadius: '999px',
                                        background: i === currentIndex ? '#00b4d8' : 'rgba(255,255,255,0.4)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        padding: 0,
                                    }}
                                    aria-label={`Go to image ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </m.div>
            )}
        </AnimatePresence>
    );
}
