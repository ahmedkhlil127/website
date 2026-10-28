// ============================================================
// PDF Pro – Main JavaScript
// ============================================================

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---- Hero particles ---- */
(function createParticles() {
  const container = document.getElementById('hero-particles');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 3;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 15 + 10}s;
      animation-delay:${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
})();

/* ---- Category filter ---- */
const catBtns = document.querySelectorAll('.cat-btn');
const blocks = document.querySelectorAll('.category-block');

catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    blocks.forEach(block => {
      if (cat === 'all' || block.dataset.cat === cat) {
        block.classList.remove('hidden');
        block.style.animation = 'fadeInUp 0.4s ease both';
        setTimeout(() => block.style.animation = '', 500);
      } else {
        block.classList.add('hidden');
      }
    });
  });
});

/* ---- Search ---- */
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    blocks.forEach(b => b.classList.remove('hidden'));
    document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('hidden'));
    // reset cat filter
    catBtns.forEach(b => b.classList.remove('active'));
    document.getElementById('cat-all').classList.add('active');
    return;
  }

  blocks.forEach(block => {
    const cards = block.querySelectorAll('.tool-card');
    let anyVisible = false;
    cards.forEach(card => {
      const name = card.querySelector('.tool-name').textContent.toLowerCase();
      const desc = card.querySelector('.tool-desc').textContent.toLowerCase();
      if (name.includes(query) || desc.includes(query)) {
        card.classList.remove('hidden');
        anyVisible = true;
      } else {
        card.classList.add('hidden');
      }
    });
    if (anyVisible) {
      block.classList.remove('hidden');
    } else {
      block.classList.add('hidden');
    }
  });
});

/* ---- FAQ accordion ---- */
function toggleFaq(id) {
  const item = document.getElementById(id);
  const isOpen = item.classList.contains('open');
  // close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
window.toggleFaq = toggleFaq;

/* ---- Tool modal ---- */
let currentTool = '';

function openTool(title, tool) {
  currentTool = tool;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent = `ارفع ملفك وابدأ ${title} الآن`;
  document.getElementById('fileInfo').style.display = 'none';
  document.getElementById('btnProcess').style.display = 'none';
  document.getElementById('fileInput').value = '';
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.openTool = openTool;

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
window.closeModal = closeModal;

/* Drag and drop */
const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFileObject(file);
});

function handleFile(e) {
  const file = e.target.files[0];
  if (file) handleFileObject(file);
}
window.handleFile = handleFile;

function handleFileObject(file) {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.docx', '.xlsx', '.pptx', '.doc', '.xls', '.ppt'];
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowed.includes(ext)) {
    showToast('نوع الملف غير مدعوم', 'error');
    return;
  }
  const size = (file.size / 1024 / 1024).toFixed(2);
  const info = document.getElementById('fileInfo');
  info.textContent = `📄 ${file.name}  (${size} MB)`;
  info.style.display = 'block';
  document.getElementById('btnProcess').style.display = 'flex';
}

function processFile() {
  const btn = document.getElementById('btnProcess');
  const text = document.getElementById('btnProcessText');
  const spinner = document.getElementById('btnSpinner');
  btn.disabled = true;
  text.textContent = 'جارٍ المعالجة...';
  spinner.style.display = 'block';

  // Simulate processing
  setTimeout(() => {
    btn.disabled = false;
    text.textContent = 'معالجة الملف';
    spinner.style.display = 'none';
    closeModal();
    showToast('✅ تمت المعالجة بنجاح! جاري التحميل...', 'success');
  }, 2500);
}
window.processFile = processFile;

/* ---- Toast ---- */
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
window.showToast = showToast;

/* ---- Intersection Observer (scroll reveal) ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.5s ease both';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .step-card, .faq-item, .category-block').forEach(el => {
  el.style.opacity = '0';
  el.style.animation = 'none';
  observer.observe(el);
});

// Ensure fadeInUp keyframes work
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);

/* ---- Keyboard close modal ---- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ---- Smooth anchor scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
