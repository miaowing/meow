# MEOW

## Description

A simple personal homepage forked from [github/personal-website](https://github.com/github/personal-website), implements by nestjs.

![demo](https://static.i5sing.com/meow.png)

## Docker Start

```bash
docker run -itd --name meow -p 3000:3000 -v /root/meow:/app/dist/configs zfeng/meow:latest
```

## Configuration

Put this configuration in /root/meow/config.yaml.

```yaml
github:
  # github token
  token: 
  organizations:
    excludes:
    # - test
  projects:
    count: 9
    # PUSHED_AT STARGAZERS NAME CREATED_AT UPDATED_AT
    sortBy: STARGAZERS
    affiliations:
      - COLLABORATOR
      - ORGANIZATION_MEMBER
      - OWNER
    # exclude project
    excludes:
      # - test
      # - test

extras:
  # available for hire
  hire: false
  # icp number
  icp: 辽ICP备xxxxxxxx号

topics:
  - name: React
    webUrl: https://github.com/topics/react
    imageUrl: https://raw.githubusercontent.com/github/explore/6c6508f34230f0ac0d49e847a326429eefbfc030/topics/react/react.png

articles:
  # now only support ghost
  engine: ghost
  # the domain of your ghost blog
  url: https://example.com
  # ghost key
  key: 

comments:
  # now only support valine
  engine: valine
  appId: 
  appKey: 
  extras:
    placeholder: 快来留下您的评论吧
    notify: true
    verify: false

logger:
  level: info
  transports:
    - transport: console
      colorize: true
      datePattern: YYYY-MM-DD h:mm:ss
      label: meow
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run copy
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Miaowing](https://zf.ink)

## License

  Meow is [MIT licensed](LICENSE).
