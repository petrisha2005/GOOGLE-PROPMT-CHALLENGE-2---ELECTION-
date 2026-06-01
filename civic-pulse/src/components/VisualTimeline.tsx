import { useState, useEffect } from 'react';
import { 
  FileText, 
  Mail, 
  Calendar, 
  MapPin, 
  Volume2, 
  VolumeX, 
  AlertCircle
} from 'lucide-react';
import { StateElectionData } from '../data/electionData';
import { useAudioGuide } from '../hooks/useAudioGuide';

interface VisualTimelineProps {
  stateData: StateElectionData;
}

export default function VisualTimeline({ stateData }: VisualTimelineProps) {
  const [activePlayingId, setActivePlayingId] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'en' | 'native'>('en');
  const { speak, stop, isSpeaking, isSupported } = useAudioGuide();

  // Sync state if audio stops naturally
  useEffect(() => {
    if (!isSpeaking) {
      setActivePlayingId('');
    }
  }, [isSpeaking]);

  // Stop active audio on state transition
  useEffect(() => {
    stop();
    setActivePlayingId('');
  }, [stateData, stop]);

  const handleAudioPlayback = (cardId: string) => {
    if (activePlayingId === cardId) {
      stop();
      setActivePlayingId('');
    } else {
      setActivePlayingId(cardId);
      const audioText = getAudioText(cardId, activeLang);
      const speechLang = stateData.stateCode === 'IN'
        ? (activeLang === 'en' ? 'en-US' : 'hi-IN')
        : (activeLang === 'en' ? 'en-US' : 'es-ES');
      speak(audioText, speechLang);
    }
  };

  // Localized Multi-Language conversational transcripts
  const getAudioText = (cardId: string, lang: 'en' | 'native') => {
    const isIndia = stateData.stateCode === 'IN';
    
    if (isIndia) {
      if (lang === 'en') {
        switch (cardId) {
          case 'reg':
            return `
              Milestone 1 is Voter Registration Form 6. 
              In India, your deadline to submit Form 6 by mail is ${stateData.voterRegistration.mailDeadline.displayDate}. 
              If you register online, your deadline is ${stateData.voterRegistration.onlineDeadline?.displayDate || 'October 20, 2026'}. 
              Please upload a passport photo, address proof, and age proof.
            `;
          case 'mail':
            return `
              Milestone 2 is Postal Ballot Form 12D. 
              In India, postal ballots are restricted to senior citizens aged 80 plus and persons with disabilities. 
              You must submit Form 12D by ${stateData.mailInBallot.requestDeadline.displayDate}.
            `;
          case 'early':
            return `
              Milestone 3 is Early Facilitation Centers. 
              Please note that early voting is not available for the general public in India. 
              All standard citizens must vote in person at their assigned local polling booth on Polling Day.
            `;
          case 'election':
            return `
              Milestone 4 is Polling Day, which takes place on ${stateData.electionDay.displayDate}. 
              Polling booths are open from ${stateData.electionDay.pollingHours}. 
              Get your left forefinger marked with indelible ink, and press your choice on the electronic voting machine. 
              Make sure the VVPAT prints your choice slip for 7 seconds.
            `;
          default:
            return '';
        }
      } else {
        // Hindi (hi-IN)
        switch (cardId) {
          case 'reg':
            return `
              पहला मील का पत्थर मतदाता पंजीकरण फॉर्म ६ है। 
              भारत में, डाक द्वारा फॉर्म ६ जमा करने की अंतिम तिथि ${stateData.voterRegistration.mailDeadline.displayDate} है। 
              यदि आप ऑनलाइन पंजीकरण करते हैं, तो आपकी अंतिम तिथि ${stateData.voterRegistration.onlineDeadline?.displayDate || '२० अक्टूबर, २०२६'} है। 
              कृपया अपना नया पासपोर्ट फोटो, पते का प्रमाण और आयु प्रमाण अपलोड करें।
            `;
          case 'mail':
            return `
              दूसरा मील का पत्थर पोस्टल बैलट फॉर्म १२ डी है। 
              भारत में, डाक मतपत्र केवल अस्सी वर्ष से अधिक आयु के वरिष्ठ नागरिकों और चालीस प्रतिशत से अधिक विकलांग व्यक्तियों के लिए उपलब्ध है। 
              आपको ${stateData.mailInBallot.requestDeadline.displayDate} तक फॉर्म १२ डी जमा करना होगा।
            `;
          case 'early':
            return `
              तीसरा मील का पत्थर प्रारंभिक सुविधा केंद्र है। 
              कृपया ध्यान दें कि भारत में आम जनता के लिए प्रारंभिक मतदान की सुविधा उपलब्ध नहीं है। 
              सभी नागरिकों को मतदान के दिन अपने आवंटित पोलिंग बूथ पर जाकर ही मतदान करना होगा।
            `;
          case 'election':
            return `
              चौथा मील का पत्थर मतदान का दिन है, जो ${stateData.electionDay.displayDate} को है। 
              मतदान केंद्र ${stateData.electionDay.pollingHours} तक खुले रहेंगे। 
              अपनी तर्जनी उंगली पर अमिट स्याही लगवाएं और ईवीएम मशीन पर अपना पसंदीदा नीला बटन दबाएं। 
              यह अवश्य जांच लें कि वी वी पैट मशीन पर आपकी पर्ची सात सेकंड तक दिखाई दे।
            `;
          default:
            return '';
        }
      }
    } else {
      // US States (CA, TX, NY)
      if (lang === 'en') {
        switch (cardId) {
          case 'reg':
            return `
              Milestone 1 is Voter Registration. 
              In ${stateData.stateName}, your deadline to submit a form by mail is ${stateData.voterRegistration.mailDeadline.displayDate}. 
              ${stateData.voterRegistration.onlineDeadline 
                ? 'If you register online, your deadline is ' + stateData.voterRegistration.onlineDeadline.displayDate 
                : 'Please note that this state does not support online registration, you must print and mail a paper form.'} 
              ${stateData.voterRegistration.sameDayAllowed 
                ? 'If you miss the deadline, same day conditional registration is supported in person.' 
                : 'Same day registration is not supported, so register early to vote!'}
            `;
          case 'mail':
            return `
              Milestone 2 is Mail in Voting. 
              ${stateData.mailInBallot.excuseRequired 
                ? 'This state requires a legal excuse to vote by mail. The rules are: ' + stateData.mailInBallot.excuseRules 
                : 'Good news! You do not need a legal excuse to vote by mail in this state.'} 
              You must submit your request by ${stateData.mailInBallot.requestDeadline.displayDate}, and return your filled ballot by ${stateData.mailInBallot.returnDeadline.displayDate}.
            `;
          case 'early':
            return `
              Milestone 3 is Early In Person Voting. 
              You can vote early in person starting on ${stateData.earlyVoting.startDate.displayDate} and ending on ${stateData.earlyVoting.endDate.displayDate}. 
              ${stateData.earlyVoting.weekendVoting 
                ? 'Weekend voting hours are available to fit your schedule.' 
                : 'Weekend voting hours are limited in this state.'}
            `;
          case 'election':
            return `
              Milestone 4 is Election Day, which takes place on ${stateData.electionDay.displayDate}. 
              Polling booths are open from ${stateData.electionDay.pollingHours}. 
              Make sure you are in line by closing time, and check your designated precinct voting station before leaving.
            `;
          default:
            return '';
        }
      } else {
        // Spanish (es-ES)
        switch (cardId) {
          case 'reg':
            return `
              El hito 1 es el Registro de Votantes. 
              En el estado de ${stateData.stateName}, la fecha límite para enviar su solicitud por correo es el ${stateData.voterRegistration.mailDeadline.displayDate}. 
              ${stateData.voterRegistration.onlineDeadline 
                ? 'Si se registra en línea, su fecha límite es el ' + stateData.voterRegistration.onlineDeadline.displayDate 
                : 'Tenga en cuenta que este estado no admite el registro en línea, debe imprimir y enviar una solicitud en papel.'} 
              ${stateData.voterRegistration.sameDayAllowed 
                ? 'Si no cumple con la fecha límite, se admite el registro condicional el mismo día en persona.' 
                : 'El registro el mismo día no está disponible, ¡así que regístrese temprano para votar!'}
            `;
          case 'mail':
            return `
              El hito 2 es el Voto por Correo. 
              ${stateData.mailInBallot.excuseRequired 
                ? 'Este estado requiere una excusa legal para votar por correo. Las reglas son: ' + stateData.mailInBallot.excuseRules 
                : '¡Buenas noticias! No necesita una excusa legal para votar por correo en este estado.'} 
              Debe enviar su solicitud antes del ${stateData.mailInBallot.requestDeadline.displayDate} y devolver su boleta completa antes del ${stateData.mailInBallot.returnDeadline.displayDate}.
            `;
          case 'early':
            return `
              El hito 3 es el Voto Anticipado en Persona. 
              Puede votar temprano en persona comenzando el ${stateData.earlyVoting.startDate.displayDate} y terminando el ${stateData.earlyVoting.endDate.displayDate}. 
              ${stateData.earlyVoting.weekendVoting 
                ? 'Los horarios de votación de fin de semana están disponibles para adaptarse a su agenda.' 
                : 'Los horarios de votación de fin de semana son limitados en este estado.'}
            `;
          case 'election':
            return `
              El hito 4 es el Día de la Elección, que se llevará a cabo el ${stateData.electionDay.displayDate}. 
              Los centros de votación estarán abiertos de ${stateData.electionDay.pollingHours}. 
              Asegúrese de estar en la fila a la hora de cierre y verifique su estación de votación asignada antes de salir.
            `;
          default:
            return '';
        }
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dynamic Native Audio Language Toggle Panel */}
      {isSupported && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/35 border border-slate-850 p-4 rounded-2xl gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-civic-gold rounded-full animate-pulse shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold text-white font-outfit uppercase tracking-wider block sm:inline">Voice Narration Guide</span>: 
              <span className="text-slate-400 font-medium ml-1">Listen to patient, plain-language audio instructions in your language of choice.</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 self-end sm:self-auto shadow-inner">
            <button
              onClick={() => {
                setActiveLang('en');
                stop();
                setActivePlayingId('');
              }}
              className={`p-1.5 px-4 rounded-lg text-[10px] font-black transition-all uppercase tracking-wider outline-none cursor-pointer flex items-center gap-1.5 ${
                activeLang === 'en'
                  ? 'bg-civic-gold text-civic-navy shadow-md shadow-civic-gold/15'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {stateData.stateCode === 'IN' ? '🇬🇧 EN' : '🇺🇸 EN'}
            </button>
            <button
              onClick={() => {
                setActiveLang('native');
                stop();
                setActivePlayingId('');
              }}
              className={`p-1.5 px-4 rounded-lg text-[10px] font-black transition-all uppercase tracking-wider outline-none cursor-pointer flex items-center gap-1.5 ${
                activeLang === 'native'
                  ? 'bg-civic-gold text-civic-navy shadow-md shadow-civic-gold/15'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {stateData.stateCode === 'IN' ? '🇮🇳 हिंदी (HI)' : '🇪🇸 ES'}
            </button>
          </div>
        </div>
      )}

      {/* Audio guide support alert */}
      {!isSupported && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <p>Speech synthesis is not fully supported in this browser. Visual layouts are still active.</p>
        </div>
      )}

      {/* ZERO LITERACY ACCESSIBLE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="region" aria-label="Visual election timeline cards">
        
        {/* Card 1: Voter Registration */}
        <div className={`bg-slate-900/40 border-2 rounded-3xl p-6 relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-civic-gold/5 focus-within:ring-4 focus-within:ring-civic-gold ${
          activePlayingId === 'reg' ? 'border-civic-gold bg-amber-500/5' : 'border-slate-850 hover:border-slate-700'
        }`}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-civic-gold/15 text-civic-gold p-4 rounded-2xl border border-civic-gold/20">
                <FileText className="w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-civic-gold uppercase tracking-wider font-outfit">Step 1</span>
                <h4 className="text-xl font-extrabold text-white font-outfit mt-0.5">Register to Vote</h4>
              </div>
            </div>

            {/* Accessible Large Speaker Play Button */}
            {isSupported && (
              <button
                onClick={() => handleAudioPlayback('reg')}
                aria-label={activePlayingId === 'reg' ? "Stop audio for Voter Registration" : "Play audio guide for Voter Registration"}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 outline-none ${
                  activePlayingId === 'reg'
                    ? 'bg-civic-gold border-civic-gold text-civic-navy shadow-lg shadow-civic-gold/25 animate-pulse'
                    : 'bg-slate-950 border-slate-750 text-civic-gold hover:border-civic-gold'
                }`}
              >
                {activePlayingId === 'reg' ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <div className="text-sm font-extrabold text-slate-200">
              Deadline: <span className="text-civic-gold font-outfit">{stateData.voterRegistration.mailDeadline.displayDate}</span>
            </div>
            <p className="text-xs text-slate-350 leading-relaxed font-medium">
              You must submit your registration details to be eligible to vote. Register online if available, or mail a paper form.
            </p>
          </div>

          {/* Audio Wave Visual Cue */}
          {activePlayingId === 'reg' && (
            <div className="mt-4 flex items-center gap-1 justify-center py-1">
              <span className="w-1 bg-civic-gold h-4 rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 bg-civic-gold h-6 rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 bg-civic-gold h-3 rounded animate-bounce" style={{ animationDelay: '0.5s' }} />
              <span className="w-1 bg-civic-gold h-5 rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="text-[10px] text-civic-gold font-bold uppercase ml-2 tracking-wider font-outfit">Reading aloud...</span>
            </div>
          )}
        </div>

        {/* Card 2: Mail-in Ballot Requests */}
        <div className={`bg-slate-900/40 border-2 rounded-3xl p-6 relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-400/5 focus-within:ring-4 focus-within:ring-sky-400 ${
          activePlayingId === 'mail' ? 'border-sky-400 bg-sky-500/5' : 'border-slate-850 hover:border-slate-700'
        }`}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-sky-500/15 text-sky-400 p-4 rounded-2xl border border-sky-400/20">
                <Mail className="w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider font-outfit">Step 2</span>
                <h4 className="text-xl font-extrabold text-white font-outfit mt-0.5">Vote from Home</h4>
              </div>
            </div>

            {isSupported && (
              <button
                onClick={() => handleAudioPlayback('mail')}
                aria-label={activePlayingId === 'mail' ? "Stop audio for Mail-in voting" : "Play audio guide for Mail-in voting"}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 outline-none ${
                  activePlayingId === 'mail'
                    ? 'bg-sky-400 border-sky-400 text-civic-navy shadow-lg shadow-sky-400/25 animate-pulse'
                    : 'bg-slate-950 border-slate-750 text-sky-400 hover:border-sky-400'
                }`}
              >
                {activePlayingId === 'mail' ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <div className="text-sm font-extrabold text-slate-200">
              Request by: <span className="text-sky-400 font-outfit">{stateData.mailInBallot.requestDeadline.displayDate}</span>
            </div>
            <p className="text-xs text-slate-350 leading-relaxed font-medium">
              {stateData.mailInBallot.excuseRequired 
                ? 'Texas rules require a legal excuse (e.g. sickness, disabled) to vote from home.' 
                : 'California/New York support no-excuse mail voting. Ballots are sent directly to your home!'}
            </p>
          </div>

          {activePlayingId === 'mail' && (
            <div className="mt-4 flex items-center gap-1 justify-center py-1">
              <span className="w-1 bg-sky-400 h-4 rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 bg-sky-400 h-6 rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 bg-sky-400 h-3 rounded animate-bounce" style={{ animationDelay: '0.5s' }} />
              <span className="w-1 bg-sky-400 h-5 rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="text-[10px] text-sky-400 font-bold uppercase ml-2 tracking-wider font-outfit">Reading aloud...</span>
            </div>
          )}
        </div>

        {/* Card 3: Early In-Person Voting */}
        <div className={`bg-slate-900/40 border-2 rounded-3xl p-6 relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-400/5 focus-within:ring-4 focus-within:ring-purple-400 ${
          activePlayingId === 'early' ? 'border-purple-400 bg-purple-500/5' : 'border-slate-850 hover:border-slate-700'
        }`}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/15 text-purple-400 p-4 rounded-2xl border border-purple-400/20">
                <Calendar className="w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider font-outfit">Step 3</span>
                <h4 className="text-xl font-extrabold text-white font-outfit mt-0.5">Vote Early in Person</h4>
              </div>
            </div>

            {isSupported && (
              <button
                onClick={() => handleAudioPlayback('early')}
                aria-label={activePlayingId === 'early' ? "Stop audio for Early Voting" : "Play audio guide for Early Voting"}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 outline-none ${
                  activePlayingId === 'early'
                    ? 'bg-purple-400 border-purple-400 text-civic-navy shadow-lg shadow-purple-400/25 animate-pulse'
                    : 'bg-slate-950 border-slate-750 text-purple-400 hover:border-purple-400'
                }`}
              >
                {activePlayingId === 'early' ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <div className="text-sm font-extrabold text-slate-200">
              Starts on: <span className="text-purple-400 font-outfit">{stateData.earlyVoting.startDate.displayDate}</span>
            </div>
            <p className="text-xs text-slate-350 leading-relaxed font-medium">
              Skip Election Day queues by voting early. Weekend hours are offered in CA, TX, and NY to suit working citizen needs.
            </p>
          </div>

          {activePlayingId === 'early' && (
            <div className="mt-4 flex items-center gap-1 justify-center py-1">
              <span className="w-1 bg-purple-400 h-4 rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 bg-purple-400 h-6 rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 bg-purple-400 h-3 rounded animate-bounce" style={{ animationDelay: '0.5s' }} />
              <span className="w-1 bg-purple-400 h-5 rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="text-[10px] text-purple-400 font-bold uppercase ml-2 tracking-wider font-outfit">Reading aloud...</span>
            </div>
          )}
        </div>

        {/* Card 4: Election Day */}
        <div className={`bg-slate-900/40 border-2 rounded-3xl p-6 relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-civic-red/5 focus-within:ring-4 focus-within:ring-civic-red ${
          activePlayingId === 'election' ? 'border-civic-red bg-red-500/5' : 'border-slate-850 hover:border-slate-700'
        }`}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-500/15 text-civic-red p-4 rounded-2xl border border-civic-red/20">
                <MapPin className="w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-civic-red uppercase tracking-wider font-outfit">Step 4</span>
                <h4 className="text-xl font-extrabold text-white font-outfit mt-0.5">Election Day</h4>
              </div>
            </div>

            {isSupported && (
              <button
                onClick={() => handleAudioPlayback('election')}
                aria-label={activePlayingId === 'election' ? "Stop audio for Election Day" : "Play audio guide for Election Day"}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 outline-none ${
                  activePlayingId === 'election'
                    ? 'bg-civic-red border-civic-red text-white shadow-lg shadow-civic-red/25 animate-pulse'
                    : 'bg-slate-950 border-slate-750 text-civic-red hover:border-civic-red'
                }`}
              >
                {activePlayingId === 'election' ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <div className="text-sm font-extrabold text-slate-200">
              Date: <span className="text-civic-red font-outfit">{stateData.electionDay.displayDate}</span>
            </div>
            <p className="text-xs text-slate-350 leading-relaxed font-medium">
              Cast your vote in person at your local assigned county voting precinct. Remember to review your ID requirements beforehand!
            </p>
          </div>

          {activePlayingId === 'election' && (
            <div className="mt-4 flex items-center gap-1 justify-center py-1">
              <span className="w-1 bg-civic-red h-4 rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 bg-civic-red h-6 rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 bg-civic-red h-3 rounded animate-bounce" style={{ animationDelay: '0.5s' }} />
              <span className="w-1 bg-civic-red h-5 rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="text-[10px] text-civic-red font-bold uppercase ml-2 tracking-wider font-outfit">Reading aloud...</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
