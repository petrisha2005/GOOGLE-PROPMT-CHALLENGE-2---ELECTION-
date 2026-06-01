import { useState, useEffect } from 'react';
import { 
  Vote, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  FileText, 
  Check, 
  AlertTriangle,
  Heart,
  Search,
  Printer,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Sun,
  Mountain,
  Trees,
  Crown,
  Star,
  Anchor,
  Sparkles,
  Bike,
  Umbrella,
  Lock,
  Award,
  Compass,
  Users
} from 'lucide-react';
import { electionData } from './data/electionData';
import { useElectionTimeline } from './hooks/useElectionTimeline';
import { useAudioGuide } from './hooks/useAudioGuide';
import VisualTimeline from './components/VisualTimeline';
import EVMSimulator from './components/EVMSimulator';
import VotingFlowchart from './components/VotingFlowchart';
import GlobalJourneySimulator from './components/GlobalJourneySimulator';

const MangoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C8.5 2 5.5 4.5 4.5 8c-1 3.5 0 7.5 2.5 10 2.5 2.5 6.5 3.5 10 2.5 3.5-1 6-4 6-7.5 0-3.5-2.5-6.5-6-6.5l-1-2.5c-.5-.8-1.2-1.5-2-2z" />
    <path d="M14 6c-.5-1.5-1.5-2.5-3-3" />
    <path d="M10 8c1 0 2 1 2 2" />
  </svg>
);

const SymbolIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sun: Sun,
  Mountain: Mountain,
  Tree: Trees,
  Crown: Crown,
  Star: Star,
  Anchor: Anchor,
  Mango: MangoIcon,
  Umbrella: Umbrella,
  Bicycle: Bike
};

