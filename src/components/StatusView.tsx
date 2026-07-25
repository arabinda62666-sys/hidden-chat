import React, { useState, useEffect, useRef } from 'react';
import { StatusItem, AuthUser } from '../types';
import {
  Plus,
  Camera,
  X,
  Send,
  MoreVertical,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  Eye,
  Type,
  Shield,
  ShieldCheck,
  Users,
  UserX,
  UserCheck,
  Check,
  Image as ImageIcon,
  Video as VideoIcon,
  FolderOpen,
  Play,
  Square,
  RefreshCw
} from 'lucide-react';

interface StatusViewProps {
  currentUser: AuthUser | null;
  onLockApp: () => void;
  onSendDirectMessage?: (contactId: string, text: string) => void;
}

const INITIAL_STATUS_UPDATES: StatusItem[] = [
  {
    id: 'st-sarah-1',
    userId: 'sarah-jenkins',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4XDXK27eDWsqqbyoYV37RTt2Z19B12IB73GRtFHTLlAhNbMUYyDdrs-zTZmDp0dhxuhrYzxQ_RHXguRBC5G3x7-gTLOzjmo596XifCII_nAYLBXyM1o7PLBu09dC8xWE3QLj-JwzAROLPRS30uuEqTRx98hNvgkV6wLGI8uZbnFCHrFoUsT7Pv_D1y9yCOd5RDlH32NoazX8eFiad6mhVE2P4dKNCifdEYwlf4TGRkgZJ0mxugZzJCE2crKekYMty9jP6JmF',
    timestamp: 'Just now',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: '🔒 Working on the latest end-to-end security protocol update!',
    isViewed: false,
  },
  {
    id: 'st-alex-1',
    userId: 'alex-rivera',
    userName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    timestamp: '25 minutes ago',
    text: '“Privacy is not something that I’m merely entitled to, it’s a prerequisite.” 🔑✨',
    bgColor: 'from-amber-900/80 via-black to-slate-900',
    isViewed: false,
  },
  {
    id: 'st-marcus-1',
    userId: 'marcus-vance',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timestamp: '2 hours ago',
    mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Encrypted server deployment complete! 🚀',
    isViewed: false,
  },
  {
    id: 'st-elena-1',
    userId: 'elena-rodriguez',
    userName: 'Elena Rodriguez',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    timestamp: '5 hours ago',
    text: 'Late night coding session with tea & high encryption ☕💻',
    bgColor: 'from-purple-950 via-zinc-950 to-amber-950',
    isViewed: true,
  },
];

const PRESET_BG_COLORS = [
  'from-amber-900/80 via-black to-slate-900',
  'from-purple-950 via-zinc-950 to-amber-950',
  'from-emerald-950 via-black to-zinc-900',
  'from-blue-950 via-slate-950 to-zinc-950',
  'from-rose-950 via-black to-amber-950',
];

