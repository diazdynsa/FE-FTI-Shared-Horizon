import { supabase } from './supabase';
import { defaultCategories, defaultMembers } from '../data/memories';

/**
 * Fetch all categories from Supabase (or fallback to defaults if table is empty/new)
 */
export async function apiFetchCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      return data;
    }
    // If table exists but empty, initialize defaults
    await apiSaveCategories(defaultCategories);
    return defaultCategories;
  } catch (err) {
    console.warn('Using local categories fallback:', err.message);
    return defaultCategories;
  }
}

/**
 * Save / replace categories list
 */
export async function apiSaveCategories(categories) {
  try {
    // Upsert all categories
    const rows = categories.map((cat, idx) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || '·',
      created_at: new Date(Date.now() + idx * 1000).toISOString(),
    }));

    const { error } = await supabase.from('categories').upsert(rows);
    if (error) throw error;
  } catch (err) {
    console.warn('Failed to persist categories to Supabase:', err.message);
  }
}

/**
 * Fetch 9 members from Supabase (or fallback/initialize defaults)
 */
export async function apiFetchMembers() {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      // Map db column names (photo_url -> photoUrl)
      return defaultMembers.map((def) => {
        const found = data.find((d) => d.id === def.id);
        return found
          ? { id: found.id, name: found.name || '', photoUrl: found.photo_url || null }
          : def;
      });
    }
    return defaultMembers;
  } catch (err) {
    console.warn('Using local members fallback:', err.message);
    return defaultMembers;
  }
}

/**
 * Update a single member
 */
export async function apiUpdateMember(member) {
  try {
    const { error } = await supabase.from('members').upsert({
      id: member.id,
      name: member.name || '',
      photo_url: member.photoUrl || null,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  } catch (err) {
    console.warn('Failed to update member in Supabase:', err.message);
  }
}

/**
 * Fetch all memories with their comments
 */
export async function apiFetchMemories() {
  try {
    const { data: memData, error: memError } = await supabase
      .from('memories')
      .select(`
        id,
        type,
        media_url,
        title,
        category_id,
        upload_date,
        created_at,
        comments (
          id,
          author,
          text,
          color,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (memError) throw memError;

    return (memData || []).map((m) => ({
      id: m.id,
      type: m.type,
      mediaUrl: m.media_url,
      title: m.title,
      categoryId: m.category_id,
      uploadDate: m.upload_date,
      comments: (m.comments || []).sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      ),
    }));
  } catch (err) {
    console.warn('Failed to fetch memories from Supabase:', err.message);
    return [];
  }
}

/**
 * Create a new memory
 */
export async function apiCreateMemory(memory) {
  try {
    const { error } = await supabase.from('memories').insert({
      id: memory.id,
      type: memory.type,
      media_url: memory.mediaUrl,
      title: memory.title,
      category_id: memory.categoryId || null,
      upload_date: memory.uploadDate,
    });
    if (error) throw error;
  } catch (err) {
    console.warn('Failed to insert memory in Supabase:', err.message);
  }
}

/**
 * Update memory title and category
 */
export async function apiUpdateMemory(memory) {
  try {
    const { error } = await supabase
      .from('memories')
      .update({
        title: memory.title,
        category_id: memory.categoryId || null,
      })
      .eq('id', memory.id);
    if (error) throw error;
  } catch (err) {
    console.warn('Failed to update memory in Supabase:', err.message);
  }
}

/**
 * Delete a memory
 */
export async function apiDeleteMemory(id) {
  try {
    const { error } = await supabase.from('memories').delete().eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.warn('Failed to delete memory in Supabase:', err.message);
  }
}

/**
 * Add a comment to a memory
 */
export async function apiAddComment(memoryId, comment) {
  try {
    const { error } = await supabase.from('comments').insert({
      id: comment.id,
      memory_id: memoryId,
      author: comment.author || 'Anonim',
      text: comment.text,
      color: comment.color || 'yellow',
    });
    if (error) throw error;
  } catch (err) {
    console.warn('Failed to insert comment in Supabase:', err.message);
  }
}
