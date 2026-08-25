import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import MemberDetailModal from './MemberDetailModal';

/**
 * Single member polaroid slot
 * Fully responsive, no horizontal scrollbars, clear photo and large readable name
 */
export function MemberSlot({ member, onClick, rotate = 0, yOffset = 0, maxWidthClass = 'max-w-[82px] sm:max-w-[104px]' }) {
  return (
    <motion.div
      className={`flex flex-col items-center flex-1 ${maxWidthClass} min-w-0`}
      initial={{ opacity: 0, scale: 0.75, rotate: rotate * 1.6 }}
      animate={{ opacity: 1, scale: 1, rotate: rotate }}
      style={{ y: yOffset }}
      whileHover={{ rotate: 0, y: -3, scale: 1.08, zIndex: 20 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
    >
      {/* Polaroid frame button */}
      <button
        onClick={onClick}
        className="w-full bg-white group relative cursor-pointer rounded-[2px] transition-transform flex flex-col items-center p-1 sm:p-1.5 pb-2.5 sm:pb-3.5"
        style={{
          boxShadow: '0 3px 10px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
        }}
        aria-label={`Buka profil ${member.name || `Crew #${member.id}`}`}
      >
        {/* Photo area - 1:1 Aspect ratio, fills width cleanly */}
        <div className="w-full aspect-square bg-zinc-100 overflow-hidden flex items-center justify-center border border-zinc-200/50">
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name || 'Anggota'}
              className="w-full h-full object-cover pointer-events-none"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 gap-0.5 bg-zinc-50/80">
              <Camera size={18} strokeWidth={1.5} className="sm:w-5 sm:h-5 text-zinc-400" />
              <span className="text-[8px] sm:text-[10px] font-handwritten text-zinc-400">kosong</span>
            </div>
          )}
        </div>

        {/* Subtle hover zoom overlay */}
        <div className="absolute inset-0 bg-black/[0.06] opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-0.5 pointer-events-none">
          <span className="font-handwritten text-[10px] sm:text-xs font-bold text-zinc-700">zoom</span>
        </div>
      </button>

      {/* Name label - Bold, clear, and readable */}
      <button
        onClick={onClick}
        className="font-handwritten text-sm sm:text-base md:text-lg font-bold text-zinc-700 hover:text-zinc-950 transition-colors leading-tight text-center mt-1 w-full px-0.5 break-words line-clamp-2 cursor-pointer"
        title="Klik untuk lihat / edit"
      >
        {member.name || '· · ·'}
      </button>
    </motion.div>
  );
}

export default function MemberCircles({ members, onUpdateMember }) {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <>
      <MemberDetailModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        onUpdateMember={async (updated) => {
          await onUpdateMember(updated);
          setSelectedMember(updated);
        }}
      />
    </>
  );
}
