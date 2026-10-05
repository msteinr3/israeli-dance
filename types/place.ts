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
