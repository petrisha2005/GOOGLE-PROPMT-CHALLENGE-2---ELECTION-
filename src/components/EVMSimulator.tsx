import { useState, useEffect, useCallback } from 'react';
import { Sun, Umbrella, Bike, Trees, Star, AlertCircle, Check } from 'lucide-react';
import { StateElectionData, BallotCandidate } from '../data/electionData';
import { useAudioGuide } from '../hooks/useAudioGuide';

// Custom inline SVG for the Mango symbol, matching Lucide stroke guidelines
const MangoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C8.5 2 5.5 4.5 4.5 8c-1 3.5 0 7.5 2.5 10 2.5 2.5 6.5 3.5 10 2.5 3.5-1 6-4 6-7.5 0-3.5-2.5-6.5-6-6.5l-1-2.5c-.5-.8-1.2-1.5-2-2z" />
    <path d="M14 6c-.5-1.5-1.5-2.5-3-3" />
    <path d="M10 8c1 0 2 1 2 2" />
  </svg>
);

const SymbolIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sun: Sun,
  Umbrella: Umbrella,
  Bicycle: Bike,
  Mango: MangoIcon,
  Tree: Trees,
  Star: Star
};

// Web Audio API Synthesizer to play authentic 1000Hz ECI EVM cast-vote beep
const playEVMBeep = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // High-pitched 1000Hz tone
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    
    // Quick gain setting to prevent clipping
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    // EVM Beep fades out exponentially after exactly 800ms
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.82);
  } catch (err) {
    console.warn('Web Audio Synthesis failed:', err);
  }
};

interface EVMSimulatorProps {
  stateData: StateElectionData;
  selectedCandidateId: string;
  onSelectCandidate: (candidateId: string) => void;
}

