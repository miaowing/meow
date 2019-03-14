import { IInterceptor } from '@nestcloud/feign';
import { createHash } from 'crypto';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export class NeteasePasswordInterceptor implements IInterceptor {

  onRequest(request: AxiosRequestConfig): AxiosRequestConfig {
    if (request.data.password) {
      request.data.password = createHash('md5').update(request.data.password).digest('hex');
    }
    return request;
  }

  onRequestError(error: any): any {
    return Promise.reject(error);
  }

  onResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  onResponseError(error: any): any {
    return Promise.reject(error);
  }
}
