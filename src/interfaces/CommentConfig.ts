export interface CommentConfig {
  engine?: string;
  appId?: string;
  appKey?: string;
  extras?: Valine;
}

export interface Valine {
  placeholder: string;
  notify: boolean;
  verify: boolean;
}
