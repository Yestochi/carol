import type { User, Post } from '../types';

export const currentUser: User = {
  id: 1,
  name: 'Mark Zuckerbot',
  password: 'password123',
  profilePicture: 'https://picsum.photos/seed/mark/200/200',
  coverPhoto: 'https://picsum.photos/seed/mark-cover/1000/300',
  profileColor: '#1877F2',
  backgroundColor: '#f0f2f5',
  font: 'Segoe UI',
  bio: 'Fundador e CEO da Yestochi. Conectando o mundo.',
};

export const users: User[] = [
  currentUser,
  { id: 2, name: 'Eduardo Saverin', password: 'password123', profilePicture: 'https://picsum.photos/seed/eduardo/200/200', coverPhoto: 'https://picsum.photos/seed/eduardo-cover/1000/300', bio: 'Cofundador e primeiro investidor anjo da Yestochi.' },
  { id: 3, name: 'Dustin Moskovitz', password: 'password123', profilePicture: 'https://picsum.photos/seed/dustin/200/200', coverPhoto: 'https://picsum.photos/seed/dustin-cover/1000/300' },
  { id: 4, name: 'Chris Hughes', password: 'password123', profilePicture: 'https://picsum.photos/seed/chris/200/200', coverPhoto: 'https://picsum.photos/seed/chris-cover/1000/300' },
  { id: 5, name: 'Sean Parker', password: 'password123', profilePicture: 'https://picsum.photos/seed/sean/200/200', coverPhoto: 'https://picsum.photos/seed/sean-cover/1000/300' },
  { id: 6, name: 'Divya Narendra', password: 'password123', profilePicture: 'https://picsum.photos/seed/divya/200/200', coverPhoto: 'https://picsum.photos/seed/divya-cover/1000/300' },
  { id: 7, name: 'Cameron Winklevoss', password: 'password123', profilePicture: 'https://picsum.photos/seed/cameron/200/200', coverPhoto: 'https://picsum.photos/seed/cameron-cover/1000/300' },
  { id: 8, name: 'Tyler Winklevoss', password: 'password123', profilePicture: 'https://picsum.photos/seed/tyler/200/200', coverPhoto: 'https://picsum.photos/seed/tyler-cover/1000/300' },
];

export const initialPosts: Post[] = [
  {
    id: 1,
    user: users[1],
    text: 'Acabei de lançar o Yestochi.com! É um diretório online que conecta pessoas através de redes sociais em faculdades. Muito animado para ver onde isso vai dar.',
    timestamp: '18 anos atrás',
    likes: 12,
    isLiked: false,
    comments: [
      { id: 1, user: users[2], text: 'Isso vai ser gigante!', timestamp: '18 anos atrás' },
      { id: 2, user: users[3], text: 'Parabéns pelo lançamento!', timestamp: '18 anos atrás' },
    ],
  },
  {
    id: 2,
    user: users[4],
    text: 'Um milhão não é legal. Sabe o que é legal? Um bilhão.',
    image: 'https://picsum.photos/seed/billion/600/400',
    timestamp: '14 anos atrás',
    likes: 1500,
    isLiked: true,
    comments: [
      { id: 3, user: currentUser, text: 'Tire o "The". Apenas Yestochi. É mais limpo.', timestamp: '14 anos atrás' },
      { id: 4, user: users[1], text: 'Conselho icônico.', timestamp: '14 anos atrás' },
    ],
  },
  {
    id: 3,
    user: users[2],
    text: 'Sessão de codificação noturna abastecida por pizza e energéticos. Construindo o futuro!',
    timestamp: '18 anos atrás',
    likes: 5,
    isLiked: false,
    comments: [],
  },
   {
    id: 4,
    user: users[3],
    text: 'Acabei de terminar minhas provas finais. Hora de relaxar e curtir o verão!',
    image: 'https://picsum.photos/seed/summer/600/400',
    timestamp: '1 ano atrás',
    likes: 78,
    isLiked: false,
    comments: [
      { id: 5, user: users[1], text: 'Tenha um ótimo verão!', timestamp: '1 ano atrás' },
    ],
  },
];