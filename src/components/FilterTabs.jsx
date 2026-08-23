import { motion } from 'framer-motion';
import { Settings2 } from 'lucide-react';

export default function FilterTabs({ categories, activeFilter, onFilterChange, onOpenEditor }) {
  const allTab = { id: 'all', name: 'Semua', icon: '·' };
  const tabs = [allTab, ...categories];

  return (
    <div
      id="filter-tabs"
      className="sticky top-0 z-30 py-3 px-4"
      style={{ background: 'linear-gradient(to bottom, var(--paper-bg) 85%, transparent)' }}
      role="tablist"
      aria-label="Filter kategori"
    >
      <div className="flex items-center gap-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
          {tabs.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <motion.button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onFilterChange(cat.id)}
                whileTap={{ scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`
                  relative flex-shrink-0 flex items-center gap-1.5
                  px-4 py-2 rounded-full font-handwritten text-sm
                  transition-colors duration-200 whitespace-nowrap
                  ${isActive
                    ? 'bg-zinc-800 text-white shadow-md'
                    : 'bg-white/70 text-zinc-600 border border-zinc-200 shadow-sm hover:bg-white'
                  }
                `}
              >
                {/* Icon — just a character, no emoji wrapper */}
                {cat.icon && (
                  <span className="text-base leading-none">{cat.icon}</span>
                )}
                <span>{cat.name}</span>

                {/* Active tape indicator */}
                {isActive && (
                  <motion.span
                    layoutId="active-tab-tape"
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-sm"
                    style={{ background: 'var(--tape-color)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Edit categories button — minimal icon */}
        <motion.button
          onClick={onOpenEditor}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/70 border border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
          title="Kelola kategori"
          aria-label="Kelola kategori"
        >
          <Settings2 size={14} />
        </motion.button>
      </div>
    </div>
  );
}
