import { ConverterResult } from '@/types/common';

// The function that performs the conversion for a single item (e.g., a number or a line)
type Converter<Args extends unknown[]> = (item: string, ...args: Args) => ConverterResult;

interface BulkProcessorParams<Args extends unknown[]> {
  /** The raw text input */
  fromText: string;
  /** The function to convert a single item. */
  processor: Converter<Args>;
  /** Additional arguments to pass to the itemConverter. Must match the itemConverter's arguments order. */
  converterArgs: Args;
  /** The error message for the overall bulk conversion if any item fails. */
  bulkErrorTranslation?: string;
  /** The regex to use for splitting the input. Default /[\n]/. */
  delimiterRegex?: RegExp;
}

/**
 * A wrapper function to handle bulk processing, splitting, and error aggregation.
 *
 * @param params {@link BulkProcessorParams} – Parameters for the bulk processor:
 *   - `fromText`: The raw text input.
 *   - `processor`: The function to convert a single item (must return { result, error? }).
 *   - `converterArgs`: Additional arguments to pass to the processor (must match the processor's argument order).
 *   - `bulkErrorTranslation` (optional): Error message if any item fails.
 *   - `delimiterRegex` (optional): Regex to split the input, default `/[,\n]/`.
 *
 * @returns {ConverterResult} The combined results of processing each item, and an optional bulk error.
 */
export const bulkProcessor = <Args extends unknown[]>({
  fromText,
  processor,
  converterArgs,
  bulkErrorTranslation = '',
  delimiterRegex = /[,\n]/,
}: BulkProcessorParams<Args>): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const items = fromText
    .split(delimiterRegex)
    .map((item) => item.trim())
    .filter(Boolean);

  console.log(items);

  if (!items.length) {
    return { result: '' };
  }

  const results: string[] = [];
  let hasError = false;

  for (const item of items) {
    const { result, error } = processor(item, ...converterArgs);

    if (error) {
      hasError = true;
      results.push(error);
    } else {
      results.push(result);
    }
  }

  return {
    result: results.join('\n'),
    error: hasError ? bulkErrorTranslation : undefined,
  };
};
