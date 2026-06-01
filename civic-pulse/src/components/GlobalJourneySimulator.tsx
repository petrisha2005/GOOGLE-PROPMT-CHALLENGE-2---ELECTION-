import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Sparkles, 
  FileText, 
  UserCheck, 
  MapPin, 
  Fingerprint, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Check, 
  RotateCcw,
  Star,
  Award,
  AlertTriangle,
  Lightbulb,
  Bike
} from 'lucide-react';
import { journeySteps } from '../data/electionData';
import { useElectionGame } from '../hooks/useElectionGame';
import { useAudioGuide } from '../hooks/useAudioGuide';

// Custom inline SVG for the Mango symbol, matching Lucide stroke guidelines
const MangoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C8.5 2 5.5 4.5 4.5 8c-1 3.5 0 7.5 2.5 10 2.5 2.5 6.5 3.5 10 2.5 3.5-1 6-4 6-7.5 0-3.5-2.5-6.5-6-6.5l-1-2.5c-.5-.8-1.2-1.5-2-2z" />
    <path d="M14 6c-.5-1.5-1.5-2.5-3-3" />
    <path d="M10 8c1 0 2 1 2 2" />
  </svg>
);

const UmbrellaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2v20M12 2a10 10 0 0 0-10 10h20A10 10 0 0 0 12 2z" />
    <path d="M12 18a2 2 0 0 1-2 2" />
  </svg>
);

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles: Sparkles,
  FileText: FileText,
  UserCheck: UserCheck,
  MapPin: MapPin,
  Fingerprint: Fingerprint,
  CheckCircle2: CheckCircle2,
  Mango: MangoIcon
};

// Hindi translations for challenge console options at each milestone stage for all 4 tracks
const optionsHI: Record<string, Record<string, string[]>> = {
  'india_evm': {
    'start-18': [
      'मतदान के दिन सीधे पोलिंग बूथ पर जाएं',
      'मतदाता सूची की जांच करें और फॉर्म ६ का उपयोग करके पंजीकरण करें'
    ],
    'registration-form6': [
      'आधिकारिक मतदाता सूची में अपना नाम ऑनलाइन देखें',
      'डाक में पत्र आने का इंतजार करें'
    ],
    'voter-id-verification': [
      'एक पुस्तकालय कार्ड (लाइब्रेरी कार्ड)',
      'आपका एपिक वोटर आईडी कार्ड'
    ],
    'polling-booth-lookup': [
      'राष्ट्रीय मतदाता सेवा पोर्टल बूथ लोकेटर का उपयोग करें',
      'सड़क पर भीड़ के पीछे चलें'
    ],
    'voting-day-evm': [
      'कागज की पर्ची पर अपना नाम लिखें',
      'अपने पसंदीदा उम्मीदवार के सिंबल को देखें और उसके बगल वाला नीला बटन दबाएं'
    ],
    'results': [
      'आधिकारिक मतगणना अपडेट और निर्वाचन क्षेत्र के अंतिम परिणाम देखें',
      'वापस जाकर दोबारा वोट करें'
    ]
  },
  'usa_deadlines': {
    'usa-state-select': [
      'आधिकारिक मतदाता पोर्टल पर अपने निवास के राज्य का चयन करें',
      'संघीय सरकार द्वारा मतपत्र भेजने का इंतजार करें'
    ],
    'usa-reg-status': [
      'बिना पंजीकरण कराए सीधे चुनाव के दिन वोट देने जाएं',
      'राज्य की समय-सीमा से पहले ऑनलाइन अपने सक्रिय पंजीकरण स्थिति की जांच करें'
    ],
    'usa-request-ballot': [
      'ऑनलाइन या काउंटी क्लर्क के माध्यम से डाक मतपत्र आवेदन जमा करें',
      'किसी भी नोटबुक पेपर पर अपनी पसंद लिखें'
    ],
    'usa-secure-ballot': [
      'अपने विकल्पों को चिह्नित करें और सुरक्षा वापसी लिफाफे पर हस्ताक्षर करें',
      'इसे भरें और बिना लिफाफे के सीधे डाकघर के बक्से में डाल दें'
    ],
    'usa-postmark-deadline': [
      'डाकघर बंद होने के बाद सीधे चुनाव के दिन इसे डाक से भेजें',
      'इसे जल्दी डाक से भेजें या समय-सीमा से पहले काउंटी ड्रॉप-बॉक्स में डालें'
    ]
  },
  'estonia_ivoting': {
    'ee-digital-id': [
      'सोशल मीडिया खाता',
      'आपका आधिकारिक एस्टोनियाई डिजिटल आईडी कार्ड और यूएसबी कार्ड रीडर'
    ],
    'ee-enter-pin1': [
      'अपना आईडी कार्ड डालें और अपनी पहचान सत्यापित करने के लिए पिन १ दर्ज करें',
      'एक पोस्टर पर क्यूआर कोड स्कैन करें'
    ],
    'ee-candidate-select': [
      'डिजिटल मतपत्र लेआउट पर अपने पसंदीदा उम्मीदवार का चयन करें',
      'ईमेल में उम्मीदवार का नाम टाइप करें'
    ],
    'ee-enter-pin2': [
      'अपने वोट को डिजिटल रूप से हस्ताक्षरित और एन्क्रिप्ट करने के लिए सुरक्षित पिन २ दर्ज करें',
      'सादे पाठ (प्लेन टेक्स्ट) में अपना नाम टाइप करें'
    ],
    'ee-revoke-vote': [
      'आप ऑनलाइन दोबारा लॉग इन कर सकते हैं या वोट को बदलने/रद्द करने के लिए रविवार को व्यक्तिगत रूप से मतदान कर सकते हैं',
      'ऑनलाइन वोटों को बदला नहीं जा सकता'
    ]
  },
  'australia_ranked': {
    'au-compulsory-voter': [
      'कुछ नहीं होता',
      'यदि आपके पास कोई वैध कारण नहीं है तो आपको एक छोटा सा जुर्माना प्राप्त होगा'
    ],
    'au-democracy-sausage': [
      'एक स्थानीय प्राथमिक विद्यालय, सामुदायिक हॉल या चर्च हॉल',
      'कोई भी खुदरा शॉपिंग मॉल'
    ],
    'au-green-ballot': [
      'प्रतिनिधि सभा के लिए एक हरा मतपत्र और सीनेट के लिए एक सफेद मतपत्र',
      'सादे कागज की एक एकल शीट'
    ],
    'au-order-preferences': [
      'अपनी पहली पसंद में \'१\' लिखें, और अन्य सभी बॉक्स में क्रमिक संख्याएं \'२\', \'३\', आदि लिखें',
      'केवल एक बॉक्स में एक क्रॉस का निशान लगाएं'
    ],
    'au-drop-box': [
      'अपने मतपत्रों को मोड़ें और आधिकारिक मतपेटी में डालें, और एक पारंपरिक \'डेमोक्रेसी सॉसेज\' प्राप्त करें',
      'मतपत्रों को मेज पर छोड़ दें'
    ]
  }
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
    
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.82);
  } catch (err) {
    console.warn('Web Audio Synthesis failed:', err);
  }
};

