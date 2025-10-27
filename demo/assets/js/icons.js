/**
 * Material Icons SVG
 * Icons from Google Material Symbols
 */

const createIcon = path => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${path}</svg>`
}

window.ToolbarIcons = {
  bold: createIcon(
    '<path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>',
  ),

  italic: createIcon('<path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>'),

  strikethrough: createIcon('<path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/>'),

  code: createIcon(
    '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>',
  ),

  heading1: createIcon(
    '<path d="M11 7h2v10h-2v-4H7v4H5V7h2v4h4V7zm6.57 0c-.594.98-1.368 1.65-2.32 2.01v1.76c1.474-.37 2.645-1.32 3.51-2.85l.33-.66h1.91v9.74h-2.24V7h-1.19z"/>',
  ),

  heading2: createIcon(
    '<path d="M11 7h2v10h-2v-4H7v4H5V7h2v4h4V7zm8.5 4c.83 0 1.5.67 1.5 1.5v.5h-2v-.5h-2.5v3h2.5v-1H21v2.5c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5V13h2v2h2.5v-2H15v-.5c0-.83.67-1.5 1.5-1.5h3z"/>',
  ),

  heading3: createIcon(
    '<path d="M11 7h2v10h-2v-4H7v4H5V7h2v4h4V7zm8.5 4c.83 0 1.5.67 1.5 1.5v.5h-2v-.5h-2.5v1.5H19c.83 0 1.5.67 1.5 1.5V16c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5V15h2v1h2.5v-1.5H16.5c-.83 0-1.5-.67-1.5-1.5v-1c0-.83.67-1.5 1.5-1.5h3z"/>',
  ),

  bulletList: createIcon(
    '<path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>',
  ),

  orderedList: createIcon(
    '<path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>',
  ),

  blockquote: createIcon('<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>'),

  codeBlock: createIcon(
    '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4zM3 3h18v2H3V3zm0 16h18v2H3v-2z"/>',
  ),

  undo: createIcon(
    '<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>',
  ),

  redo: createIcon(
    '<path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>',
  ),

  horizontalRule: createIcon('<path d="M19 13H5v-2h14v2z"/>'),

  hardBreak: createIcon(
    '<path d="M6 5v14h3v-6h5.59l-2.3 2.29L14 17l5-5-5-5-1.71 1.71L14.59 11H9c-1.1 0-2 .9-2 2v6h2V5H6z"/>',
  ),
}
