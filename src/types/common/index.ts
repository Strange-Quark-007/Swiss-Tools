export type SearchParams = { [key: string]: string | string[] | undefined };

export interface ConverterResult {
  result: string;
  error?: string;
}

export type PropertyUnion<T extends Record<string, unknown>, K extends keyof T[keyof T]> = T[keyof T][K];
export type ValueUnion<T extends Record<string, { value: unknown }>> = PropertyUnion<T, 'value'>;

export type ReadonlyTuple<U> = readonly U[];

export type MissingUnionMembers<U, T extends ReadonlyTuple<U>> = Exclude<U, T[number]>;

/**
 * Enforces that a tuple type `T` exhaustively contains all members of union `U`.
 * Evaluates to `T` when exhaustive, or an error string specifying missing members.
 */
export type ExhaustiveTuple<U, T extends ReadonlyTuple<U>> = [MissingUnionMembers<U, T>] extends [never]
  ? T
  : U & { missing: MissingUnionMembers<U, T> };

export type ExhaustiveSet<U> = Set<U> & { has(value: unknown): value is U };

export type ExhaustiveTupleFactory<U> = <const T extends ReadonlyTuple<U>>(values: ExhaustiveTuple<U, T>) => T;

export type ExhaustiveSetFactory<U> = <const T extends ReadonlyTuple<U>>(
  values: ExhaustiveTuple<U, T>
) => ExhaustiveSet<U>;
