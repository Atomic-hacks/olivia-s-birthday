'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Clapperboard,
  Gift,
  Heart,
  ListChecks,
  LogOut,
  Music2,
  PartyPopper,
  Sparkles,
  Star,
  Trash2,
  Upload,
  WandSparkles,
} from 'lucide-react';
import { BirthdayData, emptyBirthdayData } from '@/lib/birthday-data';

type TabId = 'welcome' | 'memories' | 'wishes' | 'playlist' | 'wishlist' | 'affirmations' | 'fun';

interface ProfileSession {
  profileId: string;
  name: string;
  birthday: string;
}

const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: 'welcome', label: 'Welcome', icon: Sparkles },
  { id: 'memories', label: 'Memories', icon: Clapperboard },
  { id: 'wishes', label: 'Wishes', icon: Heart },
  { id: 'playlist', label: 'Playlist', icon: Music2 },
  { id: 'wishlist', label: 'Wish List', icon: ListChecks },
  { id: 'affirmations', label: 'Affirmations', icon: Star },
  { id: 'fun', label: 'Fun Zone', icon: PartyPopper },
];

const localBackupKey = 'birthdayDataBackup';

const panelClass = 'rounded-3xl border border-fuchsia-200/35 bg-gradient-to-br from-pink-300/15 via-sky-300/10 to-indigo-300/10 p-5 shadow-xl shadow-fuchsia-900/20 backdrop-blur-sm md:p-6';
const inputClass = 'rounded-xl border border-white/30 bg-white/20 px-3 py-2 text-white placeholder:text-pink-100/70';
const buttonClass = 'rounded-xl bg-gradient-to-r from-pink-300 to-sky-300 px-4 py-2 font-semibold text-indigo-900 transition hover:brightness-105';

const complimentOptions = [
  'You light up every room effortlessly.',
  'You are elegance, kindness, and confidence in one.',
  'Your smile is pure celebration energy.',
  'You deserve a year full of soft joy and loud wins.',
  'You make people feel safe, seen, and special.',
  'You carry grace even on hard days.',
  'Your style is a whole mood on its own.',
  'You have the kind of energy people remember.',
  'You make ordinary moments feel special.',
  'You are soft-hearted and strong at the same time.',
  'You deserve friendships and love that feel easy and true.',
  'You are becoming more powerful every year.',
  'Your confidence is beautiful to witness.',
  'You turn care into an art form.',
  'You are unforgettable in the best way.',
];

const surpriseOptions = [
  'Sunset photo challenge with your best outfit.',
  'Make a voice note to your future self.',
  'Pick one song and do a tiny living-room dance break.',
  'Write a 3-line gratitude toast and read it out loud.',
  'Call someone you love and share one happy memory.',
  'Do a 5-minute mini makeover and take a mirror selfie.',
  'Pick a song and film a 10-second birthday reel.',
  'Write one bold goal for this new year of life.',
  'Send one appreciation text you have been meaning to send.',
  'Put on your favorite perfume and take a confident walk.',
  'Choose a color theme and style one birthday flat-lay shot.',
  'Order your comfort snack and enjoy it with zero guilt.',
  'Record three things you love about yourself today.',
  'Try a new lipstick shade and rate it out of 10.',
  'Create a tiny vision list for the next 12 months.',
  'Dance to your top party song for one full minute.',
  'Take one candid video you will love rewatching later.',
];

