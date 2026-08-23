// Default categories — users can add/rename/delete via CategoryEditor
export const defaultCategories = [
  { id: 'kebun-teh', name: 'Kebun Teh', icon: '☕' },
  { id: 'muncak', name: 'Muncak', icon: '▲' },
  { id: 'kampus', name: 'Kampus', icon: '✦' },
];

// Default member slots — 9 empty placeholders
export const defaultMembers = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: '',
  photoUrl: null,
}));

// Starts empty
export const initialMemories = [];

// Tape variant helpers
export const tapeVariants = [
  { className: 'tape tape-top', color: '' },
  { className: 'tape tape-corner-left', color: 'tape-blue' },
  { className: 'tape tape-top', color: 'tape-pink' },
  { className: 'tape tape-corner-right', color: '' },
  { className: 'tape tape-corner-left', color: 'tape-pink' },
  { className: 'tape tape-top', color: 'tape-blue' },
  { className: 'tape tape-corner-right', color: 'tape-green' },
  { className: 'tape tape-top', color: '' },
];

export const rotations = [-3, 2.5, -2, 3, -1.5, 2, -3.5, 1.5];

export const stickyColors = {
  yellow: 'sticky-note',
  pink: 'sticky-note sticky-note-pink',
  blue: 'sticky-note sticky-note-blue',
  green: 'sticky-note sticky-note-green',
};

export const colorCycle = ['yellow', 'pink', 'blue', 'green'];
export const stickyRotations = [-3, 2, -1.5, 3.5, -2.5, 1, -4, 2.5, -1, 3];

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};
