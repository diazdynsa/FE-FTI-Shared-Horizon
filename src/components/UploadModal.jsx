import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image, Film, Loader } from 'lucide-react';
import { uploadMediaFile } from '../lib/supabase';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.12, ease: 'easeIn' } },
};

export default function UploadModal({ isOpen, onClose, onSubmit, categories }) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const type = file.type.startsWith('video') ? 'video' : 'photo';
    const url = URL.createObjectURL(file);
    setFileInfo({ file, type });
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileInfo || !title.trim()) return;
    setIsSubmitting(true);

    // Upload to Supabase Cloud Storage
    const cloudMediaUrl = await uploadMediaFile(fileInfo.file, 'memories');

    await onSubmit({
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: fileInfo.type,
      mediaUrl: cloudMediaUrl,
      title: title.trim(),
      categoryId: categoryId || (categories[0]?.id ?? ''),
      uploadDate: new Date().toISOString().split('T')[0],
    });

    setTitle('');
    setCategoryId('');
    setFileInfo(null);
    setPreviewUrl(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setTitle('');
    setCategoryId('');
    setFileInfo(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Tambah Momen Baru"
        >
          <motion.div
            className="modal-paper rounded-2xl w-full max-w-sm p-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tape tape-top" style={{ position: 'absolute', top: '-11px', left: '30%', width: '40%' }} />

            <div className="flex items-center justify-between mb-5">
              <h2 className="font-handwritten text-2xl text-zinc-700 font-bold">Tambah Momen</h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* File upload zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative cursor-pointer border-2 border-dashed border-zinc-300 rounded-xl overflow-hidden bg-zinc-50 hover:bg-zinc-100 transition-colors"
                style={{ minHeight: '160px' }}
                role="button"
                aria-label="Pilih foto atau video"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {previewUrl ? (
                  <div className="absolute inset-0">
                    {fileInfo?.type === 'video' ? (
                      <video src={previewUrl} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                    ) : (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="font-handwritten text-white text-lg">Ganti</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 h-full py-8 text-zinc-400">
                    <div className="flex gap-2">
                      <Image size={22} strokeWidth={1.5} />
                      <Film size={22} strokeWidth={1.5} />
                    </div>
                    <p className="font-handwritten text-base">Pilih Foto / Video</p>
                    <p className="text-xs text-zinc-300">tap untuk browse</p>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <label htmlFor="upload-title" className="font-handwritten text-sm text-zinc-500">Caption</label>
                <input
                  id="upload-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ceritakan momennya..."
                  maxLength={60}
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 bg-white/70 text-zinc-700 font-handwritten text-lg placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-300/60 focus:border-amber-300 transition-all"
                />
              </div>

              {/* Category — only show if categories exist */}
              {categories.length > 0 && (
                <div className="flex flex-col gap-1">
                  <label htmlFor="upload-category" className="font-handwritten text-sm text-zinc-500">Kategori</label>
                  <select
                    id="upload-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 bg-white/70 text-zinc-700 font-handwritten text-base focus:outline-none focus:ring-2 focus:ring-amber-300/60 focus:border-amber-300 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Tanpa kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={!fileInfo || !title.trim() || isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl font-handwritten text-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #4a3f35, #2f261e)' }}
              >
                {isSubmitting ? (
                  <><Loader size={18} className="animate-spin" /> Mengunggah...</>
                ) : (
                  <><Upload size={18} /> Simpan</>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
