import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Toast({ message, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-5 left-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg"
          style={{ background: 'linear-gradient(135deg, #4a3f35, #2f261e)', color: '#fff' }}
          initial={{ opacity: 0, y: -30, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          role="status"
          aria-live="polite"
        >
          <Check size={16} className="text-green-300" />
          <span className="font-handwritten text-base">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
