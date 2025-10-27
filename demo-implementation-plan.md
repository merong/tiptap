# Tiptap 데모 페이지 구축 작업 계획

## 📋 프로젝트 개요

Tiptap 에디터의 데모 페이지를 구축하여 vanilla JavaScript와 jQuery 환경에서의 사용 예제를 제공하고, 한국어 사용자를 위한 매뉴얼과 localStorage 기반 저장/불러오기 기능을 구현합니다.

## 🎯 핵심 요구사항

1. **데모 페이지 시스템**
   - Vanilla JavaScript 예제
   - jQuery 기반 예제
   - 설정값 실시간 표시 패널
   - localStorage 저장/불러오기

2. **한국어 매뉴얼**
   - Cloudflare UI 디자인 시스템 적용
   - 단계별 사용 가이드
   - 대화형 예제 포함

## 🏗️ 작업 단계별 실행 계획

### Phase 1: 프로젝트 구조 설계 및 초기 설정

#### 1.1 디렉토리 구조 생성
```
demo/
├── index.html                 # 메인 진입점
├── manual-kr.html            # 한국어 매뉴얼
├── assets/
│   ├── css/
│   │   ├── main.css         # 메인 스타일
│   │   ├── cloudflare-ui.css # Cloudflare 디자인 시스템
│   │   └── demo.css         # 데모 전용 스타일
│   ├── js/
│   │   ├── demo-vanilla.js  # Vanilla JS 데모
│   │   ├── demo-jquery.js   # jQuery 데모
│   │   ├── storage.js       # localStorage 관리
│   │   └── config-panel.js  # 설정 패널
│   └── images/              # 이미지 리소스
├── examples/
│   ├── vanilla/
│   │   ├── basic.html       # 기본 예제
│   │   ├── advanced.html    # 고급 예제
│   │   └── plugins.html     # 플러그인 예제
│   └── jquery/
│       ├── basic.html       # 기본 예제
│       ├── advanced.html    # 고급 예제
│       └── ajax.html        # AJAX 연동 예제
└── data/
    └── presets.json         # 기본 설정 프리셋
```

#### 1.2 필수 의존성 설정
- Tiptap UMD 빌드 준비
- jQuery CDN 링크 설정
- 폰트 및 아이콘 (Cloudflare 스타일 매칭)

### Phase 2: Cloudflare UI 디자인 시스템 구현

#### 2.1 디자인 토큰 정의
```css
/* CSS 변수로 Cloudflare 색상 시스템 구현 */
:root {
  /* Primary Colors */
  --cf-orange: #F48120;
  --cf-blue: #0051C3;

  /* Neutral Colors */
  --cf-gray-0: #FFFFFF;
  --cf-gray-1: #F6F6F8;
  --cf-gray-2: #E8E8EA;
  --cf-gray-3: #D5D7DD;
  --cf-gray-4: #B3B6BD;
  --cf-gray-5: #8B8FA3;
  --cf-gray-6: #5E5F6E;
  --cf-gray-7: #3A3B49;
  --cf-gray-8: #1E1E27;
  --cf-gray-9: #000000;

  /* Typography */
  --cf-font-family: system-ui, -apple-system, sans-serif;
  --cf-font-size-base: 16px;

  /* Spacing */
  --cf-space-xs: 4px;
  --cf-space-sm: 8px;
  --cf-space-md: 16px;
  --cf-space-lg: 24px;
  --cf-space-xl: 32px;
}
```

#### 2.2 컴포넌트 스타일링
- 카드 컴포넌트
- 버튼 시스템 (Primary, Secondary, Ghost)
- 폼 요소 (Input, Select, Checkbox)
- 네비게이션 패턴
- 알림 및 토스트 메시지

### Phase 3: Vanilla JavaScript 데모 구현

#### 3.1 기본 에디터 초기화
```javascript
// demo-vanilla.js 핵심 구조
class TiptapDemoVanilla {
  constructor(container) {
    this.container = container;
    this.editor = null;
    this.config = this.getDefaultConfig();
    this.init();
  }

  getDefaultConfig() {
    return {
      extensions: [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        // ... 추가 확장
      ],
      content: '<p>에디터를 시작하세요...</p>',
      editorProps: {
        attributes: {
          class: 'tiptap-editor'
        }
      }
    };
  }

  init() {
    // 에디터 초기화
    this.createEditor();
    this.bindEvents();
    this.setupToolbar();
  }
}
```

#### 3.2 툴바 및 컨트롤 구현
- 텍스트 포맷팅 버튼
- 리스트 및 정렬
- 이미지/링크 삽입
- 실행 취소/재실행

### Phase 4: jQuery 데모 구현

#### 4.1 jQuery 플러그인 패턴
```javascript
// demo-jquery.js
(function($) {
  $.fn.tiptapEditor = function(options) {
    const defaults = {
      toolbar: true,
      menubar: true,
      statusbar: true,
      localStorage: true,
      // ... 기본 옵션
    };

    const settings = $.extend({}, defaults, options);

    return this.each(function() {
      const $element = $(this);
      // jQuery 기반 초기화 로직
    });
  };
})(jQuery);
```

#### 4.2 jQuery 이벤트 통합
- Custom jQuery 이벤트 발행
- AJAX 콘텐츠 로딩
- jQuery UI 위젯 통합 (옵션)

### Phase 5: 설정 패널 구현