// USA Envelope Signature Pad Component
const SignaturePad = ({ onSigned }: { onSigned: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#F59E0B'; // Gold signature ink

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <div className="border-2 border-dashed border-slate-700 bg-slate-950/80 rounded-2xl overflow-hidden relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[150px] cursor-crosshair touch-none"
        />
        {!hasSigned && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-500 text-xs font-bold font-sans">
            Draw signature with mouse/finger
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={clearCanvas}
          className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-black p-2.5 px-4 rounded-xl hover:bg-slate-850 uppercase tracking-wider font-outfit cursor-pointer transition-colors"
        >
          Clear
        </button>
        <button
          disabled={!hasSigned}
          onClick={onSigned}
          className={`flex-1 text-[10px] font-black p-2.5 px-4 rounded-xl uppercase tracking-wider font-outfit transition-all cursor-pointer ${
            hasSigned
              ? 'bg-civic-gold text-civic-navy shadow-lg shadow-civic-gold/15 hover:bg-yellow-500'
              : 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
          }`}
        >
          Sign Envelope Box
        </button>
      </div>
    </div>
  );
};

// Estonia Cryptographic PIN 2 Keypad Component
const EstoniaKeypad = ({ onSigned }: { onSigned: () => void }) => {
  const [pin, setPin] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNumClick = (num: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      playTick();
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(prev => prev.slice(0, -1));
      playTick();
    }
  };

  const handleSign = async () => {
    if (pin.length === 4) {
      setIsSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      onSigned();
    }
  };

  const playTick = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (err) {}
  };

  return (
    <div className="bg-[#0B192C] border-2 border-slate-800 p-5 rounded-3xl max-w-[280px] mx-auto space-y-4 text-center text-white shadow-2xl relative overflow-hidden">
      <div className="space-y-1">
        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest font-outfit block">SECURE PIN 2 SIGNATURE</span>
        <h5 className="text-[10px] font-bold text-slate-400 font-sans">Estonian Cryptographic Seal</h5>
      </div>

      <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex justify-center gap-3">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
              idx < pin.length
                ? 'bg-civic-gold border-civic-gold scale-110 shadow-[0_0_8px_#ea3b08]'
                : 'border-slate-800 bg-slate-900'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumClick(num)}
            className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold hover:bg-slate-850 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-900 text-xs font-bold text-slate-400 hover:bg-slate-900 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center"
        >
          ⌫
        </button>
        <button
          onClick={() => handleNumClick(0)}
          className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold hover:bg-slate-850 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center"
        >
          0
        </button>
        <button
          disabled={pin.length < 4 || isSuccess}
          onClick={handleSign}
          className={`w-12 h-12 rounded-xl text-xs font-black flex items-center justify-center active:scale-95 transition-all outline-none cursor-pointer ${
            pin.length === 4
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10 hover:bg-emerald-400'
              : 'bg-slate-950 border border-slate-900 text-slate-700 cursor-not-allowed'
          }`}
        >
          ✓
        </button>
      </div>

      <button
        disabled={pin.length < 4 || isSuccess}
        onClick={handleSign}
        className={`w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider font-outfit transition-all cursor-pointer ${
          pin.length === 4
            ? 'bg-civic-gold text-civic-navy shadow-lg shadow-civic-gold/15 hover:bg-yellow-500 animate-pulse'
            : 'bg-slate-950 border border-slate-900 text-slate-700 cursor-not-allowed'
        }`}
      >
        {isSuccess ? 'Encrypting Seal...' : 'Encrypt & Sign'}
      </button>
    </div>
  );
};

