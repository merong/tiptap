/**
 * Storage Manager
 * Handles localStorage operations for saving and loading editor content
 */

class StorageManager {
  constructor(namespace = 'tiptap-demo') {
    this.namespace = namespace
    this.maxItems = 50
    this.storageKey = `${this.namespace}-saves`
    this.settingsKey = `${this.namespace}-settings`
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get all saved items from localStorage
   */
  getStorage() {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : { items: [] }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return { items: [] }
    }
  }

  /**
   * Save storage data to localStorage
   */
  setStorage(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      return false
    }
  }

  /**
   * Save content to localStorage
   */
  save(name, content, metadata = {}) {
    const storage = this.getStorage()

    const item = {
      id: this.generateId(),
      name: name || `Untitled ${storage.items.length + 1}`,
      content,
      metadata: {
        ...metadata,
        wordCount: this.countWords(content),
        charCount: this.countChars(content),
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    storage.items.unshift(item)

    // Limit the number of saved items
    if (storage.items.length > this.maxItems) {
      storage.items = storage.items.slice(0, this.maxItems)
    }

    const success = this.setStorage(storage)
    if (success) {
      this.dispatchEvent('save', item)
    }

    return success ? item : null
  }

  /**
   * Update existing item
   */
  update(id, updates) {
    const storage = this.getStorage()
    const index = storage.items.findIndex(item => item.id === id)

    if (index === -1) {
      return false
    }

    storage.items[index] = {
      ...storage.items[index],
      ...updates,
      updatedAt: Date.now(),
    }

    const success = this.setStorage(storage)
    if (success) {
      this.dispatchEvent('update', storage.items[index])
    }

    return success
  }

  /**
   * Load content by ID
   */
  load(id) {
    const storage = this.getStorage()
    const item = storage.items.find(savedItem => savedItem.id === id)

    if (item) {
      this.dispatchEvent('load', item)
    }

    return item || null
  }

  /**
   * Get list of all saved items
   */
  list() {
    const storage = this.getStorage()
    return storage.items || []
  }

  /**
   * Delete item by ID
   */
  delete(id) {
    const storage = this.getStorage()
    const index = storage.items.findIndex(item => item.id === id)

    if (index === -1) {
      return false
    }

    const deletedItem = storage.items[index]
    storage.items.splice(index, 1)

    const success = this.setStorage(storage)
    if (success) {
      this.dispatchEvent('delete', deletedItem)
    }

    return success
  }

  /**
   * Clear all saved items
   */
  clear() {
    const success = this.setStorage({ items: [] })
    if (success) {
      this.dispatchEvent('clear')
    }
    return success
  }

  /**
   * Export all data as JSON
   */
  export() {
    const storage = this.getStorage()
    const dataStr = JSON.stringify(storage, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${this.namespace}-export-${Date.now()}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  /**
   * Import data from JSON file
   */
  import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.items && Array.isArray(data.items)) {
            this.setStorage(data)
            this.dispatchEvent('import', data)
            resolve(data)
          } else {
            reject(new Error('Invalid data format'))
          }
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }

  /**
   * Get settings
   */
  getSettings() {
    try {
      const settings = localStorage.getItem(this.settingsKey)
      return settings ? JSON.parse(settings) : this.getDefaultSettings()
    } catch (error) {
      console.error('Error reading settings:', error)
      return this.getDefaultSettings()
    }
  }

  /**
   * Save settings
   */
  saveSettings(settings) {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings))
      this.dispatchEvent('settings-update', settings)
      return true
    } catch (error) {
      console.error('Error saving settings:', error)
      return false
    }
  }

  /**
   * Get default settings
   */
  getDefaultSettings() {
    return {
      theme: 'light',
      autosave: true,
      autosaveInterval: 30000,
      showStats: true,
      editorMode: 'wysiwyg',
    }
  }

  /**
   * Utility: Count words in HTML content
   */
  countWords(html) {
    const text = this.stripHtml(html)
    return text
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length
  }

  /**
   * Utility: Count characters in HTML content
   */
  countChars(html) {
    const text = this.stripHtml(html)
    return text.length
  }

  /**
   * Utility: Strip HTML tags
   */
  stripHtml(html) {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  /**
   * Dispatch custom events
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(`storage:${eventName}`, {
      detail,
      bubbles: true,
    })
    document.dispatchEvent(event)
  }

  /**
   * Get storage usage info
   */
  getStorageInfo() {
    const storage = this.getStorage()
    const storageStr = JSON.stringify(storage)
    const bytes = new Blob([storageStr]).size

    return {
      itemCount: storage.items.length,
      maxItems: this.maxItems,
      sizeBytes: bytes,
      sizeKB: (bytes / 1024).toFixed(2),
      percentage: ((storage.items.length / this.maxItems) * 100).toFixed(0),
    }
  }

  /**
   * Search saved items
   */
  search(query) {
    const storage = this.getStorage()
    const lowerQuery = query.toLowerCase()

    return storage.items.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(lowerQuery)
      const contentMatch = this.stripHtml(item.content).toLowerCase().includes(lowerQuery)
      return nameMatch || contentMatch
    })
  }
}

// Create global instance
window.storageManager = new StorageManager()
