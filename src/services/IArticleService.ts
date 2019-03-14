import { Article } from '../interfaces/Atricle';

export interface IArticleService {
  getArticles(): Promise<Article[]> | Article[];

  getArticle(articleId: string): Promise<Article> | Article;
}
