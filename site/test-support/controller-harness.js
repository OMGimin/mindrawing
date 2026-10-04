export async function startController() {
  const original = Object.fromEntries(['document', 'window', 'location', 'history', 'localStorage', 'Image', 'URL', 'requestAnimationFrame', 'setTimeout', 'clearTimeout', 'navigator'].map((key) => [key, globalThis[key]]));
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const listeners = new Map();
  const windowEvents = new Map();
  const images = [];
  const revoked = [];
  const timers = [];
  const store = new Map();
  const tools = new Map();
  let nextUrl = 0;

  class Element {
    constructor(dataset = {}) {
      this.dataset = dataset;
      this.classList = { add() {}, remove() {}, toggle() {} };
      this.style = {};
      this.children = [];
      this.innerHTML = '';
      this.textContent = '';
      this.hidden = false;
    }
    addEventListener(type, listener) { (listeners.get(this) || (listeners.set(this, new Map()), listeners.get(this))).set(type, listener); }
    querySelector(selector) {
      if (selector === '#upload-error') return new Element();
      if (selector.startsWith('.upload-card')) return new Element();
      if (selector === '.drop-target') return this;
      if (selector === '#page-title, h1, h2') return new Element();
      return null;
    }
    querySelectorAll() { return []; }
    append(child) { this.children.push(child); }
    setAttribute() {}
    removeAttribute() {}
    focus() {}
    click() { listeners.get(this)?.get('click')?.({ target: this, preventDefault() {} }); }
    showModal() {}
    close() {}
  }
  const main = new Element();
  main.previews = {};
  main.querySelector = (selector) => {
    if (selector === '#upload-error') return new Element();
    if (selector.startsWith('.upload-card')) {
      const kind = selector.match(/data-kind="([^"]+)"/)?.[1];
      const target = new Element();
      target.append = (child) => {
        target.children.push(child);
        if (child.className === 'upload-preview') main.previews[kind] = child.src;
      };
      return { querySelector: () => target, classList: new Element().classList };
    }
    if (selector === '#page-title, h1, h2') return new Element();
    return null;
  };
  main.innerHTML = '<section>initial upload</section>';
  const status = new Element();
  const breadcrumb = new Element();
  const brand = new Element();
  const privacy = new Element();
  const navigation = ['studio', 'records', 'counsel', 'evidence'].map((view) => new Element({ view }));
  const fixed = new Map([['#main-content', main], ['#app-status', status], ['.breadcrumbs strong', breadcrumb], ['.brand', brand], ['#privacy-dialog', privacy], ['#privacy-open', new Element()], ['#privacy-close', new Element()], ['#privacy-done', new Element()]]);
  const document = {
    title: '', body: new Element(),
    querySelector: (selector) => fixed.get(selector),
    querySelectorAll: (selector) => selector === '.nav-link' ? navigation : [],
    createElement: () => new Element(),
    modelContext: { registerTool(spec) { tools.set(spec.name, spec); return { unregister() {} }; } }
  };
  const location = { hash: '' };
  const history = { replaceState(_state, _title, hash) { location.hash = hash; } };
  const url = { createObjectURL: () => `blob:test-${++nextUrl}`, revokeObjectURL: (value) => revoked.push(value) };
  class Image {
    constructor() { images.push(this); this.naturalWidth = 1; this.naturalHeight = 1; this.promise = new Promise((resolve, reject) => { this.resolve = resolve; this.reject = reject; }); }
    decode() { return this.promise; }
  }
  Object.assign(globalThis, {
    document, location, history, URL: url, Image,
    window: { scrollTo() {}, confirm: () => true, addEventListener(type, listener) { windowEvents.set(type, listener); }, print() {} },
    localStorage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, value), removeItem: (key) => store.delete(key) },
    requestAnimationFrame: (callback) => callback(),
    setTimeout: (callback, delay) => { const timer = { callback, delay }; timers.push(timer); return timer; },
    clearTimeout: () => {}
  });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { async writeText() {} } } });
  await import(`../dist/controller.js?test=${Math.random()}`);
  const dispatch = (element, type, target) => listeners.get(element)?.get(type)?.({ target, preventDefault() {} });
  return {
    main, images, revoked, timers, store, status,
    changeFile(kind, file) { dispatch(main, 'change', { dataset: { file: kind }, files: [file], matches: (selector) => selector === '[data-file]' }); },
    changeField(field, value) { dispatch(main, 'change', { dataset: { field }, value, checked: value, matches: (selector) => selector === '[data-field]' }); },
    inputField(field, value) { dispatch(main, 'input', { dataset: { field }, value }); },
    action(action, data = {}) { dispatch(main, 'click', { dataset: { action, ...data }, closest: () => ({ dataset: { action, ...data } }) }); },
    navigate(view) { navigation.find((item) => item.dataset.view === view).click(); },
    hashNavigate(view) { location.hash = `#${view}`; windowEvents.get('hashchange')(); },
    runDelay(delay) { const timer = timers.find((item) => item.delay === delay); if (!timer) throw new Error(`Missing timer ${delay}`); timer.callback(); },
    async state() { return JSON.parse((await tools.get('read_demo_state').execute({})).content[0].text); },
    restore() { for (const [key, value] of Object.entries(original)) { if (key === 'navigator') continue; if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } if (navigatorDescriptor) Object.defineProperty(globalThis, 'navigator', navigatorDescriptor); else delete globalThis.navigator; }
  };
}

export const imageFile = (name) => ({ name, type: 'image/png', size: 100 });
