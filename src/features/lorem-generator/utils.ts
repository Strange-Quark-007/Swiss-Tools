import { LoremIpsum } from 'lorem-ipsum';

import { TranslationFunction } from '@/i18n/utils';
import { exhaustiveCheck } from '@/lib/utils';
import { ConverterResult, ValueUnion } from '@/types/common';

export type LoremType = ValueUnion<typeof LOREM>;

export const LOREM = {
  word: { value: 'word', label: 'Words' },
  sentence: { value: 'sentence', label: 'Sentences' },
  paragraph: { value: 'paragraph', label: 'Paragraphs' },
} as const;

export const MAX_COUNT = 1000;

export const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 6,
  },
  wordsPerSentence: {
    max: 16,
    min: 8,
  },
});

export const generateLorem = (type: LoremType, count: number, t: TranslationFunction): ConverterResult => {
  let result = '';

  if (!Number.isFinite(count) || !count) {
    return { result: '', error: t('loremGenerator.invalidCount') };
  }

  switch (type) {
    case LOREM.word.value:
      result = lorem.generateWords(count);
      break;

    case LOREM.sentence.value:
      result = lorem.generateSentences(count);
      break;

    case LOREM.paragraph.value:
      const paragraphs = lorem.generateParagraphs(count);
      result = paragraphs.split('\n').join('\n\n');
      break;

    default:
      exhaustiveCheck(type);
  }

  return { result };
};
