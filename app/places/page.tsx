import Link from "next/link";
import type { Markid } from "@/data/markidim";
import type { Place } from "@/data/places";
import { commonStyles } from "@/styles/common";
import { supabase } from "@/lib/supabase";
import PlaceSearch from "@/components/PlaceSearch";

export default async function PlacesPage() {
  const [
    { data: dbPlaces, error: placesError },
    { data: dbMarkidim, error: markidimError },
    { data: dbEventMarkidim, error: relationshipsError },
  ] = await Promise.all([
    supabase.from("dance_events").select("*"),
    supabase.from("markidim").select("id, name, name_hebrew"),
    supabase.from("event_markidim").select("event_id, markid_id, is_main"),
  ]);

  if (placesError) {
    throw new Error(placesError.message);
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

  const places: Place[] = (dbPlaces ?? []).map((place) => {
    const relationships = (dbEventMarkidim ?? []).filter(
      (relationship) => relationship.event_id === place.id,
    );

    const mainMarkid = relationships.find(
      (relationship) => relationship.is_main,
    );

    return {
      id: place.id,
      name: place.name,
      nameHebrew: place.name_hebrew ?? "",
      type: place.type,
      when: place.when_text ?? "",
      city: place.city ?? "",
      cityHebrew: place.city_hebrew ?? "",
      address: place.address ?? "",
      mainMarkidId: mainMarkid?.markid_id ?? "",
      additionalMarkidIds: relationships
        .filter((relationship) => !relationship.is_main)
        .map((relationship) => relationship.markid_id),
      website: place.website ?? "",
      notes: place.notes ?? "",
    };
  });

  return (
    <main style={commonStyles.page}>
      <div style={commonStyles.container}>
        <div style={commonStyles.pageHeader}>
          <h1>Places to Dance</h1>

          <Link href="/submit?type=place" style={commonStyles.button}>
            Add New
          </Link>
        </div>

        <PlaceSearch places={places} markidim={markidim} />
      </div>
    </main>
  );
}
