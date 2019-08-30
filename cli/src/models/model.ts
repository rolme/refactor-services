import { apiClient, client } from '../utils/client';

class Model {
  public async request(query: any, variables?: any): Promise<any> {
    return client.request(query, variables);
  }
  public async apiRequest(query: any, variables?: any): Promise<any> {
    return apiClient.request(query, variables);
  }
}

export default Model;
