export interface MilestoneDate {
  date: string; // ISO format or representative date
  displayDate: string;
  description: string;
  status: 'upcoming' | 'current' | 'passed';
  notes?: string;
}

export interface VoterRegistrationMilestone {
  title: string;
  onlineDeadline?: MilestoneDate;
  mailDeadline: MilestoneDate;
  inPersonDeadline: MilestoneDate;
  sameDayAllowed: boolean;
  sameDayRules?: string;
  eligibilityRequirements: string[];
}

export interface MailInBallotMilestone {
  title: string;
  excuseRequired: boolean;
  excuseRules?: string;
  requestDeadline: MilestoneDate;
  returnDeadline: MilestoneDate;
  trackingAvailable: boolean;
  trackingLink?: string;
  submissionMethods: string[];
}

export interface EarlyVotingMilestone {
  title: string;
  available: boolean;
  startDate: MilestoneDate;
  endDate: MilestoneDate;
  weekendVoting: boolean;
  details: string;
}

export interface ElectionDayMilestone {
  title: string;
  date: string;
  displayDate: string;
  pollingHours: string;
  lookupLink: string;
  sameDayRegistration: boolean;
  importantReminders: string[];
}

export interface IDRequirement {
  strictness: 'Strict Photo ID' | 'Non-Strict ID' | 'No Document Required (Signature Match)';
  summary: string;
  acceptedPhotoIDs: string[];
  acceptedNonPhotoIDs: string[];
  firstTimeVoterRules: string;
  specialInstructions?: string;
}

export interface RegistrationStep {
  stepNumber: number;
  title: string;
  description: string;
  actionText: string;
  actionUrl: string;
}

export interface BallotCandidate {
  id: string;
  name: string;
  party: 'Democrat' | 'Republican' | 'Libertarian' | 'Green' | 'Independent' | 'Nonpartisan';
  bio: string;
  platform: string[];
  symbolName: string;
  symbolColor: string;
}

export interface BallotMeasure {
  id: string;
  title: string;
  type: 'Proposition' | 'Amendment' | 'Proposal' | 'Measure';
  summary: string;
  argumentsFor: string;
  argumentsAgainst: string;
}

export interface BallotOffice {
  id: string;
  title: string;
  description: string;
  candidates: BallotCandidate[];
}

export interface SampleBallot {
  district: string;
  offices: BallotOffice[];
  measures: BallotMeasure[];
}

export interface StateElectionData {
  stateName: string;
  stateCode: string;
  officialElectionSite: string;
  registrationStatusUrl: string;
  voterRegistration: VoterRegistrationMilestone;
  mailInBallot: MailInBallotMilestone;
  earlyVoting: EarlyVotingMilestone;
  electionDay: ElectionDayMilestone;
  idRequirements: IDRequirement;
  registrationSteps: RegistrationStep[];
  sampleBallot: SampleBallot;
}

