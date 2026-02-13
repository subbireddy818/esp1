/**
 * BattleZone — Mock Data
 * Dummy data for all entities until backend is connected
 */
// ── Enums & Types ──
export type TournamentCategory = 'weekly' | 'monthly' | 'yearly';
export type TournamentFormat = 'solo' | 'duo' | 'squad';
export type SlotStatus = 'open' | 'locked' | 'reserved';

// ── Stats Interfaces ──
export interface ModeStats {
    matches: number;
    booyahs: number;
    kills: number;
    deaths: number;
    kda: number;
    winRate: number;
    avgSurvivalTime: string; // e.g. "12:30"
    top10: number;
}

export interface PlayerStats {
    solo: ModeStats;
    duo: ModeStats;
    squad: ModeStats;
    totalKills: number;
    totalBooyahs: number;
    mvpCount: number;
    headshotRate: number;
}

// ── Users ──
export interface User {
    id: string;
    username: string;
    avatar?: string;
    uid: string; // Free Fire UID
    gameName?: string; // In-game name
    phone: string;
    email?: string; // Added for auth
    password?: string; // Added for auth (mock)
    role?: 'admin' | 'creator' | 'user'; // Added for auth
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'conqueror';
    elo: number;
    walletBalance: number;
    guildId?: string;
    isAdmin: boolean;
    kycVerified: boolean;
    createdAt: string;
    stats: PlayerStats;
    seasonalTitles: string[]; // e.g., "Weekly Conqueror"
    bannedFrom: string[]; // IDs of creators who banned this user
}

const defaultStats: ModeStats = { matches: 0, booyahs: 0, kills: 0, deaths: 0, kda: 0.0, winRate: 0.0, avgSurvivalTime: '00:00', top10: 0 };

export const currentUser: User = {
    id: 'u1',
    username: 'ShadowStrike',
    gameName: 'Shadow_FF',
    avatar: undefined,
    uid: '1234567890',
    phone: '+919876543210',
    email: 'user@sys.com',
    password: 'user',
    role: 'user',
    tier: 'diamond',
    elo: 2450,
    walletBalance: 2500,
    guildId: 'g1',
    isAdmin: false,
    kycVerified: true,
    createdAt: '2025-06-15T00:00:00Z',
    stats: {
        solo: { matches: 150, booyahs: 12, kills: 450, deaths: 138, kda: 3.26, winRate: 8.0, avgSurvivalTime: '14:20', top10: 45 },
        duo: { matches: 80, booyahs: 8, kills: 200, deaths: 72, kda: 2.77, winRate: 10.0, avgSurvivalTime: '12:10', top10: 20 },
        squad: { matches: 252, booyahs: 45, kills: 1243, deaths: 207, kda: 6.00, winRate: 17.8, avgSurvivalTime: '16:45', top10: 110 },
        totalKills: 1893,
        totalBooyahs: 65,
        mvpCount: 12,
        headshotRate: 42.5,
    },
    seasonalTitles: ['Weekly Conqueror'],
    bannedFrom: [],
};

export const mockUsers: User[] = [
    currentUser,
    {
        id: 'admin1', username: 'SystemAdmin', uid: '0000000000', phone: '+910000000000',
        email: 'admin@sys.com', password: 'admin', role: 'admin',
        tier: 'conqueror', elo: 9999, walletBalance: 999999, isAdmin: true, kycVerified: true, createdAt: '2025-01-01T00:00:00Z',
        stats: { ...currentUser.stats }, seasonalTitles: ['System God'], bannedFrom: []
    },
    {
        id: 'creator1', username: 'OpsManager', uid: '1111111111', phone: '+911111111111',
        email: 'creator@sys.com', password: 'creator', role: 'creator',
        tier: 'platinum', elo: 2000, walletBalance: 5000, isAdmin: false, kycVerified: true, createdAt: '2025-02-01T00:00:00Z',
        stats: { ...currentUser.stats }, seasonalTitles: ['Tournament Host'], bannedFrom: []
    },
    {
        id: 'creator2', username: 'BattleMaster', uid: '2222222222', phone: '+912222222222',
        email: 'battle@sys.com', password: 'battle', role: 'creator',
        tier: 'diamond', elo: 2500, walletBalance: 8000, isAdmin: false, kycVerified: true, createdAt: '2025-03-01T00:00:00Z',
        stats: { ...currentUser.stats }, seasonalTitles: ['Arena Pro'], bannedFrom: []
    },
    {
        id: 'u2', username: 'BlazeKiller', uid: '2345678901', phone: '+919876543211',
        tier: 'conqueror', elo: 3100, walletBalance: 5200, isAdmin: false, kycVerified: true, createdAt: '2025-05-10T00:00:00Z',
        stats: { ...currentUser.stats, totalKills: 3421, totalBooyahs: 120 }, seasonalTitles: ['Monthly Predator'], bannedFrom: []
    },
];

