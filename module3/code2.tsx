import { delay } from "../utils/delay";
import {
Character,
Anime,
CharacterStatistics,
} from "../types/character";

const characters: Character[] = [
    {
        id: 1,
        name: "Gon Freecss",
        image: "🟢",
        description: "Gon is a young Hunter who leaves his home to find his father and become a Hunter.",
        anime: "Hunter x Hunter",
        age: 12,
        gender: "Male",
    },
    {
        id: 2,
        name: "Killua Zoldyck",
        image: "⚡",
        description: "Killua is the best friend of Gon and comes from the famous Zoldyck assassin family.",
        anime: "Hunter x Hunter",
        age: 12,
        gender: "Male",
    },
    {
        id: 3,
        name: "Naruto Uzumaki",
        image: "🍥",
        description: "Naruto is a ninja who dreams of becoming Hokage and gaining recognition from his village.",
        anime: "Naruto",
        age: 17,
        gender: "Male",
    },
    {
        id: 4,
        name: "Monkey D. Luffy",
        image: "🏴‍☠️",
        description: "Luffy is a pirate who wants to become the Pirate King.",
        anime: "One Piece",
        age: 19,
        gender: "Male",
    },
    {
        id: 5,
        name: "Levi Ackerman",
        image: "⚔️",
        description:"Levi is one of the strongest soldiers in the Scout Regiment.",
        anime: "Attack on Titan",
        age: 30,
        gender: "Male",
    },
    {
        id: 6,
        name: "Mikasa Ackerman",
        image: "🧣",
        description: "Mikasa is an elite soldier and one of the strongest members of the Scout Regiment.",
        anime: "Attack on Titan",
        age: 19,
        gender: "Female",
    },
    ];

const animeList: Anime[] = [
    {
        id: 1,
        title: "Hunter x Hunter",
        episodes: 148,
        score: 9.1,
        year: 2011,
    },
    {
        id: 2,
        title: "Naruto",
        episodes: 220,
        score: 8.3,
        year: 2002,
    },
    {
        id: 3,
        title: "One Piece",
        episodes: 1100,
        score: 9.0,
        year: 1999,
    },
    {
        id: 4,
        title: "Attack on Titan",
        episodes: 89,
        score: 9.0,
        year: 2013,
    },
];

export async function fetchCharacters(): Promise<Character[]> {
    await delay(1200);
    return characters;
}

export async function fetchCharacter(id: number): Promise<Character> {
    await delay(1000); 
    const character = characters.find((item) => item.id === id);
    if (!character) { throw new Error("Character tidak ditemukan.");}
    return character;
}

export async function fetchAnime( characterId: number ): Promise<Anime[]> {
    await delay(1500);
    const character = characters.find( (item) => item.id === characterId );
    if (!character) {throw new Error("Anime character tidak ditemukan.");}
    return animeList.filter((anime) => anime.title === character.anime);
}

export async function fetchStatistics( characterId: number ): Promise<CharacterStatistics> {
    await delay(1300);

    const statistics: Record<number,CharacterStatistics> = {
        1: { popularity: 92, favorites: 180000, rank: 5},
        2: { popularity: 96, favorites: 220000,rank: 2},
        3: {popularity: 99,favorites: 500000,rank: 1},
        4: {popularity: 98, favorites: 450000,rank: 3},
        5: { popularity: 95,favorites: 300000,rank: 4},
        6: {popularity: 90,favorites: 190000,rank: 8},
    };

    const result = statistics[characterId];
    if (!result) { throw new Error("Statistics tidak ditemukan.");}
    return result;
}