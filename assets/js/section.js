/**
 * Cipritravel Tours - Motor de Renderização de Secções
 * Sistema modular para carregar e renderizar conteúdo dinamicamente
 */

// ============================================
// CONFIGURAÇÃO E ESTADO GLOBAL
// ============================================
// Detectar caminho base para GitHub Pages
const BASE_URL = window.location.pathname.includes('/Cipritravel-Tours') 
  ? '/Cipritravel-Tours' 
  : '';
const SITE = {
  data: null,
  menu: null,
  footer: null,
  modais: null,
  tours: null,
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
    'O seu email...': 'O seu email...',
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
    'Your email...': 'O seu email...',
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
    'O seu email...': 'Your email...',
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
    'Your email...': 'Your email...',
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
    console.log('A carregar dados...');

    // Cache-busting: cada load usa um timestamp único para contornar
    // qualquer cache HTTP (browser, CDN, service worker). Isto garante que
    // depois de o CMS publicar uma alteração no GitHub, o visitante vê a
    // versão mais recente no próximo load.
    const cacheBust = `?v=${Date.now()}`;

    const files = [
      { key: 'data',   url: `${BASE_URL}/data/homepage.json${cacheBust}` },
      { key: 'menu',   url: `${BASE_URL}/data/menu.json${cacheBust}` },
      { key: 'footer', url: `${BASE_URL}/data/footer.json${cacheBust}` },
      { key: 'modais', url: `${BASE_URL}/data/modais.json${cacheBust}` },
      { key: 'tours',  url: `${BASE_URL}/data/tours.json${cacheBust}` },
      { key: 'config', url: `${BASE_URL}/data/config.json${cacheBust}` }
    ];

    const results = await Promise.allSettled(
      files.map(f => fetch(f.url, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }))
    );
    
    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        SITE[files[idx].key] = result.value;
      } else {
        console.error(`Erro ao carregar ${files[idx].key}:`, result.reason);
      }
    });
    
    if (!SITE.data) {
      throw new Error('Ficheiro principal (homepage.json) não carregou');
    }
    
    console.log('Dados carregados com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = `
        <div style="padding:60px 20px;text-align:center">
          <h2 style="color:#dc2626;margin-bottom:16px">Erro ao carregar o site</h2>
          <p style="color:var(--muted)">Por favor atualize a página. Se o problema persistir, contacte o administrador.</p>
          <p style="color:var(--muted);font-size:0.85rem;margin-top:12px">Erro: ${error.message}</p>
          <button class="btn-primary" style="margin-top:20px" onclick="location.reload()">Atualizar Página</button>
        </div>
      `;
    }
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

  // SEO meta tags
  if (SITE.config?.seo) {
    const seo = SITE.config.seo;
    const title = SITE.lang === 'en' ? (seo.tituloEn || seo.tituloPt) : seo.tituloPt;
    const desc = SITE.lang === 'en' ? (seo.descricaoEn || seo.descricaoPt) : seo.descricaoPt;
    document.title = title || 'Cipritravel Tours';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc); }
    metaDesc.content = desc || '';
    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) { metaKw = document.createElement('meta'); metaKw.name = 'keywords'; document.head.appendChild(metaKw); }
    metaKw.content = SITE.config.seo?.keywords || '';
  }
}

// ============================================
// ROUTER DE SECÇÕES
// ============================================
function renderSection(section) {
  const renderers = {
    'hero': renderHero,
    'banner': renderBanner,
    'tours': renderTours,
    'parallax-showcase': renderParallaxShowcase,
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
// PARALLAX SHOWCASE — excursion em destaque
// ============================================
function renderParallaxShowcase(s) {
  // Procura a excursão marcada como destaque em tours.json
  const allTours = SITE.tours?.tours || [];
  const tour = allTours.find(t => t.destaque === true && t.ativo !== false)
            || allTours.find(t => t.id === 'rota-sol-praia')
            || allTours.find(t => t.ativo !== false);

  if (!tour) return '';

  const nome = t(tour.nome, tour.nomeEn);
  const descricao = t(tour.descricao, tour.descricaoEn);
  const duracao = t(tour.duracao, tour.duracaoEn);
  const dia = tour.data?.dia || '';
  const mes = tour.data?.mes || '';
  const tituloDestaque = SITE.lang === 'en' ? 'Coastal Escape' : 'Fuga à Costa';

  return `
    <section class="parallax-showcase" id="destaque">
      <img class="parallax-showcase__bg" src="${tour.imagem}" alt="${nome}" data-parallax>
      <div class="parallax-showcase__overlay"></div>
      <div class="parallax-showcase__inner">
        <div class="parallax-showcase__text reveal">
          <span class="section-tag" data-pt="Excursão em Destaque" data-en="Featured Tour">Excursão em Destaque</span>
          <h2 class="parallax-showcase__title">
            <span data-pt="${tour.nome}" data-en="${tour.nomeEn || tour.nome}">${nome}</span>
            <em>${tituloDestaque}</em>
          </h2>
          <p class="parallax-showcase__desc" data-pt="${tour.descricao}" data-en="${tour.descricaoEn || tour.descricao}">${descricao}</p>
          <div class="parallax-showcase__meta">
            <div class="parallax-showcase__meta-item">
              <span class="label">${SITE.lang === 'en' ? 'Date' : 'Data'}</span>
              <span class="value">${dia} ${mes}</span>
            </div>
            <div class="parallax-showcase__meta-item">
              <span class="label">${SITE.lang === 'en' ? 'Duration' : 'Duração'}</span>
              <span class="value">${duracao}</span>
            </div>
            <div class="parallax-showcase__meta-item price">
              <span class="label">${SITE.lang === 'en' ? 'From' : 'Desde'}</span>
              <span class="value">${tour.preco}€</span>
            </div>
          </div>
          <div class="parallax-showcase__actions">
            <button class="btn-primary" onclick="openModal('modal-${tour.id}')" data-pt="Ver Detalhes" data-en="View Details">${SITE.lang === 'en' ? 'View Details' : 'Ver Detalhes'}</button>
            <button class="btn-outline" onclick="openReservaModal('${tour.id}')" data-pt="Reservar Agora" data-en="Book Now">${ts('Reservar')}</button>
          </div>
        </div>
        <div class="parallax-showcase__card reveal">
          <img class="parallax-showcase__card-img" src="${tour.imagem}" alt="${nome}">
          <div class="parallax-showcase__card-date">${dia} ${mes} · ${tour.preco}€</div>
          <h3 class="parallax-showcase__card-title" data-pt="${tour.nome}" data-en="${tour.nomeEn || tour.nome}">${nome}</h3>
          <p class="parallax-showcase__card-desc" data-pt="${tour.descricao}" data-en="${tour.descricaoEn || tour.descricao}">${descricao}</p>
          <div class="parallax-showcase__card-cta">
            <span class="price">${tour.preco}€</span>
            <button class="btn-primary" style="padding:10px 22px;font-size:0.78rem" onclick="closeModalOutside(event);openReservaModal('${tour.id}')">${ts('Reservar')}</button>
          </div>
        </div>
      </div>
    </section>
  `;
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
        <span class="section-tag" style="margin-bottom:24px" data-pt="${s.bannerTexto || ''}" data-en="${s.bannerTextoEn || s.bannerTexto || ''}">${t(s.bannerTexto, s.bannerTextoEn)}</span>
        <h1>
          <span data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</span>
          <em data-pt="${s.tituloDestaque}" data-en="${s.tituloDestaqueEn || s.tituloDestaque}">${t(s.tituloDestaque, s.tituloDestaqueEn)}</em>
        </h1>
        <p data-pt="${s.subtitulo}" data-en="${s.subtituloEn || s.subtitulo}">${t(s.subtitulo, s.subtituloEn)}</p>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:28px">
          <button class="btn-primary" onclick="openModal('modal-hero')" data-pt="${s.botoes?.primario || 'Saber Mais'}" data-en="${s.botoes?.primarioEn || 'Learn More'}">${t(s.botoes?.primario || 'Saber Mais', s.botoes?.primarioEn || 'Learn More')}</button>
          <button class="btn-outline" onclick="openModal('modal-reserva')" data-pt="${s.botoes?.secundario || 'Reservar Agora'}" data-en="${s.botoes?.secundarioEn || 'Book Now'}">${t(s.botoes?.secundario || 'Reservar Agora', s.botoes?.secundarioEn || 'Book Now')}</button>
        </div>
      </div>
      <div class="hero-scroll-cue" data-pt="Explorar" data-en="Explore">${SITE.lang === 'en' ? 'Explore' : 'Explorar'}</div>
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
  // Tours agora vêm da fonte única: data/tours.json (SITE.tours)
  const toursSource = (SITE.tours && SITE.tours.tours) ? SITE.tours.tours : (s.excursoes || []);
  const tours = toursSource
    .filter(e => e.ativo !== false)
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  const toursHTML = tours.map(tour => {
    const nome = t(tour.nome, tour.nomeEn);
    const duracao = t(tour.duracao, tour.duracaoEn);
    const descricao = t(tour.descricao, tour.descricaoEn);
    const badgeBg = tour.corBadge === 'verde'
      ? 'linear-gradient(135deg,#008030,#006028)'
      : 'linear-gradient(135deg,#e07000,#c2410c)';

    return `
    <div class="card exc-card reveal-stagger">
      <div style="position:relative;overflow:hidden">
        <img src="${tour.imagem}" alt="${nome}" class="tour-card-img">
        <div class="exc-badge" style="position:absolute;top:16px;left:16px;background:${badgeBg};box-shadow:0 4px 12px rgba(0,0,0,0.25)">
          <div style="font-size:1rem;font-weight:700;line-height:1">${tour.data?.dia || ''}</div>
          <div style="font-size:0.6rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase">${tour.data?.mes || ''}</div>
        </div>
      </div>
      <div class="exc-card-body">
        <p style="font-size:0.7rem;color:var(--muted);letter-spacing:0.15em;text-transform:uppercase;margin:0 0 4px">🕐 ${duracao}</p>
        <h3 class="exc-card-title" data-pt="${tour.nome}" data-en="${tour.nomeEn || tour.nome}">${nome}</h3>
        <p class="exc-card-desc" data-pt="${tour.descricao}" data-en="${tour.descricaoEn || tour.descricao}">${descricao}</p>
        <div class="exc-card-btn">
          <span class="exc-card-price">${tour.preco}€<small>/${ts('pessoa')}</small></span>
          <button class="btn-primary" style="padding:10px 22px;font-size:0.78rem" onclick="openReservaModal('${tour.id}')" data-pt="Reservar" data-en="Book">${ts('Reservar')}</button>
        </div>
      </div>
    </div>
    `;
  }).join('');

  return `
    <section id="${s.id || 'excursoes'}" style="background:var(--bg)">
      <div style="text-align:center">
        <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
        <h2 class="section-title" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <p class="section-subtitle" data-pt="${s.descricao}" data-en="${s.descricaoEn || s.descricao}">${t(s.descricao, s.descricaoEn)}</p>
        <div style="display:inline-flex;align-items:center;gap:12px;margin-bottom:60px">
          <span style="font-family:var(--serif);font-size:1.1rem;font-style:italic;color:var(--text-soft)" data-pt="${s.subtitulo}" data-en="${s.subtituloEn || s.subtitulo}">${t(s.subtitulo, s.subtituloEn)}</span>
          <span style="font-size:0.7rem;color:var(--accent-2);letter-spacing:0.2em;font-weight:700">${s.ano || '2026'}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:28px;align-items:stretch">
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
      <div class="grid-2col" style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center">
        ${imgFirst ? `
          <img src="${s.imagem}" alt="${s.titulo}" style="width:100%;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,0.15)">
          <div>
        ` : `<div>`}
          <span class="section-tag" data-pt="${escapeHtml(s.tag)}" data-en="${escapeHtml(s.tagEn || s.tag)}">${t(s.tag, s.tagEn)}</span>
          <h2 class="font-playfair" style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:700;margin-bottom:20px" data-pt="${escapeHtml(s.titulo)}" data-en="${escapeHtml(s.tituloEn || s.titulo)}">${t(s.titulo, s.tituloEn)}</h2>
          <div class="translatable-markdown" data-pt="${escapeHtml(s.texto1)}" data-en="${escapeHtml(s.texto1En || s.texto1)}" style="color:var(--muted);line-height:1.8;margin-bottom:16px">${renderMarkdown(t(s.texto1, s.texto1En))}</div>
          <p class="font-playfair" style="color:#f97316;font-style:italic;font-size:1.1rem;border-left:4px solid #f97316;padding-left:16px;margin-bottom:16px" data-pt="${escapeHtml(s.citacao)}" data-en="${escapeHtml(s.citacaoEn || s.citacao)}">${t(s.citacao, s.citacaoEn)}</p>
          <div class="translatable-markdown" data-pt="${escapeHtml(s.texto2)}" data-en="${escapeHtml(s.texto2En || s.texto2)}" style="color:var(--muted);line-height:1.8;margin-bottom:28px">${renderMarkdown(t(s.texto2, s.texto2En))}</div>
          ${s.textoBotao ? `<button class="btn-primary" onclick="scrollToSection('${s.ancoraBotao?.replace('#','') || 'contactos'}')" data-pt="${escapeHtml(s.textoBotao)}" data-en="${escapeHtml(s.textoBotaoEn || s.textoBotao)}">${t(s.textoBotao, s.textoBotaoEn)}</button>` : ''}
        </div>
        ${imgFirst ? '' : `<img src="${s.imagem}" alt="${s.titulo}" style="width:100%;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,0.15)">`}
      </div>
    </section>
  `;
}

function renderFeatures(s) {
  const itens = s.itens || [];
  const bgClass = s.corFundo === 'cinza' ? 'var(--bg)' : 'var(--card)';

  // Se houver imagens nos itens, usa cards com foto (estilo magazine)
  // Senão, fallback para cards com gradiente + letra
  const itensHTML = itens.map(i => {
    const titulo = t(i.titulo, i.tituloEn);
    const descricao = t(i.descricao, i.descricaoEn);
    const initial = (titulo || '?').charAt(0).toUpperCase();

    if (i.imagem) {
      return `
        <div class="why-card reveal-stagger">
          <img class="why-card__img" src="${i.imagem}" alt="${titulo}">
          <div class="why-card__body">
            <h3 class="why-card__title" data-pt="${i.titulo}" data-en="${i.tituloEn || i.titulo}">${titulo}</h3>
            <p class="why-card__desc" data-pt="${i.descricao}" data-en="${i.descricaoEn || i.descricao}">${descricao}</p>
          </div>
        </div>
      `;
    }

    // Fallback: card com gradiente + letra grande (sem ícone emoji)
    return `
      <div class="why-card reveal-stagger">
        <div style="height:200px;background:linear-gradient(135deg,var(--accent),var(--accent-2));display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--serif);font-size:5rem;font-weight:700;font-style:italic">${initial}</div>
        <div class="why-card__body">
          <h3 class="why-card__title" data-pt="${i.titulo}" data-en="${i.tituloEn || i.titulo}">${titulo}</h3>
          <p class="why-card__desc" data-pt="${i.descricao}" data-en="${i.descricaoEn || i.descricao}">${descricao}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section id="${s.id || 'features'}" style="background:${bgClass}">
      <div style="text-align:center">
        <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
        <h2 class="section-title" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <p class="section-subtitle" data-pt="${s.descricao || ''}" data-en="${s.descricaoEn || s.descricao || ''}">${t(s.descricao || '', s.descricaoEn || s.descricao || '')}</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:28px;margin-top:60px">
          ${itensHTML}
        </div>
      </div>
    </section>
  `;
}

function renderCTA(s) {
  const colors = {
    'verde':   'linear-gradient(135deg, #008030 0%, #006028 100%)',
    'laranja': 'linear-gradient(135deg, #e07000 0%, #c2410c 100%)',
    'azul':    'linear-gradient(135deg, #008030 0%, #e07000 100%)'
  };

  const emailPlaceholder = ts('O seu email...');

  return `
    <section style="padding:80px 24px;background:${colors[s.corFundo] || colors.verde};position:relative;overflow:hidden">
      <div style="max-width:700px;margin:0 auto;text-align:center;color:#fff;position:relative;z-index:1">
        <h2 class="font-playfair" style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:400;letter-spacing:-0.02em;margin-bottom:16px" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <p style="opacity:0.92;margin-bottom:32px;font-size:1.05rem;font-weight:300;max-width:480px;margin-left:auto;margin-right:auto" data-pt="${s.descricao}" data-en="${s.descricaoEn || s.descricao}">${t(s.descricao, s.descricaoEn)}</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;max-width:500px;margin:0 auto">
          <input type="email" id="newsletter-email" class="translatable-input" data-placeholder-pt="O seu email..." data-placeholder-en="Your email..." placeholder="${emailPlaceholder}" style="flex:1;min-width:200px;padding:14px 22px;border-radius:999px;border:none;font-size:0.92rem;outline:none;background:rgba(255,255,255,0.95);color:#1a1a1a">
          <button class="btn-outline" style="background:rgba(255,255,255,0.95);color:#008030;border-color:#fff;font-weight:700" onclick="subscribeNewsletter()" data-pt="${s.textoBotao || 'Subscrever'}" data-en="${s.textoBotaoEn || 'Subscribe'}">${t(s.textoBotao || 'Subscrever', s.textoBotaoEn || 'Subscribe')}</button>
        </div>
        <p id="newsletter-msg" style="margin-top:16px;opacity:0;transition:opacity .3s;font-weight:600;font-family:var(--serif)"></p>
      </div>
    </section>
  `;
}

function renderFormulario(s) {
  const namePlaceholder = SITE.lang === 'en' ? 'Your name...' : 'O seu nome...';
  const emailPlaceholder = SITE.lang === 'en' ? 'Your email...' : 'O seu email...';
  const msgPlaceholder = SITE.lang === 'en' ? 'Your message...' : 'A sua mensagem...';

  // Contactos do config.json como fallback
  const cfg = SITE.config?.contactos || {};
  const tel = s.infoContacto?.telefone || cfg.telefone || '';
  const email = s.infoContacto?.email || cfg.email || '';
  const morada = s.infoContacto?.morada || cfg.morada || '';
  const whatsapp = cfg.whatsapp || '';

  // Google Maps embed se morada existir
  const mapQuery = encodeURIComponent(morada || 'Baixa da Banheira, Portugal');
  const mapEmbed = s.mapaEmbed || `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  // Textos localizados
  const txtPhone = SITE.lang === 'en' ? 'Phone' : 'Telefone';
  const txtAddress = SITE.lang === 'en' ? 'Address' : 'Morada';
  const txtHours = SITE.lang === 'en' ? 'Opening Hours' : 'Horário';
  const txtFullName = SITE.lang === 'en' ? 'Full Name' : 'Nome Completo';
  const txtMessage = SITE.lang === 'en' ? 'Message' : 'Mensagem';
  const txtSend = SITE.lang === 'en' ? 'Send Message' : 'Enviar Mensagem';
  const txtMonFri = SITE.lang === 'en' ? 'Mon - Fri' : 'Seg - Sex';
  const txtSat = SITE.lang === 'en' ? 'Saturday' : 'Sábado';
  const txtSun = SITE.lang === 'en' ? 'Sunday' : 'Domingo';
  const txtClosed = SITE.lang === 'en' ? 'Closed' : 'Fechado';

  return `
    <section id="${s.id || 'contactos'}" class="contacts-section">
      <div class="contacts-grid">
        <div class="contacts-info reveal">
          <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
          <h2 data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
          <p data-pt="${s.descricao}" data-en="${s.descricaoEn || s.descricao}">${t(s.descricao, s.descricaoEn)}</p>

          ${tel ? `
            <a class="contact-card" href="tel:${tel.replace(/\s/g,'')}">
              <div class="contact-card__visual">${txtPhone.charAt(0)}</div>
              <div>
                <div class="contact-card__label">${txtPhone}</div>
                <div class="contact-card__value">${tel}</div>
              </div>
            </a>
          ` : ''}

          ${email ? `
            <a class="contact-card" href="mailto:${email}">
              <div class="contact-card__visual">@</div>
              <div>
                <div class="contact-card__label">Email</div>
                <div class="contact-card__value">${email}</div>
              </div>
            </a>
          ` : ''}

          ${morada ? `
            <a class="contact-card" href="https://maps.google.com/?q=${encodeURIComponent(morada)}" target="_blank" rel="noopener">
              <div class="contact-card__visual">↗</div>
              <div>
                <div class="contact-card__label">${txtAddress}</div>
                <div class="contact-card__value" style="font-size:0.95rem;line-height:1.4">${morada}</div>
              </div>
            </a>
          ` : ''}

          ${whatsapp ? `
            <a class="contact-card" href="https://wa.me/${whatsapp}" target="_blank" rel="noopener">
              <div class="contact-card__visual" style="background:linear-gradient(135deg,#25d366,#128c4b)">W</div>
              <div>
                <div class="contact-card__label">WhatsApp</div>
                <div class="contact-card__value">+${whatsapp}</div>
              </div>
            </a>
          ` : ''}

          <!-- Formulário inline moderno -->
          <div class="card" style="padding:36px;margin-top:32px">
            <div style="margin-bottom:24px">
              <label style="font-size:0.7rem;letter-spacing:0.25em;text-transform:uppercase;font-weight:700;color:var(--text-soft);display:block;margin-bottom:8px">${txtFullName}</label>
              <input type="text" id="contact-name" class="translatable-input" data-placeholder-pt="O seu nome..." data-placeholder-en="Your name..." placeholder="${namePlaceholder}" style="width:100%;padding:14px 18px;border-radius:4px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:0.95rem;outline:none;box-sizing:border-box;transition:border-color .25s" onfocus="this.style.borderColor='var(--accent-2)'" onblur="this.style.borderColor='var(--border)'">
            </div>
            <div style="margin-bottom:24px">
              <label style="font-size:0.7rem;letter-spacing:0.25em;text-transform:uppercase;font-weight:700;color:var(--text-soft);display:block;margin-bottom:8px">Email</label>
              <input type="email" id="contact-email" class="translatable-input" data-placeholder-pt="O seu email..." data-placeholder-en="Your email..." placeholder="${emailPlaceholder}" style="width:100%;padding:14px 18px;border-radius:4px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:0.95rem;outline:none;box-sizing:border-box;transition:border-color .25s" onfocus="this.style.borderColor='var(--accent-2)'" onblur="this.style.borderColor='var(--border)'">
            </div>
            <div style="margin-bottom:24px">
              <label style="font-size:0.7rem;letter-spacing:0.25em;text-transform:uppercase;font-weight:700;color:var(--text-soft);display:block;margin-bottom:8px">${txtMessage}</label>
              <textarea id="contact-msg" rows="4" class="translatable-input" data-placeholder-pt="A sua mensagem..." data-placeholder-en="Your message..." placeholder="${msgPlaceholder}" style="width:100%;padding:14px 18px;border-radius:4px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:0.95rem;outline:none;resize:vertical;box-sizing:border-box;transition:border-color .25s;font-family:inherit" onfocus="this.style.borderColor='var(--accent-2)'" onblur="this.style.borderColor='var(--border)'"></textarea>
            </div>
            <button class="btn-primary" style="width:100%" onclick="sendMessage()" id="btn-send-msg" data-pt="Enviar Mensagem" data-en="Send Message">${txtSend}</button>
            <p id="contact-success" style="margin-top:16px;color:var(--accent);font-weight:600;display:none;text-align:center;font-family:var(--serif)"></p>
          </div>
        </div>

        <div class="contacts-aside reveal">
          <div class="contacts-map-wrap">
            <iframe src="${mapEmbed}" width="100%" height="360" style="border:0;display:block" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <div class="contacts-hours">
            <h4>${txtHours}</h4>
            <div class="contacts-hours-row">
              <span class="day">${txtMonFri}</span>
              <span class="hours">9h00 - 19h00</span>
            </div>
            <div class="contacts-hours-row">
              <span class="day">${txtSat}</span>
              <span class="hours">10h00 - 17h00</span>
            </div>
            <div class="contacts-hours-row">
              <span class="day">${txtSun}</span>
              <span class="hours" style="color:var(--muted)">${txtClosed}</span>
            </div>
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

function sanitizeHTML(html) {
  if (!html) return '';
  const temp = document.createElement('div');
  temp.innerHTML = html;
  // Remover completamente elementos perigosos
  const dangerous = temp.querySelectorAll('script,iframe,object,embed,form,link,style,meta,base,svg,math');
  dangerous.forEach(el => el.remove());
  // Remover event handlers inline de todos os elementos
  temp.querySelectorAll('*').forEach(el => {
    const attrs = Array.from(el.attributes);
    attrs.forEach(attr => {
      if (attr.name.startsWith('on') || attr.value.toLowerCase().includes('javascript:') || attr.value.toLowerCase().includes('data:text/html')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  return temp.innerHTML;
}

function sanitizeCSS(css) {
  if (!css) return '';
  return css.replace(/expression\s*\(/gi, '/* blocked */(').replace(/javascript\s*:/gi, '/* blocked */:').replace(/url\s*\([^)]*javascript[^)]*\)/gi, 'url(/* blocked */)');
}

function renderHTML(s) {
  return `<section>${s.css ? `<style>${sanitizeCSS(s.css)}</style>` : ''}${sanitizeHTML(s.html || '')}</section>`;
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
function getSocialIcon(nome) {
  const icons = {
    'Facebook': '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    'Instagram': '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
    'LinkedIn': '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    'YouTube': '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    'TikTok': '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'
  };
  return icons[nome] || '<span style="font-size:1.2rem">' + (nome?.charAt(0) || '?') + '</span>';
}

function renderFooter() {
  const f = SITE.footer;
  if (!f) return;
  
  const linksHTML = f.linksRapidos?.map(l => `
    <a href="${l.ancora}" style="color:#94a3b8;text-decoration:none;font-size:0.88rem;transition:color .2s" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#94a3b8'" data-pt="${l.texto}" data-en="${l.textoEn || l.texto}">${t(l.texto, l.textoEn)}</a>
  `).join('') || '';
  
  const redesAtivas = f.redesSociais?.filter(r => r.ativo !== false) || [];
  const redesHTML = redesAtivas.length > 0 ? redesAtivas.map(r => `
    <a href="${r.url}" target="_blank" rel="noopener" style="width:40px;height:40px;background:#1e293b;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#94a3b8;text-decoration:none;transition:all .2s;font-size:1.1rem" onmouseover="this.style.background='#f97316';this.style.color='#fff'" onmouseout="this.style.background='#1e293b';this.style.color='#94a3b8'" title="${r.nome}">${getSocialIcon(r.nome)}</a>
  `).join('') : '';
  
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
          <p style="font-size:0.82rem" data-pt="${f.copyright}" data-en="${f.copyrightEn || f.copyright}">${t(f.copyright, f.copyrightEn).replace('{ano}', new Date().getFullYear())}</p>
          <button onclick="openModal('modal-privacidade')" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:0.82rem;text-decoration:underline" data-pt="Política de Privacidade" data-en="Privacy Policy">${ts('Política de Privacidade')}</button>
        </div>
      </div>
    </footer>
    
    <a href="https://wa.me/${f.whatsapp}?text=${encodeURIComponent(whatsappMsg)}" target="_blank" class="whatsapp-btn" title="${ts('Fale connosco no WhatsApp')}">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
    
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
  // Modais "standalone" (hero, formulário reserva, privacidade, etc.) vêm de modais.json
  const standaloneModais = (SITE.modais?.lista || []).filter(m => m.ativo !== false);

  // Modais das excursões são GERADOS automaticamente a partir de tours.json.
  const tourModais = (SITE.tours?.tours || [])
    .filter(t => t.ativo !== false)
    .map(tour => ({
      id: `modal-${tour.id}`,
      titulo: tour.nome,
      tituloEn: tour.nomeEn || tour.nome,
      subtitulo: formatTourSubtitulo(tour, 'pt'),
      subtituloEn: formatTourSubtitulo(tour, 'en'),
      imagem: tour.imagem,
      conteudo: tour.modalConteudo || tour.descricao || '',
      conteudoEn: tour.modalConteudoEn || tour.descricaoEn || '',
      incluidos: tour.incluidos || [],
      incluidosEn: tour.incluidosEn || [],
      textoBotao: tour.textoBotao || 'Reservar Agora',
      textoBotaoEn: tour.textoBotaoEn || 'Book Now',
      tourId: tour.id,
      tourData: tour.data,
      preco: tour.preco,
      duracao: tour.duracao,
      duracaoEn: tour.duracaoEn,
      tipo: 'conteudo',
      ativo: true
    }));

  const allModais = [...standaloneModais, ...tourModais];

  const modaisHTML = allModais.map(m => {
    if (m.tipo === 'formulario') {
      return renderModalFormulario(m);
    }
    return renderModalEditorial(m);
  }).join('');

  const modaisContainer = document.getElementById('modais-container');
  if (modaisContainer) {
    modaisContainer.innerHTML = modaisHTML;
  }
}

// Gera o subtitulo do modal: "27 de Junho de 2026 · 55€"
function formatTourSubtitulo(tour, lang) {
  const mesesPt = { Jan: 'Janeiro', Fev: 'Fevereiro', Mar: 'Março', Abr: 'Abril', Mai: 'Maio', Jun: 'Junho', Jul: 'Julho', Ago: 'Agosto', Set: 'Setembro', Out: 'Outubro', Nov: 'Novembro', Dez: 'Dezembro' };
  const mesesEn = { Jan: 'January', Fev: 'February', Mar: 'March', Abr: 'April', Mai: 'May', Jun: 'June', Jul: 'July', Ago: 'August', Set: 'September', Out: 'October', Nov: 'November', Dez: 'December' };
  const dia = tour.data?.dia || '';
  const mesRaw = tour.data?.mes || '';
  const ano = '2026';
  const mes = lang === 'en' ? (mesesEn[mesRaw] || mesRaw) : (mesesPt[mesRaw] || mesRaw);
  const connector = lang === 'en' ? ', ' : ' de ';
  const dataStr = dia && mes ? `${dia}${connector}${mes} ${ano}` : '';
  const preco = tour.preco != null ? `${tour.preco}€` : '';
  return [dataStr, preco].filter(Boolean).join(' · ');
}

// Modal editorial moderno: layout split (imagem + conteúdo)
function renderModalEditorial(m) {
  const titulo = t(m.titulo, m.tituloEn);
  const subtitulo = m.subtitulo ? t(m.subtitulo, m.subtituloEn) : '';
  const conteudo = t(m.conteudo, m.conteudoEn);
  const duracao = m.duracao ? t(m.duracao, m.duracaoEn) : '';

  const incluidosRaw = m.incluidos || [];
  const incluidosEnRaw = m.incluidosEn || [];
  const normalizeItem = (item) => typeof item === 'object' && item !== null ? (item.item || '') : item;
  const incluidos = incluidosRaw.map(normalizeItem).filter(Boolean);
  const incluidosEn = incluidosEnRaw.length > 0 ? incluidosEnRaw.map(normalizeItem) : incluidos;

  const incluidosHTML = incluidos.map((item, idx) => `
    <li><span data-pt="${item}" data-en="${incluidosEn[idx] || item}">${t(item, incluidosEn[idx] || item)}</span></li>
  `).join('');

  const dia = m.tourData?.dia || '';
  const mesRaw = m.tourData?.mes || '';
  const dateStamp = m.imagem && dia ? `
    <div class="date-stamp">
      <span class="day">${dia}</span>
      <span class="month">${mesRaw}</span>
    </div>
  ` : '';

  // Modais com tourId (excursões) — layout split editorial
  if (m.tourId && m.imagem) {
    return `
      <div class="modal-overlay" id="${m.id}" onclick="closeModalOutside(event,'${m.id}')">
        <div class="modal-box modal-box--editorial">
          <button class="modal-close-btn" onclick="closeModal('${m.id}')" aria-label="Fechar">✕</button>
          <div class="modal-visual">
            <img src="${m.imagem}" alt="${titulo}">
            ${dateStamp}
          </div>
          <div class="modal-body">
            <div class="modal-eyebrow">${duracao || ts('pessoa')}</div>
            <h3 class="modal-title" data-pt="${m.titulo}" data-en="${m.tituloEn || m.titulo}">${titulo}</h3>
            ${subtitulo ? `<p class="modal-subtitle" data-pt="${m.subtitulo}" data-en="${m.subtituloEn || m.subtitulo}">${subtitulo}</p>` : ''}
            <div class="modal-content-text" data-pt="${m.conteudo}" data-en="${m.conteudoEn || m.conteudo}">${renderMarkdown(conteudo)}</div>
            ${incluidosHTML ? `
              <div class="modal-includes-title">${ts('Incluído no pacote:')}</div>
              <ul class="modal-includes-list">${incluidosHTML}</ul>
            ` : ''}
            <div class="modal-footer">
              ${m.preco != null ? `<div class="modal-price">${m.preco}€<small>/${ts('pessoa')}</small></div>` : '<div></div>'}
              ${m.textoBotao ? `<button class="btn-primary" onclick="closeModal('${m.id}');openReservaModal('${m.tourId}')" data-pt="${m.textoBotao}" data-en="${m.textoBotaoEn || m.textoBotao}">${t(m.textoBotao, m.textoBotaoEn)}</button>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Fallback para modais genéricos (hero, privacidade, etc.) — sem layout split
  return renderModalGenerico(m);
}

// Renderiza modal genérico (hero, privacidade, etc.) — visual antigo mas ainda funciona
function renderModalGenerico(m) {
  const incluidosRaw = m.incluidos || [];
  const incluidosEnRaw = m.incluidosEn || [];
  const normalizeItem = (item) => typeof item === 'object' && item !== null ? (item.item || '') : item;
  const incluidos = incluidosRaw.map(normalizeItem);
  const incluidosEn = incluidosEnRaw.length > 0 ? incluidosEnRaw.map(normalizeItem) : incluidos;
  const incluidosHTML = incluidos.filter(Boolean).map((item, idx) => `
    <div style="display:flex;align-items:center;gap:8px;color:var(--muted);font-size:0.88rem">
      <span style="color:var(--accent);font-weight:700">✓</span>
      <span data-pt="${item}" data-en="${incluidosEn[idx] || item}">${t(item, incluidosEn[idx] || item)}</span>
    </div>
  `).join('');

  const titulo = t(m.titulo, m.tituloEn);
  const subtitulo = m.subtitulo ? t(m.subtitulo, m.subtituloEn) : '';
  const conteudo = t(m.conteudo, m.conteudoEn);
  const textoBotao = m.textoBotao ? t(m.textoBotao, m.textoBotaoEn) : '';

  return `
    <div class="modal-overlay" id="${m.id}" onclick="closeModalOutside(event,'${m.id}')">
      <div class="modal-box ${m.imagem ? 'wide' : ''}" style="${!m.imagem ? 'padding:40px' : ''}">
        <button class="modal-close-btn" onclick="closeModal('${m.id}')" aria-label="Fechar" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:var(--card);border:1px solid var(--border);cursor:pointer;font-size:1.1rem;color:var(--text);z-index:10;transition:all .2s">✕</button>
        ${m.imagem ? `<img src="${m.imagem}" alt="${titulo}" style="width:100%;height:280px;object-fit:cover">` : ''}
        <div style="${m.imagem ? 'padding:36px' : ''}">
          <div style="margin-bottom:20px">
            <h3 class="font-playfair" style="font-size:2rem;font-weight:500;letter-spacing:-0.01em;line-height:1.15" data-pt="${m.titulo}" data-en="${m.tituloEn || m.titulo}">${titulo}</h3>
            ${m.subtitulo ? `<p style="font-family:var(--serif);font-style:italic;color:var(--text-soft);font-size:1rem;margin-top:8px" data-pt="${m.subtitulo}" data-en="${m.subtituloEn || m.subtitulo}">${subtitulo}</p>` : ''}
          </div>
          <div style="color:var(--text-soft);font-size:0.95rem;line-height:1.8" data-pt="${m.conteudo}" data-en="${m.conteudoEn || m.conteudo}">${renderMarkdown(conteudo)}</div>
          ${incluidosHTML ? `
            <h4 style="font-size:0.7rem;letter-spacing:0.25em;text-transform:uppercase;font-weight:700;color:var(--text-soft);margin:24px 0 12px">${ts('Incluído no pacote:')}</h4>
            <div class="grid-2col" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:24px">${incluidosHTML}</div>
          ` : ''}
          ${m.textoBotao ? `<button class="btn-primary" style="margin-top:8px" onclick="closeModal('${m.id}');openReservaModal('${m.tourId || ''}')" data-pt="${m.textoBotao}" data-en="${m.textoBotaoEn || m.textoBotao}">${textoBotao}</button>` : ''}
          ${m.botoes && m.botoes.length > 0 ? `<div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap">${m.botoes.map(b => {
            const bText = t(b.texto, b.textoEn);
            if (b.acao === 'scroll' && b.ancora) {
              return `<button class="btn-primary" style="margin-top:0" onclick="closeModal('${m.id}');scrollToSection('${b.ancora.replace('#','')}')" data-pt="${b.texto}" data-en="${b.textoEn || b.texto}">${bText}</button>`;
            }
            return `<button class="btn-primary" style="margin-top:0" data-pt="${b.texto}" data-en="${b.textoEn || b.texto}">${bText}</button>`;
          }).join('')}</div>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderModalFormulario(m) {
  let tourOptions = '';
  if (m.id === 'modal-reserva') {
    // Fonte única: tours.json
    const tours = (SITE.tours?.tours || [])
      .filter(e => e.ativo !== false)
      .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    // Fallback de compatibilidade (caso tours.json ainda não tenha carregado)
    const fallbackTours = tours.length > 0 ? tours : (SITE.data?.secoes?.find(s => s.type === 'tours')?.excursoes || []);
    tourOptions = fallbackTours
      .map(e => {
        const nome = t(e.nome, e.nomeEn);
        return `<option value="${e.id}">${nome} — ${e.preco}€/${ts('pessoa')}</option>`;
      })
      .join('');
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

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function decodeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/### (.*)/g, '<h4 style="color:var(--text);font-weight:700;margin:16px 0 8px">$1</h4>')
    .replace(/## (.*)/g, '<h3 style="color:var(--text);font-weight:700;margin:16px 0 8px;font-size:1.1rem">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^> (.*)/gm, '<blockquote style="border-left:4px solid #f97316;padding-left:16px;color:var(--muted);font-style:italic;margin:12px 0">$1</blockquote>')
    .replace(/^[-*] (.*)/gm, '<div style="display:flex;align-items:flex-start;gap:8px;margin:4px 0"><span style="color:#2d7a3a;font-weight:700;flex-shrink:0">•</span><span>$1</span></div>')
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
  
  document.querySelectorAll('[data-pt]').forEach(el => {
    const pt = el.dataset.pt;
    const en = el.dataset.en || pt;
    el.textContent = (lang === 'en' ? en : pt).replace('{ano}', new Date().getFullYear());
  });
  
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const msgInput = document.getElementById('contact-msg');
  const newsletterInput = document.getElementById('newsletter-email');
  
  if (nameInput) nameInput.placeholder = lang === 'en' ? 'Your name...' : 'O seu nome...';
  if (emailInput) emailInput.placeholder = lang === 'en' ? 'Your email...' : 'O seu email...';
  if (msgInput) msgInput.placeholder = lang === 'en' ? 'Your message...' : 'A sua mensagem...';
  if (newsletterInput) newsletterInput.placeholder = lang === 'en' ? 'Your email...' : 'O seu email...';
  
  document.querySelectorAll('.translatable-markdown').forEach(el => {
    const pt = decodeHtml(el.dataset.pt);
    const en = decodeHtml(el.dataset.en || el.dataset.pt);
    el.innerHTML = renderMarkdown(lang === 'en' ? en : pt);
  });
  
  renderModals();
  
  document.getElementById('btn-pt')?.classList.toggle('active', lang === 'pt');
  document.getElementById('btn-en')?.classList.toggle('active', lang === 'en');
  document.getElementById('btn-pt-m')?.classList.toggle('active', lang === 'pt');
  document.getElementById('btn-en-m')?.classList.toggle('active', lang === 'en');
}

function applyLang(lang) {
  setLang(lang);
}

function updateFormPlaceholders() {
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const msgInput = document.getElementById('contact-msg');
  
  if (nameInput) nameInput.placeholder = SITE.lang === 'en' ? 'Your name...' : 'O seu nome...';
  if (emailInput) emailInput.placeholder = SITE.lang === 'en' ? 'Your email...' : 'O seu email...';
  if (msgInput) msgInput.placeholder = SITE.lang === 'en' ? 'Your message...' : 'A sua mensagem...';
}

function toggleTheme() {
  SITE.theme = SITE.theme === 'dark' ? 'light' : 'dark';
  applyTheme(SITE.theme);
}

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  const toggleM = document.getElementById('theme-toggle-m');
  if (toggleM) toggleM.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}

// ============================================
// AÇÕES DOS MODAIS
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

function openReservaModal(tourId) {
  openModal('modal-reserva');
  const sel = document.getElementById('reserva-tour');
  if (sel && tourId) {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === tourId) {
        sel.selectedIndex = i;
        break;
      }
    }
  }
}

// ============================================
// ENVIOS PARA WEB3FORMS (CORRIGIDO)
// ============================================
async function submitForm(modalId) {
  const nome = document.getElementById('reserva-nome')?.value || '';
  const email = document.getElementById('reserva-email')?.value || '';
  const tel = document.getElementById('reserva-tel')?.value || '';
  const tourSelect = document.getElementById('reserva-tour');
  const tourText = tourSelect?.options[tourSelect.selectedIndex]?.text || '';
  const pessoas = document.getElementById('reserva-pessoas')?.value || '1';
  const obs = document.getElementById('reserva-obs')?.value || '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!nome || !email) {
    alert(ts('Por favor preencha o nome e email.'));
    return;
  }
  if (!emailRegex.test(email)) {
    alert(SITE.lang === 'en' ? 'Please enter a valid email address.' : 'Por favor insira um email válido.');
    return;
  }

  const btn = document.getElementById(`btn-submit-${modalId}`);
  const successMsg = document.getElementById(`form-success-${modalId}`);

  if (btn) {
    btn.disabled = true;
    btn.textContent = SITE.lang === 'en' ? 'Sending...' : 'A enviar...';
  }

  try {
    // Envia via proxy Cloudflare Function (oculta a API key)
    const formEndpoint = `${BASE_URL}/api/submit`;
    const response = await fetch(formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _access_key: SITE.config.web3formsKey,
        subject: "Nova Reserva: " + tourText,
        from_name: "Cipritravel Reservas",
        reply_to: email, 
        redirect: false,
        nome_cliente: nome,
        email_cliente: email,
        telefone: tel,
        tour_escolhido: tourText,
        numero_pessoas: pessoas,
        observacoes: obs
      })
    });

    const result = await response.json();

    if (result.success) {
      if (successMsg) {
        successMsg.textContent = ts('Thank you! We\'ll contact you soon.');
        successMsg.style.display = 'block';
      }

      document.getElementById('reserva-nome').value = '';
      document.getElementById('reserva-email').value = '';
      document.getElementById('reserva-tel').value = '';
      document.getElementById('reserva-pessoas').value = '1';
      document.getElementById('reserva-obs').value = '';

      setTimeout(() => {
        closeModal(modalId);
        if (successMsg) successMsg.style.display = 'none';
      }, 3000);
    }
  } catch (error) {
    console.error('Erro ao enviar reserva:', error);
    alert(SITE.lang === 'en' ? 'Error sending request. Please try again.' : 'Erro ao enviar pedido. Por favor tente novamente.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = t('Enviar Pedido de Reserva', 'Send Booking Request');
    }
  }
}

async function sendMessage() {
  const nome = document.getElementById('contact-name')?.value;
  const email = document.getElementById('contact-email')?.value;
  const msg = document.getElementById('contact-msg')?.value;
  const btn = document.getElementById('btn-send-msg');
  const successMsg = document.getElementById('contact-success');

  if (!nome || !email || !msg) {
    alert(SITE.lang === 'en' ? 'Please fill in all fields.' : 'Por favor preencha todos os campos.');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert(SITE.lang === 'en' ? 'Please enter a valid email address.' : 'Por favor insira um email válido.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = SITE.lang === 'en' ? 'Sending...' : 'A enviar...';
  }

  try {
    // Envia via proxy Cloudflare Function (oculta a API key)
    const formEndpoint = `${BASE_URL}/api/submit`;
    const response = await fetch(formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _access_key: SITE.config.web3formsKey,
        subject: 'Nova Mensagem de Contacto - Cipritravel Tours',
        from_name: nome,
        email: email,
        message: msg,
        reply_to: email,
        redirect: false
      })
    });

    const result = await response.json();
    console.log('Resultado Web3Forms:', result);

    if (result.success) {
      if (successMsg) {
        successMsg.textContent = SITE.lang === 'en' 
          ? 'Thank you! Message sent successfully.' 
          : 'Obrigado! Mensagem enviada com sucesso.';
        successMsg.style.display = 'block';
      }
      document.getElementById('contact-name').value = '';
      document.getElementById('contact-email').value = '';
      document.getElementById('contact-msg').value = '';
      
      setTimeout(() => {
        if (successMsg) successMsg.style.display = 'none';
      }, 5000);
    } else {
      alert(SITE.lang === 'en' ? 'Error sending. Try again.' : 'Erro ao enviar. Tente novamente.');
    }

  } catch (error) {
    console.error('Erro:', error);
    alert(SITE.lang === 'en' ? 'Error sending. Try again.' : 'Erro ao enviar. Tente novamente.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = SITE.lang === 'en' ? 'Send Message' : 'Enviar Mensagem';
    }
  }
}

async function subscribeNewsletter() {
  const emailEl = document.getElementById('newsletter-email');
  const msgEl = document.getElementById('newsletter-msg');
  
  if (!emailEl || !emailEl.value) return;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailEl.value)) {
    msgEl.style.opacity = '1';
    msgEl.textContent = SITE.lang === 'en' ? 'Please enter a valid email.' : 'Por favor insira um email válido.';
    setTimeout(() => { msgEl.style.opacity = '0'; }, 3000);
    return;
  }
  
  msgEl.style.opacity = '1';
  msgEl.textContent = SITE.lang === 'en' ? 'Subscribing...' : 'A subscrever...';
  
  try {
    // Envia via proxy Cloudflare Function (oculta a API key)
    const formEndpoint = `${BASE_URL}/api/submit`;
    const response = await fetch(formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _access_key: SITE.config.web3formsKey,
        subject: 'Nova subscrição newsletter - Cipritravel',
        from_name: 'Newsletter',
        email: emailEl.value,
        message: 'Nova subscrição de newsletter: ' + emailEl.value,
        redirect: false
      })
    });

    const result = await response.json();

    if (result.success) {
      msgEl.textContent = SITE.lang === 'en' ? 'Thank you for subscribing!' : 'Obrigado por subscrever!';
      emailEl.value = '';
      setTimeout(() => { msgEl.style.opacity = '0'; }, 5000);
    } else {
      msgEl.textContent = SITE.lang === 'en' ? 'Error. Please try again.' : 'Erro. Por favor tente novamente.';
    }
  } catch (error) {
    console.error('Erro newsletter:', error);
    msgEl.textContent = SITE.lang === 'en' ? 'Error. Please try again.' : 'Erro. Por favor tente novamente.';
  }
}

window.addEventListener('scroll', () => {
  const backTop = document.getElementById('back-top');
  if (backTop) {
    backTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
  }
});

// ============================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================
function setupScrollReveal() {
  const targets = document.querySelectorAll('main > section, .reveal, .reveal-stagger');
  targets.forEach(el => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-stagger')) {
      el.classList.add('reveal');
    }
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
}

// ============================================
// PARALLAX EFFECT
// ============================================
// Move a imagem de fundo do .parallax-showcase a 50% da velocidade do scroll
// para criar profundidade. Leve, não distrai.
function setupParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  // Respeita prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Throttle com requestAnimationFrame
  let ticking = false;
  function update() {
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Só atualiza se a secção estiver visível
      if (rect.bottom > 0 && rect.top < windowHeight) {
        // Offset relativo ao centro do viewport
        const scrolled = (rect.top + rect.height / 2) - windowHeight / 2;
        const speed = 0.15; // 15% da velocidade do scroll (subtil)
        el.style.transform = `translateY(${-scrolled * speed}px) scale(1.05)`;
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update(); // initial
}

// ============================================
// INICIALIZAÇÃO
// ============================================
// Robusto contra race condition: se o DOM já tiver sido parsed quando
// section.js carregar, DOMContentLoaded já disparou e o listener nunca
// seria chamado. Verificamos readyState para cobrir ambos os casos.
async function bootstrap() {
  const loaded = await loadAllData();
  if (loaded) {
    renderPage();
    setupScrollReveal();
    setupParallax();
  }
}

if (document.readyState === 'loading') {
  // Ainda a fazer parse do HTML — DOMContentLoaded ainda vai disparar
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  // DOM já está pronto ('interactive' ou 'complete') — executar já
  bootstrap();
}
