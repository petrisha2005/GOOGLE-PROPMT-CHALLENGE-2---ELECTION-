import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useElectionTimeline } from '../useElectionTimeline';

describe('useElectionTimeline Custom Hook', () => {
  
  describe('State and ZIP Resolution', () => {
    it('should resolve state data directly when stateCode is passed', () => {
      const { result } = renderHook(() => useElectionTimeline({ stateCode: 'TX' }));
      
      expect(result.current.stateData).not.toBeNull();
      expect(result.current.resolvedStateCode).toBe('TX');
      expect(result.current.zipCodeResolved).toBe(false);
      expect(result.current.stateData?.stateName).toBe('Texas');
    });

    it('should resolve state code dynamically when a matching zipCode is passed', () => {
      // 90210 starts with 9 -> CA
      const { result: caResult } = renderHook(() => useElectionTimeline({ zipCode: '90210' }));
      expect(caResult.current.resolvedStateCode).toBe('CA');
      expect(caResult.current.zipCodeResolved).toBe(true);

      // 73301 starts with 7 -> TX
      const { result: txResult } = renderHook(() => useElectionTimeline({ zipCode: '73301' }));
      expect(txResult.current.resolvedStateCode).toBe('TX');
      expect(txResult.current.zipCodeResolved).toBe(true);

      // 10001 starts with 1 -> NY
      const { result: nyResult } = renderHook(() => useElectionTimeline({ zipCode: '10001' }));
      expect(nyResult.current.resolvedStateCode).toBe('NY');
      expect(nyResult.current.zipCodeResolved).toBe(true);
    });

    it('should default code to null if zipCode is invalid or unmatched', () => {
      const { result } = renderHook(() => useElectionTimeline({ zipCode: '00000' }));
      expect(result.current.resolvedStateCode).toBeNull();
      expect(result.current.stateData).toBeNull();
    });
  });

  describe('Deadline Calculations', () => {
    it('should calculate correct remaining days until CA registration deadline from June 1, 2026', () => {
      const { result } = renderHook(() => useElectionTimeline({ 
        stateCode: 'CA', 
        todayDateOverride: '2026-06-01' 
      }));

      // CA mailDeadline date is '2026-10-19'
      // June 1 to Oct 19 is exactly 140 days
      expect(result.current.daysToRegistrationDeadline).toBe(140);
      expect(result.current.registrationDeadlinePassed).toBe(false);
    });

    it('should calculate correct remaining days until TX registration deadline from June 1, 2026', () => {
      const { result } = renderHook(() => useElectionTimeline({ 
        stateCode: 'TX', 
        todayDateOverride: '2026-06-01' 
      }));

      // TX mailDeadline date is '2026-10-05'
      // June 1 to Oct 5 is exactly 126 days
      expect(result.current.daysToRegistrationDeadline).toBe(126);
      expect(result.current.registrationDeadlinePassed).toBe(false);
    });

    it('should indicate deadline is passed and show 0 days if today is after deadline', () => {
      const { result } = renderHook(() => useElectionTimeline({ 
        stateCode: 'CA', 
        todayDateOverride: '2026-10-25' 
      }));

      expect(result.current.daysToRegistrationDeadline).toBe(0);
      expect(result.current.registrationDeadlinePassed).toBe(true);
    });
  });

  describe('Voting Window Status Cycles', () => {
    it('should return "Registration Open" during the early registration cycle', () => {
      const { result } = renderHook(() => useElectionTimeline({ 
        stateCode: 'CA', 
        todayDateOverride: '2026-06-01' 
      }));
      expect(result.current.votingWindowStatus).toBe('Registration Open');
    });

    it('should return "Early Voting Open Now" when date falls inside early voting dates', () => {
      // CA early voting is 2026-10-05 to 2026-11-02
      const { result } = renderHook(() => useElectionTimeline({ 
        stateCode: 'CA', 
        todayDateOverride: '2026-10-15' 
      }));
      expect(result.current.votingWindowStatus).toBe('Early Voting Open Now');
    });

    it('should return "Registration Closed, Awaiting Early Voting" if registration passed but before early voting (for states where EV starts after reg)', () => {
      // TX registration deadline is 2026-10-05. Early voting starts 2026-10-19.
      const { result } = renderHook(() => useElectionTimeline({ 
        stateCode: 'TX', 
        todayDateOverride: '2026-10-10' 
      }));
      expect(result.current.votingWindowStatus).toBe('Registration Closed, Awaiting Early Voting');
    });

    it('should return "Election Day Today" on Election Day', () => {
      const { result } = renderHook(() => useElectionTimeline({ 
        stateCode: 'CA', 
        todayDateOverride: '2026-11-03' 
      }));
      expect(result.current.votingWindowStatus).toBe('Election Day Today');
    });

    it('should return "General Election Closed" after Election Day', () => {
      const { result } = renderHook(() => useElectionTimeline({ 
        stateCode: 'CA', 
        todayDateOverride: '2026-11-04' 
      }));
      expect(result.current.votingWindowStatus).toBe('General Election Closed');
    });
  });

  describe('Custom ID & State Compliance Checklists', () => {
    it('should generate TX checklist with strict Photo ID steps and precinct checks', () => {
      const { result } = renderHook(() => useElectionTimeline({ stateCode: 'TX' }));
      
      const checklist = result.current.complianceChecklist;
      
      // Strict Photo ID requirements
      const verifyPhotoIdStep = checklist.find(step => step.id === 'id-strict-verify');
      expect(verifyPhotoIdStep).toBeDefined();
      expect(verifyPhotoIdStep?.required).toBe(true);

      const backupDeclStep = checklist.find(step => step.id === 'id-backup-decl');
      expect(backupDeclStep).toBeDefined();
      expect(backupDeclStep?.required).toBe(false);

      // TX doesn't allow same-day, so it requires precinct verification
      const verifyPrecinctStep = checklist.find(step => step.id === 'verify-precinct');
      expect(verifyPrecinctStep).toBeDefined();
      expect(verifyPrecinctStep?.required).toBe(true);
    });

    it('should generate CA checklist with Signature verification steps and same-day conditional checks', () => {
      const { result } = renderHook(() => useElectionTimeline({ stateCode: 'CA' }));
      
      const checklist = result.current.complianceChecklist;

      // No document strictness, signature matching rules
      const signatureStep = checklist.find(step => step.id === 'id-signature-match');
      expect(signatureStep).toBeDefined();
      expect(signatureStep?.required).toBe(true);

      // CA allows same-day conditional registration
      const sameDayLocationStep = checklist.find(step => step.id === 'same-day-location');
      expect(sameDayLocationStep).toBeDefined();
      expect(sameDayLocationStep?.required).toBe(false);
    });
  });

});