export const StatusView: React.FC<StatusViewProps> = ({
  currentUser,
  onLockApp,
  onSendDirectMessage,
}) => {
  const [statuses, setStatuses] = useState<StatusItem[]>(() => {
    const saved = localStorage.getItem('calcchat_statuses');
    return saved ? JSON.parse(saved) : INITIAL_STATUS_UPDATES;
  });

  const [myStatuses, setMyStatuses] = useState<StatusItem[]>(() => {
    const saved = localStorage.getItem('calcchat_my_statuses');
    return saved ? JSON.parse(saved) : [];
  });

  // Active Story Viewer
  const [activeStoryGroup, setActiveStoryGroup] = useState<{
    userId: string;
    userName: string;
    userAvatar: string;
    items: StatusItem[];
  } | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  // New Status Creation State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<
    'select-type' | 'select-source' | 'camera-view' | 'text-input' | 'preview-media'
  >('select-type');
  const [selectedCategory, setSelectedCategory] = useState<'text' | 'photo' | 'video'>('text');
  
  // Status Content Data
  const [statusText, setStatusText] = useState('');
  const [selectedBgColor, setSelectedBgColor] = useState(PRESET_BG_COLORS[0]);
  const [previewMediaUrl, setPreviewMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [statusCaption, setStatusCaption] = useState('');

  // Camera & Video Recording Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<any>(null);

  // File Input Refs
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Privacy Settings Control
  const [privacySetting, setPrivacySetting] = useState<'contacts' | 'except' | 'only'>(() => {
    return (localStorage.getItem('calcchat_status_privacy') as any) || 'contacts';
  });
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyExcluded, setPrivacyExcluded] = useState<string[]>(() => {
    const saved = localStorage.getItem('calcchat_status_privacy_excluded');
    return saved ? JSON.parse(saved) : [];
  });
  const [privacySelected, setPrivacySelected] = useState<string[]>(() => {
    const saved = localStorage.getItem('calcchat_status_privacy_selected');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('calcchat_statuses', JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem('calcchat_my_statuses', JSON.stringify(myStatuses));
  }, [myStatuses]);

  useEffect(() => {
    localStorage.setItem('calcchat_status_privacy', privacySetting);
  }, [privacySetting]);

  useEffect(() => {
    localStorage.setItem('calcchat_status_privacy_excluded', JSON.stringify(privacyExcluded));
  }, [privacyExcluded]);

  useEffect(() => {
    localStorage.setItem('calcchat_status_privacy_selected', JSON.stringify(privacySelected));
  }, [privacySelected]);

  // Clean up camera stream when modal or step changes
  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Story Progress Timer
  useEffect(() => {
    if (!activeStoryGroup) return;

    let timer: any = null;
    if (!isPaused) {
      timer = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            if (activeStoryIndex < activeStoryGroup.items.length - 1) {
              setActiveStoryIndex((i) => i + 1);
              return 0;
            } else {
              markGroupAsViewed(activeStoryGroup.userId);
              setActiveStoryGroup(null);
              return 0;
            }
          }
          return prev + 2; // 5 seconds total
        });
      }, 100);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeStoryGroup, activeStoryIndex, isPaused]);

  const markGroupAsViewed = (userId: string) => {
    setStatuses((prev) =>
      prev.map((st) => (st.userId === userId ? { ...st, isViewed: true } : st))
    );
  };

  const handleOpenUserStories = (userId: string, items: StatusItem[]) => {
    const firstItem = items[0];
    setActiveStoryGroup({
      userId,
      userName: firstItem.userName,
      userAvatar: firstItem.userAvatar,
      items,
    });
    setActiveStoryIndex(0);
    setStoryProgress(0);
    setIsPaused(false);
  };

  // Start Modal Flow
  const openCreateModal = (initialType?: 'text' | 'photo' | 'video') => {
    stopCameraStream();
    setPreviewMediaUrl('');
    setStatusText('');
    setStatusCaption('');
    
    if (initialType === 'text') {
      setSelectedCategory('text');
      setCreateStep('text-input');
    } else if (initialType === 'photo') {
      setSelectedCategory('photo');
      setCreateStep('select-source');
    } else if (initialType === 'video') {
      setSelectedCategory('video');
      setCreateStep('select-source');
    } else {
      setCreateStep('select-type');
    }
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    stopCameraStream();
    setShowCreateModal(false);
    setCreateStep('select-type');
  };

  // Launch Camera Stream
  const startCamera = async () => {
    stopCameraStream();
    try {
      const isVideoCategory = selectedCategory === 'video';
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: isVideoCategory,
      });
      setCameraStream(stream);
      setCreateStep('camera-view');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Unable to access camera or microphone. Please check browser permissions.');
    }
  };

  // Attach stream to video tag whenever videoRef mounts
  useEffect(() => {
    if (createStep === 'camera-view' && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [createStep, cameraStream]);

  // Capture Photo Snapshot
  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPreviewMediaUrl(dataUrl);
      setMediaType('image');
      stopCameraStream();
      setCreateStep('preview-media');
    }
  };

  // Start Video Recording
  const startVideoRecording = () => {
    if (!cameraStream) return;
    recordedChunksRef.current = [];
    try {
      const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? { mimeType: 'video/webm;codecs=vp9' }
        : MediaRecorder.isTypeSupported('video/mp4')
        ? { mimeType: 'video/mp4' }
        : undefined;

      const mediaRecorder = new MediaRecorder(cameraStream, options);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: mediaRecorder.mimeType || 'video/webm',
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewMediaUrl(reader.result as string);
          setMediaType('video');
          stopCameraStream();
          setCreateStep('preview-media');
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      recordIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (e) {
      alert('Video recording error on this device.');
    }
  };

  // Stop Video Recording
  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
        recordIntervalRef.current = null;
      }
      setIsRecording(false);
    }
  };

  // Handle Gallery Selection
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewMediaUrl(event.target.result as string);
          setMediaType('image');
          setCreateStep('preview-media');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewMediaUrl(event.target.result as string);
          setMediaType('video');
          setCreateStep('preview-media');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Post Final Status
  const handlePublishStatus = () => {
    if (createStep === 'text-input' && !statusText.trim()) return;
    if (createStep === 'preview-media' && !previewMediaUrl) return;

    const newStatus: StatusItem = {
      id: `my-st-${Date.now()}`,
      userId: currentUser?.id || 'my-id',
      userName: currentUser?.name || 'You',
      userAvatar:
        currentUser?.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      timestamp: 'Just now',
      text: createStep === 'text-input' ? statusText.trim() : undefined,
      bgColor: createStep === 'text-input' ? selectedBgColor : undefined,
      mediaUrl: createStep === 'preview-media' ? previewMediaUrl : undefined,
      mediaType: createStep === 'preview-media' ? mediaType : undefined,
      caption: createStep === 'preview-media' ? statusCaption.trim() : undefined,
      isViewed: false,
    };

    setMyStatuses((prev) => [newStatus, ...prev]);
    closeCreateModal();
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeStoryGroup) return;

    if (onSendDirectMessage) {
      onSendDirectMessage(
        activeStoryGroup.userId,
        `Replied to status: "${replyText.trim()}"`
      );
    }
    setReplyText('');
    setIsPaused(false);
  };

  const recentUpdates = statuses.filter((s) => !s.isViewed);
  const viewedUpdates = statuses.filter((s) => s.isViewed);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-16 pb-28 px-4 max-w-2xl mx-auto">
      {/* Hidden File Inputs for Gallery Upload */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileSelect}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoFileSelect}
        className="hidden"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onLockApp}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:border-[#d4af37] hover:text-[#d4af37] active:scale-95 transition-all text-white/80"
            title="Stealth Lock"
          >
            <Lock className="w-4 h-4" />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-medium">
              Encrypted Updates
            </span>
            <h1 className="font-serif italic text-[18px] text-white font-semibold tracking-tight">
              Status Stories
            </h1>
          </div>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="w-9 h-9 rounded-full bg-[#d4af37] text-black flex items-center justify-center hover:bg-[#e2b857] active:scale-95 transition-all shadow-md gold-glow"
          title="Add Status"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </header>

      <main className="space-y-6 pt-2">
        {/* MY STATUS CARD */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-[#d4af37]/40 transition-all">
          <div
            onClick={() => {
              if (myStatuses.length > 0) {
                handleOpenUserStories(currentUser?.id || 'my-id', myStatuses);
              } else {
                openCreateModal();
              }
            }}
            className="flex items-center gap-3.5 cursor-pointer flex-1"
          >
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-full p-0.5 ${
                  myStatuses.length > 0
                    ? 'bg-gradient-to-tr from-[#d4af37] via-amber-200 to-[#b8952b]'
                    : 'border-2 border-dashed border-white/30'
                }`}
              >
                <img
                  src={
                    currentUser?.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  }
                  alt="My Avatar"
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCreateModal();
                }}
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#d4af37] text-black border-2 border-[#0a0a0a] flex items-center justify-center shadow"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
              </button>
            </div>

            <div className="flex flex-col">
              <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
                <span>My Status</span>
              </h3>
              <p className="text-xs text-white/50">
                {myStatuses.length > 0
                  ? `${myStatuses.length} update${myStatuses.length > 1 ? 's' : ''} • Tap to view`
                  : 'Tap to add status update'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openCreateModal('text')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#d4af37]/50 text-white/80 hover:text-[#d4af37] transition-all"
              title="Text Status"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={() => openCreateModal('photo')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#d4af37]/50 text-white/80 hover:text-[#d4af37] transition-all"
              title="Photo Status"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => openCreateModal('video')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#d4af37]/50 text-white/80 hover:text-[#d4af37] transition-all"
              title="Video Status"
            >
              <VideoIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* STATUS PRIVACY CONTROL BAR */}
        <div
          onClick={() => setShowPrivacyModal(true)}
          className="bg-[#0e0e0e] border border-white/10 rounded-xl p-3 flex items-center justify-between hover:border-[#d4af37]/50 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">
                  Status Privacy Control
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#d4af37]/20 text-[#d4af37] px-1.5 py-0.5 rounded">
                  {privacySetting === 'contacts'
                    ? 'My Contacts'
                    : privacySetting === 'except'
                    ? `Except (${privacyExcluded.length})`
                    : `Only Share (${privacySelected.length})`}
                </span>
              </div>
              <p className="text-[11px] text-white/50">
                {privacySetting === 'contacts' && 'All contacts in your vault can see updates'}
                {privacySetting === 'except' && 'Visible to contacts except excluded ones'}
                {privacySetting === 'only' && 'Visible only to selected contacts'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#d4af37] text-xs font-medium">
            <span>Change</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* RECENT UPDATES SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recent Updates ({recentUpdates.length})</span>
            </span>
          </div>

          {recentUpdates.length > 0 ? (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
              {recentUpdates.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenUserStories(item.userId, [item])}
                  className="p-3.5 flex items-center justify-between hover:bg-white/[0.03] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div className="w-13 h-13 rounded-full p-[2.5px] bg-gradient-to-tr from-[#d4af37] via-amber-200 to-[#b8952b]">
                        <img
                          src={item.userAvatar}
                          alt={item.userName}
                          className="w-full h-full object-cover rounded-full bg-black"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-white">
                        {item.userName}
                      </h4>
                      <p className="text-xs text-white/50 font-mono mt-0.5">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20">
                    New
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-[#0a0a0a] border border-white/5 rounded-2xl text-xs text-white/40">
              No new status updates from contacts.
            </div>
          )}
        </div>

        {/* VIEWED UPDATES SECTION */}
        {viewedUpdates.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs uppercase tracking-widest text-white/40 font-mono font-medium">
                Viewed Updates ({viewedUpdates.length})
              </span>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
              {viewedUpdates.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenUserStories(item.userId, [item])}
                  className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors opacity-70 hover:opacity-100"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full p-0.5 border border-white/20">
                      <img
                        src={item.userAvatar}
                        alt={item.userName}
                        className="w-full h-full object-cover rounded-full bg-black"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-white/80">
                        {item.userName}
                      </h4>
                      <p className="text-xs text-white/40 font-mono mt-0.5">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>

                  <Eye className="w-4 h-4 text-white/30" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FULL-SCREEN WHATSAPP STORY VIEWER */}
      {activeStoryGroup && (
        <div
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-between p-0 select-none animate-in fade-in duration-200"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Top Bars & User Info */}
          <div className="w-full max-w-lg pt-4 px-4 pb-2 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent space-y-3 absolute top-0 left-1/2 -translate-x-1/2">
            {/* Segmented Progress Bars */}
            <div className="flex items-center gap-1.5 w-full">
              {activeStoryGroup.items.map((item, idx) => {
                let widthPercent = 0;
                if (idx < activeStoryIndex) widthPercent = 100;
                else if (idx === activeStoryIndex) widthPercent = storyProgress;
                else widthPercent = 0;

                return (
                  <div
                    key={item.id || idx}
                    className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
                  >
                    <div
                      className="h-full bg-[#d4af37] transition-all duration-100 ease-linear"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Header User Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeStoryGroup.userAvatar}
                  alt={activeStoryGroup.userName}
                  className="w-9 h-9 rounded-full border border-white/20 object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm text-white">
                    {activeStoryGroup.userName}
                  </h3>
                  <p className="text-[10px] text-white/60 font-mono">
                    {activeStoryGroup.items[activeStoryIndex]?.timestamp}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveStoryGroup(null)}
                className="w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Story Body Canvas */}
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {/* Click Nav overlays */}
            <div
              onClick={() => {
                if (activeStoryIndex > 0) {
                  setActiveStoryIndex((i) => i - 1);
                  setStoryProgress(0);
                }
              }}
              className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
            />
            <div
              onClick={() => {
                if (activeStoryIndex < activeStoryGroup.items.length - 1) {
                  setActiveStoryIndex((i) => i + 1);
                  setStoryProgress(0);
                } else {
                  markGroupAsViewed(activeStoryGroup.userId);
                  setActiveStoryGroup(null);
                }
              }}
              className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
            />

            {/* Content Display */}
            {activeStoryGroup.items[activeStoryIndex]?.mediaUrl ? (
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                {activeStoryGroup.items[activeStoryIndex].mediaType === 'video' ||
                activeStoryGroup.items[activeStoryIndex].mediaUrl?.startsWith('data:video') ||
                activeStoryGroup.items[activeStoryIndex].mediaUrl?.endsWith('.mp4') ? (
                  <video
                    src={activeStoryGroup.items[activeStoryIndex].mediaUrl}
                    autoPlay
                    controls
                    playsInline
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <img
                    src={activeStoryGroup.items[activeStoryIndex].mediaUrl}
                    alt="Status"
                    className="max-h-full max-w-full object-contain"
                  />
                )}

                {activeStoryGroup.items[activeStoryIndex].caption && (
                  <div className="absolute bottom-20 left-0 right-0 px-6 py-4 bg-black/70 backdrop-blur-md text-center border-t border-white/10">
                    <p className="text-sm font-medium text-white leading-relaxed">
                      {activeStoryGroup.items[activeStoryIndex].caption}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${
                  activeStoryGroup.items[activeStoryIndex]?.bgColor ||
                  'from-amber-900/80 via-black to-slate-900'
                } flex items-center justify-center p-8 text-center`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-white font-bold leading-relaxed max-w-md drop-shadow-lg">
                  {activeStoryGroup.items[activeStoryIndex]?.text}
                </p>
              </div>
            )}
          </div>

          {/* Reply Bottom Bar */}
          <div className="w-full max-w-lg p-4 z-20 bg-gradient-to-t from-black via-black/80 to-transparent absolute bottom-0 left-1/2 -translate-x-1/2">
            <form
              onSubmit={handleSendReply}
              className="flex items-center gap-2 bg-[#141414] border border-white/20 rounded-full px-4 py-2"
            >
              <input
                type="text"
                placeholder={`Reply to ${activeStoryGroup.userName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                className="w-full bg-transparent border-none text-xs text-white placeholder-white/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="w-8 h-8 rounded-full bg-[#d4af37] text-black flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none hover:bg-[#e2b857]"
              >
                <Send className="w-4 h-4 ml-0.5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW STATUS MODAL */}
      {showCreateModal && (
        <div
          onClick={closeCreateModal}
          className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0e0e0e] border border-white/10 w-full max-w-md rounded-3xl p-6 space-y-5 relative animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                {createStep !== 'select-type' && (
                  <button
                    type="button"
                    onClick={() => {
                      stopCameraStream();
                      if (createStep === 'preview-media' || createStep === 'camera-view') {
                        setCreateStep('select-source');
                      } else {
                        setCreateStep('select-type');
                      }
                    }}
                    className="p-1.5 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 mr-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <h3 className="font-serif italic text-lg font-bold text-white">
                  {createStep === 'select-type' && 'Choose Status Type'}
                  {createStep === 'select-source' && `Select Source for ${selectedCategory === 'photo' ? 'Photo' : 'Video'}`}
                  {createStep === 'camera-view' && `Camera ${selectedCategory === 'photo' ? 'Photo' : 'Video'}`}
                  {createStep === 'text-input' && 'Text Status Editor'}
                  {createStep === 'preview-media' && 'Preview Status'}
                </h3>
              </div>
              <button
                onClick={closeCreateModal}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: SELECT STATUS TYPE (Text / Photo / Video) */}
            {createStep === 'select-type' && (
              <div className="grid grid-cols-1 gap-3 py-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('text');
                    setCreateStep('text-input');
                  }}
                  className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#d4af37] flex items-center gap-4 text-left transition-all group hover:bg-[#1a1a1a]"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-900/60 to-indigo-900/60 border border-purple-500/30 flex items-center justify-center text-purple-200 group-hover:scale-105 transition-transform">
                    <Type className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-[#d4af37]">Text Status</h4>
                    <p className="text-xs text-white/50">Write a quick text or quote update with colorful backgrounds</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('photo');
                    setCreateStep('select-source');
                  }}
                  className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#d4af37] flex items-center gap-4 text-left transition-all group hover:bg-[#1a1a1a]"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-900/60 to-yellow-900/60 border border-amber-500/30 flex items-center justify-center text-amber-200 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-[#d4af37]">Photo Status</h4>
                    <p className="text-xs text-white/50">Share a picture taken with camera or uploaded from gallery</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('video');
                    setCreateStep('select-source');
                  }}
                  className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#d4af37] flex items-center gap-4 text-left transition-all group hover:bg-[#1a1a1a]"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-900/60 to-teal-900/60 border border-emerald-500/30 flex items-center justify-center text-emerald-200 group-hover:scale-105 transition-transform">
                    <VideoIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-[#d4af37]">Video Status</h4>
                    <p className="text-xs text-white/50">Record a video clip live or select a video file from gallery</p>
                  </div>
                </button>
              </div>
            )}

            {/* STEP 2: SELECT SOURCE (Camera or From Gallery) */}
            {createStep === 'select-source' && (
              <div className="grid grid-cols-1 gap-3 py-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#d4af37] flex items-center gap-4 text-left transition-all group hover:bg-[#1a1a1a]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-[#d4af37]">Camera</h4>
                    <p className="text-xs text-white/50">
                      {selectedCategory === 'photo' ? 'Take a live photo using camera' : 'Record a video clip using camera'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedCategory === 'photo') {
                      imageInputRef.current?.click();
                    } else {
                      videoInputRef.current?.click();
                    }
                  }}
                  className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#d4af37] flex items-center gap-4 text-left transition-all group hover:bg-[#1a1a1a]"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-[#d4af37]">From Gallery</h4>
                    <p className="text-xs text-white/50">
                      {selectedCategory === 'photo' ? 'Pick a photo from device storage' : 'Pick a video from device storage'}
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* STEP 3A: LIVE CAMERA CAPTURE */}
            {createStep === 'camera-view' && (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-black border border-white/20 aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {isRecording && (
                    <div className="absolute top-3 left-3 bg-red-600/90 text-white font-mono text-xs px-2.5 py-1 rounded-full flex items-center gap-2 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-white" />
                      <span>00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  {selectedCategory === 'photo' ? (
                    <button
                      type="button"
                      onClick={captureCameraPhoto}
                      className="py-3 px-6 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Camera className="w-4 h-4 stroke-[2.5]" />
                      <span>Take Photo</span>
                    </button>
                  ) : (
                    <>
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startVideoRecording}
                          className="py-3 px-6 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Start Recording</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopVideoRecording}
                          className="py-3 px-6 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                        >
                          <Square className="w-4 h-4 fill-current" />
                          <span>Stop & Use Video</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3B: TEXT INPUT EDITOR */}
            {createStep === 'text-input' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-white/50 mb-1">
                    Status Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Type a status update..."
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-white/50 mb-2">
                    Select Theme Gradient
                  </label>
                  <div className="flex gap-2.5">
                    {PRESET_BG_COLORS.map((bg, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedBgColor(bg)}
                        className={`w-10 h-10 rounded-full bg-gradient-to-tr ${bg} border-2 ${
                          selectedBgColor === bg
                            ? 'border-[#d4af37] scale-110 shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                            : 'border-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePublishStatus}
                  disabled={!statusText.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer gold-glow mt-2 disabled:opacity-40"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>Post Status</span>
                </button>
              </div>
            )}

            {/* STEP 3C: PREVIEW MEDIA & CAPTION */}
            {createStep === 'preview-media' && (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden bg-black border border-white/20 max-h-60 flex items-center justify-center relative">
                  {mediaType === 'video' ? (
                    <video
                      src={previewMediaUrl}
                      controls
                      autoPlay
                      className="max-h-60 w-full object-contain"
                    />
                  ) : (
                    <img
                      src={previewMediaUrl}
                      alt="Status Preview"
                      className="max-h-60 w-full object-contain"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-white/50 mb-1">
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Add a caption..."
                    value={statusCaption}
                    onChange={(e) => setStatusCaption(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handlePublishStatus}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer gold-glow"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>Post Status</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STATUS PRIVACY SETTINGS MODAL */}
      {showPrivacyModal && (
        <div
          onClick={() => setShowPrivacyModal(false)}
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0e0e0e] border border-white/10 w-full max-w-md rounded-3xl p-6 space-y-5 relative animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#d4af37]" />
                <h3 className="font-serif italic text-lg font-bold text-white">
                  Status Privacy Controls
                </h3>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              Choose who can see your encrypted status updates. Changes will apply to new status updates.
            </p>

            {/* Privacy Options List */}
            <div className="space-y-3">
              {/* Option 1: My Contacts */}
              <div
                onClick={() => setPrivacySetting('contacts')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  privacySetting === 'contacts'
                    ? 'bg-[#d4af37]/10 border-[#d4af37] text-white'
                    : 'bg-[#141414] border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 mt-0.5">
                    <Users className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">My Contacts</h4>
                    <p className="text-xs text-white/50 mt-0.5">
                      Share with all contacts saved in your vault.
                    </p>
                  </div>
                </div>
                {privacySetting === 'contacts' && (
                  <div className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center mt-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Option 2: My Contacts Except... */}
              <div
                onClick={() => setPrivacySetting('except')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  privacySetting === 'except'
                    ? 'bg-[#d4af37]/10 border-[#d4af37] text-white'
                    : 'bg-[#141414] border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 mt-0.5">
                    <UserX className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">My Contacts Except...</h4>
                    <p className="text-xs text-white/50 mt-0.5">
                      Hide updates from selected contacts ({privacyExcluded.length} excluded).
                    </p>
                  </div>
                </div>
                {privacySetting === 'except' && (
                  <div className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center mt-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Option 3: Only Share With... */}
              <div
                onClick={() => setPrivacySetting('only')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  privacySetting === 'only'
                    ? 'bg-[#d4af37]/10 border-[#d4af37] text-white'
                    : 'bg-[#141414] border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 mt-0.5">
                    <UserCheck className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Only Share With...</h4>
                    <p className="text-xs text-white/50 mt-0.5">
                      Share status updates only with selected contacts ({privacySelected.length} selected).
                    </p>
                  </div>
                </div>
                {privacySetting === 'only' && (
                  <div className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center mt-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>

            {/* Contact Selector when Except or Only selected */}
            {(privacySetting === 'except' || privacySetting === 'only') && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4af37]">
                  {privacySetting === 'except' ? 'Select contacts to exclude:' : 'Select contacts to share with:'}
                </span>

                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {[
                    { id: 'sarah-jenkins', name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4XDXK27eDWsqqbyoYV37RTt2Z19B12IB73GRtFHTLlAhNbMUYyDdrs-zTZmDp0dhxuhrYzxQ_RHXguRBC5G3x7-gTLOzjmo596XifCII_nAYLBXyM1o7PLBu09dC8xWE3QLj-JwzAROLPRS30uuEqTRx98hNvgkV6wLGI8uZbnFCHrFoUsT7Pv_D1y9yCOd5RDlH32NoazX8eFiad6mhVE2P4dKNCifdEYwlf4TGRkgZJ0mxugZzJCE2crKekYMty9jP6JmF' },
                    { id: 'alex-rivera', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
                    { id: 'marcus-vance', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
                    { id: 'elena-rodriguez', name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
                  ].map((ct) => {
                    const isExcluded = privacyExcluded.includes(ct.id);
                    const isSelected = privacySelected.includes(ct.id);
                    const active = privacySetting === 'except' ? isExcluded : isSelected;

                    return (
                      <div
                        key={ct.id}
                        onClick={() => {
                          if (privacySetting === 'except') {
                            setPrivacyExcluded((prev) =>
                              prev.includes(ct.id) ? prev.filter((id) => id !== ct.id) : [...prev, ct.id]
                            );
                          } else {
                            setPrivacySelected((prev) =>
                              prev.includes(ct.id) ? prev.filter((id) => id !== ct.id) : [...prev, ct.id]
                            );
                          }
                        }}
                        className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          active
                            ? 'bg-[#d4af37]/20 border-[#d4af37] text-white'
                            : 'bg-[#141414] border-white/10 hover:border-white/20 text-white/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={ct.avatar} alt={ct.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="text-xs font-medium text-white">{ct.name}</span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            active ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-white/30'
                          }`}
                        >
                          {active && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer gold-glow"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Save Privacy Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
