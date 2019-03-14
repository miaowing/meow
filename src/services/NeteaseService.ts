import { Injectable } from '@nestjs/common';
import { NeteaseClient } from '../clients';

@Injectable()
export class NeteaseService {
  constructor(
    private readonly netease: NeteaseClient,
  ) {
    this.login();
  }

  login() {
    this.netease.login('18742038812', 'zhaofeng', 86, true).then(response => console.log(response));
  }
}
