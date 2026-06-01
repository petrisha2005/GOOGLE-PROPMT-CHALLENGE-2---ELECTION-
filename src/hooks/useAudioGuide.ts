import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseAudioGuideResult {
  isSupported: boolean;
  isSpeaking: boolean;
  speak: (text: string, lang?: string) => void;
  stop: () => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

export function useAudioGuide(defaultLang: string = 'en-US'): UseAudioGuideResult {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLang);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 1. Verify Browser Support on Mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguage(lang);
  }, []);

  // Helper to resolve the best premium natural voice for a given language code
  const getBestVoiceForLang = useCallback((langCode: string): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return null;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Filter voices that match the requested language prefix (e.g., 'en', 'es') or exact lang
    const matchingVoices = voices.filter(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(langCode.toLowerCase().split('-')[0])
    );

    if (matchingVoices.length === 0) {
      // Fallback: try to return the first default voice if no matching language prefix is found
      return voices.find(v => v.default) || voices[0];
    }

    // Score matching voices to prioritize crystal-clear, highly understandable human voices:
    // - Samantha (US female, crystal clear, highly understandable)
    // - Veena / Rishi (IN English, extremely understandable for ECI contexts)
    // - Daniel (UK English, clear and professional)
    // - Alex (US English, natural breathing/phrasing)
    // - Google / Microsoft Natural (modern cloud synthesis)
    const scoredVoices = matchingVoices.map(voice => {
      let score = 0;
      const name = voice.name.toLowerCase();
      
      // Top tier: Crystal clear, highly natural localized voice names
      if (name.includes('samantha')) {
        score += 250;
      }
      if (name.includes('veena')) {
        score += 250;
      }
      if (name.includes('rishi')) {
        score += 240;
      }
      if (name.includes('alex')) {
        score += 220;
      }
      if (name.includes('daniel')) {
        score += 200;
      }
      
      // Hindi voice scoring
      if (name.includes('lekha')) {
        score += 250;
      }
      if (name.includes('kalpana')) {
        score += 240;
      }
      if (name.includes('niloy')) {
        score += 220;
      }
      if (name.includes('हिन्दी') || name.includes('hindi')) {
        score += 210;
      }

      // Spanish voice scoring
      if (name.includes('monica')) {
        score += 250;
      }
      if (name.includes('jorge')) {
        score += 240;
      }
      if (name.includes('paulina')) {
        score += 240;
      }
      if (name.includes('diego')) {
        score += 220;
      }
      if (name.includes('español') || name.includes('spanish')) {
        score += 210;
      }
      
      // Second tier: Google cloud voices
      if (name.includes('google')) {
        score += 150;
      }
      // Third tier: Microsoft natural
      if (name.includes('natural')) {
        score += 130;
      }
      // Fourth tier: Apple premium/enhanced
      if (name.includes('premium') || name.includes('enhanced')) {
        score += 100;
      }
      
      // Exact regional match (e.g. en-IN matching en-IN exactly)
      if (voice.lang.toLowerCase() === langCode.toLowerCase()) {
        score += 50;
      }
      
      return { voice, score };
    });

    scoredVoices.sort((a, b) => b.score - a.score);
    return scoredVoices[0].voice;
  }, []);

  // 2. Speak Implementation
  const speak = useCallback((text: string, langOverride?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const synth = window.speechSynthesis;

    // Interrupt any active speech
    synth.cancel();
    setIsSpeaking(false);

    if (!text.trim()) return;

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const targetLang = langOverride || currentLanguage;
    utterance.lang = targetLang;

    // Configure Voice dynamically
    const bestVoice = getBestVoiceForLang(targetLang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    // Set warm conversational speech rates (0.85 to 0.9 as a patient helper)
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    // Event handlers to update speaking state
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (e) => {
      // Don't warn on 'interrupted' because cancel() triggers it naturally during interrupts
      if (e.error !== 'interrupted') {
        console.warn('Speech synthesis utterance error:', e);
      }
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    // Speak
    synth.speak(utterance);
  }, [currentLanguage, getBestVoiceForLang]);

  // 3. Stop Implementation
  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, []);

  // 4. Cleanup on Unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isSupported,
    isSpeaking,
    speak,
    stop,
    currentLanguage,
    setLanguage
  };
}
