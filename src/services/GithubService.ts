import { BadRequestException, Injectable } from '@nestjs/common';
import { Boot, InjectBoot } from '@nestcloud/boot';
import { get, put } from 'memory-cache';
import { GithubClient } from '../clients';
import { Viewer } from '../interfaces/Github';

@Injectable()
export class GithubService {
  private readonly GITHUB_DATA_CACHE = 'GITHUB_DATA_CACHE';
  private readonly CACHE_TIMEOUT = 3600000;

  constructor(
    private readonly github: GithubClient,
    @InjectBoot() private readonly boot: Boot,
  ) {
  }

  async fetchWithCache(): Promise<Viewer> {
    const cache = get(this.GITHUB_DATA_CACHE);
    if (cache) {
      return cache;
    }

    const viewer = await this.fetch();
    put<Viewer>(this.GITHUB_DATA_CACHE, viewer, this.CACHE_TIMEOUT);
    return viewer;
  }

  async fetch(): Promise<Viewer> {
    const token = this.boot.get('github.token');
    const repoCount = this.boot.get('github.projects.count', 9);
    const sortBy = this.boot.get('github.projects.sortBy', 'STARGAZERS');
    const affiliations = this.boot.get('github.projects.affiliations', ['OWNER']).toString();
    const excludes = this.boot.get('github.projects.excludes', []);
    const totalCount = repoCount + excludes.length;
    const graphql = `
      query {
        viewer {
          id
          name
          bio
          login
          email
          avatarUrl
          location
          followers {
            totalCount
          }
          following {
            totalCount
          }
          organizations(first: 100) {
            nodes {
              id,
              name,
              avatarUrl,
              url
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
          repositories(first: ${ totalCount }, orderBy: {field: ${ sortBy }, direction: DESC}, affiliations: [${ affiliations }]) {
            totalCount
            nodes {
              id
              name
              nameWithOwner
              description
              url
              stargazers {
                totalCount
              }
              forkCount
              updatedAt
              languages(first:1, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                  color
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.github.query(`token ${ token }`, graphql);
    if (result.errors) {
      throw new BadRequestException(JSON.stringify(result.errors));
    }
    const viewer = result.data.viewer;
    viewer.repositories.nodes.forEach(repo => {
      if (repo.languages.nodes.length) {
        repo.language = repo.languages.nodes[0];
      }
    });

    if (excludes.length) {
      result.data.viewer.repositories.nodes = result.data.viewer.repositories.nodes
        .filter(repo => !excludes.includes(repo.nameWithOwner))
        .filter((repo, index) => index < 9);
    }
    return result.data.viewer;
  }
}
