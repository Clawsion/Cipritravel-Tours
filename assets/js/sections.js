/**
 * Cipritravel Tours - Motor de Renderização de Secções
 * Sistema modular para carregar e renderizar conteúdo dinamicamente
 */

// ============================================
// CONFIGURAÇÃO E ESTADO GLOBAL
// ============================================
const SITE = {
  data: null,
  menu: null,
  footer: null,
  modais: null,
  config: null,
  lang: localStorage.getItem('lang') || 'pt',
  theme: localStorage.getItem('theme') || 'light'
};

// ============================================
// TRADUÇÕES ESTÁTICAS
// ============================================
const TRANSLATIONS = {
  pt: {
    'pessoa': 'pessoa',
    'Reservar': 'Reservar',
    'Ler Mais': 'Ler Mais',
    'Incluído no pacote:': 'Incluído no pacote:',
    'Seleciona...': 'Seleciona...',
    'Por favor preencha o nome e email.': 'Por favor preencha o nome e email.',
    'O seu nome...': 'O seu nome...',
    'A sua mensagem...': 'A sua mensagem...',
    'Nome Completo': 'Nome Completo',
    'Telefone': 'Telefone',
    'Morada': 'Morada',
    'Mensagem': 'Mensagem',
    'Enviar Mensagem': 'Enviar Mensagem',
    'Links Rápidos': 'Links Rápidos',
    'Contactos': 'Contactos',
    'Redes Sociais': 'Redes Sociais',
    'Política de Privacidade': 'Política de Privacidade',
    'Fale connosco no WhatsApp': 'Fale connosco no WhatsApp',
    'A carregar...': 'A carregar...',
    'Saber Mais': 'Saber Mais',
    'Book Now': 'Reservar Agora',
    'Learn More': 'Saber Mais',
    'Your name...': 'O seu nome...',
    'Your message...': 'A sua mensagem...',
    'Full Name': 'Nome Completo',
    'Phone': 'Telefone',
    'Address': 'Morada',
    'Message': 'Mensagem',
    'Send Message': 'Enviar Mensagem',
    'Quick Links': 'Links Rápidos',
    'Contacts': 'Contactos',
    'Social Media': 'Redes Sociais',
    'Privacy Policy': 'Política de Privacidade',
    'Contact us on WhatsApp': 'Fale connosco no WhatsApp',
    'Loading...': 'A carregar...',
    'Read More': 'Ler Mais',
    'Book': 'Reservar',
    'per person': 'p/pessoa',
    'Select...': 'Seleciona...',
    'Please fill in name and email.': 'Por favor preencha o nome e email.',
    'Thank you! We\'ll contact you soon.': 'Obrigado! Entraremos em contacto em breve.',
    'Thank you! Message sent successfully.': 'Obrigado! Mensagem enviada com sucesso.'
  },
  en: {
    'pessoa': 'person',
    'Reservar': 'Book',
    'Ler Mais': 'Read More',
    'Incluído no pacote:': 'Included in the package:',
    'Seleciona...': 'Select...',
    'Por favor preencha o nome e email.': 'Please fill in name and email.',
    'O seu nome...': 'Your name...',
    'A sua mensagem...': 'Your message...',
    'Nome Completo': 'Full Name',
    'Telefone': 'Phone',
    'Morada': 'Address',
    'Mensagem': 'Message',
    'Enviar Mensagem': 'Send Message',
    'Links Rápidos': 'Quick Links',
    'Contactos': 'Contacts',
    'Redes Sociais': 'Social Media',
    'Política de Privacidade': 'Privacy Policy',
    'Fale connosco no WhatsApp': 'Contact us on WhatsApp',
    'A carregar...': 'Loading...',
    'Saber Mais': 'Learn More',
    'Book Now': 'Book Now',
    'Learn More': 'Learn More',
    'Your name...': 'Your name...',
    'Your message...': 'Your message...',
    'Full Name': 'Full Name',
    'Phone': 'Phone',
    'Address': 'Address',
    'Message': 'Message',
    'Send Message': 'Send Message',
    'Quick Links': 'Quick Links',
    'Contacts': 'Contacts',
    'Social Media': 'Social Media',
    'Privacy Policy': 'Privacy Policy',
    'Contact us on WhatsApp': 'Contact us on WhatsApp',
    'Loading...': 'Loading...',
    'Read More': 'Read More',
    'Book': 'Book',
    'per person': 'per person',
    'Select...': 'Select...',
    'Please fill in name and email.': 'Please fill in name and email.',
    'Thank you! We\'ll contact you soon.': 'Thank you! We\'ll contact you soon.',
    'Thank you! Message sent successfully.': 'Thank you! Message sent successfully.'
  }
};

// ============================================
// CARREGAMENTO DE DADOS
// ============================================
async function loadAllData() {
  try {
    const [homepage, menu, footer, modais, config] = await Promise.all([
      fetch('data/homepage.json').then(r => r.json()),
      fetch('data/menu.json').then(r => r.json()),
      fetch('data/footer.json').then(r => r.json()),
      fetch('data/modais.json').then(r => r.json()),
      fetch('data/config.json').then(r => r.json())
    ]);
    
    SITE.data = homepage;
    SITE.menu = menu;
    SITE.footer = footer;
    SITE.modais = modais;
    SITE.config = config;
    
    return true;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return false;
  }
}

