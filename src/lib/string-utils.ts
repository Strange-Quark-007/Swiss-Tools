export class StringUtils {
  constructor(private str: string) {
    this.str = this.str.normalize('NFC').trim();
  }

  static from(str: string) {
    return new StringUtils(str);
  }

  sanitize() {
    this.str = this.str
      .replace(/[^\p{L}\p{N}]/gu, ' ')
      .replace(/\.+/g, '.')
      .replace(/\_+/g, '_')
      .replace(/\-+/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
    return this;
  }

  capitalize() {
    this.str = this.str.charAt(0).toUpperCase() + this.str.slice(1);
    return this;
  }

  parseFromKebab() {
    this.str = this.str.replace(/[-]+/g, ' ').replace(/\s+/g, ' ');
    return this;
  }

  parseFromCamel() {
    this.str = this.str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-z])([A-Z]+)/g, '$1 $2')
      .replace(/\s+/g, ' ');
    return this;
  }

  parseFromSnake() {
    this.str = this.str.replace(/_+/g, ' ').replace(/\s+/g, ' ');
    return this;
  }

  parseFromDot() {
    this.str = this.str.replace(/\.+/g, ' ').replace(/\s+/g, ' ');
    return this;
  }

  parseFromPascal() {
    this.str = this.str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ');
    return this;
  }

  toTitleCase() {
    this.str = this.str
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return this;
  }

  toPascalCase() {
    this.str = this.toCamelCase().capitalize().toString();
    return this;
  }

  toSnakeCase() {
    this.str = this.str.toLowerCase().replace(/\s+/g, '_');
    return this;
  }

  toKebabCase() {
    this.str = this.str.toLowerCase().replace(/\s+/g, '-');
    return this;
  }

  toDotCase() {
    this.str = this.str.toLowerCase().replace(/\s+/g, '.');
    return this;
  }

  toCamelCase() {
    this.str = this.str
      .toLowerCase()
      .replace(/[-_]+/g, ' ')
      .replace(/\s+(\w)/g, (_, letter) => letter.toUpperCase())
      .replace(/\s+/g, '');
    return this;
  }

  toAscii() {
    this.str = this.str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return this;
  }

  toString() {
    return this.str.trim();
  }

  valueOf() {
    return this.toString();
  }
}
