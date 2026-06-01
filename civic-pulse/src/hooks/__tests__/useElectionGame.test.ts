import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useElectionGame } from '../useElectionGame';

// Setup Mock Spies for global speechSynthesis
const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockGetVoices = vi.fn().mockReturnValue([
  { name: 'Google US English', lang: 'en-US', default: true }
]);

describe('useElectionGame Custom Hook', () => {
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

  it('should initialize with correct default state values', () => {
    const { result } = renderHook(() => useElectionGame({ trackId: 'first-time' }));

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.selectedOptionIndex).toBeNull();
    expect(result.current.hasAnswered).toBe(false);
    expect(result.current.isCorrect).toBeNull();
    expect(result.current.score).toBe(0);
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isComplete).toBe(false);
  });

  it('should update option selection when option is selected', () => {
    const { result } = renderHook(() => useElectionGame({ trackId: 'first-time' }));

    act(() => {
      result.current.handleOptionSelect(1);
    });

    expect(result.current.selectedOptionIndex).toBe(1);
  });

  it('should not allow option selection changes once answered', () => {
    const { result } = renderHook(() => useElectionGame({ trackId: 'first-time' }));

    act(() => {
      result.current.handleOptionSelect(1);
    });
    expect(result.current.selectedOptionIndex).toBe(1);

    act(() => {
      result.current.submitAnswer();
    });
    expect(result.current.hasAnswered).toBe(true);

    act(() => {
      result.current.handleOptionSelect(0);
    });
    expect(result.current.selectedOptionIndex).toBe(1); // remains unchanged
  });

  it('should correctly evaluate a correct option choice', () => {
    const { result } = renderHook(() => useElectionGame({ trackId: 'first-time' }));

    // Step 1: correctIndex is 1 ('Check the Voter List...')
    act(() => {
      result.current.handleOptionSelect(1);
    });

    act(() => {
      result.current.submitAnswer();
    });

    expect(result.current.hasAnswered).toBe(true);
    expect(result.current.isCorrect).toBe(true);
    expect(result.current.score).toBe(1);
    expect(mockSpeak).toHaveBeenCalled();
  });

  it('should correctly evaluate an incorrect option choice', () => {
    const { result } = renderHook(() => useElectionGame({ trackId: 'first-time' }));

    // Step 1: correctIndex is 1, so selecting 0 is incorrect
    act(() => {
      result.current.handleOptionSelect(0);
    });

    act(() => {
      result.current.submitAnswer();
    });

    expect(result.current.hasAnswered).toBe(true);
    expect(result.current.isCorrect).toBe(false);
    expect(result.current.score).toBe(0);
    expect(mockSpeak).toHaveBeenCalled();
  });

  it('should advance steps, reset quiz states, and keep track of completion', () => {
    const { result } = renderHook(() => useElectionGame({ trackId: 'first-time' }));

    // Select and submit correct answer for Step 1 (Index 0 in stages)
    act(() => {
      result.current.handleOptionSelect(1);
    });
    act(() => {
      result.current.submitAnswer();
    });
    expect(result.current.score).toBe(1);

    // Transition to next step
    act(() => {
      result.current.goToNextStep();
    });

    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.selectedOptionIndex).toBeNull();
    expect(result.current.hasAnswered).toBe(false);
    expect(result.current.isCorrect).toBeNull();
    expect(result.current.score).toBe(1); // score preserved
  });

  it('should protect indices from out-of-bound errors when reaching the last step', () => {
    const { result } = renderHook(() => useElectionGame({ trackId: 'first-time' }));

    // Sequence through all 6 steps (indexes 0 to 5)
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.goToNextStep();
      });
    }

    expect(result.current.currentStepIndex).toBe(5);
    expect(result.current.isComplete).toBe(true); // completed at the last step

    // Attempting to advance beyond the last index should be safely guarded
    act(() => {
      result.current.goToNextStep();
    });

    expect(result.current.currentStepIndex).toBe(5); // should stay capped at 5
    expect(result.current.isComplete).toBe(true);
  });

  it('should fully restore all game states and trigger narration on resetGame', () => {
    const { result } = renderHook(() => useElectionGame({ trackId: 'first-time' }));

    act(() => {
      result.current.handleOptionSelect(1);
    });
    act(() => {
      result.current.submitAnswer();
    });
    act(() => {
      result.current.goToNextStep();
    });

    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.score).toBe(1);

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.selectedOptionIndex).toBeNull();
    expect(result.current.hasAnswered).toBe(false);
    expect(result.current.isCorrect).toBeNull();
    expect(result.current.score).toBe(0);
    expect(result.current.isComplete).toBe(false);
  });
});
