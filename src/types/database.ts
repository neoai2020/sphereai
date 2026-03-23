export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  product_name: string;
  product_description: string;
  product_url: string | null;
  keywords: string[];
  target_audience: string;
  status: "draft" | "generating" | "published" | "error";
  project_type: "affiliate" | "service";
  created_at: string;
  updated_at: string;
}

export type PageType = "landing" | "about" | "faq" | "blog" | "reviews";

export interface Page {
  id: string;
  project_id: string;
  page_type: PageType;
  title: string;
  meta_description: string;
  content: Record<string, unknown>;
  schema_markup: Record<string, unknown>;
  slug: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  project_id: string;
  created_at: string;
}

export interface ForumReply {
  id: string;
  user_id: string;
  project_id: string;
  forum_url: string | null;
  forum_topic: string;
  generated_reply: string;
  website_link: string;
  created_at: string;
}

export interface ProjectWithPages extends Project {
  pages: Page[];
}
