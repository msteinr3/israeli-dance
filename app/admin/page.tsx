"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { colors } from "@/styles/colors";
import { commonStyles } from "@/styles/common";

type AdditionalMarkid = {
  selection: string;
  newName: string | null;
};

type SubmissionData = {
  danceName?: string;
  danceNameHebrew?: string;
  songName?: string;
  songNameHebrew?: string;
  shortMp3?: string;
  longMp3?: string;
  year?: number | null;
  type?: string;
  youtubeVideos?: string[];
  mainMarkidId?: string | null;
  newMarkidName?: string | null;
  additionalMarkidIds?: AdditionalMarkid[];
  notes?: string;

  name?: string;
  nameHebrew?: string;
  when?: string;
  city?: string;
  cityHebrew?: string;
  address?: string;
  website?: string;
};

type Submission = {
  id: string;
  type: "dance" | "event";
  status: "pending" | "approved" | "rejected";
  data: SubmissionData;
  created_at: string;
};

type Markid = {
  id: string;
  name: string;
  name_hebrew: string | null;
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [markidim, setMarkidim] = useState<Markid[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<SubmissionData>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadAdminPage = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const [
        { data: submissionData, error: submissionError },
        { data: markidData, error: markidError },
      ] = await Promise.all([
        supabase
          .from("submissions")
          .select("id, type, status, data, created_at")
          .eq("status", "pending")
          .order("created_at", { ascending: false }),
        supabase.from("markidim").select("id, name, name_hebrew").order("name"),
      ]);

      if (submissionError) {
        setErrorMessage(submissionError.message);
      } else {
        setSubmissions((submissionData ?? []) as Submission[]);
      }

      if (markidError) {
        setErrorMessage(markidError.message);
      } else {
        setMarkidim(markidData ?? []);
      }

      setLoading(false);
    };

    loadAdminPage();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    window.location.reload();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleApprove = async (submissionId: string) => {
    setErrorMessage("");

    const { error } = await supabase.rpc("approve_submission", {
      submission_id: submissionId,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSubmissions((current) =>
      current.filter((submission) => submission.id !== submissionId),
    );
  };

  const handleReject = async (submissionId: string) => {
    setErrorMessage("");

    const { error } = await supabase.rpc("reject_submission", {
      submission_id: submissionId,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSubmissions((current) =>
      current.filter((submission) => submission.id !== submissionId),
    );
  };

  const handleSaveEdit = async (submissionId: string) => {
    setErrorMessage("");

    const { error } = await supabase.rpc("update_submission", {
      submission_id: submissionId,
      submission_data: editData,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === submissionId
          ? { ...submission, data: editData }
          : submission,
      ),
    );

    setEditingId(null);
  };

  const startEditing = (submission: Submission) => {
    setEditingId(submission.id);
    setEditData({
      ...submission.data,
      additionalMarkidIds: submission.data.additionalMarkidIds
        ? submission.data.additionalMarkidIds.map((item) => ({ ...item }))
        : [],
      youtubeVideos: submission.data.youtubeVideos
        ? [...submission.data.youtubeVideos]
        : [],
    });
    setErrorMessage("");
  };

  const updateField = (
    field: keyof SubmissionData,
    value: string | number | null,
  ) => {
    setEditData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const additionalMarkidIds = editData.additionalMarkidIds ?? [];

  const addAdditionalMarkid = () => {
    setEditData((current) => ({
      ...current,
      additionalMarkidIds: [
        ...(current.additionalMarkidIds ?? []),
        { selection: "", newName: null },
      ],
    }));
  };

  const updateAdditionalMarkid = (
    index: number,
    field: "selection" | "newName",
    value: string | null,
  ) => {
    setEditData((current) => ({
      ...current,
      additionalMarkidIds: (current.additionalMarkidIds ?? []).map(
        (item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeAdditionalMarkid = (index: number) => {
    setEditData((current) => ({
      ...current,
      additionalMarkidIds: (current.additionalMarkidIds ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const usedMarkidIds = [
    editData.mainMarkidId ?? "",
    ...additionalMarkidIds.map((item) =>
      item.selection === "new" ? "" : item.selection,
    ),
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

  if (loading) {
    return (
      <main style={commonStyles.page}>
        <div style={styles.container}>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main style={commonStyles.page}>
        <div style={styles.loginContainer}>
          <h1 style={styles.title}>Admin Login</h1>

          <form onSubmit={handleLogin} style={styles.loginForm}>
            <label style={styles.label}>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                style={styles.input}
              />
            </label>

            {errorMessage && <p style={styles.error}>{errorMessage}</p>}

            <button type="submit" style={styles.approveButton}>
              Log In
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={commonStyles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Pending Submissions</h1>

          <button onClick={handleLogout} style={styles.secondaryButton}>
            Log Out
          </button>
        </div>

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

        {submissions.length === 0 ? (
          <p>No pending submissions.</p>
        ) : (
          <div style={styles.list}>
            {submissions.map((submission) => {
              const isEditing = editingId === submission.id;
              const data = isEditing ? editData : submission.data;

              return (
                <details key={submission.id} style={styles.item}>
                  <summary style={styles.summary}>
                    {submission.type === "dance"
                      ? data.danceName || "Dance"
                      : data.name || "Dance Event"}
                  </summary>

                  <div style={styles.details}>
                    <p>
                      <strong>Type:</strong> {submission.type}
                    </p>

                    <p>
                      <strong>Submitted:</strong>{" "}
                      {new Date(submission.created_at).toLocaleString()}
                    </p>

                    {!isEditing ? (
                      <>
                        <pre style={styles.data}>
                          {JSON.stringify(submission.data, null, 2)}
                        </pre>

                        <div style={styles.actions}>
                          <button
                            type="button"
                            onClick={() => startEditing(submission)}
                            style={styles.secondaryButton}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApprove(submission.id)}
                            style={styles.approveButton}
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReject(submission.id)}
                            style={styles.rejectButton}
                          >
                            Reject
                          </button>
                        </div>
                      </>
                    ) : (
                      <div style={styles.editForm}>
                        {submission.type === "dance" ? (
                          <>
                            <label style={styles.label}>
                              Dance Name
                              <input
                                value={editData.danceName ?? ""}
                                onChange={(event) =>
                                  updateField("danceName", event.target.value)
                                }
                                style={styles.input}
                              />
                            </label>

                            <label style={styles.label}>
                              Hebrew Dance Name
                              <input
                                value={editData.danceNameHebrew ?? ""}
                                onChange={(event) =>
                                  updateField(
                                    "danceNameHebrew",
                                    event.target.value,
                                  )
                                }
                                style={styles.input}
                                dir="rtl"
                              />
                            </label>

                            <label style={styles.label}>
                              Song Name
                              <input
                                value={editData.songName ?? ""}
                                onChange={(event) =>
                                  updateField("songName", event.target.value)
                                }
                                style={styles.input}
                              />
                            </label>

                            <label style={styles.label}>
                              Hebrew Song Name
                              <input
                                value={editData.songNameHebrew ?? ""}
                                onChange={(event) =>
                                  updateField(
                                    "songNameHebrew",
                                    event.target.value,
                                  )
                                }
                                style={styles.input}
                                dir="rtl"
                              />
                            </label>

                            <label style={styles.label}>
                              Short MP3
                              <input
                                type="url"
                                value={editData.shortMp3 ?? ""}
                                onChange={(event) =>
                                  updateField("shortMp3", event.target.value)
                                }
                                style={styles.input}
                              />
                            </label>

                            <label style={styles.label}>
                              Long MP3
                              <input
                                type="url"
                                value={editData.longMp3 ?? ""}
                                onChange={(event) =>
                                  updateField("longMp3", event.target.value)
                                }
                                style={styles.input}
                              />
                            </label>

                            <label style={styles.label}>
                              Main Markid
                              <select
                                value={editData.mainMarkidId ?? ""}
                                onChange={(event) =>
                                  updateField(
                                    "mainMarkidId",
                                    event.target.value,
                                  )
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

                            {editData.mainMarkidId === "new" && (
                              <label style={styles.label}>
                                New Markid Name
                                <input
                                  value={editData.newMarkidName ?? ""}
                                  onChange={(event) =>
                                    updateField(
                                      "newMarkidName",
                                      event.target.value,
                                    )
                                  }
                                  style={styles.input}
                                />
                              </label>
                            )}

                            <div style={styles.fieldGroup}>
                              <strong>Additional Markidim</strong>

                              {additionalMarkidIds.map((markidItem, index) => (
                                <div key={index} style={styles.additionalRow}>
                                  <select
                                    value={markidItem.selection}
                                    onChange={(event) =>
                                      updateAdditionalMarkid(
                                        index,
                                        "selection",
                                        event.target.value,
                                      )
                                    }
                                    style={styles.input}
                                  >
                                    <option value="">Select Markid</option>

                                    {renderMarkidOptions(markidItem.selection)}

                                    <option value="new">
                                      New / Not Listed
                                    </option>
                                  </select>

                                  {markidItem.selection === "new" && (
                                    <input
                                      value={markidItem.newName ?? ""}
                                      onChange={(event) =>
                                        updateAdditionalMarkid(
                                          index,
                                          "newName",
                                          event.target.value,
                                        )
                                      }
                                      placeholder="New Markid name"
                                      style={styles.input}
                                    />
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeAdditionalMarkid(index)
                                    }
                                    style={styles.secondaryButton}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={addAdditionalMarkid}
                                style={styles.secondaryButton}
                              >
                                + Add another Markid
                              </button>
                            </div>

                            <label style={styles.label}>
                              Year
                              <input
                                type="number"
                                value={editData.year ?? ""}
                                onChange={(event) =>
                                  updateField(
                                    "year",
                                    event.target.value
                                      ? Number(event.target.value)
                                      : null,
                                  )
                                }
                                style={styles.input}
                              />
                            </label>

                            <label style={styles.label}>
                              Type
                              <select
                                value={editData.type ?? ""}
                                onChange={(event) =>
                                  updateField("type", event.target.value)
                                }
                                style={styles.input}
                              >
                                <option value="">Select type</option>
                                <option value="circle">Circle</option>
                                <option value="partner">Partner</option>
                                <option value="line">Line</option>
                              </select>
                            </label>

                            <label style={styles.label}>
                              YouTube Videos
                              <textarea
                                value={(editData.youtubeVideos ?? []).join(
                                  "\n",
                                )}
                                onChange={(event) =>
                                  setEditData((current) => ({
                                    ...current,
                                    youtubeVideos: event.target.value
                                      .split("\n")
                                      .map((url) => url.trim())
                                      .filter(Boolean),
                                  }))
                                }
                                rows={4}
                                style={styles.textarea}
                              />
                            </label>
                          </>
                        ) : (
                          <>
                            <label style={styles.label}>
                              Event Name
                              <input
                                value={editData.name ?? ""}
                                onChange={(event) =>
                                  updateField("name", event.target.value)
                                }
                                style={styles.input}
                              />
                            </label>

                            <label style={styles.label}>
                              Hebrew Event Name
                              <input
                                value={editData.nameHebrew ?? ""}
                                onChange={(event) =>
                                  updateField("nameHebrew", event.target.value)
                                }
                                style={styles.input}
                                dir="rtl"
                              />
                            </label>

                            <label style={styles.label}>
                              Type
                              <select
                                value={editData.type ?? ""}
                                onChange={(event) =>
                                  updateField("type", event.target.value)
                                }
                                style={styles.input}
                              >
                                <option value="">Select type</option>
                                <option value="session">Session</option>
                                <option value="camp">Camp</option>
                                <option value="marathon">Marathon</option>
                                <option value="other">Other</option>
                              </select>
                            </label>

                            <label style={styles.label}>
                              When
                              <textarea
                                value={editData.when ?? ""}
                                onChange={(event) =>
                                  updateField("when", event.target.value)
                                }
                                style={styles.textarea}
                              />
                            </label>

                            <label style={styles.label}>
                              City
                              <input
                                value={editData.city ?? ""}
                                onChange={(event) =>
                                  updateField("city", event.target.value)
                                }
                                style={styles.input}
                              />
                            </label>

                            <label style={styles.label}>
                              Hebrew City
                              <input
                                value={editData.cityHebrew ?? ""}
                                onChange={(event) =>
                                  updateField("cityHebrew", event.target.value)
                                }
                                style={styles.input}
                                dir="rtl"
                              />
                            </label>

                            <label style={styles.label}>
                              Address
                              <input
                                value={editData.address ?? ""}
                                onChange={(event) =>
                                  updateField("address", event.target.value)
                                }
                                style={styles.input}
                              />
                            </label>

                            <label style={styles.label}>
                              Main Markid
                              <select
                                value={editData.mainMarkidId ?? ""}
                                onChange={(event) =>
                                  updateField(
                                    "mainMarkidId",
                                    event.target.value,
                                  )
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

                            {editData.mainMarkidId === "new" && (
                              <label style={styles.label}>
                                New Markid Name
                                <input
                                  value={editData.newMarkidName ?? ""}
                                  onChange={(event) =>
                                    updateField(
                                      "newMarkidName",
                                      event.target.value,
                                    )
                                  }
                                  style={styles.input}
                                />
                              </label>
                            )}

                            <div style={styles.fieldGroup}>
                              <strong>Additional Markidim</strong>

                              {additionalMarkidIds.map((markidItem, index) => (
                                <div key={index} style={styles.additionalRow}>
                                  <select
                                    value={markidItem.selection}
                                    onChange={(event) =>
                                      updateAdditionalMarkid(
                                        index,
                                        "selection",
                                        event.target.value,
                                      )
                                    }
                                    style={styles.input}
                                  >
                                    <option value="">Select Markid</option>

                                    {renderMarkidOptions(markidItem.selection)}

                                    <option value="new">
                                      New / Not Listed
                                    </option>
                                  </select>

                                  {markidItem.selection === "new" && (
                                    <input
                                      value={markidItem.newName ?? ""}
                                      onChange={(event) =>
                                        updateAdditionalMarkid(
                                          index,
                                          "newName",
                                          event.target.value,
                                        )
                                      }
                                      placeholder="New Markid name"
                                      style={styles.input}
                                    />
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeAdditionalMarkid(index)
                                    }
                                    style={styles.secondaryButton}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={addAdditionalMarkid}
                                style={styles.secondaryButton}
                              >
                                + Add another Markid
                              </button>
                            </div>

                            <label style={styles.label}>
                              Website
                              <input
                                type="url"
                                value={editData.website ?? ""}
                                onChange={(event) =>
                                  updateField("website", event.target.value)
                                }
                                style={styles.input}
                              />
                            </label>
                          </>
                        )}

                        <label style={styles.label}>
                          Notes
                          <textarea
                            value={editData.notes ?? ""}
                            onChange={(event) =>
                              updateField("notes", event.target.value)
                            }
                            rows={5}
                            style={styles.textarea}
                          />
                        </label>

                        <div style={styles.actions}>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            style={styles.secondaryButton}
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSaveEdit(submission.id)}
                            style={styles.approveButton}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "60px 40px",
  },
  loginContainer: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "60px 40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "42px",
    margin: 0,
  },
  loginForm: {
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
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  item: {
    border: `1px solid ${colors.border}`,
    borderRadius: "8px",
    padding: "16px",
  },
  summary: {
    cursor: "pointer",
    fontWeight: "600",
  },
  details: {
    marginTop: "16px",
  },
  data: {
    padding: "16px",
    overflowX: "auto" as const,
    backgroundColor: "#f5f5f5",
    borderRadius: "6px",
  },
  editForm: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "18px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  additionalRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
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
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  },
  secondaryButton: {
    padding: "10px 16px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    backgroundColor: colors.white,
    cursor: "pointer",
  },
  approveButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  rejectButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    marginBottom: "20px",
    padding: "12px 16px",
    borderRadius: "6px",
    backgroundColor: "#ffebee",
    color: colors.text,
  },
};
