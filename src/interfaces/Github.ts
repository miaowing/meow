export interface Viewer {
  id: string;
  name: string;
  bio: string;
  login: string;
  avatarUrl: string;
  location: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  organizations: {
    nodes: Organization[];
    totalCount: number;
    pageInfo: PageInfo;
  };
  repositories: {
    nodes: Repository[];
    totalCount: number;
    pageInfo: PageInfo;
  };
}

export interface Organization {
  id: string;
  name: string;
  avatarUrl: string;
  url: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  haxPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface Repository {
  id: string;
  name: string;
  nameWithOwner: string;
  description: string;
  stargazers: { totalCount: number };
  forkCount: number;
  updatedAt: string;
  languages: {
    nodes: Language[];
  };
  language: Language;
}

export interface Language {
  name: string;
  color: string;
}

export interface Error {
  message: string;
  location: Location[];
}

export interface Location {
  line: number;
  column: number;
}
