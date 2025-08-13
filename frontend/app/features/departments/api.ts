import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IDepartmentsResponse } from './types';

export class DepartmentClient {
  static getDepartments(
    options?: AxiosRequestConfig
  ): Promise<IDepartmentsResponse> {
    return httpClient.get('departments', options);
  }
}
