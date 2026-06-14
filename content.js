window.PORTFOLIO_STORAGE_KEY = 'yoo-portfolio-content-v3';
window.PORTFOLIO_ADMIN_SESSION_KEY = 'yoo-portfolio-admin-session';
window.PORTFOLIO_ADMIN_PASSWORD = 'gksksla0216';

const sharedProjects = [
  {
    category: 'PR',
    company: '세방그룹 · 세방(주)',
    visual: 'visual-blue',
    date: '2025.01 - 2025.07',
    title: '세방그룹 PR 광고 캠페인',
    role: '그룹 PR 광고 운영',
    body: '대행사 선정, 경쟁 PT, 예산·일정 관리, 내부 보고, YouTube/TVC/택시 광고 집행까지 PR 캠페인 전 과정을 운영했습니다.',
    media: ['./assets/project-media/pr1.png', './assets/project-media/pr2.png'],
    chips: ['Group PR', 'YouTube', 'TVC', 'OOH'],
    tasks: ['대행사 선정 및 경쟁 PT 운영', 'YouTube/TVC/택시 광고 집행 관리', '예산·일정 관리 및 내부 보고자료 작성'],
    results: ['YouTube 노출 4,489만 건', '조회수 약 725만 건', '목표 대비 280% 초과 달성'],
    bullets: ['YouTube 노출 4,489만 건', '조회수 약 725만 건', '목표 대비 280% 초과 달성']
  },
  {
    category: 'Branding',
    company: '세방그룹 · 세방(주)',
    visual: 'visual-purple',
    date: '2025.09 - 2026.01',
    title: 'REXTREME 피트니스 레이스',
    role: '브랜드 프로모션 기획',
    body: '로케트배터리 스포츠 마케팅 프로모션으로 콘셉트, 로고, 디자인 가이드, 대행사 선정과 후원사 협의를 진행했습니다.',
    chips: ['Sports Marketing', 'Brand Design', 'Promotion'],
    tasks: ['행사 콘셉트 및 로고/디자인 가이드 기획', '대행사 선정과 후원사 협의 진행', '운영 예산과 현장 실행 계획 관리'],
    results: ['약 1,000명 참여', '10개 후원사 섭외', '약 1억 원 운영 예산 절감'],
    bullets: ['약 1,000명 참여', '10개 후원사 섭외', '약 1억 원 운영 예산 절감']
  },
  {
    category: 'Branding',
    company: '세방그룹 · 세방(주)',
    visual: 'visual-mint',
    date: '2024.11 - 2025.04',
    title: '세방그룹 홈페이지 구축',
    role: '브랜드 웹사이트 기획',
    body: '홈페이지 콘셉트와 로드맵 설정, 정보 취합, 원고 작성, 디자인 톤앤매너 감리, 미디어센터 운영 리포트를 담당했습니다.',
    chips: ['Website', 'Content', 'Brand UX'],
    tasks: ['홈페이지 콘셉트와 구축 로드맵 수립', '계열사 정보 취합 및 원고 작성', '디자인 톤앤매너 감리와 미디어센터 운영'],
    results: ['월평균 약 5,000명 방문', 'I-AWARD 2025 중견기업 부문 대상', '미디어센터 콘텐츠 관리'],
    bullets: ['월평균 약 5,000명 방문', 'I-AWARD 2025 중견기업 부문 대상', '미디어센터 콘텐츠 관리']
  },
  {
    category: 'SNS',
    company: '세방그룹 · 세방(주)',
    visual: 'visual-slate',
    date: '2024.11 - 2025.04',
    title: '로케트배터리 인스타그램 운영',
    role: 'SNS 채널 전략',
    body: 'SNS 채널 콘셉트와 운영전략, 콘텐츠·이벤트 기획, 메타 광고 운영, 월간 운영 리포트 작성을 담당했습니다.',
    chips: ['Instagram', 'Meta Ads', 'Content'],
    tasks: ['SNS 채널 콘셉트와 운영전략 수립', '콘텐츠·이벤트 기획 및 메타 광고 운영', '월간 운영 리포트 작성'],
    results: ['외주사 없이 약 5개월 운영', '팔로워 약 5,000명 확보'],
    bullets: ['외주사 없이 약 5개월 운영', '팔로워 약 5,000명 확보']
  },
  {
    category: 'Design',
    company: '일양약품(주)',
    visual: 'visual-light',
    date: '2017.02 - 2024.05',
    title: '일양약품 제품 디자인',
    role: '패키지·홍보물 디자인',
    body: 'OTC/ETC 의약품, 건강기능식품, 드링크 제품 패키지와 브로셔, 전시·심포지엄 홍보물을 기획하고 디자인했습니다.',
    chips: ['Package', 'CI/BI', 'Print'],
    tasks: ['의약품·건강기능식품 패키지 디자인', '브로셔·전시·심포지엄 홍보물 제작', '표기사항 검토와 인쇄 교정 감리'],
    results: ['연평균 10개 이상 신제품 디자인', '인쇄 교정 및 감리 진행'],
    bullets: ['연평균 10개 이상 신제품 디자인', '인쇄 교정 및 감리 진행']
  },
  {
    category: 'AI / DX',
    company: '세방그룹 · 세방(주)',
    visual: 'visual-ai',
    date: '2025',
    title: 'AI 업무 자동화 프로세스',
    role: 'DT 추진',
    body: '자재 재고 현황 파악, 발주서 생성, 보세운송차량 배차와 유니패스 신고 업무의 AI 자동화 프로세스 구축에 참여했습니다.',
    chips: ['AI Automation', 'Process', 'DX'],
    tasks: ['업무 자동화 대상 프로세스 정의', 'AI 활용 가이드와 내부 콘텐츠 제작', '자재·발주·배차·신고 업무 개선 참여'],
    results: ['AI 활용 가이드 제작', '카드뉴스 제작 및 게시'],
    bullets: ['AI 활용 가이드 제작', '카드뉴스 제작 및 게시']
  }
];