export default function EVMSimulator({ stateData, selectedCandidateId, onSelectCandidate }: EVMSimulatorProps) {
  const { speak } = useAudioGuide();
  const [flashingRowId, setFlashingRowId] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');

  // Auto-clear glowing LED after 3 seconds
  useEffect(() => {
    let timer: any;
    if (flashingRowId) {
      timer = setTimeout(() => {
        setFlashingRowId('');
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [flashingRowId]);

  // Localized details helper for Election Commission of India candidates
  const getHindiDetails = (candidateId: string) => {
    switch (candidateId) {
      case 'in-parl-mango':
        return { name: 'राजेश कुमार', symbol: 'आम' };
      case 'in-parl-umbrella':
        return { name: 'प्रिया शर्मा', symbol: 'छतरी' };
      case 'in-parl-bicycle':
        return { name: 'अमित पटेल', symbol: 'साइकिल' };
      case 'in-parl-sun':
        return { name: 'डॉ सुनीता राव', symbol: 'सूरज' };
      default:
        return { name: 'उम्मीदवार', symbol: 'चिन्ह' };
    }
  };

  // Handle tactile voting action
  const handleVoteCast = useCallback((candidate: BallotCandidate) => {
    onSelectCandidate(candidate.id);
    setFlashingRowId(candidate.id);
    
    // 1. Play authentic ECI EVM beep
    playEVMBeep();
    
    // 2. Dynamic localized voice confirmation
    const locale = activeLang === 'en' ? 'en-US' : 'hi-IN';
    if (activeLang === 'en') {
      speak(`Vote successfully cast for ${candidate.name}, represented by the ${candidate.symbolName} symbol. Thank you for practicing on the Electronic Voting Machine!`, locale);
    } else {
      const details = getHindiDetails(candidate.id);
      speak(`${details.name} के लिए आपका अभ्यास मत सफलतापूर्वक दर्ज कर लिया गया है, जिनका चुनाव चिन्ह ${details.symbol} है। इलेक्ट्रॉनिक वोटिंग मशीन पर अभ्यास करने के लिए धन्यवाद!`, locale);
    }
  }, [onSelectCandidate, speak, activeLang]);

  const handleRowClick = useCallback((candidate: BallotCandidate) => {
    const locale = activeLang === 'en' ? 'en-US' : 'hi-IN';
    if (activeLang === 'en') {
      speak(`You are looking at row ${candidate.name}, who is representing the ${candidate.symbolName} symbol. Press the blue button next to it to cast your practice vote.`, locale);
    } else {
      const details = getHindiDetails(candidate.id);
      speak(`आप ${details.name} की पंक्ति देख रहे हैं, जो ${details.symbol} चुनाव चिन्ह का प्रतिनिधित्व कर रहे हैं। अपना अभ्यास मत दर्ज करने के लिए उनके बगल में दिया गया नीला बटन दबाएं।`, locale);
    }
  }, [speak, activeLang]);

  // Extract the MP Lok Sabha office
  const mpOffice = stateData.sampleBallot.offices.find(o => o.id === 'parliament');
  
  if (!mpOffice) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center text-slate-400">
        <AlertCircle className="w-8 h-8 text-civic-gold mx-auto mb-2" />
        <p>Lok Sabha constituency preview data is not loaded for this region.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* EVM Accessibility Language Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/35 border border-slate-850 p-4 rounded-2xl gap-3 shadow-lg max-w-xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-ping shrink-0" />
          <div className="text-[11px]">
            <span className="font-extrabold text-white font-outfit uppercase tracking-wider block sm:inline">EVM Audio Language</span>: 
            <span className="text-slate-400 font-medium ml-1">Practice voting using spoken English or native Hindi announcements.</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 shrink-0 shadow-inner">
          <button
            onClick={() => setActiveLang('en')}
            className={`p-1.5 px-3 rounded-lg text-[9px] font-black transition-all uppercase tracking-wider outline-none cursor-pointer ${
              activeLang === 'en'
                ? 'bg-civic-gold text-civic-navy shadow-md shadow-civic-gold/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇬🇧 EN (English)
          </button>
          <button
            onClick={() => setActiveLang('hi')}
            className={`p-1.5 px-3 rounded-lg text-[9px] font-black transition-all uppercase tracking-wider outline-none cursor-pointer ${
              activeLang === 'hi'
                ? 'bg-civic-gold text-civic-navy shadow-md shadow-civic-gold/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇮🇳 हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* EVM OUTER BOARD */}
      <div 
        className="bg-[#DDE2E6] border-8 border-[#B5C0C9] rounded-3xl p-4 md:p-6 shadow-2xl shadow-slate-950/80 max-w-xl mx-auto select-none"
        role="region"
        aria-label="Electronic Voting Machine Balloting Unit"
      >
        {/* EVM PANEL TOP HEADER */}
        <div className="border-b-4 border-[#B5C0C9] pb-4 mb-4 text-center space-y-1">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-outfit">
            Election Commission of India
          </div>
          <div className="text-sm font-extrabold text-slate-800 font-outfit flex items-center justify-center gap-1.5 bg-[#CBD5E1] p-1 px-4 rounded-lg shadow-inner w-fit mx-auto border border-slate-350">
            <span className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse" />
            BALLOTING UNIT (EVM-12)
          </div>
        </div>

        {/* BALLOT SHEET SLOTS PANEL */}
        <div className="bg-slate-300 p-2.5 rounded-2xl shadow-inner border-2 border-[#B5C0C9]">
          <div className="space-y-1">
            {mpOffice.candidates.map((candidate, idx) => {
              const serialNo = idx + 1;
              const SymbolIcon = SymbolIconMap[candidate.symbolName] || Star;
              const isFlashing = flashingRowId === candidate.id;
              const isVoted = selectedCandidateId === candidate.id;

              return (
                <div 
                  key={candidate.id}
                  onClick={() => handleRowClick(candidate)}
                  className={`flex items-stretch border-2 border-slate-400 bg-white rounded-lg shadow-sm hover:border-slate-600 transition-colors cursor-pointer group relative overflow-hidden ${
                    isVoted ? 'ring-2 ring-blue-500' : ''
                  }`}
                  role="row"
                  aria-label={`Row ${serialNo}: ${candidate.name}, Symbol ${candidate.symbolName}`}
                >
                  {/* Column 1: Serial Number */}
                  <div className="flex items-center justify-center font-black text-slate-800 font-outfit text-base md:text-lg border-r-2 border-slate-400 bg-[#E2E8F0] p-2.5 w-12 shrink-0 select-none">
                    {serialNo}
                  </div>

                  {/* Column 2: Candidate Name & Platform Description */}
                  <div className="p-2.5 flex-1 flex flex-col justify-center min-w-0 select-none">
                    <div className="font-extrabold text-slate-900 font-outfit text-xs md:text-sm tracking-wide uppercase truncate">
                      {candidate.name}
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase truncate mt-0.5">
                      {candidate.party} • Independent platform
                    </div>
                  </div>

                  {/* Column 3: Distinct Party Symbol Box */}
                  <div className="w-16 md:w-20 border-l-2 border-r-2 border-slate-400 flex items-center justify-center p-2 bg-slate-50 shrink-0 select-none">
                    <div className="text-slate-800 hover:scale-105 transition-transform duration-300">
                      <SymbolIcon className="w-9 h-9 md:w-10 md:h-10 stroke-2" />
                    </div>
                  </div>

                  {/* Column 4: Red LED Indicator & Blue Tactile Button */}
                  <div className="w-20 md:w-24 bg-[#E2E8F0] flex items-center justify-around px-2 shrink-0 select-none">
                    {/* Red LED Bulb */}
                    <div className="flex flex-col items-center">
                      <div 
                        className={`w-3.5 h-3.5 md:w-4.5 md:h-4.5 rounded-full border-2 border-slate-550 transition-all duration-300 ${
                          isFlashing
                            ? 'bg-red-500 border-red-300 shadow-[0_0_15px_#ef4444] animate-ping'
                            : isVoted
                            ? 'bg-red-600 border-red-400 shadow-[0_0_10px_#ef4444]'
                            : 'bg-red-950 border-slate-800'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-[6px] font-bold text-slate-500 uppercase mt-1">Ready</span>
                    </div>

                    {/* Prominent Blue EVM Voting Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering row-read aloud concurrently
                        handleVoteCast(candidate);
                      }}
                      aria-label={`Press blue button to cast vote for ${candidate.name}`}
                      className="w-8 h-8 md:w-10 md:h-10 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] border-2 border-[#1D4ED8] rounded-xl shadow-[inset_0_-3px_0_#1E40AF,0_3px_6px_rgba(0,0,0,0.16)] flex items-center justify-center shrink-0 cursor-pointer active:translate-y-0.5 active:shadow-inner transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 rounded-full bg-[#3B82F6]/60 border border-blue-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EVM BOTTOM BRANDING */}
        <div className="mt-4 flex items-center justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest font-outfit border-t border-[#B5C0C9] pt-3">
          <span>Bharat Electronics Ltd.</span>
          <span>ECI Standard EVM-12</span>
        </div>
      </div>

      {/* DYNAMIC CONFIRMATION POPUP CUE */}
      {flashingRowId && (
        <div className="bg-civic-green/10 border-2 border-civic-green/20 p-4 rounded-2xl flex items-center gap-3 justify-center animate-fadeIn max-w-xl mx-auto shadow-lg shadow-civic-green/5">
          <Check className="w-6 h-6 text-civic-green animate-bounce" />
          <div className="text-xs text-slate-200">
            <span className="font-extrabold text-civic-green uppercase tracking-wide font-outfit">Cast Successful</span>: 
            Practice vote registered successfully on ECI Ballot Unit!
          </div>
        </div>
      )}
    </div>
  );
}
