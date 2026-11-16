export type Locale = "ru" | "en";

export type LocalizedText = Partial<Record<Locale, string>>;

export type SiteContent = {
  key: string;
  content: LocalizedText;
  group_name: string;
  label: string | null;
  image_url: string | null;
  updated_at: string;
};

export type Graduate = {
  id: string;
  name: string;
  owner_city: string | null;
  birth_year: number | null;
  description: string | null;
  photo: string | null;
  sort_order: number;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export type Post = {
  id: string;
  slug: string | null;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_photo: string | null;
  photos: string[];
  video_url: string | null;
  published_at: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Dog = {
  id: string;
  name: string;
  slug: string;
  sex: "male" | "female" | null;
  birth_date: string | null;
  color: string | null;
  title: string | null;
  description: LocalizedText;
  photos: string[];
  main_photo: string | null;
  father_name: string | null;
  mother_name: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PuppyStatus = "available" | "reserved" | "sold" | "archived";

export type Puppy = {
  id: string;
  name: string | null;
  slug: string | null;
  sex: "male" | "female" | null;
  birth_date: string | null;
  color: string | null;
  litter_name: string | null;
  description: LocalizedText;
  photos: string[];
  main_photo: string | null;
  price: number | null;
  status: PuppyStatus;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