const sharedSkills = [
  { icon: '⌁', title: 'PR & Media', chips: ['보도자료', '언론 대응', '이슈 모니터링', '광고 심의'] },
  { icon: '◈', title: 'Brand Marketing', chips: ['브랜드 기획', '프로모션', 'OOH 광고', '스포츠 마케팅'] },
  { icon: '✦', title: 'Design & Content', chips: ['CI·BI 관리', '패키지 디자인', '사보 기획', '홈페이지 원고'] },
  { icon: '↯', title: 'Digital & AI', chips: ['SNS 운영', '메타 광고', 'AI 자동화', '운영 리포트'] }
];

window.DEFAULT_SITE_CONTENT = {
  settings: {
    defaultTheme: 'dark',
    sectionOrder: ['about', 'experience', 'projects', 'skills', 'contact'],
    customPages: []
  },
  ko: {
    brand: '유성열',
    nav: [
      { label: '소개', href: '#about' },
      { label: '경력', href: '#experience' },
      { label: '프로젝트', href: '#projects' },
      { label: '역량', href: '#skills' },
      { label: '연락처', href: '#contact' }
    ],
    ui: {
      admin: '관리',
      languageLabel: 'English page',
      themeLabel: '테마 변경',
      scroll: 'Scroll',
      projectPrev: '이전',
      projectNext: '다음'
    },
    hero: {
      name: '유성열',
      role: 'PR & Brand Marketing Specialist',
      copy: '그룹 PR, 브랜드 기획, 디자인, 언론홍보를 함께 다루며 브랜드 메시지가 실제 접점과 성과로 이어지도록 설계합니다.',
      align: 'center',
      buttonAlign: 'center',
      primaryCta: '경력기술서 다운로드',
      primaryHref: './assets/yuseongyeol-career-profile.pdf',
      secondaryCta: '대표 프로젝트 보기',
      featuredProject: '세방그룹 PR 광고 캠페인',
      socials: [
        { label: '이메일', href: 'mailto:hello@example.com', icon: '✉' },
        { label: '프로젝트', href: '#projects', icon: '◈' },
        { label: '경력', href: '#experience', icon: '↯' },
        { label: '연락처', href: '#contact', icon: '↗' }
      ]
    },
    about: {
      title: '소개',
      subtitle: '핵심 역량',
      cards: [
        {
          icon: '▣',
          tags: ['Group PR', '광고 집행'],
          title: '대규모 PR 캠페인 운영',
          body: '세방그룹 PR 광고를 위한 대행사 선정, 경쟁 PT, 예산·일정 관리, 내부 보고자료 작성까지 캠페인 운영 전반을 수행했습니다.',
          bullets: ['YouTube 광고 예산 2억 원 운영', '인스트림 15초 노출 4,489만 건, 조회수 약 725만 건 달성', 'TVC 광고 GRP 852 달성']
        },
        {
          icon: '↗',
          tags: ['Brand Marketing', 'Promotion'],
          title: '브랜드 프로모션 기획',
          body: '스포츠 마케팅, 캠퍼스 리크루팅, 캠핑장 프로모션 등 브랜드 경험을 만드는 현장 캠페인을 기획하고 운영했습니다.',
          bullets: ['REXTREME 피트니스 레이스 약 1,000명 참여', '캠퍼스 프로모션 현장 참여자 9,389명 달성', 'SNS 팔로워 2,100명 증가']
        },
        {
          icon: '✦',
          tags: ['Design', 'CI · BI'],
          title: '브랜드 디자인과 가이드 관리',
          body: '제품 패키지, 홍보물, 전시 부스, 사내외 제작물의 디자인과 CI·BI 가이드 준수 여부를 관리했습니다.',
          bullets: ['일양약품 연평균 10개 이상 신제품 디자인', '의약품·건강기능식품 패키지 표기사항 검토', '외주 디자인 제작물 감리 및 수정 관리']
        }
      ]
    },
    experience: {
      title: '경력',
      subtitle: '홍보·브랜드 실무 9년 이상',
      items: [
        {
          company: '세방그룹 · 세방(주)',
          role: '그룹 브랜드실 / 선임',
          period: '2024.05 - 재직 중',
          logo: 'SB',
          logoDark: './assets/project-media/sebang-dark.png',
          logoLight: './assets/project-media/sebang-light.png',
          summary: '물류, 운송, 항만, 배터리 제조업 기반 그룹의 PR, 브랜드 기획, 광고, 홈페이지, AI 업무 개선을 담당합니다.',
          highlights: ['그룹 PR 광고 캠페인', '브랜드 프로모션', '홈페이지 구축', 'AI 업무 자동화'],
          blocks: [
            { title: '그룹 PR & 광고 집행', body: '대행사 선정, 경쟁 PT, 제작 예산과 일정 관리, 서울 권역 택시 광고 및 유튜브/TVC 광고 집행을 수행했습니다.', bullets: ['서울 권역 택시 광고 약 200대 3개월 집행', 'YouTube 조회수 약 725만 건', 'TVC GRP 852 달성'] },
            { title: '브랜드 마케팅', body: '스포츠 대회, 마라톤, 캠퍼스 리크루팅, 캠핑장 프로모션을 기획하고 현장 운영과 디자인 관리를 담당했습니다.', bullets: ['REXTREME 피트니스 레이스 기획 및 로고 디자인', '캠퍼스 프로모션 3회 운영', '캠핑장 부스 방문자 약 2,000명'] }
          ]
        },
        {
          company: '일양약품(주)',
          role: '홍보팀 / 대리',
          period: '2017.02 - 2024.05',
          logo: 'IY',
          logoDark: './assets/project-media/ilyang-dark.png',
          logoLight: './assets/project-media/ilyang-light.png',
          summary: '제약·건강기능식품 기업의 홍보, 브랜드 디자인, 언론홍보, 사내 홍보를 담당했습니다.',
          highlights: ['광고 심의', '제품 디자인', '언론홍보', '사보 기획'],
          blocks: [
            { title: '홍보 및 광고 심의', body: '의약품, 건강기능식품 홍보물과 상세페이지, 판촉물의 광고 표현과 표기사항 규정 준수 여부를 확인하고 협회 심의를 진행했습니다.', bullets: ['OTC·건강기능식품 광고 심의', '라디오 광고 소재 제작 관리', '옥외광고 및 사인물 허가·연장 관리'] },
            { title: '브랜드 디자인', body: '의약품, 건강기능식품, 드링크 제품 패키지와 브로셔, 전시·심포지엄 홍보물을 기획하고 디자인했습니다.', bullets: ['연평균 10개 이상 신제품 디자인', 'CPhI 국외 전시 부스 기획·디자인', '100주년 기념 공간·홍보물 기획'] }
          ]
        }
      ]
    },
    projects: {
      title: '프로젝트',
      subtitle: '카테고리별 대표 성과',
      categories: ['PR', 'Branding', 'SNS', 'Design', 'AI / DX'],
      items: sharedProjects
    },
    skills: {
      title: '역량',
      subtitle: '기술 스택',
      groups: sharedSkills
    },
    contact: {
      title: '함께 이야기해요',
      subtitle: 'Contact',
      body: '홍보, 브랜드 마케팅, 디자인 관련 협업과 채용 문의를 편하게 보내주세요.',
      email: 'hello@example.com',
      phone: '+82 10-2828-7087'
    },
    footer: '© 2026 유성열. All rights reserved.'
  },
  en: {
    brand: 'Sungyeol Yoo',
    nav: [
      { label: 'About', href: '#about' },
      { label: 'Experience', href: '#experience' },
      { label: 'Projects', href: '#projects' },
      { label: 'Skills', href: '#skills' },
      { label: 'Contact', href: '#contact' }
    ],
    ui: {
      admin: 'Admin',
      languageLabel: 'Korean page',
      themeLabel: 'Toggle theme',
      scroll: 'Scroll',
      projectPrev: 'Prev',
      projectNext: 'Next'
    },
    hero: {
      name: 'Sungyeol Yoo',
      role: 'PR & Brand Marketing Specialist',
      copy: 'I connect group PR, brand planning, design, and media relations so brand messages become real touchpoints and measurable outcomes.',
      align: 'center',
      buttonAlign: 'center',
      primaryCta: 'Download Profile',
      primaryHref: './assets/yuseongyeol-career-profile.pdf',
      secondaryCta: 'View Projects',
      featuredProject: 'Sebang Group PR Campaign',
      socials: [
        { label: 'Email', href: 'mailto:hello@example.com', icon: '✉' },
        { label: 'Projects', href: '#projects', icon: '◈' },
        { label: 'Experience', href: '#experience', icon: '↯' },
        { label: 'Contact', href: '#contact', icon: '↗' }
      ]
    },
    about: {
      title: 'About',
      subtitle: 'Core Strengths',
      cards: [
        { icon: '▣', tags: ['Group PR', 'Advertising'], title: 'Large-scale PR Campaigns', body: 'Led agency selection, competitive pitching, budget and timeline management, internal reporting, and execution for Sebang Group PR campaigns.', bullets: ['Managed KRW 200M YouTube media budget', '44.89M impressions and about 7.25M views', 'TVC GRP 852 achieved'] },
        { icon: '↗', tags: ['Brand Marketing', 'Promotion'], title: 'Brand Promotion Planning', body: 'Planned and operated brand experience campaigns including sports marketing, campus recruiting, marathon sponsorship, and camping-site promotions.', bullets: ['Approx. 1,000 participants in REXTREME Fitness Race', '9,389 campus promotion participants', '2,100 new SNS followers'] },
        { icon: '✦', tags: ['Design', 'CI · BI'], title: 'Brand Design Governance', body: 'Managed package design, promotional materials, exhibitions, and CI/BI guideline compliance for internal and external assets.', bullets: ['10+ new product designs per year at Ilyang', 'Package labeling and print proofing', 'External design vendor review and correction'] }
      ]
    },
    experience: {
      title: 'Experience',
      subtitle: '9+ years in PR and brand marketing',
      items: [
        { company: 'Sebang Group · Sebang Co., Ltd.', role: 'Senior Manager / Group Brand Office', period: 'May 2024 - Present', logo: 'SB', logoDark: './assets/project-media/sebang-dark.png', logoLight: './assets/project-media/sebang-light.png', summary: 'Responsible for group PR, brand planning, advertising, website operations, and AI process improvement across logistics, transport, ports, and battery businesses.', highlights: ['Group PR campaigns', 'Brand promotion', 'Website renewal', 'AI automation'], blocks: [{ title: 'Group PR & Advertising', body: 'Managed agency selection, competitive pitching, budget/timeline control, taxi OOH, YouTube, and TVC advertising.', bullets: ['Approx. 200 taxis in Seoul for 3 months', 'About 7.25M YouTube views', 'TVC GRP 852 achieved'] }] },
        { company: 'Ilyang Pharmaceutical Co., Ltd.', role: 'Assistant Manager / PR Team', period: 'Feb 2017 - May 2024', logo: 'IY', logoDark: './assets/project-media/ilyang-dark.png', logoLight: './assets/project-media/ilyang-light.png', summary: 'Handled PR, brand design, media relations, and internal communications for pharmaceutical and health supplement products.', highlights: ['Ad review', 'Product design', 'Media relations', 'Internal magazine'], blocks: [{ title: 'PR & Ad Review', body: 'Reviewed regulatory compliance for OTC, health supplement promotional materials, landing pages, and sales materials.', bullets: ['OTC and supplement ad review', 'Radio ad production management', 'OOH signage permit management'] }] }
      ]
    },
    projects: {
      title: 'Projects',
      subtitle: 'Selected outcomes by category',
      categories: ['PR', 'Branding', 'SNS', 'Design', 'AI / DX'],
      items: [
        { category: 'PR', company: 'Sebang Group · Sebang Co., Ltd.', visual: 'visual-blue', date: '2025.01 - 2025.07', title: 'Sebang Group PR Campaign', role: 'Group PR campaign operations', body: 'Managed agency selection, competitive pitching, budget and schedule control, internal reporting, and YouTube/TVC/taxi OOH execution.', media: ['./assets/project-media/pr1.png', './assets/project-media/pr2.png'], chips: ['Group PR', 'YouTube', 'TVC', 'OOH'], tasks: ['Managed agency selection and competitive pitching', 'Operated YouTube, TVC, and taxi OOH campaigns', 'Controlled budgets, timelines, and internal reporting'], results: ['44.89M YouTube impressions', 'About 7.25M views', '280% above target'], bullets: ['44.89M YouTube impressions', 'About 7.25M views', '280% above target'] },
        { category: 'Branding', company: 'Sebang Group · Sebang Co., Ltd.', visual: 'visual-purple', date: '2025.09 - 2026.01', title: 'REXTREME Fitness Race', role: 'Brand promotion planning', body: 'Planned a Rocket Battery sports marketing promotion including concept, logo, design guide, agency selection, and sponsor coordination.', chips: ['Sports Marketing', 'Brand Design', 'Promotion'], tasks: ['Planned event concept, logo, and design guide', 'Managed agency selection and sponsor coordination', 'Controlled operating budget and field execution plan'], results: ['Approx. 1,000 participants', '10 sponsors secured', 'About KRW 100M operating budget saved'], bullets: ['Approx. 1,000 participants', '10 sponsors secured', 'About KRW 100M operating budget saved'] },
        { category: 'Branding', company: 'Sebang Group · Sebang Co., Ltd.', visual: 'visual-mint', date: '2024.11 - 2025.04', title: 'Sebang Group Website Renewal', role: 'Brand website planning', body: 'Led website concept, roadmap, content collection, copywriting, design review, and media center operating reports.', chips: ['Website', 'Content', 'Brand UX'], tasks: ['Defined website concept and roadmap', 'Collected company information and wrote copy', 'Reviewed design tone and operated the media center'], results: ['Approx. 5,000 monthly visitors', 'I-AWARD 2025 winner', 'Media center content management'], bullets: ['Approx. 5,000 monthly visitors', 'I-AWARD 2025 winner', 'Media center content management'] },
        { category: 'SNS', company: 'Sebang Group · Sebang Co., Ltd.', visual: 'visual-slate', date: '2024.11 - 2025.04', title: 'Rocket Battery Instagram Operations', role: 'SNS channel strategy', body: 'Built channel concept, operating strategy, content and event plans, Meta ad operations, and monthly reporting.', chips: ['Instagram', 'Meta Ads', 'Content'], tasks: ['Built SNS channel concept and operating strategy', 'Planned content, events, and Meta ad operations', 'Produced monthly performance reports'], results: ['Operated for 5 months without an agency', 'Secured about 5,000 followers'], bullets: ['Operated for 5 months without an agency', 'Secured about 5,000 followers'] },
        { category: 'Design', company: 'Ilyang Pharmaceutical Co., Ltd.', visual: 'visual-light', date: '2017.02 - 2024.05', title: 'Ilyang Product Design', role: 'Package and promotional design', body: 'Designed OTC/ETC pharmaceutical, health supplement, drink packages, brochures, exhibitions, and symposium materials.', chips: ['Package', 'CI/BI', 'Print'], tasks: ['Designed pharmaceutical and supplement packages', 'Produced brochures, exhibitions, and symposium materials', 'Reviewed labels and supervised print proofing'], results: ['10+ new product designs per year', 'Print proofing and production review'], bullets: ['10+ new product designs per year', 'Print proofing and production review'] },
        { category: 'AI / DX', company: 'Sebang Group · Sebang Co., Ltd.', visual: 'visual-ai', date: '2025', title: 'AI Work Automation Process', role: 'Digital transformation', body: 'Participated in AI automation for material inventory checks, purchase order generation, bonded transport dispatch, and UNI-PASS reporting.', chips: ['AI Automation', 'Process', 'DX'], tasks: ['Defined automation target processes', 'Produced AI usage guides and internal content', 'Supported inventory, order, dispatch, and reporting process improvement'], results: ['AI usage guide production', 'Internal card news production'], bullets: ['AI usage guide production', 'Internal card news production'] }
      ]
    },
    skills: {
      title: 'Skills',
      subtitle: 'Capability stack',
      groups: [
        { icon: '⌁', title: 'PR & Media', chips: ['Press Releases', 'Media Response', 'Issue Monitoring', 'Ad Review'] },
        { icon: '◈', title: 'Brand Marketing', chips: ['Brand Planning', 'Promotion', 'OOH', 'Sports Marketing'] },
        { icon: '✦', title: 'Design & Content', chips: ['CI/BI', 'Package Design', 'Editorial', 'Website Copy'] },
        { icon: '↯', title: 'Digital & AI', chips: ['SNS', 'Meta Ads', 'AI Automation', 'Reports'] }
      ]
    },
    contact: {
      title: 'Let’s Talk',
      subtitle: 'Contact',
      body: 'For PR, brand marketing, design, communication, or hiring inquiries, feel free to reach out.',
      email: 'hello@example.com',
      phone: '+82 10-2828-7087'
    },
    footer: '© 2026 Sungyeol Yoo. All rights reserved.'
  }
};
