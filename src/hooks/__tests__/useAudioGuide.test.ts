import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioGuide } from '../useAudioGuide';

// Setup Mock Spies
const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockGetVoices = vi.fn().mockReturnValue([
  { name: 'Google US English', lang: 'en-US', default: true },
  { name: 'Google IN English', lang: 'en-IN', default: false },
  { name: 'Microsoft Natural Spanish', lang: 'es-ES', default: false }
]);

describe('useAudioGuide Custom Hook', () => {

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock speechSynthesis globally on window
    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      configurable: true,
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        getVoices: mockGetVoices,
      }
    });

    // Mock SpeechSynthesisUtterance constructor
    class MockSpeechSynthesisUtterance {
      text: string;
      lang: string = 'en-US';
      rate: number = 1.0;
      pitch: number = 1.0;
      voice: any = null;
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(text: string) {
        this.text = text;
      }
    }

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      writable: true,
      configurable: true,
      value: MockSpeechSynthesisUtterance
    });
  });

  it('should initialize successfully and recognize browser support', () => {
    const { result } = renderHook(() => useAudioGuide());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.currentLanguage).toBe('en-US');
    expect(typeof result.current.speak).toBe('function');
    expect(typeof result.current.stop).toBe('function');
    expect(typeof result.current.setLanguage).toBe('function');
  });

  it('should support dynamic language selection and state updates', () => {
    const { result } = renderHook(() => useAudioGuide('en-US'));

    expect(result.current.currentLanguage).toBe('en-US');

    act(() => {
      result.current.setLanguage('en-IN');
    });

    expect(result.current.currentLanguage).toBe('en-IN');
  });

  it('should trigger speech synthesis with comfortable conversational rates and target voice', () => {
    const { result } = renderHook(() => useAudioGuide('en-US'));

    let capturedUtterance: any = null;
    mockSpeak.mockImplementation((utterance) => {
      capturedUtterance = utterance;
    });

    act(() => {
      result.current.speak('Welcome to CivicPulse');
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    expect(capturedUtterance).not.toBeNull();
    
    // Warm conversational settings verified
    expect(capturedUtterance.rate).toBe(0.85);
    expect(capturedUtterance.pitch).toBe(1.0);
    expect(capturedUtterance.lang).toBe('en-US');
    expect(capturedUtterance.voice?.name).toBe('Google US English');
  });

  it('should prioritize premium natural voices like Google Premium and localized accents', () => {
    const { result } = renderHook(() => useAudioGuide('en-IN'));

    let capturedUtterance: any = null;
    mockSpeak.mockImplementation((utterance) => {
      capturedUtterance = utterance;
    });

    act(() => {
      result.current.speak('Accessible Guidance');
    });

    expect(capturedUtterance).not.toBeNull();
    expect(capturedUtterance.lang).toBe('en-IN');
    expect(capturedUtterance.voice?.name).toBe('Google IN English');
  });

  it('should cancel active speech when calling stop()', () => {
    const { result } = renderHook(() => useAudioGuide());

    act(() => {
      result.current.stop();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(false);
  });

  it('should support toggle states using mock speaking events', () => {
    const { result } = renderHook(() => useAudioGuide());

    let mockUtterance: any = null;
    mockSpeak.mockImplementation((utterance) => {
      mockUtterance = utterance;
    });

    act(() => {
      result.current.speak('Testing state callbacks');
    });

    expect(mockUtterance).not.toBeNull();

    // Trigger mock event callbacks and verify state updates
    act(() => {
      if (mockUtterance && mockUtterance.onstart) {
        mockUtterance.onstart();
      }
    });
    expect(result.current.isSpeaking).toBe(true);

    act(() => {
      if (mockUtterance && mockUtterance.onend) {
        mockUtterance.onend();
      }
    });
    expect(result.current.isSpeaking).toBe(false);
  });

});
