// Usage: node extract.cjs <htmlDir> <outDir>  -- offline structural extraction (no network, no JS)
const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const [htmlDir,outDir]=process.argv.slice(2); fs.mkdirSync(outDir,{recursive:true});
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({javaScriptEnabled:false}); const pg=await ctx.newPage();
 await pg.route('**/*', r=> r.request().url().startsWith('data:')? r.continue(): r.abort());
 for (const f of fs.readdirSync(htmlDir).filter(f=>f.endsWith('.html'))) {
  await pg.setContent(fs.readFileSync(path.join(htmlDir,f),'utf8'),{waitUntil:'domcontentloaded'});
  const data = await pg.evaluate(()=>{
    const BASE='https://www.garyjpottercarpentry.co.uk';
    const clean=(el)=>{ // keep a/strong/em/br; strip others
      const walk=(n)=>{ if(n.nodeType===3) return n.textContent.replace(/\s+/g,' ');
        if(n.nodeType!==1) return '';
        const t=n.tagName.toLowerCase(); const inner=[...n.childNodes].map(walk).join('');
        if(t==='a'){ let h=n.getAttribute('href')||''; if(h.startsWith(BASE)) h=h.slice(BASE.length)||'/'; return `<a href="${h}">${inner}</a>`; }
        if(t==='strong'||t==='b') return `<strong>${inner}</strong>`; if(t==='em'||t==='i') return `<em>${inner}</em>`; if(t==='br') return '<br>';
        return inner; };
      return walk(el).replace(/\s+/g,' ').trim(); };
    const root=document.querySelector('[data-elementor-type="wp-page"]')||document.querySelector('main')||document.body;
    const all=[...document.querySelectorAll('[data-elementor-type]')].map(e=>e.getAttribute('data-elementor-type')+':'+e.getAttribute('data-elementor-id'));
    const tops=[...root.children];
    const sections=[]; const widgetTypes={};
    for (const top of tops){ const blocks=[];
      const widgets=[...top.querySelectorAll('.elementor-widget')].filter(w=>!w.parentElement.closest('.elementor-widget'));
      for (const w of widgets){ const wt=(w.getAttribute('data-widget_type')||'').replace('.default',''); widgetTypes[wt]=(widgetTypes[wt]||0)+1;
        if(wt==='heading'){ const h=w.querySelector('.elementor-heading-title'); blocks.push({t:h.tagName.toLowerCase(), html:clean(h)}); }
        else if(wt==='text-editor'){ const c=w.querySelector('.elementor-widget-container')||w;
          const emit=(ch)=>{ const tg=ch.tagName.toLowerCase();
            if(['ul','ol'].includes(tg)) blocks.push({t:tg, items:[...ch.querySelectorAll(':scope>li')].map(clean)});
            else if(/^h[1-6]$/.test(tg)) blocks.push({t:tg, html:clean(ch)});
            else if(tg==='table') blocks.push({t:'table', rows:[...ch.querySelectorAll('tr')].map(tr=>[...tr.children].map(clean)), head: !!ch.querySelector('th')});
            else if(ch.querySelector(':scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > h5,:scope > h6,:scope > p,:scope > table,:scope > div,:scope > ul,:scope > ol')) { [...ch.children].forEach(emit); }
            else { const x=clean(ch); if(x) blocks.push({t:'p', html:x}); } };
          [...c.children].forEach(emit);
          if(!c.children.length){ const x=clean(c); if(x) blocks.push({t:'p',html:x}); } }
        else if(wt==='image'){ const i=w.querySelector('img'); if(i) blocks.push({t:'img', src:(i.getAttribute('data-src')||i.getAttribute('src')||'').split('/').pop(), alt:i.getAttribute('alt')}); }
        else if(wt==='button'){ const a=w.querySelector('a'); blocks.push({t:'button', text:clean(a||w), href:(a?.getAttribute('href')||'').replace(BASE,'')}); }
        else if(wt==='icon-list'){ blocks.push({t:'iconlist', items:[...w.querySelectorAll('li')].map(li=>({html:clean(li), href:(li.querySelector('a')?.getAttribute('href')||'').replace(BASE,'')}))}); }
        else if(wt==='divider'||wt==='spacer') {}
        else blocks.push({t:'widget', kind:wt, text:clean(w).slice(0,200)});
      }
      sections.push({id:top.getAttribute('data-id'), cls:(top.className||'').toString().slice(0,60), bg:(top.getAttribute('data-settings')||'').match(/background_background[^,]*/)?.[0]||'', blocks});
    }
    return {templates:all, widgetTypes, sections};
  });
  fs.writeFileSync(path.join(outDir,f.replace('.html','.json')),JSON.stringify(data,null,1));
 }
 await b.close(); console.log('done'); })();
