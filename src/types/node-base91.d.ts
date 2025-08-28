declare module 'node-base91' {
  const base91: {
    encode(input: string | Uint8Array): string;
    decode(input: string): Uint8Array;
  };
  export = base91;
}