export const electionData: Record<string, StateElectionData> = {
  CA: {
    stateName: 'California',
    stateCode: 'CA',
    officialElectionSite: 'https://www.sos.ca.gov/elections',
    registrationStatusUrl: 'https://voterstatus.sos.ca.gov',
    voterRegistration: {
      title: 'Voter Registration',
      sameDayAllowed: true,
      sameDayRules: 'Available at all polling places and county election offices as "Conditional Voter Registration". Same-day registrants vote on a provisional ballot that is counted after verification.',
      eligibilityRequirements: [
        'A United States citizen and a resident of California.',
        'At least 18 years old or older on Election Day.',
        'Not currently serving a state or federal prison term for the conviction of a felony.',
        'Not currently found mentally incompetent to vote by a court.'
      ],
      onlineDeadline: {
        date: '2026-10-19',
        displayDate: 'October 19, 2026',
        description: 'Online registration must be completed by 11:59 PM PDT.',
        status: 'upcoming',
        notes: 'Requires California driver\'s license/ID card and last 4 digits of SSN.'
      },
      mailDeadline: {
        date: '2026-10-19',
        displayDate: 'October 19, 2026',
        description: 'Voter registration applications must be postmarked by this date.',
        status: 'upcoming',
        notes: 'Forms available at post offices, libraries, and government offices.'
      },
      inPersonDeadline: {
        date: '2026-11-03',
        displayDate: 'November 3, 2026 (Election Day)',
        description: 'Same-day conditional registration is available in-person up to and including Election Day.',
        status: 'upcoming',
        notes: 'Can be completed at any vote center or county elections office.'
      }
    },
    mailInBallot: {
      title: 'Mail-in Voting (All-Mail State)',
      excuseRequired: false,
      excuseRules: 'California is a universal vote-by-mail state. Every active registered voter is automatically mailed a ballot starting 29 days before Election Day.',
      requestDeadline: {
        date: '2026-10-27',
        displayDate: 'October 27, 2026',
        description: 'Last day to request a replacement mail ballot or update your mailing address.',
        status: 'upcoming',
        notes: 'Not needed for standard delivery, as ballots are sent automatically to all active registered voters.'
      },
      returnDeadline: {
        date: '2026-11-03',
        displayDate: 'November 3, 2026',
        description: 'Must be postmarked on or before Election Day and received within 7 days, or returned in-person by 8:00 PM on Election Day.',
        status: 'upcoming',
        notes: 'No postage is required for returning your ballot by mail.'
      },
      trackingAvailable: true,
      trackingLink: 'https://california.ballottrax.net/voter/',
      submissionMethods: [
        'Prepaid postage return mail (must be postmarked by Election Day)',
        'Secure drop boxes (available starting 29 days before election)',
        'In-person at any vote center or county elections office'
      ]
    },
    earlyVoting: {
      title: 'Early Voting Windows',
      available: true,
      startDate: {
        date: '2026-10-05',
        displayDate: 'October 5, 2026',
        description: 'Early voting begins at the county elections office and select locations.',
        status: 'upcoming'
      },
      endDate: {
        date: '2026-11-02',
        displayDate: 'November 2, 2026',
        description: 'Early voting locations close the day before Election Day.',
        status: 'upcoming'
      },
      weekendVoting: true,
      details: 'Vote centers open progressively starting 10 days before Election Day, with all centers fully operational 4 days before. Weekend hours are standardized across counties (typically 9 AM to 5 PM).'
    },
    electionDay: {
      title: 'Election Day',
      date: '2026-11-03',
      displayDate: 'November 3, 2026',
      pollingHours: '7:00 AM - 8:00 PM PST',
      lookupLink: 'https://www.sos.ca.gov/elections/polling-place',
      sameDayRegistration: true,
      importantReminders: [
        'You have the right to vote if you are in line by 8:00 PM when polls close.',
        'Voters registered in California can vote at any vote center in their county.',
        'Same-day conditional registration is fully supported at all polling sites.'
      ]
    },
    idRequirements: {
      strictness: 'No Document Required (Signature Match)',
      summary: 'In California, most voters do not need to show an ID when voting in person because the state relies on signature matching against your voter registration file.',
      acceptedPhotoIDs: [
        'Not generally required. However, having a CA Driver\'s License or State ID is helpful if registration issues arise.'
      ],
      acceptedNonPhotoIDs: [
        'Not generally required.'
      ],
      firstTimeVoterRules: 'If you registered to vote by mail and did not provide your driver\'s license number or SSN, you may be asked to show identification the first time you vote. Accepted forms include a utility bill, student ID, bank statement, or passport.',
      specialInstructions: 'If asked for ID and you do not have one, you have the right to cast a provisional ballot.'
    },
    registrationSteps: [
      {
        stepNumber: 1,
        title: 'Check Eligibility',
        description: 'Confirm you are a US citizen, CA resident, and will be at least 18 by Election Day.',
        actionText: 'Read CA Eligibility Guidelines',
        actionUrl: 'https://www.sos.ca.gov/elections/voting-resources/voter-registration-card'
      },
      {
        stepNumber: 2,
        title: 'Submit Application',
        description: 'Register online in minutes using your CA Driver\'s License/State ID and last 4 digits of SSN.',
        actionText: 'Register to Vote Online',
        actionUrl: 'https://registertovote.ca.gov'
      },
      {
        stepNumber: 3,
        title: 'Verify Status & Sign Up for Tracking',
        description: 'Confirm your voter registration status and sign up for "Where\'s My Ballot" tracking notifications.',
        actionText: 'Verify Voter Status',
        actionUrl: 'https://voterstatus.sos.ca.gov'
      }
    ],
    sampleBallot: {
      district: 'Statewide & District 11 Preview',
      offices: [
        {
          id: 'pres',
          title: 'President and Vice President',
          description: 'The highest executive office in the United States, serving a 4-year term.',
          candidates: [
            {
              id: 'ca-pres-dem',
              name: 'Kamala Harris / Tim Walz',
              party: 'Democrat',
              bio: 'Current Vice President of the US and former Senator from California. Walz is the Governor of Minnesota.',
              platform: [
                'Protect reproductive freedom and voting rights.',
                'Expand middle-class tax credits and lower healthcare costs.',
                'Invest in green energy and combat climate change.'
              ],
              symbolName: 'Sun',
              symbolColor: 'amber'
            },
            {
              id: 'ca-pres-rep',
              name: 'Donald Trump / JD Vance',
              party: 'Republican',
              bio: '45th President of the United States and businessman. Vance is a US Senator representing Ohio.',
              platform: [
                'Secure the southern border and reform immigration systems.',
                'Implement tariffs to protect domestic manufacturing.',
                'Unleash American energy production to combat inflation.'
              ],
              symbolName: 'Mountain',
              symbolColor: 'sky'
            },
            {
              id: 'ca-pres-grn',
              name: 'Jill Stein / Rudolph Ware',
              party: 'Green',
              bio: 'Physician and long-time environmental activist. Ware is a professor and writer.',
              platform: [
                'Implement a comprehensive Green New Deal.',
                'Enact a single-payer Medicare-for-All healthcare system.',
                'Forgive all student loan and medical debt.'
              ],
              symbolName: 'Tree',
              symbolColor: 'emerald'
            }
          ]
        },
        {
          id: 'senate',
          title: 'United States Senator',
          description: 'Representing all Californians in the US Senate, crafting federal legislation.',
          candidates: [
            {
              id: 'ca-sen-dem',
              name: 'Adam Schiff',
              party: 'Democrat',
              bio: 'U.S. Representative from California\'s 30th district and former prosecutor.',
              platform: [
                'Protect democratic institutions and voting rights.',
                'Address the California housing and homelessness crisis.',
                'Expand access to affordable mental healthcare.'
              ],
              symbolName: 'Crown',
              symbolColor: 'purple'
            },
            {
              id: 'ca-sen-rep',
              name: 'Steve Garvey',
              party: 'Republican',
              bio: 'Former professional baseball player and California businessman.',
              platform: [
                'Tackle inflation and reduce federal spending.',
                'Support law enforcement and address public safety concerns.',
                'Secure water infrastructure for California agriculture.'
              ],
              symbolName: 'Star',
              symbolColor: 'orange'
            }
          ]
        }
      ],
      measures: [
        {
          id: 'prop-36',
          title: 'Proposition 36: Increase Drug and Theft Penalties',
          type: 'Proposition',
          summary: 'Allows felony charges and increased prison sentences for certain drug possession and thefts under $950 for individuals with two prior drug or theft convictions.',
          argumentsFor: 'Holds repeat offenders accountable, provides court-mandated drug treatment incentives, and helps restore public safety in retail communities.',
          argumentsAgainst: 'Will dramatically increase state prison costs, reverse successful reforms, and criminalize drug addiction rather than funding local rehabilitation.'
        },
        {
          id: 'prop-3',
          title: 'Proposition 3: Right to Marry Constitutional Amendment',
          type: 'Proposition',
          summary: 'Amends the California Constitution to establish that marriage is a fundamental right, removing outdated language defining marriage as only between a man and a woman.',
          argumentsFor: 'Protects equal rights and marriage equality for LGBTQ+ individuals against potential future federal rollbacks.',
          argumentsAgainst: 'Redundant measure that is unnecessary under current federal protections and alters traditional definitions of family.'
        }
      ]
    }
  },
  TX: {
    stateName: 'Texas',
    stateCode: 'TX',
    officialElectionSite: 'https://www.votetexas.gov',
    registrationStatusUrl: 'https://teamrv-mvp.sos.texas.gov/MVP/mvp.do',
    voterRegistration: {
      title: 'Voter Registration',
      sameDayAllowed: false,
      eligibilityRequirements: [
        'A United States citizen and a resident of the Texas county in which you register.',
        'At least 17 years and 10 months old to register, and 18 years of age on Election Day.',
        'Not a convicted felon (unless sentence is fully completed, including parole/probation).',
        'Not determined by a final judgment of a court exercising probate jurisdiction to be totally mentally incapacitated.'
      ],
      mailDeadline: {
        date: '2026-10-05',
        displayDate: 'October 5, 2026',
        description: 'Voter registration applications must be postmarked or hand-delivered to the county registrar by this date.',
        status: 'upcoming',
        notes: 'Texas does NOT support fully online voter registration. You must print, sign, and mail your application.'
      },
      inPersonDeadline: {
        date: '2026-10-05',
        displayDate: 'October 5, 2026',
        description: 'In-person applications must be completed at the county registrar\'s office by the close of business.',
        status: 'upcoming',
        notes: 'Same-day voter registration is NOT available in Texas.'
      }
    },
    mailInBallot: {
      title: 'Voting by Mail (Excuse Required)',
      excuseRequired: true,
      excuseRules: 'To vote by mail in Texas, you must meet one of the following excuses: 65 years or older; disabled or sick; expected to give birth within three weeks of Election Day; out of the county during the entire voting period; or confined in jail but otherwise eligible.',
      requestDeadline: {
        date: '2026-10-23',
        displayDate: 'October 23, 2026',
        description: 'The application to vote by mail (ABBM) must be RECEIVED (not postmarked) by the early voting clerk by the close of business.',
        status: 'upcoming',
        notes: 'Include your Texas Driver\'s License number or last 4 digits of SSN to prevent delays.'
      },
      returnDeadline: {
        date: '2026-11-03',
        displayDate: 'November 3, 2026',
        description: 'Must be postmarked by 7:00 PM on Election Day and received by 5:00 PM on November 4 (next business day).',
        status: 'upcoming',
        notes: 'Must be returned in the official envelope, signed, with required ID numbers filled out.'
      },
      trackingAvailable: true,
      trackingLink: 'https://votetexas.gov/voting-by-mail/tracker.html',
      submissionMethods: [
        'US Postal Service or approved commercial carriers',
        'In-person hand delivery to the early voting clerk\'s office ONLY on Election Day while polls are open (requires showing acceptable photo ID)'
      ]
    },
    earlyVoting: {
      title: 'Early Voting Windows',
      available: true,
      startDate: {
        date: '2026-10-19',
        displayDate: 'October 19, 2026',
        description: 'In-person early voting begins across all Texas counties.',
        status: 'upcoming'
      },
      endDate: {
        date: '2026-10-30',
        displayDate: 'October 30, 2026',
        description: 'In-person early voting closes.',
        status: 'upcoming'
      },
      weekendVoting: true,
      details: 'All counties are required to offer early voting on Saturdays and Sundays during the early voting period. Polling hours vary by county, but larger counties usually operate 7 AM to 7 PM.'
    },
    electionDay: {
      title: 'Election Day',
      date: '2026-11-03',
      displayDate: 'November 3, 2026',
      pollingHours: '7:00 AM - 7:00 PM CST',
      lookupLink: 'https://teamrv-mvp.sos.texas.gov/MVP/mvp.do',
      sameDayRegistration: false,
      importantReminders: [
        'You have the right to vote if you are in line by 7:00 PM when polls close.',
        'You must vote in your designated precinct unless your county participates in the Countywide Polling Place Program.',
        'Strict photo identification is required at all Texas polling stations.'
      ]
    },
    idRequirements: {
      strictness: 'Strict Photo ID',
      summary: 'Texas requires all voters to present one of the seven approved photo IDs at the polls. The ID must be current or, for voters aged 18-69, expired no more than four years. Voters aged 70 or older can use any expired approved ID regardless of expiration date.',
      acceptedPhotoIDs: [
        'Texas Driver\'s License issued by DPS',
        'Texas Election Identification Certificate issued by DPS',
        'Texas Personal Identification Card issued by DPS',
        'Texas Handgun License issued by DPS',
        'United States Military Identification Card containing your photograph',
        'United States Citizenship Certificate containing your photograph',
        'United States Passport (book or card)'
      ],
      acceptedNonPhotoIDs: [
        'Supporting documents (only accepted if you cannot reasonably obtain one of the photo IDs listed above and you complete a "Reasonable Impediment Declaration"):',
        'Government document showing your name and address (including your voter registration certificate)',
        'Current utility bill',
        'Bank statement',
        'Government check',
        'Paycheck',
        'Certified domestic birth certificate'
      ],
      firstTimeVoterRules: 'First-time voters who registered by mail without providing a driver\'s license or SSN must present acceptable identification. In Texas, the strict photo ID list still takes priority.',
      specialInstructions: 'If you do not possess an approved photo ID and cannot reasonably obtain one, you must fill out the "Reasonable Impediment Declaration" and present a supporting document (such as a utility bill) to vote a regular ballot.'
    },
    registrationSteps: [
      {
        stepNumber: 1,
        title: 'Obtain Application Form',
        description: 'Since Texas has no online registration, download and print the form or request one by mail.',
        actionText: 'Download TX Voter Registration Form',
        actionUrl: 'https://www.sos.state.tx.us/elections/voter/reqvr.shtml'
      },
      {
        stepNumber: 2,
        title: 'Fill, Sign, and Mail Form',
        description: 'Complete the form and mail it to your local County Voter Registrar. It must be postmarked 30 days before the election.',
        actionText: 'Find County Registrar Address',
        actionUrl: 'https://www.sos.state.tx.us/elections/voter/votregduties.shtml'
      },
      {
        stepNumber: 3,
        title: 'Check Your Registration Status',
        description: 'Allow 2-3 weeks for processing, then check the Texas portal to confirm your status and find your precinct.',
        actionText: 'Check Texas Voter Portal',
        actionUrl: 'https://teamrv-mvp.sos.texas.gov/MVP/mvp.do'
      }
    ],
    sampleBallot: {
      district: 'Travis County Precinct 102 Preview',
      offices: [
        {
          id: 'pres',
          title: 'President and Vice President',
          description: 'The highest executive office in the United States, serving a 4-year term.',
          candidates: [
            {
              id: 'tx-pres-rep',
              name: 'Donald Trump / JD Vance',
              party: 'Republican',
              bio: '45th President of the United States. Vance is a US Senator representing Ohio.',
              platform: [
                'Secure the southern border and reform immigration systems.',
                'Implement tariffs to protect domestic manufacturing.',
                'Unleash American energy production to combat inflation.'
              ],
              symbolName: 'Mountain',
              symbolColor: 'sky'
            },
            {
              id: 'tx-pres-dem',
              name: 'Kamala Harris / Tim Walz',
              party: 'Democrat',
              bio: 'Current Vice President of the US. Walz is the Governor of Minnesota.',
              platform: [
                'Protect reproductive freedom and voting rights.',
                'Expand middle-class tax credits and lower healthcare costs.',
                'Invest in green energy and combat climate change.'
              ],
              symbolName: 'Sun',
              symbolColor: 'amber'
            },
            {
              id: 'tx-pres-lib',
              name: 'Chase Oliver / Mike ter Maat',
              party: 'Libertarian',
              bio: 'Political activist and former HR professional. Ter Maat is a former economist.',
              platform: [
                'Drastically reduce federal spending and abolish the income tax.',
                'End civil asset forfeiture and reform criminal justice.',
                'Support free trade and open immigration pathways.'
              ],
              symbolName: 'Anchor',
              symbolColor: 'indigo'
            }
          ]
        },
        {
          id: 'senate',
          title: 'United States Senator',
          description: 'Representing all Texans in the US Senate, crafting federal legislation.',
          candidates: [
            {
              id: 'tx-sen-rep',
              name: 'Ted Cruz',
              party: 'Republican',
              bio: 'Incumbent U.S. Senator representing Texas since 2013 and former Texas Solicitor General.',
              platform: [
                'Promote economic growth through deregulation and tax cuts.',
                'Defend Second Amendment rights and constitutional liberties.',
                'Secure border infrastructure and support law enforcement.'
              ],
              symbolName: 'Star',
              symbolColor: 'orange'
            },
            {
              id: 'tx-sen-dem',
              name: 'Colin Allred',
              party: 'Democrat',
              bio: 'U.S. Representative representing Texas\'s 32nd district and former NFL linebacker.',
              platform: [
                'Protect healthcare access and lower prescription drug prices.',
                'Invest in Texas infrastructure and job creation.',
                'Restore women\'s reproductive rights and freedom.'
              ],
              symbolName: 'Crown',
              symbolColor: 'purple'
            }
          ]
        }
      ],
      measures: [
        {
          id: 'tx-prop-1',
          title: 'State Proposition 1: Protect Right to Farm',
          type: 'Amendment',
          summary: 'Amends the Texas Constitution to protect the right of individuals and families to engage in generally accepted agricultural practices on their own land.',
          argumentsFor: 'Shields farmers and ranchers from municipal overregulation, securing Texas food production systems.',
          argumentsAgainst: 'Could strip local cities of their ability to enforce safety, noise, or environmental health standards on agricultural land within city limits.'
        }
      ]
    }
  },
  NY: {
    stateName: 'New York',
    stateCode: 'NY',
    officialElectionSite: 'https://www.elections.ny.gov',
    registrationStatusUrl: 'https://voterlookup.elections.ny.gov',
    voterRegistration: {
      title: 'Voter Registration',
      sameDayAllowed: false,
      eligibilityRequirements: [
        'A United States citizen and a resident of New York State and your county for at least 30 days before the election.',
        'At least 18 years old on or before the Election Day (you can pre-register at 16 or 17).',
        'Not currently incarcerated for a felony conviction.',
        'Not currently judged mentally incompetent by a court.'
      ],
      onlineDeadline: {
        date: '2026-10-24',
        displayDate: 'October 24, 2026',
        description: 'Online registration applications must be submitted by this date (10 days before election).',
        status: 'upcoming',
        notes: 'Can register through the DMV website if you possess a NY DMV ID.'
      },
      mailDeadline: {
        date: '2026-10-24',
        displayDate: 'October 24, 2026',
        description: 'Voter registration applications must be received by your county board of elections by this date.',
        status: 'upcoming',
        notes: 'Forms postmarked earlier must arrive by October 24.'
      },
      inPersonDeadline: {
        date: '2026-10-24',
        displayDate: 'October 24, 2026',
        description: 'Must register in person at your county board of elections by this date.',
        status: 'upcoming',
        notes: 'Same-day registration is NOT available on Election Day in New York.'
      }
    },
    mailInBallot: {
      title: 'Mail-in Voting (Early Mail & Absentee)',
      excuseRequired: false,
      excuseRules: 'New York now offers "Early Mail Voting" which allows ALL registered voters to vote by mail without an excuse. Traditional Absentee Voting remains available for voters who are out of county or ill.',
      requestDeadline: {
        date: '2026-10-24',
        displayDate: 'October 24, 2026',
        description: 'Last day to apply online, by fax, or by mail for an early mail or absentee ballot.',
        status: 'upcoming',
        notes: 'Applications in person can be submitted up until November 2 (day before election).'
      },
      returnDeadline: {
        date: '2026-11-03',
        displayDate: 'November 3, 2026',
        description: 'Must be postmarked by Election Day and received by November 10 (7 days after), or delivered in person by 9:00 PM on Election Day.',
        status: 'upcoming',
        notes: 'Can be dropped off at any early voting or Election Day polling site in your county.'
      },
      trackingAvailable: true,
      trackingLink: 'https://nysballot.elections.ny.gov',
      submissionMethods: [
        'Mailed via USPS (prepaid postage included)',
        'Dropped in a ballot box at any county board of elections office',
        'Dropped off at any early voting or Election Day polling site in your county'
      ]
    },
    earlyVoting: {
      title: 'Early Voting Windows',
      available: true,
      startDate: {
        date: '2026-10-24',
        displayDate: 'October 24, 2026',
        description: '9-day early voting window opens.',
        status: 'upcoming'
      },
      endDate: {
        date: '2026-11-01',
        displayDate: 'November 1, 2026',
        description: 'Early voting window closes (two days before Election Day).',
        status: 'upcoming'
      },
      weekendVoting: true,
      details: 'All counties must offer at least 8 hours of early voting daily, including weekends. Hours vary widely by county and day (some days feature extended evening hours up to 8 PM).'
    },
    electionDay: {
      title: 'Election Day',
      date: '2026-11-03',
      displayDate: 'November 3, 2026',
      pollingHours: '6:00 AM - 9:00 PM EST',
      lookupLink: 'https://voterlookup.elections.ny.gov',
      sameDayRegistration: false,
      importantReminders: [
        'You have the right to vote if you are in line by 9:00 PM when polls close.',
        'You must vote at your designated polling site based on your current home address.',
        'If you cast an early mail ballot, you cannot vote on a voting machine on Election Day (provisional/affidavit ballot only).'
      ]
    },
    idRequirements: {
      strictness: 'No Document Required (Signature Match)',
      summary: 'In New York, you do not need to show identification to vote in person if your signature matches the one on file from your registration.',
      acceptedPhotoIDs: [
        'Not generally required. Standard photo IDs like NY Driver\'s License or Passport are useful if signatures do not match.'
      ],
      acceptedNonPhotoIDs: [
        'Not generally required.'
      ],
      firstTimeVoterRules: 'If you are a first-time voter who registered by mail and did not provide your driver\'s license number or SSN, you must show ID. Accepted IDs include a driver\'s license, passport, student ID, utility bill, bank statement, or government check.',
      specialInstructions: 'If your identity cannot be verified, you are entitled to vote using an affidavit (provisional) ballot.'
    },
    registrationSteps: [
      {
        stepNumber: 1,
        title: 'Confirm Eligibility',
        description: 'Verify you are a US citizen, NY resident, and will be 18 by Election Day.',
        actionText: 'Review NY Registration Guide',
        actionUrl: 'https://www.elections.ny.gov/VoterRegistration.html'
      },
      {
        stepNumber: 2,
        title: 'Submit Application Online',
        description: 'Register online via the New York DMV portal or the new NY Board of Elections portal.',
        actionText: 'Register on NY DMV Portal',
        actionUrl: 'https://dmv.ny.gov/more-info/register-vote'
      },
      {
        stepNumber: 3,
        title: 'Locate Your Polling Site',
        description: 'Search the NY voter lookup tool to confirm your active status and designated early voting or Election Day sites.',
        actionText: 'Find Your Polling Site',
        actionUrl: 'https://voterlookup.elections.ny.gov'
      }
    ],
    sampleBallot: {
      district: 'New York County Precinct 045 Preview',
      offices: [
        {
          id: 'pres',
          title: 'President and Vice President',
          description: 'The highest executive office in the United States, serving a 4-year term.',
          candidates: [
            {
              id: 'ny-pres-dem',
              name: 'Kamala Harris / Tim Walz',
              party: 'Democrat',
              bio: 'Current Vice President of the US. Walz is the Governor of Minnesota.',
              platform: [
                'Protect reproductive freedom and voting rights.',
                'Expand middle-class tax credits and lower healthcare costs.',
                'Invest in green energy and combat climate change.'
              ],
              symbolName: 'Sun',
              symbolColor: 'amber'
            },
            {
              id: 'ny-pres-rep',
              name: 'Donald Trump / JD Vance',
              party: 'Republican',
              bio: '45th President of the United States. Vance is a US Senator representing Ohio.',
              platform: [
                'Secure the southern border and reform immigration systems.',
                'Implement tariffs to protect domestic manufacturing.',
                'Unleash American energy production to combat inflation.'
              ],
              symbolName: 'Mountain',
              symbolColor: 'sky'
            },
            {
              id: 'ny-pres-grn',
              name: 'Jill Stein / Rudolph Ware',
              party: 'Green',
              bio: 'Physician and environmental activist. Ware is a professor.',
              platform: [
                'Implement a comprehensive Green New Deal.',
                'Enact a single-payer Medicare-for-All healthcare system.',
                'Forgive all student loan and medical debt.'
              ],
              symbolName: 'Tree',
              symbolColor: 'emerald'
            }
          ]
        },
        {
          id: 'senate',
          title: 'United States Senator',
          description: 'Representing all New Yorkers in the US Senate, crafting federal legislation.',
          candidates: [
            {
              id: 'ny-sen-dem',
              name: 'Kirsten Gillibrand',
              party: 'Democrat',
              bio: 'Incumbent U.S. Senator representing New York since 2009 and champion of paid family leave.',
              platform: [
                'Pass federal paid family and medical leave legislation.',
                'Lower prescription drug costs and expand Medicare access.',
                'Support New York infrastructure funding and clean tech jobs.'
              ],
              symbolName: 'Crown',
              symbolColor: 'purple'
            },
            {
              id: 'ny-sen-rep',
              name: 'Mike Sapraicone',
              party: 'Republican',
              bio: 'Former New York Police Department (NYPD) detective and security business founder.',
              platform: [
                'Support law enforcement and reverse bail reform policies.',
                'Promote fiscal responsibility and lower state/federal taxes.',
                'Enhance border security measures and combat drug trafficking.'
              ],
              symbolName: 'Star',
              symbolColor: 'orange'
            }
          ]
        }
      ],
      measures: [
        {
          id: 'ny-prop-1',
          title: 'Proposal 1: Equal Rights Amendment',
          type: 'Amendment',
          summary: 'Amends the State Constitution to add protections against discrimination based on ethnicity, national origin, age, disability, and sex, including sexual orientation, gender identity, and reproductive healthcare.',
          argumentsFor: 'Enshrines abortion rights and LGBTQ+ protections firmly within the New York State Constitution, making them immune to shifting political majorities.',
          argumentsAgainst: 'Broadly worded language could create legal ambiguities surrounding parental rights, girls\' sports categories, and religious exemptions.'
        }
      ]
    }
  },
  IN: {
    stateName: 'India',
    stateCode: 'IN',
    officialElectionSite: 'https://eci.gov.in',
    registrationStatusUrl: 'https://voters.eci.gov.in',
    voterRegistration: {
      title: 'Voter Registration (Form 6)',
      sameDayAllowed: false,
      eligibilityRequirements: [
        'Must be a citizen of India.',
        'Must be at least 18 years of age or older on the qualifying date.',
        'Must be an ordinary resident of the polling area of the constituency.',
        'Must not be disqualified under the Representation of the People Act.'
      ],
      onlineDeadline: {
        date: '2026-10-20',
        displayDate: 'October 20, 2026',
        description: 'Online Form 6 registration must be completed on the ECI Voters Service Portal or Voter Helpline App by 11:59 PM IST.',
        status: 'upcoming',
        notes: 'Requires uploading a recent passport photo, address proof, and age proof.'
      },
      mailDeadline: {
        date: '2026-10-15',
        displayDate: 'October 15, 2026',
        description: 'Physical Form 6 applications must be received by your local Electoral Registration Officer (ERO) or Booth Level Officer (BLO) by this date.',
        status: 'upcoming',
        notes: 'Forms can be collected and submitted directly at local polling offices or school venues.'
      },
      inPersonDeadline: {
        date: '2026-10-15',
        displayDate: 'October 15, 2026',
        description: 'Physical Form 6 applications must be submitted in person at local designated centers by the close of business.',
        status: 'upcoming',
        notes: 'BLO facilitation camps are usually conducted on weekends near this date.'
      }
    },
    mailInBallot: {
      title: 'Postal Ballot (Form 12D)',
      excuseRequired: true,
      excuseRules: 'Postal ballots are restricted in India. Senior citizens aged 80+, persons with disabilities (40%+ benchmark), essential services staff, or military personnel on duty must submit Form 12D to request a postal ballot.',
      requestDeadline: {
        date: '2026-10-10',
        displayDate: 'October 10, 2026',
        description: 'Form 12D application to request a postal ballot must be received by the Returning Officer (RO) of your constituency.',
        status: 'upcoming',
        notes: 'Polling teams will visit registered senior/disabled voters directly at home to collect completed ballots.'
      },
      returnDeadline: {
        date: '2026-11-03',
        displayDate: 'November 3, 2026',
        description: 'Postal ballots must reach the Returning Officer before 8:00 AM on the official constituency counting day.',
        status: 'upcoming',
        notes: 'Must be returned in the official pre-addressed envelope using Speed Post.'
      },
      trackingAvailable: true,
      trackingLink: 'https://voters.eci.gov.in',
      submissionMethods: [
        'Returned via designated speed post or postal service',
        'Direct deposit at the constituency Returning Officer facilitation center'
      ]
    },
    earlyVoting: {
      title: 'Early Facilitation Centers',
      available: false,
      startDate: {
        date: '2026-10-25',
        displayDate: 'October 25, 2026',
        description: 'Early facilitation centers open only for polling officials and essential staff.',
        status: 'upcoming'
      },
      endDate: {
        date: '2026-11-01',
        displayDate: 'November 1, 2026',
        description: 'Facilitation centers close prior to Polling Day.',
        status: 'upcoming'
      },
      weekendVoting: false,
      details: 'Early in-person voting is NOT available for the general public in India. All citizens must vote in person at their assigned local polling booth on the designated Polling Day phase.'
    },
    electionDay: {
      title: 'Polling Day',
      date: '2026-11-03',
      displayDate: 'November 3, 2026',
      pollingHours: '7:00 AM - 6:00 PM IST',
      lookupLink: 'https://electoralsearch.eci.gov.in',
      sameDayRegistration: false,
      importantReminders: [
        'You have the right to vote if you are inside the polling booth area by 6:00 PM when the gates close.',
        'You must get your left forefinger marked with indelible ink by the first polling officer.',
        'Ensure that the VVPAT machine displays a printed slip of your choice for 7 seconds after pressing the blue EVM button.'
      ]
    },
    idRequirements: {
      strictness: 'Strict Photo ID',
      summary: 'To cast a vote, your name MUST be in the official Electoral Roll. You must present your Voter ID card (EPIC). If you do not have it, you can present one of the 12 approved photo identities allowed by the Election Commission of India.',
      acceptedPhotoIDs: [
        'EPIC Card (Voter ID Card)',
        'Aadhaar Card',
        'PAN Card',
        'Indian Passport',
        'Driving License',
        'MNREGA Job Card',
        'Passbook with photograph issued by Bank/Post Office'
      ],
      acceptedNonPhotoIDs: [
        'Non-photo IDs are strictly NOT accepted. Physical photo identity verification is mandatory at all polling booths.'
      ],
      firstTimeVoterRules: 'Verify that your Form 6 has been processed and your name is searchable on electoralsearch.eci.gov.in. Bring your physical Voter ID card or Aadhaar card to the booth.',
      specialInstructions: 'If you have a Voter ID card but your name is NOT on the Electoral Roll, you will not be allowed to vote. Always check your name on the list before Polling Day!'
    },
    registrationSteps: [
      {
        stepNumber: 1,
        title: 'Submit Form 6 Registration',
        description: 'Register as a new voter online via the Voters Service Portal or submit physical Form 6 to your Booth Level Officer.',
        actionText: 'Register Online (Form 6)',
        actionUrl: 'https://voters.eci.gov.in'
      },
      {
        stepNumber: 2,
        title: 'Verify Name in Electoral Roll',
        description: 'Verify that your name is active on the official Indian Electoral Roll database before Polling Day.',
        actionText: 'Search Name in Voter List',
        actionUrl: 'https://electoralsearch.eci.gov.in'
      },
      {
        stepNumber: 3,
        title: 'Locate Polling Booth',
        description: 'Locate your designated assembly constituency polling station and find your booth slip details.',
        actionText: 'Find Polling Booth Address',
        actionUrl: 'https://electoralsearch.eci.gov.in'
      },
      {
        stepNumber: 4,
        title: 'Cast Vote with Indelible Ink',
        description: 'Arrive at the booth, verify your photo ID, get marked with indelible ink, and press your choice on the EVM.',
        actionText: 'View ECI EVM Voting Procedures',
        actionUrl: 'https://eci.gov.in'
      }
    ],
    sampleBallot: {
      district: 'New Delhi Parliamentary Constituency Preview',
      offices: [
        {
          id: 'parliament',
          title: 'Member of Parliament (Lok Sabha)',
          description: 'Representing your constituency in the lower house of the Indian Parliament.',
          candidates: [
            {
              id: 'in-parl-mango',
              name: 'Rajesh Kumar',
              party: 'Independent',
              bio: 'Experienced social worker and farmer advocating for agricultural reforms and rural education.',
              platform: [
                'Increase solar power subsidies for local farmers.',
                'Build modern secondary schools in all villages.',
                'Improve drinking water pipe networks in Nagar.'
              ],
              symbolName: 'Mango',
              symbolColor: 'yellow'
            },
            {
              id: 'in-parl-umbrella',
              name: 'Priya Sharma',
              party: 'Nonpartisan',
              bio: 'Environmental engineer advocating for sustainable cities and clean urban drainages.',
              platform: [
                'Build rainwater harvesting tanks in all public parks.',
                'Reduce air pollution by deploying electric bus fleets.',
                'Implement strict plastic recycling mandates.'
              ],
              symbolName: 'Umbrella',
              symbolColor: 'pink'
            },
            {
              id: 'in-parl-bicycle',
              name: 'Amit Patel',
              party: 'Libertarian',
              bio: 'Passionate youth leader championing physical health, cycle lanes, and community fitness centers.',
              platform: [
                'Construct safe green cycle lanes across the constituency.',
                'Fund state-of-the-art open gymnasiums in residential zones.',
                'Establish local citizen-led sports tournaments.'
              ],
              symbolName: 'Bicycle',
              symbolColor: 'teal'
            },
            {
              id: 'in-parl-sun',
              name: 'Dr. Sunita Rao',
              party: 'Green',
              bio: 'Medical expert and public health reformer prioritizing rural healthcare access.',
              platform: [
                'Set up 24/7 free diagnostic clinics in underserved neighborhoods.',
                'Subsidize essential medications for senior citizens.',
                'Expand mental health support lines across schools.'
              ],
              symbolName: 'Sun',
              symbolColor: 'amber'
            }
          ]
        }
      ],
measures: []
    }
  }
};

