export interface LeaderboardEntry {
  id: string;
  rank?: number;
  nickname: string;
  missionId: string;
  missionTitle: string;
  score: number; // 0 - 100
  energyPoints: number;
  date: string;
}

const STORAGE_KEY = 'healthy_heroes_leaderboard_v2';
const NICKNAME_KEY = 'healthy_heroes_player_nickname';

// Initial friendly PE demo records to seed the leaderboard
const INITIAL_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    nickname: 'SpeedyRunner',
    missionId: 'football_player',
    missionTitle: 'Football Player',
    score: 96,
    energyPoints: 2790,
    date: '2026-10-06'
  },
  {
    id: 'seed-2',
    nickname: 'AstroChef',
    missionId: 'astronaut',
    missionTitle: 'Astronaut',
    score: 92,
    energyPoints: 2410,
    date: '2026-10-06'
  },
  {
    id: 'seed-3',
    nickname: 'MayaActive',
    missionId: 'student_10',
    missionTitle: '10-Year-Old Student',
    score: 89,
    energyPoints: 1980,
    date: '2026-10-07'
  },
  {
    id: 'seed-4',
    nickname: 'MountainLeo',
    missionId: 'hiker',
    missionTitle: 'Mountain Hiker',
    score: 86,
    energyPoints: 2580,
    date: '2026-10-05'
  },
  {
    id: 'seed-5',
    nickname: 'AquaDolphin',
    missionId: 'swimmer',
    missionTitle: 'Swimmer',
    score: 82,
    energyPoints: 2650,
    date: '2026-10-06'
  }
];

export class LeaderboardService {
  /**
   * Retrieves all entries sorted by score descending.
   */
  public static getEntries(): LeaderboardEntry[] {
    if (typeof window === 'undefined') return INITIAL_LEADERBOARD_ENTRIES;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let list: LeaderboardEntry[] = [];
      if (raw) {
        list = JSON.parse(raw);
      } else {
        list = [...INITIAL_LEADERBOARD_ENTRIES];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      // Sort by score descending, secondary by energy accuracy
      list.sort((a, b) => b.score - a.score);

      // Assign dynamic rank numbers
      return list.map((entry, idx) => ({
        ...entry,
        rank: idx + 1
      }));
    } catch {
      return INITIAL_LEADERBOARD_ENTRIES;
    }
  }

  /**
   * Adds a new entry and saves it.
   */
  public static addEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry {
    const list = this.getEntries();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: `hero-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString().split('T')[0]
    };

    list.push(newEntry);
    list.sort((a, b) => b.score - a.score);

    // Keep top 50 scores
    const trimmed = list.slice(0, 50);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch {
        // Storage full fallback
      }
    }

    return newEntry;
  }

  /**
   * Stored player nickname management
   */
  public static getSavedNickname(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(NICKNAME_KEY) || '';
  }

  public static saveNickname(nickname: string): void {
    if (typeof window === 'undefined') return;
    const clean = nickname.trim().slice(0, 15);
    localStorage.setItem(NICKNAME_KEY, clean);
  }
}
