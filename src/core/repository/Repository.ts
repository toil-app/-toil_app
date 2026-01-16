import axios, { AxiosInstance, AxiosProgressEvent } from 'axios';
import LocalStorage from '@core/service/LocalStorage.service';
import { createLogger } from '@core/util/AppUtil';
import { StorageKey } from '@core/util/keys';

const API_BASE_URL =
  'https://i9n8v2p3qd.execute-api.us-east-1.amazonaws.com/dev';

const Logger = createLogger('[Repository]');

export default class Repository {
  protected axiosInstance: AxiosInstance;
  protected baseURL: string;

  constructor(type: string = '') {
    this.baseURL = type ? `${API_BASE_URL}/${type}` : API_BASE_URL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
    });
  }

  /**
   * Generic API call with automatic token injectioncd
   */
  protected async getAuthToken(): Promise<string> {
    try {
      const token = await LocalStorage.get(StorageKey.TOKEN_KEY);
      if (token) {
        const parsed = JSON.parse(token);
        return typeof parsed === 'string' ? parsed : parsed.token || '';
      }
      return '';
    } catch (error) {
      Logger.warn('Failed to get auth token:', error);
      return '';
    }
  }

  /**
   * Helper method to make requests with standard headers
   */
  private async makeRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    dataOrParams?: any,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
    isFormData: boolean = false,
  ): Promise<T | null> {
    try {
      const token = await this.getAuthToken();

      const headers: Record<string, string> = {
        Authorization: token ? `Bearer ${token}` : 'Bearer',
        Accept: 'application/json',
      };

      // Only set Content-Type for non-FormData requests
      if (!isFormData && (method === 'post' || method === 'put')) {
        headers['Content-Type'] = 'application/json';
      }

      const config: any = { headers };
      if (onProgress) {
        config.onUploadProgress = onProgress;
      }

      let response;
      if (method === 'get' || method === 'delete') {
        config.params = dataOrParams;
        response = await this.axiosInstance[method]<T>(path, config);
      } else {
        response = await this.axiosInstance[method]<T>(
          path,
          dataOrParams,
          config,
        );
      }

      return response.data;
    } catch (error) {
      Logger.error(`${method.toUpperCase()} request failed:`, path, error);
      return null;
    }
  }

  /**
   * Build query string from optional params.
   */
  protected buildQuery(params: Record<string, any> = {}): string {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        qs.append(key, String(value));
      }
    });
    const query = qs.toString();
    return query ? `?${query}` : '';
  }

  /**
   * GET request (application/json)
   */
  async get<T = any>(path: string, params?: any): Promise<T | null> {
    return this.makeRequest<T>('get', path, params);
  }

  /**
   * POST request (application/json)
   */
  async post<T = any>(path: string, data: any): Promise<T | null> {
    return this.makeRequest<T>('post', path, data);
  }

  /**
   * PUT request (application/json)
   */
  async put<T = any>(path: string, data: any): Promise<T | null> {
    return this.makeRequest<T>('put', path, data);
  }

  /**
   * POST FormData (multipart/form-data)
   */
  async postFormData<T = any>(
    path: string,
    formData: FormData,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
  ): Promise<T | null> {
    return this.makeRequest<T>('post', path, formData, onProgress, true);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(path: string): Promise<T | null> {
    return this.makeRequest<T>('delete', path);
  }
}