// ── Tournaments & Slots ──
export interface TournamentSlot {
    id: number; // 1-52
    status: SlotStatus;
    userId?: string; // For Solo
    teamId?: string; // For Duo/Squad
}

export interface TeamMember {
    userId: string;
    role: 'main' | 'sub';
    gameName?: string;
}

export interface Team {
    id: string;
    name: string;
    captainId: string;
    members: TeamMember[];
    tournamentId: string;
}

export interface Tournament {
    id: string;
    title: string;
    category: TournamentCategory;
    type: TournamentFormat;
    entryFee: number;
    prizePool: number;
    maxPlayers: number; // 52, 26 (teams), 13 (teams)
    currentPlayers: number;
    status: 'upcoming' | 'live' | 'completed' | 'cancelled';
    startTime: string;
    endTime?: string;
    map: string;
    slots: TournamentSlot[]; // The 52-slot grid
    creatorId: string; // ID of the creator who launched it
}

const now = new Date();
const in30min = new Date(now.getTime() + 30 * 60 * 1000);
const in2hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
const in5hours = new Date(now.getTime() + 5 * 60 * 60 * 1000);
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

// Helper to generate empty slots
const generateSlots = (count: number): TournamentSlot[] =>
    Array.from({ length: count }, (_, i) => ({ id: i + 1, status: 'open' }));

export const mockTournaments: Tournament[] = [
    {
        id: 't1',
        title: 'Midnight Mayhem',
        category: 'weekly',
        type: 'squad',
        entryFee: 40,
        prizePool: 5000,
        maxPlayers: 13, // 13 Squads = 52 players
        currentPlayers: 11,
        status: 'upcoming',
        startTime: in30min.toISOString(),
        map: 'Bermuda',
        slots: generateSlots(13),
        creatorId: 'creator1',
    },
    {
        id: 't2',
        title: 'Neon Clash Free',
        category: 'weekly',
        type: 'solo',
        entryFee: 0,
        prizePool: 500,
        maxPlayers: 52,
        currentPlayers: 38,
        status: 'upcoming',
        startTime: in2hours.toISOString(),
        map: 'Kalahari',
        slots: Array.from({ length: 52 }, (_, i) => ({
            id: i + 1,
            status: i < 15 ? 'locked' : 'open',
            userId: i < 15 ? `u${(i % 5) + 1}` : undefined
        })),
        creatorId: 'creator1',
    },
    {
        id: 't3',
        title: 'Inferno Duo Cup',
        category: 'monthly',
        type: 'duo',
        entryFee: 30,
        prizePool: 3000,
        maxPlayers: 26, // 26 Duos = 52 players
        currentPlayers: 26,
        status: 'live',
        startTime: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
        map: 'Purgatory',
        slots: generateSlots(26),
        creatorId: 'creator2',
    },
    {
        id: 't4',
        title: 'Royal Rampage',
        category: 'yearly',
        type: 'squad',
        entryFee: 40,
        prizePool: 10000,
        maxPlayers: 13,
        currentPlayers: 5,
        status: 'upcoming',
        startTime: in5hours.toISOString(),
        map: 'Bermuda',
        slots: generateSlots(13),
        creatorId: 'creator2',
    },
    {
        id: 't5',
        title: 'Shadow Strike Solo',
        category: 'weekly',
        type: 'solo',
        entryFee: 20,
        prizePool: 1500,
        maxPlayers: 52,
        currentPlayers: 52,
        status: 'completed',
        startTime: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        map: 'Alpine',
        slots: generateSlots(52),
        creatorId: 'creator1',
    },
    {
        id: 't6',
        title: 'Thunder Arena',
        category: 'monthly',
        type: 'duo',
        entryFee: 0,
        prizePool: 800,
        maxPlayers: 26,
        currentPlayers: 12,
        status: 'upcoming',
        startTime: tomorrow.toISOString(),
        map: 'Bermuda',
        slots: generateSlots(26),
        creatorId: 'creator2',
    },
    {
        id: 't7',
        title: 'Endzone Elite Solo',
        category: 'weekly',
        type: 'solo',
        entryFee: 10,
        prizePool: 1000,
        maxPlayers: 52,
        currentPlayers: 52,
        status: 'completed',
        startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString(),
        map: 'Bermuda',
        slots: generateSlots(52),
        creatorId: 'creator2',
    },
];

// ── Extended Tournament Detail ──
export interface TournamentDetail extends Tournament {
    roomId?: string;
    roomPassword?: string;
    rules: string[];
    prizes: { place: string; amount: number }[];
    registered?: string[]; // User IDs that are registered
    registeredTeams?: Team[]; // For Duo/Squad logic
}

