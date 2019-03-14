import { IInterceptor } from '@nestcloud/feign';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { linuxapi, weapi } from '../utils/NeteaseCrypto';

export class NeteaseCSRFInterceptor implements IInterceptor {

  onRequest(request: AxiosRequestConfig): AxiosRequestConfig {
    const crypto = request.headers.crypto;
    if (crypto === 'weapi') {
      const csrfToken = (request.headers.Cookie || '').match(/_csrf=([^(;|$)]+)/);
      request.data.csrf_token = csrfToken ? csrfToken[1] : '';
      request.data = weapi(request.data);
    } else if (crypto === 'linuxapi') {
      request.data = linuxapi({
        method: request.method,
        url: request.url,
        params: request.data,
      });
      request.headers['User-Agent'] =
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36';
      request.url = 'https://music.163.com/api/linux/forward';
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
