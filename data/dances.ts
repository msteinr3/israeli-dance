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

export const dances: Dance[] = [
  {
    id: "dance-1",
    danceName: "Example Dance",
    danceNameHebrew: "ריקוד לדוגמה",
    songName: "Example Song",
    songNameHebrew: "שיר לדוגמה",
    shortMp3: "dances/dance-1/short.mp3",
    longMp3: "dances/dance-1/long.mp3",
    mainMarkidId: "markid-1",
    additionalMarkidIds: [],
    year: 2020,
    type: "circle",
    youtubeVideos: ["https://youtube.com/example"],
    notes: "Dummy dance for testing.",
  },
  {
    id: "dance-2",
    danceName: "Another Dance",
    danceNameHebrew: "עוד ריקוד",
    songName: "Another Song",
    songNameHebrew: "עוד שיר",
    shortMp3: "dances/dance-2/short.mp3",
    longMp3: "dances/dance-2/long.mp3",
    mainMarkidId: "markid-2",
    additionalMarkidIds: [],
    year: 2022,
    type: "partner",
    youtubeVideos: ["https://youtube.com/another"],
    notes: "Another dummy dance.",
  },
];
