/**
 * jQuery Demo
 * Tiptap editor implementation with jQuery integration
 */

/* global jQuery, ConfigPanel */

;(function ($) {
  /**
   * jQuery-based Tiptap Demo Class
   */
  class TiptapJQueryDemo {
    constructor($element, settings) {
      this.$element = $element
      this.settings = settings
      this.editor = null
      this.configPanel = null
      this.autosaveTimer = null

      this.init()
    }

    /**
     * Initialize
     */
    init() {
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

      this.$element.trigger('tiptap:ready')
    }

    /**
     * Create editor
     */
    createEditor() {
      const Editor = window.TiptapEditor
      const StarterKit = window.TiptapStarterKit

      if (!Editor || !StarterKit) {
        console.error('Tiptap not loaded properly')
        return
      }

      this.editor = new Editor({
        element: this.$element[0],
        extensions: [StarterKit],
        content: this.settings.content,
        editorProps: {
          attributes: {
            class: 'tiptap-editor',
            'data-placeholder': this.settings.placeholder,
          },
        },
        onUpdate: ({ editor }) => {
          this.onUpdate(editor)
        },
      })
    }

    /**
     * Create toolbar
     */
    createToolbar() {
      const toolbarId = this.$element.attr('id').replace('-editor', '-toolbar')
      const $toolbar = $(`#${toolbarId}`)

      if (!$toolbar.length) {
        return
      }

      const buttons = this.getToolbarButtons()

      $toolbar.empty()

      buttons.forEach(btn => {
        if (btn.separator) {
          $toolbar.append('<div class="toolbar-separator"></div>')
        } else {
          const icon = window.ToolbarIcons && window.ToolbarIcons[btn.icon] ? window.ToolbarIcons[btn.icon] : btn.icon

          const $btn = $(`
            <button
              class="toolbar-button"
              data-action="${btn.name}"
              title="${btn.title}"
            >
              ${icon}
            </button>
          `)

          $btn.on('click', e => {
            e.preventDefault()
            btn.command()
            this.updateToolbar()
          })

          $toolbar.append($btn)
        }
      })

      // Update toolbar state
      this.updateToolbar()

      // Listen to editor events
      this.editor.on('selectionUpdate', () => this.updateToolbar())
      this.editor.on('transaction', () => this.updateToolbar())
    }

    /**
     * Get toolbar button definitions
     */
    getToolbarButtons() {
      return [
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
    }

    /**
     * Update toolbar state
     */
    updateToolbar() {
      const toolbarId = this.$element.attr('id').replace('-editor', '-toolbar')
      const $toolbar = $(`#${toolbarId}`)

      $toolbar.find('.toolbar-button').each((i, button) => {
        const $button = $(button)
        const action = $button.data('action')

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

        $button.toggleClass('is-active', isActive)

        // Check if disabled
        let isDisabled = false
        if (action === 'undo') {
          isDisabled = !this.editor.can().undo()
        } else if (action === 'redo') {
          isDisabled = !this.editor.can().redo()
        }

        $button.prop('disabled', isDisabled)
      })

      // Trigger jQuery event
      this.$element.trigger('tiptap:toolbar-updated')
    }

    /**
     * Initialize config panel
     */
    initConfigPanel() {
      const configId = this.$element.attr('id').replace('-editor', '-config')

      if (window.ConfigPanel && this.editor) {
        this.configPanel = new ConfigPanel(configId, this.editor)
      }
    }

    /**
     * Bind events
     */
    bindEvents() {
      const editorId = this.$element.attr('id')
      const prefix = editorId.replace('-editor', '')

      // Save button
      $(`#${prefix}-save`).on('click', () => this.saveContent())

      // Load button
      $(`#${prefix}-load`).on('click', () => this.showLoadModal())

      // Clear button
      $(`#${prefix}-clear`).on('click', () => this.clearContent())
    }

    /**
     * Editor update handler
     */
    onUpdate(_editor) {
      // Trigger jQuery event
      this.$element.trigger('tiptap:update', [_editor])

      // Custom callback
      if (typeof this.settings.onChange === 'function') {
        this.settings.onChange.call(this, _editor)
      }

      // Autosave
      if (this.settings.autosave) {
        this.scheduleAutosave()
      }
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
      }, this.settings.autosaveInterval)
    }

    /**
     * Autosave
     */
    autosave() {
      const content = this.editor.getHTML()
      localStorage.setItem('tiptap-demo-jquery-autosave', content)
      this.$element.trigger('tiptap:autosaved', [content])
    }

    /**
     * Load last saved
     */
    loadLastSaved() {
      const content = localStorage.getItem('tiptap-demo-jquery-autosave')
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
        this.$element.trigger('tiptap:saved', [item])

        if (typeof this.settings.onSave === 'function') {
          this.settings.onSave.call(this, item)
        }

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
      const $modal = $('#storage-modal')
      if (!$modal.length) {
        return
      }

      const items = window.storageManager.list()
      const $list = $('#saved-items-list')

      if (items.length === 0) {
        $list.html('<p style="text-align: center; color: var(--cf-gray-5);">저장된 문서가 없습니다.</p>')
      } else {
        $list.empty()

        items.forEach(item => {
          const $item = $(`
            <div class="saved-item" data-id="${item.id}">
              <div class="saved-item-info">
                <h4>${item.name}</h4>
                <div class="saved-item-meta">
                  ${new Date(item.createdAt).toLocaleString('ko-KR')}
                  • ${item.metadata.wordCount || 0} 단어
                </div>
              </div>
              <div class="saved-item-actions">
                <button class="btn btn-sm btn-primary load-btn">불러오기</button>
                <button class="btn btn-sm btn-ghost delete-btn">삭제</button>
              </div>
            </div>
          `)

          $item.find('.load-btn').on('click', () => this.loadItem(item.id))
          $item.find('.delete-btn').on('click', () => this.deleteItem(item.id))

          $list.append($item)
        })
      }

      $modal.addClass('active')

      // Close modal
      $modal
        .find('.modal-close')
        .off('click')
        .on('click', () => {
          $modal.removeClass('active')
        })

      $modal.off('click').on('click', e => {
        if ($(e.target).is($modal)) {
          $modal.removeClass('active')
        }
      })
    }

    /**
     * Load item
     */
    loadItem(id) {
      const item = window.storageManager.load(id)
      if (item) {
        this.editor.commands.setContent(item.content)
        $('#storage-modal').removeClass('active')

        this.$element.trigger('tiptap:loaded', [item])

        if (typeof this.settings.onLoad === 'function') {
          this.settings.onLoad.call(this, item)
        }

        // eslint-disable-next-line no-alert
        alert('불러오기 완료!')
      }
    }

    /**
     * Delete item
     */
    deleteItem(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('정말 삭제하시겠습니까?')) {
        window.storageManager.delete(id)
        this.showLoadModal()
      }
    }

    /**
     * Clear content
     */
    clearContent() {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('모든 내용을 삭제하시겠습니까?')) {
        this.editor.commands.clearContent()
        this.$element.trigger('tiptap:cleared')
      }
    }

    /**
     * Public methods
     */
    getHTML() {
      return this.editor.getHTML()
    }

    setContent(content) {
      this.editor.commands.setContent(content)
      return this
    }

    getText() {
      return this.editor.getText()
    }

    focus() {
      this.editor.commands.focus()
      return this
    }

    /**
     * Destroy
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

      this.$element.trigger('tiptap:destroyed')
    }
  }

  /**
   * jQuery plugin for Tiptap editor
   */
  $.fn.tiptapEditor = function (options) {
    const defaults = {
      toolbar: true,
      configPanel: true,
      localStorage: true,
      autosave: true,
      autosaveInterval: 3000,
      placeholder: '여기에 내용을 입력하세요...',
      content: '<p>여기에 텍스트를 입력하세요...</p>',
      onChange: null,
      onSave: null,
      onLoad: null,
    }

    const settings = $.extend({}, defaults, options)

    return this.each(function () {
      const $element = $(this)

      // Create editor instance
      const instance = new TiptapJQueryDemo($element, settings)

      // Store instance on element
      $element.data('tiptapEditor', instance)

      // Trigger custom event
      $element.trigger('tiptap:initialized', [instance])
    })
  }

  // Initialize jQuery demo when DOM is ready
  $(() => {
    const $jqueryEditor = $('#jquery-editor')
    if ($jqueryEditor.length) {
      window.jqueryDemo = $jqueryEditor
        .tiptapEditor({
          onChange(_editor) {
            // Custom change handler
            console.log('Content changed')
          },
          onSave(_item) {
            console.log('Content saved:', _item)
          },
          onLoad(_item) {
            console.log('Content loaded:', _item)
          },
        })
        .data('tiptapEditor')
    }
  })
})(jQuery)
