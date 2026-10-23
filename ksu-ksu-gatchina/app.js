'use strict';
(() => {
 const data=JSON.parse(document.querySelector('#site-data').textContent);
 const services=data.services, $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
 let selected=data.initial, color='';
 const price=s=>s.price||'Уточнить стоимость';
 function message(s){return `Здравствуйте! Интересует ${s.name}. ${color?'Идея оттенка: '+color+'. ':''}Подскажите, пожалуйста, актуальную стоимость и доступное время.`;}
 function select(i,jump=false){
  const s=services[i];if(!s)return;selected=i;
  $('.selected-title').textContent=s.name;$('.selected-price').textContent=price(s);
  $('.selected-detail').textContent=[s.details,s.unit].filter(Boolean).join(' · ');
  $('#message').value=message(s);$('.copy-state').textContent='';
  $$('[data-service]').forEach(b=>{if(!b.dataset.jump)b.setAttribute('aria-pressed',String(+b.dataset.service===i));});
  const pos=data.focus.indexOf(i);if($('#volume')&&pos>=0){$('#volume').value=pos;$('.volume-art').style.setProperty('--lashwidth',1.4+pos*.3);}
  if(jump)$('#selection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
 }
 function bindServices(root=document){root.querySelectorAll('[data-service]').forEach(b=>b.addEventListener('click',()=>select(+b.dataset.service,!!b.dataset.jump)));}
 bindServices();
 function renderOptions(indices){
  const box=$('.service-filtered')||$('.feature-options'); if(!box)return;
  box.replaceChildren();
  indices.forEach((i,n)=>{const b=document.createElement('button');b.type='button';b.className='choice';b.dataset.service=i;b.setAttribute('aria-pressed',String(n===0));b.textContent=services[i].name;box.append(b);});
  bindServices(box);if(indices.length)select(indices[0]);
 }
 $$('[data-group]').forEach(b=>b.addEventListener('click',()=>{const g=b.dataset.group;$$('[data-group]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.group===g)));renderOptions(services.map((s,i)=>s.category===g?i:-1).filter(i=>i>=0));}));
 $$('[data-color]').forEach(b=>b.addEventListener('click',()=>{color=b.getAttribute('aria-label');$('.nail-art').style.setProperty('--polish',b.dataset.color);$('#color-name').textContent=color;$$('[data-color]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#message').value=message(services[selected]);}));
 if($('#volume'))$('#volume').addEventListener('input',e=>select(data.focus[+e.target.value]));
 $$('[data-zone]').forEach(b=>b.addEventListener('click',()=>{
  const matches={brows:/бров|осветлен/i,eyes:/ресниц|глаз|стрелоч|реcниц|межриснич/i,lips:/губ/i};
  const indices=services.map((s,i)=>matches[b.dataset.zone].test(s.name)?i:-1).filter(i=>i>=0);
  $$('[data-zone]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderOptions(indices);
 }));
 $$('[data-compare]').forEach(el=>el.addEventListener('change',()=>{const s=services[+el.value],box=el.closest('.compare-box');box.querySelector('.compare-price').textContent=price(s);box.querySelector('.compare-detail').textContent=[s.details,s.unit].filter(Boolean).join(' · ')||'Состав и условия процедуры уточните у студии.';}));
 $$('[data-use-compare]').forEach(b=>b.addEventListener('click',()=>select(+$('#compare-'+b.dataset.useCompare).value,true)));
 $$('[data-package]').forEach(b=>b.addEventListener('click',()=>{
  $$('[data-package]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  if(b.dataset.package==='combo')select(0);else{
   $('.selected-title').textContent='Маникюр и педикюр — отдельные позиции';$('.selected-price').textContent='2 700 ₽';$('.selected-detail').textContent='1 000 ₽ + 1 700 ₽. Сумма двух опубликованных позиций; состав может отличаться от гигиенического комплекса.';
   $('#message').value='Здравствуйте! Интересует маникюр и педикюр. Подскажите, пожалуйста, чем отличается гигиенический комплекс за 2 200 ₽ от отдельных позиций за 1 000 ₽ и 1 700 ₽ и какие цены действуют сейчас?';
  }
 }));
 $('.copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#message').value);$('.copy-state').textContent='Скопировано. Отправьте текст мастеру сами — с сайта он не отправляется.';}catch{$('#message').focus();$('#message').select();$('.copy-state').textContent='Выделили текст. Скопируйте его обычным способом.';}});
 $('#price-search').addEventListener('input',e=>{const q=e.target.value.toLocaleLowerCase('ru').trim();let count=0;$$('.price-row').forEach(row=>{const show=row.dataset.search.includes(q);row.hidden=!show;if(show)count++;});$('.price-count').textContent=`Найдено: ${count}`;$('.no-results').hidden=count>0;});
})();
