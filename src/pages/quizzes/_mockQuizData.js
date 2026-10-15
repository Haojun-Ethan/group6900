export const MOCK_QUIZ_QUESTIONS = [

    // single choice
  {
    id: 1,
    question_type: 'SINGLE',
    text: 'What is phishing?',
    explanation: 'Phishing is a social engineering attack where an attacker impersonates a trusted contact.',
    points: 1,
    order: 1,
    choices: [
      { id: 11, text: 'A social engineering attack', is_correct: true,  order: 1 },
      { id: 12, text: 'A type of firewall',          is_correct: false, order: 2 },
      { id: 13, text: 'A software update',           is_correct: false, order: 3 },
      { id: 14, text: 'A password manager',          is_correct: false, order: 4 },
    ],
  },

  // multiple choice
  {
    id: 2,
    question_type: 'MULTIPLE',
    text: 'Which of the following are common red flags of a phishing email?',
    explanation: 'Urgency, mismatched sender domains, and unexpected requests are common signals.',
    points: 2,
    order: 2,
    choices: [
      { id: 21, text: 'Urgency in the message',      is_correct: true,  order: 1 },
      { id: 22, text: 'Unexpected attachments',      is_correct: true,  order: 2 },
      { id: 23, text: 'Correct spelling throughout', is_correct: false, order: 3 },
      { id: 24, text: 'Mismatched sender domain',    is_correct: true,  order: 4 },
    ],
  },

  // true/false     
  {
    id: 3,
    question_type: 'TRUE_FALSE',
    text: 'It is safe to click links in emails from unknown senders as long as the email looks professional.',
    explanation: 'Never click links from unknown senders, regardless of how professional the email looks.',
    points: 1,
    order: 3,
    // No choices — component uses hardcoded True/False
  },

  // matching
  {
    id: 4,
    question_type: 'MATCHING',
    text: 'Match each threat with its description.',
    explanation: 'Matching links the term with its real-world meaning.',
    points: 3,
    order: 4,
    pairs: [
      { id: 41, left: 'Phishing',   right: 'Tricks you into revealing credentials' },
      { id: 42, left: 'Ransomware', right: 'Encrypts files and demands payment' },
      { id: 43, left: 'Malware',    right: 'Any software designed to cause harm' },
    ],
  },

  // flashcard
  {
    id: 5,
    question_type: 'FLASHCARD',
    text: 'What does MFA stand for?',
    explanation: 'Multi-Factor Authentication. It requires two or more verification methods.',
    points: 1,
    order: 5,
  },
];