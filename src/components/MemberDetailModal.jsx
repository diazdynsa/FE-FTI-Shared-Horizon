import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Trash2, Check, Loader, Pencil, Crop } from 'lucide-react';
import { uploadMediaFile } from '../lib/supabase';
import ImageCropperModal from './ImageCropperModal';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.72, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.75,
    y: 20,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

export default function MemberDetailModal({ member, isOpen, onClose, onUpdateMember }) {
  const [name, setName] = useState(member?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Crop state
  const [fileToCrop, setFileToCrop] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setIsEditingName(false);
      setIsUploading(false);
    }
  }, [member]);

  if (!member) return null;

  // 1. When user selects a file from disk, open Crop Modal first
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileToCrop(file);
    setIsCropperOpen(true);
    e.target.value = '';
  };

  // 2. When user confirms the crop in ImageCropperModal, upload cropped file
  const handleCropComplete = async (croppedFile) => {
    setIsCropperOpen(false);
    setFileToCrop(null);
    setIsUploading(true);

    try {
      const url = await uploadMediaFile(croppedFile, 'members');
      await onUpdateMember({ ...member, photoUrl: url });
    } catch (err) {
      console.error('Failed to upload member photo:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    await onUpdateMember({ ...member, photoUrl: null });
  };

  const handleSaveName = async () => {
    await onUpdateMember({ ...member, name: name.trim() });
    setIsEditingName(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className="relative flex flex-col items-center max-w-xs sm:max-w-sm w-full origin-center"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button at top right */}
              <button
                onClick={onClose}
                className="absolute -top-3 -right-3 z-30 w-8 h-8 rounded-full bg-zinc-800 text-white shadow-lg flex items-center justify-center hover:bg-zinc-700 transition-colors"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>

              {/* ── Large Polaroid Card (Scrapbook Style Zoom) ── */}
              <div
                className="bg-white rounded-sm p-3.5 pb-8 shadow-2xl relative w-full border border-zinc-200/60"
                style={{
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                }}
              >
                {/* Masking tape on top */}
                <div
                  className="tape tape-top tape-pink"
                  style={{ top: '-11px', left: '35%', width: '30%', zIndex: 10 }}
                />

                {/* Photo Frame */}
                <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden rounded-xs border border-zinc-200/40">
                  {isUploading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-zinc-50">
                      <Loader size={32} className="animate-spin text-zinc-500" />
                      <span className="font-handwritten text-sm text-zinc-500">
                        Mengunggah & memproses foto...
                      </span>
                    </div>
                  ) : member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name || `Crew #${member.id}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-200/50 cursor-pointer transition-colors p-4 text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-inner">
                        <Camera size={26} strokeWidth={1.5} className="text-zinc-400" />
                      </div>
                      <p className="font-handwritten text-base text-zinc-500">
                        Belum ada foto
                      </p>
                      <span className="text-[11px] text-zinc-400 underline">
                        Klik untuk pilih & potong foto
                      </span>
                    </div>
                  )}

                  {/* Slot index badge */}
                  <div className="absolute top-2 left-2">
                    <span className="date-stamp text-[10px]">
                      Crew #{member.id}
                    </span>
                  </div>
                </div>

                {/* Caption & Name area */}
                <div className="pt-4 text-center px-2">
                  {isEditingName ? (
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        placeholder="Tulis nama..."
                        maxLength={18}
                        autoFocus
                        className="text-center font-handwritten text-2xl font-bold text-zinc-800 bg-transparent border-b-2 border-dashed border-amber-400 outline-none px-1 w-full max-w-[200px]"
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-1.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors flex-shrink-0"
                        title="Simpan Nama"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsEditingName(true)}
                      className="group cursor-pointer inline-flex items-center justify-center gap-1.5"
                      title="Klik untuk edit nama"
                    >
                      <h3 className="font-handwritten text-2xl sm:text-3xl font-bold text-zinc-800 leading-tight">
                        {member.name || '(Belum ada nama)'}
                      </h3>
                      <Pencil
                        size={14}
                        className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )}
                  <p className="font-handwritten text-xs text-zinc-400 mt-1">
                    FE FTI Shared Horizon Crew
                  </p>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
              />

              {/* ── Action Buttons Bar ── */}
              <div className="flex items-center gap-2 mt-4 w-full">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 text-white font-handwritten text-base font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-zinc-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Crop size={16} />
                  <span>{member.photoUrl ? 'Ganti & Potong' : 'Pasang Foto'}</span>
                </button>

                {member.photoUrl && (
                  <button
                    onClick={handleRemovePhoto}
                    disabled={isUploading}
                    className="py-2.5 px-3 rounded-xl bg-white border border-red-200 text-red-500 font-handwritten text-base font-bold flex items-center justify-center gap-1 shadow-sm hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                    title="Hapus Foto"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Image Cropper Modal ── */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        imageFile={fileToCrop}
        onClose={() => {
          setIsCropperOpen(false);
          setFileToCrop(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}
