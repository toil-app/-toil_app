import Repository from './Repository';

class ServiceProviderRepository extends Repository {
  getServiceProviders(params: any) {
    return this.get<any>('/providers', params);
  }

  getServiceProviderDetails(providerId: string) {
    return this.get<any>(`/providers/${providerId}`);
  }

  createServiceProvider(data: any) {
    return this.post<any>('/providers', data);
  }

  updateServiceProvider(providerId: string, data: any) {
    return this.put<any>(`/providers/${providerId}`, data);
  }

  updateServiceProviderAvatar(
    providerId: string,
    formData: FormData,
    onProgress?: (progressEvent: any) => void,
  ) {
    return this.postFormData<any>(
      `/providers/${providerId}/avatar`,
      formData,
      onProgress,
    );
  }

  updateServiceProviderIDDocument(
    providerId: string,
    formData: FormData,
    onProgress?: (progressEvent: any) => void,
  ) {
    return this.postFormData<any>(
      `/providers/${providerId}/id-document`,
      formData,
      onProgress,
    );
  }

  updateServiceProviderBirthCertificate(
    providerId: string,
    formData: FormData,
    onProgress?: (progressEvent: any) => void,
  ) {
    return this.postFormData<any>(
      `/providers/${providerId}/birth-certificate`,
      formData,
      onProgress,
    );
  }

  updateServiceProviderProffesionalCertificate(
    providerId: string,
    formData: FormData,
    onProgress?: (progressEvent: any) => void,
  ) {
    return this.postFormData<any>(
      `/providers/${providerId}/professional-certificate`,
      formData,
      onProgress,
    );
  }

  deleteServiceProvider(providerId: string) {
    return this.delete<any>(`/providers/${providerId}`);
  }
}

export default new ServiceProviderRepository('service-providers');
