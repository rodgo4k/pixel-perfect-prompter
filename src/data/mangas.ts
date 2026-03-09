import mangaCover1 from "@/assets/manga-cover-1.jpg";
import mangaCover2 from "@/assets/manga-cover-2.jpg";
import mangaCover3 from "@/assets/manga-cover-3.jpg";
import mangaCover4 from "@/assets/manga-cover-4.jpg";
import mangaCover5 from "@/assets/manga-cover-5.jpg";
import mangaCover6 from "@/assets/manga-cover-6.jpg";
import vagabondCover from "@/assets/vagabond-cover.jpg";
import trendingManga from "@/assets/trending-manga.jpg";

export interface Manga {
  slug: string;
  title: string;
  cover: string;
  description: string;
  author: string;
  artist: string;
  status: string;
  demographic: string;
  genres: string[];
  chapters: { number: string; title: string; group: string; date: string }[];
}

export const mangas: Manga[] = [
  {
    slug: "vagabond",
    title: "Vagabond",
    cover: vagabondCover,
    description:
      "Aos dezessete anos de idade, Miyamoto Musashi – ainda conhecido por seu nome de infância, Shinmen Takezo – era um jovem bruto selvagem iniciando o caminho da espada. No rescaldo da épica Batalha de Sekigahara, Takezo se vê como um sobrevivente fugitivo do lado perdedor da guerra. A natureza cruel de Takezo fez dele um pária, mesmo em sua própria aldeia, e ele é caçado como um animal.",
    author: "Inoue Takehiko",
    artist: "Inoue Takehiko",
    status: "Em hiato",
    demographic: "Seinen",
    genres: ["Ação", "Aventura", "Drama", "Histórico", "Artes Marciais"],
    chapters: [
      { number: "327", title: "O Homem chamado Musashi", group: "Vagabond Scans", date: "há 2 meses" },
      { number: "326", title: "O Último Duelo", group: "Vagabond Scans", date: "há 2 meses" },
      { number: "325", title: "Além do Horizonte", group: "Vagabond Scans", date: "há 3 meses" },
      { number: "324", title: "Espada e Alma", group: "Vagabond Scans", date: "há 3 meses" },
      { number: "323", title: "Caminho do Guerreiro", group: "Vagabond Scans", date: "há 4 meses" },
    ],
  },
  {
    slug: "night-flower",
    title: "Night Flower",
    cover: mangaCover1,
    description:
      "Em um Japão feudal mergulhado em conflitos, uma jovem guerreira busca vingança pela destruição de sua aldeia. Com habilidades únicas herdadas de seu mestre, ela percorre caminhos sombrios enfrentando inimigos poderosos enquanto descobre segredos sobre seu próprio passado.",
    author: "Sakura Yumi",
    artist: "Sakura Yumi",
    status: "Em lançamento",
    demographic: "Jousei",
    genres: ["Drama", "Romance", "Histórico"],
    chapters: [
      { number: "1", title: "Pétalas ao Vento", group: "Mai_Yes_Vintage_Manga", date: "há 1 mês" },
    ],
  },
  {
    slug: "reino-sombrio",
    title: "Reino Sombrio",
    cover: mangaCover2,
    description:
      "Nas profundezas de um reino esquecido, criaturas ancestrais despertam após séculos de sono. Um grupo improvável de heróis — um espadachim cego, uma feiticeira exilada e um ladrão com coração de ouro — deve unir forças para impedir que a escuridão consuma o mundo dos vivos.",
    author: "Tanaka Hiroshi",
    artist: "Tanaka Hiroshi",
    status: "Em lançamento",
    demographic: "Shounen",
    genres: ["Fantasia", "Aventura", "Ação"],
    chapters: Array.from({ length: 12 }, (_, i) => ({
      number: String(12 - i),
      title: `Capítulo ${12 - i}`,
      group: "Kingdom Scans",
      date: "há 1 mês",
    })),
  },
  {
    slug: "assassin-no-kyuujitsu",
    title: "Assassin no Kyuujitsu",
    cover: mangaCover3,
    description:
      "Um assassino profissional leva uma vida dupla: durante a semana, ele é um empregado de escritório comum. Nos fins de semana, ele trabalha como assassino de aluguel. Mas o que ele realmente ama são os pequenos prazeres da vida — sorvete, passeios com seu cão e cozinhar frango.",
    author: "Morita Yuu",
    artist: "Morita Yuu",
    status: "Em lançamento",
    demographic: "Jousei",
    genres: ["Comédia", "Fatia de Vida"],
    chapters: [
      { number: "3", title: "Frango", group: "Double Scan", date: "há 1 mês" },
      { number: "2", title: "Cão", group: "Double Scan", date: "há 1 mês" },
      { number: "1", title: "Sorvete", group: "Double Scan", date: "há 1 mês" },
    ],
  },
  {
    slug: "the-bloody-merchant-empress",
    title: "The Bloody Merchant Empress",
    cover: mangaCover4,
    description:
      "Em uma China antiga repleta de intrigas políticas, uma jovem mercadora ascende ao poder após a morte misteriosa de seu pai. Enfrentando traições, complôs e assassinos, ela deve usar sua astúcia e determinação para sobreviver e construir um império comercial.",
    author: "Liu Wei",
    artist: "Liu Wei",
    status: "Em lançamento",
    demographic: "Jousei",
    genres: ["Drama", "Histórico", "Romance"],
    chapters: Array.from({ length: 11 }, (_, i) => ({
      number: String(11 - i),
      title: ["Irmãs", "Bullying", "Zhu Yao", "Tratamento", "Pavilhão de Ling", "O Assassino", "", "Paciência", "Reunião", "Renascimento", "Início"][i],
      group: "Cervo Scanlator",
      date: "há 1 mês",
    })),
  },
  {
    slug: "height-difference",
    title: "Height Difference",
    cover: mangaCover5,
    description:
      "Uma comédia romântica sobre a diferença de altura entre dois estudantes universitários que acabam se apaixonando apesar de suas diferenças físicas e de personalidade.",
    author: "Kimura Aya",
    artist: "Kimura Aya",
    status: "Em lançamento",
    demographic: "Jousei",
    genres: ["Romance", "Comédia"],
    chapters: [
      { number: "1", title: "Primeiro Encontro", group: "Manga Desu", date: "há 1 mês" },
    ],
  },
  {
    slug: "touhou-mamizou-san",
    title: "Touhou - Mamizou-san",
    cover: mangaCover6,
    description:
      "Um spin-off da série Touhou focado nas aventuras cotidianas de Mamizou Futatsuiwa enquanto ela navega entre o mundo dos humanos e dos youkai.",
    author: "ZUN",
    artist: "ZUN",
    status: "Em lançamento",
    demographic: "Jousei",
    genres: ["Fantasia", "Comédia", "Fatia de Vida"],
    chapters: [
      { number: "1", title: "A Chegada", group: "Touhou Scans Brasil", date: "há 1 mês" },
    ],
  },
  {
    slug: "yokai-tales",
    title: "Yokai Tales",
    cover: trendingManga,
    description:
      "Histórias sobrenaturais sobre yokais que vivem entre os humanos no Japão moderno, cada capítulo apresentando um yokai diferente e suas interações com o mundo humano.",
    author: "Hayashi Ren",
    artist: "Hayashi Ren",
    status: "Em lançamento",
    demographic: "Shounen",
    genres: ["Sobrenatural", "Fantasia", "Fatia de Vida"],
    chapters: [
      { number: "5", title: "Kitsune", group: "Yokai Scans", date: "há 2 semanas" },
      { number: "4", title: "Tanuki", group: "Yokai Scans", date: "há 3 semanas" },
      { number: "3", title: "Kappa", group: "Yokai Scans", date: "há 1 mês" },
    ],
  },
];

export const getMangaBySlug = (slug: string) => mangas.find((m) => m.slug === slug);