export const mockTournamentDetails: Record<string, TournamentDetail> = {
    t1: {
        ...mockTournaments[0],
        roomId: 'BZ-881234',
        roomPassword: 'fury2026',
        rules: [
            'No teaming up with other squads',
            'No use of hacks or exploits',
            'Results must be submitted within 15 minutes',
            'Admin decision is final',
        ],
        prizes: [
            { place: '1st', amount: 2500 },
            { place: '2nd', amount: 1500 },
            { place: '3rd', amount: 700 },
            { place: 'Per Kill', amount: 15 },
        ],
        // Pre-fill some slots for simulation
        slots: mockTournaments[0].slots.map(s => s.id <= 11 ? { ...s, status: 'locked', teamId: `team_${s.id}` } : s),
        registered: [],
    },
    t2: {
        ...mockTournaments[1],
        roomId: 'BZ-772345',
        roomPassword: 'solo2026',
        rules: ['Solo mode only', 'No camping in final zone', 'Upload end screenshot'],
        prizes: [
            { place: '1st', amount: 250 },
            { place: '2nd', amount: 150 },
            { place: '3rd', amount: 100 },
        ],
        slots: mockTournaments[1].slots.map(s => s.id <= 38 ? { ...s, status: 'locked', userId: `u${(s.id % 5) + 1}` } : s),
        registered: [],
    },
};

// ── Guilds ──
export interface Guild {
    id: string;
    name: string;
    tag: string;
    level: number;
    members: string[];
    leaderId: string;
    wins: number;
    totalMatches: number;
    createdAt: string;
}

export const mockGuilds: Guild[] = [
    {
        id: 'g1',
        name: 'Shadow Legion',
        tag: 'SL',
        level: 12,
        members: ['u1', 'u2', 'u5'],
        leaderId: 'u1',
        wins: 89,
        totalMatches: 145,
        createdAt: '2025-06-01T00:00:00Z',
    },
    {
        id: 'g2',
        name: 'Inferno Squad',
        tag: 'IS',
        level: 8,
        members: ['u3', 'u4'],
        leaderId: 'u3',
        wins: 45,
        totalMatches: 98,
        createdAt: '2025-07-15T00:00:00Z',
    },
];

// ── Wallet Transactions ──
export interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
}

export const mockTransactions: Transaction[] = [
    { id: 'tx1', type: 'credit', amount: 500, description: 'Won Midnight Mayhem', date: '2026-02-12T20:00:00Z', status: 'completed' },
    { id: 'tx2', type: 'debit', amount: 50, description: 'Entry: Midnight Mayhem', date: '2026-02-12T19:00:00Z', status: 'completed' },
    { id: 'tx3', type: 'credit', amount: 100, description: 'Referral Bonus', date: '2026-02-11T10:00:00Z', status: 'completed' },
    { id: 'tx4', type: 'debit', amount: 30, description: 'Entry: Inferno Duo Cup', date: '2026-02-10T18:00:00Z', status: 'completed' },
    { id: 'tx5', type: 'credit', amount: 2000, description: 'Added money', date: '2026-02-09T12:00:00Z', status: 'completed' },
    { id: 'tx6', type: 'debit', amount: 1000, description: 'Withdrawal to UPI', date: '2026-02-08T15:00:00Z', status: 'pending' },
];

// ── Leaderboard ──
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    kills: number;
    placementPoints: number;
    totalPoints: number;
    tier: User['tier'];
}

export const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: 'u2', username: 'BlazeKiller', kills: 14, placementPoints: 15, totalPoints: 43, tier: 'conqueror' },
    { rank: 2, userId: 'u5', username: 'ThunderBolt', kills: 11, placementPoints: 12, totalPoints: 34, tier: 'diamond' },
    { rank: 3, userId: 'u1', username: 'ShadowStrike', kills: 9, placementPoints: 10, totalPoints: 28, tier: 'diamond' },
    { rank: 4, userId: 'u4', username: 'VenomRage', kills: 7, placementPoints: 8, totalPoints: 22, tier: 'gold' },
    { rank: 5, userId: 'u3', username: 'NightFury', kills: 5, placementPoints: 6, totalPoints: 16, tier: 'platinum' },
];

// ── Notifications ──
export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: 'match' | 'reward' | 'system' | 'guild';
    read: boolean;
    date: string;
}

export const mockNotifications: AppNotification[] = [
    { id: 'n1', title: 'Match Starting!', message: 'Midnight Mayhem starts in 10 minutes. Room ID is now visible!', type: 'match', read: false, date: '2026-02-12T23:30:00Z' },
    { id: 'n2', title: 'You Won ₹500!', message: 'Congratulations! Your winnings from Shadow Strike Solo have been credited.', type: 'reward', read: false, date: '2026-02-12T20:00:00Z' },
    { id: 'n3', title: 'New Tournament', message: 'Royal Rampage with ₹10,000 prize pool is now open for registration!', type: 'system', read: true, date: '2026-02-12T12:00:00Z' },
    { id: 'n4', title: 'Guild Challenge', message: 'Inferno Squad has challenged your guild to a match!', type: 'guild', read: true, date: '2026-02-11T15:00:00Z' },
];
