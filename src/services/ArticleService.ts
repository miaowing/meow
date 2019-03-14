import { Injectable } from '@nestjs/common';
import { InjectBoot, Boot } from '@nestcloud/boot';
import { IArticleService } from './IArticleService';
import { Article } from '../interfaces/Atricle';
import { GhostArticleService } from './GhostArticleService';
import { CommentConfig } from '../interfaces/CommentConfig';
import { InjectLogger } from '@nestcloud/logger';
import { LoggerInstance } from 'winston';

@Injectable()
export class ArticleService implements IArticleService {
  constructor(
    @InjectBoot() private readonly boot: Boot,
    private readonly ghostArticleService: GhostArticleService,
    @InjectLogger() private readonly logger: LoggerInstance,
  ) {
  }

  getArticle(articleId: string): Promise<Article> | Article {
    const service = this.getService();
    if (!service) {
      return null;
    }
    try {
      return service.getArticle(articleId);
    } catch (e) {
      this.logger.error(`Get article ${ articleId } error.`, e);
      return null;
    }
  }

  getArticles(): Promise<Article[]> | Article[] {
    const service = this.getService();
    if (!service) {
      return [];
    }

    try {
      return service.getArticles();
    } catch (e) {
      this.logger.error(`Get articles error.`, e);
      return [];
    }
  }

  getCommentConfig(): CommentConfig {
    return this.boot.get<CommentConfig>('comments', {});
  }

  private getService(): IArticleService {
    const blogEngine = this.boot.get('articles.engine', 'ghost');
    if (blogEngine === 'ghost') {
      return this.ghostArticleService;
    }

    return null;
  }
}
