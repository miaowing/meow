import { IInterceptor } from '@nestcloud/feign';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as queryString from 'querystring';

export class NeteaseBodyInterceptor implements IInterceptor {

  onRequest(request: AxiosRequestConfig): AxiosRequestConfig {
    request.data = queryString.stringify(request.data);
    console.log(request);
    return request;
  }

  onRequestError(error: any): any {
    console.log(error);
  }

  onResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  onResponseError(error: any): any {
    console.log(error);
  }
}
