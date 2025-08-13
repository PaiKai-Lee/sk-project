import type { IApiResponse } from '~/features/types';

export interface IDepartment {
  id: number;
  name: string;
}

export interface IDepartmentsResponse extends IApiResponse<IDepartment[]> {}
