import { createClient } from '@supabase/supabase-js';
import { compressImage } from './imageCompressor';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://skrunkzczfvdgaageqri.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QMkrAFNmleCbSKA446Sq1A_5fGU9CD9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file (photo or video) to Supabase Storage bucket 'fetish-media'.
 * Automatically compresses high-resolution photos before upload to save bandwidth & mobile memory!
 * Returns the public URL string.
 */
export async function uploadMediaFile(file, folder = 'memories') {
  try {
    // Compress image if it's a photo
    let fileToUpload = file;
    if (file.type && file.type.startsWith('image/')) {
      fileToUpload = await compressImage(file);
    }

    const ext = fileToUpload.name ? fileToUpload.name.split('.').pop() : 'jpg';
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('fetish-media')
      .upload(filename, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return URL.createObjectURL(fileToUpload);
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
