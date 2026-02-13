import {
    mockTournamentDetails,
    mockUsers,
    currentUser,
    TournamentSlot,
    Team,
    TeamMember
} from './mockData';

// Simulated delay for async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const TournamentService = {
    // getSlots: Returns slots for a tournament
    getSlots: async (tournamentId: string): Promise<TournamentSlot[]> => {
        await delay(500);
        const detail = mockTournamentDetails[tournamentId];
        return detail?.slots || [];
    },

    // registerSolo: Register current user for a specific slot
    registerSolo: async (tournamentId: string, slotId: number): Promise<{ success: boolean; message: string }> => {
        await delay(800);
        const detail = mockTournamentDetails[tournamentId];
        if (!detail) return { success: false, message: 'Tournament not found' };

        const slot = detail.slots.find(s => s.id === slotId);
        if (!slot) return { success: false, message: 'Slot not found' };

        if (slot.status !== 'open') {
            return { success: false, message: 'Slot is already taken' };
        }

        // Check if user is already registered in another slot
        const isAlreadyRegistered = detail.slots.some(s => s.userId === currentUser.id);
        if (isAlreadyRegistered) {
            return { success: false, message: 'Values.ALREADY_REGISTERED' }; // Simplified for now
        }

        // Optimistic update (in real app, this happens on backend)
        slot.status = 'locked';
        slot.userId = currentUser.id;
        detail.currentPlayers += 1;
        detail.registered = [...(detail.registered || []), currentUser.id]; // Backwards compatibility

        return { success: true, message: 'Successfully registered for slot #' + slotId };
    },

    // registerTeam: Register a team (Duo/Squad) for a specific slot
    registerTeam: async (
        tournamentId: string,
        slotId: number,
        teamName: string,
        members: string[] // Array of UIDs
    ): Promise<{ success: boolean; message: string }> => {
        await delay(1000);
        const detail = mockTournamentDetails[tournamentId];
        if (!detail) return { success: false, message: 'Tournament not found' };

        const slot = detail.slots.find(s => s.id === slotId);
        if (!slot || slot.status !== 'open') return { success: false, message: 'Slot unavailable' };

        // Validation: Unique UIDs
        const uniqueMembers = new Set(members);
        if (uniqueMembers.size !== members.length) {
            return { success: false, message: 'Duplicate players in team' };
        }

        // 1. Create Team Object
        const newTeam: Team = {
            id: `team_${Math.random().toString(36).substr(2, 9)}`,
            name: teamName,
            captainId: currentUser.id,
            tournamentId: tournamentId,
            members: members.map((uid, index) => ({
                userId: uid, // In real app, we'd lookup user ID from UID
                role: index === members.length - 1 ? 'sub' : 'main', // Last one is sub for now logic
                gameName: `Player_${uid.substr(-4)}` // Mock game name
            }))
        };

        // 2. Lock Slot
        slot.status = 'locked';
        slot.teamId = newTeam.id;

        // 3. Update Tournament Data
        detail.registeredTeams = [...(detail.registeredTeams || []), newTeam];

        // Update currentPlayers count (Squad=4, Duo=2 playing)
        const playersCount = detail.type === 'squad' ? 4 : 2;
        detail.currentPlayers += playersCount;

        return { success: true, message: `Team ${teamName} registered for Slot #${slotId}` };
    }
};
