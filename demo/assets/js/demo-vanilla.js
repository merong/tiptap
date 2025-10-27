/**
 * Vanilla JavaScript Demo
 * Tiptap editor implementation using vanilla JavaScript
 */

/* global ConfigPanel */

class TiptapDemoVanilla {
  constructor(options = {}) {
    this.editorId = options.editorId || 'vanilla-editor'
    this.toolbarId = options.toolbarId || 'vanilla-toolbar'
    this.configPanelId = options.configPanelId || 'vanilla-config'

    this.editor = null
    this.configPanel = null
    this.autosaveTimer = null

    this.init()
  }

  /**
   * Initialize the demo
   */
  init() {
    // Wait for Tiptap to be loaded
    if (!window.tiptapLoaded) {
      window.addEventListener('tiptap-loaded', () => {
        this.initEditor()
      })
      return
    }

    this.initEditor()
  }

  /**
   * Initialize editor after Tiptap is loaded
   */
  initEditor() {
    this.createEditor()
    this.createToolbar()
    this.initConfigPanel()
    this.bindEvents()
    this.loadLastSaved()
  }

  /**
   * Get default editor configuration
   */
  getDefaultConfig() {
    return {
      element: document.getElementById(this.editorId),
      extensions: this.getExtensions(),
      content: '<p>여기에 텍스트를 입력하세요...</p>',
      editorProps: {
        attributes: {
          class: 'tiptap-editor',
          'data-placeholder': '여기에 내용을 입력하세요...',
        },
      },
      onUpdate: ({ editor }) => {
        this.onEditorUpdate(editor)
      },
    }
  }

  /**
   * Get editor extensions
   */
  getExtensions() {
    const StarterKit = window.TiptapStarterKit

    if (!StarterKit) {
      console.error('StarterKit not found')
      return []
    }

    return [StarterKit]
  }

  /**
   * Create the editor instance
   */
  createEditor() {
    const Editor = window.TiptapEditor

    if (!Editor) {
      console.error('Tiptap Editor not found')
      return
    }

    try {
      this.editor = new Editor(this.getDefaultConfig())
      console.log('Editor created successfully')
    } catch (error) {
      console.error('Error creating editor:', error)
    }
  }

