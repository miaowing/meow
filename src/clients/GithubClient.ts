import { Injectable } from '@nestjs/common';
import { Post, Body, Header } from '@nestcloud/feign';
import { Viewer, Error } from '../interfaces/Github';

@Injectable()
export class GithubClient {
  @Post('https://api.github.com/graphql')
  query(@Header('Authorization') token, @Body('query') graphql): { data: { viewer: Viewer } } | { errors: Error[] } | any {
  }
}
