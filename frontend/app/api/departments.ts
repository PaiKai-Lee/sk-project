import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IApiResponse, IDepartmentResponse } from './types';

class DepartmentClient {
  static async getDepartments(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IDepartmentResponse[]>> {
    return httpClient.get('departments', options);
  }
}

export default DepartmentClient;