const getSymbolClasses = (color: string, isActive: boolean) => {
  const mapping: Record<string, { base: string, active: string, border: string }> = {
    amber: {
      base: 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20 focus:ring-amber-500',
      active: 'bg-amber-500 border-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 focus:ring-amber-500',
      border: 'border-amber-500/30 hover:border-amber-500/60'
    },
    sky: {
      base: 'bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20 focus:ring-sky-400',
      active: 'bg-sky-400 border-sky-400 text-slate-950 shadow-lg shadow-sky-400/20 focus:ring-sky-400',
      border: 'border-sky-500/30 hover:border-sky-500/60'
    },
    emerald: {
      base: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 focus:ring-emerald-550',
      active: 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 focus:ring-emerald-500',
      border: 'border-emerald-500/30 hover:border-emerald-500/60'
    },
    purple: {
      base: 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 focus:ring-purple-450',
      active: 'bg-purple-400 border-purple-400 text-slate-950 shadow-lg shadow-purple-400/20 focus:ring-purple-400',
      border: 'border-purple-500/30 hover:border-purple-500/60'
    },
    orange: {
      base: 'bg-orange-500/10 border-orange-500/30 text-orange-450 hover:bg-orange-500/20 focus:ring-orange-450',
      active: 'bg-orange-500 border-orange-500 text-slate-950 shadow-lg shadow-orange-500/20 focus:ring-orange-500',
      border: 'border-orange-500/30 hover:border-orange-500/60'
    },
    indigo: {
      base: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 focus:ring-indigo-450',
      active: 'bg-indigo-500 border-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/20 focus:ring-indigo-500',
      border: 'border-indigo-500/30 hover:border-indigo-500/60'
    },
    yellow: {
      base: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 focus:ring-yellow-550',
      active: 'bg-yellow-500 border-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/20 focus:ring-yellow-500',
      border: 'border-yellow-500/30 hover:border-yellow-500/60'
    },
    pink: {
      base: 'bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20 focus:ring-pink-450',
      active: 'bg-pink-400 border-pink-400 text-slate-950 shadow-lg shadow-pink-400/20 focus:ring-pink-400',
      border: 'border-pink-500/30 hover:border-pink-500/60'
    },
    teal: {
      base: 'bg-teal-500/10 border-teal-500/30 text-teal-400 hover:bg-teal-500/20 focus:ring-teal-450',
      active: 'bg-teal-450 border-teal-450 text-slate-950 shadow-lg shadow-teal-450/20 focus:ring-teal-450',
      border: 'border-teal-500/30 hover:border-teal-500/60'
    }
  };
  const res = mapping[color] || {
    base: 'bg-slate-800 border-slate-700 text-white focus:ring-slate-500',
    active: 'bg-white border-white text-slate-950 focus:ring-white',
    border: 'border-slate-800 hover:border-slate-700'
  };
  return isActive ? res.active : res.base;
};

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'timeline' | 'simulator'>('home');
  const [pledgeName, setPledgeName] = useState<string>('');
  const [isPledged, setIsPledged] = useState<boolean>(false);
  const [pledgeCount, setPledgeCount] = useState<number>(18428);
  const [particles, setParticles] = useState<{ id: number; x: string; y: string; color: string }[]>([]);
  const [initialSimulatorTrack, setInitialSimulatorTrack] = useState<string>('india_evm');

  const playPledgeChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      };
      
      const t = ctx.currentTime;
      playTone(523.25, t, 0.4); // C5
      playTone(659.25, t + 0.12, 0.4); // E5
      playTone(783.99, t + 0.24, 0.6); // G5
    } catch (err) {
      console.warn('Audio Synthesis failed:', err);
    }
  };

  const triggerPledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeName.trim()) return;
    
    setIsPledged(true);
    setPledgeCount(prev => prev + 1);
    playPledgeChime();
    
    // Create splash particles
    const colors = ['#FFD700', '#38BDF8', '#10B981', '#F43F5E', '#A855F7'];
    const newParticles = Array.from({ length: 30 }).map((_, i) => {
      const angle = (i * 360 / 30) * (Math.PI / 180);
      const velocity = 80 + Math.random() * 120;
      const x = `${Math.cos(angle) * velocity}px`;
      const y = `${Math.sin(angle) * velocity}px`;
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        id: Date.now() + i,
        x,
        y,
        color
      };
    });
    
    setParticles(newParticles);
    
    setTimeout(() => {
      setParticles([]);
    }, 1000);
  };

  const [zipInput, setZipInput] = useState<string>('');
  const [selectedStateCode, setSelectedStateCode] = useState<string>('IN');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});
  const [selectedMeasures, setSelectedMeasures] = useState<Record<string, 'YES' | 'NO' | ''>>({});
  const [activeTab, setActiveTab] = useState<'timeline' | 'roadmap' | 'ballot'>('timeline');
  const [zipError, setZipError] = useState<string>('');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [symbolMode, setSymbolMode] = useState<boolean>(false);
  const [ballotLang, setBallotLang] = useState<'en' | 'es'>('en');
  
  const { speak } = useAudioGuide();
  
  // Use our custom hook!
  const timelineResult = useElectionTimeline({
    stateCode: selectedStateCode || undefined,
    zipCode: zipInput.length === 5 ? zipInput : undefined
  });

  const {
    stateData,
    resolvedStateCode,
    daysToRegistrationDeadline,
    registrationDeadlinePassed,
    votingWindowStatus,
    complianceChecklist,
    zipCodeResolved
  } = timelineResult;

  // Sync resolved state from Zip code back to our local dropdown selection
  useEffect(() => {
    if (resolvedStateCode && resolvedStateCode !== selectedStateCode) {
      setSelectedStateCode(resolvedStateCode);
      setZipError('');
    }
  }, [resolvedStateCode, selectedStateCode]);

  const activeState = stateData || (selectedStateCode ? electionData[selectedStateCode] : null);
  const statesList = [electionData.IN, electionData.TX, electionData.NY, electionData.CA];

  const toggleStep = (stepId: string) => {
    const key = `${selectedStateCode}-${stepId}`;
    setCheckedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectCandidate = (officeId: string, candidateId: string) => {
    setSelectedCandidates(prev => ({ ...prev, [`${selectedStateCode}-${officeId}`]: candidateId }));
  };

  const handleSelectMeasure = (measureId: string, choice: 'YES' | 'NO') => {
    const key = `${selectedStateCode}-${measureId}`;
    setSelectedMeasures(prev => ({
      ...prev,
      [key]: prev[key] === choice ? '' : choice
    }));
  };

  const handleZipSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zipInput)) {
      setZipError('Please enter a valid 5-digit numerical Zip Code.');
      return;
    }
    
    // Check first digit mapping
    const firstDigit = zipInput.charAt(0);
    if (firstDigit !== '9' && firstDigit !== '7' && firstDigit !== '1') {
      setZipError('Zip Code is outside CA, TX, and NY. Showing default CA.');
      setSelectedStateCode('CA');
    } else {
      setZipError('');
    }
  };

  const clearZipSearch = () => {
    setZipInput('');
    setZipError('');
  };

  const triggerPrintReceipt = () => {
    window.print();
  };

  // Status Badge styling helper
  const getStatusBadgeStyles = (status: typeof votingWindowStatus) => {
    switch (status) {
      case 'Registration Open':
        return 'bg-civic-green/10 text-emerald-450 border-civic-green/30';
      case 'Registration Closed, Awaiting Early Voting':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Early Voting Open Now':
        return 'bg-purple-600/15 text-purple-400 border-purple-600/30';
      case 'Awaiting Election Day':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Election Day Today':
        return 'bg-red-600/20 text-red-400 border-red-600/30 animate-pulse';
      case 'General Election Closed':
        return 'bg-slate-900 border-slate-800 text-slate-500';
      default:
        return 'bg-slate-900 border-slate-800 text-slate-400';
    }
  };

  // Calculate Roadmap Milestone Percentages
  const getMilestoneCompletion = (milestoneType: string) => {
    if (!activeState) return 0;
    const steps = complianceChecklist.filter(s => s.type === milestoneType);
    if (steps.length === 0) return 100; // default complete if no steps
    const checkedCount = steps.filter(s => checkedSteps[`${selectedStateCode}-${s.id}`]).length;
    return Math.round((checkedCount / steps.length) * 100);
  };

  const totalProgress = () => {
    if (complianceChecklist.length === 0) return 0;
    const checkedCount = complianceChecklist.filter(s => checkedSteps[`${selectedStateCode}-${s.id}`]).length;
    return Math.round((checkedCount / complianceChecklist.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#0B192C] bg-gradient-to-br from-[#0B192C] via-[#122238] to-[#0B192C] text-slate-100 font-sans selection:bg-civic-gold selection:text-civic-navy pb-16">
      
      {/* digital views wrapper (hidden when printing) */}
      <div className="no-print">
        {/* Skip to Main Content Link for Screen Readers */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-civic-gold focus:text-civic-navy focus:font-bold focus:rounded-md focus:ring-2 focus:ring-white">
          Skip to main content
        </a>

        {/* HEADER SECTION */}
        <header className="border-b border-slate-800 bg-[#0B192C]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <button 
              onClick={() => { setActiveView('home'); setSelectedStateCode(''); clearZipSearch(); }}
              className="flex items-center gap-3 text-left hover:opacity-90 outline-none self-start md:self-auto"
            >
              <div className="bg-gradient-to-tr from-civic-blue to-civic-gold p-2.5 rounded-xl shadow-lg shadow-civic-blue/20 animate-pulse-glow">
                <Vote className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white font-outfit flex items-center gap-2">
                  CivicPulse <span className="text-xs bg-civic-gold/20 text-civic-gold font-semibold px-2 py-0.5 rounded-full border border-civic-gold/30">VOTER CENTER</span>
                </h1>
                <p className="text-xs text-slate-400">Step-by-Step Voter Timelines & Ballot Previews</p>
              </div>
            </button>

            {/* STICKY GLASSMORPHIC NAVIGATION BAR */}
            <nav className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800 backdrop-blur-md shadow-inner" aria-label="Main Navigation">
              <button
                onClick={() => setActiveView('home')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 outline-none cursor-pointer ${
                  activeView === 'home' 
                    ? 'bg-civic-gold text-civic-navy shadow-md font-extrabold scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <span>🏠</span> Home
              </button>
              <button
                onClick={() => {
                  setActiveView('simulator');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 outline-none cursor-pointer ${
                  activeView === 'simulator' 
                    ? 'bg-civic-gold text-civic-navy shadow-md font-extrabold scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <span>🎮</span> Simulator
              </button>
              <button
                onClick={() => {
                  setActiveView('timeline');
                  if (!selectedStateCode || selectedStateCode === 'IN') {
                    setSelectedStateCode('IN');
                  }
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 outline-none cursor-pointer ${
                  activeView === 'timeline' 
                    ? 'bg-civic-gold text-civic-navy shadow-md font-extrabold scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <span>📊</span> Timelines
              </button>
            </nav>

            {/* DUAL SELECTOR IN HEADER (Only displays if timeline view is active and state is selected) */}
            {activeView === 'timeline' && activeState && (
              <div className="flex items-center gap-4 animate-fadeIn">
                {/* ZIP SEARCH FORM */}
                <form onSubmit={handleZipSearchSubmit} className="relative w-42" aria-label="Zip code quick switcher">
                  <div className="relative">
                    <input
                      id="header-zip-search"
                      type="text"
                      maxLength={5}
                      value={zipInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setZipInput(val);
                        if (val.length < 5) {
                          setZipError('');
                        }
                      }}
                      placeholder="Zip Code..."
                      className="w-full bg-slate-950/85 border border-slate-850 text-white rounded-lg pl-8 pr-7 py-1 text-xs placeholder-slate-500 focus-visible:ring-civic-gold focus-visible:ring-2 outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                    {zipInput && (
                      <button
                        type="button"
                        onClick={clearZipSearch}
                        className="absolute right-2 top-1.5 text-xs text-slate-500 hover:text-slate-300 outline-none"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </form>

                {/* Dropdown Selector */}
                <select
                  value={selectedStateCode}
                  onChange={(e) => {
                    setSelectedStateCode(e.target.value);
                    clearZipSearch();
                  }}
                  className="bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1 text-xs font-semibold focus-visible:ring-civic-gold focus-visible:ring-2 focus:border-transparent outline-none cursor-pointer"
                >
                  {statesList.map((state) => (
                    <option key={state.stateCode} value={state.stateCode}>
                      {state.stateCode === 'IN' ? '🇮🇳' : '🇺🇸'} {state.stateName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </header>

        {/* ELECTION COUNTDOWN BANNER (Only displays if timeline view is active and state is selected) */}
        {activeView === 'timeline' && activeState && (
          <div className={`border-b ${
            registrationDeadlinePassed 
              ? 'bg-civic-red/10 border-civic-red/20 text-red-300' 
              : 'bg-civic-gold/10 border-civic-gold/20 text-amber-250'
          }`} aria-live="polite">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4.5 h-4.5 shrink-0 ${registrationDeadlinePassed ? 'text-civic-red' : 'text-civic-gold'}`} />
                <p className="font-semibold text-center sm:text-left">
                  {registrationDeadlinePassed ? (
                    <span>
                      The registration deadline for <strong>{activeState.stateName}</strong> has passed. Standard registration is closed.
                    </span>
                  ) : (
                    <span>
                      ⏰ Only <strong>{daysToRegistrationDeadline} days</strong> remaining to register in <strong>{activeState.stateName}</strong>!
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {zipCodeResolved && (
                  <span className="text-[10px] bg-slate-900/60 border border-slate-800 text-slate-300 p-1 px-2.5 rounded-full font-semibold">
                    zip {zipInput}
                  </span>
                )}
                <span className={`text-xs font-bold p-1 px-3 rounded-lg border font-outfit uppercase shrink-0 ${getStatusBadgeStyles(votingWindowStatus)}`}>
                  {votingWindowStatus}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY CONTAINER */}
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          {/* VIEW 1: HOMEPAGE */}
          {activeView === 'home' && (
            <div className="space-y-16 py-4 animate-fadeIn bg-grid-pattern rounded-3xl p-2 sm:p-6 relative overflow-hidden" aria-label="CivicPulse Interactive Homepage">
              
              {/* Looping hardware-accelerated animated background */}
              <div className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden rounded-3xl opacity-20">
                <div 
                  className="absolute inset-0 bg-cover bg-center animate-bg-zoom" 
                  style={{ backgroundImage: `url('/homepage_bg.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-civic-navy via-transparent to-civic-navy/30" />
              </div>

              {/* HERO INTRO */}
              <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10 py-8">
                {/* Floating animated glowing blobs in background */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-civic-gold/10 rounded-full blur-3xl pointer-events-none animate-float" />
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-civic-blue/20 rounded-full blur-3xl pointer-events-none animate-float-delayed" />
                
                <span className="text-xs bg-civic-gold/10 text-civic-gold font-black px-4 py-2 rounded-full border border-civic-gold/30 uppercase tracking-widest font-outfit animate-pulse">
                  ✨ Secure, Accessible, Private Voting Rehearsals
                </span>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-outfit leading-tight text-shadow-glow">
                  Engage Your Democracy, <br />
                  <span className="bg-gradient-to-r from-civic-gold via-yellow-400 to-amber-500 bg-clip-text text-transparent">Rehearse Your Vote</span>
                </h2>
                <p className="text-base sm:text-lg text-slate-350 leading-relaxed max-w-3xl mx-auto font-medium">
                  CivicPulse guides first-time and experienced electors through complex, localized voting steps globally. Rehearse Form 6 filing, ID verification, mail-in signatures, cryptographic digital ID cast, and preferential ranking in our risk-free visual sandbox.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => setActiveView('simulator')}
                    className="bg-civic-gold hover:bg-yellow-500 text-civic-navy font-black text-sm px-8 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-civic-gold/20 hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer font-outfit"
                  >
                    🎮 Start Voting Rehearsal <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveView('timeline');
                      setSelectedStateCode('IN');
                    }}
                    className="bg-slate-900/80 hover:bg-slate-850 text-white font-bold text-sm px-8 py-3.5 rounded-2xl border border-slate-800 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer font-outfit"
                  >
                    📊 Explore Regional Timelines
                  </button>
                </div>
              </div>

              {/* DUAL CORES AND STATISTICS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto relative z-10">
                
                {/* 1. DEMOCRATIC PLEDGE CORE (LG: 7 columns) */}
                <div className="lg:col-span-7 bg-slate-950/65 border-2 border-civic-gold/45 shadow-[0_0_25px_rgba(255,215,0,0.1)] rounded-3xl p-6 sm:p-8 relative overflow-hidden animate-pulse-glow group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-civic-gold/5 to-transparent pointer-events-none rounded-bl-full" />
                  
                  {/* Particles layer */}
                  {particles.map(p => (
                    <span
                      key={p.id}
                      className="absolute w-3 h-3 rounded-full pointer-events-none animate-ripple z-50 left-1/2 top-1/2 -ml-1.5 -mt-1.5"
                      style={{
                        backgroundColor: p.color,
                        '--tw-x': p.x,
                        '--tw-y': p.y,
                      } as React.CSSProperties}
                    />
                  ))}

                  {!isPledged ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-civic-gold/15 p-3 rounded-2xl border border-civic-gold/25">
                          <Award className="w-8 h-8 text-civic-gold animate-bounce" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-civic-gold uppercase tracking-wider font-outfit">Elector's Pledge</span>
                          <h3 className="text-2xl font-black text-white font-outfit">The Democratic Pledge Core</h3>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                        Commit to participating in your regional democracy. Join thousands of citizens who have pledged to make their voices heard. Submitting your local pledge rings a celebratory melody and fires custom celebration particles!
                      </p>

                      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-850 flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-slate-400 font-outfit uppercase">Total Sworn Electors</span>
                        <span className="text-lg font-black text-emerald-450 font-outfit bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
                          {pledgeCount.toLocaleString()} Pledges
                        </span>
                      </div>

                      <form onSubmit={triggerPledge} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <input 
                            type="text"
                            maxLength={35}
                            required
                            value={pledgeName}
                            onChange={(e) => setPledgeName(e.target.value)}
                            placeholder="Enter your name to pledge..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-4 pr-3 py-3 text-xs sm:text-sm placeholder-slate-600 focus-visible:ring-civic-gold focus-visible:ring-2 outline-none font-semibold"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-civic-gold hover:bg-yellow-500 text-civic-navy font-black text-xs px-6 py-3.5 rounded-xl border border-civic-gold/20 flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer hover:scale-[1.02] active:scale-95 shrink-0 font-outfit"
                        >
                          ✍️ Swear Civic Oath
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-6 text-center py-4 animate-scaleUp">
                      {/* Certified Credential Badge Layout */}
                      <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-civic-gold via-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-civic-gold/30 border-4 border-slate-950 relative">
                        <Award className="w-12 h-12 text-slate-950" />
                        <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow" />
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-civic-gold uppercase tracking-widest font-outfit">Official Certified Credential</span>
                        <h3 className="text-2xl font-black text-white font-outfit">Pledge of Civic Duty</h3>
                        <p className="text-xs text-slate-400">Officially logged in local memory sandbox</p>
                      </div>

                      <div className="bg-slate-900/50 max-w-md mx-auto p-4 rounded-2xl border border-civic-gold/20 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Certified Elector</span>
                        <span className="text-lg font-black text-civic-gold font-outfit tracking-wide">{pledgeName}</span>
                        <span className="w-full h-px bg-slate-800/80 my-1" />
                        <span className="text-[9px] font-semibold text-slate-400 leading-relaxed italic">
                          "I hereby pledge my active dedication to democratic participation, voting awareness, and the continuous defense of civic voice."
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIsPledged(false);
                          setPledgeName('');
                        }}
                        className="text-xs text-slate-400 hover:text-white underline outline-none cursor-pointer"
                      >
                        Sign another pledge
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. PILLARS STATISTICS GRID (LG: 5 columns) */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                  {/* Card 1: Rehearsals */}
                  <div className="bg-slate-950/40 border border-slate-850 hover:border-slate-750 p-5 rounded-2.5xl transition-all duration-305 flex flex-col justify-between group hover:-translate-y-1 shadow-md">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center">
                        <Compass className="w-5 h-5 text-purple-400" />
                      </div>
                      <h4 className="text-sm font-black text-white font-outfit group-hover:text-purple-400 transition-colors">4 Country tracks</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Cast votes on India EVMs, USA mail ballots, Estonia e-voting, and Australia preferences.</p>
                    </div>
                    <span className="text-[10px] font-bold text-purple-400 font-outfit mt-4 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 w-fit">100% Interactive</span>
                  </div>

                  {/* Card 2: Privacy */}
                  <div className="bg-slate-950/40 border border-slate-850 hover:border-slate-750 p-5 rounded-2.5xl transition-all duration-305 flex flex-col justify-between group hover:-translate-y-1 shadow-md">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-emerald-450" />
                      </div>
                      <h4 className="text-sm font-black text-white font-outfit group-hover:text-emerald-450 transition-colors">Absolute Privacy</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Your data resides exclusively inside your browser memory sandbox. Zero tracking, zero risk.</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-450 font-outfit mt-4 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 w-fit">Zero-Log Policy</span>
                  </div>

                  {/* Card 3: Signatures */}
                  <div className="bg-slate-950/40 border border-slate-850 hover:border-slate-750 p-5 rounded-2.5xl transition-all duration-305 flex flex-col justify-between group hover:-translate-y-1 shadow-md">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-amber-400" />
                      </div>
                      <h4 className="text-sm font-black text-white font-outfit group-hover:text-amber-400 transition-colors">Signature Training</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Practice secure signing on gold canvas pads and cryptographic dual-PIN grids.</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 font-outfit mt-4 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 w-fit">Practical Skills</span>
                  </div>

                  {/* Card 4: Accessibility */}
                  <div className="bg-slate-950/40 border border-slate-850 hover:border-slate-750 p-5 rounded-2.5xl transition-all duration-305 flex flex-col justify-between group hover:-translate-y-1 shadow-md">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center">
                        <Users className="w-5 h-5 text-sky-400" />
                      </div>
                      <h4 className="text-sm font-black text-white font-outfit group-hover:text-sky-400 transition-colors">Bilingual Guides</h4>
                      <p className="text-[11px] text-slate-450 leading-relaxed">Complete voice guide synchronization in English and Hindi to promote fully accessible voting.</p>
                    </div>
                    <span className="text-[10px] font-bold text-sky-400 font-outfit mt-4 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20 w-fit">WCAG Compliant</span>
                  </div>
                </div>

              </div>

              {/* TRACKS SELECTION GRID */}
              <div className="space-y-8 max-w-6xl mx-auto pt-6 relative z-10">
                <div className="text-center space-y-2">
                  <span className="text-[10px] bg-civic-gold/10 text-civic-gold font-bold px-3 py-1 rounded-full border border-civic-gold/25 uppercase tracking-widest font-outfit">Choose Your Platform</span>
                  <h3 className="text-3xl font-black text-white font-outfit">Explore Global Voting Timelines</h3>
                  <p className="text-xs sm:text-sm text-slate-405 max-w-xl mx-auto font-medium">Click "Rehearse" to jump into the interactive game sandboxes, or "Dates" to view structured regional milestones and countdown calendars.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* INDIA CARD */}
                  <div className="bg-slate-950/40 hover:bg-slate-950/80 border border-slate-850 hover:border-slate-700 p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl group relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/5 to-transparent pointer-events-none rounded-bl-full" />
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl" role="img" aria-label="India flag">🇮🇳</span>
                        <span className="text-[9px] font-black uppercase bg-orange-500/10 text-orange-400 border border-orange-500/25 px-2 py-0.5 rounded-full font-outfit">ECI EVM Model</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white font-outfit group-hover:text-civic-gold transition-colors">India</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-medium">Practice standard parliamentary processes, verify Form 6 details, EPIC ID, and click the blue EVM ballot buttons.</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          setInitialSimulatorTrack('india_evm');
                          setActiveView('simulator');
                        }}
                        className="bg-civic-gold hover:bg-yellow-500 text-civic-navy font-black text-[10px] py-2 px-3 rounded-xl border border-civic-gold/15 flex items-center justify-center gap-1 transition-all outline-none cursor-pointer font-outfit"
                      >
                        🎮 Rehearse
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedStateCode('IN');
                          setActiveView('timeline');
                          clearZipSearch();
                        }}
                        className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-[10px] py-2 px-3 rounded-xl border border-slate-800 flex items-center justify-center gap-1 transition-all outline-none cursor-pointer font-outfit"
                      >
                        📊 Dates
                      </button>
                    </div>
                  </div>

                  {/* USA CARD */}
                  <div className="bg-slate-950/40 hover:bg-slate-950/80 border border-slate-850 hover:border-slate-700 p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl group relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none rounded-bl-full" />
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl" role="img" aria-label="United States flag">🇺🇸</span>
                        <span className="text-[9px] font-black uppercase bg-blue-500/10 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded-full font-outfit">State Deadlines</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white font-outfit group-hover:text-civic-gold transition-colors">United States</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-medium">Navigate decentralized rules, signature verification, mail-in request guidelines, and postmark deadlines.</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          setInitialSimulatorTrack('usa_deadlines');
                          setActiveView('simulator');
                        }}
                        className="bg-civic-gold hover:bg-yellow-500 text-civic-navy font-black text-[10px] py-2 px-3 rounded-xl border border-civic-gold/15 flex items-center justify-center gap-1 transition-all outline-none cursor-pointer font-outfit"
                      >
                        🎮 Rehearse
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedStateCode('CA'); // California default US
                          setActiveView('timeline');
                          clearZipSearch();
                        }}
                        className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-[10px] py-2 px-3 rounded-xl border border-slate-800 flex items-center justify-center gap-1 transition-all outline-none cursor-pointer font-outfit"
                      >
                        📊 Dates
                      </button>
                    </div>
                  </div>

                  {/* ESTONIA CARD */}
                  <div className="bg-slate-950/40 hover:bg-slate-950/80 border border-slate-850 hover:border-slate-700 p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl group relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-sky-500/5 to-transparent pointer-events-none rounded-bl-full" />
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl" role="img" aria-label="Estonia flag">🇪🇪</span>
                        <span className="text-[9px] font-black uppercase bg-sky-500/10 text-sky-400 border border-sky-500/25 px-2 py-0.5 rounded-full font-outfit">E-Voting Crypt</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white font-outfit group-hover:text-civic-gold transition-colors">Estonia</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-medium">Rehearse digital ID authentication, PIN 1 secure validation, online ballot selection, and PIN 2 encryption signing.</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          setInitialSimulatorTrack('estonia_ivoting');
                          setActiveView('simulator');
                        }}
                        className="bg-civic-gold hover:bg-yellow-500 text-civic-navy font-black text-[10px] py-2 px-3 rounded-xl border border-civic-gold/15 flex items-center justify-center gap-1 transition-all outline-none cursor-pointer font-outfit"
                      >
                        🎮 Rehearse
                      </button>
                      <button 
                        onClick={() => {
                          setInitialSimulatorTrack('estonia_ivoting');
                          setActiveView('simulator');
                          alert("🇪🇪 Estonia I-Voting Period:\nCast online via secure digital ID starting from 7 days prior up until 1 day before general election day. Votes are fully revocable by e-voting again or voting physically in person.");
                        }}
                        className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-[10px] py-2 px-3 rounded-xl border border-slate-800 flex items-center justify-center gap-1 transition-all outline-none cursor-pointer font-outfit"
                      >
                        📊 Dates
                      </button>
                    </div>
                  </div>

                  {/* AUSTRALIA CARD */}
                  <div className="bg-slate-950/40 hover:bg-slate-950/80 border border-slate-850 hover:border-slate-700 p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl group relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/5 to-transparent pointer-events-none rounded-bl-full" />
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl" role="img" aria-label="Australia flag">🇦🇺</span>
                        <span className="text-[9px] font-black uppercase bg-green-500/10 text-green-455 border border-green-500/25 px-2 py-0.5 rounded-full font-outfit">Mandatory Preferential</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white font-outfit group-hover:text-civic-gold transition-colors">Australia</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-medium">Navigate compulsory voting compliance, democracy sausage traditions, green & white ballot guides, and preferential numbering.</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          setInitialSimulatorTrack('australia_ranked');
                          setActiveView('simulator');
                        }}
                        className="bg-civic-gold hover:bg-yellow-500 text-civic-navy font-black text-[10px] py-2 px-3 rounded-xl border border-civic-gold/15 flex items-center justify-center gap-1 transition-all outline-none cursor-pointer font-outfit"
                      >
                        🎮 Rehearse
                      </button>
                      <button 
                        onClick={() => {
                          setInitialSimulatorTrack('australia_ranked');
                          setActiveView('simulator');
                          alert("🇦🇺 Australia Election Day:\nFederal elections are compulsory for all eligible citizens and always held on a Saturday. Traditional polling booths serve democracy sausages, and voting requires numbering candidates preferentially (e.g. 1, 2, 3).");
                        }}
                        className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-[10px] py-2 px-3 rounded-xl border border-slate-800 flex items-center justify-center gap-1 transition-all outline-none cursor-pointer font-outfit"
                      >
                        📊 Dates
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: DYNAMIC STANDALONE SIMULATOR */}
          {activeView === 'simulator' && (
            <section className="space-y-6 animate-fadeIn py-4" aria-label="Global Rehearsal Simulator Sandbox">
              <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
                <span className="text-xs bg-civic-gold/10 text-civic-gold font-black px-4 py-2 rounded-full border border-civic-gold/30 uppercase tracking-widest font-outfit animate-pulse">
                  🎮 Interactive Rehearsal Sandbox
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-outfit leading-tight text-shadow-glow">
                  Rehearse Voting Worldwide
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto font-medium">
                  Go through the step-by-step voting procedures of India, United States, Estonia, or Australia. Complete challenge queries and interact with the custom sandbox mechanics below.
                </p>
              </div>
              <div className="bg-slate-950/40 p-4 sm:p-8 rounded-3xl border border-slate-850 shadow-2xl relative">
                <GlobalJourneySimulator initialTrackId={initialSimulatorTrack} />
              </div>
            </section>
          )}

          {/* VIEW 3: TIMELINES & REGIONAL TIMELINES DASHBOARD */}
          {activeView === 'timeline' && !selectedStateCode && (
            <section className="space-y-12 py-6 animate-fadeIn" aria-label="State Selector Landing View">
              
              {/* HERO INTRO */}
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-xs bg-civic-gold/10 text-civic-gold font-bold px-3 py-1.5 rounded-full border border-civic-gold/30 uppercase tracking-widest font-outfit">
                  Private & Accessible Voter Support
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-outfit leading-tight text-shadow-glow">
                  Navigate Your Election Journey with Trust
                </h2>
                <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                  CivicPulse guides you through complex state-specific deadlines, voter ID mandates, and interactive sample ballot preview simulations—keeping your choices fully private on your device.
                </p>
              </div>

              {/* SEARCH BLOCK */}
              <div className="max-w-md mx-auto bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-xl relative">
                <h3 className="text-sm font-bold text-slate-300 mb-3 text-center uppercase tracking-wider font-outfit">Quick Lookup by Zip Code</h3>
                <form onSubmit={handleZipSearchSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={5}
                      value={zipInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setZipInput(val);
                        setZipError('');
                      }}
                      placeholder="Enter 5-digit Zip (e.g. 90210, 75201)..."
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-3 py-3 text-sm placeholder-slate-600 focus-visible:ring-civic-gold focus-visible:ring-2 focus:border-transparent outline-none transition-all"
                    />
                    <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                  <button 
                    type="submit"
                    className="bg-civic-blue hover:bg-slate-700 text-white font-semibold text-xs px-5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all outline-none cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    Go <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
                {zipError && (
                  <p className="text-civic-red text-xs mt-3 text-center font-medium animate-shake">
                    ⚠️ {zipError}
                  </p>
                )}
              </div>

              {/* LANDING STATE CARDS SELECTOR */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Or Explore Sample States</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {statesList.map((state) => {
                    return (
                      <button
                        key={state.stateCode}
                        onClick={() => {
                          setSelectedStateCode(state.stateCode);
                          clearZipSearch();
                        }}
                        className="text-left bg-slate-900/40 hover:bg-slate-900/80 border border-slate-850 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] h-full shadow-lg group relative overflow-hidden focus:ring-civic-gold focus:ring-2 outline-none"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none rounded-bl-full" />
                        
                        <div className="space-y-4 w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-3xl" role="img" aria-label={state.stateCode === 'IN' ? 'India flag' : 'US flag'}>
                              {state.stateCode === 'IN' ? '🇮🇳' : '🇺🇸'}
                            </span>
                            <span className={`text-[9px] font-bold uppercase p-1 px-2.5 rounded-full border ${
                              state.idRequirements.strictness.includes('Strict')
                                ? 'bg-civic-red/10 text-civic-red border-civic-red/20'
                                : 'bg-civic-green/10 text-emerald-400 border-civic-green/20'
                            }`}>
                              {state.idRequirements.strictness}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xl font-extrabold text-white font-outfit group-hover:text-civic-gold transition-colors">{state.stateName}</h4>
                            <p className="text-xs text-slate-450 mt-1 font-semibold">{state.sampleBallot.district}</p>
                          </div>

                          {/* SCANNABLE STATE BULLET PREVIEWS */}
                          <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800/60">
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-civic-gold" />
                              <span>Reg deadline: <strong className="text-white">{state.voterRegistration.mailDeadline.displayDate}</strong></span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-civic-gold" />
                              <span>Mail ballot excuse: <strong className="text-white">{state.mailInBallot.excuseRequired ? 'Excuse Required' : 'No excuse needed'}</strong></span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-civic-gold" />
                              <span>Early voting starts: <strong className="text-white">{state.earlyVoting.startDate.displayDate}</strong></span>
                            </li>
                          </ul>
                        </div>

                        <div className="mt-6 flex items-center gap-1.5 text-xs text-civic-gold font-bold group-hover:underline">
                          Select State <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ACTIVE STATE VIEWS */}
          {activeView === 'timeline' && selectedStateCode && activeState && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* STATE TITLE & ACTIVE CONTROLS GRID */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button 
                      onClick={() => { setSelectedStateCode(''); clearZipSearch(); }}
                      className="text-slate-400 hover:text-white hover:underline outline-none"
                    >
                      All States
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-650" />
                    <span className="text-slate-300 font-semibold">{activeState.stateName} Center</span>
                  </div>
                  <h2 className="text-3xl font-extrabold font-outfit text-white mt-1 flex items-center gap-3">
                    {activeState.stateCode === 'IN' ? '🇮🇳' : '🇺🇸'} {activeState.stateName} <span className="text-xs bg-[#1E3E62]/60 text-slate-300 font-normal p-1 px-3 rounded-full border border-slate-800 font-outfit uppercase">District Preview</span>
                  </h2>
                </div>

                {/* TAB SELECTOR */}
                <nav className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-850 w-full sm:w-auto" aria-label="Feature navigation menu">
                  <button
                    onClick={() => setActiveTab('timeline')}
                    aria-selected={activeTab === 'timeline'}
                    role="tab"
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all outline-none flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'timeline' ? 'bg-civic-blue text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" /> Timeline
                  </button>
                  <button
                    onClick={() => setActiveTab('roadmap')}
                    aria-selected={activeTab === 'roadmap'}
                    role="tab"
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all outline-none flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'roadmap' ? 'bg-civic-blue text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Action Roadmap
                  </button>
                  <button
                    onClick={() => setActiveTab('ballot')}
                    aria-selected={activeTab === 'ballot'}
                    role="tab"
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all outline-none flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'ballot' ? 'bg-civic-blue text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Vote className="w-3.5 h-3.5" /> Ballot Simulator
                  </button>
                </nav>
              </div>

              {/* VIEW 1: TIMELINE PANEL */}
              {activeTab === 'timeline' && (
                <div className="space-y-8">
                  {selectedStateCode === 'IN' && <VotingFlowchart />}
                  <VisualTimeline stateData={activeState} />
                </div>
              )}

              {/* VIEW 2: ROADMAP PROGRESS CHECKLIST */}
              {activeTab === 'roadmap' && (
                <section id="roadmap-tab" className="space-y-6 animate-fadeIn" aria-label="Dynamic Milestone Progress Roadmap">
                  
                  {/* Progress Header Box */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b-2 border-slate-800">
                    <div className="space-y-2 w-full md:max-w-md">
                      <h3 className="text-xl font-bold font-outfit text-white">Your Civic Progress Roadmap</h3>
                      <p className="text-xs text-slate-400">Complete the scannable checklist tasks below. The milestones will light up, filling your progress roadmap!</p>
                      
                      <div className="flex items-center gap-3 pt-2">
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                          <div 
                            className="bg-gradient-to-r from-civic-blue to-civic-gold h-full rounded-full transition-all duration-500"
                            style={{ width: `${totalProgress()}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-civic-gold shrink-0 font-outfit">{totalProgress()}%</span>
                      </div>
                    </div>

                    {/* HORIZONTAL ROADMAP INTERACTIVE NODES */}
                    <div className="flex items-center justify-between gap-2 sm:gap-6 w-full md:w-auto pt-4 md:pt-0 overflow-x-auto scrollbar-none">
                      {/* Node 1: Registration */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          getMilestoneCompletion('registration') === 100 
                            ? 'bg-civic-gold border-civic-gold text-civic-navy shadow-md shadow-civic-gold/20'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5 font-outfit">Register</span>
                      </div>

                      <div className={`w-8 sm:w-12 h-0.5 transition-colors duration-300 ${getMilestoneCompletion('registration') === 100 ? 'bg-civic-gold' : 'bg-slate-800'}`} />

                      {/* Node 2: ID Check */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          getMilestoneCompletion('id-check') === 100 
                            ? 'bg-[#38BDF8] border-[#38BDF8] text-civic-navy shadow-md shadow-[#38BDF8]/20'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5 font-outfit">ID Check</span>
                      </div>

                      <div className={`w-8 sm:w-12 h-0.5 transition-colors duration-300 ${getMilestoneCompletion('id-check') === 100 ? 'bg-sky-400' : 'bg-slate-800'}`} />

                      {/* Node 3: Verification/Actions */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          getMilestoneCompletion('action') === 100 
                            ? 'bg-[#A855F7] border-[#A855F7] text-civic-navy shadow-md shadow-[#A855F7]/20'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          <MapPin className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5 font-outfit">Verify Prec.</span>
                      </div>
                    </div>
                  </div>

                  {/* Scannable tasks layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columns containing list tasks */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Milestone Category 1: Registration Check */}
                      <div className="bg-slate-950/45 p-6 rounded-2xl border border-slate-850 space-y-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 font-outfit border-b border-slate-800 pb-2">
                          <CheckCircle2 className="w-4 h-4 text-civic-gold" /> Milestone 1 Tasks: Voter Registration
                        </h4>

                        <div className="space-y-3">
                          {complianceChecklist.filter(s => s.type === 'registration').map((step) => {
                            const stepKey = `${selectedStateCode}-${step.id}`;
                            const isChecked = !!checkedSteps[stepKey];
                            return (
                              <button
                                key={step.id}
                                onClick={() => toggleStep(step.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-3.5 hover:border-slate-700 cursor-pointer outline-none ${
                                  isChecked ? 'bg-civic-green/10 border-civic-green/30' : 'bg-slate-900/60 border-slate-800/80'
                                }`}
                              >
                                <div className={`w-5.5 h-5.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  isChecked ? 'bg-civic-green border-civic-green text-white' : 'border-slate-700 bg-slate-950 text-transparent'
                                }`}>
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                  <div className={`font-bold text-sm ${isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
                                    {step.title}
                                  </div>
                                  <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                                    {step.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Milestone Category 2: ID Checks */}
                      <div className="bg-slate-950/45 p-6 rounded-2xl border border-slate-850 space-y-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 font-outfit border-b border-slate-800 pb-2">
                          <ShieldCheck className="w-4 h-4 text-sky-400" /> Milestone 2 Tasks: ID Verification
                        </h4>

                        <div className="space-y-3">
                          {complianceChecklist.filter(s => s.type === 'id-check').map((step) => {
                            const stepKey = `${selectedStateCode}-${step.id}`;
                            const isChecked = !!checkedSteps[stepKey];
                            return (
                              <button
                                key={step.id}
                                onClick={() => toggleStep(step.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-3.5 hover:border-slate-700 cursor-pointer outline-none ${
                                  isChecked ? 'bg-civic-green/10 border-civic-green/30' : 'bg-slate-900/60 border-slate-800/80'
                                }`}
                              >
                                <div className={`w-5.5 h-5.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  isChecked ? 'bg-civic-green border-civic-green text-white' : 'border-slate-700 bg-slate-950 text-transparent'
                                }`}>
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold text-sm ${isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
                                      {step.title}
                                    </span>
                                    {step.required && (
                                      <span className="text-[8px] bg-civic-red/10 text-civic-red font-bold px-1.5 py-0.5 rounded border border-civic-red/20 uppercase font-outfit">Required</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                                    {step.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Milestone Category 3: Precinct Checks */}
                      <div className="bg-slate-950/45 p-6 rounded-2xl border border-slate-850 space-y-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 font-outfit border-b border-slate-800 pb-2">
                          <MapPin className="w-4 h-4 text-purple-400" /> Milestone 3 Tasks: Action & Precinct assignment
                        </h4>

                        <div className="space-y-3">
                          {complianceChecklist.filter(s => s.type === 'action').map((step) => {
                            const stepKey = `${selectedStateCode}-${step.id}`;
                            const isChecked = !!checkedSteps[stepKey];
                            return (
                              <button
                                key={step.id}
                                onClick={() => toggleStep(step.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-3.5 hover:border-slate-700 cursor-pointer outline-none ${
                                  isChecked ? 'bg-civic-green/10 border-civic-green/30' : 'bg-slate-900/60 border-slate-800/80'
                                }`}
                              >
                                <div className={`w-5.5 h-5.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  isChecked ? 'bg-civic-green border-civic-green text-white' : 'border-slate-700 bg-slate-950 text-transparent'
                                }`}>
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                  <div className={`font-bold text-sm ${isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
                                    {step.title}
                                  </div>
                                  <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                                    {step.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Next Steps Prompt Card */}
                    <div>
                      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h4 className="text-sm font-bold text-white font-outfit border-b border-slate-800 pb-3">What's Next?</h4>
                        
                        {totalProgress() === 100 ? (
                          <div className="space-y-4">
                            <div className="bg-civic-green/20 text-civic-green border border-civic-green/30 p-4 rounded-xl text-xs font-semibold flex items-start gap-2">
                              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                              <p>Excellent! You have fully completed all requirements for the {activeState.stateName} election journey!</p>
                            </div>
                            <p className="text-xs text-slate-400">Now, proceed to the Ballot Simulator to practice selecting candidates and measuring outcomes securely.</p>
                            <button
                              onClick={() => setActiveTab('ballot')}
                              className="bg-civic-gold hover:bg-yellow-500 text-civic-navy text-xs font-bold w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors outline-none cursor-pointer"
                            >
                              Launch Ballot Simulator <Vote className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4 text-xs text-slate-400">
                            <p>Complete all tasks in standard deadlines. Check off items to visually see the roadmap fill up.</p>
                            
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                              <div className="font-semibold text-slate-300">Pending Actions:</div>
                              <ul className="space-y-1 text-slate-400 list-disc list-inside">
                                {complianceChecklist.filter(s => !checkedSteps[`${selectedStateCode}-${s.id}`]).slice(0, 2).map((step) => (
                                  <li key={step.id} className="truncate">{step.title}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* VIEW 3: INTERACTIVE BALLOT SIMULATION */}
              {activeTab === 'ballot' && (
                <section id="ballot-tab" className="space-y-6 animate-fadeIn" aria-label="Interactive Sample Ballot Simulator">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-2xl font-bold font-outfit text-white">State Mock Ballot Simulator</h3>
                      <p className="text-sm text-slate-400">Rehearse selections privately on your device. Click candidate blocks and Proposition referendums to cast test choices.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Accessible Symbol Mode Toggle */}
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 p-1.5 px-3 rounded-xl shadow-inner">
                        <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider font-outfit">Symbol View:</span>
                        <button
                          onClick={() => {
                            const newMode = !symbolMode;
                            setSymbolMode(newMode);
                            if (ballotLang === 'en') {
                              speak(`Symbol Mode is now ${newMode ? 'enabled. Large graphic symbols are active' : 'disabled. Standard text view is active'}.`, 'en-US');
                            } else {
                              speak(`El modo de símbolo está ahora ${newMode ? 'activado. Los símbolos gráficos grandes están activos' : 'desactivado. La vista de texto estándar está activa'}.`, 'es-ES');
                            }
                          }}
                          aria-pressed={symbolMode}
                          className={`p-1.5 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 outline-none cursor-pointer ${
                            symbolMode 
                              ? 'bg-civic-gold text-civic-navy shadow-md shadow-civic-gold/10' 
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" /> {symbolMode ? 'Active' : 'Enable'}
                        </button>
                      </div>

                      {/* Accessible Ballot Language Toggle (Only for US States) */}
                      {selectedStateCode !== 'IN' && (
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 p-1.5 px-3 rounded-xl shadow-inner animate-fadeIn">
                          <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider font-outfit">Ballot Language:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setBallotLang('en');
                                speak("Language changed to English.", "en-US");
                              }}
                              className={`p-1 px-2.5 rounded-md text-[10px] font-black transition-all uppercase tracking-wider outline-none cursor-pointer ${
                                ballotLang === 'en'
                                  ? 'bg-civic-gold text-civic-navy shadow shadow-civic-gold/10'
                                  : 'text-slate-455 hover:text-white'
                              }`}
                            >
                              🇺🇸 EN
                            </button>
                            <button
                              onClick={() => {
                                setBallotLang('es');
                                speak("Idioma cambiado a Español.", "es-ES");
                              }}
                              className={`p-1 px-2.5 rounded-md text-[10px] font-black transition-all uppercase tracking-wider outline-none cursor-pointer ${
                                ballotLang === 'es'
                                  ? 'bg-civic-gold text-civic-navy shadow shadow-civic-gold/10'
                                  : 'text-slate-455 hover:text-white'
                              }`}
                            >
                              🇪🇸 ES
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setIsReceiptModalOpen(true)}
                        className="bg-civic-gold hover:bg-yellow-500 text-civic-navy text-xs font-extrabold p-2.5 px-5 rounded-xl flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 outline-none cursor-pointer shadow-lg shadow-civic-gold/15"
                      >
                        <Printer className="w-4 h-4" /> Choices Reminder Card
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Ballot items container */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Loop offices / EVM Simulator for India */}
                      {selectedStateCode === 'IN' ? (
                        <div className="space-y-4">
                          <div className="glass-panel rounded-2xl p-6 border hover:border-slate-800 transition-colors">
                            <div className="flex items-start justify-between border-b border-slate-850 pb-4 mb-4 gap-4">
                              <div>
                                <span className="text-[10px] font-bold text-civic-gold uppercase tracking-wider font-outfit">Parliamentary Contest</span>
                                <h4 className="text-lg font-bold text-white mt-0.5">Member of Parliament (Lok Sabha)</h4>
                                <p className="text-xs text-slate-400 mt-1">Practice voting by pressing the blue button next to your candidate on the authentic Electronic Voting Machine balloting unit below.</p>
                              </div>
                              {selectedCandidates[`${selectedStateCode}-parliament`] && (
                                <span className="bg-civic-green/20 text-civic-green border border-civic-green/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 font-outfit">
                                  <Check className="w-3 h-3" /> CHOICE COMPLETED
                                </span>
                              )}
                            </div>
                            <div className="mt-6">
                              <EVMSimulator
                                stateData={activeState}
                                selectedCandidateId={selectedCandidates[`${selectedStateCode}-parliament`] || ''}
                                onSelectCandidate={(candidateId) => handleSelectCandidate('parliament', candidateId)}
                              />
                            </div>
                          </div>
                          <GlobalJourneySimulator />
                        </div>
                      ) : (
                        activeState.sampleBallot.offices.map((office) => {
                          const selectionKey = `${selectedStateCode}-${office.id}`;
                          const selectedCandidateId = selectedCandidates[selectionKey];

                          return (
                            <div key={office.id} className="glass-panel rounded-2xl p-6 border hover:border-slate-800 transition-colors">
                              <div className="flex items-start justify-between border-b border-slate-850 pb-4 mb-4 gap-4">
                                <div>
                                  <span className="text-[10px] font-bold text-civic-gold uppercase tracking-wider font-outfit">Federal Contest</span>
                                  <h4 className="text-lg font-bold text-white mt-0.5">{office.title}</h4>
                                  <p className="text-xs text-slate-400 mt-1">{office.description}</p>
                                </div>
                                {selectedCandidateId && (
                                  <span className="bg-civic-green/20 text-civic-green border border-civic-green/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 font-outfit">
                                    <Check className="w-3 h-3" /> CHOICE COMPLETED
                                  </span>
                                )}
                              </div>

                              {/* Candidate choices */}
                              <div className={`grid gap-6 ${symbolMode ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                                {office.candidates.map((candidate) => {
                                  const isSelected = selectedCandidateId === candidate.id;
                                  
                                  if (symbolMode) {
                                    const SymbolIcon = SymbolIconMap[candidate.symbolName] || Star;
                                    return (
                                      <div
                                        key={candidate.id}
                                        className={`rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${
                                          isSelected
                                            ? 'bg-[#1E3E62]/35 border-civic-gold shadow-xl shadow-civic-gold/5'
                                            : 'bg-slate-900/50 border-slate-850 hover:border-slate-700'
                                        }`}
                                      >
                                        {/* Mock Photo & Details */}
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                          <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-slate-800 bg-slate-950 font-outfit text-2xl font-black shrink-0 relative overflow-hidden shadow-inner">
                                            <div className={`absolute inset-0 bg-gradient-to-tr opacity-25 ${
                                              candidate.party === 'Democrat' ? 'from-blue-600 to-sky-400' :
                                              candidate.party === 'Republican' ? 'from-red-650 to-orange-500' :
                                              'from-civic-gold to-yellow-300'
                                            }`} />
                                            <span className="relative z-10 text-slate-100 select-none tracking-wider">
                                              {candidate.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                            <div className={`absolute bottom-0 inset-x-0 text-[8px] font-bold text-center py-0.5 text-white ${
                                              candidate.party === 'Democrat' ? 'bg-blue-600' :
                                              candidate.party === 'Republican' ? 'bg-red-600' :
                                              'bg-slate-800'
                                            }`}>
                                              {candidate.party}
                                            </div>
                                          </div>
                                          <div>
                                            <h5 className="text-xl font-extrabold text-white font-outfit">{candidate.name}</h5>
                                            <p className="text-xs text-slate-400 font-semibold mt-0.5">{candidate.party} Candidate</p>
                                            <p className="text-xs text-slate-350 mt-2 line-clamp-2 md:max-w-xs">{candidate.bio}</p>
                                          </div>
                                        </div>

                                        {/* Symbol and Confirmation */}
                                        <div className="flex flex-col items-center gap-3 shrink-0 w-full md:w-auto">
                                          <button
                                            onClick={() => {
                                              handleSelectCandidate(office.id, candidate.id);
                                              const spanishSymbols: Record<string, string> = {
                                                Sun: 'Sol',
                                                Mountain: 'Montaña',
                                                Tree: 'Árbol',
                                                Crown: 'Corona',
                                                Star: 'Estrella',
                                                Anchor: 'Ancla',
                                                Mango: 'Mango',
                                                Umbrella: 'Paraguas',
                                                Bicycle: 'Bicicleta'
                                              };
                                              const symES = spanishSymbols[candidate.symbolName] || candidate.symbolName;
                                              if (ballotLang === 'en') {
                                                speak(`You have selected the ${candidate.symbolName} candidate. Click the green checkmark below to confirm your practice vote.`, 'en-US');
                                              } else {
                                                speak(`Ha seleccionado el candidato del símbolo ${symES}. Haga clic en la marca de verificación verde a continuación para confirmar su voto de práctica.`, 'es-ES');
                                              }
                                            }}
                                            aria-label={`Select ${candidate.symbolName} symbol for ${candidate.name}`}
                                            className={`w-24 h-24 rounded-3xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 outline-none ${
                                              getSymbolClasses(candidate.symbolColor, isSelected)
                                            }`}
                                          >
                                            <SymbolIcon className="w-12 h-12" aria-hidden="true" />
                                          </button>

                                          {isSelected && (
                                            <button
                                              onClick={() => {
                                                const spanishSymbols: Record<string, string> = {
                                                  Sun: 'Sol',
                                                  Mountain: 'Montaña',
                                                  Tree: 'Árbol',
                                                  Crown: 'Corona',
                                                  Star: 'Estrella',
                                                  Anchor: 'Ancla',
                                                  Mango: 'Mango',
                                                  Umbrella: 'Paraguas',
                                                  Bicycle: 'Bicicleta'
                                                };
                                                const symES = spanishSymbols[candidate.symbolName] || candidate.symbolName;
                                                if (ballotLang === 'en') {
                                                  speak(`Vote for the ${candidate.symbolName} candidate, ${candidate.name}, is successfully confirmed!`, 'en-US');
                                                } else {
                                                  speak(`¡Su voto para el candidato de ${symES}, ${candidate.name}, se ha confirmado con éxito!`, 'es-ES');
                                                }
                                              }}
                                              aria-label={`Confirm choice for ${candidate.name}`}
                                              className="w-10 h-10 rounded-full bg-civic-green text-white border-2 border-slate-900 shadow-lg shadow-civic-green/30 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 animate-bounce"
                                              style={{ animationDuration: '2s' }}
                                            >
                                              <Check className="w-5 h-5 font-black" />
                                            </button>
                                          )}
                                        </div>

                                        {/* Large symbol background decoration */}
                                        <div className="absolute right-4 bottom-2 text-slate-800/10 font-outfit text-6xl font-black select-none pointer-events-none uppercase tracking-widest hidden md:block">
                                          {candidate.symbolName}
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <button
                                      key={candidate.id}
                                      onClick={() => handleSelectCandidate(office.id, candidate.id)}
                                      className={`text-left rounded-xl p-4 border transition-all duration-300 flex flex-col justify-between h-full cursor-pointer outline-none relative overflow-hidden ${
                                        isSelected
                                          ? 'bg-[#1E3E62]/40 border-civic-gold ring-1 ring-civic-gold'
                                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                                      }`}
                                    >
                                      <div className="w-full">
                                        <div className="flex justify-between items-start gap-2">
                                          <div className="font-bold text-sm text-white">{candidate.name}</div>
                                          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                            candidate.party === 'Democrat' 
                                              ? 'bg-blue-600/10 text-blue-455 border-blue-600/30'
                                              : candidate.party === 'Republican'
                                              ? 'bg-red-600/10 text-red-400 border-red-600/30'
                                              : 'bg-yellow-600/10 text-yellow-400 border-yellow-600/30'
                                          }`}>
                                            {candidate.party.slice(0, 3)}
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-350 mt-2 leading-relaxed">
                                          {candidate.bio}
                                        </p>
                                      </div>

                                      <div className="mt-4 pt-3 border-t border-slate-800/60 w-full">
                                        <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider font-outfit">Platform Points:</span>
                                        <ul className="list-disc list-inside text-[10px] text-slate-300 space-y-1 mt-1">
                                          {candidate.platform.slice(0, 2).map((plat, idx) => (
                                            <li key={idx} className="truncate">{plat}</li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* Highlight choice flag */}
                                      {isSelected && (
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-civic-gold rounded-bl-full flex items-start justify-end p-1">
                                          <Check className="w-3 h-3 text-civic-navy font-bold" />
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                      )}

                      {/* Measures section */}
                      {activeState.sampleBallot.measures.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-base font-bold font-outfit text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-civic-gold" /> Referendums, Proposals & Local Measures
                          </h4>

                          {activeState.sampleBallot.measures.map((measure) => {
                            const measureKey = `${selectedStateCode}-${measure.id}`;
                            const measureChoice = selectedMeasures[measureKey];
                            
                            return (
                              <div key={measure.id} className="glass-panel rounded-2xl p-6 border hover:border-slate-800 transition-colors">
                                <div className="flex items-start justify-between border-b border-slate-850 pb-3 mb-3 gap-2">
                                  <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-outfit bg-slate-900 border border-slate-800 p-1 px-2.5 rounded-lg">
                                    {measure.type}
                                  </span>
                                  {measureChoice && (
                                    <span className="bg-civic-green/20 text-civic-green border border-civic-green/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 font-outfit">
                                      <Check className="w-3 h-3" /> CHOICE CAST: {measureChoice}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-base font-bold text-white font-outfit">{measure.title}</h4>
                                <p className="text-xs text-slate-350 mt-2 leading-relaxed bg-[#0B192C]/40 p-3 rounded-xl border border-slate-850">
                                  {measure.summary}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-2">
                                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 text-xs">
                                    <span className="font-bold text-civic-green uppercase tracking-wider text-[9px] font-outfit block">Arguments For (Yes)</span>
                                    <p className="text-slate-350 mt-1 leading-normal">{measure.argumentsFor}</p>
                                  </div>
                                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 text-xs">
                                    <span className="font-bold text-civic-red uppercase tracking-wider text-[9px] font-outfit block">Arguments Against (No)</span>
                                    <p className="text-slate-350 mt-1 leading-normal">{measure.argumentsAgainst}</p>
                                  </div>
                                </div>

                                {/* Choice sandbox buttons */}
                                <div className="flex gap-4 mt-6 pt-4 border-t border-slate-850/80">
                                  <button
                                    onClick={() => handleSelectMeasure(measure.id, 'YES')}
                                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 outline-none cursor-pointer transition-all border ${
                                      measureChoice === 'YES'
                                        ? 'bg-civic-green border-civic-green text-white shadow-md shadow-civic-green/20'
                                        : 'bg-slate-900/40 hover:bg-slate-900 text-slate-300 border-slate-800/80'
                                    }`}
                                  >
                                    <ThumbsUp className="w-4 h-4" /> Practice YES
                                  </button>
                                  <button
                                    onClick={() => handleSelectMeasure(measure.id, 'NO')}
                                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 outline-none cursor-pointer transition-all border ${
                                      measureChoice === 'NO'
                                        ? 'bg-civic-red border-civic-red text-white shadow-md shadow-civic-red/20'
                                        : 'bg-slate-900/40 hover:bg-slate-900 text-slate-300 border-slate-800/80'
                                    }`}
                                  >
                                    <ThumbsDown className="w-4 h-4" /> Practice NO
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Voting Booth Summary Sidebar */}
                    <div>
                      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 sticky top-24">
                        <h4 className="text-sm font-bold text-white font-outfit flex items-center gap-2 border-b border-slate-800 pb-3">
                          <Vote className="w-5 h-5 text-civic-gold" /> Practice Choices Summary
                        </h4>
                        
                        {(() => {
                          const offices = activeState.sampleBallot.offices;
                          const choicesCount = offices.filter(o => selectedCandidates[`${selectedStateCode}-${o.id}`]).length;
                          const measures = activeState.sampleBallot.measures;
                          const measuresCount = measures.filter(m => selectedMeasures[`${selectedStateCode}-${m.id}`]).length;
                          const totalVotes = choicesCount + measuresCount;
                          const expectedTotal = offices.length + measures.length;

                          return (
                            <>
                              <div className="flex justify-between text-xs font-semibold text-slate-400">
                                <span>Choices Rehearsed</span>
                                <span className="text-civic-gold font-bold">{totalVotes} of {expectedTotal}</span>
                              </div>

                              <div className="space-y-3 pt-2">
                                {offices.map((office) => {
                                  const selectedCandidateId = selectedCandidates[`${selectedStateCode}-${office.id}`];
                                  const candidate = office.candidates.find(c => c.id === selectedCandidateId);
                                  return (
                                    <div key={office.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs flex justify-between items-center gap-2">
                                      <div className="truncate">
                                        <div className="font-semibold text-slate-450 text-[9px] uppercase font-outfit truncate">{office.title}</div>
                                        <div className="font-bold text-white mt-0.5 truncate max-w-[140px]">
                                          {candidate ? candidate.name : 'No Choice Selected'}
                                        </div>
                                      </div>
                                      {candidate ? (
                                        <span className="text-[8px] font-bold uppercase text-civic-gold font-outfit bg-civic-gold/10 p-0.5 px-2 rounded border border-civic-gold/20 shrink-0">
                                          {candidate.party.slice(0, 3)}
                                        </span>
                                      ) : (
                                        <span className="text-[8px] text-slate-500 italic shrink-0">
                                          Pending
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}

                                {measures.map((measure) => {
                                  const choice = selectedMeasures[`${selectedStateCode}-${measure.id}`];
                                  return (
                                    <div key={measure.id} className="bg-slate-950 p-3 rounded-xl border border-slate-855 text-xs flex justify-between items-center gap-2">
                                      <div className="truncate">
                                        <div className="font-semibold text-slate-450 text-[9px] uppercase font-outfit truncate">{measure.type} Proposal</div>
                                        <div className="font-bold text-white mt-0.5 truncate max-w-[140px]">
                                          {measure.title.split(':')[0]}
                                        </div>
                                      </div>
                                      {choice ? (
                                        <span className={`text-[8px] font-bold uppercase p-0.5 px-2 rounded border shrink-0 ${
                                          choice === 'YES' 
                                            ? 'bg-civic-green/10 text-civic-green border-civic-green/20' 
                                            : 'bg-civic-red/10 text-civic-red border-civic-red/20'
                                        }`}>
                                          {choice}
                                        </span>
                                      ) : (
                                        <span className="text-[8px] text-slate-500 italic shrink-0">
                                          Pending
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              <button
                                onClick={() => setIsReceiptModalOpen(true)}
                                className="bg-civic-gold hover:bg-yellow-500 text-civic-navy text-xs font-bold w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] outline-none cursor-pointer"
                              >
                                Print Choices Reminder <Printer className="w-4 h-4" />
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                  </div>
                </section>
              )}

            </div>
          )}

        </main>

        {/* FOOTER */}
        <footer className="border-t border-slate-850 mt-16 bg-[#0B192C]/30 pt-8" aria-label="CivicPulse Footer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 pb-4">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-white font-outfit">CivicPulse</h3>
              <p className="text-xs text-slate-450 mt-1">Dedicated to highly accessible, trustworthy, and premium civic technology.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-450">
              <a href="https://www.vote.org" target="_blank" rel="noopener noreferrer" className="hover:text-civic-gold hover:underline outline-none">Vote.org Lookup</a>
              <span className="text-slate-800">•</span>
              <a href="https://www.nass.org/can-I-vote" target="_blank" rel="noopener noreferrer" className="hover:text-civic-gold hover:underline outline-none">Can I Vote (NASS)</a>
              <span className="text-slate-800">•</span>
              <a href="https://www.eac.gov" target="_blank" rel="noopener noreferrer" className="hover:text-civic-gold hover:underline outline-none">US EAC Commission</a>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-855 mt-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-450">
            <div>
              © 2026 CivicPulse Initiative. Public Domain Educational Resource.
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500 fill-red-500" /> Made for citizens</span>
              <span>•</span>
              <span className="bg-slate-900 border border-slate-800 p-0.5 px-2 rounded-full font-semibold">WCAG 2.1 AA Compliant</span>
            </div>
          </div>
        </footer>

        {/* PRINT RECEIPT MODAL DIALOG (Digital overlay, hidden during printing) */}
        {isReceiptModalOpen && activeState && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-[#122238] border border-slate-800 max-w-lg w-full rounded-2xl p-6 shadow-2xl relative space-y-6">
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                aria-label="Close modal dialog"
                className="absolute right-4 top-4 text-slate-400 hover:text-white outline-none text-sm cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-2 text-center">
                <Printer className="w-8 h-8 text-civic-gold mx-auto" />
                <h3 id="modal-title" className="text-xl font-bold font-outfit text-white">Generate Voter Reminder Card</h3>
                <p className="text-xs text-slate-400">Save a physical copy or PDF printout of your practice selections to carry into the polling booth.</p>
              </div>

              {/* Sandbox preview inside modal */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 max-h-60 overflow-y-auto">
                <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-2">
                  <span className="font-semibold text-slate-400">CONTEST OFFICE</span>
                  <span className="font-semibold text-slate-400">PRACTICE CHOICE</span>
                </div>
                {activeState.sampleBallot.offices.map((office) => {
                  const selectedCandidateId = selectedCandidates[`${selectedStateCode}-${office.id}`];
                  const candidate = office.candidates.find(c => c.id === selectedCandidateId);
                  return (
                    <div key={office.id} className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 truncate max-w-[180px]">{office.title}</span>
                      <span className="font-bold text-white">
                        {candidate ? `${candidate.name} (${candidate.party.slice(0,3)})` : 'No Choice Selected'}
                      </span>
                    </div>
                  );
                })}
                {activeState.sampleBallot.measures.map((measure) => {
                  const choice = selectedMeasures[`${selectedStateCode}-${measure.id}`];
                  return (
                    <div key={measure.id} className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-300 truncate max-w-[180px]">{measure.title.split(':')[0]}</span>
                      <span className={`font-bold ${choice === 'YES' ? 'text-civic-green' : choice === 'NO' ? 'text-civic-red' : 'text-slate-500'}`}>
                        {choice || 'No Choice Selected'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-800 text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-colors outline-none"
                >
                  Close Preview
                </button>
                <button
                  onClick={triggerPrintReceipt}
                  className="flex-1 bg-civic-gold hover:bg-yellow-500 text-civic-navy text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98] outline-none"
                >
                  Print Choice Reminder <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRINT-ONLY DUAL CONTAINER (Fully display:block under media print, styled black on white) */}
      {activeState && (
        <div className="hidden printable-summary-wrapper">
          <div style={{ border: '2px solid black', padding: '24px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '16px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>🗳️ CivicPulse Voter Choice Reminder</h1>
              <p style={{ fontSize: '12px', margin: '0', color: '#555555' }}>Your Secure & Private Practice Reference Sheet</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '16px' }}>
              <div><strong>Selected State:</strong> {activeState.stateName}</div>
              <div><strong>District Preview:</strong> {activeState.sampleBallot.district}</div>
              <div><strong>Date Generated:</strong> {new Date().toLocaleDateString()}</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginTop: '10px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid black', textAlign: 'left' }}>
                  <th style={{ padding: '8px 0' }}>CONTEST OFFICE / MEASURE</th>
                  <th style={{ padding: '8px 0', textAlign: 'right' }}>YOUR PRACTICED SELECTION</th>
                </tr>
              </thead>
              <tbody>
                {activeState.sampleBallot.offices.map((office) => {
                  const selectedCandidateId = selectedCandidates[`${selectedStateCode}-${office.id}`];
                  const candidate = office.candidates.find(c => c.id === selectedCandidateId);
                  return (
                    <tr key={office.id} style={{ borderBottom: '1px solid #dddddd' }}>
                      <td style={{ padding: '10px 0' }}>
                        <strong>{office.title}</strong>
                        <div style={{ fontSize: '10px', color: '#666666' }}>Federal Office</div>
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold' }}>
                        {candidate ? `${candidate.name} (${candidate.party})` : 'No Selection Rehearsed'}
                      </td>
                    </tr>
                  );
                })}

                {activeState.sampleBallot.measures.map((measure) => {
                  const choice = selectedMeasures[`${selectedStateCode}-${measure.id}`];
                  return (
                    <tr key={measure.id} style={{ borderBottom: '1px solid #dddddd' }}>
                      <td style={{ padding: '10px 0' }}>
                        <strong>{measure.title}</strong>
                        <div style={{ fontSize: '10px', color: '#666666' }}>State Referendum / Proposal</div>
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', color: choice === 'YES' ? 'green' : choice === 'NO' ? 'red' : 'black' }}>
                        {choice ? `Practice ${choice}` : 'No Selection Rehearsed'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ marginTop: '24px', borderTop: '2px solid black', paddingTop: '16px', fontSize: '10px', color: '#666666', textAlign: 'center', lineHeight: '1.4' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', color: 'black' }}>⚠️ IMPORTANT COMPLIANCE NOTICE</p>
              <p style={{ margin: '0' }}>
                This document is <strong>not</strong> an official voting card or legal ballot. It is a private educational study aid designed to help you organize your voting booth decisions. You cannot submit this form to vote. You must vote at your designated precinct in accordance with local {activeState.stateName} identification codes.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
