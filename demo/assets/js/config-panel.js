/**
 * Config Panel
 * Real-time display of editor configuration and statistics
 */

class ConfigPanel {
  constructor(containerId, editor) {
    this.container = document.getElementById(containerId)
    this.editor = editor
    this.updateInterval = null

    if (!this.container) {
      console.error(`Container ${containerId} not found`)
      return
    }

    this.init()
  }

  /**
   * Initialize the config panel
   */
  init() {
    this.render()
    this.bindEditorEvents()
    this.startAutoUpdate()
  }

  /**
   * Render the panel structure
   */
  render() {
    const content = this.container.querySelector('.config-content')
    if (!content) {return}

    content.innerHTML = `
      <div class="config-group">
        <h4>문서 통계</h4>
        <div class="config-stats">
          <div class="stat-item">
            <span class="stat-value" id="word-count">0</span>
            <span class="stat-label">단어</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" id="char-count">0</span>
            <span class="stat-label">문자</span>
          </div>
        </div>
      </div>

      <div class="config-group">
        <h4>현재 상태</h4>
        <div id="current-node" class="config-item">
          <span class="config-label">노드</span>
          <span class="config-value">-</span>
        </div>
        <div id="selection-info" class="config-item">
          <span class="config-label">선택</span>
          <span class="config-value">-</span>
        </div>
      </div>

      <div class="config-group">
        <h4>활성화된 마크</h4>
        <div id="active-marks"></div>
      </div>

      <div class="config-group">
        <h4>확장 기능</h4>
        <div id="extensions-list"></div>
      </div>

      <div class="config-group">
        <h4>편집 상태</h4>
        <div id="can-undo" class="config-item">
          <span class="config-label">실행 취소 가능</span>
          <span class="config-value">-</span>
        </div>
        <div id="can-redo" class="config-item">
          <span class="config-label">재실행 가능</span>
          <span class="config-value">-</span>
        </div>
        <div id="is-editable" class="config-item">
          <span class="config-label">편집 가능</span>
          <span class="config-value">-</span>
        </div>
      </div>
    `

    this.updateExtensionsList()
  }

  /**
   * Bind editor events for updates
   */
  bindEditorEvents() {
    if (!this.editor) {return}

    this.editor.on('selectionUpdate', () => this.updatePanel())
    this.editor.on('transaction', () => this.updatePanel())
    this.editor.on('update', () => this.updatePanel())
  }

  /**
   * Start auto-update interval
   */
  startAutoUpdate() {
    this.updateInterval = setInterval(() => {
      this.updatePanel()
    }, 1000)
  }

  /**
   * Stop auto-update interval
   */
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  /**
   * Update all panel information
   */
  updatePanel() {
    if (!this.editor) {return}

    this.updateStats()
    this.updateCurrentNode()
    this.updateActiveMarks()
    this.updateEditState()
  }

  /**
   * Update document statistics
   */
  updateStats() {
    const text = this.editor.getText()
    const words = text
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0).length
    const chars = text.length

    const wordCountEl = document.getElementById('word-count')
    const charCountEl = document.getElementById('char-count')

    if (wordCountEl) {wordCountEl.textContent = words}
    if (charCountEl) {charCountEl.textContent = chars}
  }

  /**
   * Update current node information
   */
  updateCurrentNode() {
    const { state } = this.editor
    const { $from } = state.selection
    const node = $from.parent

    const nodeEl = document.getElementById('current-node')
    if (nodeEl) {
      const valueEl = nodeEl.querySelector('.config-value')
      if (valueEl) {
        valueEl.textContent = node.type.name
      }
    }

    const selectionEl = document.getElementById('selection-info')
    if (selectionEl) {
      const valueEl = selectionEl.querySelector('.config-value')
      if (valueEl) {
        const { from, to } = state.selection
        valueEl.textContent = `${from}-${to}`
      }
    }
  }

  /**
   * Update active marks display
   */
  updateActiveMarks() {
    const marksEl = document.getElementById('active-marks')
    if (!marksEl) {return}

    const { state } = this.editor
    const { from, to } = state.selection
    const marks = []

    state.doc.nodesBetween(from, to, node => {
      if (node.marks) {
        node.marks.forEach(mark => {
          if (!marks.includes(mark.type.name)) {
            marks.push(mark.type.name)
          }
        })
      }
    })

    if (marks.length === 0) {
      marksEl.innerHTML = '<div class="config-item"><span class="config-label">없음</span></div>'
    } else {
      marksEl.innerHTML = marks
        .map(
          mark => `
        <div class="config-item">
          <span class="config-value">${mark}</span>
        </div>
      `,
        )
        .join('')
    }
  }

  /**
   * Update extensions list
   */
  updateExtensionsList() {
    const extensionsEl = document.getElementById('extensions-list')
    if (!extensionsEl || !this.editor) {return}

    const extensions = this.editor.extensionManager.extensions.map(ext => ext.name)

    extensionsEl.innerHTML = extensions
      .map(
        name => `
      <div class="config-item">
        <span class="config-value">${name}</span>
      </div>
    `,
      )
      .join('')
  }

  /**
   * Update edit state
   */
  updateEditState() {
    const canUndoEl = document.getElementById('can-undo')
    const canRedoEl = document.getElementById('can-redo')
    const isEditableEl = document.getElementById('is-editable')

    if (canUndoEl) {
      const valueEl = canUndoEl.querySelector('.config-value')
      if (valueEl) {
        valueEl.textContent = this.editor.can().undo() ? '예' : '아니오'
        valueEl.style.color = this.editor.can().undo() ? 'var(--cf-success)' : 'var(--cf-gray-5)'
      }
    }

    if (canRedoEl) {
      const valueEl = canRedoEl.querySelector('.config-value')
      if (valueEl) {
        valueEl.textContent = this.editor.can().redo() ? '예' : '아니오'
        valueEl.style.color = this.editor.can().redo() ? 'var(--cf-success)' : 'var(--cf-gray-5)'
      }
    }

    if (isEditableEl) {
      const valueEl = isEditableEl.querySelector('.config-value')
      if (valueEl) {
        valueEl.textContent = this.editor.isEditable ? '예' : '아니오'
        valueEl.style.color = this.editor.isEditable ? 'var(--cf-success)' : 'var(--cf-error)'
      }
    }
  }

  /**
   * Destroy the panel
   */
  destroy() {
    this.stopAutoUpdate()

    if (this.editor) {
      this.editor.off('selectionUpdate')
      this.editor.off('transaction')
      this.editor.off('update')
    }
  }
}

// Export for use in other scripts
window.ConfigPanel = ConfigPanel