// Australia Preferential Ranking Cards Component
const AustraliaPreferential = ({ onSigned }: { onSigned: () => void }) => {
  const [ranks, setRanks] = useState<Record<string, number>>({
    koala: 0,
    kangaroo: 0,
    platypus: 0
  });

  const handleRankSelect = (partyId: string, rank: number) => {
    setRanks(prev => {
      const nextRanks = { ...prev };
      // Clear this rank from any other party
      Object.keys(nextRanks).forEach(k => {
        if (nextRanks[k] === rank) {
          nextRanks[k] = 0;
        }
      });
      nextRanks[partyId] = rank;
      return nextRanks;
    });
  };

  const isComplete = Object.values(ranks).every(r => r > 0);

  const handleSubmit = () => {
    if (isComplete) {
      onSigned();
    }
  };

  return (
    <div className="bg-[#0B192C]/80 border-2 border-slate-800 p-5 rounded-3xl space-y-5 max-w-sm mx-auto shadow-2xl">
      <div className="text-center space-y-1">
        <span className="text-[8px] font-black text-civic-gold uppercase tracking-widest font-outfit block">PREFERENTIAL VOTING BALLOT</span>
        <h5 className="text-[10px] font-bold text-slate-400">Rank all 3 candidates in order of preference (1 to 3)</h5>
      </div>

      <div className="space-y-3">
        {[
          { id: 'koala', name: 'Barnaby Koala', party: 'Green Koala Alliance', flag: '🐨', color: 'border-emerald-950 bg-emerald-950/20' },
          { id: 'kangaroo', name: 'Sarah Kangaroo', party: 'Teal Kangaroo Party', flag: '🦘', color: 'border-teal-900 bg-teal-950/20' },
          { id: 'platypus', name: 'David Platypus', party: 'Gold Platypus Union', flag: '🦆', color: 'border-amber-900 bg-amber-950/20' }
        ].map((cand) => {
          const currentRank = ranks[cand.id];
          return (
            <div
              key={cand.id}
              className={`border rounded-xl p-3 flex items-center justify-between gap-4 transition-all ${cand.color} ${
                currentRank > 0 ? 'ring-2 ring-civic-gold/20 border-civic-gold/45' : 'border-slate-850'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0">{cand.flag}</span>
                <div>
                  <h6 className="text-[10px] font-extrabold text-white font-outfit leading-tight">{cand.name}</h6>
                  <p className="text-[8px] text-slate-450">{cand.party}</p>
                </div>
              </div>

              <div className="flex gap-1.5 shrink-0">
                {[1, 2, 3].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRankSelect(cand.id, r)}
                    className={`w-7 h-7 rounded-full font-black text-[10px] transition-all outline-none cursor-pointer flex items-center justify-center border ${
                      currentRank === r
                        ? 'bg-civic-gold text-civic-navy shadow-md shadow-civic-gold/15 border-civic-gold'
                        : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        disabled={!isComplete}
        onClick={handleSubmit}
        className={`w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider font-outfit transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
          isComplete
            ? 'bg-civic-gold text-civic-navy shadow-lg shadow-civic-gold/15 hover:bg-yellow-500'
            : 'bg-slate-950 border border-slate-900 text-slate-700 cursor-not-allowed'
        }`}
      >
        📬 Drop in Ballot Box
      </button>
    </div>
  );
};

export default function GlobalJourneySimulator({ initialTrackId }: { initialTrackId?: string } = {}) {
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');
  const [activeTrackId, setActiveTrackId] = useState<string>(initialTrackId || 'india_evm');
  const [activePlayingId, setActivePlayingId] = useState<string>('');
  const [evmFlashingCandidateId, setEvmFlashingCandidateId] = useState<string>('');

  const { speak, stop, isSpeaking } = useAudioGuide();

  useEffect(() => {
    if (initialTrackId) {
      setActiveTrackId(initialTrackId);
    }
  }, [initialTrackId]);

  const {
    currentStepIndex,
    selectedOptionIndex,
    hasAnswered,
    isCorrect,
    score,
    handleOptionSelect,
    submitAnswer,
    goToNextStep,
    resetGame,
    resetCurrentStepAnswer,
    isComplete
  } = useElectionGame({ trackId: activeTrackId });

  const track = journeySteps[activeTrackId];
  const stages = track?.stages || [];
  const currentStage = stages[currentStepIndex];

  // Sync state if audio stops naturally
  useEffect(() => {
    if (!isSpeaking) {
      setActivePlayingId('');
    }
  }, [isSpeaking]);

  // Handle stage audio guide playback
  const playStageAudio = useCallback((stageId: string, text: string) => {
    if (activePlayingId === stageId) {
      stop();
      setActivePlayingId('');
    } else {
      setActivePlayingId(stageId);
      const locale = activeLang === 'en' ? 'en-US' : 'hi-IN';
      speak(text, locale);
    }
  }, [activePlayingId, activeLang, speak, stop]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);

  // Special EVM Blue Button Click interaction at Step 5 for India track
  const handleEVMVote = async (candId: string) => {
    if (hasAnswered) return;
    
    setEvmFlashingCandidateId(candId);
    playEVMBeep();

    await new Promise(resolve => setTimeout(resolve, 800));
    setEvmFlashingCandidateId('');

    handleOptionSelect(1);
    submitAnswer();
  };

  const handleSandboxSuccess = () => {
    handleOptionSelect(0);
    submitAnswer();
  };

  const getOptionText = (idx: number, stage: any) => {
    if (activeLang === 'hi') {
      const trackHI = optionsHI[activeTrackId];
      const translated = trackHI ? trackHI[stage.id] : null;
      if (translated && translated[idx]) {
        return translated[idx];
      }
    }
    return stage.options[idx];
  };

  const getEncouragingMessage = () => {
    if (activeLang === 'en') {
      return {
        title: 'Excellent Choice!',
        desc: 'You selected the correct democratic procedure. Press continue to proceed on your journey.'
      };
    } else {
      return {
        title: 'अति उत्कृष्ट विकल्प!',
        desc: 'आपने बिल्कुल सही चुनावी प्रक्रिया का चयन किया है। सफर में आगे बढ़ने के लिए आगे बढ़ें दबाएं।'
      };
    }
  };

  const getRetryMessage = () => {
    if (activeLang === 'en') {
      return {
        title: 'Oops, That Is Not Correct!',
        desc: 'Recall the correct security steps. Press retry to select a different option.'
      };
    } else {
      return {
        title: 'ओह, यह सही नहीं है!',
        desc: 'कृपया सही सुरक्षा कदमों को याद करें। पुनः प्रयास करें पर क्लिक करें और दूसरा विकल्प चुनें।'
      };
    }
  };

  const renderSandboxOverride = () => {
    if (!currentStage) return null;

    // Trigger EVM for India EVM Step 5 (Index 4)
    if (activeTrackId === 'india_evm' && currentStage.id === 'voting-day-evm') {
      return (
        <div className="lg:col-span-6 animate-scaleIn flex flex-col justify-center">
          <div className="bg-slate-300 border-4 border-slate-400 p-4 sm:p-5 rounded-3xl shadow-2xl relative overflow-hidden text-slate-850 space-y-4 max-w-sm mx-auto w-full">
            <div className="flex items-center justify-between border-b-2 border-slate-400 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 shadow-md" />
                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest font-outfit">EVM READY</span>
              </div>
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-outfit">ECI BU-M2</span>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'mango', num: 1, name: 'Rajesh Kumar', icon: MangoIcon, color: 'text-yellow-600' },
                { id: 'umbrella', num: 2, name: 'Priya Sharma', icon: UmbrellaIcon, color: 'text-pink-600' },
                { id: 'bicycle', num: 3, name: 'Amit Patel', icon: Bike, color: 'text-teal-600' },
                { id: 'sun', num: 4, name: 'Dr. Sunita Rao', icon: Star, color: 'text-amber-600' }
              ].map((cand) => {
                const CandIcon = cand.icon;
                const isVoted = evmFlashingCandidateId === cand.id || (hasAnswered && isCorrect && selectedOptionIndex === 1);
                
                return (
                  <div 
                    key={cand.id}
                    onClick={() => handleEVMVote(cand.id)}
                    className="bg-white border-2 border-slate-400 rounded-xl p-2.5 flex items-center justify-between shadow-sm cursor-pointer select-none hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-black font-outfit text-slate-500 bg-slate-100 border border-slate-200 w-5.5 h-5.5 flex items-center justify-center rounded-lg">{cand.num}</span>
                      <span className="text-[10px] font-bold text-slate-900 font-outfit truncate max-w-[100px]">{cand.name}</span>
                    </div>

                    <div className={`p-1 bg-slate-50 border border-slate-200 rounded-lg shrink-0 ${cand.color} hover:scale-105 transition-transform`}>
                      <CandIcon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full border border-slate-350 transition-all ${
                        isVoted 
                          ? 'bg-red-500 animate-pulse ring-4 ring-red-500/40 border-red-500 shadow-md shadow-red-500/30' 
                          : 'bg-slate-100'
                      }`} />

                      <button
                        disabled={hasAnswered}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEVMVote(cand.id);
                        }}
                        className="w-9 h-9 bg-blue-600 border-b-4 border-blue-800 rounded-lg shadow-md hover:bg-blue-500 active:scale-95 transition-all outline-none flex items-center justify-center cursor-pointer disabled:bg-slate-450 disabled:border-slate-500 disabled:cursor-not-allowed"
                        aria-label={`Cast practice vote on candidate ${cand.num}`}
                      >
                        <span className="w-3.5 h-3.5 bg-blue-400 rounded-full opacity-40 shadow-inner" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Trigger Signature Pad for USA Signature Envelope Step 4 (Index 3)
    if (activeTrackId === 'usa_deadlines' && currentStage.id === 'usa-secure-ballot') {
      return (
        <div className="lg:col-span-6 animate-scaleIn flex flex-col justify-center">
          <div className="bg-[#1E293B] border-4 border-slate-700 p-5 rounded-3xl shadow-2xl text-slate-100 space-y-4 max-w-sm mx-auto w-full relative">
            <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
              <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest font-outfit">OFFICIAL RETURN ENVELOPE</span>
              <span className="text-[7px] text-slate-450 uppercase font-outfit">VOTE BY MAIL</span>
            </div>
            
            <p className="text-[10px] text-slate-300 leading-relaxed font-sans text-center">
              Please sign the oath box below to validate your return ballot.
            </p>

            <SignaturePad onSigned={handleSandboxSuccess} />
          </div>
        </div>
      );
    }

    // Trigger Keypad for Estonia PIN 2 Signature Step 4 (Index 3)
    if (activeTrackId === 'estonia_ivoting' && currentStage.id === 'ee-enter-pin2') {
      return (
        <div className="lg:col-span-6 animate-scaleIn flex flex-col justify-center">
          <EstoniaKeypad onSigned={handleSandboxSuccess} />
        </div>
      );
    }

    // Trigger Preferential Cards for Australia Preferential House Step 4 (Index 3)
    if (activeTrackId === 'australia_ranked' && currentStage.id === 'au-order-preferences') {
      return (
        <div className="lg:col-span-6 animate-scaleIn flex flex-col justify-center">
          <AustraliaPreferential onSigned={handleSandboxSuccess} />
        </div>
      );
    }

    return null;
  };

  const isOverrideStep = currentStage && (
    (activeTrackId === 'india_evm' && currentStage.id === 'voting-day-evm') ||
    (activeTrackId === 'usa_deadlines' && currentStage.id === 'usa-secure-ballot') ||
    (activeTrackId === 'estonia_ivoting' && currentStage.id === 'ee-enter-pin2') ||
    (activeTrackId === 'australia_ranked' && currentStage.id === 'au-order-preferences')
  );

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-855 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Visual glowing overlay decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-civic-gold/5 to-transparent pointer-events-none rounded-bl-full animate-pulse" />
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-civic-gold/10 text-civic-gold border border-civic-gold/25 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-outfit flex items-center gap-1 animate-pulse">
              <Star className="w-3 h-3 text-civic-gold fill-civic-gold" /> Global Challenge Mode
            </span>
            <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-1 rounded-full font-bold">
              Score: {score} / {stages.length}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-outfit text-white leading-tight">
            {activeLang === 'en' ? 'Global Journey Simulator' : 'वैश्विक चुनावी सिम्युलेटर'}
          </h3>
          <p className="text-xs text-slate-400">
            {activeLang === 'en'
              ? 'Select a country track, solve milestone challenges, and experience diverse democratic systems!'
              : 'किसी देश के ट्रैक का चयन करें, मील का पत्थर चुनौतियों को हल करें और विविध लोकतांत्रिक प्रणालियों का अनुभव करें!'}
          </p>
        </div>

        {/* Bilingual Language Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-850 shadow-inner shrink-0">
          <button
            onClick={() => {
              setActiveLang('en');
              stop();
              setActivePlayingId('');
            }}
            className={`p-1.5 px-4 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider outline-none cursor-pointer ${
              activeLang === 'en'
                ? 'bg-civic-gold text-civic-navy shadow-md shadow-civic-gold/15'
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            🇬🇧 EN
          </button>
          <button
            onClick={() => {
              setActiveLang('hi');
              stop();
              setActivePlayingId('');
            }}
            className={`p-1.5 px-4 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider outline-none cursor-pointer ${
              activeLang === 'hi'
                ? 'bg-civic-gold text-civic-navy shadow-md shadow-civic-gold/15'
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            🇮🇳 हिंदी
          </button>
        </div>
      </div>

      {/* COUNTRY SELECTOR BAR */}
      <div className="bg-[#0B192C]/75 border-2 border-slate-855 rounded-2xl p-2 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { id: 'india_evm', flag: '🇮🇳', nameEN: 'India EVM', nameHI: 'भारत ईवीएम' },
          { id: 'usa_deadlines', flag: '🇺🇸', nameEN: 'USA Mail-In', nameHI: 'अमेरिका मेल-इन' },
          { id: 'estonia_ivoting', flag: '🇪🇪', nameEN: 'Estonia i-Vote', nameHI: 'एस्टोनिया आई-वोट' },
          { id: 'australia_ranked', flag: '🇦🇺', nameEN: 'Australia Preferential', nameHI: 'ऑस्ट्रेलिया वरीयता' }
        ].map((tr) => {
          const isSelected = activeTrackId === tr.id;
          return (
            <button
              key={tr.id}
              onClick={() => {
                setActiveTrackId(tr.id);
                stop();
                setActivePlayingId('');
              }}
              className={`p-2.5 rounded-xl text-[10px] font-black tracking-wider transition-all outline-none cursor-pointer flex items-center justify-center gap-1.5 font-outfit uppercase border ${
                isSelected
                  ? 'bg-civic-blue border-civic-blue text-white shadow-lg shadow-civic-blue/20 ring-2 ring-civic-blue/15'
                  : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-850'
              }`}
            >
              <span className="text-sm shrink-0">{tr.flag}</span>
              <span className="truncate">{activeLang === 'en' ? tr.nameEN : tr.nameHI}</span>
            </button>
          );
        })}
      </div>

      {/* CONFETTI / SCORECARD COMPLETION OVERLAY */}
      {isComplete ? (
        <div className="bg-[#0B192C]/90 backdrop-blur-md rounded-2xl border border-slate-850 p-8 text-center space-y-6 animate-scaleIn flex flex-col items-center justify-center min-h-[420px] relative z-20">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-4 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/15 animate-bounce mb-2">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h4 className="text-3xl font-extrabold font-outfit text-white">
              {activeLang === 'en' ? 'Journey Successfully Completed!' : 'चुनावी सफर सफलतापूर्वक पूर्ण!'}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {activeLang === 'en'
                ? `Outstanding! You successfully navigated all ${stages.length} phases of the ${track?.trackNameEN || ''} track. Your practice score is ${score} out of ${stages.length} correct on the first attempt!`
                : `अद्भुत! आपने ${track?.trackNameHI || ''} ट्रैक के सभी ${stages.length} चरणों को सफलतापूर्वक पूरा कर लिया है। आपका स्कोर ${stages.length} में से ${score} सही उत्तर है!`}
            </p>
            <div className="inline-block bg-slate-900 border border-slate-800 rounded-2xl p-4 px-8 mt-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-outfit mb-1">FINAL SCORECARD</span>
              <span className="text-2xl font-black text-civic-gold font-outfit">{score} / {stages.length} CORRECT</span>
            </div>
          </div>
          <button
            onClick={() => {
              resetGame();
              stop();
            }}
            className="bg-civic-gold hover:bg-yellow-500 text-civic-navy font-black text-xs p-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-civic-gold/15 outline-none font-outfit uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4 stroke-[3]" /> {activeLang === 'en' ? 'Restart Rehearsal' : 'फिर से सफर शुरू करें'}
          </button>
        </div>
      ) : (
        <>
          {/* TOP SECTION: PROGRESS PIPELINE PATHWAY */}
          <div 
            className="relative py-6 px-4 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-4 select-none min-h-[380px] md:min-h-0 relative z-10"
            role="region"
            aria-label="Progress pipeline track"
          >
            {/* Background Line Track (Desktop) */}
            <div className="hidden md:block absolute top-1/2 inset-x-12 h-2 bg-slate-900 border border-slate-855 rounded-full -translate-y-1/2 -z-15 shadow-inner">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_#10b981]"
                style={{ width: `${(currentStepIndex / (stages.length > 1 ? stages.length - 1 : 1)) * 100}%` }}
              />
            </div>

            {/* Background Line Track (Mobile) */}
            <div className="md:hidden absolute left-1/2 inset-y-10 w-2 bg-slate-900 border border-slate-855 rounded-full -translate-x-1/2 -z-15 shadow-inner">
              <div 
                className="bg-emerald-500 w-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_#10b981]"
                style={{ height: `${(currentStepIndex / (stages.length > 1 ? stages.length - 1 : 1)) * 100}%` }}
              />
            </div>

            {stages.map((stage, idx) => {
              const StageIcon = IconMap[stage.iconName] || Sparkles;
              const isActive = currentStepIndex === idx;
              const isCompleted = idx < currentStepIndex;
              const isPlaying = activePlayingId === stage.id;

              return (
                <div 
                  key={stage.id}
                  onClick={() => playStageAudio(stage.id, activeLang === 'en' ? stage.audioEN : stage.audioHI)}
                  className="flex flex-col items-center text-center relative group select-none shrink-0 md:w-1/6 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Stage ${stage.stageNum}: ${activeLang === 'en' ? stage.titleEN : stage.titleHI}`}
                >
                  {/* NODE CIRCULAR CAP */}
                  <div 
                    className={`w-14 h-14 rounded-full border-4 flex items-center justify-center relative transition-all duration-350 cursor-pointer shadow-lg outline-none select-none group-hover:scale-105 active:scale-95 ${
                      isActive 
                        ? 'bg-slate-950 border-civic-gold text-civic-gold scale-110 ring-4 ring-civic-gold/15 shadow-[0_0_15px_rgba(234,179,8,0.25)]'
                        : isCompleted
                        ? 'bg-slate-900 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {(isPlaying || isActive) && (
                      <span className="w-full h-full rounded-full border-2 border-civic-gold absolute inset-0 animate-ping opacity-60" />
                    )}

                    <StageIcon className="w-5 h-5 stroke-[2.5]" />

                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center border border-slate-950 shadow animate-scaleIn">
                        <Check className="w-3 h-3 stroke-[3.5]" />
                      </div>
                    )}

                    <div className="absolute -bottom-1.5 bg-slate-900 border border-slate-800 text-slate-400 text-[8px] font-black px-1.5 rounded-full uppercase tracking-wider font-outfit shadow">
                      STEP-{stage.stageNum}
                    </div>
                  </div>

                  <div className="mt-3 space-y-0.5 max-w-[120px] md:max-w-none px-1">
                    <h4 className={`text-[10px] font-black font-outfit transition-colors leading-tight uppercase tracking-wider ${
                      isActive 
                        ? 'text-civic-gold' 
                        : isCompleted 
                        ? 'text-emerald-400' 
                        : 'text-slate-400'
                    }`}>
                      {activeLang === 'en' ? stage.titleEN : stage.titleHI}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DYNAMIC CHALLENGE AREA WITH STEP 5 INTERACTIVE SPLIT OVERRIDES */}
          {currentStage && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
              
              {/* CHALLENGE CONSOLE */}
              <div className={`space-y-6 ${isOverrideStep ? 'lg:col-span-6' : 'lg:col-span-12'} animate-scaleIn`}>
                
                {/* INTERACTIVE CHALLENGE CONSOLE CONTAINER */}
                <div className="bg-[#0B192C]/40 border-2 border-slate-855 p-6 rounded-3xl relative overflow-hidden shadow-inner space-y-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-civic-gold uppercase tracking-wider font-outfit block">
                        {activeLang === 'en' ? `Active Challenge Milestone ${currentStage.stageNum}` : `सक्रिय चुनौती मील का पत्थर ${currentStage.stageNum}`}
                      </span>
                      <h4 className="text-base sm:text-lg font-extrabold text-white font-outfit">
                        {activeLang === 'en' ? currentStage.titleEN : currentStage.titleHI}
                      </h4>
                    </div>

                    {/* Speaker Narration Guide Button */}
                    <button
                      onClick={() => playStageAudio(currentStage.id, activeLang === 'en' ? currentStage.audioNarration : currentStage.audioHI)}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 outline-none shrink-0 ${
                        activePlayingId === currentStage.id
                          ? 'bg-civic-gold border-civic-gold text-civic-navy shadow-lg shadow-civic-gold/20 animate-pulse'
                          : 'bg-slate-950 border-slate-800 text-civic-gold hover:border-civic-gold'
                      }`}
                      aria-label="Re-play audio prompt guide"
                    >
                      {activePlayingId === currentStage.id ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Interactive Challenge Prompt Console */}
                  <div className="p-5 bg-slate-950/70 border border-slate-855 rounded-2xl flex items-start gap-3.5 shadow-inner">
                    <Lightbulb className="w-6 h-6 text-civic-gold shrink-0 mt-0.5 animate-bounce" />
                    <p className="text-sm text-slate-100 font-bold leading-relaxed font-sans">
                      {activeLang === 'en' ? currentStage.promptEN : currentStage.promptHI}
                    </p>
                  </div>

                  {/* MULTI-CHOICE CARD STYLE BUTTONS */}
                  {!isOverrideStep && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentStage.options.map((_, idx) => {
                        const isSelected = selectedOptionIndex === idx;
                        const optionText = getOptionText(idx, currentStage);
                        
                        let cardClasses = 'border-slate-800 bg-slate-950 text-slate-350 hover:border-slate-700 hover:text-slate-200';
                        if (isSelected) {
                          cardClasses = 'border-civic-gold bg-slate-900 text-white ring-2 ring-civic-gold/20';
                        }

                        if (hasAnswered) {
                          const isCorrectOption = idx === currentStage.correctIndex;
                          if (isCorrectOption) {
                            cardClasses = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-2 ring-emerald-500/25';
                          } else if (isSelected) {
                            cardClasses = 'border-red-500 bg-red-500/10 text-red-400 ring-2 ring-red-500/25';
                          } else {
                            cardClasses = 'border-slate-855 bg-slate-955/50 text-slate-600 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={hasAnswered}
                            onClick={() => {
                              handleOptionSelect(idx);
                              speak(optionText, activeLang === 'en' ? 'en-US' : 'hi-IN');
                            }}
                            className={`p-5 rounded-2xl border text-left transition-all outline-none cursor-pointer flex flex-col justify-between min-h-[110px] relative ${cardClasses}`}
                          >
                            <span className={`text-[9px] font-black uppercase tracking-widest font-outfit px-2 py-0.5 rounded-full border mb-3 w-fit ${
                              isSelected ? 'bg-civic-gold/10 border-civic-gold/25 text-civic-gold' : 'bg-slate-900 border-slate-855 text-slate-500'
                            }`}>
                              {activeLang === 'en' ? `Option ${idx + 1}` : `विकल्प ${idx + 1}`}
                            </span>
                            <span className="text-sm font-bold leading-tight font-outfit">{optionText}</span>
                            
                            {hasAnswered && idx === currentStage.correctIndex && (
                              <Check className="w-5 h-5 text-emerald-400 absolute top-4 right-4 animate-scaleIn stroke-[3]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  {!isOverrideStep && !hasAnswered && (
                    <button
                      disabled={selectedOptionIndex === null}
                      onClick={submitAnswer}
                      className={`w-full h-14 rounded-2xl font-black font-outfit text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 ${
                        selectedOptionIndex !== null
                          ? 'bg-civic-gold text-civic-navy hover:bg-yellow-500 shadow-lg shadow-civic-gold/15'
                          : 'bg-slate-900 border border-slate-855 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {activeLang === 'en' ? 'Submit Answer' : 'उत्तर जमा करें'} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  
                  {isOverrideStep && (
                    <div className="bg-slate-950/40 p-4 border border-slate-855 rounded-2xl text-[10px] text-slate-400 leading-relaxed font-sans">
                      💡 {activeLang === 'en'
                        ? 'This stage features a dynamic interactive mockup sandbox on the right! Complete the sandbox action to cast your vote and proceed.'
                        : 'इस चरण में दाईं ओर एक गतिशील इंटरैक्टिव सैंडबॉक्स है! अपना वोट डालने और आगे बढ़ने के लिए सैंडबॉक्स क्रिया को पूरा करें।'}
                    </div>
                  )}
                </div>
              </div>

              {/* DYNAMIC INTERACTIVE SPLIT SANDBOX OVERRIDES */}
              {renderSandboxOverride()}
            </div>
          )}

          {/* FOOTER AREA */}
          {hasAnswered && currentStage && (
            <div className="space-y-4 animate-fadeIn relative z-10">
              
              {/* DYNAMIC RESULTS FEEDBACK BANNER */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 shadow-md ${
                isCorrect 
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' 
                  : 'border-orange-500/30 bg-orange-500/5 text-orange-400'
              }`}>
                <div className="flex items-center sm:items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 stroke-[2.5]" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 shrink-0 text-orange-400 stroke-[2.5]" />
                  )}
                  <div className="space-y-1 text-center sm:text-left">
                    <h5 className="text-sm font-black font-outfit">
                      {isCorrect ? getEncouragingMessage().title : getRetryMessage().title}
                    </h5>
                    <p className="text-xs text-slate-455 leading-relaxed font-outfit max-w-xl">
                      {isCorrect ? getEncouragingMessage().desc : getRetryMessage().desc}
                    </p>
                  </div>
                </div>

                {!isCorrect && (
                  <button
                    onClick={resetCurrentStepAnswer}
                    className="bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs p-3 px-6 rounded-xl flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-md shadow-orange-500/10 outline-none uppercase tracking-wider font-outfit shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[3]" /> Retry Challenge
                  </button>
                )}
              </div>

              {/* CONTINUE BUTTON */}
              {isCorrect && (
                <button
                  onClick={goToNextStep}
                  className="w-full h-16 bg-gradient-to-tr from-[#1E3E62] to-civic-blue hover:from-slate-750 hover:to-slate-650 text-white font-black text-xs px-6 rounded-2xl border border-slate-700 flex items-center justify-between transition-all duration-300 outline-none cursor-pointer hover:shadow-xl hover:shadow-civic-blue/5 active:scale-95 uppercase tracking-wider font-outfit"
                >
                  <div className="text-left">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-outfit mb-0.5">Democratic Milestone</span>
                    <span className="font-outfit uppercase tracking-wider">
                      {activeLang === 'en' ? 'Continue Journey' : 'सफर जारी रखें'}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 shrink-0 hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
