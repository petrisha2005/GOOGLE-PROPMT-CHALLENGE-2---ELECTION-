import { useMemo } from 'react';
import { StateElectionData, electionData } from '../data/electionData';

export interface ComplianceStep {
  id: string;
  title: string;
  description: string;
  type: 'id-check' | 'registration' | 'action';
  required: boolean;
}

export interface UseElectionTimelineResult {
  stateData: StateElectionData | null;
  resolvedStateCode: string | null;
  daysToRegistrationDeadline: number | null;
  registrationDeadlinePassed: boolean;
  votingWindowStatus: 'Registration Open' | 'Registration Closed, Awaiting Early Voting' | 'Early Voting Open Now' | 'Awaiting Election Day' | 'Election Day Today' | 'General Election Closed';
  complianceChecklist: ComplianceStep[];
  zipCodeResolved: boolean;
}

export function useElectionTimeline(input: {
  zipCode?: string;
  stateCode?: string;
  todayDateOverride?: string;
}): UseElectionTimelineResult {
  const { zipCode, stateCode, todayDateOverride } = input;

  // 1. Resolve State Code from direct input or Zip Code
  const resolvedResult = useMemo(() => {
    if (stateCode && electionData[stateCode.toUpperCase()]) {
      return { code: stateCode.toUpperCase(), resolvedByZip: false };
    }

    if (zipCode) {
      const cleanZip = zipCode.trim();
      if (/^\d{5}$/.test(cleanZip)) {
        const firstDigit = cleanZip.charAt(0);
        if (firstDigit === '9') {
          return { code: 'CA', resolvedByZip: true };
        } else if (firstDigit === '7') {
          return { code: 'TX', resolvedByZip: true };
        } else if (firstDigit === '1') {
          return { code: 'NY', resolvedByZip: true };
        }
      }
    }

    return { code: null, resolvedByZip: false };
  }, [stateCode, zipCode]);

  const activeStateCode = resolvedResult.code;
  const stateData = activeStateCode ? electionData[activeStateCode] : null;

  // 2. Parse Reference Evaluation Date (mockable for testing)
  const today = useMemo(() => {
    if (todayDateOverride) {
      return new Date(todayDateOverride);
    }
    // Default reference date matching the active cycle: June 1, 2026
    return new Date('2026-06-01');
  }, [todayDateOverride]);

  // Strip hours/minutes to get clean date comparisons in UTC to avoid local timezone off-by-one errors
  const todayClean = useMemo(() => {
    const d = new Date(today);
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }, [today]);

  // Helper to parse date strings strictly as UTC midnights
  const parseDateOnly = (dateStr: string) => {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return new Date(Date.UTC(year, month - 1, day));
  };

  // 3. Perform Timeline Calculations
  const timelineDetails = useMemo(() => {
    if (!stateData) {
      return {
        daysToDeadline: null,
        deadlinePassed: false,
        status: 'General Election Closed' as const,
      };
    }

    const regDeadline = parseDateOnly(stateData.voterRegistration.mailDeadline.date);
    const earlyStart = parseDateOnly(stateData.earlyVoting.startDate.date);
    const earlyEnd = parseDateOnly(stateData.earlyVoting.endDate.date);
    const electionDay = parseDateOnly(stateData.electionDay.date);

    // Calculate days to voter registration deadline
    const diffTime = regDeadline.getTime() - todayClean.getTime();
    const daysToDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const deadlinePassed = daysToDeadline < 0;

    // Determine current voting status phase
    let status: UseElectionTimelineResult['votingWindowStatus'] = 'Registration Open';

    if (todayClean.getTime() > electionDay.getTime()) {
      status = 'General Election Closed';
    } else if (todayClean.getTime() === electionDay.getTime()) {
      status = 'Election Day Today';
    } else if (todayClean.getTime() >= earlyStart.getTime() && todayClean.getTime() <= earlyEnd.getTime()) {
      status = 'Early Voting Open Now';
    } else if (todayClean.getTime() > earlyEnd.getTime() && todayClean.getTime() < electionDay.getTime()) {
      status = 'Awaiting Election Day';
    } else if (todayClean.getTime() > regDeadline.getTime() && todayClean.getTime() < earlyStart.getTime()) {
      status = 'Registration Closed, Awaiting Early Voting';
    } else {
      status = 'Registration Open';
    }

    return {
      daysToDeadline: deadlinePassed ? 0 : daysToDeadline,
      deadlinePassed,
      status,
    };
  }, [stateData, todayClean]);

  // 4. Generate Customized Compliance Checklist
  const complianceChecklist = useMemo<ComplianceStep[]>(() => {
    if (!stateData) return [];

    const steps: ComplianceStep[] = [];
    const isStrict = stateData.idRequirements.strictness.includes('Strict');

    // Registration step
    steps.push({
      id: 'reg-check',
      title: 'Submit Voter Registration',
      description: timelineDetails.deadlinePassed
        ? stateData.voterRegistration.sameDayAllowed
          ? 'Hard online deadline passed. You must register in-person at conditional voting hubs.'
          : 'Registration deadline has passed. Same-day registration is not supported.'
        : `Submit your registration before the ${stateData.voterRegistration.mailDeadline.displayDate} deadline.`,
      type: 'registration',
      required: true,
    });

    // ID requirements step
    if (isStrict) {
      steps.push({
        id: 'id-strict-verify',
        title: 'Verify Approved Photo ID',
        description: stateData.stateCode === 'IN'
          ? 'You must possess your EPIC Voter ID card or one of the 12 other approved photo identity documents (e.g. Aadhaar, Passport) to cast your vote.'
          : 'You must possess one of the approved photo IDs (e.g. Driver\'s License, Passport). Expired IDs are only accepted under limited conditions.',
        type: 'id-check',
        required: true,
      });
      steps.push({
        id: 'id-backup-decl',
        title: 'Prepare Backup Supporting Document',
        description: stateData.stateCode === 'IN'
          ? 'If you do not have your EPIC card, ensure you bring an approved photo ID matching your registered name on the Electoral Roll.'
          : 'If you lack a photo ID and cannot obtain one, print and carry an approved supporting ID (e.g. utility bill) and fill out a Reasonable Impediment Declaration.',
        type: 'id-check',
        required: false,
      });
    } else {
      steps.push({
        id: 'id-signature-match',
        title: 'Signature Verification Check',
        description: 'No document is required at the polls for most voters. Confirm your voting booth signature resembles your voter registration form.',
        type: 'id-check',
        required: true,
      });
      steps.push({
        id: 'id-first-time-backup',
        title: 'First-Time Voter Verification Backup',
        description: 'If you registered by mail without a driver\'s license or SSN, bring a photo ID or utility bill to the poll to satisfy federal HAVA compliance.',
        type: 'id-check',
        required: false,
      });
    }

    // Same day conditional steps
    if (stateData.voterRegistration.sameDayAllowed) {
      steps.push({
        id: 'same-day-location',
        title: 'Locate Conditional Same-Day Hubs',
        description: 'Ensure you know the designated locations in your county supporting conditional voter registration if registering after standard dates.',
        type: 'action',
        required: false,
      });
    } else {
      steps.push({
        id: 'verify-precinct',
        title: 'Verify Precinct Assignment',
        description: 'You must vote at your designated precinct. Verify your polling location using the official registrar portal beforehand.',
        type: 'action',
        required: true,
      });
    }

    return steps;
  }, [stateData, timelineDetails.deadlinePassed]);

  return {
    stateData,
    resolvedStateCode: activeStateCode,
    daysToRegistrationDeadline: timelineDetails.daysToDeadline,
    registrationDeadlinePassed: timelineDetails.deadlinePassed,
    votingWindowStatus: timelineDetails.status,
    complianceChecklist,
    zipCodeResolved: resolvedResult.resolvedByZip,
  };
}
