export class Translation {
  /**
   * 
   * @param {'translate' | 'detect' | 'transliterate'| 'languages'} path 
   * @param {{Text: string}[]} data 
   * @param {'POST' | 'GET'} method 
   * @param {string} fromLang
   * @param {string} toLang optional except path is translate
   * @param {string} baseLang optional except path is transliterate
   * @param {'translation' | 'transliteration'} scope 
   * @param {string} fromScript for transliterate
   * @param {string} toScript for transliterate
   */
  constructor(path, data, method, fromLang, toLang, baseLang, scope, fromScript, toScript) {
    this.path = path
    this.data = data
    this.method = method,
    this.fromLang = fromLang,
    this.toLang = toLang;
    this.baseLang = baseLang;
    this.scope = scope;
    this.fromScript = fromScript
    this.toScript = toScript
  }
}