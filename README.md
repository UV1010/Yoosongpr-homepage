# 홍보마케팅 포트폴리오 홈페이지

블로그의 개발자 포트폴리오 제작 흐름을 참고해, 홍보마케팅 직무에 맞게 재구성한 정적 홈페이지입니다.

## 구성

- `index.html`: 섹션과 포트폴리오 문구
- `styles.css`: 반응형 스타일
- `LiquidEther.js`: React Bits의 LiquidEther 옵션 API를 참고한 로컬 WebGL 배경 모듈
- `LiquidEther.css`: LiquidEther 컨테이너 스타일
- `app.js`: LiquidEther 효과를 히어로 영역에 마운트
- `content.js`: 경력기술서 기반 기본 문구 데이터
- `render.js`: 홈페이지 섹션 렌더링
- `admin.html`, `editor.html`, `admin.js`: 로그인과 문구 수정 관리자 페이지
- `server.js`: 홈페이지 미리보기와 프로젝트 미디어 업로드 서버
- `assets/project-media/`: 관리자에서 첨부한 프로젝트 사진/영상 저장 폴더
- `assets/marketing-hero.png`: 생성형 이미지로 만든 히어로 배경
- `assets/yuseongyeol-career-profile.pdf`: 경력기술서 다운로드 파일

## 실행

React/Three 의존성 없이 로컬 WebGL로 동작하도록 구성했습니다. 프로젝트 사진/영상 첨부 기능을 쓰려면 아래 서버로 실행하세요.

```bash
node server.js
```

그 다음 `http://localhost:4174`로 접속하면 됩니다.

관리자 페이지는 `http://localhost:4174/admin.html`에서 열 수 있습니다. 저장한 문구는 브라우저 로컬 저장소에 보관되며, 첨부한 프로젝트 사진/영상은 `assets/project-media/` 폴더에 저장됩니다.

React 프로젝트로 옮길 때는 `LiquidEther.js` 위치에 React Bits 원본 컴포넌트를 넣고, `app.js` 대신 React 앱의 히어로 컴포넌트에서 렌더링하면 됩니다.

## 수정하면 좋은 부분

- `Your Name`, `hello@example.com`
- 대표 프로젝트 3개
- 성과 수치 4개
- 보유 툴과 채널
- 실제 이력서, 노션, 링크드인 링크

브라우저에서 `index.html`을 열면 바로 확인할 수 있습니다.
