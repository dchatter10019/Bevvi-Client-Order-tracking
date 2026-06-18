/** Inline script injected into index.html so the footer version matches /api/health even with cached JS bundles. */
export const VERSION_PATCH_SCRIPT = `(function(){
  function apply(v){
    document.querySelectorAll('.monitor-status-version').forEach(function(el){
      el.textContent='Bevvi Order Monitor v'+v;
    });
  }
  function refresh(){
    fetch('/api/health').then(function(r){return r.json();}).then(function(d){
      if(d&&d.version) apply(d.version);
    }).catch(function(){});
  }
  refresh();
  if(typeof MutationObserver!=='undefined'){
    new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true});
  }
})();`

export function injectVersionPatch(html, appVersion) {
  const meta = `<meta name="bevvi-app-version" content="${appVersion}" />`
  const script = `<script id="bevvi-version-patch">${VERSION_PATCH_SCRIPT}</script>`

  let next = html
  if (!next.includes('name="bevvi-app-version"')) {
    next = next.replace('</head>', `${meta}\n</head>`)
  }
  if (!next.includes('id="bevvi-version-patch"')) {
    next = next.replace('</body>', `${script}\n</body>`)
  }
  return next
}
