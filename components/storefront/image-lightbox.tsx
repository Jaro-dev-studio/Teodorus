"use client";

import * as React from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  productTitle = "Product",
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [isDoubleTapped, setIsDoubleTapped] = React.useState(false);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const lastTapRef = React.useRef(0);
  const initialTouchDistanceRef = React.useRef(0);
  const initialScaleRef = React.useRef(1);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const positionStartRef = React.useRef({ x: 0, y: 0 });
  const velocityRef = React.useRef({ x: 0, y: 0 });
  const lastPositionRef = React.useRef({ x: 0, y: 0 });
  const lastTimeRef = React.useRef(0);

  // Reset state when opening
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsDoubleTapped(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        navigatePrev();
      } else if (e.key === "ArrowRight") {
        navigateNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  const navigateNext = () => {
    if (scale > 1) return; // Don't navigate while zoomed
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const navigatePrev = () => {
    if (scale > 1) return; // Don't navigate while zoomed
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Double tap to zoom
  const handleDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    
    if (timeDiff < 300 && timeDiff > 0) {
      // Double tap detected
      e.preventDefault();
      
      if (scale > 1) {
        // Zoom out
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setIsDoubleTapped(false);
      } else {
        // Zoom in to where user tapped
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const clientX = "touches" in e ? e.touches[0]?.clientX || rect.width / 2 : e.clientX;
          const clientY = "touches" in e ? e.touches[0]?.clientY || rect.height / 2 : e.clientY;
          
          const x = (rect.width / 2 - clientX) * 1.5;
          const y = (rect.height / 2 - clientY) * 1.5;
          
          setScale(2.5);
          setPosition({ x, y });
          setIsDoubleTapped(true);
        }
      }
    }
    
    lastTapRef.current = now;
  };

  // Pinch to zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const distance = getTouchDistance(e.touches);
      initialTouchDistanceRef.current = distance;
      initialScaleRef.current = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan start
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      positionStartRef.current = position;
      lastPositionRef.current = position;
      lastTimeRef.current = Date.now();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const newScale = Math.min(Math.max(initialScaleRef.current * (distance / initialTouchDistanceRef.current), 1), 4);
      setScale(newScale);
      
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Pan
      const deltaX = e.touches[0].clientX - dragStartRef.current.x;
      const deltaY = e.touches[0].clientY - dragStartRef.current.y;
      
      const newX = positionStartRef.current.x + deltaX;
      const newY = positionStartRef.current.y + deltaY;
      
      // Calculate bounds
      const maxX = (scale - 1) * 150;
      const maxY = (scale - 1) * 200;
      
      const boundedX = Math.min(Math.max(newX, -maxX), maxX);
      const boundedY = Math.min(Math.max(newY, -maxY), maxY);
      
      // Track velocity
      const now = Date.now();
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        velocityRef.current = {
          x: (boundedX - lastPositionRef.current.x) / dt,
          y: (boundedY - lastPositionRef.current.y) / dt,
        };
      }
      lastPositionRef.current = { x: boundedX, y: boundedY };
      lastTimeRef.current = now;
      
      setPosition({ x: boundedX, y: boundedY });
    } else if (e.touches.length === 1 && scale <= 1) {
      // Check for vertical swipe to close
      const startY = dragStartRef.current.y || e.touches[0].clientY;
      const deltaY = e.touches[0].clientY - startY;
      
      if (!dragStartRef.current.y) {
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      
      if (Math.abs(deltaY) > 100) {
        onClose();
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragStartRef.current = { x: 0, y: 0 };
  };

  // Mouse wheel zoom (desktop)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.3 : 0.3;
    const newScale = Math.min(Math.max(scale + delta, 1), 4);
    setScale(newScale);
    
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Get distance between two touches
  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Swipe navigation for desktop
  const handleDrag = (
    _: unknown,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    if (scale > 1) return;
    
    // Horizontal swipe for navigation
    if (Math.abs(info.velocity.x) > 500 || Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        navigatePrev();
      } else {
        navigateNext();
      }
    }
    
    // Vertical swipe to close
    if (Math.abs(info.velocity.y) > 500 || Math.abs(info.offset.y) > 100) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scale <= 1 && onClose()}
          />

          {/* Close button */}
          <motion.button
            className="absolute top-4 right-4 z-10 h-11 w-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            aria-label="Close preview"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Image counter */}
          {images.length > 1 && (
            <motion.div
              className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.1 }}
            >
              {currentIndex + 1} / {images.length}
            </motion.div>
          )}

          {/* Zoom indicator */}
          <AnimatePresence>
            {scale > 1 && (
              <motion.div
                className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {Math.round(scale * 100)}%
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation arrows (desktop) */}
          {images.length > 1 && scale <= 1 && (
            <>
              <motion.button
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                onClick={navigatePrev}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.15 }}
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <motion.button
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                onClick={navigateNext}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.15 }}
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </>
          )}

          {/* Main image container */}
          <motion.div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleDoubleTap}
            onDoubleClick={handleDoubleTap}
            onWheel={handleWheel}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                ref={imageRef}
                className="relative w-full h-full flex items-center justify-center select-none"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: scale,
                  x: position.x,
                  y: position.y,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  opacity: { duration: 0.2 }
                }}
                drag={scale <= 1}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDrag}
              >
                <img
                  src={images[currentIndex]}
                  alt={`${productTitle} - Image ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain pointer-events-none"
                  style={{
                    maxHeight: "90vh",
                    maxWidth: "90vw",
                  }}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Thumbnail strip (bottom) */}
          {images.length > 1 && (
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-3 py-2 rounded-2xl bg-black/40 backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.15 }}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                    setCurrentIndex(index);
                  }}
                  className={cn(
                    "relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200",
                    currentIndex === index
                      ? "border-white scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </motion.div>
          )}

          {/* Gesture hints (mobile) */}
          {scale <= 1 && (
            <motion.div
              className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-10 text-white/60 text-xs text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p>Double-tap or pinch to zoom</p>
              <p className="mt-1">Swipe down to close</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

