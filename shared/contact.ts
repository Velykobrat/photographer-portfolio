export const shootTypes = [
  "Portrait",
  "Fashion",
  "Personal",
  "Commercial",
  "Other",
] as const;

export const contactLimits = {
  name: 100,
  contact: 200,
  location: 200,
  message: 3000,
  preferredDate: 10,
  website: 200,
} as const;

export type ContactRequest = {
  name: string;
  contact: string;
  shootType: (typeof shootTypes)[number];
  preferredDate: string;
  location: string;
  message: string;
  consent: true;
  website: string;
};