const pickFreshPrompt = (pool: string[], recent: string[], windowSize = 5) => {
  const recentSet = new Set(recent.slice(0, windowSize));
  const available = pool.filter((item) => !recentSet.has(item));
  if (available.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return available[Math.floor(Math.random() * available.length)];
};

const normalizeData = (raw: Partial<BirthdayData> | null | undefined): BirthdayData => ({
  ...emptyBirthdayData,
  ...(raw || {}),
  wishes: raw?.wishes || [],
  memories: raw?.memories || [],
  playlist: raw?.playlist || [],
  wishlist: raw?.wishlist || [],
  affirmations: raw?.affirmations || emptyBirthdayData.affirmations,
  plans: raw?.plans || emptyBirthdayData.plans,
  funMoments: raw?.funMoments || [],
  surpriseHistory: raw?.surpriseHistory || [],
});

const MainLayout = () => {
  const [profile, setProfile] = useState<ProfileSession | null>(null);
  const [formName, setFormName] = useState('');
  const [formBirthday, setFormBirthday] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('welcome');
  const [data, setData] = useState<BirthdayData>(emptyBirthdayData);
  const [introHidden, setIntroHidden] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [uploading, setUploading] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [wishForm, setWishForm] = useState({ sender: '', message: '' });
  const [songForm, setSongForm] = useState({ title: '', artist: '', addedBy: '' });
  const [wishlistForm, setWishlistForm] = useState({ item: '', note: '', priority: 'medium' as 'low' | 'medium' | 'high' });
  const [planForm, setPlanForm] = useState({ title: '', when: '' });
  const [affirmationDraft, setAffirmationDraft] = useState('');
  const [captionDraft, setCaptionDraft] = useState('');
  const [currentSurprise, setCurrentSurprise] = useState('');

  const persistData = (next: BirthdayData) => {
    const normalizedNext = normalizeData(next);
    setData(normalizedNext);
    localStorage.setItem(localBackupKey, JSON.stringify(normalizedNext));

    if (!profile) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSyncStatus('saving');

    saveTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch('/api/profile/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: normalizedNext }),
        });

        if (!response.ok) throw new Error('save failed');
        setSyncStatus('saved');
      } catch {
        setSyncStatus('error');
      }
    }, 500);
  };

  const loadCloudData = async () => {
    const response = await fetch('/api/profile/data', { cache: 'no-store' });
    const result = await response.json();
    if (response.ok && result.data) {
      const normalized = normalizeData(result.data as BirthdayData);
      setData(normalized);
      localStorage.setItem(localBackupKey, JSON.stringify(normalized));
    }
  };

  useEffect(() => {
    const backup = localStorage.getItem(localBackupKey);
    if (backup) {
      try {
        setData(normalizeData(JSON.parse(backup) as BirthdayData));
      } catch {
        setData(emptyBirthdayData);
      }
    }

    (async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const result = await response.json();
        if (result.profile) {
          setProfile(result.profile);
          await loadCloudData();
        }
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, []);

  useEffect(() => {
    gsap.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.children,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.06 },
    );
  }, [activeTab, profile]);

  const dismissIntro = () => {
    if (!introRef.current) {
      setIntroHidden(true);
      return;
    }

    gsap.to(introRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => setIntroHidden(true),
    });
  };

  const login = async () => {
    setAuthError('');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formName, birthday: formBirthday }),
    });
    const result = await response.json();

    if (!response.ok) {
      setAuthError(result.error || 'Login failed.');
      return;
    }

    setProfile(result.profile as ProfileSession);
    await loadCloudData();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setProfile(null);
    setCheckingAuth(false);
  };

  const uploadMedia = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => {
          const resourceType: 'image' | 'video' = file.type.startsWith('video') ? 'video' : 'image';

          const signRes = await fetch('/api/upload/signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resourceType }),
          });

          const signed = await signRes.json();
          if (!signRes.ok) throw new Error(signed.error || 'Signature request failed');

          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', signed.apiKey);
          formData.append('timestamp', String(signed.timestamp));
          formData.append('signature', signed.signature);
          formData.append('folder', signed.folder);

          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`,
            {
              method: 'POST',
              body: formData,
            },
          );

          const cloudData = await cloudRes.json();
          if (!cloudRes.ok) throw new Error(cloudData.error?.message || 'Upload failed');

          return {
            id: `${Date.now()}-${file.name}`,
            url: cloudData.secure_url as string,
            mediaType: resourceType,
            caption: captionDraft.trim(),
            createdAt: new Date().toISOString(),
          };
        }),
      );

      persistData({ ...data, memories: [...uploaded, ...data.memories] });
      setCaptionDraft('');
    } finally {
      setUploading(false);
    }
  };

  const deleteMemory = (memoryId: string) => {
    persistData({
      ...data,
      memories: data.memories.filter((memory) => memory.id !== memoryId),
    });
  };

  const revealSurprise = () => {
    const message = pickFreshPrompt(surpriseOptions, data.surpriseHistory ?? [], 6);
    setCurrentSurprise(message);
    persistData({
      ...data,
      surpriseHistory: [message, ...data.surpriseHistory].slice(0, 8),
    });
  };

  const addComplimentMoment = () => {
    const message = pickFreshPrompt(complimentOptions, data.funMoments ?? [], 7);
    persistData({
      ...data,
      funMoments: [message, ...data.funMoments].slice(0, 12),
    });
  };

  const safeFunMoments = data.funMoments ?? [];
  const safeSurpriseHistory = data.surpriseHistory ?? [];

  const memoryStats = useMemo(
    () => ({
      memories: (data.memories ?? []).length,
      wishes: (data.wishes ?? []).length,
      wishlist: (data.wishlist ?? []).length,
      plansDone: (data.plans ?? []).filter((p) => p.done).length,
    }),
    [data],
  );

  return (
    <div ref={rootRef} className="min-h-[100dvh] bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.35),transparent_40%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.3),transparent_35%),linear-gradient(160deg,#35206b_0%,#2c3f95_45%,#1f3f84_100%)] text-white">
      {!introHidden ? (
        <div ref={introRef} className="fixed inset-0 z-50 flex items-center justify-center bg-[#321d63d9] p-6 backdrop-blur-lg">
          <div className="max-w-2xl rounded-3xl border border-pink-200/30 bg-gradient-to-br from-pink-300/20 via-violet-300/20 to-sky-300/20 p-8 text-center shadow-2xl md:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-pink-100">A Birthday Space</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold text-white md:text-6xl">For Olivia, beautifully and thoughtfully.</h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-pink-50/95">
              This is your private celebration board. Save memories, videos, wishes, and plans in one place so they stay with you across devices.
            </p>
            <button
              onClick={dismissIntro}
              className="mt-7 rounded-full border border-pink-100/60 bg-white/20 px-7 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-pink-50 hover:bg-white/30"
            >
              Enter Celebration
            </button>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:px-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-pink-200/35 bg-gradient-to-r from-pink-300/20 to-sky-300/20 px-4 py-3">
          <div>
            <h2 className="text-xl font-semibold text-white md:text-2xl">Olivia&apos;s Birthday Hub</h2>
            <p className="text-sm text-pink-100/85">
              {profile ? `Signed in as ${profile.name}` : 'Sign in with your name and birthday to sync across devices'}
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.15em] text-pink-100/85">
            {syncStatus === 'saving' && 'Saving...'}
            {syncStatus === 'saved' && 'Saved to cloud'}
            {syncStatus === 'error' && 'Save failed'}
          </div>
        </header>

        {checkingAuth ? (
          <div className={panelClass}>Checking session...</div>
        ) : !profile ? (
          <div className={`${panelClass} mx-auto max-w-xl`}>
            <h3 className="text-2xl font-semibold">Simple Auth</h3>
            <p className="mt-2 text-sm text-pink-100/80">What is your name and when is your birthday?</p>
            <div className="mt-4 grid gap-3">
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
              <input
                type="date"
                value={formBirthday}
                onChange={(e) => setFormBirthday(e.target.value)}
                className={inputClass}
              />
              <button
                onClick={login}
                className={buttonClass}
              >
                Continue
              </button>
              {authError ? <p className="text-sm text-rose-300">{authError}</p> : null}
            </div>
          </div>
        ) : (
          <>
            <nav className="no-scrollbar mb-6 flex gap-2 overflow-x-auto rounded-3xl border border-pink-200/35 bg-gradient-to-r from-pink-300/20 to-sky-300/20 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                      active ? 'bg-white text-fuchsia-800' : 'bg-transparent text-pink-100 hover:bg-white/20'
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {tab.label}
                  </button>
                );
              })}
              <button onClick={logout} className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-pink-100 hover:bg-white/20">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>

            <section ref={sectionRef} className="space-y-5">
              {activeTab === 'welcome' ? (
                <>
                  <div className={panelClass}>
                    <h3 className="text-3xl font-semibold">Happy Birthday, {profile.name}.</h3>
                    <p className="mt-3 max-w-3xl text-pink-50/95">
                      Your content is synced to cloud storage, so your memories and wishes stay available even when you switch devices.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className={panelClass}><p className="text-sm text-pink-100/80">Memories</p><p className="text-3xl font-semibold">{memoryStats.memories}</p></div>
                    <div className={panelClass}><p className="text-sm text-pink-100/80">Wishes</p><p className="text-3xl font-semibold">{memoryStats.wishes}</p></div>
                    <div className={panelClass}><p className="text-sm text-pink-100/80">Wish List Items</p><p className="text-3xl font-semibold">{memoryStats.wishlist}</p></div>
                    <div className={panelClass}><p className="text-sm text-pink-100/80">Plans Done</p><p className="text-3xl font-semibold">{memoryStats.plansDone}</p></div>
                  </div>
                </>
              ) : null}

              {activeTab === 'memories' ? (
                <>
                  <div className={panelClass}>
                    <h3 className="text-2xl font-semibold">Image + Video Memories</h3>
                    <p className="mt-2 text-sm text-pink-100/80">Upload photos and clips. Both are supported.</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                      <input
                        value={captionDraft}
                        onChange={(e) => setCaptionDraft(e.target.value)}
                        placeholder="Caption"
                        className={inputClass}
                      />
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-pink-100/40 bg-white/25 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-white/35">
                        <Upload className="h-4 w-4" />
                        {uploading ? 'Uploading...' : 'Upload media'}
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          className="hidden"
                          onChange={(e) => uploadMedia(e.target.files)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {data.memories.length === 0 ? (
                      <div className={panelClass}>
                        <p className="text-pink-100/85">No memories yet. Upload photos or videos to get started.</p>
                      </div>
                    ) : null}
                    {data.memories.map((memory) => (
                      <div key={memory.id} className={`${panelClass} relative`}>
                        <button
                          onClick={() => deleteMemory(memory.id)}
                          className="absolute right-3 top-3 rounded-full bg-rose-500/90 p-2 text-white hover:bg-rose-600"
                          aria-label="Delete memory"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {memory.mediaType === 'video' ? (
                          <video src={memory.url} controls className="h-64 w-full rounded-xl object-cover" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={memory.url} alt={memory.caption || 'Memory'} className="h-64 w-full rounded-xl object-cover" />
                        )}
                        <p className="mt-2 text-sm text-pink-50">{memory.caption || 'Untitled memory'}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {activeTab === 'wishes' ? (
                <>
                  <div className={panelClass}>
                    <h3 className="text-2xl font-semibold">Wishes Wall</h3>
                    <div className="mt-4 grid gap-2 md:grid-cols-3">
                      <input
                        value={wishForm.sender}
                        onChange={(e) => setWishForm({ ...wishForm, sender: e.target.value })}
                        placeholder="Sender"
                        className={inputClass}
                      />
                      <input
                        value={wishForm.message}
                        onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                        placeholder="Write a wish"
                        className={`${inputClass} md:col-span-2`}
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!wishForm.sender.trim() || !wishForm.message.trim()) return;
                        persistData({
                          ...data,
                          wishes: [
                            {
                              id: String(Date.now()),
                              sender: wishForm.sender.trim(),
                              message: wishForm.message.trim(),
                              likes: 0,
                              pinned: false,
                              createdAt: new Date().toISOString(),
                            },
                            ...data.wishes,
                          ],
                        });
                        setWishForm({ sender: '', message: '' });
                      }}
                      className={`mt-3 ${buttonClass}`}
                    >
                      Add Wish
                    </button>
                  </div>

                  {data.wishes.map((wish) => (
                    <div key={wish.id} className={panelClass}>
                      <p className="text-lg">{wish.message}</p>
                      <p className="mt-2 text-sm text-pink-100/80">From {wish.sender}</p>
                    </div>
                  ))}
                </>
              ) : null}

              {activeTab === 'playlist' ? (
                <>
                  <div className={panelClass}>
                    <h3 className="text-2xl font-semibold">Birthday Playlist</h3>
                    <div className="mt-4 grid gap-2 md:grid-cols-3">
                      <input value={songForm.title} onChange={(e) => setSongForm({ ...songForm, title: e.target.value })} placeholder="Title" className={inputClass} />
                      <input value={songForm.artist} onChange={(e) => setSongForm({ ...songForm, artist: e.target.value })} placeholder="Artist" className={inputClass} />
                      <input value={songForm.addedBy} onChange={(e) => setSongForm({ ...songForm, addedBy: e.target.value })} placeholder="Added by" className={inputClass} />
                    </div>
                    <button
                      onClick={() => {
                        if (!songForm.title.trim() || !songForm.artist.trim() || !songForm.addedBy.trim()) return;
                        persistData({
                          ...data,
                          playlist: [{ id: String(Date.now()), ...songForm, votes: 0 }, ...data.playlist],
                        });
                        setSongForm({ title: '', artist: '', addedBy: '' });
                      }}
                      className={`mt-3 ${buttonClass}`}
                    >
                      Add Song
                    </button>
                  </div>

                  {data.playlist.map((song) => (
                    <div key={song.id} className={`${panelClass} flex items-center justify-between gap-3`}>
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-pink-100/80">
                          {song.artist} • {song.addedBy}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          persistData({
                            ...data,
                            playlist: data.playlist
                              .map((entry) => (entry.id === song.id ? { ...entry, votes: entry.votes + 1 } : entry))
                              .sort((a, b) => b.votes - a.votes),
                          })
                        }
                        className="rounded-lg border border-white/20 px-3 py-1 text-sm"
                      >
                        Vote {song.votes}
                      </button>
                    </div>
                  ))}
                </>
              ) : null}

              {activeTab === 'wishlist' ? (
                <>
                  <div className={panelClass}>
                    <h3 className="text-2xl font-semibold">Birthday Girl Wish List + Day Vibe Plan</h3>
                    <p className="mt-2 text-sm text-pink-100/80">This replaces the game/cake sections with practical celebration planning.</p>

                    <div className="mt-4 grid gap-2 md:grid-cols-3">
                      <input value={wishlistForm.item} onChange={(e) => setWishlistForm({ ...wishlistForm, item: e.target.value })} placeholder="Wish list item" className={inputClass} />
                      <input value={wishlistForm.note} onChange={(e) => setWishlistForm({ ...wishlistForm, note: e.target.value })} placeholder="Note" className={inputClass} />
                      <select
                        value={wishlistForm.priority}
                        onChange={(e) => setWishlistForm({ ...wishlistForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
                        className={inputClass}
                      >
                        <option value="low">Low priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="high">High priority</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        if (!wishlistForm.item.trim()) return;
                        persistData({
                          ...data,
                          wishlist: [
                            { id: String(Date.now()), item: wishlistForm.item.trim(), note: wishlistForm.note.trim(), priority: wishlistForm.priority, claimed: false },
                            ...data.wishlist,
                          ],
                        });
                        setWishlistForm({ item: '', note: '', priority: 'medium' });
                      }}
                      className={`mt-3 ${buttonClass}`}
                    >
                      Add Wishlist Item
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={panelClass}>
                      <h4 className="mb-3 text-lg font-semibold">Wish List</h4>
                      <div className="space-y-2">
                        {data.wishlist.map((item) => (
                          <button
                            key={item.id}
                            onClick={() =>
                              persistData({
                                ...data,
                                wishlist: data.wishlist.map((entry) => (entry.id === item.id ? { ...entry, claimed: !entry.claimed } : entry)),
                              })
                            }
                            className={`w-full rounded-xl border px-3 py-2 text-left ${item.claimed ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/20 bg-white/5'}`}
                          >
                            <p className="font-medium">{item.item}</p>
                            <p className="text-xs text-pink-100/80">{item.note || 'No note'} • {item.priority}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={panelClass}>
                      <h4 className="mb-3 text-lg font-semibold">Day Vibe Planner</h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        <input value={planForm.title} onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })} placeholder="Plan" className={inputClass} />
                        <input value={planForm.when} onChange={(e) => setPlanForm({ ...planForm, when: e.target.value })} placeholder="When" className={inputClass} />
                      </div>
                      <button
                        onClick={() => {
                          if (!planForm.title.trim()) return;
                          persistData({
                            ...data,
                            plans: [...data.plans, { id: String(Date.now()), title: planForm.title.trim(), when: planForm.when.trim() || 'Anytime', done: false }],
                          });
                          setPlanForm({ title: '', when: '' });
                        }}
                        className={`mt-3 ${buttonClass}`}
                      >
                        Add Plan
                      </button>

                      <div className="mt-3 space-y-2">
                        {data.plans.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() =>
                              persistData({ ...data, plans: data.plans.map((p) => (p.id === plan.id ? { ...p, done: !p.done } : p)) })
                            }
                            className={`w-full rounded-xl border px-3 py-2 text-left ${plan.done ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/20 bg-white/5'}`}
                          >
                            <p>{plan.title}</p>
                            <p className="text-xs text-pink-100/80">{plan.when}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {activeTab === 'affirmations' ? (
                <>
                  <div className={panelClass}>
                    <h3 className="text-2xl font-semibold">Affirmation Room</h3>
                    <div className="mt-4 flex gap-2">
                      <input value={affirmationDraft} onChange={(e) => setAffirmationDraft(e.target.value)} placeholder="Write an affirmation" className={`w-full ${inputClass}`} />
                      <button
                        onClick={() => {
                          if (!affirmationDraft.trim()) return;
                          persistData({ ...data, affirmations: [...data.affirmations, affirmationDraft.trim()] });
                          setAffirmationDraft('');
                        }}
                        className={buttonClass}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {data.affirmations.map((line, idx) => (
                      <div key={`${line}-${idx}`} className={panelClass}>
                        <p className="text-lg leading-relaxed">“{line}”</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {activeTab === 'fun' ? (
                <>
                  <div className={panelClass}>
                    <h3 className="text-2xl font-semibold">Fun Zone</h3>
                    <p className="mt-2 text-sm text-pink-100/85">
                      Tiny fun interactions to make the page feel like a party instead of a dashboard.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button onClick={addComplimentMoment} className={`${buttonClass} inline-flex items-center gap-2`}>
                        <WandSparkles className="h-4 w-4" /> Compliment Shower
                      </button>
                      <button onClick={revealSurprise} className={`${buttonClass} inline-flex items-center gap-2`}>
                        <Gift className="h-4 w-4" /> Reveal Surprise Prompt
                      </button>
                    </div>
                    {currentSurprise ? (
                      <div className="mt-4 rounded-2xl border border-pink-200/35 bg-white/20 p-4 text-indigo-950">
                        <p className="text-xs uppercase tracking-[0.2em] text-indigo-700">Today&apos;s Surprise</p>
                        <p className="mt-1 text-lg font-semibold">{currentSurprise}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={panelClass}>
                      <h4 className="mb-3 text-lg font-semibold">Compliment Cards</h4>
                      <div className="space-y-2">
                        {safeFunMoments.length === 0 ? (
                          <p className="text-sm text-pink-100/80">Click &quot;Compliment Shower&quot; to generate beautiful cards.</p>
                        ) : (
                          safeFunMoments.map((moment, idx) => (
                            <div key={`${moment}-${idx}`} className="rounded-xl border border-pink-200/35 bg-white/20 p-3 text-pink-50">
                              {moment}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className={panelClass}>
                      <h4 className="mb-3 text-lg font-semibold">Surprise History</h4>
                      <div className="space-y-2">
                        {safeSurpriseHistory.length === 0 ? (
                          <p className="text-sm text-pink-100/80">No prompts yet. Reveal one to start.</p>
                        ) : (
                          safeSurpriseHistory.map((item, idx) => (
                            <div key={`${item}-${idx}`} className="rounded-xl border border-sky-200/35 bg-white/20 p-3 text-pink-50">
                              {item}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
