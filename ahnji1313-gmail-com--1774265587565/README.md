**README.md**

# 2-4반 News
개인용 뉴스 웹사이트

## 개요
이 프로젝트는 개인용 뉴스 웹사이트입니다. 구글 계정 `ahnji1313@gmail.com`로 로그인한 경우에만 수정이 가능합니다.

## badges

[![Netlify Status](https://api.netlify.com/api/v1/badges/7d9e8a8b-ec5d-4e5f-9c8f-9a6f7d6f5e4d/deploy-status)](https://app.netlify.com/sites/2-4반-news/deploys)
[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start (3min)

1. 프로젝트를 클론합니다: `git clone https://github.com/ahnji1313/2-4반-news.git`
2. Netlify에 배포합니다: `npm run deploy`

## Install Guide

### Dependencies

* `npm install`을 실행하여 모든 의존성을 설치합니다.

### Environment Variables

* `GOOGLE_ACCOUNT`: 구글 계정 `ahnji1313@gmail.com`입니다.
* `NEWS_API_KEY`: 뉴스 API 키입니다.

### Env Vars Table

| Env Var | Description | Default Value |
| --- | --- | --- |
| GOOGLE_ACCOUNT | 구글 계정 ahnji1313@gmail.com | - |
| NEWS_API_KEY | 뉴스 API 키 | - |

## API Reference

### `/api/news`

* GET: 뉴스 목록을 반환합니다.

### `/api/news/:id`

* GET: 뉴스 단건을 반환합니다.

## Architecture Diagram

```
+---------------+
|  Client    |
+---------------+
        |
        |  HTTP
        v
+---------------+
|  Server    |
|  (Express)  |
+---------------+
        |
        |  Database
        v
+---------------+
|  Database  |
|  (MongoDB) |
+---------------+
```

## Contributing Guide

이 프로젝트에 기여하는 방법은 다음과 같습니다:

1. 프로젝트를 클론합니다: `git clone https://github.com/ahnji1313/2-4반-news.git`
2. 새로운 브랜치를 생성합니다: `git branch new-feature`
3. 새로운 브랜치에 변경 사항을 적용합니다: `git add . && git commit -m "새로운 기능"`
4. 변경 사항을 원격 저장소에 푸시합니다: `git push origin new-feature`
5. PR을 열어주세요!

## License

이 프로젝트는 MIT 라이센스를 사용합니다.

## Contact

* ahnji1313@gmail.com

## Commit Message

* commit message는 명령어를 포함하여야 합니다. (e.g. `fix: 로그인 버그`)
* commit message는 50자 이내여야 합니다.