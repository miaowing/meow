import { Injectable } from '@nestjs/common';
import { InjectBoot, Boot } from '@nestcloud/boot';

@Injectable()
export class TopicService {
  constructor(
    @InjectBoot() private readonly boot: Boot,
  ) {
  }

  getTopics() {
    return this.boot.get('topics', []);
  }
}
