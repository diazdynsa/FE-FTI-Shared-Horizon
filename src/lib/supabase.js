import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://skrunkzczfvdgaageqri.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QMkrAFNmleCbSKA446Sq1A_5fGU9CD9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file (photo or video) to Supabase Storage bucket 'fetish-media'.
 * Returns the public URL string.
 */
export async function uploadMediaFile(file, folder = 'memories') {
  try {
    const ext = file.name ? file.name.split('.').pop() : 'jpg';
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('fetish-media')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      // If upload failed (e.g. bucket doesn't exist yet), fallback to object URL
      return URL.createObjectURL(file);
    }

    const { data: publicUrlData } = supabase.storage
      .from('fetish-media')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload file:', err);
    return URL.createObjectURL(file);
  }
}
