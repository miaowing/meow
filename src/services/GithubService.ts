import { BadRequestException, Injectable } from '@nestjs/common';
import { BootValue } from '@nestcloud/boot';
import { get, put } from 'memory-cache';
import { GithubClient } from '../clients';
import { Viewer } from '../interfaces/Github';

@Injectable()
export class GithubService {
  private readonly GITHUB_DATA_CACHE = 'GITHUB_DATA_CACHE';
  private readonly CACHE_TIMEOUT = 3600000;
  @BootValue('github.token')
  private readonly token: string;
  @BootValue('github.projects.count', 9)
  private readonly repoCount: number;
  @BootValue('github.projects.sortBy', 'STARGAZERS')
  private readonly sortBy: string;
  @BootValue('github.projects.affiliations', ['OWNER'])
  private readonly affiliations: string[];
  @BootValue('github.projects.excludes', [])
  private readonly excludes: string[];
  @BootValue('github.organizations.excludes', [])
  private readonly orgExcludes: string[];

  constructor(
    private readonly github: GithubClient,
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
    const affiliations = this.affiliations.toString();
    const totalCount = this.repoCount + this.excludes.length;
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
          repositories(first: ${ totalCount }, orderBy: {field: ${ this.sortBy }, direction: DESC}, affiliations: [${ affiliations }]) {
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

    const result = await this.github.query(`token ${ this.token }`, graphql);
    if (result.errors) {
      throw new BadRequestException(JSON.stringify(result.errors));
    }
    const viewer = result.data.viewer;
    viewer.repositories.nodes.forEach(repo => {
      if (repo.languages.nodes.length) {
        repo.language = repo.languages.nodes[0];
      }
    });

    if (this.excludes.length) {
      result.data.viewer.repositories.nodes = result.data.viewer.repositories.nodes
        .filter(repo => !this.excludes.includes(repo.nameWithOwner))
        .filter((repo, index) => index < 9);
    }

    if (this.orgExcludes.length) {
      result.data.viewer.organizations.nodes = result.data.viewer.organizations.nodes
        .filter(org => !this.orgExcludes.includes(org.name));
    }
    return result.data.viewer;
  }
}
