import { Controller, Get, Render, Param, Res } from '@nestjs/common';
import { InjectBoot, Boot } from '@nestcloud/boot';
import { GithubService, TopicService, ArticleService } from '../services';

@Controller('/')
export class RenderController {
  constructor(
    private readonly githubService: GithubService,
    private readonly topicService: TopicService,
    private readonly articleService: ArticleService,
    @InjectBoot() private readonly boot: Boot,
  ) {
  }

  @Get()
  @Render('index')
  async render() {
    const extras = this.boot.get('extras', {});
    const topics = this.topicService.getTopics();
    const articles = await await this.articleService.getArticles();
    return {
      ...await this.githubService.fetchWithCache(),
      topics,
      articles: await this.articleService.getArticles(),
      hasArticles: !!articles.length,
      extras,
    };
  }

  @Get('articles/:articleId')
  async renderArticle(@Param('articleId') articleId: string, @Res() res) {
    const extras = this.boot.get('extras', {});
    const commentConfig = this.articleService.getCommentConfig();
    const article = await this.articleService.getArticle(articleId);
    if (!article) {
      return res.redirect('/');
    }

    res.render('article', {
      ...await this.githubService.fetchWithCache(),
      article,
      valine: commentConfig.engine === 'valine',
      config: commentConfig,
      extras,
    });
  }
}
