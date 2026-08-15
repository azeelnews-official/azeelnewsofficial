import type { PostStatus } from "@/lib/types/post";

export interface AdminMediaItem {
  id:string;
  url:string;
  altText:string;
  type:"image" | "video";
  uploadedAt:string;
  usedBy?:string;
}

export interface AdminPage {
  id:string;
  slug:string;
  title:string;
  content:string;
  updatedAt:string;
}

export interface AdminRedirect {
  id:string;
  fromPath:string;
  toPath:string;
  statusCode:301 | 302 | 307;
}

export interface AuditLogEntry {
  id:string;
  createdAt:string;
  actor:string;
  action:string;
  entity:string;
  metadata:any;
}

export interface AdminBackup {
  id:string;
  name?:string;
  type?:string;
  sizeMb?:number;
  createdAt:string;
}

export interface NewsletterSubscriber {
  id:string;
  email:string;
  status?: "active" | "inactive" | "unsubscribed";
}

export interface NewsletterCampaign {
  id:string;
  title:string;
  subject:string;
  openRate:number;
  recipients:number;
  sentAt:string;
  createdAt?:string;
}

export interface TagUsage {
  id:string;
  name:string;
  slug:string;
  postCount:number;
}

export type AdCampaignStatus =
  | "active"
  | "paused"
  | "ended";

export type AdPlacement =
  | "header"
  | "sidebar"
  | "inline"
  | "footer";

export interface AdCampaign {
  id: string;
  name: string;
  placement: AdPlacement;
  status: AdCampaignStatus;
  imageUrl: string;
  targetUrl?: string;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  createdAt?: string;
}



export interface AdminPost {
  id:string;
  headline:string;
  slug:string;
  status:PostStatus;
  views?:number;
  createdAt:string;
  updatedAt:string;
  author?:string;
  category:string;
}
