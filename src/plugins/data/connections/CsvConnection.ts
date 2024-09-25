export interface ICsvConnectionConfiguration {
  url: string;
}

export default class CsvConnection implements IConnection {
  private url: any;

  constructor(configuration: ICsvConnectionConfiguration) {
    this.url = configuration.url;
  }

  fetch(url: string): Promise<any> {
    return fetch(this.url + url);
  }

  setConfig(config: any): void {
    throw new Error("Method not implemented.");
  }

  static validateConfiguration(configuration: ICsvConnectionConfiguration) {
    if (!configuration.url) {
      return false;
    }

    return true;
  }
}