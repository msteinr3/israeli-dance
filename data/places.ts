export const danceEventTypes = [
  "session",
  "camp",
  "marathon",
  "other",
] as const;

export type DanceEventType = (typeof danceEventTypes)[number];

export type Place = {
  id: string;
  name: string;
  nameHebrew: string;
  type: DanceEventType;
  when?: string;
  city: string;
  cityHebrew?: string;
  address?: string;
  mainMarkidId?: string;
  additionalMarkidIds: string[];
  website?: string;
  notes?: string;
};

export const places: Place[] = [
  {
    id: "place-1",
    name: "Example Weekly Session",
    nameHebrew: "סשן שבועי לדוגמה",
    type: "session",
    when: "Every Tuesday at 20:00",
    city: "Tel Aviv",
    cityHebrew: "תל אביב",
    address: "12 Example Street",
    mainMarkidId: "markid-1",
    additionalMarkidIds: [],
    website: "https://example.com",
    notes: "Dummy weekly session.",
  },
  {
    id: "place-2",
    name: "Example Dance Camp",
    nameHebrew: "מחנה ריקודים לדוגמה",
    type: "camp",
    when: "July 10–12, 2027",
    city: "Haifa",
    cityHebrew: "חיפה",
    address: "1 Example Road",
    mainMarkidId: "markid-2",
    additionalMarkidIds: [],
    website: "https://example.com",
    notes: "Dummy dance camp.",
  },
];
