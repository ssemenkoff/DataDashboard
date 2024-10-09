export interface IRestStoreConfiguration {
  resourceUrl: string;
  connection: string;
  selectedJSONValue?: string;
}

export default class RestStore implements IDataRetrieveable {
  private connection: any;
  private resourceUrl: string;
  private selectedJSONValue?: string;

  constructor(configuration: IRestStoreConfiguration) {
    this.connection = configuration.connection;
    this.resourceUrl = configuration.resourceUrl;
    this.selectedJSONValue = configuration.selectedJSONValue;
  }

  async getSelectedData() {
    const connectionRepository = (this as any).connectionRepository;
    if (!connectionRepository) {
      throw new Error('ConnectionRepository is not provided to Store Classes');
    }

    const connection = connectionRepository.getConnection(this.connection);
    if (this.selectedJSONValue) {
      const req = await connection.fetch(this.selectedJSONValue);
      return req.json();
    }
  }

  async getData() {
    const connectionRepository = (this as any).connectionRepository;
    if (!connectionRepository) {
      throw new Error('ConnectionRepository is not provided to Store Classes');
    }

    const connection = connectionRepository.getConnection(this.connection);
    const req = await connection.fetch(this.resourceUrl);
    return req.json();
  }

  static validateConfiguration(configuration: IRestStoreConfiguration) {
    if (!configuration.connection) {
      return false;
    }

    if (!configuration.resourceUrl) {
      return false;
    }

    return true;
  }
}
