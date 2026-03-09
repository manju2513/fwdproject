/* ── Cursor ── */
const cur=document.getElementById('cur'),crng=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function ac(){cur.style.left=mx-5+'px';cur.style.top=my-5+'px';rx+=(mx-rx)*.12;ry+=(my-ry)*.12;crng.style.left=rx-18+'px';crng.style.top=ry-18+'px';requestAnimationFrame(ac);})();

/* ── Page navigation ── */
const pageMap={login:'pg-login',home:'pg-home',dash:'pg-dash',emg:'pg-emg',auth:'pg-auth'};
let hcDone=false,lcDone=false;

function nav(pg){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  const el=document.getElementById(pageMap[pg]);
  if(el){el.classList.add('on');window.scrollTo(0,0);}
  if(pg==='home'){
    if(!hcDone){hcDone=true;setTimeout(initHeroCanvas,80);}
    initObserver();
  }
  if(pg==='login'){if(!lcDone){lcDone=true;initLoginCanvas();}}
  // reset dash subs when navigating to dash
  if(pg==='dash') showSub('cards');
}

/* ── Login canvas ── */
function initLoginCanvas(){
  const c=document.getElementById('lc');
  if(!c)return;
  const ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  const pts=Array.from({length:100},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.4+.3,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,a:Math.random()*.35+.05}));
  (function draw(){ctx.clearRect(0,0,c.width,c.height);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,214,0,${p.a})`;ctx.fill();});requestAnimationFrame(draw);})();
}
initLoginCanvas();

/* ── Hero canvas ── */
function initHeroCanvas(){
  const hc=document.getElementById('hcanvas');
  if(!hc)return;
  const hx=hc.getContext('2d');
  hc.width=window.innerWidth;hc.height=window.innerHeight;
  const dots=Array.from({length:68},()=>({x:Math.random()*hc.width,y:Math.random()*hc.height,r:.4+Math.random()*1.4,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,a:.08+Math.random()*.28}));
  const lines=Array.from({length:9},()=>({x:Math.random()*hc.width,y:Math.random()*hc.height,len:36+Math.random()*110,angle:Math.PI/4*(Math.floor(Math.random()*2)),a:.02+Math.random()*.05,spd:.25+Math.random()*.45}));
  (function draw(){hx.clearRect(0,0,hc.width,hc.height);lines.forEach(l=>{hx.strokeStyle=`rgba(255,214,0,${l.a})`;hx.lineWidth=1;hx.beginPath();hx.moveTo(l.x,l.y);hx.lineTo(l.x+Math.cos(l.angle)*l.len,l.y+Math.sin(l.angle)*l.len);hx.stroke();l.y-=l.spd;if(l.y<-180)l.y=hc.height+80;});dots.forEach(d=>{d.x+=d.vx;d.y+=d.vy;if(d.x<0)d.x=hc.width;if(d.x>hc.width)d.x=0;if(d.y<0)d.y=hc.height;if(d.y>hc.height)d.y=0;hx.beginPath();hx.arc(d.x,d.y,d.r,0,Math.PI*2);hx.fillStyle=`rgba(255,214,0,${d.a})`;hx.fill();});requestAnimationFrame(draw);})();
  // road dashes
  const dc=document.getElementById('rdashes');if(dc&&!dc.childElementCount){for(let i=0;i<32;i++){const d=document.createElement('div');d.className='road-dash';dc.appendChild(d);}}
}

/* ── Scroll observer ── */
let obsReady=false;
function initObserver(){
  if(obsReady)return;obsReady=true;
  const ob=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:.1});
  document.querySelectorAll('.obs').forEach(el=>ob.observe(el));
}

/* ── Login logic ── */
function switchTab(t){
  document.querySelectorAll('.ltab').forEach((b,i)=>b.classList.toggle('on',(t==='login'&&i===0)||(t==='register'&&i===1)));
  document.getElementById('lp-login').classList.toggle('on',t==='login');
  document.getElementById('lp-reg').classList.toggle('on',t==='register');
}
function doLogin(){
  const email = document.getElementById("l-email").value.trim();
  const pass = document.getElementById("l-pass").value.trim();
  const err = document.getElementById("l-err");
  if(email === "" || pass === ""){
    err.style.display = "block";
    err.textContent = "Please enter email and password.";
    return;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailPattern.test(email)){
    err.style.display = "block";
    err.textContent = "Please enter a valid email address.";
    return;
  }
  err.style.display = "none";
  nav("home");
}
function doRegister(){
  const n=document.getElementById('r-name').value;
  const e=document.getElementById('r-email').value;
  const p=document.getElementById('r-pass').value;
  if(n&&e&&p)nav('home');
}
document.addEventListener('keydown',e=>{if(e.key==='Enter'){const lp=document.getElementById('lp-login');if(lp&&lp.classList.contains('on'))doLogin();}});

/* ── Dashboard sub-views ── */
let ghDone=false,ghMap,ghMarker;
function showSub(name){
  document.querySelectorAll('.sub').forEach(s=>s.classList.remove('on'));
  const el=document.getElementById('sv-'+name);
  if(el){el.classList.add('on');window.scrollTo(0,0);}
  if(name==='gh'&&!ghDone){ghDone=true;setTimeout(initGHMap,120);}
}

/* ── Volunteer dots on card ── */
const nv=document.getElementById('netViz');
if(nv){[{x:22,y:20},{x:72,y:16},{x:16,y:68},{x:76,y:72},{x:50,y:8},{x:10,y:44}].forEach((v,i)=>{const d=document.createElement('div');d.className='vd';d.style.cssText=`left:${v.x}%;top:${v.y}%;animation-delay:${i*.3}s;`;d.textContent='👤';nv.appendChild(d);});}

/* ── Near Miss form ── */
document.getElementById('nmUpload').addEventListener('click',()=>document.getElementById('nmFile').click());
document.getElementById('nmFile').addEventListener('change',function(e){if(e.target.files.length>0)document.getElementById('nmUpTxt').textContent='Selected: '+e.target.files[0].name;});
/* ── Golden Hour Map ── */
const ghVolunteers=[
  {name:'Ravi Kumar',dist:'0.3 km',certified:'First Aid Certified'},
  {name:'Anita Sharma',dist:'0.7 km',certified:'CPR Certified'},
  {name:'Rahul Mehta',dist:'1.1 km',certified:'Basic First Aid'}
];

function renderVolunteers(verified){
  const list=document.getElementById('gh-vols');
  list.innerHTML='';
  ghVolunteers.forEach(v=>{
    const d=document.createElement('div');
    d.className='gh-vol';
    if(verified){
      d.innerHTML=`
        <span>👤 ${v.name}</span>
        <span style="color:var(--dim);font-size:12px;">${v.dist}</span>
        <span class="gh-vbadge" style="margin-left:auto;">✔ Verified — Notified</span>`;
      d.style.background='rgba(0,100,0,0.35)';
      d.style.borderColor='rgba(0,200,0,0.3)';
    } else {
      d.innerHTML=`
        <span>👤 ${v.name}</span>
        <span style="color:var(--dim);font-size:12px;">${v.dist} · ${v.certified}</span>
        <span style="margin-left:auto;color:var(--dim);font-size:11px;font-family:'Barlow Condensed';letter-spacing:2px;">STANDBY</span>`;
      d.style.background='rgba(255,255,255,0.03)';
      d.style.borderColor='rgba(255,255,255,0.08)';
    }
    list.appendChild(d);
  });
}

function initGHMap(){
  ghMap=L.map('gh-map').setView([20.5937,78.9629],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(ghMap);
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      const lat=pos.coords.latitude,lon=pos.coords.longitude;
      ghMap.setView([lat,lon],14);
      ghMarker=L.marker([lat,lon]).addTo(ghMap).bindPopup('📍 Your Location').openPopup();
      document.getElementById('gh-locStatus').textContent='✅ Location detected. Submit an accident report to alert volunteers.';
    },()=>{document.getElementById('gh-locStatus').textContent='⚠️ Could not detect location. Please allow access.';});
  } else {document.getElementById('gh-locStatus').textContent='❌ Geolocation not supported.';}
  /* Render volunteers as unverified/standby initially */
  renderVolunteers(false);
}

function ghReport(){
  if(!ghMarker){alert('⚠️ Location not detected yet. Please allow location access.');return;}
  /* Now verify volunteers after report is submitted */
  renderVolunteers(true);
  L.circle(ghMarker.getLatLng(),{radius:300,color:'red',fillOpacity:.12}).addTo(ghMap);
  document.getElementById('gh-locStatus').textContent='🚨 Accident reported! Nearby volunteers have been verified and notified.';
  document.querySelector('.gh-report').textContent='✅ Report Submitted';
  document.querySelector('.gh-report').style.background='#2d7a2d';
  document.querySelector('.gh-report').disabled=true;
}

function ghCall(n){window.location.href='tel:'+n;}

/* ── Near Miss Zone Map ── */
const zoneData={
  mg:{name:'MG Road Junction',type:'Missing Zebra Crossing',risk:'rb-h',riskLabel:'HIGH RISK',
    img:'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    emoji:'🚦',
    info:'No zebra crossing markings at this busy 4-lane junction. Pedestrians risk their lives crossing during peak hours. 8 near-miss incidents reported in 2 weeks.',
    reports:8,score:87,status:'Under Review'},
  park:{name:'Park Street, Secunderabad',type:'No Street Lighting',risk:'rb-m',riskLabel:'MEDIUM RISK',
    img:'',emoji:'🌑',
    info:'500m stretch with zero functional street lights for 3+ weeks. Multiple near-collisions reported after 8 PM. Reported to GHMC — repair pending.',
    reports:4,score:62,status:'Reported to GHMC'},
  school:{name:"St. Mary's School Zone, Begumpet",type:'Vehicle Speeding',risk:'rb-h',riskLabel:'HIGH RISK',
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/School_zone_-_geograph.org.uk_-_2348289.jpg/640px-School_zone_-_geograph.org.uk_-_2348289.jpg',
    emoji:'🏫',
    info:'Vehicles regularly exceed 60 kmph in a 20 kmph school zone during drop-off hours. A speed bump has been installed after 22 reports.',
    reports:22,score:91,status:'✅ Speed Bump Installed'},
  highway:{name:'Highway Exit 42, ORR',type:'Missing Signage',risk:'rb-l',riskLabel:'LOW RISK',
    img:'',emoji:'🛣',
    info:'Exit sign for ORR Exit 42 missing for 1+ month. Vehicles brake and lane-switch dangerously. Forwarded to NHAI.',
    reports:3,score:45,status:'Forwarded to NHAI'},
  charminar:{name:'Charminar Cross, Old City',type:'Wrong Way Driving',risk:'rb-m',riskLabel:'MEDIUM RISK',
    img:'',emoji:'⚠️',
    info:'Frequent wrong-way driving reported near Charminar roundabout during late evenings. 5 community reports in the last week.',
    reports:5,score:70,status:'Traffic Police Alerted'},
  hitec:{name:'HITEC City Signal, Madhapur',type:'Signal Jumping',risk:'rb-h',riskLabel:'HIGH RISK',
    img:'',emoji:'🚨',
    info:'Signal jumping at HITEC City main junction at peak hours is extremely frequent. 12 near-miss incidents reported. CCTV monitoring requested.',
    reports:12,score:84,status:'CCTV Deployment Pending'},
  lb:{name:'LB Nagar Junction',type:'Poor Road Condition',risk:'rb-l',riskLabel:'LOW RISK',
    img:'',emoji:'🕳',
    info:'Large pothole near LB Nagar flyover causing motorcycles to swerve dangerously. 2 reports filed. GHMC repair scheduled.',
    reports:2,score:38,status:'Repair Scheduled'}
};

function showZone(id){
  const z=zoneData[id];if(!z)return;
  const det=document.getElementById('nmZoneDetail');
  det.innerHTML=`
    <div class="nzd-content on">
      ${z.img
        ?`<img src="${z.img}" class="nzd-img" onerror="this.outerHTML='<div class=nzd-img-fallback>${z.emoji}</div>'" alt="${z.name}">`
        :`<div class="nzd-img-fallback">${z.emoji}</div>`}
      <div class="nzd-name">${z.name}</div>
      <div class="nzd-type">${z.type} &nbsp;·&nbsp; <span class="rbadge ${z.risk}">${z.riskLabel}</span></div>
      <div class="nzd-info">${z.info}</div>
      <div class="nzd-stats">
        <div class="nzd-stat"><div class="nzd-stat-v">${z.reports}</div><div class="nzd-stat-l">Reports</div></div>
        <div class="nzd-stat"><div class="nzd-stat-v">${z.score}</div><div class="nzd-stat-l">AI Risk Score</div></div>
      </div>
      <div style="margin-top:10px;padding:8px 12px;background:rgba(255,214,0,0.05);border:1px solid rgba(255,214,0,0.15);font-size:11px;color:var(--yellow);font-family:'Barlow Condensed';letter-spacing:1px;">STATUS: ${z.status}</div>
    </div>`;
}

/* ── Authorities filter ── */
function filterAuth(cat,el){
  document.querySelectorAll('.ftab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('#authTbl tbody tr').forEach(r=>{r.style.display=(cat==='all'||r.dataset.cat===cat)?'':'none';});
}

/* ══════════════════════════════════════════════════════
   CO3 — Arrays & Objects (Data Structures)
══════════════════════════════════════════════════════ */
const nearMissReports = [
  { location: "MG Road Junction", type: "Near Collision", risk: "High" },
  { location: "Highway Exit 12", type: "Sudden Brake", risk: "Medium" },
  { location: "Park Street, Secunderabad", type: "No Street Lighting", risk: "Medium" },
  { location: "St. Mary's School Zone", type: "Vehicle Speeding", risk: "High" }
];

const emergencyNumbers = {
  police: "100",
  ambulance: "108",
  fire: "101",
  highway: "1073",
  disaster: "112"
};

const authorityDirectory = {
  national: ["NHAI", "MoRTH", "NHIDCL"],
  state: ["Telangana Traffic Police", "TSRTC"],
  city: ["GHMC", "HMDA", "Hyderabad City Police"]
};

/* ══════════════════════════════════════════════════════
   CO4 — Fetch API (Real API Call)
══════════════════════════════════════════════════════ */
async function loadSafetyTips(){
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    const data = await response.json();
    console.log("Safety Data Loaded:", data);
  } catch(error) {
    console.log("API error:", error);
  }
}

/* ══════════════════════════════════════════════════════
   CO2 — Near Miss Form Validation & Submission
══════════════════════════════════════════════════════ */
function submitNearMiss(){
  const location = document.getElementById("nm-location") ? document.getElementById("nm-location").value : "";
  const description = document.getElementById("nm-desc") ? document.getElementById("nm-desc").value : "";
  if(location === "" || description === ""){
    alert("Please fill all required fields");
    return;
  }
  nearMissReports.push({
    location: location,
    description: description,
    risk: "Pending",
    timestamp: new Date().toISOString()
  });
  alert("✅ Report submitted successfully! You earned 50 points.");
}

/* ══════════════════════════════════════════════════════
   CO4 — addEventListener (Event Listeners)
══════════════════════════════════════════════════════ */
window.addEventListener("load", function(){
  // Load safety tips via API
  loadSafetyTips();

  // Log nav interactions
  document.querySelectorAll(".nb").forEach(btn => {
    btn.addEventListener("click", function(){
      console.log("Navigation clicked:", this.textContent.trim());
    });
  });

  // Enter key on login
  document.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
      const loginPanel = document.getElementById("lp-login");
      if(loginPanel && loginPanel.classList.contains("on")) doLogin();
    }
  });

  console.log("Road Safety Hub loaded. Emergency numbers:", emergencyNumbers);
  console.log("Near miss report count:", nearMissReports.length);
});
