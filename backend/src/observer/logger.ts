export class Logger<T> {
  private label: string;
  private formatter: (data: T) => string;
  constructor(label: string, formatter: (data: T) => string) {
    this.label = label;
    this.formatter = formatter;
  }
  log(data: T) {
    console.log(`[${this.label}] ${this.formatter(data)}`);
  }
}
