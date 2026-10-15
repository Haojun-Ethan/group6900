import SingleChoiceQuestion from './SingleChoiceQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import MatchingQuestion from './MatchingQuestion';
import FlashcardQuestion from './FlashcardQuestion';

export const QUESTION_TYPES = {
    SINGLE:     SingleChoiceQuestion,
    MULTIPLE:   MultipleChoiceQuestion,
    TRUE_FALSE: TrueFalseQuestion,
    MATCHING:   MatchingQuestion,
    FLASHCARD:  FlashcardQuestion,
};


export const QUESTION_TYPE_LABELS = {
    SINGLE:     'Single Choice',
    MULTIPLE:   'Multiple Choice',
    TRUE_FALSE: 'True / False',
    MATCHING:   'Matching',
    FLASHCARD:  'Flashcard',
};