import { useState, useEffect, useCallback } from 'react';
import { 
  UserCheck, 
  MapPin, 
  Paintbrush, 
  Fingerprint,
  Check, 
  VolumeX, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useAudioGuide } from '../hooks/useAudioGuide';

interface FlowchartStep {
  id: string;
  phaseNum: number;
  titleEN: string;
  titleHI: string;
  subtitleEN: string;
  subtitleHI: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const stepsData: FlowchartStep[] = [
  {
    id: 'id-check',
    phaseNum: 1,
    titleEN: 'Check ID & Voter List',
    titleHI: 'पहचान व मतदाता सूची जांच',
    subtitleEN: 'Officer verifies Voter ID / Aadhaar',
    subtitleHI: 'अधिकारी आपकी वोटर आईडी या आधार जांचेंगे',
    icon: UserCheck,
    color: 'amber'
  },
  {
    id: 'enter-station',
    phaseNum: 2,
    titleEN: 'Enter Polling Station',
    titleHI: 'मतदान कक्ष में प्रवेश',
    subtitleEN: 'Follow arrows to the voting cabinet',
    subtitleHI: 'निजी वोटिंग केबिन की तरफ बढ़ें',
    icon: MapPin,
    color: 'sky'
  },
  {
    id: 'get-inked',
    phaseNum: 3,
    titleEN: 'Get Indelible Ink Mark',
    titleHI: 'अमिट स्याही लगवाना',
    subtitleEN: 'Left forefinger marked with blue ink',
    subtitleHI: 'तर्जनी उंगली पर नीली स्याही का निशान',
    icon: Paintbrush,
    color: 'purple'
  },
  {
    id: 'press-evm',
    phaseNum: 4,
    titleEN: 'Press EVM Blue Button',
    titleHI: 'ईवीएम का नीला बटन दबाएं',
    subtitleEN: 'Select candidate and cast vote',
    subtitleHI: 'पसंदीदा उम्मीदवार के सामने बटन दबाएं',
    icon: Fingerprint,
    color: 'blue'
  }
];

export default function VotingFlowchart() {
  const [completedPhases, setCompletedPhases] = useState<Record<string, boolean>>({
    'id-check': false,
    'enter-station': false,
    'get-inked': false,
    'press-evm': false
  });
  const [activePlayingId, setActivePlayingId] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');
  const { speak, stop, isSpeaking } = useAudioGuide();

  // Sync state if audio stops naturally
  useEffect(() => {
    if (!isSpeaking) {
      setActivePlayingId('');
    }
  }, [isSpeaking]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);

  // Translate spoken guidance based on selected language
  const getSpeechScript = useCallback((stepId: string, lang: 'en' | 'hi') => {
    if (lang === 'en') {
      switch (stepId) {
        case 'id-check':
          return 'Phase 1 is Check ID and Voter List. When you enter the building, the first polling officer will verify your Voter ID card or Aadhaar card against the official electoral roll database. Once they find your name on the list, they will call it out loud.';
        case 'enter-station':
          return 'Phase 2 is entering the private voting room. Follow the guidance arrows and queue markers to enter the polling station securely. Please maintain silence, respect the queue, and prepare your cards.';
        case 'get-inked':
          return 'Phase 3 is getting inked. The second polling officer will verify your details, ask for your signature, and apply the indelible violet ink mark on your left forefinger. This mark proves you registered today and prevents double voting.';
        case 'press-evm':
          return 'Phase 4 is pressing the blue candidate button. Step inside the secure cardboard voting cabin alone. Locate your preferred candidate and their symbol, then press the large blue button next to it. You will hear a long beep sound showing your practice vote is successfully cast.';
        default:
          return '';
      }
    } else {
      switch (stepId) {
        case 'id-check':
          return 'पहला चरण है पहचान और मतदाता सूची की जांच। जब आप मतदान केंद्र में प्रवेश करेंगे, तो पहले मतदान अधिकारी आपकी वोटर आईडी या आधार कार्ड की जांच सरकारी मतदाता सूची से करेंगे। सूची में आपका नाम मिलने पर, वे उसे जोर से पुकारेंगे।';
        case 'enter-station':
          return 'दूसरा चरण है मतदान कक्ष में प्रवेश। मतदान केंद्र में सुरक्षित रूप से प्रवेश करने के लिए मार्गदर्शन तीरों और कतार के निशानों का पालन करें। कृपया शांति बनाए रखें, कतार का सम्मान करें और अपने कार्ड तैयार रखें।';
        case 'get-inked':
          return 'तीसरा चरण है अमिट स्याही लगवाना। दूसरे मतदान अधिकारी आपके विवरण की जांच करेंगे, आपके हस्ताक्षर लेंगे, और आपकी बाईं तर्जनी उंगली पर अमिट बैंगनी स्याही का निशान लगाएंगे। यह निशान आज आपके मतदान करने का पक्का प्रमाण है।';
        case 'press-evm':
          return 'चौथा चरण है ईवीएम पर नीला बटन दबाना। अकेले सुरक्षित वोटिंग केबिन के अंदर कदम रखें। अपने पसंदीदा उम्मीदवार और उनके चुनाव चिन्ह को खोजें, फिर उनके सामने वाला बड़ा नीला बटन दबाएं। लंबी बीप ध्वनि सुनाई देगी जो आपके सफल अभ्यास वोट का प्रमाण है।';
        default:
          return '';
      }
    }
  }, []);

  const handleAudioPlayback = useCallback((stepId: string) => {
    if (activePlayingId === stepId) {
      stop();
      setActivePlayingId('');
    } else {
      setActivePlayingId(stepId);
      const text = getSpeechScript(stepId, activeLang);
      const locale = activeLang === 'en' ? 'en-US' : 'hi-IN';
      speak(text, locale);
    }
  }, [activePlayingId, activeLang, speak, stop, getSpeechScript]);

  const togglePhaseComplete = useCallback((stepId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering audio guide concurrently
    setCompletedPhases(prev => {
      const updated = { ...prev, [stepId]: !prev[stepId] };
      
      // Auto speak checklist status feedback
      const stepIndex = stepsData.findIndex(s => s.id === stepId);
      const stepName = activeLang === 'en' ? stepsData[stepIndex].titleEN : stepsData[stepIndex].titleHI;
      const isDone = updated[stepId];
      
      if (activeLang === 'en') {
        speak(`${stepName} is now marked ${isDone ? 'completed' : 'incomplete'}.`, 'en-US');
      } else {
        speak(`${stepName} को अब ${isDone ? 'पूरा' : 'अधूरा'} चिह्नित किया गया है।`, 'hi-IN');
      }
      return updated;
    });
  }, [activeLang, speak]);

  // Calculate dynamic connector line completion percentage
  const getLineCompletionPercent = () => {
    let completedCount = 0;
    const ids = stepsData.map(s => s.id);
    for (let i = 0; i < ids.length; i++) {
      if (completedPhases[ids[i]]) {
        completedCount = i + 1;
      }
    }
    if (completedCount === 0) return 0;
    if (completedCount === 1) return 15;
    if (completedCount === 2) return 50;
    if (completedCount === 3) return 83;
    return 100;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
      {/* Visual background decorations */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none rounded-bl-full" />
      
      {/* HEADER CONTROLS BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-outfit flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} /> Interactive Guide
            </span>
            <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-1 rounded-full font-bold">Zero-Literacy Mode</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-outfit text-white leading-tight">
            {activeLang === 'en' ? 'Interactive Polling Booth Flowchart' : 'मतदान केंद्र चरण-दर-चरण फ्लोचार्ट'}
          </h3>
          <p className="text-xs text-slate-400">
            {activeLang === 'en' 
              ? 'Tap each node to listen. Practice the queue walk by toggling checkmarks to fill the visual timeline.'
              : 'सुनने के लिए प्रत्येक नोड पर टैप करें। दृश्य समयरेखा भरने के लिए चेकबॉक्स पर क्लिक करें।'}
          </p>
        </div>

        {/* Dynamic Voice Language Pill Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-850 self-end md:self-auto shadow-inner">
          <button
            onClick={() => {
              setActiveLang('en');
              stop();
              setActivePlayingId('');
            }}
            className={`p-1.5 px-4 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider outline-none cursor-pointer flex items-center gap-1 ${
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
            className={`p-1.5 px-4 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider outline-none cursor-pointer flex items-center gap-1 ${
              activeLang === 'hi'
                ? 'bg-civic-gold text-civic-navy shadow-md shadow-civic-gold/15'
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            🇮🇳 हिंदी
          </button>
        </div>
      </div>

      {/* MULTI-NODE FLOWCHART BOARD */}
      <div 
        className="relative py-8 px-4 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 select-none min-h-[340px] md:min-h-0"
        role="region"
        aria-label="Polling Booth queue flowchart sequence"
      >
        {/* DESKTOP THICK PIPELINE TRACK (Behind nodes) */}
        <div className="hidden md:block absolute top-1/2 inset-x-12 h-3 bg-slate-900 border border-slate-850 rounded-full -translate-y-1/2 -z-10 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            style={{ width: `${getLineCompletionPercent()}%` }}
          />
        </div>

        {/* MOBILE THICK PIPELINE TRACK (Behind nodes) */}
        <div className="md:hidden absolute left-1/2 inset-y-12 w-3 bg-slate-900 border border-slate-850 rounded-full -translate-x-1/2 -z-10 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-b from-emerald-500 via-green-400 to-emerald-600 w-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            style={{ height: `${getLineCompletionPercent()}%` }}
          />
        </div>

        {/* MAPPING PHASES */}
        {stepsData.map((step) => {
          const StepIcon = step.icon;
          const isCompleted = !!completedPhases[step.id];
          const isPlaying = activePlayingId === step.id;

          return (
            <div 
              key={step.id}
              onClick={() => handleAudioPlayback(step.id)}
              className="flex flex-col items-center text-center relative group select-none cursor-pointer shrink-0 md:w-1/4"
              role="button"
              tabIndex={0}
              aria-label={`Phase ${step.phaseNum}: ${activeLang === 'en' ? step.titleEN : step.titleHI}. Tap to listen.`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAudioPlayback(step.id);
                }
              }}
            >
              {/* MASSIVE GLOWING TACTILE NODE */}
              <div 
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 flex items-center justify-center relative transition-all duration-350 cursor-pointer shadow-xl outline-none group-focus-visible:ring-4 group-focus-visible:ring-civic-gold select-none group-hover:scale-105 active:scale-95 ${
                  isPlaying 
                    ? 'bg-slate-950 border-civic-gold text-civic-gold scale-105 ring-4 ring-civic-gold/15 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                    : isCompleted
                    ? 'bg-slate-900 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:border-emerald-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 group-hover:border-slate-600'
                }`}
              >
                {/* Visual ripple wave rings when playing audio */}
                {isPlaying && (
                  <>
                    <span className="w-full h-full rounded-full border-2 border-civic-gold absolute inset-0 animate-ping opacity-60" />
                    <span className="w-full h-full rounded-full border-4 border-civic-gold/20 absolute -inset-2 animate-pulse" />
                  </>
                )}

                {/* Big Tactile Icon */}
                <StepIcon className={`w-12 h-12 stroke-2 ${isPlaying ? 'animate-bounce' : 'transition-transform duration-300 group-hover:scale-110'}`} />

                {/* Tactile overlay circle to toggle check completion status */}
                <button
                  type="button"
                  onClick={(e) => togglePhaseComplete(step.id, e)}
                  aria-label={isCompleted ? `Mark ${activeLang === 'en' ? step.titleEN : step.titleHI} incomplete` : `Mark ${activeLang === 'en' ? step.titleEN : step.titleHI} completed`}
                  className={`w-8 h-8 rounded-full border-2 absolute -top-1 -right-1 flex items-center justify-center cursor-pointer shadow-md transition-all outline-none duration-250 select-none hover:scale-110 active:scale-90 ${
                    isCompleted
                      ? 'bg-emerald-500 border-slate-900 text-white shadow-emerald-500/25 scale-105 animate-fadeIn'
                      : 'bg-slate-950 border-slate-700 text-transparent hover:border-emerald-500 hover:text-emerald-500/60'
                  }`}
                >
                  <Check className="w-4 h-4 font-black stroke-[3.5]" />
                </button>

                {/* Phase index small badge */}
                <div className="absolute -bottom-1 bg-slate-900 border border-slate-800 text-slate-350 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-outfit shadow">
                  {activeLang === 'en' ? `Phase ${step.phaseNum}` : `चरण ${step.phaseNum}`}
                </div>
              </div>

              {/* NODE DESCRIPTIVE LABELS */}
              <div className="mt-5 space-y-1 select-none pointer-events-none max-w-[160px] md:max-w-none px-2">
                <h4 className={`text-sm font-extrabold font-outfit transition-colors leading-tight ${
                  isPlaying 
                    ? 'text-civic-gold' 
                    : isCompleted 
                    ? 'text-emerald-400 font-bold' 
                    : 'text-white font-bold'
                }`}>
                  {activeLang === 'en' ? step.titleEN : step.titleHI}
                </h4>
                <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                  {activeLang === 'en' ? step.subtitleEN : step.subtitleHI}
                </p>
              </div>

              {/* Dynamic playback active notification bar */}
              {isPlaying && (
                <div className="mt-3 flex items-center gap-0.5 justify-center">
                  <span className="w-0.5 bg-civic-gold h-2.5 rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-0.5 bg-civic-gold h-4 rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-0.5 bg-civic-gold h-2 rounded animate-bounce" style={{ animationDelay: '0.5s' }} />
                  <span className="w-0.5 bg-civic-gold h-3 rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ZERO LITERACY ASSISTANCE FOOTER */}
      <div className="bg-slate-900/20 border border-slate-850 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <HelpCircle className="w-5 h-5 text-civic-gold shrink-0" />
          <p className="font-semibold text-center sm:text-left leading-relaxed">
            {activeLang === 'en'
              ? 'Tapping cards explains the queue path aloud. Completing all four milestones confirms you are ready for polling day!'
              : 'कार्डों पर टैप करने से कतार का मार्ग जोर से समझाया जाता है। सभी चरणों को पूरा करना दर्शाता है कि आप मतदान के लिए तैयार हैं!'}
          </p>
        </div>
        
        {/* Playback active overall indicator */}
        {activePlayingId && (
          <button
            onClick={() => stop()}
            className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-civic-gold font-bold text-[10px] tracking-wider uppercase p-2 px-4 rounded-xl flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 outline-none cursor-pointer"
          >
            <VolumeX className="w-4 h-4" /> {activeLang === 'en' ? 'Stop Audio' : 'आवाज बंद करें'}
          </button>
        )}
      </div>
    </div>
  );
}
