# Tiptap Demo - Rich Text Editor

Tiptap 에디터의 Vanilla JavaScript와 jQuery 환경에서의 사용 예제를 제공하는 데모 페이지입니다.

## 📋 프로젝트 개요

이 데모는 Tiptap 에디터를 다양한 환경에서 사용하는 방법을 보여줍니다:

- **Vanilla JavaScript** - 순수 JavaScript로 구현된 에디터
- **jQuery** - jQuery 플러그인 패턴을 사용한 에디터
- **한국어 매뉴얼** - Cloudflare UI 디자인 시스템을 적용한 완전한 한국어 문서
- **localStorage 저장** - 브라우저 로컬 스토리지를 사용한 저장/불러오기 기능

## 🎯 주요 기능

### 1. Vanilla JavaScript 데모
- 기본 에디터 초기화
- 커스텀 툴바 구현
- 실시간 설정 패널
- 이벤트 핸들링
- localStorage 저장/불러오기

### 2. jQuery 데모
- jQuery 플러그인 패턴
- 커스텀 jQuery 이벤트
- AJAX 통합 예제
- 메서드 체이닝 지원

### 3. 설정 패널
- 실시간 문서 통계 (단어 수, 문자 수)
- 현재 노드 및 선택 영역 정보
- 활성화된 마크 표시
- 확장 기능 목록
- 편집 상태 모니터링

### 4. localStorage 시스템
- 문서 저장/불러오기
- 자동 저장 기능
- 저장된 문서 목록 관리
- 검색 및 필터링
- JSON 내보내기/가져오기

## 🏗️ 프로젝트 구조

```
demo/
├── index.html                 # 메인 데모 페이지
├── manual-kr.html            # 한국어 매뉴얼
├── README.md                 # 이 파일
├── assets/
│   ├── css/
│   │   ├── cloudflare-ui.css # Cloudflare 디자인 시스템
│   │   ├── main.css         # 메인 레이아웃 스타일
│   │   └── demo.css         # 데모 전용 스타일
│   └── js/
│       ├── storage.js       # localStorage 관리
│       ├── config-panel.js  # 설정 패널 구현
│       ├── demo-vanilla.js  # Vanilla JS 데모
│       └── demo-jquery.js   # jQuery 데모
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

## 🚀 사용 방법

### 1. 로컬 서버 실행

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 사용)
npx http-server

# PHP
php -S localhost:8000
```

### 2. 브라우저에서 열기

```
http://localhost:8000/demo/index.html
```

### 3. 프로젝트에 통합

#### Vanilla JavaScript

```html
<!-- CSS -->
<link rel="stylesheet" href="./assets/css/cloudflare-ui.css">
<link rel="stylesheet" href="./assets/css/main.css">
<link rel="stylesheet" href="./assets/css/demo.css">

<!-- Tiptap via ESM CDN -->
<script type="module">
  import { Editor } from 'https://esm.sh/@tiptap/core@3.7.2'
  import StarterKit from 'https://esm.sh/@tiptap/starter-kit@3.7.2'

  // Expose to window for demo scripts
  window.TiptapEditor = Editor
  window.TiptapStarterKit = StarterKit
  window.tiptapLoaded = true
  window.dispatchEvent(new CustomEvent('tiptap-loaded'))
</script>

<!-- Demo Scripts -->
<script src="./assets/js/storage.js"></script>
<script src="./assets/js/config-panel.js"></script>
<script src="./assets/js/demo-vanilla.js"></script>

<div id="editor"></div>

<script>
  // Demo will initialize automatically when Tiptap is loaded
</script>
```

#### jQuery

```html
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Demo Scripts -->
<script src="./assets/js/demo-jquery.js"></script>

<div id="editor"></div>

<script>
  $('#editor').tiptapEditor({
    placeholder: '여기에 입력하세요...',
    content: '<p>안녕하세요!</p>',
    onChange: function(editor) {
      console.log('Content changed')
    }
  })
</script>
```

## 🎨 디자인 시스템

이 프로젝트는 Cloudflare의 디자인 시스템에서 영감을 받은 UI를 사용합니다:

- **색상 시스템** - Orange (#F48120), Blue (#0051C3), 그레이스케일
- **타이포그래피** - 시스템 폰트 스택
- **컴포넌트** - 버튼, 카드, 폼, 모달 등
- **반응형 디자인** - 모바일부터 데스크톱까지

### CSS 변수 사용

```css
/* 주요 색상 */
var(--cf-orange)
var(--cf-blue)

/* 그레이스케일 */
var(--cf-gray-0) /* White */
var(--cf-gray-8) /* Dark */

/* 간격 */
var(--cf-space-sm)
var(--cf-space-md)
var(--cf-space-lg)

/* 폰트 */
var(--cf-font-family)
var(--cf-font-family-mono)
```

## 📚 API 문서

### StorageManager

```javascript
// 저장
const item = storageManager.save('문서 이름', '<p>콘텐츠</p>')

// 불러오기
const item = storageManager.load(id)

// 목록
const items = storageManager.list()

// 삭제
storageManager.delete(id)

// 전체 삭제
storageManager.clear()

// 내보내기
storageManager.export()

// 가져오기
storageManager.import(file)

// 검색
const results = storageManager.search('검색어')
```

### ConfigPanel

```javascript
const panel = new ConfigPanel('panel-id', editor)

// 패널 업데이트
panel.updatePanel()

// 통계 업데이트
panel.updateStats()

// 파괴
panel.destroy()
```

### TiptapDemoVanilla

```javascript
const demo = new TiptapDemoVanilla({
  editorId: 'editor',
  toolbarId: 'toolbar',
  configPanelId: 'config'
})

// 콘텐츠 저장
demo.saveContent()

// 불러오기 모달 표시
demo.showLoadModal()

// 에디터 초기화
demo.clearContent()

// 파괴
demo.destroy()
```

## 🔧 기술 스택

- **Core**: Tiptap v3.x
- **Vanilla JS**: ES6+ 문법
- **jQuery**: v3.7.1
- **Styling**: CSS3 + CSS Variables
- **Storage**: localStorage API

## 📝 브라우저 지원

- Chrome/Edge (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- iOS Safari (iOS 13+)
- Chrome for Android (최신 버전)

## 🤝 기여

이 데모는 Tiptap 공식 문서를 보완하는 한국어 리소스로 제작되었습니다.

## 📄 라이선스

이 데모 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🔗 참고 링크

- [Tiptap 공식 문서](https://tiptap.dev)
- [Tiptap GitHub](https://github.com/ueberdosis/tiptap)
- [ProseMirror](https://prosemirror.net/)

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ for Tiptap Korea Community**
