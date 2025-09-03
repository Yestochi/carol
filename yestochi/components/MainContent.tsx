import React from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import type { Post, User } from '../types';

interface MainContentProps {
  posts: Post[];
  onCreatePost: (text: string, image?: string | null) => void;
  onLike: (postId: number) => void;
  onAddComment: (postId: number, commentText: string) => void;
  onNavigateToProfile: (userId: number) => void;
  nicknames: Record<number, string>;
  getUserDisplayName: (user: User) => string;
  showToast: (message: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ posts, onCreatePost, onLike, onAddComment, onNavigateToProfile, nicknames, getUserDisplayName, showToast }) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-10">
      <CreatePost onCreatePost={onCreatePost} nicknames={nicknames} />
      {posts.map(post => (
        <PostCard 
            key={post.id} 
            post={post} 
            onLike={onLike}
            onAddComment={onAddComment}
            onNavigateToProfile={onNavigateToProfile}
            nicknames={nicknames}
            getUserDisplayName={getUserDisplayName}
            showToast={showToast}
        />
      ))}
    </div>
  );
};

export default MainContent;