import { Injectable } from '@nestjs/common';
import { Post, Interceptor, SetHeader, Body, Response } from '@nestcloud/feign';
import { NeteaseUserAgentInterceptor } from './NeteaseUserAgentInterceptor';
import { NeteaseCSRFInterceptor } from './NeteaseCSRFInterceptor';
import { NeteasePasswordInterceptor } from './NeteasePasswordInterceptor';
import { NeteaseBodyInterceptor } from './NeteaseBodyInterceptor';

@Injectable()
@Interceptor(NeteasePasswordInterceptor)
@Interceptor(NeteaseUserAgentInterceptor)
@Interceptor(NeteaseCSRFInterceptor)
@Interceptor(NeteaseBodyInterceptor)
export class NeteaseClient {
  @Post('https://music.163.com/weapi/login/cellphone')
  @SetHeader('crypto', 'weapi')
  @SetHeader('ua', 'pc')
  @Response()
  login(@Body('phone') phone: string,
        @Body('password') password: string,
        @Body('countrycode') countryCode: number = 86,
        @Body('rememberLogin') remember: boolean = true): any {
  }

  @Post('https://music.163.com/weapi/login/token/refresh')
  @SetHeader('crypto', 'weapi')
  @SetHeader('ua', 'pc')
  refreshLogin() {
  }

  @Post('https://music.163.com/weapi/user/playlist')
  @SetHeader('crypto', 'weapi')
  getUserPlaylist(@Body('uid') uid: string, @Body('offset') offset: number, @Body('limit') limit: number) {
  }

  @Post('https://music.163.com/weapi/v3/playlist/detail')
  @SetHeader('crypto', 'linuxapi')
  getPlaylistDetail(@Body('id') id: number, @Body('n') n: number, @Body('s') s: number) {
  }
}
