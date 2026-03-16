'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import type { ProductImage } from '@/types';
import Lightbox from './Lightbox';

interface ImageGalleryProps {
    images: ProductImage[];
    activeIndex?: number;
    onIndexChange?: (index: number) => void;
    showThumbnails?: boolean;
}

export default function ImageGallery({
    images,
    activeIndex,
    onIndexChange,
    showThumbnails = true
}: ImageGalleryProps) {
    const [internalIndex, setInternalIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const selectedIndex = activeIndex !== undefined ? activeIndex : internalIndex;
    const setSelectedIndex = (index: number) => {
        if (onIndexChange) {
            onIndexChange(index);
        } else {
            setInternalIndex(index);
        }
    };

    const displayImages = images.length > 0
        ? images
        : [{ id: 'placeholder', image_url: 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=800&q=80', display_order: 0, product_id: '', variant_id: null }];

    const currentImage = displayImages[selectedIndex] || displayImages[0];

    const navigateNext = () => {
        if (selectedIndex < displayImages.length - 1) {
            setDirection(1);
            setSelectedIndex(selectedIndex + 1);
        }
    };

    const navigatePrev = () => {
        if (selectedIndex > 0) {
            setDirection(-1);
            setSelectedIndex(selectedIndex - 1);
        }
    };

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
        enter: (dir: number) => ({ x: dir > 0 ? '30%' : '-30%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? '-30%' : '30%', opacity: 0 }),
    };

    return (
        <>
            <div className="flex flex-col-reverse md:flex-row gap-4">
                {/* Thumbnails */}
                {showThumbnails && (
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-2 md:pb-0 md:pr-2">
                        {displayImages.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={() => {
                                    setDirection(index > selectedIndex ? 1 : -1);
                                    setSelectedIndex(index);
                                }}
                                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedIndex === index
                                        ? 'border-cyan shadow-md shadow-cyan/20'
                                        : 'border-border-light hover:border-navy/20'
                                    }`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img.image_url}
                                    alt={`View ${index + 1}`}
                                    className="object-cover"
                                    style={{ position: 'absolute', width: '100%', height: '100%', inset: 0, objectFit: 'cover' }}
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Image with Swipe & Click-to-Zoom */}
                <div
                    className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-cream-dark"
                    style={{ touchAction: 'pan-y' }}
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
                            className="absolute inset-0"
                            style={{ cursor: 'grab', touchAction: 'pan-y' }}
                            whileDrag={{ cursor: 'grabbing' }}
                            onClick={() => setIsLightboxOpen(true)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={currentImage.image_url}
                                alt="Product image"
                                className="object-cover"
                                style={{ position: 'absolute', width: '100%', height: '100%', inset: 0, objectFit: 'cover', userSelect: 'none', pointerEvents: 'none' }}
                                draggable={false}
                            />
                        </m.div>
                    </AnimatePresence>

                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-navy/60 backdrop-blur-sm text-white text-xs font-medium">
                        {selectedIndex + 1} / {displayImages.length}
                    </div>

                    {/* Tap to zoom hint */}
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-navy/60 backdrop-blur-sm text-white text-xs font-medium"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                        Tap to zoom
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                images={displayImages}
                initialIndex={selectedIndex}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
            />
        </>
    );
}
