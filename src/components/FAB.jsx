import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FAB({ onClick }) {
  return (
    <motion.button
      id="fab-add-moment"
      className="fab fixed bottom-6 right-5 z-40 w-14 h-14 rounded-full text-white flex items-center justify-center"
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
      aria-label="Tambah momen baru"
    >
      <Plus size={26} strokeWidth={2.5} />

      {/* Ripple ring */}
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-zinc-600/40"
        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
    </motion.button>
  );
}