// ============================================
// RENDERIZADOR PRINCIPAL
// ============================================
function renderPage() {
  const secoes = SITE.data.secoes
    .filter(s => s.ativo !== false)
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  
  const main = document.getElementById('main-content');
  if (main) {
    main.innerHTML = secoes.map(renderSection).join('');
  }
  
  renderMenu();
  renderFooter();
  renderModals();
  applyLang(SITE.lang);
  applyTheme(SITE.theme);
}

// ============================================
// ROUTER DE SECÇÕES
// ============================================
function renderSection(section) {
  const renderers = {
    'hero': renderHero,
    'banner': renderBanner,
    'tours': renderTours,
    'blog': renderBlog,
    'cards': renderCards,
    'texto-imagem': renderTextoImagem,
    'features': renderFeatures,
    'cta': renderCTA,
    'formulario': renderFormulario,
    'spacer': renderSpacer,
    'html': renderHTML
  };
  
  return renderers[section.type] ? renderers[section.type](section) : '';
}

// ============================================
// FUNÇÃO DE TRADUÇÃO
// ============================================
function t(pt, en) {
  if (SITE.lang === 'en') {
    return en || pt;
  }
  return pt;
}

// Tradução para textos estáticos
function ts(key) {
  return TRANSLATIONS[SITE.lang]?.[key] || TRANSLATIONS['pt']?.[key] || key;
}

// ============================================
// RENDERIZADORES DE SECÇÕES
// ============================================

function renderHero(s) {
  return `
    <section class="hero-section" id="${s.id || 'home'}">
      <img class="hero-img" src="${s.imagem}" alt="Hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;padding:8px 24px;border-radius:999px;font-size:0.85rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px">
          <span data-pt="${s.bannerTexto || ''}" data-en="${s.bannerTextoEn || s.bannerTexto || ''}">${t(s.bannerTexto, s.bannerTextoEn)}</span>
        </div>
        <h1 class="font-playfair" style="font-size:clamp(2rem,5vw,3.5rem);font-weight:700;margin-bottom:16px;line-height:1.2">
          <span data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</span><br>
          <span style="color:#f97316" data-pt="${s.tituloDestaque}" data-en="${s.tituloDestaqueEn || s.tituloDestaque}">${t(s.tituloDestaque, s.tituloDestaqueEn)}</span>
        </h1>
        <p style="font-size:clamp(1rem,2.5vw,1.3rem);font-weight:600;margin-bottom:8px;color:#e2e8f0" data-pt="${s.subtitulo}" data-en="${s.subtituloEn || s.subtitulo}">${t(s.subtitulo, s.subtituloEn)}</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-top:28px">
          <button class="btn-primary" onclick="openModal('modal-hero')" data-pt="${s.botoes?.primario || 'Saber Mais'}" data-en="${s.botoes?.primarioEn || 'Learn More'}">${t(s.botoes?.primario || 'Saber Mais', s.botoes?.primarioEn || 'Learn More')}</button>
          <button class="btn-outline" onclick="openModal('modal-reserva')" data-pt="${s.botoes?.secundario || 'Reservar Agora'}" data-en="${s.botoes?.secundarioEn || 'Book Now'}">${t(s.botoes?.secundario || 'Reservar Agora', s.botoes?.secundarioEn || 'Book Now')}</button>
        </div>
      </div>
    </section>
  `;
}

