import React, { useState, useEffect } from 'react';
import type { User, Post } from '../types';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import EditProfileModal from './EditProfileModal';

interface ProfilePageProps {
  user: User;
  posts: Post[];
  allUsers: User[];
  onCreatePost: (text: string, image?: string | null) => void;
  onLike: (postId: number) => void;
  onAddComment: (postId: number, commentText: string) => void;
  onNavigateToProfile: (userId: number) => void;
  onUpdateProfile: (userId: number, updatedData: Partial<Omit<User, 'id'>>) => void;
  nicknames: Record<number, string>;
  onSetNickname: (userId: number, nickname: string) => void;
  onOpenChat: (userId: number) => void;
  getUserDisplayName: (user: User) => string;
  showToast: (message: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  posts,
  allUsers,
  onCreatePost,
  onLike,
  onAddComment,
  onNavigateToProfile,
  onUpdateProfile,
  nicknames,
  onSetNickname,
  onOpenChat,
  getUserDisplayName,
  showToast,
}) => {
  const currentUser = useCurrentUser();
  const userPosts = posts.filter(post => post.user.id === user.id);
  const isCurrentUserProfile = currentUser.id === user.id;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts');

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(nicknames[user.id] || '');
  
  const friends = allUsers.filter(u => u.id !== user.id);
  const photos = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      url: `https://picsum.photos/seed/${user.id}-photo${i}/500/500`
  }));

  useEffect(() => {
    setNicknameInput(nicknames[user.id] || '');
  }, [user.id, nicknames]);

  const handleSaveProfile = (updatedData: Partial<Omit<User, 'id'>>) => {
    onUpdateProfile(user.id, updatedData);
    setIsEditModalOpen(false);
  };
  
  const handleNicknameSave = () => {
    if (nicknameInput.trim() !== (nicknames[user.id] || '')) {
      onSetNickname(user.id, nicknameInput.trim());
    }
    setIsEditingNickname(false);
  };

  const handleNicknameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNicknameSave();
    } else if (e.key === 'Escape') {
      setNicknameInput(nicknames[user.id] || '');
      setIsEditingNickname(false);
    }
  };
  
  const getTabClassName = (tabName: 'posts' | 'about' | 'friends' | 'photos') => {
    const baseClasses = "font-semibold py-3 px-4 focus:outline-none transition-colors duration-200";
    if (activeTab === tabName) {
        return `${baseClasses} text-[var(--primary-color)]`;
    }
    return `${baseClasses} text-gray-600 hover:bg-gray-100 rounded-md`;
  };
  
  const activeTabStyle = {
      borderBottom: `4px solid var(--primary-color)`
  };


  const displayName = getUserDisplayName(user);
  const subName = nicknames[user.id] ? `(${user.name})` : '';

  return (
    <>
      {isEditModalOpen && (
        <EditProfileModal 
          user={user}
          onSave={handleSaveProfile}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      <div className="w-full mx-auto pb-10">
        <div className="bg-white rounded-lg shadow">
          <div className="relative h-48 md:h-64 lg:h-80 rounded-t-lg">
            <img
              src={user.coverPhoto}
              alt={`${user.name}'s cover photo`}
              className="w-full h-full object-cover rounded-t-lg"
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover"
              />
            </div>
          </div>
          <div className="pt-20 text-center pb-4 px-4 min-h-[56px] flex items-center justify-center">
            {isCurrentUserProfile || !isEditingNickname ? (
              <h2
                className={`text-3xl font-bold text-gray-800 inline-block p-1 rounded-md transition-colors ${!isCurrentUserProfile ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                onClick={() => !isCurrentUserProfile && setIsEditingNickname(true)}
                title={!isCurrentUserProfile ? "Clique para editar o apelido" : ""}
                aria-label={`Nome do perfil: ${displayName}. ${!isCurrentUserProfile ? 'Clique para editar o apelido.' : ''}`}
              >
                {displayName} <span className="text-xl font-normal text-gray-500">{subName}</span>
              </h2>
            ) : (
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                onBlur={handleNicknameSave}
                onKeyDown={handleNicknameKeyDown}
                className="text-3xl font-bold text-gray-800 bg-white border border-gray-300 rounded-md text-center p-1 transition-shadow duration-300 ease-in-out outline-none focus:ring-2 focus:ring-offset-2"
                style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}
                autoFocus
                aria-label="Editar apelido"
              />
            )}
          </div>
          
          <div className="flex justify-center items-center space-x-2 pb-4">
              {isCurrentUserProfile ? (
                 <button 
                    onClick={() => setIsEditModalOpen(true)} 
                    style={{ backgroundColor: 'var(--primary-color)' }}
                    className="text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
                    <span>Editar Perfil / Configurações</span>
                 </button>
              ) : (
                <>
                  <button 
                    onClick={() => onOpenChat(user.id)} 
                    style={{ backgroundColor: 'var(--primary-color)' }} 
                    className="text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path></svg>
                    <span>Mensagem</span>
                  </button>
                </>
              )}
          </div>


          <div className="border-t border-gray-200 px-4 flex justify-center space-x-2 md:space-x-4">
              <button onClick={() => setActiveTab('posts')} className={getTabClassName('posts')} style={activeTab === 'posts' ? activeTabStyle : {}}>Publicações</button>
              <button onClick={() => setActiveTab('about')} className={getTabClassName('about')} style={activeTab === 'about' ? activeTabStyle : {}}>Sobre</button>
              <button onClick={() => setActiveTab('friends')} className={getTabClassName('friends')} style={activeTab === 'friends' ? activeTabStyle : {}}>Amigos</button>
              <button onClick={() => setActiveTab('photos')} className={getTabClassName('photos')} style={activeTab === 'photos' ? activeTabStyle : {}}>Fotos</button>
          </div>
        </div>

        <div className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {activeTab === 'posts' ? (
                    <>
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-bold text-lg mb-2">Introdução</h3>
                                {user.bio ? (
                                    <p className="text-gray-600 text-sm text-center italic">"{user.bio}"</p>
                                ) : (
                                    <p className="text-gray-600 text-sm">Bem-vindo(a) à página de {getUserDisplayName(user)}.</p>
                                )}
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-bold text-lg mb-2">Fotos</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {photos.slice(0, 9).map(p => <img key={p.id} src={p.url} alt={`Foto ${p.id}`} className="aspect-square object-cover rounded-md" />)}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                            {isCurrentUserProfile && <CreatePost onCreatePost={onCreatePost} nicknames={nicknames} />}
                            {userPosts.length > 0 ? (
                                userPosts.map(post => (
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
                                ))
                            ) : (
                                <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                                    <p>Nenhuma publicação para mostrar.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="lg:col-span-3">
                        {activeTab === 'about' && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Sobre</h3>
                                <p className="text-gray-600">Nenhuma informação disponível no momento.</p>
                            </div>
                        )}
                        {activeTab === 'friends' && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Amigos ({friends.length})</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                                    {friends.map(friend => (
                                        <div key={friend.id} className="text-center">
                                            <img 
                                                src={friend.profilePicture} 
                                                alt={getUserDisplayName(friend)} 
                                                className="w-full aspect-square object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                                                onClick={() => onNavigateToProfile(friend.id)}
                                            />
                                            <p 
                                                className="font-semibold mt-2 text-sm text-gray-700 hover:underline cursor-pointer truncate"
                                                onClick={() => onNavigateToProfile(friend.id)}
                                            >
                                                {getUserDisplayName(friend)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'photos' && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Fotos</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                    {photos.map(photo => (
                                        <div key={photo.id} className="aspect-square">
                                            <img 
                                                src={photo.url} 
                                                alt={`Foto ${photo.id + 1}`} 
                                                className="w-full h-full object-cover rounded-md cursor-pointer transition-transform hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;