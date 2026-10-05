"use client";

import { useState } from "react";
import type { Markid } from "@/types/markid";
import type { Dance } from "@/types/dance";
import { colors } from "@/styles/colors";
import { commonStyles } from "@/styles/common";

type Props = {
  dances: Dance[];
  markidim: Markid[];
};

export default function DanceSearch({ dances, markidim }: Props) {
  const [searchText, setSearchText] = useState("");

  const filteredDances = dances.filter((dance) => {
    const query = searchText.toLowerCase();

    const danceMarkidim = markidim.filter(
      (markid) =>
        markid.id === dance.mainMarkidId ||
        dance.additionalMarkidIds.includes(markid.id),
    );

    return (
      dance.danceName.toLowerCase().includes(query) ||
      dance.danceNameHebrew.includes(searchText) ||
      dance.songName.toLowerCase().includes(query) ||
      dance.songNameHebrew.includes(searchText) ||
      danceMarkidim.some(
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
        placeholder="Search dances, songs, or markidim..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        style={styles.search}
      />

      <div style={commonStyles.connectedList}>
        {filteredDances.map((dance) => {
          const danceMarkidim = markidim.filter(
            (markid) =>
              markid.id === dance.mainMarkidId ||
              dance.additionalMarkidIds.includes(markid.id),
          );

          const mainMarkid = danceMarkidim.find(
            (markid) => markid.id === dance.mainMarkidId,
          );

          const additionalMarkidim = danceMarkidim.filter(
            (markid) => markid.id !== dance.mainMarkidId,
          );

          return (
            <details key={dance.id} style={commonStyles.connectedListItem}>
              <summary style={commonStyles.connectedListSummary}>
                <span>{dance.danceName}</span>

                <span style={styles.hebrew} dir="rtl">
                  {dance.danceNameHebrew}
                </span>
              </summary>

              <div style={commonStyles.connectedListDetails}>
                <p>
                  <strong>Song:</strong> {dance.songName}
                </p>

                <p dir="rtl">
                  <strong>Hebrew Song:</strong> {dance.songNameHebrew}
                </p>

                <p>
                  <strong>Main Markid:</strong> {mainMarkid?.name}
                </p>

                {mainMarkid?.nameHebrew && (
                  <p dir="rtl">
                    <strong>מרקיד ראשי:</strong> {mainMarkid.nameHebrew}
                  </p>
                )}

                {additionalMarkidim.length > 0 && (
                  <p>
                    <strong>Additional Markidim:</strong>{" "}
                    {additionalMarkidim.map((markid) => markid.name).join(", ")}
                  </p>
                )}

                <p>
                  <strong>Year:</strong> {dance.year}
                </p>

                <p>
                  <strong>Type:</strong> {dance.type}
                </p>

                <p>
                  <strong>Short Version (MP3):</strong> {dance.shortMp3}
                </p>

                <p>
                  <strong>Long Version (MP3):</strong> {dance.longMp3}
                </p>

                <p>
                  <strong>YouTube:</strong>{" "}
                  {dance.youtubeVideos.map((url) => (
                    <span key={url}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        Video
                      </a>{" "}
                    </span>
                  ))}
                </p>

                <p>{dance.notes}</p>
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