export interface GlobalElectionStep {
  id: string;
  stepIndex: number;
  titleEN: string;
  titleHI: string;
  prompt: string;
  promptHI: string;
  options: string[];
  correctIndex: number;
  audioNarration: string;
  audioHI: string;
  iconName: string;
}

export interface GlobalElectionTrack {
  trackId: string;
  trackNameEN: string;
  trackNameHI: string;
  theme: string;
  descriptionEN: string;
  descriptionHI: string;
  steps: GlobalElectionStep[];
}

// Backward compatibility interfaces extending the new types
export interface JourneyStage extends GlobalElectionStep {
  stageNum: number;
  promptEN: string;
  promptHI: string;
  audioEN: string;
  audioHI: string;
}

export interface JourneyTrack extends GlobalElectionTrack {
  stages: JourneyStage[];
}

export const globalElectionTracks: Record<string, GlobalElectionTrack> = {
  'india_evm': {
    trackId: 'india_evm',
    trackNameEN: 'India (EVM Voting)',
    trackNameHI: 'भारत (ईवीएम मतदान)',
    theme: 'Visual EVM & Symbol Model',
    descriptionEN: 'Step-by-step ECI practice journey covering Form 6, Electoral Roll, EPIC, Booth Locator, and EVM.',
    descriptionHI: 'फॉर्म ६, मतदाता सूची, वोटर आईडी, बूथ लोकेटर और ईवीएम को कवर करने वाली चरण-दर-चरण मार्गदर्शिका।',
    steps: [
      {
        id: 'start-18',
        stepIndex: 0,
        titleEN: 'Start (18 Years Old)',
        titleHI: 'शुरुआत (१८ वर्ष की आयु)',
        prompt: 'You are 18 years old and want to vote for the first time. What is your very first step?',
        promptHI: 'आप १८ वर्ष के हैं और पहली बार मतदान करना चाहते हैं। आपका सबसे पहला कदम क्या है?',
        iconName: 'Sparkles',
        audioNarration: 'Welcome to your voting journey! You are eighteen and ready to make a difference. To begin, you must make sure you are registered. What should you do first?',
        audioHI: 'आपकी चुनावी यात्रा में आपका स्वागत है! आप अठारह वर्ष के हैं और बदलाव लाने के लिए तैयार हैं। शुरू करने के लिए, आपको यह सुनिश्चित करना होगा कि आप पंजीकृत हैं। आपको सबसे पहले क्या करना चाहिए?',
        options: [
          'Go straight to the polling booth on election day',
          'Check the Voter List and register using Form 6'
        ],
        correctIndex: 1
      },
      {
        id: 'registration-form6',
        stepIndex: 1,
        titleEN: 'Registration (Form 6 Check)',
        titleHI: 'पंजीकरण (फॉर्म ६ जांच)',
        prompt: 'Great job! You filled out Form 6. Now, how do you verify your registration is successful?',
        promptHI: 'बहुत बढ़िया! आपने फॉर्म ६ भर दिया है। अब, आप कैसे सत्यापित करेंगे कि आपका पंजीकरण सफल रहा?',
        iconName: 'FileText',
        audioNarration: 'Fantastic choice. Your Form 6 is submitted. Now, look up your name in the official Electoral Roll to verify you are a registered voter.',
        audioHI: 'शानदार विकल्प। आपका फॉर्म ६ जमा हो गया है। अब, यह सत्यापित करने के लिए कि आप एक पंजीकृत मतदाता हैं, आधिकारिक मतदाता सूची में अपना नाम देखें।',
        options: [
          'Check your name in the official Electoral Roll online',
          'Wait for a letter in the mail'
        ],
        correctIndex: 0
      },
      {
        id: 'voter-id-verification',
        stepIndex: 2,
        titleEN: 'Voter ID Verification',
        titleHI: 'वोटर आईडी सत्यापन',
        prompt: 'Your name is on the roll! What official identity document should you secure next?',
        promptHI: 'आपका नाम मतदाता सूची में है! आपको अगला कौन सा आधिकारिक पहचान दस्तावेज सुरक्षित करना चाहिए?',
        iconName: 'UserCheck',
        audioNarration: 'Success! Your name is officially on the roll. Make sure you have your digital or physical EPIC Voter ID card ready before heading out.',
        audioHI: 'सफलता! आपका नाम आधिकारिक तौर पर सूची में है। बाहर जाने से पहले सुनिश्चित करें कि आपके पास अपना डिजिटल या भौतिक एपिक वोटर आईडी कार्ड तैयार है।',
        options: [
          'A library card',
          'Your EPIC Voter ID Card'
        ],
        correctIndex: 1
      },
      {
        id: 'polling-booth-lookup',
        stepIndex: 3,
        titleEN: 'Polling Booth Lookup',
        titleHI: 'पोलिंग बूथ की खोज',
        prompt: 'Election day is approaching. How do you locate your assigned polling station?',
        promptHI: 'मतदान का दिन आ रहा है। आप अपने आवंटित पोलिंग स्टेशन का पता कैसे लगाते हैं?',
        iconName: 'MapPin',
        audioNarration: 'Time to plan your route. Use the official online Booth Locator tool to find the exact neighborhood school or community center where you will cast your vote.',
        audioHI: 'अपना मार्ग तय करने का समय आ गया है। उस सटीक स्कूल या सामुदायिक केंद्र का पता लगाने के लिए आधिकारिक ऑनलाइन बूथ लोकेटर टूल का उपयोग करें जहाँ आप अपना वोट डालेंगे।',
        options: [
          'Use the National Voters\' Service Portal Booth Locator',
          'Follow the crowds on the street'
        ],
        correctIndex: 0
      },
      {
        id: 'voting-day-evm',
        stepIndex: 4,
        titleEN: 'Voting Day (EVM Interaction)',
        titleHI: 'मतदान का दिन (ईवीएम बातचीत)',
        prompt: 'You are inside the booth! Look at the Electronic Voting Machine (EVM). How do you cast your official vote safely?',
        promptHI: 'आप वोटिंग केबिन के अंदर हैं! इलेक्ट्रॉनिक वोटिंग मशीन (ईवीएम) को देखें। आप अपना आधिकारिक वोट सुरक्षित रूप से कैसे डालते हैं?',
        iconName: 'Fingerprint',
        audioNarration: 'You\'ve made it to the voting booth! Get your finger marked with indelible ink, look at the EVM layout, find your candidate\'s distinct visual party symbol, and press that tactile blue button.',
        audioHI: 'आप पोलिंग बूथ पर पहुंच गए हैं! अपनी उंगली पर अमिट स्याही लगवाएं, ईवीएम लेआउट को देखें, अपने उम्मीदवार के विशिष्ट पार्टी सिंबल को ढूंढें और उस नीले बटन को दबाएं।',
        options: [
          'Write your name on a paper slip',
          'Look for your preferred candidate\'s symbol and press the blue button next to it'
        ],
        correctIndex: 1
      },
      {
        id: 'results',
        stepIndex: 5,
        titleEN: 'Results',
        titleHI: 'परिणाम',
        prompt: 'The blue button beeped and the red light flashed! Your vote is securely cast. What happens next?',
        promptHI: 'नीला बटन बज उठा और लाल बत्ती चमक उठी! आपका वोट सुरक्षित रूप से दर्ज हो गया है। आगे क्या होता है?',
        iconName: 'CheckCircle2',
        audioNarration: 'Beep! Your vote has been officially recorded. The election journey is complete. Now, stay tuned for the final counting day to see the democratic results of your constituency!',
        audioHI: 'बीप! आपका वोट आधिकारिक तौर पर दर्ज हो गया है। चुनावी यात्रा पूरी हो गई है। अब, अपने निर्वाचन क्षेत्र के लोकतांत्रिक परिणाम देखने के लिए अंतिम मतगणना के दिन का इंतजार करें।',
        options: [
          'Watch the official election counting updates and final constituency results',
          'Go back and vote again'
        ],
        correctIndex: 0
      }
    ]
  },
  'usa_deadlines': {
    trackId: 'usa_deadlines',
    trackNameEN: 'USA (Mail-in Deadlines)',
    trackNameHI: 'अमेरिका (डाक मतपत्र समय-सीमा)',
    theme: 'Decentralized State Deadlines & Mail-In Voting',
    descriptionEN: 'Simulate state-specific ballot requests, security envelope signing, and postmark tracking.',
    descriptionHI: 'राज्य-विशिष्ट मतपत्र अनुरोधों, सुरक्षा लिफाफा हस्ताक्षर और डाक-मार्क ट्रैकिंग का अभ्यास करें।',
    steps: [
      {
        id: 'usa-state-select',
        stepIndex: 0,
        titleEN: 'Choose Your State',
        titleHI: 'अपना राज्य चुनें',
        prompt: 'In the USA, every state makes its own rules. Where are you voting?',
        promptHI: 'अमेरिका में मतदान करने के लिए, अपने राज्य-विशिष्ट मतपत्र को सुरक्षित करने के लिए सबसे पहला कदम क्या है?',
        iconName: 'MapPin',
        audioNarration: 'Welcome to the USA voting deadlines simulator. In the United States, there is no single national body that runs elections; instead, each state creates its own voting procedures. Your first step is choosing your home state on the portal to get the correct rules.',
        audioHI: 'यूएसए वोटिंग समय-सीमा सिम्युलेटर में आपका स्वागत है। चूंकि अमेरिका में एक राष्ट्रीय चुनाव प्रणाली नहीं है, आपका पहला कदम आधिकारिक पोर्टल पर अपने निवास के राज्य का चयन करना है। आप सबसे पहले क्या करते हैं?',
        options: [
          'Choose your state of residence on the official voter portal',
          'Wait for the federal government to send a ballot'
        ],
        correctIndex: 0
      },
      {
        id: 'usa-reg-status',
        stepIndex: 1,
        titleEN: 'Registration Status',
        titleHI: 'पंजीकरण की स्थिति',
        prompt: 'You need to submit your registration. Is it too late for an online submission?',
        promptHI: 'आपने अपना राज्य चुन लिया है। आप कैसे सत्यापित करते हैं कि आप पात्र और पंजीकृत हैं?',
        iconName: 'UserCheck',
        audioNarration: 'Excellent. You must verify your state registration deadline. Many states close online voter registration weeks before Election Day, though some offer in-person same-day options.',
        audioHI: 'शानदार। अब, ऑनलाइन अपनी सक्रिय पंजीकरण स्थिति की जांच करें। अमेरिकी राज्यों में मतदाता सूची की समय-सीमा बहुत सख्त होती है, जो अक्सर चुनाव के दिन से कई सप्ताह पहले होती है।',
        options: [
          'Check your state\'s online registration deadline, which is often weeks before the election',
          'Assume online registration is open up to the close of polls'
        ],
        correctIndex: 0
      },
      {
        id: 'usa-request-ballot',
        stepIndex: 2,
        titleEN: 'Request Mail Ballot',
        titleHI: 'डाक मतपत्र का अनुरोध',
        prompt: 'You want to vote from home. How do you request a paper mail ballot?',
        promptHI: 'आप घर से मतदान करना चाहते हैं। आप आधिकारिक डाक मतपत्र का अनुरोध कैसे करते हैं?',
        iconName: 'FileText',
        audioNarration: 'To vote from the comfort of your home, you must request your paper ballot. Submit an official request form either online or to your local county elections office before the request window closes.',
        audioHI: 'यदि आप घर से मतदान करना पसंद करते हैं, तो आपको अपने मतपत्र का अनुरोध करना होगा। अपने राज्य की समय-सीमा से पहले एक आधिकारिक डाक मतपत्र आवेदन जमा करें।',
        options: [
          'Submit an official mail-in ballot request form online or via county clerk',
          'Write a request letter on any plain paper sheet'
        ],
        correctIndex: 0
      },
      {
        id: 'usa-secure-ballot',
        stepIndex: 3,
        titleEN: 'Receive and Secure Ballot',
        titleHI: 'मतपत्र प्राप्त और सुरक्षित करें',
        prompt: 'You are filling out your paper envelope. Why is signing the back critical?',
        promptHI: 'आपका मतपत्र प्राप्त हो गया है। इसे मान्य रखने के लिए आपको क्या करना चाहिए?',
        iconName: 'Sparkles',
        audioNarration: 'Attention to detail is key. Polling officials verify the signature on the security envelope against your voter file signature. A missing or mismatched signature can lead to your ballot being rejected.',
        audioHI: 'आपका मतपत्र यहाँ है! अपने विकल्पों को ध्यान से चिह्नित करें, इसे सुरक्षा लिफाफे के अंदर रखें, और सबसे महत्वपूर्ण बात, शपथ-पत्र के हस्ताक्षर बॉक्स पर हस्ताक्षर करें।',
        options: [
          'To match your signature on file, which county officials verify to validate your vote',
          'To show you have neat handwriting'
        ],
        correctIndex: 0
      },
      {
        id: 'usa-postmark-deadline',
        stepIndex: 4,
        titleEN: 'Postmark Deadline',
        titleHI: 'डाक-मार्क की समय-सीमा',
        prompt: 'It is time to return your completed ballot. How do you track the postmark deadline safely?',
        promptHI: 'अब अपना मतपत्र वापस करने का समय आ गया है। आप डाक-मार्क की समय-सीमा को सुरक्षित रूप से कैसे ट्रैक करते हैं?',
        iconName: 'Fingerprint',
        audioNarration: 'Timing is critical. Mail your ballot early enough to guarantee it receives an official postmark on or before Election Day, or drop it directly into an official county ballot drop box before the polls close.',
        audioHI: 'समय ही सब कुछ है। चुनाव के दिन या उससे पहले आधिकारिक डाक-मार्क सुनिश्चित करने के लिए अपने मतपत्र को जल्दी डाक से भेजें, या इसे सुरक्षित काउंटी ड्रॉप बॉक्स में डालें।',
        options: [
          'Mail your ballot early to secure an official postmark on or before Election Day, or use a secure county drop box',
          'Leave it in your home mailbox on Election Day without a stamp'
        ],
        correctIndex: 0
      },
      {
        id: 'usa-ballot-tracking',
        stepIndex: 5,
        titleEN: 'Ballot Tracking',
        titleHI: 'मतपत्र ट्रैकिंग',
        prompt: 'Your ballot is sent. How do you verify it was successfully received and counted?',
        promptHI: 'आपका मतपत्र भेज दिया गया है। आप कैसे सत्यापित करते हैं कि यह सफलतापूर्वक प्राप्त और गिना गया है?',
        iconName: 'CheckCircle2',
        audioNarration: 'Rehearsal complete! Use your state\'s digital tracking service to watch your mail ballot progress from shipped, received, signature verified, to successfully counted.',
        audioHI: 'सब ठीक है! यह देखने के लिए ऑनलाइन ट्रैकिंग टूल का उपयोग करें कि आपका मतपत्र कब भेजा गया, प्राप्त हुआ और सफलतापूर्वक गिना गया। अभ्यास पूरा हुआ!',
        options: [
          'Use your state\'s online \'Where\'s My Ballot\' tracking system',
          'Assume it arrived safely without checking'
        ],
        correctIndex: 0
      }
    ]
  },
  'estonia_ivoting': {
    trackId: 'estonia_ivoting',
    trackNameEN: 'Estonia (i-Voting)',
    trackNameHI: 'एस्टोनिया (आई-वोटिंग)',
    theme: 'Digital i-Voting & Internet Security',
    descriptionEN: 'Casting a secure digital vote using national ID card readers and dual-PIN encryption.',
    descriptionHI: 'राष्ट्रीय आईडी कार्ड रीडर और डुअल-पिन एन्क्रिप्शन का उपयोग करके सुरक्षित डिजिटल वोट डालें।',
    steps: [
      {
        id: 'ee-digital-id',
        stepIndex: 0,
        titleEN: 'Digital ID Card Activation',
        titleHI: 'डिजिटल आईडी कार्ड सक्रियण',
        prompt: 'Estonians vote securely online. What hardware do you need first?',
        promptHI: 'एस्टोनियाई लोग सुरक्षित रूप से ऑनलाइन मतदान करते हैं। आपको सबसे पहले किस हार्डवेयर की आवश्यकता है?',
        iconName: 'Sparkles',
        audioNarration: 'Welcome to Estonia\'s internet voting simulator. Estonia is a pioneer in digital democracy, allowing citizens to vote securely from anywhere. To begin, insert your physical digital ID card into a USB reader connected to your computer.',
        audioHI: 'एस्टोनिया के आई-वोटिंग सिम्युलेटर में आपका स्वागत है। एक सुरक्षित डिजिटल मतपत्र डालने के लिए, आपके पास एक सक्रिय एस्टोनियाई आईडी कार्ड और एक कार्ड रीडर होना चाहिए।',
        options: [
          'Your official Estonian digital ID Card and a USB card reader connected to your computer',
          'A standard mobile smartphone camera'
        ],
        correctIndex: 0
      },
      {
        id: 'ee-enter-pin1',
        stepIndex: 1,
        titleEN: 'Entering PIN 1 to Authenticate',
        titleHI: 'प्रमाणीकृत करने के लिए पिन १ दर्ज करना',
        prompt: 'The system asks for your PIN 1 code to confirm your identity. What happens next?',
        promptHI: 'सिस्टम आपकी पहचान की पुष्टि करने के लिए आपके पिन १ कोड की मांग करता है। आगे क्या होता है?',
        iconName: 'UserCheck',
        audioNarration: 'The system asks for your PIN 1 code to confirm your identity. Once entered, the application authenticates your identity and secures your session.',
        audioHI: 'सिस्टम आपकी पहचान की पुष्टि करने के लिए आपके पिन १ कोड की मांग करता है। एक बार दर्ज करने के बाद, एप्लिकेशन आपकी पहचान प्रमाणित करता है।',
        options: [
          'The app decrypts your identity and authenticates your secure login session',
          'It sends an SMS verification code to your phone'
        ],
        correctIndex: 0
      },
      {
        id: 'ee-candidate-select',
        stepIndex: 2,
        titleEN: 'Accessing the Central Ballot',
        titleHI: 'केंद्रीय मतपत्र तक पहुँचना',
        prompt: 'Your digital screen displays the candidates. How do you tap your selection?',
        promptHI: 'आपकी डिजिटल स्क्रीन उम्मीदवारों को प्रदर्शित करती है। आप अपना चयन कैसे टैप करते हैं?',
        iconName: 'FileText',
        audioNarration: 'The central ballot is now active on your secure screen. Take your time to review the candidates and tap on your choice to select them.',
        audioHI: 'स्क्रीन आधिकारिक उम्मीदवार सूची प्रदर्शित करती है। उम्मीदवारों को ब्राउज़ करें और डिजिटल मतपत्र लेआउट पर अपनी पसंदीदा पसंद का चयन करने के लिए क्लिक करें।',
        options: [
          'Browse the candidate list on screen and click to select your choice',
          'Type the candidate name into an email'
        ],
        correctIndex: 0
      },
      {
        id: 'ee-enter-pin2',
        stepIndex: 3,
        titleEN: 'Entering PIN 2 to Sign',
        titleHI: 'हस्ताक्षर करने के लिए पिन २ दर्ज करना',
        prompt: 'To officially lock your vote, you must provide your cryptographic PIN 2 electronic signature.',
        promptHI: 'आधिकारिक तौर पर अपने वोट को लॉक करने के लिए, आपको अपना क्रिप्टोग्राफिक पिन २ इलेक्ट्रॉनिक हस्ताक्षर प्रदान करना होगा।',
        iconName: 'Fingerprint',
        audioNarration: 'To officially lock your vote, you must provide your cryptographic PIN 2 electronic signature. PIN 2 acts as a digital signature that secures your anonymous ballot.',
        audioHI: 'अपने वोट को सील करने के लिए, आपको इस पर डिजिटल हस्ताक्षर करने होंगे। अपना सुरक्षित पिन २ दर्ज करें, जो आपके मतपत्र को कास्ट करने के लिए आपके आधिकारिक हस्ताक्षर के रूप में कार्य करता है।',
        options: [
          'Enter PIN 2 to digitally sign, encrypt, and anonymously submit your ballot',
          'Type your password in the sign box'
        ],
        correctIndex: 0
      },
      {
        id: 'ee-revoke-vote',
        stepIndex: 4,
        titleEN: 'Overriding a Digital Vote',
        titleHI: 'डिजिटल वोट को ओवरराइड करना',
        prompt: 'You changed your mind! Did you know you can log back in or vote on paper to overwrite your previous online choice?',
        promptHI: 'आपने अपना विचार बदल लिया है! क्या आप जानते हैं कि आप अपने पिछले ऑनलाइन चयन को ओवरराइट करने के लिए दोबारा लॉग इन कर सकते हैं या पेपर पर वोट कर सकते हैं?',
        iconName: 'CheckCircle2',
        audioNarration: 'Success! Your digital vote is securely recorded. Remember, Estonia allows you to log back in to cast a new vote, or vote in person on Election Day, which automatically revokes and overwrites your previous online vote.',
        audioHI: 'सफलता! आपका डिजिटल वोट दर्ज हो गया है। याद रखें, एस्टोनिया आपको नया वोट डालने के लिए दोबारा लॉग इन करने या चुनाव के दिन व्यक्तिगत रूप से मतदान करने की अनुमति देता है, जिससे आपका पिछला ऑनलाइन वोट स्वतः रद्द हो जाता है।',
        options: [
          'Yes, log back in online or vote on paper to overwrite your previous choice',
          'No, once cast online, your vote is permanent and unchangeable'
        ],
        correctIndex: 0
      }
    ]
  },
  'australia_ranked': {
    trackId: 'australia_ranked',
    trackNameEN: 'Australia (Ranked-Choice)',
    trackNameHI: 'ऑस्ट्रेलिया (वरीयता-आधारित मतदान)',
    theme: 'Compulsory Attendance & Ranked-Choice Ballot',
    descriptionEN: 'Experience compulsory voting attendance, green House paper preferential ranking, and the "Democracy Sausage".',
    descriptionHI: 'अनिवार्य मतदान उपस्थिति, ग्रीन हाउस पेपर वरीयता रैंकिंग और पारम्परिक "डेमोक्रेसी सॉसेज" का अनुभव करें।',
    steps: [
      {
        id: 'au-compulsory-voter',
        stepIndex: 0,
        titleEN: 'Mandatory Attendance Rule',
        titleHI: 'अनिवार्य उपस्थिति नियम',
        prompt: 'In Australia, voting is required by law for all eligible citizens. What happens if you skip it?',
        promptHI: 'ऑस्ट्रेलिया में, सभी पात्र नागरिकों के लिए मतदान आवश्यक है। यदि आप इसे छोड़ देते हैं तो क्या होता है?',
        iconName: 'Sparkles',
        audioNarration: 'Welcome to the Australian ranked-choice voting simulator. Voting is a legal requirement in Australia. What happens if you fail to attend a polling station without a valid excuse?',
        audioHI: 'ऑस्ट्रेलियाई वरीयता मतदान सिम्युलेटर में आपका स्वागत है। ऑस्ट्रेलिया में मतदान एक कानूनी आवश्यकता है। यदि आप बिना किसी वैध बहाने के मतदान केंद्र पर उपस्थित होने में असमर्थ रहते हैं तो क्या होता है?',
        options: [
          'Nothing happens',
          'You will receive a small fine unless you have a valid reason'
        ],
        correctIndex: 1
      },
      {
        id: 'au-democracy-sausage',
        stepIndex: 1,
        titleEN: 'The Democracy Sausage',
        titleHI: 'डेमोक्रेसी सॉसेज',
        prompt: 'You arrive at the local school booth. What popular fundraising food custom greets you outside?',
        promptHI: 'आप स्थानीय स्कूल बूथ पर पहुँचते हैं। बाहर कौन सी लोकप्रिय खाद्य परंपरा आपका स्वागत करती है?',
        iconName: 'MapPin',
        audioNarration: 'As you approach the polling place, usually at a local school or community hall, you\'ll be greeted by the delicious aroma of the democracy sausage. This is a beloved fundraising custom where volunteers sell grilled sausages to voters.',
        audioHI: 'जैसे ही आप मतदान केंद्र के पास पहुँचते हैं, जो आमतौर पर एक स्थानीय स्कूल या सामुदायिक हॉल होता है, आपका स्वागत डेमोक्रेसी सॉसेज की स्वादिष्ट सुगंध से किया जाएगा।',
        options: [
          'A fundraising sausage sizzle called the Democracy Sausage',
          'A formal sit-down tea party'
        ],
        correctIndex: 0
      },
      {
        id: 'au-green-ballot',
        stepIndex: 2,
        titleEN: 'Preferential Green Ballot',
        titleHI: 'वरीयता हरा मतपत्र',
        prompt: 'You receive a green ballot. Instead of picking one person, how do you mark your choices?',
        promptHI: 'आपको एक हरा मतपत्र मिलता है। एक व्यक्ति को चुनने के बजाय, आप अपनी पसंद कैसे चिह्नित करते हैं?',
        iconName: 'FileText',
        audioNarration: 'Once inside, you receive a green ballot paper for the House of Representatives. Instead of just ticking one box, you must rank all the candidates in order of your preference.',
        audioHI: 'अंदर जाने पर, आपको प्रतिनिधि सभा के लिए एक हरा मतपत्र मिलता है। केवल एक बॉक्स पर टिक करने के बजाय, आपको अपनी पसंद के क्रम में सभी उम्मीदवारों को रैंक करना होगा।',
        options: [
          'Rank the candidates numerically in order of your preference',
          'Put a checkmark next to a single favorite candidate'
        ],
        correctIndex: 0
      },
      {
        id: 'au-order-preferences',
        stepIndex: 3,
        titleEN: 'Ordering the Preferences',
        titleHI: 'वरीयताओं का क्रम',
        prompt: 'You must rank the candidates numerically from 1 down to your least favorite. If no one gets a 50% majority, how do your lower preferences count?',
        promptHI: 'आपको उम्मीदवारों को १ से लेकर अपनी कम पसंदीदा संख्या तक रैंक करना होगा। यदि किसी को ५०% बहुमत नहीं मिलता है, तो आपकी निचली वरीयताएँ कैसे गिनी जाती हैं?',
        iconName: 'UserCheck',
        audioNarration: 'You must write a one next to your first choice, a two next to your second, and so on. If no candidate gets a fifty percent majority of first-preference votes, the candidate with the fewest votes is excluded, and their votes are redistributed to the remaining candidates based on their next preferences.',
        audioHI: 'आपको अपनी पहली पसंद के आगे १, दूसरी पसंद के आगे २ लिखना होगा। यदि किसी को ५०% बहुमत नहीं मिलता है, तो सबसे कम वोट वाले उम्मीदवार को बाहर कर दिया जाता है और उनके वोट उनकी अगली वरीयताओं के आधार पर दूसरों में स्थानांतरित कर दिए जाते हैं।',
        options: [
          'The lowest candidate is excluded, and their votes are redistributed to others based on the voters\' next preferences',
          'All lower preferences are discarded and a new election is held'
        ],
        correctIndex: 0
      },
      {
        id: 'au-drop-box',
        stepIndex: 4,
        titleEN: 'Dropping Paper in Box',
        titleHI: 'मतपेटी में मतपत्र डालना',
        prompt: 'You have ranked all the candidates. What is the final step to submit your ballot securely?',
        promptHI: 'आपने सभी उम्मीदवारों को रैंक कर लिया है। अपने मतपत्र को सुरक्षित रूप से जमा करने का अंतिम चरण क्या है?',
        iconName: 'CheckCircle2',
        audioNarration: 'Compulsory duty complete! Fold your green ballot paper and slide it into the designated ballot box. Your ranked-choice vote is now cast and ready to be counted.',
        audioHI: 'अनिवार्य कर्तव्य पूरा हुआ! अपने हरे मतपत्र को मोड़ें और उसे निर्दिष्ट मतपेटी में डालें। आपकी वरीयता-आधारित पसंद अब सुरक्षित रूप से जमा हो गई है।',
        options: [
          'Fold and drop your ballot in the official ballot box',
          'Leave your ballot in the voting screen compartment'
        ],
        correctIndex: 0
      }
    ]
  }
};

// Backward-compatibility mapper
for (const trackId of Object.keys(globalElectionTracks)) {
  const track = globalElectionTracks[trackId] as any;
  track.stages = track.steps;
  for (const step of track.steps) {
    step.stageNum = step.stepIndex + 1;
    step.promptEN = step.prompt;
    step.promptHI = step.promptHI || step.prompt;
    step.audioEN = step.audioNarration;
    step.audioHI = step.audioHI || step.audioNarration;
  }
}

export const journeySteps = globalElectionTracks as any as Record<string, JourneyTrack>;
(journeySteps as any)['first-time'] = journeySteps['india_evm'];



