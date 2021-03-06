export const inBrowser = typeof window !== 'undefined'

/**
 * Converts a url path to the corresponding js chunk filename.
 */
export function pathToFile(path: string): string {
  let pagePath = path.replace(/\.html$/, '')
  if (pagePath.endsWith('/')) {
    pagePath += 'index'
  }

  if (__DEV__) {
    // awlays force re-fetch content in dev
    pagePath += `.md?t=${Date.now()}`
  } else {
    // in production, each .md file is built into a .md.js file following
    // the path conversion scheme.
    // /foo/bar.html -> ./foo_bar.md
    if (inBrowser) {
      const base = process.env.BASE_URL
      pagePath = pagePath.slice(base.length).replace(/\//g, '_') + '.md'
      // client production build needs to account for page hash, which is
      // injected directly in the page's html
      const pageHash = __VP_HASH_MAP__[pagePath]
      pagePath = `${base}_assets/${pagePath}.${pageHash}.js`
    } else {
      // ssr build uses much simpler name mapping
      pagePath = `./${pagePath.slice(1).replace(/\//g, '_')}.md.js`
    }
  }

  return pagePath
}
