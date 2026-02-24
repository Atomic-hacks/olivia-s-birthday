export interface BirthdayData {
  wishes: Array<{ id: string; message: string; sender: string; likes: number; pinned: boolean; createdAt: string }>;
  memories: Array<{ id: string; url: string; mediaType: 'image' | 'video'; caption: string; createdAt: string }>;
  playlist: Array<{ id: string; title: string; artist: string; addedBy: string; votes: number }>;
  wishlist: Array<{ id: string; item: string; note: string; priority: 'low' | 'medium' | 'high'; claimed: boolean }>;
  affirmations: string[];
  plans: Array<{ id: string; title: string; when: string; done: boolean }>;
  funMoments: string[];
  surpriseHistory: string[];
}

export const emptyBirthdayData: BirthdayData = {
  wishes: [],
  memories: [],
  playlist: [],
  wishlist: [],
  affirmations: [
    'You deserve softness, joy, and rooms that celebrate your presence.',
    'You are allowed to choose yourself this year.',
  ],
  plans: [
    { id: '1', title: 'Morning flowers and coffee', when: '9:00 AM', done: false },
    { id: '2', title: 'Golden hour photos', when: '5:30 PM', done: false },
  ],
  funMoments: [],
  surpriseHistory: [],
};
