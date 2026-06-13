(function () {
  const storageKey = window.PORTFOLIO_STORAGE_KEY;
  const sessionKey = window.PORTFOLIO_ADMIN_SESSION_KEY;
  const editorPanel = document.getElementById('editor-panel');
  const form = document.getElementById('editor-form');
  const addButton = document.getElementById('add-button');
  const panelTitle = document.getElementById('panel-title');
  const panelDesc = document.getElementById('panel-desc');
  const languageSelect = document.getElementById('language-select');

  if (sessionStorage.getItem(sessionKey) !== 'true') {
    window.location.href = './admin.html';
    return;
  }

  let activePanel = 'hero';
  let content = load();

  const panelMeta = {
    hero: ['첫 화면', '이름, 직무, 소개 문구, 버튼 위치를 수정합니다.'],
    about: ['소개', '3단 카드의 제목, 아이콘, 태그, 설명을 수정합니다.'],
    experience: ['경력', '회사, 기간, 요약, 상세 업무를 수정합니다.'],
    projects: ['프로젝트', '카테고리, 카드 문구, 주요 업무, 성과를 수정합니다.'],
    skills: ['기술스택', '첨부 이미지처럼 행 단위 기술스택을 수정합니다.'],
    layout: ['레이아웃 / 페이지', '섹션 순서와 추가 페이지를 관리합니다.'],
    json: ['JSON 백업', '전체 데이터를 내보내거나 복원합니다.']
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved && (!saved.ko || !saved.en || !saved.settings)) {
        localStorage.removeItem(storageKey);
        return normalizeContent(clone(window.DEFAULT_SITE_CONTENT));
      }
      return normalizeContent(saved || clone(window.DEFAULT_SITE_CONTENT));
    } catch {
      return normalizeContent(clone(window.DEFAULT_SITE_CONTENT));
    }
  }

  function normalizeContent(siteContent) {
    ['ko', 'en'].forEach(lang => {
      const defaultProjects = window.DEFAULT_SITE_CONTENT?.[lang]?.projects?.items || [];
      const defaultByTitle = new Map(defaultProjects.map(project => [project.title, project]));
      (siteContent[lang]?.projects?.items || []).forEach(project => {
        const defaultProject = defaultByTitle.get(project.title);
        if (!Array.isArray(project.tasks) || !project.tasks.length) {
          project.tasks = Array.isArray(defaultProject?.tasks) ? defaultProject.tasks : [];
        }
        if (!Array.isArray(project.results) || !project.results.length) {
          project.results = Array.isArray(project.bullets) && project.bullets.length
            ? project.bullets
            : Array.isArray(defaultProject?.results)
              ? defaultProject.results
              : [];
        }
      });
    });
    return siteContent;
  }

  function save() {
    collect();
    localStorage.setItem(storageKey, JSON.stringify(content));
    alert('저장했습니다. 홈페이지를 새로고침하면 반영됩니다.');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function getLang() {
    return languageSelect.value;
  }

  function getByPath(path) {
    return path.split('.').reduce((acc, key) => acc?.[key], content);
  }

  function setByPath(path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, key) => acc[key], content);
    target[last] = value;
  }

  function field(label, path, type = 'text') {
    const value = getByPath(path);
    const id = `field-${path.replaceAll('.', '-')}`;
    const control =
      type === 'textarea'
        ? `<textarea id="${id}" data-path="${path}" rows="4">${escapeHtml(value)}</textarea>`
        : `<input id="${id}" data-path="${path}" value="${escapeHtml(value)}" />`;
    return `<label class="admin-field"><span>${label}</span>${control}</label>`;
  }

  function selectField(label, path, options) {
    const value = getByPath(path);
    return `
      <label class="admin-field">
        <span>${label}</span>
        <select data-path="${path}">
          ${options.map(option => `<option value="${option}" ${option === value ? 'selected' : ''}>${option}</option>`).join('')}
        </select>
      </label>
    `;
  }

  function arrayField(label, path) {
    const value = getByPath(path) || [];
    const id = `field-${path.replaceAll('.', '-')}`;
    return `
      <label class="admin-field">
        <span>${label}</span>
        <textarea id="${id}" data-path="${path}" data-array="true" rows="4">${escapeHtml(value.join('\n'))}</textarea>
      </label>
    `;
  }

  function fileField(label, path) {
    return `
      <label class="admin-field file-field">
        <span>${label}</span>
        <input type="file" data-media-upload="${path}" accept="image/*,video/mp4,video/webm,video/ogg" multiple />
        <small>사진 또는 영상을 선택하면 assets/project-media 폴더에 저장되고 상세 미디어 목록에 자동 추가됩니다.</small>
      </label>
    `;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadFile(file) {
    const body = JSON.stringify({
      name: file.name,
      type: file.type,
      dataUrl: await readFileAsDataUrl(file)
    });
    const uploadTo = endpoint => fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    let response = await uploadTo('/api/upload-media').catch(() => null);
    if (!response || !response.ok) {
      response = await uploadTo('http://127.0.0.1:4175/api/upload-media').catch(() => null);
    }
    if (!response || !response.ok) {
      response = await uploadTo('http://127.0.0.1:4176/api/upload-media').catch(() => null);
    }
    if (!response || !response.ok) throw new Error('upload failed');
    return (await response.json()).url;
  }

  function collect() {
    form.querySelectorAll('[data-path]').forEach(input => {
      const current = getByPath(input.dataset.path);
      const value = input.dataset.array === 'true' || Array.isArray(current)
        ? input.value.split('\n').map(v => v.trim()).filter(Boolean)
        : input.value;
      setByPath(input.dataset.path, value);
    });
  }

  function cardEditor(item, path, fields) {
    return `
      <article class="editor-card">
        ${fields.map(config => editorField(path, config)).join('')}
        <button class="button small-button danger-button" data-remove="${path}" type="button">삭제</button>
      </article>
    `;
  }

  function editorField(path, config) {
    if (config.kind === 'textarea') return field(config.label, `${path}.${config.key}`, 'textarea');
    if (config.kind === 'array') return arrayField(config.label, `${path}.${config.key}`);
    if (config.kind === 'select') return selectField(config.label, `${path}.${config.key}`, config.options);
    if (config.kind === 'file') return fileField(config.label, `${path}.${config.key}`);
    return field(config.label, `${path}.${config.key}`);
  }

  function projectEditor(item, path, fields) {
    return `
      <details class="editor-card project-editor-card">
        <summary class="project-editor-summary">
          <span class="project-editor-category">${escapeHtml(item.category || '카테고리 없음')}</span>
          <strong>${escapeHtml(item.title || '제목 없음')}</strong>
          <span class="project-editor-toggle">펼치기</span>
        </summary>
        <div class="project-editor-fields">
          ${fields.map(config => editorField(path, config)).join('')}
          <button class="button small-button danger-button" data-remove="${path}" type="button">삭제</button>
        </div>
      </details>
    `;
  }

  function renderHero() {
    const lang = getLang();
    form.innerHTML = `
      <div class="editor-grid">
        ${field('브랜드명', `${lang}.brand`)}
        ${field('이름', `${lang}.hero.name`)}
        ${field('직무 타이틀', `${lang}.hero.role`)}
        ${selectField('문구 정렬', `${lang}.hero.align`, ['left', 'center'])}
        ${selectField('버튼 위치', `${lang}.hero.buttonAlign`, ['left', 'center', 'right'])}
        ${field('메인 버튼 문구', `${lang}.hero.primaryCta`)}
        ${field('메인 버튼 링크', `${lang}.hero.primaryHref`)}
        ${field('보조 버튼 문구', `${lang}.hero.secondaryCta`)}
      </div>
      ${field('소개 문구', `${lang}.hero.copy`, 'textarea')}
    `;
    addButton.hidden = true;
  }

  function renderAbout() {
    const lang = getLang();
    form.innerHTML = `
      <div class="editor-grid">${field('섹션 제목', `${lang}.about.title`)}${field('서브타이틀', `${lang}.about.subtitle`)}</div>
      ${(content[lang].about.cards || []).map((_, index) =>
        cardEditor(_, `${lang}.about.cards.${index}`, [
          { label: '픽토그램', key: 'icon' },
          { label: '제목', key: 'title' },
          { label: '태그', key: 'tags', kind: 'array' },
          { label: '본문', key: 'body', kind: 'textarea' },
          { label: '성과 bullet', key: 'bullets', kind: 'array' }
        ])
      ).join('')}
    `;
    addButton.hidden = false;
  }

  function renderExperience() {
    const lang = getLang();
    form.innerHTML = `
      <div class="editor-grid">${field('섹션 제목', `${lang}.experience.title`)}${field('서브타이틀', `${lang}.experience.subtitle`)}</div>
      ${(content[lang].experience.items || []).map((_, index) =>
        cardEditor(_, `${lang}.experience.items.${index}`, [
          { label: '회사 로고 텍스트', key: 'logo' },
          { label: '회사명', key: 'company' },
          { label: '직급/부서', key: 'role' },
          { label: '기간', key: 'period' },
          { label: '요약', key: 'summary', kind: 'textarea' },
          { label: '하이라이트', key: 'highlights', kind: 'array' }
        ])
      ).join('')}
      <p class="editor-note">상세 업무 블록은 JSON 백업 탭에서 blocks 배열로 세부 편집할 수 있습니다.</p>
    `;
    addButton.hidden = false;
  }

  function renderProjects() {
    const lang = getLang();
    form.innerHTML = `
      <div class="editor-grid">
        ${field('섹션 제목', `${lang}.projects.title`)}
        ${field('서브타이틀', `${lang}.projects.subtitle`)}
        ${arrayField('카테고리', `${lang}.projects.categories`)}
      </div>
      ${(content[lang].projects.items || []).map((_, index) =>
        projectEditor(_, `${lang}.projects.items.${index}`, [
          { label: '카테고리', key: 'category' },
          { label: '기간', key: 'date' },
          { label: '제목', key: 'title' },
          { label: '역할', key: 'role' },
          { label: '본문', key: 'body', kind: 'textarea' },
          { label: '사진/영상 첨부', key: 'media', kind: 'file' },
          { label: '상세 미디어 URL', key: 'media', kind: 'array' },
          { label: '태그', key: 'chips', kind: 'array' },
          { label: '주요 업무', key: 'tasks', kind: 'array' },
          { label: '성과', key: 'results', kind: 'array' }
        ])
      ).join('')}
      <p class="editor-note">상세 창의 주요 업무와 성과는 각각 별도로 노출됩니다. 카드에는 개요와 기술 스택/범위만 노출됩니다.</p>
    `;
    addButton.hidden = false;
  }

  function renderSkills() {
    const lang = getLang();
    form.innerHTML = `
      <div class="editor-grid">${field('섹션 제목', `${lang}.skills.title`)}${field('서브타이틀', `${lang}.skills.subtitle`)}</div>
      ${(content[lang].skills.groups || []).map((_, index) =>
        cardEditor(_, `${lang}.skills.groups.${index}`, [
          { label: '아이콘', key: 'icon' },
          { label: '그룹명', key: 'title' },
          { label: '스택/역량', key: 'chips', kind: 'array' }
        ])
      ).join('')}
    `;
    addButton.hidden = false;
  }

  function renderLayout() {
    form.innerHTML = `
      <div class="editor-grid">
        ${arrayField('섹션 순서', 'settings.sectionOrder')}
        ${selectField('기본 테마', 'settings.defaultTheme', ['dark', 'light'])}
      </div>
      <h3>추가 페이지</h3>
      ${(content.settings.customPages || []).map((_, index) =>
        cardEditor(_, `settings.customPages.${index}`, [
          { label: '섹션 ID', key: 'id' },
          { label: '제목', key: 'title' },
          { label: '서브타이틀', key: 'subtitle' },
          { label: '본문', key: 'body', kind: 'textarea' }
        ])
      ).join('')}
    `;
    addButton.hidden = false;
  }

  function renderJson() {
    form.innerHTML = `
      <textarea id="json-area" rows="22" spellcheck="false">${escapeHtml(JSON.stringify(content, null, 2))}</textarea>
      <div class="admin-actions">
        <button class="button" id="import-json" type="button">JSON 적용</button>
        <button class="button" id="reset-button" type="button">기본값 초기화</button>
      </div>
    `;
    addButton.hidden = true;
    document.getElementById('import-json').addEventListener('click', () => {
      try {
        content = JSON.parse(document.getElementById('json-area').value);
        localStorage.setItem(storageKey, JSON.stringify(content));
        renderActive();
        alert('JSON을 적용했습니다.');
      } catch {
        alert('JSON 형식을 확인해주세요.');
      }
    });
    document.getElementById('reset-button').addEventListener('click', () => {
      if (!confirm('기본값으로 되돌릴까요?')) return;
      localStorage.removeItem(storageKey);
      content = clone(window.DEFAULT_SITE_CONTENT);
      renderActive();
    });
  }

  function renderActive() {
    const [title, desc] = panelMeta[activePanel];
    panelTitle.textContent = title;
    panelDesc.textContent = desc;
    ({ hero: renderHero, about: renderAbout, experience: renderExperience, projects: renderProjects, skills: renderSkills, layout: renderLayout, json: renderJson }[activePanel])();
  }

  function addItem() {
    collect();
    const lang = getLang();
    const templates = {
      about: { icon: '◈', tags: ['Tag'], title: '새 소개 카드', body: '설명을 입력하세요.', bullets: ['성과를 입력하세요.'] },
      experience: { company: '새 회사', role: '직무', period: '기간', logo: 'N', summary: '요약을 입력하세요.', highlights: ['핵심 업무'], blocks: [] },
      projects: { category: content[lang].projects.categories[0] || 'PR', date: '기간', title: '새 프로젝트', role: '역할', body: '프로젝트 설명을 입력하세요.', media: [], chips: ['Tag'], tasks: ['주요 업무'], results: ['성과'] },
      skills: { icon: '⌁', title: '새 기술스택', chips: ['항목'] },
      layout: { id: `page-${Date.now()}`, title: '새 페이지', subtitle: '서브타이틀', body: '본문을 입력하세요.', enabled: true }
    };
    if (activePanel === 'layout') content.settings.customPages.push(templates.layout);
    else if (activePanel === 'skills') content[lang].skills.groups.push(templates.skills);
    else if (activePanel === 'projects') content[lang].projects.items.push(templates.projects);
    else if (activePanel === 'experience') content[lang].experience.items.push(templates.experience);
    else if (activePanel === 'about') content[lang].about.cards.push(templates.about);
    renderActive();
  }

  function showEditor() {
    renderActive();
  }

  document.getElementById('save-button').addEventListener('click', save);
  document.getElementById('logout-button').addEventListener('click', () => {
    sessionStorage.removeItem(sessionKey);
    window.location.href = './admin.html';
  });
  languageSelect.addEventListener('change', () => {
    collect();
    renderActive();
  });
  addButton.addEventListener('click', addItem);
  form.addEventListener('click', event => {
    const removePath = event.target.dataset.remove;
    if (!removePath) return;
    collect();
    const parts = removePath.split('.');
    const index = Number(parts.pop());
    const array = getByPath(parts.join('.'));
    if (Array.isArray(array) && confirm('이 항목을 삭제할까요?')) {
      array.splice(index, 1);
      renderActive();
    }
  });
  form.addEventListener('change', event => {
    const uploadPath = event.target.dataset.mediaUpload;
    if (!uploadPath) return;
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    collect();
    const media = getByPath(uploadPath) || [];
    Promise.all(files.map(uploadFile)).then(urls => {
      setByPath(uploadPath, media.concat(urls));
      renderActive();
      alert('첨부한 파일을 assets/project-media 폴더에 저장했습니다. 저장 버튼을 눌러 반영해주세요.');
    }).catch(() => {
      alert('파일 저장에 실패했습니다. node server.js로 실행 중인지 확인해주세요.');
    });
  });
  document.querySelectorAll('.editor-tab').forEach(button => {
    button.addEventListener('click', () => {
      collect();
      activePanel = button.dataset.panel;
      document.querySelectorAll('.editor-tab').forEach(tab => tab.classList.toggle('active', tab === button));
      renderActive();
    });
  });

  if (editorPanel) showEditor();
})();
