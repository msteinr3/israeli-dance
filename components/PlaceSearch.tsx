"use client";

import { useState } from "react";
import type { Markid } from "@/types/markid";
import type { Place } from "@/types/place";
import { colors } from "@/styles/colors";
import { commonStyles } from "@/styles/common";

type Props = {
  places: Place[];
  markidim: Markid[];
};

export default function PlaceSearch({ places, markidim }: Props) {
  const [searchText, setSearchText] = useState("");

  const filteredPlaces = places.filter((place) => {
    const query = searchText.toLowerCase();

    const placeMarkidim = markidim.filter(
      (markid) =>
        markid.id === place.mainMarkidId ||
        place.additionalMarkidIds.includes(markid.id),
    );

    return (
      place.name.toLowerCase().includes(query) ||
      place.nameHebrew.includes(searchText) ||
      place.city.toLowerCase().includes(query) ||
      place.cityHebrew?.includes(searchText) ||
      place.type.toLowerCase().includes(query) ||
      place.when?.toLowerCase().includes(query) ||
      place.address?.toLowerCase().includes(query) ||
      place.notes?.toLowerCase().includes(query) ||
      placeMarkidim.some(
        (markid) =>
          markid.name.toLowerCase().includes(query) ||
          markid.nameHebrew.includes(searchText),
      )
    );
  });

  return (
    <>
      <input
        type="text"
        placeholder="Search events, cities, addresses, or Markidim..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        style={styles.search}
      />

      <div style={commonStyles.connectedList}>
        {filteredPlaces.map((place) => {
          const placeMarkidim = markidim.filter(
            (markid) =>
              markid.id === place.mainMarkidId ||
              place.additionalMarkidIds.includes(markid.id),
          );

          const mapQuery = [place.address, place.city, place.cityHebrew]
            .filter(Boolean)
            .join(", ");

          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            mapQuery,
          )}`;

          return (
            <details key={place.id} style={commonStyles.connectedListItem}>
              <summary style={commonStyles.connectedListSummary}>
                <span>{place.name}</span>

                <span style={styles.hebrew} dir="rtl">
                  {place.nameHebrew}
                </span>
              </summary>

              <div style={commonStyles.connectedListDetails}>
                <p>
                  <strong>Type:</strong> {place.type}
                </p>

                {place.when && (
                  <p>
                    <strong>When:</strong> {place.when}
                  </p>
                )}

                <p>
                  <strong>City:</strong> {place.city}
                </p>

                {place.cityHebrew && (
                  <p dir="rtl">
                    <strong>עיר:</strong> {place.cityHebrew}
                  </p>
                )}

                {place.address && (
                  <p>
                    <strong>Address:</strong> {place.address}
                  </p>
                )}

                {mapQuery && (
                  <p>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                      Open in Google Maps
                    </a>
                  </p>
                )}

                {placeMarkidim.length > 0 && (
                  <p>
                    <strong>Main Markid:</strong>{" "}
                    {placeMarkidim.find(
                      (markid) => markid.id === place.mainMarkidId,
                    )?.name ?? "Unknown"}
                  </p>
                )}

                {place.additionalMarkidIds.length > 0 && (
                  <p>
                    <strong>Additional Markidim:</strong>{" "}
                    {placeMarkidim
                      .filter((markid) => markid.id !== place.mainMarkidId)
                      .map((markid) => markid.name)
                      .join(", ")}
                  </p>
                )}

                {place.website && (
                  <p>
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </a>
                  </p>
                )}

                {place.notes && <p>{place.notes}</p>}
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
}

const styles = {
  search: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "24px",
    border: `1px solid ${colors.border}`,
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box" as const,
  },
  hebrew: {
    color: colors.mutedText,
    marginLeft: "20px",
  },
};
