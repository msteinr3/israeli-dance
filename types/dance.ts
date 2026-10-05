export const danceTypes = ["circle", "partner", "line"] as const;

export type DanceType = (typeof danceTypes)[number];

export type Dance = {
  id: string;
  danceName: string;
  danceNameHebrew: string;
  songName: string;
  songNameHebrew: string;
  shortMp3: string;
  longMp3: string;
  mainMarkidId: string;
  additionalMarkidIds: string[];
  year: number;
  type: DanceType;
  youtubeVideos: string[];
  notes: string;
};