#### 5.1 설정값 표시 시스템
```javascript
class ConfigPanel {
  constructor(editor) {
    this.editor = editor;
    this.panel = this.createPanel();
    this.bindEditorEvents();
  }

  createPanel() {
    // 사이드바 패널 생성
    // 실시간 상태 표시
    // - 현재 선택된 노드
    // - 활성화된 마크
    // - 문서 통계
    // - 확장 기능 상태
  }

  updateConfig(changes) {
    // 설정 변경사항 실시간 반영
    // UI 업데이트
    // 에디터에 적용
  }
}
```

#### 5.2 설정 항목
- 에디터 모드 (WYSIWYG/Source)
- 테마 선택 (Light/Dark)
- 확장 기능 활성화/비활성화
- 단축키 커스터마이징

### Phase 6: localStorage 저장 시스템

#### 6.1 저장 관리자 구현
```javascript
class StorageManager {
  constructor(namespace = 'tiptap-demo') {
    this.namespace = namespace;
    this.maxItems = 50;
  }

  save(name, content, metadata) {
    const item = {
      id: this.generateId(),
      name: name,
      content: content,
      metadata: metadata,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // localStorage에 저장
    this.addToStorage(item);
    return item;
  }

  load(id) {
    // localStorage에서 불러오기
  }

  list() {
    // 저장된 항목 목록 반환
  }

  delete(id) {
    // 항목 삭제
  }
}
```

#### 6.2 UI 구성요소
- 저장 다이얼로그
- 저장 목록 사이드바
- 검색 및 필터링
- 내보내기/가져오기 (JSON)

### Phase 7: 한국어 매뉴얼 페이지

#### 7.1 매뉴얼 구조
```html
<!-- manual-kr.html -->
<nav class="manual-nav">
  <ul>
    <li><a href="#intro">소개</a></li>
    <li><a href="#quick-start">빠른 시작</a></li>
    <li><a href="#basic-usage">기본 사용법</a></li>
    <li><a href="#advanced">고급 기능</a></li>
    <li><a href="#api">API 레퍼런스</a></li>
    <li><a href="#examples">예제 모음</a></li>
  </ul>
</nav>

<main class="manual-content">
  <!-- 섹션별 콘텐츠 -->
</main>
```

#### 7.2 콘텐츠 구성
1. **소개**
   - Tiptap 개요
   - 주요 특징
   - 브라우저 호환성

2. **빠른 시작**
   - 설치 방법
   - 첫 번째 에디터
   - 기본 설정

3. **기본 사용법**
   - 텍스트 포맷팅
   - 리스트와 인용
   - 이미지와 링크

4. **고급 기능**
   - 커스텀 확장
   - 플러그인 개발
   - 협업 기능

5. **API 레퍼런스**
   - 메서드 목록
   - 이벤트 핸들링
   - 설정 옵션

### Phase 8: 통합 및 최적화

#### 8.1 빌드 프로세스
```json
// package.json 스크립트 추가
{
  "scripts": {
    "demo:dev": "vite serve demo",
    "demo:build": "vite build demo",
    "demo:preview": "vite preview demo"
  }
}
```

#### 8.2 성능 최적화
- 코드 분할 (Code Splitting)
- 지연 로딩 (Lazy Loading)
- 번들 크기 최적화
- 캐싱 전략

### Phase 9: 테스트 및 품질 보증

#### 9.1 테스트 케이스
- 에디터 초기화 테스트
- localStorage 저장/불러오기
- UI 상호작용 테스트
- 크로스 브라우저 테스트

#### 9.2 접근성 검증
- 키보드 네비게이션
- 스크린 리더 호환성
- ARIA 레이블
- 색상 대비

### Phase 10: 문서화 및 배포

#### 10.1 개발자 문서
- README.md 작성
- 코드 주석 추가
- JSDoc 문서화
- 변경 로그

#### 10.2 배포 준비
- 프로덕션 빌드
- CDN 설정
- GitHub Pages 배포
- 버전 관리

## 🔧 기술 스택

- **Core**: Tiptap v3.x
- **Vanilla JS**: ES6+ 문법
- **jQuery**: v3.x
- **Build Tool**: Vite
- **Styling**: CSS3 + CSS Variables
- **Storage**: localStorage API
- **Testing**: Cypress

## 📝 세부 구현 지침

### localStorage 데이터 구조
```javascript
{
  "tiptap-demo-saves": {
    "items": [
      {
        "id": "unique-id",
        "name": "저장 이름",
        "content": "HTML 콘텐츠",
        "config": {/* 에디터 설정 */},
        "createdAt": "timestamp",
        "updatedAt": "timestamp",
        "tags": ["태그1", "태그2"]
      }
    ],
    "settings": {
      "theme": "light",
      "autosave": true,
      "interval": 30000
    }
  }
}
```

### 이벤트 시스템
```javascript
// 커스텀 이벤트 정의
const events = {
  'editor:initialized': '에디터 초기화 완료',
  'content:changed': '콘텐츠 변경',
  'content:saved': '콘텐츠 저장',
  'content:loaded': '콘텐츠 불러오기',
  'config:updated': '설정 업데이트'
};
```

## 🚀 다음 세션 작업 우선순위

1. **Phase 1-2**: 프로젝트 구조 및 Cloudflare UI 시스템 구축
2. **Phase 3-4**: Vanilla/jQuery 데모 핵심 기능 구현
3. **Phase 5-6**: 설정 패널과 localStorage 시스템
4. **Phase 7**: 한국어 매뉴얼 작성
5. **Phase 8-10**: 최적화, 테스트, 배포

각 단계는 독립적으로 테스트 가능하도록 구현하며, 점진적으로 기능을 추가합니다.