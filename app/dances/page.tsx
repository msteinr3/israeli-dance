import Link from "next/link";
import type { Markid } from "@/data/markidim";
import type { Dance } from "@/data/dances";
import { commonStyles } from "@/styles/common";
import { supabase } from "@/lib/supabase";
import DanceSearch from "@/components/DanceSearch";

export default async function DancesPage() {
  const [
    { data: dbDances, error: dancesError },
    { data: dbMarkidim, error: markidimError },
    { data: dbDanceMarkidim, error: relationshipsError },
  ] = await Promise.all([
    supabase.from("dances").select("*"),
    supabase.from("markidim").select("id, name, name_hebrew"),
    supabase.from("dance_markidim").select("dance_id, markid_id, is_main"),
  ]);

  if (dancesError) {
    throw new Error(dancesError.message);
  }

  if (markidimError) {
    throw new Error(markidimError.message);
  }

  if (relationshipsError) {
    throw new Error(relationshipsError.message);
  }

  const markidim: Markid[] = (dbMarkidim ?? []).map((markid) => ({
    id: markid.id,
    name: markid.name,
    nameHebrew: markid.name_hebrew ?? "",
  }));

  const dances: Dance[] = (dbDances ?? []).map((dance) => {
    const relationships = (dbDanceMarkidim ?? []).filter(
      (relationship) => relationship.dance_id === dance.id,
    );

    const mainMarkid = relationships.find(
      (relationship) => relationship.is_main,
    );

    return {
      id: dance.id,
      danceName: dance.dance_name,
      danceNameHebrew: dance.dance_name_hebrew ?? "",
      songName: dance.song_name ?? "",
      songNameHebrew: dance.song_name_hebrew ?? "",
      shortMp3: dance.short_mp3 ?? "",
      longMp3: dance.long_mp3 ?? "",
      mainMarkidId: mainMarkid?.markid_id ?? "",
      additionalMarkidIds: relationships
        .filter((relationship) => !relationship.is_main)
        .map((relationship) => relationship.markid_id),
      year: dance.year ?? 0,
      type: dance.type,
      youtubeVideos: dance.youtube_videos ?? [],
      notes: dance.notes ?? "",
    };
  });

  return (
    <main style={commonStyles.page}>
      <div style={commonStyles.container}>
        <div style={commonStyles.pageHeader}>
          <h1>Dances</h1>

          <Link href="/submit?type=dance" style={commonStyles.button}>
            Add New Dance
          </Link>
        </div>

        <DanceSearch dances={dances} markidim={markidim} />
      </div>
    </main>
  );
}
