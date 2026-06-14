# PR & Brand Marketing Portfolio

홍보마케팅 기반 포트폴리오 홈페이지입니다. 한국어/영문 페이지, 다크/화이트 모드, 프로젝트 상세 모달, 관리자 편집 화면, 프로젝트 이미지/영상 첨부 기능을 포함합니다.

## 주요 기능

- 한국어 메인 페이지: `index.html`
- 영문 페이지: `en.html`
- 관리자 로그인: `admin.html`
- 콘텐츠 에디터: `editor.html`
- 프로젝트 상세 모달과 16:9 이미지/영상 갤러리
- 라이트/다크 테마 전환
- LiquidEther 기반 히어로 모션 배경
- 프로젝트 미디어 업로드 서버

## 폴더 구조

```text
marketing-portfolio/
├── index.html
├── en.html
├── admin.html
├── editor.html
├── styles.css
├── content.js
├── render.js
├── app.js
├── admin-login.js
├── admin.js
├── LiquidEther.js
├── LiquidEther.css
├── server.js
├── package.json
└── assets/
    ├── marketing-hero.png
    ├── yuseongyeol-career-profile.pdf
    └── project-media/
```

## 로컬 실행

Node.js만 있으면 별도 패키지 설치 없이 실행할 수 있습니다.

```bash
node server.js
```

접속 주소:

```text
http://localhost:4174
```

관리자 페이지:

```text
http://localhost:4174/admin.html
```

## 코드 점검

```bash
node --check app.js
node --check admin.js
node --check admin-login.js
node --check content.js
node --check LiquidEther.js
node --check render.js
node --check server.js
```

`npm`을 사용할 수 있는 환경이라면 `npm start`, `npm run check`도 사용할 수 있습니다.

## GitHub 업로드

```bash
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

GitHub Pages로 정적 배포할 경우 `index.html`, `en.html`, CSS, JS, `assets/` 파일은 동작합니다. 단, GitHub Pages는 서버 기능을 제공하지 않으므로 관리자에서 새 이미지/영상을 업로드하는 기능은 로컬 `server.js` 실행 환경에서만 저장됩니다.

## 관리자 편집 안내

관리자에서 `저장`을 누르면 현재 브라우저에 임시 저장됩니다. 이 상태는 다른 PC나 모바일에는 공유되지 않습니다.

모든 기기에 같은 내용을 배포하려면 로컬에서 `node server.js`로 실행한 뒤 관리자 페이지에서 `배포 파일 저장`을 누르세요. 이 버튼은 현재 편집 내용을 `content.js`에 반영합니다. 이후 GitHub에 `content.js`와 필요한 `assets/` 파일을 업로드하면 모든 기기에서 같은 내용이 보입니다.

GitHub Pages 주소에서 관리자 페이지를 열면 브라우저가 저장소 파일을 직접 수정할 수 없으므로 `배포 파일 저장` 버튼은 `content.js` 파일 다운로드로 동작합니다. 다운로드된 `content.js`로 기존 파일을 교체한 뒤 GitHub에 업로드하세요. 프로젝트 사진/영상 첨부는 로컬 서버 실행 시 `assets/project-media/` 폴더에 저장됩니다.

관리자 비밀번호는 프론트엔드 코드에 포함된 간단한 편집 진입용 장치입니다. GitHub에 공개 업로드하면 누구나 코드를 볼 수 있으므로, 실제 보안이 필요한 관리자 시스템으로 사용하지 마세요.

## 원본 백업

정리 전 원본은 상위 폴더의 `marketing-portfolio-original-backup-20260612-152615`에 보존되어 있습니다.
