import { useState, useEffect, useCallback } from 'react';
import { globalElectionTracks } from '../data/electionData';
import { useAudioGuide } from './useAudioGuide';

export interface UseElectionGameResult {
  // Interactive Quiz States
  currentStepIndex: number;
  selectedOptionIndex: number | null;
  hasAnswered: boolean;
  isCorrect: boolean | null;
  score: number;

  // Core Interactive Functions
  handleOptionSelect: (index: number) => void;
  submitAnswer: () => void;
  goToNextStep: () => void;
  resetGame: () => void;
  resetCurrentStepAnswer: () => void;

  // Backward Compatibility (for old simulator compatibility)
  currentStep: number;
  isComplete: boolean;
  moveToNextStep: () => void;
}

/**
 * Custom hook to manage the state machine and interactive quiz logic
 * of the Election Journey Simulator game.
 * 
 * @param options Argument object containing the trackId string
 */
export function useElectionGame({ trackId = 'india_evm' }: { trackId?: string } = {}): UseElectionGameResult {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isCompleteState, setIsCompleteState] = useState<boolean>(false);

  // Track if current step had an incorrect answer, to prevent double score updates
  const [firstAttemptFailed, setFirstAttemptFailed] = useState<boolean>(false);

  const { speak, stop } = useAudioGuide();

  // Active track lookup
  const activeTrack = globalElectionTracks[trackId] || globalElectionTracks['india_evm'];
  const journeySteps = activeTrack.steps;
  const currentStep = journeySteps[currentStepIndex];

  // Synchronously reset state when trackId changes to avoid mismatched audio cues
  const [prevTrackId, setPrevTrackId] = useState<string>(trackId);
  if (trackId !== prevTrackId) {
    setPrevTrackId(trackId);
    setCurrentStepIndex(0);
    setSelectedOptionIndex(null);
    setHasAnswered(false);
    setIsCorrect(null);
    setScore(0);
    setFirstAttemptFailed(false);
    setIsCompleteState(false);
  }

  // Handle speech audio cues when trackId or currentStepIndex changes
  useEffect(() => {
    stop();
    const activeStep = journeySteps[currentStepIndex];
    if (activeStep) {
      speak(activeStep.audioNarration, 'en-US');
    }
    return () => stop();
  }, [trackId, currentStepIndex, speak, stop, journeySteps]);

  const handleOptionSelect = useCallback((index: number) => {
    if (!hasAnswered) {
      setSelectedOptionIndex(index);
    }
  }, [hasAnswered]);

  const submitAnswer = useCallback(() => {
    if (selectedOptionIndex === null || hasAnswered || !currentStep) return;

    const correct = selectedOptionIndex === currentStep.correctIndex;
    setHasAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      if (!firstAttemptFailed) {
        setScore(prev => prev + 1);
      }
      speak('Correct!', 'en-US');
    } else {
      setFirstAttemptFailed(true);
      speak('Try again!', 'en-US');
    }
  }, [selectedOptionIndex, hasAnswered, currentStep, speak, firstAttemptFailed]);

  const goToNextStep = useCallback(() => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < journeySteps.length) {
      setCurrentStepIndex(nextIdx);
      setSelectedOptionIndex(null);
      setHasAnswered(false);
      setIsCorrect(null);
      setFirstAttemptFailed(false);
    } else {
      setIsCompleteState(true);
    }
  }, [currentStepIndex, journeySteps.length]);

  const resetCurrentStepAnswer = useCallback(() => {
    setSelectedOptionIndex(null);
    setHasAnswered(false);
    setIsCorrect(null);
  }, []);

  const resetGame = useCallback(() => {
    setCurrentStepIndex(0);
    setSelectedOptionIndex(null);
    setHasAnswered(false);
    setIsCorrect(null);
    setScore(0);
    setFirstAttemptFailed(false);
    setIsCompleteState(false);

    // Explicitly play audio for Step 1
    stop();
    const firstStep = journeySteps[0];
    if (firstStep) {
      speak(firstStep.audioNarration, 'en-US');
    }
  }, [journeySteps, speak, stop]);

  return {
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

    // Backward compatibility mappings
    currentStep: currentStepIndex,
    isComplete: isCompleteState || (journeySteps.length > 0 && currentStepIndex >= journeySteps.length - 1),
    moveToNextStep: goToNextStep
  };
}
