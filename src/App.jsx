import { useState, useCallback, useMemo, useEffect } from 'react';
import Hero from './components/Hero';
import FilterTabs from './components/FilterTabs';
import TimelineFeed from './components/TimelineFeed';
import UploadModal from './components/UploadModal';
import EditModal from './components/EditModal';
import CategoryEditor from './components/CategoryEditor';
import RibbonBookmark from './components/RibbonBookmark';
import BookDecoration from './components/BookDecoration';
import FAB from './components/FAB';
import Toast from './components/Toast';
import { initialMemories, defaultCategories, defaultMembers } from './data/memories';
import { supabase } from './lib/supabase';
import {
  apiFetchCategories,
  apiSaveCategories,
  apiFetchMembers,
  apiUpdateMember,
  apiFetchMemories,
  apiCreateMemory,
  apiUpdateMemory,
  apiDeleteMemory,
  apiAddComment,
} from './lib/api';

export default function App() {
  const [memories, setMemories] = useState(initialMemories);
  const [categories, setCategories] = useState(defaultCategories);
  const [members, setMembers] = useState(defaultMembers);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCategoryEditorOpen, setIsCategoryEditorOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }, []);

  // ── Initial Load from Supabase ──
  const refreshAllData = useCallback(async () => {
    try {
      const [cats, mems, photos] = await Promise.all([
        apiFetchCategories(),
        apiFetchMembers(),
        apiFetchMemories(),
      ]);
      if (cats && cats.length > 0) setCategories(cats);
      if (mems && mems.length > 0) setMembers(mems);
      setMemories(photos || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();

    // ── Supabase Realtime Sync ──
    const channel = supabase
      .channel('public-db-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Realtime DB update received:', payload);
          refreshAllData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshAllData]);

  // ── Members ──
  const handleUpdateMember = useCallback(async (updated) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    await apiUpdateMember(updated);
  }, []);

  // ── Categories ──
  const handleSaveCategories = useCallback(async (updated) => {
    setCategories(updated);
    if (!updated.find((c) => c.id === activeFilter)) {
      setActiveFilter('all');
    }
    await apiSaveCategories(updated);
    showToast('Kategori disimpan');
  }, [activeFilter, showToast]);

  // ── Upload ──
  const handleUpload = useCallback(async (newMemory) => {
    setMemories((prev) => [{ ...newMemory, comments: [] }, ...prev]);
    showToast('Momen berhasil disimpan');
    await apiCreateMemory(newMemory);
  }, [showToast]);

  // ── Edit ──
  const handleEdit = useCallback((memory) => setEditTarget(memory), []);

  const handleSaveEdit = useCallback(async (updated) => {
    setMemories((prev) => prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)));
    setEditTarget(null);
    showToast('Kenangan diperbarui');
    await apiUpdateMemory(updated);
  }, [showToast]);

  // ── Delete ──
  const handleDelete = useCallback(async (id) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setEditTarget(null);
    showToast('Kenangan dihapus');
    await apiDeleteMemory(id);
  }, [showToast]);

  // ── Comment ──
  const handleAddComment = useCallback(async (memoryId, comment) => {
    setMemories((prev) =>
      prev.map((m) =>
        m.id === memoryId
          ? { ...m, comments: [...(m.comments || []), comment] }
          : m
      )
    );
    await apiAddComment(memoryId, comment);
  }, []);

  // ── Filter ──
  const filteredMemories = useMemo(() => {
    if (activeFilter === 'all') return memories;
    return memories.filter((m) => m.categoryId === activeFilter);
  }, [memories, activeFilter]);

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--paper-bg)' }}>
      <Toast message={toast.message} isVisible={toast.visible} />

      {/* ── Ribbon Bookmark (Top Right) ── */}
      <RibbonBookmark />

      {/* ── Book Spine & Subtle Journal Details ── */}
      <BookDecoration />

      <main className="mx-auto pb-24 relative z-10" style={{ maxWidth: '1400px' }}>
        <Hero
          members={members}
          onUpdateMember={handleUpdateMember}
          onOpenCategoryEditor={() => setIsCategoryEditorOpen(true)}
        />
        <FilterTabs
          categories={categories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onOpenEditor={() => setIsCategoryEditorOpen(true)}
        />
        <TimelineFeed
          memories={filteredMemories}
          activeFilter={activeFilter}
          categories={categories}
          onEdit={handleEdit}
          onAddComment={handleAddComment}
        />
      </main>

      <FAB onClick={() => setIsUploadOpen(true)} />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUpload}
        categories={categories}
      />

      <EditModal
        memory={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
        categories={categories}
      />

      <CategoryEditor
        isOpen={isCategoryEditorOpen}
        onClose={() => setIsCategoryEditorOpen(false)}
        categories={categories}
        onSave={handleSaveCategories}
      />
    </div>
  );
}
