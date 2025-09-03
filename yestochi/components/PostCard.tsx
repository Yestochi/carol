import React, { useState } from 'react';
import type { Post, User } from '../types';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { LikeIcon, CommentIcon, ShareIcon } from './Icons';

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onAddComment: (postId: number, commentText: string) => void;
  onNavigateToProfile: (userId: number) => void;
  nicknames: Record<number, string>;
  getUserDisplayName: (user: User) => string;
  showToast: (message: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onAddComment, onNavigateToProfile, nicknames, getUserDisplayName, showToast }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const currentUser = useCurrentUser();

  const handleCommentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (commentText.trim()) {
          onAddComment(post.id, commentText);
          setCommentText('');
          setShowComments(true);
      }
  };
  
  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
        showToast('Link da publicação copiado!');
    }).catch(err => {
        console.error('Falha ao copiar link: ', err);
        showToast('Não foi possível copiar o link.');
    });
  };

  return (
    <div className="bg-white rounded-lg shadow transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <img 
            src={post.user.profilePicture} 
            alt={getUserDisplayName(post.user)} 
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => onNavigateToProfile(post.user.id)}
          />
          <div>
            <p 
              className="font-semibold text-gray-800 hover:underline cursor-pointer"
              onClick={() => onNavigateToProfile(post.user.id)}
            >
              {getUserDisplayName(post.user)}
            </p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <p className="mt-4 text-gray-800 text-base">{post.text}</p>
      </div>

      {post.image && (
        <div className="mt-2">
          <img src={post.image} alt="Post content" className="w-full h-auto" />
        </div>
      )}

      <div className="px-4 py-2 flex justify-between items-center text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="p-1 rounded-full" style={{ backgroundColor: 'var(--primary-color)'}}>
            <LikeIcon className="w-3 h-3 text-white" />
          </div>
          <span>{post.likes}</span>
        </div>
        <span className="cursor-pointer hover:underline" onClick={() => setShowComments(!showComments)}>{post.comments.length} comentários</span>
      </div>

      <div className="border-t border-gray-200 mx-4"></div>

      <div className="px-4 py-1 flex justify-around">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center space-x-2 w-full justify-center py-2 rounded-lg hover:bg-gray-100 font-semibold transition-colors`}
          style={{ color: post.isLiked ? 'var(--primary-color)' : '#65676b' }}
          aria-pressed={post.isLiked}
        >
          <LikeIcon className="w-5 h-5" />
          <span>Curtir</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 w-full justify-center py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-semibold">
          <CommentIcon className="w-5 h-5" />
          <span>Comentar</span>
        </button>
        <button onClick={handleShare} className="flex items-center space-x-2 w-full justify-center py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-semibold">
          <ShareIcon className="w-5 h-5" />
          <span>Compartilhar</span>
        </button>
      </div>

      {showComments && (
        <div className="border-t border-gray-200 p-4 space-y-3">
          {post.comments.map(comment => (
            <div key={comment.id} className="flex items-start space-x-2">
              <img 
                src={comment.user.profilePicture} 
                alt={getUserDisplayName(comment.user)} 
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => onNavigateToProfile(comment.user.id)}
              />
              <div className="bg-gray-100 rounded-xl p-2">
                <p 
                  className="font-semibold text-sm text-gray-800 hover:underline cursor-pointer"
                  onClick={() => onNavigateToProfile(comment.user.id)}
                >
                  {getUserDisplayName(comment.user)}
                </p>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 pt-2">
             <img src={currentUser.profilePicture} alt="You" className="w-8 h-8 rounded-full" />
             <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escreva um comentário..."
                className="w-full bg-white text-black border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{'--tw-ring-color': 'var(--primary-color)'} as React.CSSProperties}
             />
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;