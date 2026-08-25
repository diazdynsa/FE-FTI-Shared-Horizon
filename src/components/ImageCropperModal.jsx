import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ZoomIn, ZoomOut, RotateCw, RefreshCw, Move } from 'lucide-react';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 20,
    transition: { duration: 0.15 },
  },
};

export default function ImageCropperModal({ isOpen, imageFile, onClose, onCropComplete }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Load image file into ObjectURL
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageSrc(url);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageSrc(null);
    }
  }, [imageFile]);

  // Pointer drag events for panning
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.8), 3.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  };

  // Perform crop on canvas and return a new File
  const handleConfirmCrop = async () => {
    if (!imgRef.current || !containerRef.current) return;
    setIsProcessing(true);

    try {
      const img = imgRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      const outputSize = 720; // Crisp 1:1 square output
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');

      // Fill canvas background
      ctx.fillStyle = '#f4f1ea';
      ctx.fillRect(0, 0, outputSize, outputSize);

      ctx.save();
      // Move to center of canvas
      ctx.translate(outputSize / 2, outputSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Scale ratio between canvas and on-screen crop box
      const scaleMultiplier = outputSize / containerRect.width;
      
      // Calculate drawn image dimensions based on natural aspect ratio
      const naturalAspect = img.naturalWidth / img.naturalHeight;
      let drawWidth, drawHeight;
      
      if (naturalAspect >= 1) {
        drawHeight = containerRect.height * zoom * scaleMultiplier;
        drawWidth = drawHeight * naturalAspect;
      } else {
        drawWidth = containerRect.width * zoom * scaleMultiplier;
        drawHeight = drawWidth / naturalAspect;
      }

      // Pan offset scaled to canvas
      const scaledPanX = pan.x * scaleMultiplier;
      const scaledPanY = pan.y * scaleMultiplier;

      // Adjust pan coordinates depending on rotation
      let rotatedPanX = scaledPanX;
      let rotatedPanY = scaledPanY;
      if (rotation === 90) {
        rotatedPanX = scaledPanY;
        rotatedPanY = -scaledPanX;
      } else if (rotation === 180) {
        rotatedPanX = -scaledPanX;
        rotatedPanY = -scaledPanY;
      } else if (rotation === 270) {
        rotatedPanX = -scaledPanY;
        rotatedPanY = scaledPanX;
      }

      ctx.drawImage(
        img,
        -drawWidth / 2 + rotatedPanX,
        -drawHeight / 2 + rotatedPanY,
        drawWidth,
        drawHeight
      );

      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          const croppedFile = new File([blob], imageFile.name || 'member-crop.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          onCropComplete(croppedFile);
          setIsProcessing(false);
          onClose();
        },
        'image/jpeg',
        0.92
      );
    } catch (err) {
      console.error('Failed to crop image:', err);
      setIsProcessing(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && imageSrc && (
        <motion.div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xs"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="relative flex flex-col items-center max-w-sm w-full bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-zinc-200"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-handwritten text-xl font-bold text-zinc-800">
                Sesuaikan & Potong Foto
              </h3>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <X size={15} />
              </button>
            </div>

            {/* Hint */}
            <p className="text-[11px] text-zinc-500 mt-2 mb-3 flex items-center gap-1 font-handwritten">
              <Move size={12} className="text-zinc-400" /> Geser & atur zoom agar wajah pas di dalam bingkai
            </p>

            {/* ── 1:1 Crop Viewport Box ── */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onWheel={handleWheel}
              className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-xl overflow-hidden bg-zinc-900 cursor-grab active:cursor-grabbing select-none touch-none flex items-center justify-center shadow-inner border-2 border-dashed border-amber-400/80"
            >
              {/* Image element */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                }}
                className="max-w-none max-h-none pointer-events-none object-contain select-none"
              />

              {/* 3x3 Grid Guidelines Overlay */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/25" />
                <div className="border-r border-b border-white/25" />
                <div className="border-b border-white/25" />
                <div className="border-r border-b border-white/25" />
                <div className="border-r border-b border-white/25" />
                <div className="border-b border-white/25" />
                <div className="border-r border-white/25" />
                <div className="border-r border-white/25" />
                <div />
              </div>

              {/* Corner markers */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400 pointer-events-none" />
            </div>

            {/* ── Zoom Slider & Controls ── */}
            <div className="w-full mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.8))}
                  className="p-1 text-zinc-500 hover:text-zinc-800"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <input
                  type="range"
                  min="0.8"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-zinc-800 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(prev + 0.15, 3))}
                  className="p-1 text-zinc-500 hover:text-zinc-800"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              {/* Extra Tools: Rotate & Reset */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="px-2.5 py-1 text-xs font-handwritten text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center gap-1 transition-colors"
                  title="Putar 90°"
                >
                  <RotateCw size={13} />
                  <span>Putar 90°</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 text-xs font-handwritten text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center gap-1 transition-colors"
                  title="Reset Posisi"
                >
                  <RefreshCw size={12} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="w-full flex items-center gap-2 mt-4 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-2 rounded-xl border border-zinc-200 font-handwritten text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmCrop}
                disabled={isProcessing}
                className="flex-1 py-2 rounded-xl bg-zinc-800 text-white font-handwritten text-sm font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-zinc-700 transition-all active:scale-95 disabled:opacity-50"
              >
                <Check size={16} />
                <span>{isProcessing ? 'Menyimpan...' : 'Gunakan Foto'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
