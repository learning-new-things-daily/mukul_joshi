/* Simple data renderer: projects + posts */
(function(){
  const q = (sel) => document.querySelector(sel);

  async function loadJSON(path){
    const res = await fetch(path, { cache: 'no-cache' });
    if(!res.ok) throw new Error('Failed to fetch '+path);
    return res.json();
  }

  function renderProjects(containerSel, items){
    const el = q(containerSel);
    if(!el) return;
    el.innerHTML = '';
    items.forEach(p => {
      const tags = (p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
      const outcomes = (p.outcomes||[]).map(o=>`<li>${o}</li>`).join('');
      const links = (p.links||[]).map(l=>`<a href="${l.url}">${l.label}</a>`).join(' · ');
      const card = document.createElement('div');
      card.className = 'card card--glow';
      card.innerHTML = `
        <h3>${p.emoji?`<span class="marker">${p.emoji}</span>`:''}${p.title}</h3>
        <p>${p.summary||''}</p>
        ${outcomes?`<ul>${outcomes}</ul>`:''}
        <div class="tags">${tags}</div>
        <p style="margin-top:8px">${links||''}</p>
        <p><button class="btn" data-action="details">View details</button></p>
      `;
      card.querySelector('[data-action="details"]').addEventListener('click', ()=>openProjectModal(p));
      el.appendChild(card);
    });
  }

  function renderPosts(containerSel, items, limit=3){
    const el = q(containerSel);
    if(!el) return;
    el.innerHTML = '';
    items.slice(0, limit).forEach(p => {
      const div = document.createElement('div');
      const target = p.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      div.innerHTML = `<h3><a href="${p.url}"${target}>${p.title}</a></h3><p>${p.summary||''}</p>`;
      el.appendChild(div);
    });
  }

  // Bootstrap if containers exist
  (async function init(){
    try {
      if(q('#projects-list')){
        const projects = await loadJSON('data/projects.json');
        renderProjects('#projects-list', projects);
      }
      if(q('#blog-list')){
        const posts = await loadJSON('data/posts.json');
        renderPosts('#blog-list', posts, 3);
      }
    } catch(e){ /* graceful fallback: keep static content */ }
  })();

  // Modal logic
  function openProjectModal(p){
    const overlay = q('#project-modal');
    const title = q('#project-title');
    const content = q('#project-content');
    const closeBtn = q('#project-close');
    if(!overlay || !title || !content || !closeBtn) return;
    title.textContent = p.title;
    const outcomes = (p.outcomes||[]).map(o=>`<li>${o}</li>`).join('');
    const links = (p.links||[]).map(l=>`<a href="${l.url}">${l.label}</a>`).join(' · ');
    content.innerHTML = `
      ${p.summary?`<p>${p.summary}</p>`:''}
      ${outcomes?`<h4>Key outcomes</h4><ul>${outcomes}</ul>`:''}
      ${links?`<p>${links}</p>`:''}
    `;
    overlay.setAttribute('data-open','true');
    overlay.setAttribute('aria-hidden','false');
    // focus management
    closeBtn.focus();
    function onKey(e){ if(e.key==='Escape'){ closeModal(); } }
    function onClick(e){ if(e.target===overlay){ closeModal(); } }
    function closeModal(){
      overlay.setAttribute('data-open','false');
      overlay.setAttribute('aria-hidden','true');
      document.removeEventListener('keydown', onKey);
      overlay.removeEventListener('click', onClick);
    }
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', onClick);
    closeBtn.onclick = closeModal;
  }
})();
