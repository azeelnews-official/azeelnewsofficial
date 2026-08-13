import type { PostStatus } from "./post";




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
