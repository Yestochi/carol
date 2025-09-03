import { initialPosts, users as initialUsers } from './mockData';
import type { Post, User, Comment } from '../types';

const USERS_KEY = 'yestochi_users';
const POSTS_KEY = 'yestochi_posts';
const MESSAGES_KEY = 'yestochi_messages';
const NICKNAMES_KEY = 'yestochi_nicknames';
const LOGGED_IN_USER_ID_KEY = 'yestochi_loggedInUserId';

const SIMULATED_LATENCY = 200; // ms

// Helper to simulate async operations
const fakeNetworkRequest = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), SIMULATED_LATENCY);
    });
};

// Data access functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
    }
};

// Initialize storage with mock data if it's empty
export const init = () => {
    if (!localStorage.getItem(USERS_KEY)) {
        saveToStorage(USERS_KEY, initialUsers);
    }
    if (!localStorage.getItem(POSTS_KEY)) {
        saveToStorage(POSTS_KEY, initialPosts);
    }
    if (!localStorage.getItem(MESSAGES_KEY)) {
        saveToStorage(MESSAGES_KEY, {});
    }
    if (!localStorage.getItem(NICKNAMES_KEY)) {
        saveToStorage(NICKNAMES_KEY, {
            2: 'Wardo',
            3: 'Mosk',
            7: 'Winklevii',
            8: 'Winklevii',
        });
    }
};

// API Functions

// --- Users ---
export const getUsers = async (): Promise<User[]> => {
    const users = getFromStorage<User[]>(USERS_KEY, []);
    return fakeNetworkRequest(users);
};

export const getUser = async (userId: number): Promise<User | undefined> => {
    const users = await getUsers();
    return fakeNetworkRequest(users.find(u => u.id === userId));
};

export const login = async (name: string, password: string): Promise<User | null> => {
    const users = await getUsers();
    const user = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
    if (user) {
        saveToStorage(LOGGED_IN_USER_ID_KEY, user.id);
        return fakeNetworkRequest(user);
    }
    return fakeNetworkRequest(null);
};

export const register = async (userData: Omit<User, 'id'>): Promise<User> => {
    const users = await getUsers();
    const newUser: User = { ...userData, id: Date.now() };
    const updatedUsers = [...users, newUser];
    saveToStorage(USERS_KEY, updatedUsers);
    saveToStorage(LOGGED_IN_USER_ID_KEY, newUser.id);
    return fakeNetworkRequest(newUser);
};

export const logout = async (): Promise<void> => {
    localStorage.removeItem(LOGGED_IN_USER_ID_KEY);
    return fakeNetworkRequest(undefined);
};

export const getLoggedInUser = async (): Promise<User | null> => {
    const userId = getFromStorage<number | null>(LOGGED_IN_USER_ID_KEY, null);
    if (userId) {
        const user = await getUser(userId);
        return fakeNetworkRequest(user || null);
    }
    return fakeNetworkRequest(null);
};

export const updateUserProfile = async (userId: number, updatedData: Partial<Omit<User, 'id'>>): Promise<User> => {
    let users = await getUsers();
    let updatedUser: User | undefined;
    users = users.map(u => {
        if (u.id === userId) {
            updatedUser = { ...u, ...updatedData };
            return updatedUser;
        }
        return u;
    });
    saveToStorage(USERS_KEY, users);

    // Also update user data in posts and comments
    let posts = await getPosts();
    posts = posts.map(post => {
        let needsUpdate = false;
        let finalUser = { ...post.user };
        if (post.user.id === userId) {
            finalUser = { ...post.user, ...updatedData };
            needsUpdate = true;
        }
        const finalComments = post.comments.map(comment => {
            if (comment.user.id === userId) {
                needsUpdate = true;
                return { ...comment, user: { ...comment.user, ...updatedData } };
            }
            return comment;
        });
        return needsUpdate ? { ...post, user: finalUser, comments: finalComments } : post;
    });
    saveToStorage(POSTS_KEY, posts);
    
    if (!updatedUser) throw new Error("User not found");
    return fakeNetworkRequest(updatedUser);
};


// --- Posts ---
export const getPosts = async (): Promise<Post[]> => {
    const posts = getFromStorage<Post[]>(POSTS_KEY, []);
    return fakeNetworkRequest(posts);
};

export const getPostById = async (postId: number): Promise<Post | undefined> => {
    const posts = await getPosts();
    const post = posts.find(p => p.id === postId);
    return fakeNetworkRequest(post);
};

export const createPost = async (text: string, image: string | null | undefined, author: User): Promise<Post> => {
    const posts = await getPosts();
    const newPost: Post = {
        id: Date.now(),
        user: author,
        text,
        timestamp: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        comments: [],
        ...(image && { image }),
    };
    saveToStorage(POSTS_KEY, [newPost, ...posts]);
    return fakeNetworkRequest(newPost);
};

export const likePost = async (postId: number): Promise<Post> => {
    const posts = await getPosts();
    let likedPost: Post | undefined;
    const updatedPosts = posts.map(post => {
        if (post.id === postId) {
            likedPost = {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            };
            return likedPost;
        }
        return post;
    });
    saveToStorage(POSTS_KEY, updatedPosts);
    if (!likedPost) throw new Error("Post not found");
    return fakeNetworkRequest(likedPost);
};

export const addComment = async (postId: number, commentText: string, author: User): Promise<Comment> => {
    const posts = await getPosts();
    const newComment: Comment = {
        id: Date.now(),
        user: author,
        text: commentText,
        timestamp: new Date().toISOString()
    };
    const updatedPosts = posts.map(post => {
        if (post.id === postId) {
            return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
    });
    saveToStorage(POSTS_KEY, updatedPosts);
    return fakeNetworkRequest(newComment);
};

export const deletePost = async (postId: number): Promise<Post[]> => {
    let posts = await getPosts();
    posts = posts.filter(p => p.id !== postId);
    saveToStorage(POSTS_KEY, posts);
    return fakeNetworkRequest(posts);
};

// --- Nicknames ---
export const getNicknames = async (): Promise<Record<number, string>> => {
    const nicknames = getFromStorage<Record<number, string>>(NICKNAMES_KEY, {});
    return fakeNetworkRequest(nicknames);
};

export const setNickname = async (userId: number, nickname: string): Promise<Record<number, string>> => {
    const nicknames = await getNicknames();
    if (nickname) {
        nicknames[userId] = nickname;
    } else {
        delete nicknames[userId];
    }
    saveToStorage(NICKNAMES_KEY, nicknames);
    return fakeNetworkRequest(nicknames);
};

// --- Messages ---
export const getMessageKey = (userId1: number, userId2: number): string => {
    return [userId1, userId2].sort().join('-');
};

export const getMessages = async (): Promise<Record<string, Comment[]>> => {
    const messages = getFromStorage<Record<string, Comment[]>>(MESSAGES_KEY, {});
    return fakeNetworkRequest(messages);
};

export const sendMessage = async (fromUser: User, toUserId: number, text: string): Promise<Comment> => {
    const allMessages = await getMessages();
    const key = getMessageKey(fromUser.id, toUserId);
    const newMessage: Comment = {
        id: Date.now(),
        user: fromUser,
        text,
        timestamp: 'Agora'
    };
    const existing = allMessages[key] || [];
    allMessages[key] = [...existing, newMessage];
    saveToStorage(MESSAGES_KEY, allMessages);
    return fakeNetworkRequest(newMessage);
};
