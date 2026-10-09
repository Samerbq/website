// live clock 

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        timeZone: 'Europe/Brussels',
        hour12: true 
    }); 
    
    document.getElementById('clock').innerText = " central european time - " + timeString;
}

setInterval(updateTime, 1000);
updateTime();

const LINKS = [
  { label: 'about',   url: 'about.html' },
  { label: 'faq',     url: 'faq.html' },
  { label: 'blog',    url: 'blog.html' },
  { label: 'resume',  url: 'resume.html' },
  { label: 'contact', url: 'contact.html' }
];

const floatingLinks = [];
const area = document.getElementById('linkArea'); 

const SPEED = 0.70; 

LINKS.forEach((link) => {
  const el = document.createElement('a');
  el.href = link.url;
  el.textContent = link.label;
  el.className = 'floating-link';
  
  area.appendChild(el);


  floatingLinks.push({
    el,
    x: Math.random() * (area.offsetWidth - 60),
    y: Math.random() * (area.offsetHeight - 20),

    vx: (Math.random() > 0.5 ? 1 : -1) * SPEED,
    vy: (Math.random() > 0.5 ? 1 : -1) * SPEED
  });
});

function animate() {
  const w = area.offsetWidth;
  const h = area.offsetHeight;

  floatingLinks.forEach(link => {
    link.x += link.vx;
    link.y += link.vy;


    if (link.x <= 0 || link.x >= w - link.el.offsetWidth) { 
        link.vx *= -1; 
        link.x = Math.max(0, Math.min(w - link.el.offsetWidth, link.x)); 
    }

    if (link.y <= 0 || link.y >= h - link.el.offsetHeight) { 
        link.vy *= -1; 
        link.y = Math.max(0, Math.min(h - link.el.offsetHeight, link.y)); 
    }

    link.el.style.left = link.x + 'px';
    link.el.style.top = link.y + 'px';
  });

  requestAnimationFrame(animate);
}

setTimeout(animate, 100);