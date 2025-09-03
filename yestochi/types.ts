export interface User {
  id: number;
  name: string;
  password?: string; // Temporariamente opcional para dados mockados
  profileColor?: string;
  profilePicture: string;
  coverPhoto: string;
  backgroundColor?: string;
  font?: string;
  bio?: string;
}

export interface Comment {
  id: number;
  user: User;
  text: string;
  timestamp: string;
}

export interface Post {
  id: number;
  user: User;
  text: string;
  image?: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}