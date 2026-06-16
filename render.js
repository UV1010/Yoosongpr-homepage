(function () {
  const storageKey = window.PORTFOLIO_STORAGE_KEY;
  const themeKey = 'yoo-portfolio-theme';
  const lang = document.documentElement.lang === 'en' || location.pathname.endsWith('/en.html') ? 'en' : 'ko';

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function merge(base, override) {
    if (Array.isArray(base)) return Array.isArray(override) ? override : base;
    if (!base || typeof base !== 'object') return override ?? base;
    const next = { ...base };
    if (!override || typeof override !== 'object') return next;
    Object.keys(override).forEach(key => {
      next[key] = merge(base[key], override[key]);
    });
    return next;
  }

  function getAllContent() {
    try {
      const defaults = clone(window.DEFAULT_SITE_CONTENT);
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved && (!saved.ko || !saved.en || !saved.settings)) {
        localStorage.removeItem(storageKey);
        return defaults;
      }
      return normalizeProjectSections(merge(defaults, saved), window.DEFAULT_SITE_CONTENT);
    } catch {
      return clone(window.DEFAULT_SITE_CONTENT);
    }
  }

  function normalizeProjectSections(siteContent, defaults) {
    const hasUsableMedia = media => Array.isArray(media) && media.some(item => String(item || '').trim());
    const hasRextremeResults = values => Array.isArray(values) && values.some(value => /REXTREME|렉스트림|참가자 모집|홍범석|몬스터에너지|후원사/.test(String(value || '')));
    const isAppexProject = project => /APPEX|해외 전시회|전시회 홍보 부스/.test(String(project?.title || ''));
    ['ko', 'en'].forEach(contentLang => {
      const defaultExperiences = defaults?.[contentLang]?.experience?.items || [];
      const defaultExperienceByCompany = new Map(defaultExperiences.map(item => [item.company, item]));
      (siteContent[contentLang]?.experience?.items || []).forEach(item => {
        const defaultItem = defaultExperienceByCompany.get(item.company);
        item.logoDark = stableLogoUrl(item.logoDark || defaultItem?.logoDark || '');
        item.logoLight = stableLogoUrl(item.logoLight || defaultItem?.logoLight || '');
      });
      const defaultProjects = defaults?.[contentLang]?.projects?.items || [];
      const defaultByTitle = new Map(defaultProjects.map(project => [project.title, project]));
      const fallbackCompany = siteContent[contentLang]?.experience?.items?.[0]?.company || '';
      if (!siteContent[contentLang]?.hero?.featuredProject) {
        siteContent[contentLang].hero.featuredProject = defaults?.[contentLang]?.hero?.featuredProject || defaultProjects[0]?.title || '';
      }
      (siteContent[contentLang]?.projects?.items || []).forEach(project => {
        const defaultProject = defaultByTitle.get(project.title);
        if (!project.company) project.company = defaultProject?.company || fallbackCompany;
        if (!hasUsableMedia(project.media)) {
          project.media = Array.isArray(defaultProject?.media) ? defaultProject.media : [];
        }
        if (!Array.isArray(project.tasks) || !project.tasks.length) {
          project.tasks = Array.isArray(defaultProject?.tasks) ? defaultProject.tasks : [];
        }
        if (isAppexProject(project) && (hasRextremeResults(project.results) || hasRextremeResults(project.bullets))) {
          project.results = [];
          project.bullets = [];
        }
        if (!Array.isArray(project.results)) {
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

  function getContent() {
    const all = getAllContent();
    return { settings: all.settings, ...all[lang] };
  }

  function stableLogoUrl(url) {
    return String(url || '')
      .replace('새방_다크.png', 'sebang-dark.png')
      .replace('세방_화이트.png', 'sebang-light.png')
      .replace('일양_다크.png', 'ilyang-dark.png')
      .replace('일양_화이트.png', 'ilyang-light.png');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function list(items) {
    const values = (items || []).filter(item => String(item || '').trim());
    if (!values.length) return '';
    return `<ul>${values.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  function lineBreakText(items) {
    const value = Array.isArray(items) ? items.filter(item => String(item || '').trim()).join('\n') : String(items || '');
    if (!value.trim()) return '';
    const html = value
      .split('\n')
      .map(line => escapeHtml(line).replace(/^[ \t]+/, spaces => spaces.replaceAll(' ', '&nbsp;').replaceAll('\t', '&nbsp;&nbsp;&nbsp;&nbsp;')))
      .join('<br>');
    return `<p class="line-break-text">${html}</p>`;
  }

  function articleHostname(url) {
    try {
      return new URL(url, window.location.href).hostname.replace(/^www\./, '');
    } catch {
      return url || '';
    }
  }

  function articleCards(items) {
    const values = (items || [])
      .map(item => typeof item === 'string' ? { url: item } : item)
      .filter(item => item && [item.url, item.title, item.description, item.image].some(value => String(value || '').trim()));
    if (!values.length) return '';
    return `
      <div class="article-bookmarks">
        ${values.map(item => {
          const url = item.url || '#';
          const host = articleHostname(url);
          const title = item.title || host || url;
          return `
            <a class="article-bookmark" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
              <span class="article-bookmark-copy">
                <strong>${escapeHtml(title)}</strong>
                ${item.description ? `<em>${escapeHtml(item.description)}</em>` : ''}
                <small>${escapeHtml(host || url)}</small>
              </span>
              ${item.image ? `<span class="article-bookmark-image"><img src="${escapeHtml(item.image)}" alt="" loading="lazy" /></span>` : ''}
            </a>
          `;
        }).join('')}
      </div>
    `;
  }

  function multilineList(value, className = '') {
    const values = String(value || '')
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean);
    if (!values.length) return '';
    const classAttr = className ? ` class="${escapeHtml(className)}"` : '';
    return `<ul${classAttr}>${values.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  function chips(items) {
    const values = (items || []).filter(item => String(item || '').trim());
    if (!values.length) return '';
    return `<div class="chips">${values.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>`;
  }

  function tags(items) {
    const values = (items || []).filter(Boolean);
    if (!values.length) return '';
    return `<div class="card-tags">${values.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>`;
  }

  function heroContactIcons(data) {
    const contact = data.contact || {};
    const email = String(contact.email || '').trim();
    const phone = String(contact.phone || '').trim();
    const phoneHref = phone.replace(/[^\d+]/g, '');
    const items = [
      {
        label: 'Instagram',
        href: contact.instagram || contact.instagramUrl || '#contact',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="4.5" width="15" height="15" rx="4.2"></rect><circle cx="12" cy="12" r="3.7"></circle><circle cx="16.8" cy="7.2" r="0.8"></circle></svg>'
      },
      {
        label: 'Email',
        href: email ? `mailto:${email}` : '',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"></rect><path d="M4.5 7l7.5 6 7.5-6"></path></svg>'
      },
      {
        label: 'Phone',
        href: phoneHref ? `tel:${phoneHref}` : '',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2.4"></rect><path d="M10.5 17.5h3"></path></svg>'
      }
    ].filter(item => item.href);
    if (!items.length) return '';
    return `
      <div class="socials" aria-label="Contact links">
        ${items.map(item => `
          <a href="${escapeHtml(item.href)}" aria-label="${escapeHtml(item.label)}" data-tooltip="${escapeHtml(item.label)}">
            ${item.icon}
          </a>
        `).join('')}
      </div>
    `;
  }

  function companyLogo(company, className = '') {
    if (!company) return '';
    const fallback = company.logo || company.company?.slice(0, 2) || '';
    const darkLogo = company.logoDark || company.logoLight || '';
    const lightLogo = company.logoLight || company.logoDark || '';
    if (!darkLogo && !lightLogo) {
      return `<span class="company-logo ${className}"><span>${escapeHtml(fallback)}</span></span>`;
    }
    return `
      <span class="company-logo company-logo-media ${className}" aria-label="${escapeHtml(company.company || fallback)} 로고">
        ${darkLogo ? `<img class="theme-logo theme-logo-dark" src="${escapeHtml(darkLogo)}" alt="" loading="lazy" onerror="this.hidden=true; this.closest('.company-logo').classList.add('logo-load-error');" />` : ''}
        ${lightLogo ? `<img class="theme-logo theme-logo-light" src="${escapeHtml(lightLogo)}" alt="" loading="lazy" onerror="this.hidden=true; this.closest('.company-logo').classList.add('logo-load-error');" />` : ''}
        <span class="logo-fallback">${escapeHtml(fallback)}</span>
      </span>
    `;
  }

  function getProjectCompany(item, data) {
    const companies = data.experience?.items || [];
    const selected = companies.find(company => company.company === item.company);
    if (selected) return selected;
    const defaultCompany = companies.find(company => company.company && item.title?.includes(company.company.split(' ')[0]));
    return defaultCompany || companies[0] || null;
  }

  function getYouTubeId(url) {
    const match = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
    return match ? match[1] : '';
  }

  function isVideoUrl(url) {
    return /^data:video\//i.test(String(url)) || /\.(mp4|webm|ogg)(\?.*)?$/i.test(String(url));
  }

  function renderHero(data) {
    const featuredProject = data.hero.featuredProject || '';
    return `
      <section class="hero hero-${escapeHtml(data.hero.align || 'center')}" aria-label="${lang === 'en' ? 'Portfolio intro' : '포트폴리오 소개'}">
        <div class="hero-inner">
          <h1>${escapeHtml(data.hero.name)}</h1>
          <p class="role">${escapeHtml(data.hero.role)}</p>
          <p class="hero-copy">${escapeHtml(data.hero.copy)}</p>
          <div class="hero-actions align-${escapeHtml(data.hero.buttonAlign || 'center')}">
            <a class="button" href="${escapeHtml(data.hero.primaryHref)}" download>${escapeHtml(data.hero.primaryCta)}</a>
            <a class="button" href="#projects" ${featuredProject ? `data-featured-project="${escapeHtml(featuredProject)}"` : ''}>${escapeHtml(data.hero.secondaryCta)}</a>
          </div>
          ${heroContactIcons(data)}
          <a class="scroll-cue" href="#about" aria-label="Scroll"><span>${escapeHtml(data.ui.scroll)}</span><i></i></a>
        </div>
      </section>
    `;
  }

  function renderAbout(data) {
    return `
      <section id="about" class="section">
        <div class="section-title"><h2>${escapeHtml(data.about.title)}</h2><p>${escapeHtml(data.about.subtitle)}</p></div>
        <div class="card-grid three">
          ${(data.about.cards || [])
            .map(card => `
              <article class="glass-card about-card">
                <div class="card-title-row"><span class="card-icon">${escapeHtml(card.icon || '◈')}</span><h3>${escapeHtml(card.title)}</h3></div>
                ${tags(card.tags)}
                ${multilineList(card.body, 'about-body-list')}
              </article>
            `)
            .join('')}
        </div>
      </section>
    `;
  }

  function renderExperience(data) {
    return `
      <section id="experience" class="section wide-section">
        <div class="section-title"><h2>${escapeHtml(data.experience.title)}</h2><p class="pill">${escapeHtml(data.experience.subtitle)}</p></div>
        <div class="experience-stack">
          ${(data.experience.items || [])
            .map(item => {
              const blocks = item.blocks?.length ? item.blocks : [{ title: item.role, body: item.summary, bullets: item.highlights }];
              return `
              <article class="glass-card experience-card">
                <header class="experience-company-head">
                  <div class="experience-company-main">
                    ${companyLogo(item)}
                    <div>
                      <h3>${escapeHtml(item.company)}</h3>
                      <p>${escapeHtml(item.role)}</p>
                    </div>
                  </div>
                  <div class="experience-company-meta">
                    <span class="experience-period">${escapeHtml(item.period)}</span>
                    <span class="experience-tenure">${escapeHtml(item.tenure || '')}</span>
                  </div>
                </header>
                <div class="experience-timeline">
                  ${blocks
                      .map(block => `
                        <section class="experience-timeline-item">
                          <h4>${escapeHtml(block.title)}</h4>
                          ${block.period ? `<p class="experience-block-period">${escapeHtml(block.period)}</p>` : ''}
                          ${block.meta ? `<p class="experience-block-meta">${escapeHtml(block.meta)}</p>` : ''}
                          <button type="button" class="experience-detail-button" aria-expanded="false">${escapeHtml(lang === 'en' ? 'View details' : '상세 내용 보기')}</button>
                          <div class="experience-detail-panel" hidden>
                            ${list(block.bullets)}
                          </div>
                        </section>
                      `)
                      .join('')}
                </div>
              </article>
            `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  function projectCard(item, index, data) {
    const company = getProjectCompany(item, data);
    return `
      <article class="glass-card project-card" data-project-card="${index}" tabindex="0" role="button" aria-label="${escapeHtml(item.title)} 상세 보기">
        ${renderProjectThumb(item)}
        <div class="project-body">
          <button class="project-open" data-project-open="${index}" type="button" aria-label="${escapeHtml(item.title)} 상세 보기">↗</button>
          <div class="project-title-row">
            ${companyLogo(company, 'project-company-logo')}
            <h3>${escapeHtml(item.title)}</h3>
          </div>
          <p>${escapeHtml(item.body)}</p>
          ${chips(item.chips)}
        </div>
      </article>
    `;
  }

  function renderProjectThumb(item) {
    const media = (item.media || []).filter(Boolean);
    const first = media[0];
    if (!first) {
      return `
        <div class="project-visual project-visual-empty">
          <span>${lang === 'en' ? 'Add project media' : '프로젝트 미디어를 추가하세요'}</span>
          <span class="date-pill">${escapeHtml(item.date)}</span>
        </div>
      `;
    }
    const youtubeId = getYouTubeId(first);
    const label = `${item.title} preview`;
    if (youtubeId) {
      return `
        <div class="project-visual project-visual-media">
          <iframe src="https://www.youtube.com/embed/${escapeHtml(youtubeId)}" title="${escapeHtml(label)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <span class="date-pill">${escapeHtml(item.date)}</span>
        </div>
      `;
    }
    if (isVideoUrl(first)) {
      return `
        <div class="project-visual project-visual-media">
          <video src="${escapeHtml(first)}" muted playsinline preload="metadata"></video>
          <span class="date-pill">${escapeHtml(item.date)}</span>
        </div>
      `;
    }
    return `
      <div class="project-visual project-visual-media">
        <img src="${escapeHtml(first)}" alt="${escapeHtml(label)}" loading="lazy" />
        <span class="date-pill">${escapeHtml(item.date)}</span>
      </div>
    `;
  }

  function renderProjects(data) {
    const categories = data.projects.categories || [];
    const items = data.projects.items || [];
    const indexedItems = items.map((item, itemIndex) => ({ item, itemIndex }));
    return `
      <section id="projects" class="section project-section">
        <div class="section-title"><h2>${escapeHtml(data.projects.title)}</h2><p>${escapeHtml(data.projects.subtitle)}</p></div>
        <div class="project-tabs" role="tablist">
          ${categories.map((category, index) => `<button class="${index === 0 ? 'active' : ''}" data-project-tab="${escapeHtml(category)}" type="button">${escapeHtml(category)}</button>`).join('')}
        </div>
        <div class="project-carousel">
          ${categories
            .map((category, index) => {
              const categoryItems = indexedItems.filter(entry => entry.item.category === category);
              const pages = [];
              for (let i = 0; i < categoryItems.length; i += 4) pages.push(categoryItems.slice(i, i + 4));
              if (!pages.length) pages.push([]);
              return `
                <div class="project-track ${index === 0 ? 'active' : ''}" data-project-panel="${escapeHtml(category)}">
                  <div class="project-pages">
                    ${pages.map(page => `<div class="project-page">${page.map(entry => projectCard(entry.item, entry.itemIndex, data)).join('')}</div>`).join('')}
                  </div>
                  <div class="project-controls">
                    <button type="button" data-project-prev>${escapeHtml(data.ui.projectPrev)}</button>
                    <span class="project-dots">${pages.map((_, dotIndex) => `<i class="${dotIndex === 0 ? 'active' : ''}"></i>`).join('')}</span>
                    <button type="button" data-project-next>${escapeHtml(data.ui.projectNext)}</button>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
        <div class="project-modal" id="project-modal" aria-hidden="true">
          <button class="project-modal-backdrop" data-project-close type="button" aria-label="닫기"></button>
          <article class="project-modal-panel" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
            <button class="project-modal-close" data-project-close type="button" aria-label="닫기">×</button>
            <div id="project-modal-content"></div>
          </article>
        </div>
      </section>
    `;
  }

  function modalSection(title, body) {
    if (!body) return '';
    return `
      <section class="modal-section">
        <h3>${escapeHtml(title)}</h3>
        ${body}
      </section>
    `;
  }

  function renderMediaItem(url, index, title) {
    const youtubeId = getYouTubeId(url);
    const label = `${title} media ${index + 1}`;
    if (youtubeId) {
      return `
        <div class="project-media-item">
          <iframe src="https://www.youtube.com/embed/${escapeHtml(youtubeId)}" title="${escapeHtml(label)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <button class="media-play" data-media-play="${index}" type="button" aria-label="${escapeHtml(label)} 재생">▶</button>
          <button class="media-expand" data-media-expand="${index}" type="button" aria-label="${escapeHtml(label)} 크게 보기"></button>
        </div>
      `;
    }
    if (isVideoUrl(url)) {
      return `
        <div class="project-media-item">
          <video src="${escapeHtml(url)}" controls playsinline preload="metadata"></video>
          <button class="media-expand" data-media-expand="${index}" type="button" aria-label="${escapeHtml(label)} 크게 보기"></button>
        </div>
      `;
    }
    return `
      <div class="project-media-item">
        <img src="${escapeHtml(url)}" alt="${escapeHtml(label)}" loading="lazy" />
        <button class="media-expand" data-media-expand="${index}" type="button" aria-label="${escapeHtml(label)} 크게 보기"></button>
      </div>
    `;
  }

  function renderProjectMedia(item) {
    let media = (item.media || []).map(url => String(url || '').trim()).filter(Boolean);
    if (!media.length && /세방그룹 PR 광고 캠페인|Sebang Group PR Campaign/.test(item.title || '')) {
      media = ['./assets/project-media/pr1.jpg', './assets/project-media/pr2.jpg'];
    }
    if (!media.length) {
      return `
        <div class="project-media-empty">
          <p>${lang === 'en' ? 'Add image or video URLs in the admin editor to show project media here.' : '관리자 수정 페이지에서 이미지 또는 영상 URL을 추가하면 이곳에 표시됩니다.'}</p>
        </div>
      `;
    }
    return `
      <div class="project-media-carousel">
        <button class="media-nav media-prev" data-media-prev type="button" aria-label="${lang === 'en' ? 'Previous media' : '이전 미디어'}">‹</button>
        <div class="project-media-track" tabindex="0">
          ${media.map((url, index) => renderMediaItem(url, index, item.title)).join('')}
        </div>
        <button class="media-nav media-next" data-media-next type="button" aria-label="${lang === 'en' ? 'Next media' : '다음 미디어'}">›</button>
      </div>
      <div class="project-modal-count" data-media-count>01/${String(media.length).padStart(2, '0')}</div>
    `;
  }

  function renderProjectModalContent(item, data) {
    const company = getProjectCompany(item, data);
    const meta = [item.role, item.date, item.category].filter(Boolean);
    const resultTitle = lang === 'en' ? 'Outcomes' : '성과';
    const workTitle = lang === 'en' ? 'Key Responsibilities' : '주요 업무';
    const overviewTitle = lang === 'en' ? 'Overview' : '개요';
    const stackTitle = lang === 'en' ? 'Stack / Scope' : '기술 스택 / 범위';
    const articleTitle = lang === 'en' ? 'Articles & Works' : '작성기사 및 제작물';
    return `
      <header class="project-modal-head">
        <div class="project-modal-title-row">
          ${companyLogo(company, 'project-modal-company-logo')}
          <h2 id="project-modal-title">${escapeHtml(item.title)}</h2>
        </div>
        <div class="project-modal-meta">
          ${meta.map(value => `<span>${escapeHtml(value)}</span>`).join('')}
        </div>
      </header>
      ${renderProjectMedia(item)}
      ${modalSection(overviewTitle, item.body?.trim() ? `<p>${escapeHtml(item.body)}</p>` : '')}
      ${modalSection(stackTitle, chips(item.chips))}
      ${modalSection(workTitle, lineBreakText(item.tasks))}
      ${modalSection(resultTitle, lineBreakText(Array.isArray(item.results) ? item.results : item.bullets))}
      ${modalSection(articleTitle, articleCards(item.articles))}
    `;
  }

  function renderSkills(data) {
    return `
      <section id="skills" class="section">
        <div class="section-title"><h2>${escapeHtml(data.skills.title)}</h2><p>${escapeHtml(data.skills.subtitle)}</p></div>
        <div class="skill-stack">
          ${(data.skills.groups || [])
            .map(group => `
              <article class="glass-card skill-row">
                <div class="skill-name"><span class="card-icon">${escapeHtml(group.icon || '⌁')}</span><h3>${escapeHtml(group.title)}</h3></div>
                ${chips(group.chips)}
              </article>
            `)
            .join('')}
        </div>
      </section>
    `;
  }

  function renderContact(data) {
    const phoneHref = String(data.contact.phone || '').replace(/[^\d+]/g, '');
    return `
      <section id="contact" class="section contact-section">
        <div class="section-title"><h2>${escapeHtml(data.contact.title)}</h2><p>${escapeHtml(data.contact.subtitle)}</p></div>
        <article class="glass-card contact-card">
          <p>${escapeHtml(data.contact.body)}</p>
          <div class="contact-links">
            <a class="mail-link" href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a>
            ${data.contact.phone ? `<a class="phone-link" href="tel:${escapeHtml(phoneHref)}">${escapeHtml(data.contact.phone)}</a>` : ''}
          </div>
        </article>
      </section>
    `;
  }

  function renderCustomPages(data) {
    return (data.settings.customPages || [])
      .filter(page => page.enabled !== false)
      .map(page => `
        <section id="${escapeHtml(page.id || '')}" class="section custom-page">
          <div class="section-title"><h2>${escapeHtml(page.title)}</h2><p>${escapeHtml(page.subtitle || '')}</p></div>
          <article class="glass-card contact-card"><p>${escapeHtml(page.body || '')}</p></article>
        </section>
      `)
      .join('');
  }

  function setupProjects() {
    const data = getContent();
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('project-modal-content');

    if (modal && modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }

    function closeModal() {
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }

    function openModal(index) {
      const item = data.projects.items[Number(index)];
      if (!item || !modal || !modalContent) return;
      modalContent.innerHTML = renderProjectModalContent(item, data);
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      setupModalMedia(modal);
      modal.querySelector('.project-modal-close')?.focus();
    }

    document.querySelectorAll('[data-featured-project]').forEach(button => {
      button.addEventListener('click', event => {
        const title = button.dataset.featuredProject;
        const index = data.projects.items.findIndex(item => item.title === title);
        if (index < 0) return;
        event.preventDefault();
        openModal(index);
      });
    });

    function setupModalMedia(root) {
      const track = root.querySelector('.project-media-track');
      const counter = root.querySelector('[data-media-count]');
      const media = Array.from(root.querySelectorAll('.project-media-item')).map(item => {
        const iframe = item.querySelector('iframe');
        const video = item.querySelector('video');
        const image = item.querySelector('img');
        if (iframe) return { type: 'iframe', src: iframe.getAttribute('src'), title: iframe.getAttribute('title') || '' };
        if (video) return { type: 'video', src: video.getAttribute('src'), title: '' };
        if (image) return { type: 'image', src: image.getAttribute('src'), title: image.getAttribute('alt') || '' };
        return null;
      }).filter(Boolean);
      if (!track) return;
      const updateCounter = () => {
        const index = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        if (counter) {
          const current = String(Math.min(media.length, Math.max(1, index + 1))).padStart(2, '0');
          const total = String(Math.max(1, media.length)).padStart(2, '0');
          counter.textContent = `${current}/${total}`;
        }
      };
      root.querySelector('[data-media-prev]')?.addEventListener('click', () => {
        track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
      });
      root.querySelector('[data-media-next]')?.addEventListener('click', () => {
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
      });
      track.addEventListener('scroll', updateCounter, { passive: true });
      updateCounter();
      root.querySelectorAll('[data-media-expand]').forEach(button => {
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          openMediaViewer(media[Number(button.dataset.mediaExpand)]);
        });
      });
      root.querySelectorAll('[data-media-play]').forEach(button => {
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          const item = button.closest('.project-media-item');
          const iframe = item?.querySelector('iframe');
          if (!item || !iframe) return;
          const src = iframe.getAttribute('src') || '';
          iframe.setAttribute('src', src.includes('?') ? `${src}&autoplay=1` : `${src}?autoplay=1`);
          item.classList.add('is-playing');
        });
      });
      updateDots();
    }

    function openMediaViewer(media) {
      if (!media) return;
      const viewer = document.createElement('div');
      viewer.className = 'media-viewer';
      viewer.setAttribute('role', 'dialog');
      viewer.setAttribute('aria-modal', 'true');
      viewer.innerHTML = `
        <button class="media-viewer-backdrop" data-media-viewer-close type="button" aria-label="닫기"></button>
        <div class="media-viewer-panel">
          <button class="media-viewer-close" data-media-viewer-close type="button" aria-label="닫기">×</button>
          ${media.type === 'iframe'
            ? `<iframe src="${escapeHtml(media.src)}" title="${escapeHtml(media.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
            : media.type === 'video'
              ? `<video src="${escapeHtml(media.src)}" controls autoplay playsinline></video>`
              : `<img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.title)}" />`}
        </div>
      `;
      const closeViewer = () => viewer.remove();
      viewer.addEventListener('click', event => {
        if (event.target.closest('[data-media-viewer-close]')) closeViewer();
      });
      document.body.appendChild(viewer);
      viewer.querySelector('.media-viewer-close')?.focus();
    }

    document.querySelectorAll('[data-project-tab]').forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.projectTab;
        document.querySelectorAll('[data-project-tab]').forEach(item => item.classList.toggle('active', item === button));
        document.querySelectorAll('[data-project-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.projectPanel === category));
      });
    });

    document.querySelectorAll('.project-track').forEach(track => {
      let index = 0;
      const pages = track.querySelector('.project-pages');
      const pageCount = track.querySelectorAll('.project-page').length;
      const dots = track.querySelectorAll('.project-dots i');
      const update = () => {
        pages.style.transform = `translateX(${-index * 100}%)`;
        dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
      };
      track.querySelector('[data-project-prev]')?.addEventListener('click', () => {
        index = (index - 1 + pageCount) % pageCount;
        update();
      });
      track.querySelector('[data-project-next]')?.addEventListener('click', () => {
        index = (index + 1) % pageCount;
        update();
      });
    });

    document.querySelectorAll('[data-project-open]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        openModal(button.dataset.projectOpen);
      });
    });

    document.querySelectorAll('[data-project-card]').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.projectCard));
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openModal(card.dataset.projectCard);
        }
      });
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('[data-project-close]')) return;
      event.preventDefault();
      event.stopPropagation();
      closeModal();
    });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const viewer = document.querySelector('.media-viewer');
      if (viewer) {
        viewer.remove();
        return;
      }
      closeModal();
    });
  }

  function setupExperienceDetails() {
    document.querySelectorAll('.experience-detail-button').forEach(button => {
      button.addEventListener('click', () => {
        const panel = button.nextElementSibling;
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!isOpen));
        if (panel) panel.hidden = isOpen;
      });
    });
  }

  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem(themeKey, theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.textContent = theme === 'light' ? '☾' : '☼';
  }

  function setupTheme(defaultTheme) {
    const saved = localStorage.getItem(themeKey) || defaultTheme || 'dark';
    applyTheme(saved);
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      applyTheme(document.body.dataset.theme === 'light' ? 'dark' : 'light');
    });
  }

  function render() {
    const data = getContent();
    const languageHref = lang === 'en' ? './index.html' : './en.html';
    document.title = `${data.brand} | PR & Brand Marketing Portfolio`;
    document.querySelector('[data-render="brand"]').textContent = data.brand;
    document.querySelector('[data-render="language"]').setAttribute('href', languageHref);
    document.querySelector('[data-render="language"]').setAttribute('aria-label', data.ui.languageLabel);
    document.getElementById('theme-toggle').setAttribute('aria-label', data.ui.themeLabel);
    document.querySelector('.admin-link').textContent = data.ui.admin;

    document.getElementById('site-nav').innerHTML = (data.nav || [])
      .map(item => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
      .join('');

    const renderers = {
      about: renderAbout,
      experience: renderExperience,
      projects: renderProjects,
      skills: renderSkills,
      contact: renderContact
    };

    document.getElementById('top').innerHTML =
      renderHero(data) +
      (data.settings.sectionOrder || [])
        .map(section => (renderers[section] ? renderers[section](data) : ''))
        .join('') +
      renderCustomPages(data);

    document.getElementById('site-footer').innerHTML = `<span>${escapeHtml(data.footer)}</span>`;
    setupTheme(data.settings.defaultTheme);
    setupExperienceDetails();
    setupProjects();
  }

  window.getPortfolioContent = getContent;
  window.getAllPortfolioContent = getAllContent;
  window.renderPortfolio = render;
  render();
})();
