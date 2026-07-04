import { getSupabaseClient } from "./supabase";

export interface RelaxBackground {
  id: string;
  labelVi: string;
  labelEn: string;
  imageUrl: string;
}

export interface RelaxTrack {
  id: string;
  labelVi: string;
  labelEn: string;
  youtubeId: string;
  icon: string | null;
}

/** Curated background images. Returns [] when Supabase isn't configured or the query fails. */
export async function getRelaxBackgrounds(): Promise<RelaxBackground[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("relax_backgrounds")
    .select("id, label_vi, label_en, image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    labelVi: row.label_vi,
    labelEn: row.label_en,
    imageUrl: row.image_url,
  }));
}

/** Curated YouTube tracks. Returns [] when Supabase isn't configured or the query fails. */
export async function getRelaxTracks(): Promise<RelaxTrack[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("relax_tracks")
    .select("id, label_vi, label_en, youtube_id, icon")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    labelVi: row.label_vi,
    labelEn: row.label_en,
    youtubeId: row.youtube_id,
    icon: row.icon,
  }));
}
