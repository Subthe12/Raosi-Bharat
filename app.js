let recipes=[], favorites=new Set(JSON.parse(localStorage.getItem('rasoi-favorites')||'[]'));
let region='All', category='All', favOnly=false;
const icons=['🍛','🥘','🍲','🫓','🍚','🥗','🍮','☕','🌶️','🥟','🍢','🥣'];
const $=s=>document.querySelector(s);
function saveFav(){localStorage.setItem('rasoi-favorites',JSON.stringify([...favorites]));}
function esc(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function iconFor(r){return icons[(r.id-1)%icons.length]}
function renderStats(){
  const regions=new Set(recipes.map(r=>r.region)).size, cats=new Set(recipes.map(r=>r.category)).size;
  $('#stats').innerHTML=`<div class="stat"><b>${recipes.length}+</b><span>recipes in the menu</span></div><div class="stat"><b>${regions}</b><span>regional food traditions</span></div><div class="stat"><b>${cats}</b><span>dish categories</span></div><div class="stat"><b>100%</b><span>local recipe data</span></div>`;
}
function chips(){
 const regions=['All',...new Set(recipes.map(r=>r.region))], cats=['All',...new Set(recipes.map(r=>r.category))];
 $('#regionChips').innerHTML=regions.map(x=>`<button class="chip ${region===x?'active':''}" onclick="setRegion('${esc(x)}')">${esc(x)}</button>`).join('');
 $('#categoryChips').innerHTML=cats.map(x=>`<button class="chip ${category===x?'active':''}" onclick="setCategory('${esc(x)}')">${esc(x)}</button>`).join('');
}
function filtered(){
 const q=$('#search').value.toLowerCase().trim();
 return recipes.filter(r=>{
  const text=[r.name,r.region,r.category,r.diet,r.description,...r.ingredients].join(' ').toLowerCase();
  return (!q||text.includes(q))&&(region==='All'||r.region===region)&&(category==='All'||r.category===category)&&(!favOnly||favorites.has(r.id));
 });
}
function render(){
 const list=filtered();
 $('#resultTitle').textContent=favOnly?'Your favorites':(qTitle());
 $('#resultCount').textContent=`${list.length} recipe${list.length===1?'':'s'}`;
 $('#grid').innerHTML=list.length?list.map(card).join(''):`<div class="empty"><div style="font-size:40px">🍽️</div><h3>No recipes found</h3><p>Try another dish, ingredient, region or category.</p></div>`;
}
function qTitle(){ if(region!=='All')return region; if(category!=='All')return category; return 'All recipes';}
function card(r){
 const fav=favorites.has(r.id);
 return `<article class="card" onclick="openRecipe(${r.id})"><div class="card-top">${iconFor(r)}<button class="fav" onclick="event.stopPropagation();toggleFav(${r.id})">${fav?'♥':'♡'}</button></div><div class="card-body"><div class="tags"><span class="tag">${esc(r.region)}</span><span class="tag">${esc(r.category)}</span></div><h3>${esc(r.name)}</h3><p>${esc(r.description)}</p><div class="meta"><span>⏱ ${r.time} min</span><span>${esc(r.diet)}</span></div></div></article>`;
}
function toggleFav(id){favorites.has(id)?favorites.delete(id):favorites.add(id);saveFav();render();}
function setRegion(x){region=x;chips();render()}
function setCategory(x){category=x;chips();render()}
function openRecipe(id){
 const r=recipes.find(x=>x.id===id); if(!r)return;
 $('#modalContent').innerHTML=`<div class="modal-kicker">${esc(r.region)} • ${esc(r.category)} • ${r.time} min</div><h2>${esc(r.name)}</h2><p class="modal-desc">${esc(r.description)}</p><div class="modal-cols"><div><h3>Ingredients</h3><ul>${r.ingredients.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div><div><h3>How to cook</h3>${r.steps.map((s,i)=>`<div class="step"><b>${i+1}</b><div>${esc(s)}</div></div>`).join('')}</div></div>`;
 $('#modal').classList.add('open');$('#modal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}
function closeModal(){$('#modal').classList.remove('open');$('#modal').setAttribute('aria-hidden','true');document.body.style.overflow='';}
$('#search').addEventListener('input',render);
$('#favoritesBtn').addEventListener('click',()=>{favOnly=!favOnly;$('#favoritesBtn').classList.toggle('active',favOnly);render();});
$('#randomBtn').addEventListener('click',()=>openRecipe(recipes[Math.floor(Math.random()*recipes.length)].id));
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
fetch('recipes.json').then(r=>r.json()).then(d=>{recipes=d;renderStats();chips();render();});
let deferredPrompt;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').hidden=false;});
$('#installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();deferredPrompt=null;$('#installBtn').hidden=true;});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