function renderBanner(s) {
  return `
    <section style="padding:60px 20px;background:var(--bg)">
      <div style="max-width:1000px;margin:0 auto">
        <div style="position:relative;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.15)">
          <img src="${s.imagem}" alt="${s.titulo}" style="width:100%;height:420px;object-fit:cover">
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.1) 60%)"></div>
          <div style="position:absolute;top:20px;left:20px">
            <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
          </div>
          <div style="position:absolute;bottom:30px;left:30px;right:30px;display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:12px">
            <div>
              <h2 class="font-playfair" style="color:#fff;font-size:clamp(1.4rem,3vw,2rem);font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,0.5)" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
              <p style="color:#7dd3fc;font-size:0.85rem;margin-top:4px" data-pt="${s.subtitulo}" data-en="${s.subtituloEn || s.subtitulo}">${t(s.subtitulo, s.subtituloEn)}</p>
            </div>
            <button class="btn-outline" style="padding:10px 24px;font-size:0.9rem" onclick="openModal('${s.modalId || 'modal-barco'}')" data-pt="${s.textoBotao || 'Saber Mais'}" data-en="${s.textoBotaoEn || 'Learn More'}">${t(s.textoBotao || 'Saber Mais', s.textoBotaoEn || 'Learn More')}</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTours(s) {
  const tours = s.excursoes?.filter(e => e.ativo !== false) || [];
  
  const toursHTML = tours.map(tour => `
    <div class="card exc-card">
      <img src="${tour.imagem}" alt="${tour.nome}" class="tour-card-img">
      <div class="exc-card-body">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <div class="exc-badge" style="background:${tour.corBadge === 'verde' ? 'linear-gradient(135deg,#2d7a3a,#1e5e28)' : 'linear-gradient(135deg,#f97316,#ea580c)'}">
            <div style="font-size:1.1rem;font-weight:700;line-height:1">${tour.data?.dia || ''}</div>
            <div style="font-size:0.65rem;font-weight:600">${tour.data?.mes || ''}</div>
          </div>
          <div style="text-align:left">
            <h3 style="font-weight:700;font-size:1rem" data-pt="${tour.nome}" data-en="${tour.nomeEn || tour.nome}">${t(tour.nome, tour.nomeEn)}</h3>
            <p style="color:var(--muted);font-size:0.78rem">🕐 <span data-pt="${tour.duracao}" data-en="${tour.duracaoEn || tour.duracao}">${t(tour.duracao, tour.duracaoEn)}</span></p>
          </div>
        </div>
        <p style="color:var(--muted);font-size:0.82rem" data-pt="${tour.descricao}" data-en="${tour.descricaoEn || tour.descricao}">${t(tour.descricao, tour.descricaoEn)}</p>
        <div class="exc-card-btn">
          <span style="font-weight:700;color:#2d7a3a;font-size:1rem">${tour.preco}€ <span data-pt="p/pessoa" data-en="per person">/${ts('pessoa')}</span></span>
          <button class="btn-primary" style="padding:8px 18px;font-size:0.82rem" onclick="openReservaModal('${tour.nome}')" data-pt="Reservar" data-en="Book">${ts('Reservar')}</button>
        </div>
      </div>
    </div>
  `).join('');
  
  return `
    <section id="${s.id || 'excursoes'}" style="padding:60px 20px;background:var(--card)">
      <div style="max-width:1200px;margin:0 auto;text-align:center">
        <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
        <h2 class="font-playfair" style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:700;margin-bottom:8px" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <p style="color:var(--muted);margin-bottom:12px;max-width:600px;margin-left:auto;margin-right:auto" data-pt="${s.descricao}" data-en="${s.descricaoEn || s.descricao}">${t(s.descricao, s.descricaoEn)}</p>
        <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:40px">
          <h3 class="font-playfair" style="font-size:1.4rem;font-weight:700" data-pt="${s.subtitulo}" data-en="${s.subtituloEn || s.subtitulo}">${t(s.subtitulo, s.subtituloEn)}</h3>
          <span class="section-tag red" style="font-size:0.7rem;padding:4px 12px">${s.ano || '2026'}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;align-items:stretch">
          ${toursHTML}
        </div>
      </div>
    </section>
  `;
}

function renderBlog(s) {
  const artigos = s.artigos?.filter(a => a.ativo !== false) || [];
  
  const artigosHTML = artigos.map(a => `
    <div class="card" style="text-align:left">
      <img src="${a.imagem}" alt="${a.titulo}" class="blog-img">
      <div style="padding:20px">
        <span style="background:linear-gradient(135deg,#2d7a3a,#1e5e28);color:#fff;padding:3px 10px;border-radius:999px;font-size:0.7rem;font-weight:600" data-pt="${a.categoria}" data-en="${a.categoriaEn || a.categoria}">${t(a.categoria, a.categoriaEn)}</span>
        <h3 style="font-weight:700;margin:10px 0 8px;font-size:1rem" data-pt="${a.titulo}" data-en="${a.tituloEn || a.titulo}">${t(a.titulo, a.tituloEn)}</h3>
        <p style="color:var(--muted);font-size:0.82rem;margin-bottom:16px" data-pt="${a.resumo}" data-en="${a.resumoEn || a.resumo}">${t(a.resumo, a.resumoEn)}</p>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="color:var(--muted);font-size:0.75rem">${formatDate(a.data)}</span>
          <button class="btn-primary" style="padding:6px 16px;font-size:0.78rem" onclick="openModal('modal-${a.id}')" data-pt="Ler Mais" data-en="Read More">${ts('Ler Mais')}</button>
        </div>
      </div>
    </div>
  `).join('');
  
  return `
    <section id="${s.id || 'blog'}" style="padding:80px 20px;background:var(--bg)">
      <div style="max-width:1200px;margin:0 auto;text-align:center">
        <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
        <h2 class="font-playfair" style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:700;margin-bottom:12px" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <p style="color:var(--muted);margin-bottom:48px;max-width:600px;margin-left:auto;margin-right:auto" data-pt="${s.descricao}" data-en="${s.descricaoEn || s.descricao}">${t(s.descricao, s.descricaoEn)}</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px">
          ${artigosHTML}
        </div>
      </div>
    </section>
  `;
}

function renderCards(s) {
  const itens = s.itens?.filter(i => i.ativo !== false) || [];
  const bgClass = s.corFundo === 'cinza' ? 'var(--bg)' : 'var(--card)';
  const tagColorClass = s.tagCor === 'verde' ? 'green' : (s.tagCor === 'vermelho' ? 'red' : '');
  
  const itensHTML = itens.map(i => `
    <div class="sust-card">
      <img src="${i.imagem}" alt="${i.titulo}" style="width:100%;height:200px;object-fit:cover">
      <div style="padding:20px;text-align:left">
        <span class="section-tag ${tagColorClass}" style="font-size:0.7rem;padding:3px 10px" data-pt="${i.categoria}" data-en="${i.categoriaEn || i.categoria}">${t(i.categoria, i.categoriaEn)}</span>
        <h3 style="font-weight:700;margin:10px 0 8px;font-size:1rem" data-pt="${i.titulo}" data-en="${i.tituloEn || i.titulo}">${t(i.titulo, i.tituloEn)}</h3>
        <p style="color:var(--muted);font-size:0.82rem;margin-bottom:16px" data-pt="${i.resumo}" data-en="${i.resumoEn || i.resumo}">${t(i.resumo, i.resumoEn)}</p>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="color:var(--muted);font-size:0.75rem">${formatDate(i.data)}</span>
          <button class="btn-primary" style="padding:6px 16px;font-size:0.78rem" onclick="openModal('modal-${i.id}')" data-pt="Ler Mais" data-en="Read More">${ts('Ler Mais')}</button>
        </div>
      </div>
    </div>
  `).join('');
  
  return `
    <section id="${s.id || 'cards'}" style="padding:80px 20px;background:${bgClass}">
      <div style="max-width:1200px;margin:0 auto;text-align:center">
        <span class="section-tag ${tagColorClass}" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
        <h2 class="font-playfair" style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:700;margin-bottom:12px" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <p style="color:var(--muted);margin-bottom:48px;max-width:600px;margin-left:auto;margin-right:auto" data-pt="${s.descricao}" data-en="${s.descricaoEn || s.descricao}">${t(s.descricao, s.descricaoEn)}</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px">
          ${itensHTML}
        </div>
      </div>
    </section>
  `;
}

function renderTextoImagem(s) {
  const bgClass = s.corFundo === 'cinza' ? 'var(--bg)' : 'var(--card)';
  const imgFirst = s.posicaoImagem === 'esquerda';
  
  return `
    <section id="${s.id || 'sobre'}" style="padding:80px 20px;background:${bgClass}">
      <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center">
        ${imgFirst ? `
          <img src="${s.imagem}" alt="${s.titulo}" style="width:100%;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,0.15)">
          <div>
        ` : `<div>`}
          <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
          <h2 class="font-playfair" style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:700;margin-bottom:20px" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
          <div class="translatable-markdown" data-pt="${s.texto1}" data-en="${s.texto1En || s.texto1}" style="color:var(--muted);line-height:1.8;margin-bottom:16px">${renderMarkdown(t(s.texto1, s.texto1En))}</div>
          <p class="font-playfair" style="color:#f97316;font-style:italic;font-size:1.1rem;border-left:4px solid #f97316;padding-left:16px;margin-bottom:16px" data-pt="${s.citacao}" data-en="${s.citacaoEn || s.citacao}">${t(s.citacao, s.citacaoEn)}</p>
          <div class="translatable-markdown" data-pt="${s.texto2}" data-en="${s.texto2En || s.texto2}" style="color:var(--muted);line-height:1.8;margin-bottom:28px">${renderMarkdown(t(s.texto2, s.texto2En))}</div>
          ${s.textoBotao ? `<button class="btn-primary" onclick="scrollToSection('${s.ancoraBotao?.replace('#','') || 'contactos'}')" data-pt="${s.textoBotao}" data-en="${s.textoBotaoEn || s.textoBotao}">${t(s.textoBotao, s.textoBotaoEn)}</button>` : ''}
        </div>
        ${imgFirst ? '' : `<img src="${s.imagem}" alt="${s.titulo}" style="width:100%;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,0.15)">`}
      </div>
    </section>
  `;
}

function renderFeatures(s) {
  const itens = s.itens || [];
  const bgClass = s.corFundo === 'cinza' ? 'var(--bg)' : 'var(--card)';
  
  const itensHTML = itens.map(i => `
    <div class="pq-card">
      <div style="font-size:2.5rem;margin-bottom:16px">${i.icone}</div>
      <h3 style="font-weight:700;margin-bottom:8px" data-pt="${i.titulo}" data-en="${i.tituloEn || i.titulo}">${t(i.titulo, i.tituloEn)}</h3>
      <p style="color:var(--muted);font-size:0.88rem" data-pt="${i.descricao}" data-en="${i.descricaoEn || i.descricao}">${t(i.descricao, i.descricaoEn)}</p>
    </div>
  `).join('');
  
  return `
    <section id="${s.id || 'features'}" style="padding:80px 20px;background:${bgClass}">
      <div style="max-width:1200px;margin:0 auto;text-align:center">
        <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
        <h2 class="font-playfair" style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:700;margin-bottom:48px" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px">
          ${itensHTML}
        </div>
      </div>
    </section>
  `;
}

function renderCTA(s) {
  const colors = {
    'verde': 'linear-gradient(135deg,#2d7a3a,#1e5e28)',
    'laranja': 'linear-gradient(135deg,#f97316,#ea580c)',
    'azul': 'linear-gradient(135deg,#1e40af,#1e3a8a)'
  };
  
  return `
    <section style="padding:60px 20px;background:${colors[s.corFundo] || colors.verde}">
      <div style="max-width:600px;margin:0 auto;text-align:center;color:#fff">
        <h2 class="font-playfair" style="font-size:2rem;font-weight:700;margin-bottom:12px" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <p style="opacity:0.9;margin-bottom:28px" data-pt="${s.descricao}" data-en="${s.descricaoEn || s.descricao}">${t(s.descricao, s.descricaoEn)}</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
          <input type="email" id="newsletter-email" placeholder="${t(s.placeholder || 'O seu email...', s.placeholderEn || 'Your email...')}" style="flex:1;min-width:200px;padding:12px 20px;border-radius:999px;border:none;font-size:0.9rem;outline:none">
          <button class="btn-primary" style="background:#f97316;white-space:nowrap" onclick="subscribeNewsletter()" data-pt="${s.textoBotao || 'Subscrever'}" data-en="${s.textoBotaoEn || 'Subscribe'}">${t(s.textoBotao || 'Subscrever', s.textoBotaoEn || 'Subscribe')}</button>
        </div>
        <p id="newsletter-msg" style="margin-top:16px;opacity:0;transition:opacity .3s;font-weight:600"></p>
      </div>
    </section>
  `;
}

function renderFormulario(s) {
  const bgClass = s.corFundo === 'cinza' ? 'var(--bg)' : 'var(--card)';
  
  return `
    <section id="${s.id || 'contactos'}" style="padding:80px 20px;background:${bgClass}">
      <div style="max-width:1100px;margin:0 auto">
        <div style="text-align:center;margin-bottom:48px">
          <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
          <h2 class="font-playfair" style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:700;margin-bottom:12px" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
          <p style="color:var(--muted)" data-pt="${s.descricao}" data-en="${s.descricaoEn || s.descricao}">${t(s.descricao, s.descricaoEn)}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start">
          <div class="card" style="padding:32px">
            <div style="margin-bottom:20px">
              <label style="font-weight:600;font-size:0.88rem;display:block;margin-bottom:6px" data-pt="Nome Completo" data-en="Full Name">${ts('Nome Completo')}</label>
              <input type="text" id="contact-name" style="width:100%;padding:10px 16px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:0.9rem;outline:none;box-sizing:border-box" placeholder="${ts('O seu nome...')}">
            </div>
            <div style="margin-bottom:20px">
              <label style="font-weight:600;font-size:0.88rem;display:block;margin-bottom:6px">Email</label>
              <input type="email" id="contact-email" style="width:100%;padding:10px 16px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:0.9rem;outline:none;box-sizing:border-box" placeholder="email@exemplo.com">
            </div>
            <div style="margin-bottom:20px">
              <label style="font-weight:600;font-size:0.88rem;display:block;margin-bottom:6px" data-pt="Mensagem" data-en="Message">${ts('Mensagem')}</label>
              <textarea id="contact-msg" rows="4" style="width:100%;padding:10px 16px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:0.9rem;outline:none;resize:vertical;box-sizing:border-box" placeholder="${ts('A sua mensagem...')}"></textarea>
            </div>
            <button class="btn-primary" style="width:100%" onclick="sendMessage()" id="btn-send-msg" data-pt="Enviar Mensagem" data-en="Send Message">${ts('Enviar Mensagem')}</button>
            <p id="contact-success" style="margin-top:16px;color:#2d7a3a;font-weight:600;display:none;text-align:center"></p>
          </div>
          <div>
            <div class="card" style="padding:24px;margin-bottom:20px">
              <div style="display:flex;flex-direction:column;gap:16px">
                <div style="display:flex;align-items:center;gap:12px">
                  <div style="width:44px;height:44px;background:linear-gradient(135deg,#2d7a3a,#1e5e28);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.1rem;flex-shrink:0">📞</div>
                  <div>
                    <p style="font-weight:600;font-size:0.88rem" data-pt="Telefone" data-en="Phone">${ts('Telefone')}</p>
                    <a href="tel:${s.infoContacto?.telefone}" style="color:#2d7a3a;font-weight:600">${s.infoContacto?.telefone}</a>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                  <div style="width:44px;height:44px;background:linear-gradient(135deg,#2d7a3a,#1e5e28);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.1rem;flex-shrink:0">✉️</div>
                  <div>
                    <p style="font-weight:600;font-size:0.88rem">Email</p>
                    <a href="mailto:${s.infoContacto?.email}" style="color:#2d7a3a;font-weight:600">${s.infoContacto?.email}</a>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                  <div style="width:44px;height:44px;background:linear-gradient(135deg,#2d7a3a,#1e5e28);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.1rem;flex-shrink:0">📍</div>
                  <div>
                    <p style="font-weight:600;font-size:0.88rem" data-pt="Morada" data-en="Address">${ts('Morada')}</p>
                    <p style="color:var(--muted);font-size:0.88rem">${s.infoContacto?.morada}</p>
                  </div>
                </div>
              </div>
            </div>
            ${s.mostrarMapa && s.mapaEmbed ? `
            <div style="border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
              <iframe src="${s.mapaEmbed}" width="100%" height="280" style="border:0;display:block" allowfullscreen loading="lazy"></iframe>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSpacer(s) {
  const bgColors = {'transparente': 'transparent', 'cinza': 'var(--bg)', 'branco': 'var(--card)'};
  return `<div style="height:${s.altura || 60}px;background:${bgColors[s.corFundo] || 'transparent'}"></div>`;
}

function renderHTML(s) {
  return `<section>${s.css ? `<style>${s.css}</style>` : ''}${s.html || ''}</section>`;
}

// ============================================
// MENU
// ============================================
function renderMenu() {
  const itens = SITE.menu?.itens?.filter(i => i.ativo !== false) || [];
  
  const menuHTML = itens.map(i => `
    <a href="${i.ancora}" class="nav-pill" id="pill-${i.ancora?.replace('#','')}">
      <span data-pt="${i.texto}" data-en="${i.textoEn || i.texto}">${t(i.texto, i.textoEn)}</span>
    </a>
  `).join('');
  
  const menuContainer = document.querySelector('nav #menu-container');
  if (menuContainer) {
    menuContainer.innerHTML = menuHTML + `
      <div style="display:flex;align-items:center;gap:4px;margin-left:8px;border-left:1px solid var(--border);padding-left:8px">
        <button class="lang-btn ${SITE.lang === 'pt' ? 'active' : ''}" id="btn-pt" onclick="setLang('pt')">🇵🇹 PT</button>
        <button class="lang-btn ${SITE.lang === 'en' ? 'active' : ''}" id="btn-en" onclick="setLang('en')">🇬🇧 EN</button>
        <button class="theme-pill" id="theme-toggle" onclick="toggleTheme()">${SITE.theme === 'dark' ? '☀️' : '🌙'}</button>
      </div>
    `;
  }
  
  const logo = document.querySelector('nav img');
  if (logo && SITE.menu?.logo) {
    logo.src = SITE.menu.logo;
  }
}

// ============================================
// FOOTER
// ============================================
function renderFooter() {
  const f = SITE.footer;
  if (!f) return;
  
  const linksHTML = f.linksRapidos?.map(l => `
    <a href="${l.ancora}" style="color:#94a3b8;text-decoration:none;font-size:0.88rem;transition:color .2s" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#94a3b8'" data-pt="${l.texto}" data-en="${l.textoEn || l.texto}">${t(l.texto, l.textoEn)}</a>
  `).join('') || '';
  
  // Só mostrar redes sociais se houver alguma configurada E ativa
  const redesAtivas = f.redesSociais?.filter(r => r.ativo !== false) || [];
  const redesHTML = redesAtivas.length > 0 ? redesAtivas.map(r => `
    <a href="${r.url}" target="_blank" rel="noopener" style="width:40px;height:40px;background:#1e293b;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#94a3b8;text-decoration:none;transition:all .2s;font-size:1.1rem" onmouseover="this.style.background='#f97316';this.style.color='#fff'" onmouseout="this.style.background='#1e293b';this.style.color='#94a3b8'" title="${r.nome}">${r.icone}</a>
  `).join('') : '';
  
  // WhatsApp message no idioma correto
  const whatsappMsg = t(f.whatsappMensagem, f.whatsappMensagemEn);
  
  const footerHTML = `
    <footer style="background:#0f172a;color:#94a3b8;padding:48px 20px 24px">
      <div style="max-width:1200px;margin:0 auto">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;margin-bottom:40px">
          <div>
            <img src="${f.logo}" alt="Cipritravel Tours" style="height:150px;object-fit:contain;filter:brightness(0) invert(1);margin-bottom:12px">
            <p style="font-size:0.85rem;line-height:1.7" data-pt="${f.descricao}" data-en="${f.descricaoEn || f.descricao}">${t(f.descricao, f.descricaoEn)}</p>
          </div>
          <div>
            <h4 style="color:#fff;font-weight:700;margin-bottom:16px" data-pt="Links Rápidos" data-en="Quick Links">${ts('Links Rápidos')}</h4>
            <div style="display:flex;flex-direction:column;gap:8px">${linksHTML}</div>
          </div>
          <div>
            <h4 style="color:#fff;font-weight:700;margin-bottom:16px" data-pt="Contactos" data-en="Contacts">${ts('Contactos')}</h4>
            <div style="display:flex;flex-direction:column;gap:8px;font-size:0.88rem">
              <p>📞 ${f.contactos?.telefone}</p>
              <p>✉️ ${f.contactos?.email}</p>
              <p>📍 ${f.contactos?.morada}</p>
            </div>
          </div>
          ${redesHTML ? `
          <div>
            <h4 style="color:#fff;font-weight:700;margin-bottom:16px" data-pt="Redes Sociais" data-en="Social Media">${ts('Redes Sociais')}</h4>
            <div style="display:flex;gap:12px">${redesHTML}</div>
          </div>
          ` : ''}
        </div>
        <div style="border-top:1px solid #1e293b;padding-top:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <p style="font-size:0.82rem" data-pt="${f.copyright}" data-en="${f.copyrightEn || f.copyright}">${t(f.copyright, f.copyrightEn)}</p>
          <button onclick="openModal('modal-privacidade')" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:0.82rem;text-decoration:underline" data-pt="Política de Privacidade" data-en="Privacy Policy">${ts('Política de Privacidade')}</button>
        </div>
      </div>
    </footer>
    
    <!-- WhatsApp -->
    <a href="https://wa.me/${f.whatsapp}?text=${encodeURIComponent(whatsappMsg)}" target="_blank" class="whatsapp-btn" title="${ts('Fale connosco no WhatsApp')}">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
    
    <!-- Back to Top -->
    <div class="back-top" id="back-top" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</div>
  `;
  
  const footerEl = document.querySelector('footer');
  if (footerEl) {
    footerEl.outerHTML = footerHTML;
  }
}

// ============================================
// MODAIS
// ============================================
function renderModals() {
  const modais = SITE.modais?.lista?.filter(m => m.ativo !== false) || [];
  
  const modaisHTML = modais.map(m => {
    if (m.tipo === 'formulario') {
      return renderModalFormulario(m);
    }
    return renderModalGenerico(m);
  }).join('');
  
  const modaisContainer = document.getElementById('modais-container');
  if (modaisContainer) {
    modaisContainer.innerHTML = modaisHTML;
  }
}

function renderModalGenerico(m) {
  const incluidos = m.incluidos || [];
  const incluidosEn = m.incluidosEn || incluidos;
  const incluidosHTML = incluidos.map((item, idx) => `
    <div style="display:flex;align-items:center;gap:8px;color:var(--muted);font-size:0.88rem">
      <span style="color:#2d7a3a;font-weight:700">✓</span>
      <span data-pt="${item}" data-en="${incluidosEn[idx] || item}">${t(item, incluidosEn[idx] || item)}</span>
    </div>
  `).join('');
  
  const titulo = t(m.titulo, m.tituloEn);
  const subtitulo = m.subtitulo ? t(m.subtitulo, m.subtituloEn) : '';
  const conteudo = t(m.conteudo, m.conteudoEn);
  const textoBotao = m.textoBotao ? t(m.textoBotao, m.textoBotaoEn) : '';
  
  return `
    <div class="modal-overlay" id="${m.id}" onclick="closeModalOutside(event,'${m.id}')">
      <div class="modal-box ${m.imagem ? 'wide' : ''}" style="${!m.imagem ? 'padding:32px' : ''}">
        ${m.imagem ? `<img src="${m.imagem}" alt="${titulo}" style="width:100%;height:220px;object-fit:cover;border-radius:20px 20px 0 0">` : ''}
        <div style="${m.imagem ? 'padding:28px' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:${m.subtitulo ? 'start' : 'center'};margin-bottom:16px">
            <div>
              <h3 class="font-playfair" style="font-size:1.5rem;font-weight:700" data-pt="${m.titulo}" data-en="${m.tituloEn || m.titulo}">${titulo}</h3>
              ${m.subtitulo ? `<p style="color:#2d7a3a;font-weight:600;font-size:0.9rem" data-pt="${m.subtitulo}" data-en="${m.subtituloEn || m.subtitulo}">${subtitulo}</p>` : ''}
            </div>
            <button onclick="closeModal('${m.id}')" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--muted)">✕</button>
          </div>
          <div style="color:var(--muted);font-size:0.88rem;line-height:1.8" data-pt="${m.conteudo}" data-en="${m.conteudoEn || m.conteudo}">${renderMarkdown(conteudo)}</div>
          ${incluidosHTML ? `
            <h4 style="font-weight:700;margin:16px 0 12px" data-pt="Incluído no pacote:" data-en="Included in the package:">${ts('Incluído no pacote:')}</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:24px">${incluidosHTML}</div>
          ` : ''}
             ${m.textoBotao ? `<button class="btn-primary" style="margin-top:20px" onclick="closeModal('${m.id}');openReservaModal('${m.reservaTour || m.titulo}')" data-pt="${m.textoBotao}" data-en="${m.textoBotaoEn || m.textoBotao}">${textoBotao}</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderModalFormulario(m) {
  // Obter lista de excursões para o select
  let tourOptions = '';
  if (m.id === 'modal-reserva' && SITE.data) {
    const toursSection = SITE.data.secoes?.find(s => s.type === 'tours');
    if (toursSection?.excursoes) {
      tourOptions = toursSection.excursoes
        .filter(e => e.ativo !== false)
        .map(e => {
          const nome = t(e.nome, e.nomeEn);
          return `<option value="${e.id}">${nome} — ${e.preco}€/${ts('pessoa')}</option>`;
        })
        .join('');
    }
  }
  
  const titulo = t(m.titulo, m.tituloEn);
  const textoBotao = t(m.textoBotao, m.textoBotaoEn);
  
  const camposHTML = m.campos?.map(c => {
    const label = t(c.label, c.labelEn);
    const placeholder = c.placeholder ? t(c.placeholder, c.placeholderEn) : '';
    
    return `
    <div style="margin-bottom:16px">
      <label style="font-weight:600;font-size:0.88rem;display:block;margin-bottom:6px" data-pt="${c.label}" data-en="${c.labelEn || c.label}">${label}</label>
      ${c.tipo === 'select' ? `
        <select id="${c.id}" style="width:100%;padding:10px 16px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:0.9rem;outline:none;box-sizing:border-box">
          <option value="">${ts('Seleciona...')}</option>
          ${tourOptions}
        </select>
      ` : c.tipo === 'textarea' ? `
        <textarea id="${c.id}" rows="3" style="width:100%;padding:10px 16px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:0.9rem;outline:none;resize:vertical;box-sizing:border-box" placeholder="${placeholder}"></textarea>
      ` : `
        <input type="${c.tipo}" id="${c.id}" style="width:100%;padding:10px 16px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:0.9rem;outline:none;box-sizing:border-box" placeholder="${placeholder}">
      `}
    </div>
  `}).join('') || '';
  
  return `
    <div class="modal-overlay" id="${m.id}" onclick="closeModalOutside(event,'${m.id}')">
      <div class="modal-box" style="padding:32px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <h3 class="font-playfair" style="font-size:1.5rem;font-weight:700" data-pt="${m.titulo}" data-en="${m.tituloEn || m.titulo}">${titulo}</h3>
          <button onclick="closeModal('${m.id}')" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--muted)">✕</button>
        </div>
        ${camposHTML}
        <button class="btn-primary" style="width:100%" id="btn-submit-${m.id}" onclick="submitForm('${m.id}')" data-pt="${m.textoBotao}" data-en="${m.textoBotaoEn || m.textoBotao}">${textoBotao}</button>
        <p id="form-success-${m.id}" style="margin-top:16px;color:#2d7a3a;font-weight:600;display:none;text-align:center"></p>
      </div>
    </div>
  `;
}

// ============================================
// UTILIDADES
// ============================================
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const monthsPT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthsEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = SITE.lang === 'en' ? monthsEN : monthsPT;
  const year = date.getFullYear();
  return SITE.lang === 'en' ? `${months[date.getMonth()]} ${day}, ${year}` : `${day} ${months[date.getMonth()]} ${year}`;
}

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/### (.*)/g, '<h4 style="color:var(--text);font-weight:700;margin:16px 0 8px">$1</h4>')
    .replace(/## (.*)/g, '<h3 style="color:var(--text);font-weight:700;margin:16px 0 8px;font-size:1.1rem">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p style="margin-bottom:12px">')
    .replace(/\n/g, '<br>');
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// IDIOMA E TEMA
// ============================================
function setLang(lang) {
  SITE.lang = lang;
  localStorage.setItem('lang', lang);
  
  // Atualizar todos os elementos com data-pt e data-en
  document.querySelectorAll('[data-pt]').forEach(el => {
    const pt = el.dataset.pt;
    const en = el.dataset.en || pt;
    el.textContent = lang === 'en' ? en : pt;
  });
  
  // Atualizar elementos markdown traduzíveis
  document.querySelectorAll('.translatable-markdown').forEach(el => {
    const pt = el.dataset.pt;
    const en = el.dataset.en || pt;
    el.innerHTML = renderMarkdown(lang === 'en' ? en : pt);
  });
  
  // Re-renderizar modais para atualizar o conteúdo
  renderModals();
  
  // Atualizar botões de idioma
  document.getElementById('btn-pt')?.classList.toggle('active', lang === 'pt');
  document.getElementById('btn-en')?.classList.toggle('active', lang === 'en');
}

function toggleTheme() {
  SITE.theme = SITE.theme === 'dark' ? 'light' : 'dark';
  applyTheme(SITE.theme);
}

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}

// ============================================
// MODAIS
// ============================================
function openModal(id) {
  document.getElementById(id)?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}

function openReservaModal(tour) {
  openModal('modal-reserva');
  const sel = document.getElementById('reserva-tour');
  if (sel && tour) {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text.includes(tour) || sel.options[i].value === tour) {
        sel.selectedIndex = i;
        break;
      }
    }
  }
}

// Submit Formulário de Reserva
async function submitForm(modalId) {
  const nome = document.getElementById('reserva-nome')?.value || '';
  const email = document.getElementById('reserva-email')?.value || '';
  const tel = document.getElementById('reserva-tel')?.value || '';
  const tour = document.getElementById('reserva-tour')?.value || '';
  const tourText = document.getElementById('reserva-tour')?.options[document.getElementById('reserva-tour')?.selectedIndex]?.text || '';
  const pessoas = document.getElementById('reserva-pessoas')?.value || '1';
  const obs = document.getElementById('reserva-obs')?.value || '';
  
  if (!nome || !email) {
    alert(ts('Por favor preencha o nome e email.'));
    return;
  }
  
  const btn = document.getElementById(`btn-submit-${modalId}`);
  const successMsg = document.getElementById(`form-success-${modalId}`);
  
  if (btn) {
    btn.disabled = true;
    btn.textContent = SITE.lang === 'en' ? 'Sending...' : 'A enviar...';
  }
  
  try {
    // Simular envio (substituir por Web3Forms ou similar)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Dados do formulário:', { nome, email, tel, tour, tourText, pessoas, obs });
    
    if (successMsg) {
      successMsg.textContent = ts('Thank you! We\'ll contact you soon.');
      successMsg.style.display = 'block';
    }
    
    // Limpar formulário
    document.getElementById('reserva-nome').value = '';
    document.getElementById('reserva-email').value = '';
    document.getElementById('reserva-tel').value = '';
    document.getElementById('reserva-tour').selectedIndex = 0;
    document.getElementById('reserva-pessoas').value = '1';
    document.getElementById('reserva-obs').value = '';
    
    setTimeout(() => {
      closeModal(modalId);
      if (successMsg) successMsg.style.display = 'none';
    }, 3000);
    
  } catch (error) {
    console.error('Erro ao enviar:', error);
    alert(SITE.lang === 'en' ? 'Error sending request. Please try again.' : 'Erro ao enviar pedido. Por favor tente novamente.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = t('Enviar Pedido de Reserva', 'Send Booking Request');
    }
  }
}

// Enviar mensagem de contacto
async function sendMessage() {
  const nome = document.getElementById('contact-name')?.value || '';
  const email = document.getElementById('contact-email')?.value || '';
  const msg = document.getElementById('contact-msg')?.value || '';
  
  if (!nome || !email || !msg) {
    alert(SITE.lang === 'en' ? 'Please fill in all fields.' : 'Por favor preencha todos os campos.');
    return;
  }
  
  const btn = document.getElementById('btn-send-msg');
  const successMsg = document.getElementById('contact-success');
  
  if (btn) {
    btn.disabled = true;
    btn.textContent = SITE.lang === 'en' ? 'Sending...' : 'A enviar...';
  }
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Mensagem de contacto:', { nome, email, msg });
    
    if (successMsg) {
      successMsg.textContent = ts('Thank you! Message sent successfully.');
      successMsg.style.display = 'block';
    }
    
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-msg').value = '';
    
    setTimeout(() => {
      if (successMsg) successMsg.style.display = 'none';
    }, 5000);
    
  } catch (error) {
    console.error('Erro ao enviar:', error);
    alert(SITE.lang === 'en' ? 'Error sending message. Please try again.' : 'Erro ao enviar mensagem. Por favor tente novamente.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = ts('Enviar Mensagem');
    }
  }
}

// Newsletter
async function subscribeNewsletter() {
  const emailEl = document.getElementById('newsletter-email');
  const msgEl = document.getElementById('newsletter-msg');
  
  if (!emailEl || !emailEl.value) return;
  
  msgEl.style.opacity = '1';
  msgEl.textContent = SITE.lang === 'en' ? 'Subscribing...' : 'A subscrever...';
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Newsletter subscription:', emailEl.value);
    msgEl.textContent = SITE.lang === 'en' ? 'Thank you for subscribing!' : 'Obrigado por subscrever!';
    emailEl.value = '';
  } catch (error) {
    msgEl.textContent = SITE.lang === 'en' ? 'Error. Please try again.' : 'Erro. Por favor tente novamente.';
  }
}

// Back to top button visibility
window.addEventListener('scroll', () => {
  const backTop = document.getElementById('back-top');
  if (backTop) {
    backTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
  }
});

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  const loaded = await loadAllData();
  if (loaded) {
    renderPage();
  }
});
