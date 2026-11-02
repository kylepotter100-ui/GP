// node migrate.cjs <extractDir> <baseline.json> <outDir>
const fs=require('fs'), path=require('path');
const [dir, baselinePath, out]=process.argv.slice(2);
const base=JSON.parse(fs.readFileSync(baselinePath,'utf8'));
const strip=(h)=>h.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').trim();
for (const p of base.pages){
  const f=path.join(dir,'page'+p.path.replace(/\//g,'_')+'.json'); const d=JSON.parse(fs.readFileSync(f,'utf8'));
  const flat=[]; d.sections.forEach((s,si)=>s.blocks.forEach(b=>flat.push({...b, si})));
  const h1i=flat.findIndex(b=>b.t==='h1');
  const pre=flat.slice(0,h1i);
  const banner={ crumb: strip(pre.find(b=>b.t==='h2')?.html||''), subtext: pre.find(b=>b.t==='p')?.html||null, extra: pre.filter(b=>!['h2','p'].includes(b.t)) };
  const rest=flat.slice(h1i+1);
  const formIdx=rest.findIndex(b=>b.t==='widget'&&/Choose Files|SUBMIT/.test(b.text||''));
  let closeStart=-1;
  if(formIdx>=0){ for(let i=formIdx;i>=0;i--){ if(rest[i].t==='h2'){ closeStart=i; break; } } }
  // contact-us page: form sits inside the H1 section with no closing h2
  const body = closeStart>=0 ? rest.slice(0,closeStart) : (formIdx>=0? rest.slice(0,formIdx): rest);
  const closing = closeStart>=0 ? { heading: rest[closeStart].html, blocks: rest.slice(closeStart+1).filter(b=>!(b.t==='widget'&&/Choose Files|SUBMIT/.test(b.text||''))) } : null;
  const intro=[]; const chapters=[]; let cur=null;
  for(const b of body){ if(b.t==='h2'){ cur={heading:b.html, blocks:[]}; chapters.push(cur); } else if(cur) cur.blocks.push(b); else intro.push(b); }
  const clean=(arr)=>arr.map(({si,...b})=>b);
  const page={ path:p.path, title:p.title, description:p.description, canonical:p.canonical, ogImage:p.ogImage,
    crumb:banner.crumb, bannerSubtext:banner.subtext, h1:flat[h1i].html, intro:clean(intro),
    chapters:chapters.map(c=>({heading:c.heading, blocks:clean(c.blocks)})), closing: closing?{heading:closing.heading, blocks:clean(closing.blocks)}:null,
    hasForm: formIdx>=0 };
  const slug=p.path==='/'?'home':p.path.replace(/^\/|\/$/g,'').replace(/\//g,'--');
  fs.writeFileSync(path.join(out,slug+'.json'), JSON.stringify(page,null,1));
}
console.log('migrated', base.pages.length);