  /**
   * Create toolbar with buttons
   */
  createToolbar() {
    const toolbar = document.getElementById(this.toolbarId)
    if (!toolbar) {
      return
    }

    const buttons = [
      {
        name: 'bold',
        icon: 'bold',
        title: '굵게 (Ctrl+B)',
        command: () => this.editor.chain().focus().toggleBold().run(),
        isActive: () => this.editor.isActive('bold'),
      },
      {
        name: 'italic',
        icon: 'italic',
        title: '기울임 (Ctrl+I)',
        command: () => this.editor.chain().focus().toggleItalic().run(),
        isActive: () => this.editor.isActive('italic'),
      },
      {
        name: 'strike',
        icon: 'strikethrough',
        title: '취소선',
        command: () => this.editor.chain().focus().toggleStrike().run(),
        isActive: () => this.editor.isActive('strike'),
      },
      {
        name: 'code',
        icon: 'code',
        title: '코드',
        command: () => this.editor.chain().focus().toggleCode().run(),
        isActive: () => this.editor.isActive('code'),
      },
      { separator: true },
      {
        name: 'h1',
        icon: 'heading1',
        title: '제목 1',
        command: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => this.editor.isActive('heading', { level: 1 }),
      },
      {
        name: 'h2',
        icon: 'heading2',
        title: '제목 2',
        command: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => this.editor.isActive('heading', { level: 2 }),
      },
      {
        name: 'h3',
        icon: 'heading3',
        title: '제목 3',
        command: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => this.editor.isActive('heading', { level: 3 }),
      },
      { separator: true },
      {
        name: 'bulletList',
        icon: 'bulletList',
        title: '글머리 기호 목록',
        command: () => this.editor.chain().focus().toggleBulletList().run(),
        isActive: () => this.editor.isActive('bulletList'),
      },
      {
        name: 'orderedList',
        icon: 'orderedList',
        title: '번호 매기기 목록',
        command: () => this.editor.chain().focus().toggleOrderedList().run(),
        isActive: () => this.editor.isActive('orderedList'),
      },
      {
        name: 'blockquote',
        icon: 'blockquote',
        title: '인용',
        command: () => this.editor.chain().focus().toggleBlockquote().run(),
        isActive: () => this.editor.isActive('blockquote'),
      },
      {
        name: 'codeBlock',
        icon: 'codeBlock',
        title: '코드 블록',
        command: () => this.editor.chain().focus().toggleCodeBlock().run(),
        isActive: () => this.editor.isActive('codeBlock'),
      },
      { separator: true },
      {
        name: 'undo',
        icon: 'undo',
        title: '실행 취소 (Ctrl+Z)',
        command: () => this.editor.chain().focus().undo().run(),
        isActive: () => false,
        isDisabled: () => !this.editor.can().undo(),
      },
      {
        name: 'redo',
        icon: 'redo',
        title: '재실행 (Ctrl+Shift+Z)',
        command: () => this.editor.chain().focus().redo().run(),
        isActive: () => false,
        isDisabled: () => !this.editor.can().redo(),
      },
    ]

    toolbar.innerHTML = buttons
      .map(btn => {
        if (btn.separator) {
          return '<div class="toolbar-separator"></div>'
        }

        const icon = window.ToolbarIcons && window.ToolbarIcons[btn.icon] ? window.ToolbarIcons[btn.icon] : btn.icon

        return `
        <button
          class="toolbar-button"
          data-action="${btn.name}"
          title="${btn.title}"
        >
          ${icon}
        </button>
      `
      })
      .join('')

    // Bind button clicks
    toolbar.querySelectorAll('.toolbar-button').forEach(button => {
      const buttonConfig = buttons.filter(b => !b.separator)[
        Array.from(toolbar.querySelectorAll('.toolbar-button')).indexOf(button)
      ]

      if (buttonConfig) {
        button.addEventListener('click', e => {
          e.preventDefault()
          buttonConfig.command()
          this.updateToolbar()
        })
      }
    })

    // Initial toolbar state
    this.updateToolbar()

    // Update toolbar on editor updates
    this.editor.on('selectionUpdate', () => this.updateToolbar())
    this.editor.on('transaction', () => this.updateToolbar())
  }

  /**
   * Update toolbar button states
   */
  updateToolbar() {
    const toolbar = document.getElementById(this.toolbarId)
    if (!toolbar) {
      return
    }

    toolbar.querySelectorAll('.toolbar-button').forEach(button => {
      const action = button.dataset.action

      // Check if active
      let isActive = false
      if (action === 'bold') {
        isActive = this.editor.isActive('bold')
      } else if (action === 'italic') {
        isActive = this.editor.isActive('italic')
      } else if (action === 'strike') {
        isActive = this.editor.isActive('strike')
      } else if (action === 'code') {
        isActive = this.editor.isActive('code')
      } else if (action === 'h1') {
        isActive = this.editor.isActive('heading', { level: 1 })
      } else if (action === 'h2') {
        isActive = this.editor.isActive('heading', { level: 2 })
      } else if (action === 'h3') {
        isActive = this.editor.isActive('heading', { level: 3 })
      } else if (action === 'bulletList') {
        isActive = this.editor.isActive('bulletList')
      } else if (action === 'orderedList') {
        isActive = this.editor.isActive('orderedList')
      } else if (action === 'blockquote') {
        isActive = this.editor.isActive('blockquote')
      } else if (action === 'codeBlock') {
        isActive = this.editor.isActive('codeBlock')
      }

      button.classList.toggle('is-active', isActive)

      // Check if disabled
      let isDisabled = false
      if (action === 'undo') {
        isDisabled = !this.editor.can().undo()
      } else if (action === 'redo') {
        isDisabled = !this.editor.can().redo()
      }

      button.disabled = isDisabled
    })
  }

  /**
   * Initialize config panel
   */
  initConfigPanel() {
    if (window.ConfigPanel && this.editor) {
      this.configPanel = new ConfigPanel(this.configPanelId, this.editor)
    }
  }

