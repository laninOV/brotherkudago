import type { Place } from '../model/place'

export const PLACES: Place[] = [
  {
    id: 'patriarshie',
    title: 'Патриаршие пруды',
    category: 'walk',
    tags: ['прогулка', 'парк', 'атмосфера'],
    address: 'Москва, Патриаршие пруды',
    lat: 55.7636,
    lng: 37.5937,
    openNow: true,
    durationMin: 90,
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Тихий маршрут для прогулки в центре: вода, аллеи, уютные дворы и кафе рядом. Лучше всего — вечером или утром в будний день.',
  },
  {
    id: 'gorky-park',
    title: 'Парк Горького',
    category: 'place',
    tags: ['парк', 'активности', 'набережная'],
    address: 'Москва, Крымский вал, 9',
    lat: 55.7299,
    lng: 37.6032,
    openNow: true,
    durationMin: 120,
    image:
      'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1520975958225-71bb0bd1a58e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Большой парк для прогулок и активностей: набережная, прокат, кофейни, выставки. Можно совместить с музеями рядом.',
  },
  {
    id: 'coffee-lab',
    title: 'Coffee Lab',
    category: 'cafe',
    tags: ['кофе', 'десерты', 'тихо'],
    address: 'Москва, Мясницкая',
    lat: 55.7646,
    lng: 37.6354,
    openNow: true,
    price: '$$',
    durationMin: 60,
    image:
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1445077100181-a33e9ac94db0?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Тихое место, чтобы поработать или встретиться: спешелти‑кофе, десерты, столы у окна и приятный свет.',
  },
  {
    id: 'wine-bar',
    title: 'Винный бар на углу',
    category: 'cafe',
    tags: ['вино', 'на свидание', 'вечер'],
    address: 'Москва, Тверская',
    lat: 55.7648,
    lng: 37.6052,
    openNow: false,
    price: '$$$',
    durationMin: 90,
    image:
      'https://images.unsplash.com/photo-1527168027773-0cc890c4f76c?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1527168027773-0cc890c4f76c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1464306076886-da185f6a9d3b?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Для вечера и разговоров: винная карта, мягкий свет и небольшие закуски. Лучше бронировать столик заранее.',
  },
  {
    id: 'art-center',
    title: 'Выставка современного искусства',
    category: 'event',
    tags: ['события', 'выставка', 'новое'],
    address: 'Москва, центр',
    lat: 55.7522,
    lng: 37.6156,
    openNow: true,
    price: '$$',
    durationMin: 80,
    image:
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1520697222865-0d8f4f4b3a2e?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Небольшая выставка с понятной навигацией: можно зайти на 30–60 минут и выбрать несколько работ для “своего” маршрута.',
  },
  {
    id: 'goncharnaya',
    title: 'Гончарная мастерская',
    category: 'event',
    tags: ['мастер-класс', 'керамика', 'для двоих'],
    address: 'м. Трубная — Петровский бульвар 9 стр. 2',
    lat: 55.7686075,
    lng: 37.6147469,
    price: '$$',
    durationMin: 90,
    url: 'https://гончарнаямастерская.рф/',
    image: 'https://static.tildacdn.com/tild6339-6364-4063-b532-323031346130/MGbu2NfarmA.png',
    photos: [
      'https://static.tildacdn.com/tild6339-6364-4063-b532-323031346130/MGbu2NfarmA.png',
      'https://static.tildacdn.com/tild3066-3839-4231-a238-346632663932/9HOSDI4ywGo-min.jpg',
      'https://static.tildacdn.com/tild3437-6164-4139-b634-353632646666/qbzcfQPmv3c-min.jpg',
    ],
    description:
      'Гончарная мастерская в Москве для детей и взрослых: мастер‑классы по гончарному делу, праздники, курсы и свидания. Расписание и адреса студий — на сайте.',
  },
]
