"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { danceTypes } from "@/data/dances";
import { danceEventTypes } from "@/data/places";
import { markidim } from "@/data/markidim";
import { colors } from "@/styles/colors";
import { commonStyles } from "@/styles/common";

export default function SubmitPage() {
  const searchParams = useSearchParams();
  const isDance = searchParams.get("type") === "dance";

  const [mainMarkidSelection, setMainMarkidSelection] = useState("");
  const [additionalMarkidIds, setAdditionalMarkidIds] = useState<string[]>([]);

  const addAdditionalMarkid = () => {
    setAdditionalMarkidIds((current) => [...current, ""]);
  };

  const updateAdditionalMarkid = (index: number, value: string) => {
    setAdditionalMarkidIds((current) =>
      current.map((markidId, i) => (i === index ? value : markidId)),
    );
  };

  const removeAdditionalMarkid = (index: number) => {
    setAdditionalMarkidIds((current) => current.filter((_, i) => i !== index));
  };

  const usedMarkidIds = [
    mainMarkidSelection,
    ...additionalMarkidIds.filter((id) => id && id !== "new"),
  ];

  const renderMarkidOptions = (currentSelection: string) =>
    markidim
      .filter(
        (markid) =>
          !usedMarkidIds.includes(markid.id) || markid.id === currentSelection,
      )
      .map((markid) => (
        <option key={markid.id} value={markid.id}>
          {markid.name}
        </option>
      ));

  return (
    <main style={commonStyles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          {isDance ? "Submit a Dance" : "Submit a Dance Event"}
        </h1>

        <p style={styles.subtitle}>
          Send us the information and we'll review it before adding it to the
          website.
        </p>

        <form
          action="https://api.web3forms.com/submit"
          method="POST"
          style={styles.form}
        >
          <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY" />

          <input
            type="hidden"
            name="submission_type"
            value={isDance ? "Dance" : "Dance Event"}
          />

          {isDance ? (
            <>
              <label style={styles.label}>
                Dance Name
                <input
                  type="text"
                  name="danceName"
                  required
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Hebrew Dance Name
                <input
                  type="text"
                  name="danceNameHebrew"
                  dir="rtl"
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Song Name
                <input type="text" name="songName" style={styles.input} />
              </label>

              <label style={styles.label}>
                Hebrew Song Name
                <input
                  type="text"
                  name="songNameHebrew"
                  dir="rtl"
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Short Version (MP3)
                <input type="url" name="shortMp3" style={styles.input} />
              </label>

              <label style={styles.label}>
                Long Version (MP3)
                <input type="url" name="longMp3" style={styles.input} />
              </label>

              <label style={styles.label}>
                Main Markid
                <select
                  name="mainMarkidId"
                  value={mainMarkidSelection}
                  onChange={(event) =>
                    setMainMarkidSelection(event.target.value)
                  }
                  style={styles.input}
                >
                  <option value="">Select main Markid</option>

                  {markidim.map((markid) => (
                    <option key={markid.id} value={markid.id}>
                      {markid.name}
                    </option>
                  ))}

                  <option value="new">New / Not Listed</option>
                </select>
              </label>

              {mainMarkidSelection === "new" && (
                <label style={styles.label}>
                  New Markid Name
                  <input
                    type="text"
                    name="newMarkidName"
                    style={styles.input}
                  />
                </label>
              )}

              <div style={styles.fieldGroup}>
                <span style={styles.fieldLabel}>Additional Markidim</span>

                {additionalMarkidIds.map((markidId, index) => (
                  <div key={index} style={styles.additionalMarkidRow}>
                    <select
                      name="additionalMarkidIds"
                      value={markidId}
                      onChange={(event) =>
                        updateAdditionalMarkid(index, event.target.value)
                      }
                      style={styles.input}
                    >
                      <option value="" disabled>
                        Select Markid
                      </option>

                      {renderMarkidOptions(markidId)}

                      <option value="new">New / Not Listed</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => removeAdditionalMarkid(index)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>

                    {markidId === "new" && (
                      <label style={styles.label}>
                        New Markid Name
                        <input
                          type="text"
                          name={`newAdditionalMarkidName-${index}`}
                          style={styles.input}
                        />
                      </label>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAdditionalMarkid}
                  style={styles.addButton}
                >
                  + Add another Markid
                </button>
              </div>

              <label style={styles.label}>
                Year
                <input type="number" name="year" style={styles.input} />
              </label>

              <label style={styles.label}>
                Type
                <select
                  name="type"
                  required
                  defaultValue=""
                  style={styles.input}
                >
                  <option value="" disabled>
                    Select dance type
                  </option>

                  {danceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.label}>
                YouTube Videos
                <textarea
                  name="youtubeVideos"
                  rows={3}
                  placeholder="Enter one YouTube URL per line"
                  style={styles.textarea}
                />
              </label>
            </>
          ) : (
            <>
              <label style={styles.label}>
                Event Name
                <input type="text" name="name" required style={styles.input} />
              </label>

              <label style={styles.label}>
                Hebrew Event Name
                <input
                  type="text"
                  name="nameHebrew"
                  dir="rtl"
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Type
                <select
                  name="type"
                  required
                  defaultValue=""
                  style={styles.input}
                >
                  <option value="" disabled>
                    Select event type
                  </option>

                  {danceEventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "session"
                        ? "Session"
                        : type === "camp"
                          ? "Camp"
                          : type === "marathon"
                            ? "Marathon"
                            : "Other"}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.label}>
                When
                <textarea
                  name="when"
                  rows={3}
                  placeholder="For example: Every Tuesday at 20:00"
                  style={styles.textarea}
                />
              </label>

              <label style={styles.label}>
                City
                <input type="text" name="city" style={styles.input} />
              </label>

              <label style={styles.label}>
                Hebrew City
                <input
                  type="text"
                  name="cityHebrew"
                  dir="rtl"
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Address
                <input
                  type="text"
                  name="address"
                  placeholder="Street address"
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Main Markid
                <select
                  name="mainMarkidId"
                  value={mainMarkidSelection}
                  onChange={(event) =>
                    setMainMarkidSelection(event.target.value)
                  }
                  style={styles.input}
                >
                  <option value="">Select main Markid</option>

                  {markidim.map((markid) => (
                    <option key={markid.id} value={markid.id}>
                      {markid.name}
                    </option>
                  ))}

                  <option value="new">New / Not Listed</option>
                </select>
              </label>

              {mainMarkidSelection === "new" && (
                <label style={styles.label}>
                  New Markid Name
                  <input
                    type="text"
                    name="newMarkidName"
                    style={styles.input}
                  />
                </label>
              )}

              <div style={styles.fieldGroup}>
                <span style={styles.fieldLabel}>Additional Markidim</span>

                {additionalMarkidIds.map((markidId, index) => (
                  <div key={index} style={styles.additionalMarkidRow}>
                    <select
                      name="additionalMarkidIds"
                      value={markidId}
                      onChange={(event) =>
                        updateAdditionalMarkid(index, event.target.value)
                      }
                      style={styles.input}
                    >
                      <option value="" disabled>
                        Select Markid
                      </option>

                      {renderMarkidOptions(markidId)}

                      <option value="new">New / Not Listed</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => removeAdditionalMarkid(index)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>

                    {markidId === "new" && (
                      <label style={styles.label}>
                        New Markid Name
                        <input
                          type="text"
                          name={`newAdditionalMarkidName-${index}`}
                          style={styles.input}
                        />
                      </label>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAdditionalMarkid}
                  style={styles.addButton}
                >
                  + Add another Markid
                </button>
              </div>

              <label style={styles.label}>
                Website
                <input type="url" name="website" style={styles.input} />
              </label>
            </>
          )}

          <label style={styles.label}>
            Notes
            <textarea name="notes" rows={5} style={styles.textarea} />
          </label>

          <button type="submit" style={commonStyles.button}>
            Submit
          </button>
        </form>

        <Link href="/" style={styles.back}>
          Back to home
        </Link>
      </div>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "60px 40px",
  },
  title: {
    fontSize: "42px",
    marginBottom: "16px",
  },
  subtitle: {
    color: colors.mutedText,
    marginBottom: "40px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  label: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    fontWeight: "600",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  fieldLabel: {
    fontWeight: "600",
  },
  additionalMarkidRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  addButton: {
    alignSelf: "flex-start",
    padding: "8px 12px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    backgroundColor: colors.white,
    cursor: "pointer",
  },
  removeButton: {
    alignSelf: "flex-start",
    padding: "6px 10px",
    border: "none",
    backgroundColor: "transparent",
    color: colors.mutedText,
    cursor: "pointer",
  },
  input: {
    padding: "12px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    fontSize: "16px",
  },
  textarea: {
    padding: "12px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    fontSize: "16px",
    resize: "vertical" as const,
  },
  back: {
    display: "inline-block",
    marginTop: "24px",
    color: colors.text,
  },
};
