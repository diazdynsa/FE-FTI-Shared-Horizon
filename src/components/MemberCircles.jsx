import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import MemberDetailModal from './MemberDetailModal';

/**
 * Single member polaroid slot — clicking opens zoom modal
 */
export function MemberSlot({ member, onClick, rotate = 0, yOffset = 0 }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, scale: 0.7, rotate: rotate * 1.8 }}
      animate={{ opacity: 1, scale: 1, rotate: rotate }}
      style={{ y: yOffset }}
      whileHover={{ rotate: 0, y: 0, scale: 1.06, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      {/* Polaroid frame button */}
      <button
        onClick={onClick}
        className="bg-white group relative cursor-pointer"
        style={{
          padding: '4px 4px 16px 4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.07)',
        }}
        aria-label={`Buka profil ${member.name || `Crew #${member.id}`}`}
      >
        {/* Photo area */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-zinc-100 overflow-hidden flex items-center justify-center">
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name || 'Anggota'}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-300">
              <Camera size={18} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/[0.05] opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1">
          <span className="font-handwritten text-[10px] text-zinc-500">zoom</span>
        </div>
      </button>

      {/* Name label */}
      <button
        onClick={onClick}
        className="font-handwritten text-xs text-zinc-500 hover:text-zinc-700 transition-colors truncate max-w-[72px] cursor-pointer"
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
