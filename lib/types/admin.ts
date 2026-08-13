export type PostStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED";


export interface AdminPost {

  id:string;

  slug:string;

  headline:string;

  category:string;

  author:string;

  status:PostStatus;

  views:number;

  createdAt?:string;
  updatedAt:string;

}
