export interface IRestConnectionConfiguration {
  url: string;
}

export default class RestConnection implements IConnection {
  private url: any;

  constructor(configuration: IRestConnectionConfiguration) {
    this.url = configuration.url;
  }

  fetch(url: string): Promise<any> {
    return fetch(this.url + url);
  }

  setConfig(config: any): void {
    throw new Error("Method not implemented.");
  }

  static validateConfiguration(configuration: IRestConnectionConfiguration) {
    if (!configuration.url) {
      return false;
    }

    return true;
  }
}