  /**
   * Bind control events
   */
  bindEvents() {
    // Save button
    const saveBtn = document.getElementById('vanilla-save')
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveContent())
    }

    // Load button
    const loadBtn = document.getElementById('vanilla-load')
    if (loadBtn) {
      loadBtn.addEventListener('click', () => this.showLoadModal())
    }

    // Clear button
    const clearBtn = document.getElementById('vanilla-clear')
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearContent())
    }
  }

  /**
   * Editor update handler
   */
  onEditorUpdate(_editor) {
    // Auto-save
    this.scheduleAutosave()
  }

  /**
   * Schedule autosave
   */
  scheduleAutosave() {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer)
    }

    this.autosaveTimer = setTimeout(() => {
      this.autosave()
    }, 3000)
  }

  /**
   * Auto-save content
   */
  autosave() {
    const content = this.editor.getHTML()
    localStorage.setItem('tiptap-demo-autosave', content)
    console.log('Auto-saved')
  }

  /**
   * Load last saved content
   */
  loadLastSaved() {
    const content = localStorage.getItem('tiptap-demo-autosave')
    if (content) {
      this.editor.commands.setContent(content)
    }
  }

  /**
   * Save content
   */
  saveContent() {
    // eslint-disable-next-line no-alert
    const name = prompt('문서 이름을 입력하세요:', `문서 ${Date.now()}`)
    if (!name) {
      return
    }

    const content = this.editor.getHTML()
    const item = window.storageManager.save(name, content)

    if (item) {
      // eslint-disable-next-line no-alert
      alert('저장되었습니다!')
    } else {
      // eslint-disable-next-line no-alert
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  /**
   * Show load modal
   */
  showLoadModal() {
    const modal = document.getElementById('storage-modal')
    if (!modal) {
      return
    }

    const items = window.storageManager.list()
    const listEl = document.getElementById('saved-items-list')

    if (items.length === 0) {
      listEl.innerHTML = '<p style="text-align: center; color: var(--cf-gray-5);">저장된 문서가 없습니다.</p>'
    } else {
      listEl.innerHTML = items
        .map(
          item => `
        <div class="saved-item" data-id="${item.id}">
          <div class="saved-item-info">
            <h4>${item.name}</h4>
            <div class="saved-item-meta">
              ${new Date(item.createdAt).toLocaleString('ko-KR')}
              • ${item.metadata.wordCount || 0} 단어
            </div>
          </div>
          <div class="saved-item-actions">
            <button class="btn btn-sm btn-primary" onclick="vanillaDemo.loadItem('${item.id}')">불러오기</button>
            <button class="btn btn-sm btn-ghost" onclick="vanillaDemo.deleteItem('${item.id}')">삭제</button>
          </div>
        </div>
      `,
        )
        .join('')
    }

    modal.classList.add('active')

    // Close modal
    const closeBtn = modal.querySelector('.modal-close')
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.remove('active')
    }

    modal.onclick = e => {
      if (e.target === modal) {
        modal.classList.remove('active')
      }
    }
  }

  /**
   * Load item by ID
   */
  loadItem(id) {
    const item = window.storageManager.load(id)
    if (item) {
      this.editor.commands.setContent(item.content)
      document.getElementById('storage-modal').classList.remove('active')
      // eslint-disable-next-line no-alert
      alert('불러오기 완료!')
    }
  }

  /**
   * Delete item by ID
   */
  deleteItem(id) {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (confirm('정말 삭제하시겠습니까?')) {
      window.storageManager.delete(id)
      this.showLoadModal()
    }
  }

  /**
   * Clear editor content
   */
  clearContent() {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (confirm('모든 내용을 삭제하시겠습니까?')) {
      this.editor.commands.clearContent()
    }
  }

  /**
   * Destroy the demo
   */
  destroy() {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer)
    }

    if (this.configPanel) {
      this.configPanel.destroy()
    }

    if (this.editor) {
      this.editor.destroy()
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.vanillaDemo = new TiptapDemoVanilla()
  })
} else {
  window.vanillaDemo = new TiptapDemoVanilla()
}
