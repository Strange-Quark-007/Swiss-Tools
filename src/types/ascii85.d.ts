declare module 'ascii85' {
  interface Ascii85 {
    encode(input: string | Uint8Array): string;
    decode(input: string): Uint8Array;
  }

  const ascii85: Ascii85;
  export = ascii85;
}
