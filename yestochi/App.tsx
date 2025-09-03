import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import MainContent from './components/MainContent';
import ProfilePage from './components/ProfilePage';
import ChatManager from './components/ChatManager';
import AuthPage from './components/AuthPage';
import EditProfileModal from './components/EditProfileModal';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import * as api from './services/api';
import type { Post, User, Comment } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [view, setView] = useState<{ page: 'home' | 'profile'; userId?: number }>({ page: 'home' });
  const [isEditingNewProfile, setIsEditingNewProfile] = useState(false);
  const [nicknames, setNicknames] = useState<Record<number, string>>({});
  const [openChats, setOpenChats] = useState<number[]>([]);
  const [messages, setMessages] = useState<Record<string, Comment[]>>({});
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppData = async () => {
      setIsLoading(true);
      api.init(); // Seed DB if needed
      const user = await api.getLoggedInUser();
      if (user) {
        setCurrentUser(user);
        const [fetchedUsers, fetchedPosts, fetchedNicknames, fetchedMessages] = await Promise.all([
          api.getUsers(),
          api.getPosts(),
          api.getNicknames(),
          api.getMessages()
        ]);
        setAllUsers(fetchedUsers);
        setPosts(fetchedPosts);
        setNicknames(fetchedNicknames);
        setMessages(fetchedMessages);
      }
      setIsLoading(false);
    };
    loadAppData();
  }, []);
  
  useEffect(() => {
    if (currentUser) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', currentUser.profileColor || '#3b5998');
      const color = currentUser.profileColor || '#3b5998';
      if (color.startsWith('#')) {
          let r = parseInt(color.slice(1, 3), 16);
          let g = parseInt(color.slice(3, 5), 16);
          let b = parseInt(color.slice(5, 7), 16);
          r = Math.max(0, r - 20);
          g = Math.max(0, g - 20);
          b = Math.max(0, b - 20);
          root.style.setProperty('--primary-color-hover', `rgb(${r}, ${g}, ${b})`);
      }
      root.style.setProperty('--background-color', currentUser.backgroundColor || '#f0f2f5');
      root.style.setProperty('--font-family', currentUser.font || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
    }
  }, [currentUser]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  }, []);

  const getUserDisplayName = useCallback((user: User) => {
    return nicknames[user.id] || user.name;
  }, [nicknames]);

  const handleCreatePost = useCallback(async (text: string, image?: string | null) => {
    if (!currentUser) return;
    await api.createPost(text, image, currentUser);
    setPosts(await api.getPosts());
  }, [currentUser]);

  const handleLikePost = useCallback(async (postId: number) => {
    await api.likePost(postId);
    setPosts(await api.getPosts());
  }, []);

  const handleAddComment = useCallback(async (postId: number, commentText: string) => {
      if (!currentUser) return;
      await api.addComment(postId, commentText, currentUser);
      setPosts(await api.getPosts());
  }, [currentUser]);

  const handleUpdateProfile = useCallback(async (userId: number, updatedData: Partial<Omit<User, 'id'>>) => {
    const updatedUser = await api.updateUserProfile(userId, updatedData);
    if (currentUser?.id === userId) {
      setCurrentUser(updatedUser);
    }
    const [fetchedUsers, fetchedPosts] = await Promise.all([api.getUsers(), api.getPosts()]);
    setAllUsers(fetchedUsers);
    setPosts(fetchedPosts);
  }, [currentUser?.id]);


  const handleSetNickname = useCallback(async (userId: number, nickname: string) => {
    const newNicknames = await api.setNickname(userId, nickname);
    setNicknames(newNicknames);
  }, []);

  const handleOpenChat = useCallback((userId: number) => {
    if (!currentUser || userId === currentUser.id) return;
    setOpenChats(prevOpenChats => {
      if (prevOpenChats.includes(userId)) {
        return prevOpenChats;
      }
      return [...prevOpenChats, userId];
    });
  }, [currentUser]);

  const handleCloseChat = useCallback((userId: number) => {
    setOpenChats(prev => prev.filter(id => id !== userId));
  }, []);

  const handleSendMessage = useCallback(async (toUserId: number, text: string) => {
    if (!currentUser) return;
    await api.sendMessage(currentUser, toUserId, text);
    setMessages(await api.getMessages());
  }, [currentUser]);

  const navigateToProfile = (userId: number) => setView({ page: 'profile', userId });
  const navigateToHome = () => setView({ page: 'home' });

  const handleLogin = async (name: string, password: string): Promise<boolean> => {
    const user = await api.login(name, password);
    if (user) {
        setCurrentUser(user);
        const [fetchedUsers, fetchedPosts, fetchedNicknames, fetchedMessages] = await Promise.all([
          api.getUsers(),
          api.getPosts(),
          api.getNicknames(),
          api.getMessages()
        ]);
        setAllUsers(fetchedUsers);
        setPosts(fetchedPosts);
        setNicknames(fetchedNicknames);
        setMessages(fetchedMessages);
        return true;
    }
    return false;
  };
    
  const handleRegister = async (userData: Omit<User, 'id'>) => {
      const newUser = await api.register(userData);
      setCurrentUser(newUser);
      const [fetchedUsers, fetchedNicknames, fetchedMessages] = await Promise.all([
        api.getUsers(),
        api.getNicknames(),
        api.getMessages(),
      ]);
      setAllUsers(fetchedUsers);
      setNicknames(fetchedNicknames);
      setMessages(fetchedMessages);
      setPosts([]);
      setIsEditingNewProfile(true);
  };

  const handleLogout = async () => {
      await api.logout();
      setCurrentUser(null);
      setPosts([]);
      setAllUsers([]);
      setNicknames({});
      setMessages({});
      setOpenChats([]);
      setView({ page: 'home' });
  };
  
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-color)' }}>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>Carregando Yestochi...</h1>
        </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const profileUser = view.page === 'profile' ? allUsers.find(u => u.id === view.userId) : null;

  return (
    <CurrentUserProvider value={currentUser}>
      {isEditingNewProfile && (
        <EditProfileModal
          user={currentUser}
          onSave={(updatedData) => {
            handleUpdateProfile(currentUser.id, updatedData);
            setIsEditingNewProfile(false);
          }}
          onClose={() => setIsEditingNewProfile(false)}
          isInitialSetup={true}
        />
      )}
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
        <Header 
          onNavigateToHome={navigateToHome} 
          onNavigateToProfile={navigateToProfile}
          nicknames={nicknames}
          allUsers={allUsers}
          onOpenChat={handleOpenChat}
          onLogout={handleLogout}
        />
        <main className="flex justify-center px-4 pt-20">
          <div className="w-full max-w-[1500px] grid grid-cols-1 lg:grid-cols-[1fr_2.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr] gap-6">
            <aside className="hidden lg:block">
              <LeftSidebar onNavigateToProfile={navigateToProfile} nicknames={nicknames} />
            </aside>
            
            <section>
              {view.page === 'home' && (
                <MainContent 
                  posts={posts}
                  onCreatePost={handleCreatePost}
                  onLike={handleLikePost}
                  onAddComment={handleAddComment}
                  onNavigateToProfile={navigateToProfile}
                  nicknames={nicknames}
                  getUserDisplayName={getUserDisplayName}
                  showToast={showToast}
                />
              )}
              {view.page === 'profile' && profileUser && (
                <ProfilePage
                  user={profileUser}
                  posts={posts}
                  allUsers={allUsers}
                  onCreatePost={handleCreatePost}
                  onLike={handleLikePost}
                  onAddComment={handleAddComment}
                  onNavigateToProfile={navigateToProfile}
                  onUpdateProfile={handleUpdateProfile}
                  nicknames={nicknames}
                  onSetNickname={handleSetNickname}
                  onOpenChat={handleOpenChat}
                  getUserDisplayName={getUserDisplayName}
                  showToast={showToast}
                />
              )}
            </section>

            <aside className="hidden lg:block">
              <RightSidebar nicknames={nicknames} onOpenChat={handleOpenChat} getUserDisplayName={getUserDisplayName} />
            </aside>
          </div>
        </main>
        <ChatManager
          openChatUserIds={openChats}
          allUsers={allUsers}
          messages={messages}
          onSendMessage={handleSendMessage}
          onCloseChat={handleCloseChat}
          nicknames={nicknames}
          getUserDisplayName={getUserDisplayName}
        />
        {toastMessage && (
          <div className="fixed bottom-5 right-5 bg-gray-900 text-white py-2 px-5 rounded-lg shadow-lg z-50">
            {toastMessage}
          </div>
        )}
      </div>
    </CurrentUserProvider>
  );
};

export default App;
