import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { BootValue } from '@nestcloud/boot';
import { IArticleService } from './IArticleService';
import { Article } from '../interfaces/Atricle';

@Injectable()
export class GhostArticleService implements IArticleService {
  @BootValue('articles.url')
  private readonly url: string;
  @BootValue('articles.key')
  private readonly key: string;
  private readonly ARTICLES_URL = '/ghost/api/v2/content/posts';

  async getArticle(articleId: string): Promise<Article> {
    const response = await axios.get(`${ this.url }${ this.ARTICLES_URL }/${ articleId }`, {
      params: { key: this.key },
    });
    if (response.data.posts.length === 0) {
      throw new NotFoundException('Resource Not Found');
    }

    const post = response.data.posts[0];
    return {
      id: post.id,
      title: post.title,
      html: post.html,
      publishedAt: new Date(post.published_at),
    };
  }

  async getArticles(): Promise<Article[]> {
    const response = await axios.get(`${ this.url }${ this.ARTICLES_URL }`, {
      params: { key: this.key },
    });
    return response.data.posts.map(post => ({
      id: post.id,
      title: post.title,
      html: post.html,
      publishedAt: new Date(post.published_at),
    }));
  }
}
