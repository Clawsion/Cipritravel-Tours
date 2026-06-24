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
          <button class="btn-submit" style="margin-top:20px" onclick="location.reload()">Atualizar Página</button>
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
  // Procura a excursão marcada como destaque em tours.json (pode estar ativo=false)
  const allTours = SITE.tours?.tours || [];
  const tour = allTours.find(t => t.destaque === true)
            || allTours.find(t => t.id === 'fatima-obidos')
            || allTours.find(t => t.ativo !== false);

  if (!tour) return '';

  const nome = t(tour.nome, tour.nomeEn);
  const descricao = t(tour.descricao, tour.descricaoEn);
  const duracao = t(tour.duracao, tour.duracaoEn);
  const dia = tour.data?.dia || '';
  const mes = tour.data?.mes || '';
  const tituloDestaque = SITE.lang === 'en' ? 'Featured Journey' : 'Viagem em Destaque';

  return `
    <section class="parallax-showcase" id="destaque">
      <div class="parallax-showcase__bg-wrap" data-parallax-reverse>
        <img class="parallax-showcase__bg" src="${tour.imagem}" alt="${nome}">
      </div>
      <div class="parallax-showcase__overlay"></div>
      <div class="parallax-showcase__inner">
        <div class="parallax-showcase__text reveal">
          <span class="section-tag" data-pt="Excursão em Destaque" data-en="Featured Tour">${SITE.lang === 'en' ? 'Featured Tour' : 'Excursão em Destaque'}</span>
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

  const toursHTML = tours.map((tour, idx) => {
    const nome = t(tour.nome, tour.nomeEn);
    const duracao = t(tour.duracao, tour.duracaoEn);
    const descricao = t(tour.descricao, tour.descricaoEn);
    const dataLabel = `${tour.data?.dia || ''} ${tour.data?.mes || ''}`.trim();

    return `
    <article class="magazine-card reveal-stagger" onclick="openModal('modal-${tour.id}')">
      <div class="magazine-card__visual">
        <img src="${tour.imagem}" alt="${nome}" class="magazine-card__img" loading="lazy">
        <div class="magazine-card__overlay"></div>
        <span class="magazine-card__category ${tour.corBadge === 'verde' ? 'green' : ''}">${dataLabel || 'Tour'}</span>
        <div class="magazine-card__title-overlay">
          <span class="magazine-card__date-stamp">🕐 ${duracao}</span>
          <h3 class="magazine-card__title" data-pt="${tour.nome}" data-en="${tour.nomeEn || tour.nome}">${nome}</h3>
        </div>
      </div>
      <div class="magazine-card__body">
        <p class="magazine-card__excerpt" data-pt="${tour.descricao}" data-en="${tour.descricaoEn || tour.descricao}">${descricao}</p>
        <div class="magazine-card__footer">
          <span class="magazine-card__price">${tour.preco}€<small>/${ts('pessoa')}</small></span>
          <button class="magazine-card__cta" onclick="event.stopPropagation();openReservaModal('${tour.id}')" data-pt="Reservar" data-en="Book">
            ${ts('Reservar')} <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </article>
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
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:28px;align-items:stretch;text-align:left">
          ${toursHTML}
        </div>
      </div>
    </section>
  `;
}

function renderBlog(s) {
  const artigos = s.artigos?.filter(a => a.ativo !== false) || [];

  const artigosHTML = artigos.map((a, idx) => {
    return `
    <article class="blog-card reveal-stagger" onclick="openModal('modal-${a.id}')">
      <div class="blog-card__visual">
        <img src="${a.imagem}" alt="${t(a.titulo, a.tituloEn)}" class="blog-card__img" loading="lazy">
        <span class="blog-card__category" data-pt="${a.categoria}" data-en="${a.categoriaEn || a.categoria}">${t(a.categoria, a.categoriaEn)}</span>
      </div>
      <div class="blog-card__body">
        <div>
          <span class="blog-card__date">${formatDate(a.data)}</span>
          <h3 class="blog-card__title" data-pt="${a.titulo}" data-en="${a.tituloEn || a.titulo}">${t(a.titulo, a.tituloEn)}</h3>
          <p class="blog-card__excerpt" data-pt="${a.resumo}" data-en="${a.resumoEn || a.resumo}">${t(a.resumo, a.resumoEn)}</p>
        </div>
        <button class="blog-card__cta" onclick="event.stopPropagation();openModal('modal-${a.id}')" data-pt="Ler mais" data-en="Read more">
          ${SITE.lang === 'en' ? 'Read more' : 'Ler mais'} <span class="arrow">→</span>
        </button>
      </div>
    </article>
    `;
  }).join('');

  return `
    <section id="${s.id || 'blog'}" style="background:var(--bg)">
      <div style="text-align:center">
        <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
        <h2 class="section-title" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <p class="section-subtitle" data-pt="${s.descricao}" data-en="${s.descricaoEn || s.descricao}">${t(s.descricao, s.descricaoEn)}</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:28px;margin-top:60px;text-align:left">
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

  const itensHTML = itens.map((i, idx) => {
    return `
    <article class="magazine-card reveal-stagger" onclick="openModal('modal-${i.id}')">
      <div class="magazine-card__visual">
        <img src="${i.imagem}" alt="${t(i.titulo, i.tituloEn)}" class="magazine-card__img" loading="lazy">
        <div class="magazine-card__overlay"></div>
        <span class="magazine-card__category ${tagColorClass}" data-pt="${i.categoria}" data-en="${i.categoriaEn || i.categoria}">${t(i.categoria, i.categoriaEn)}</span>
        <div class="magazine-card__title-overlay">
          <span class="magazine-card__date-stamp">${formatDate(i.data)}</span>
          <h3 class="magazine-card__title" data-pt="${i.titulo}" data-en="${i.tituloEn || i.titulo}">${t(i.titulo, i.tituloEn)}</h3>
        </div>
      </div>
      <div class="magazine-card__body">
        <p class="magazine-card__excerpt" data-pt="${i.resumo}" data-en="${i.resumoEn || i.resumo}">${t(i.resumo, i.resumoEn)}</p>
        <div class="magazine-card__footer magazine-card__footer--simple">
          <button class="magazine-card__cta" onclick="event.stopPropagation();openModal('modal-${i.id}')" data-pt="Ler mais" data-en="Read more">
            ${SITE.lang === 'en' ? 'Read more' : 'Ler mais'} <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </article>
    `;
  }).join('');

  return `
    <section id="${s.id || 'cards'}" style="background:${bgClass}">
      <div style="text-align:center">
        <span class="section-tag ${tagColorClass}" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
        <h2 class="section-title" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <p class="section-subtitle" data-pt="${s.descricao}" data-en="${s.descricaoEn || s.descricao}">${t(s.descricao, s.descricaoEn)}</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;margin-top:60px;text-align:left">
          ${itensHTML}
        </div>
      </div>
    </section>
  `;
}

function renderTextoImagem(s) {
  const isEn = SITE.lang === 'en';
  const texto1 = t(s.texto1, s.texto1En);
  const texto2 = t(s.texto2, s.texto2En);
  const citacao = t(s.citacao, s.citacaoEn);
  const titulo = t(s.titulo, s.tituloEn);
  const tag = t(s.tag, s.tagEn);
  const textoBotao = t(s.textoBotao, s.textoBotaoEn);

  return `
    <section id="${s.id || 'sobre'}" class="about-cinematic reveal" style="background-image:url('${s.imagem}')">
      <div class="about-cinematic__inner">
        <span class="about-cinematic__tag" data-pt="${escapeHtml(s.tag)}" data-en="${escapeHtml(s.tagEn || s.tag)}">${tag}</span>
        <h2 class="about-cinematic__title" data-pt="${escapeHtml(s.titulo)}" data-en="${escapeHtml(s.tituloEn || s.titulo)}">${titulo}</h2>
        <p class="about-cinematic__quote" data-pt="${escapeHtml(s.citacao)}" data-en="${escapeHtml(s.citacaoEn || s.citacao)}">${citacao}</p>
        <div class="about-cinematic__text-grid">
          <div class="about-cinematic__text translatable-markdown" data-pt="${escapeHtml(s.texto1)}" data-en="${escapeHtml(s.texto1En || s.texto1)}">${renderMarkdown(texto1)}</div>
          <div class="about-cinematic__text translatable-markdown" data-pt="${escapeHtml(s.texto2)}" data-en="${escapeHtml(s.texto2En || s.texto2)}">${renderMarkdown(texto2)}</div>
        </div>
        ${s.textoBotao ? `
          <div class="about-cinematic__cta">
            <button class="btn-outline" onclick="scrollToSection('${s.ancoraBotao?.replace('#','') || 'contactos'}')" data-pt="${escapeHtml(s.textoBotao)}" data-en="${escapeHtml(s.textoBotaoEn || s.textoBotao)}">${textoBotao}</button>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

function renderFeatures(s) {
  const itens = (s.itens || []).filter(i => i.ativo !== false);
  const bgClass = s.corFundo === 'cinza' ? 'var(--bg)' : 'var(--card)';

  // Itens com foto: cards verticais estilo magazine com hover overlay
  // Grid sempre 1 linha no desktop (até 6 cards), responsivo para 2/1
  const itensHTML = itens.map((i, idx) => {
    const titulo = t(i.titulo, i.tituloEn);
    const descricao = t(i.descricao, i.descricaoEn);
    const initial = (titulo || '?').charAt(0).toUpperCase();

    const visual = i.imagem
      ? `<img class="why-card__img" src="${i.imagem}" alt="${titulo}" loading="lazy">`
      : `<div class="why-card__img" style="background:linear-gradient(135deg,var(--accent),var(--accent-2));display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--serif);font-size:4.5rem;font-weight:700;font-style:italic">${initial}</div>`;

    return `
      <div class="why-card reveal-stagger">
        <div class="why-card__visual">
          ${visual}
          <div class="why-card__overlay-num">${String(idx+1).padStart(2,'0')}</div>
        </div>
        <div class="why-card__body">
          <h3 class="why-card__title" data-pt="${i.titulo}" data-en="${i.tituloEn || i.titulo}">${titulo}</h3>
          <p class="why-card__desc" data-pt="${i.descricao}" data-en="${i.descricaoEn || i.descricao}">${descricao}</p>
        </div>
      </div>
    `;
  }).join('');

  // Grid dinâmico: 1 linha no desktop, 2 cols tablet, 1 col mobile
  const itemCount = itens.length;
  const gridCols = itemCount <= 4 ? `repeat(${itemCount}, 1fr)` : `repeat(5, 1fr)`;

  return `
    <section id="${s.id || 'features'}" style="background:${bgClass}">
      <div style="text-align:center">
        <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
        <h2 class="section-title" data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
        <p class="section-subtitle" data-pt="${s.descricao || ''}" data-en="${s.descricaoEn || s.descricao || ''}">${t(s.descricao || '', s.descricaoEn || s.descricao || '')}</p>
        <div class="why-grid" style="display:grid;grid-template-columns:${gridCols};gap:24px;margin-top:64px">
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
          <button class="btn-outline" onclick="subscribeNewsletter()" data-pt="${s.textoBotao || 'Subscrever'}" data-en="${s.textoBotaoEn || 'Subscribe'}">${t(s.textoBotao || 'Subscrever', s.textoBotaoEn || 'Subscribe')}</button>
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

  // Google Maps embed
  const mapQuery = encodeURIComponent(morada || 'Baixa da Banheira, Portugal');
  const mapEmbed = s.mapaEmbed || `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  // Textos localizados
  const L = SITE.lang === 'en' ? {
    phone: 'Call us', address: 'Find us', hours: 'Opening Hours',
    fullName: 'Your Name', message: 'Message', send: 'Send Message',
    monFri: 'Mon – Fri', sat: 'Saturday', sun: 'Sunday', closed: 'Closed',
    directContact: 'Direct Contact', quickMessage: 'Quick Message',
    subtitle: 'We respond within 24 hours. Bookings, questions, custom tours — just reach out.'
  } : {
    phone: 'Ligue-nos', address: 'Encontre-nos', hours: 'Horário',
    fullName: 'O seu Nome', message: 'Mensagem', send: 'Enviar Mensagem',
    monFri: 'Seg – Sex', sat: 'Sábado', sun: 'Domingo', closed: 'Fechado',
    directContact: 'Contacto Direto', quickMessage: 'Mensagem Rápida',
    subtitle: 'Respondemos em até 24 horas. Reservas, dúvidas, tours personalizados — fale connosco.'
  };

  return `
    <section id="${s.id || 'contactos'}" class="contacts-section">
      <div class="contacts-grid">
        <!-- Lado esquerdo: Contacto Direto visual + horários -->
        <div class="contacts-info reveal">
          <span class="section-tag" data-pt="${s.tag}" data-en="${s.tagEn || s.tag}">${t(s.tag, s.tagEn)}</span>
          <h2 data-pt="${s.titulo}" data-en="${s.tituloEn || s.titulo}">${t(s.titulo, s.tituloEn)}</h2>
          <p data-pt="${s.descricao || L.subtitle}" data-en="${s.descricaoEn || L.subtitle}">${t(s.descricao || L.subtitle, s.descricaoEn || L.subtitle)}</p>

          <h3 class="contacts-block-title">${L.directContact}</h3>

          ${tel ? `
            <a class="contact-link" href="tel:${tel.replace(/\s/g,'')}">
              <span class="contact-link__label">${L.phone}</span>
              <span class="contact-link__value">${tel}</span>
              <span class="contact-link__arrow">→</span>
            </a>
          ` : ''}

          ${email ? `
            <a class="contact-link" href="mailto:${email}">
              <span class="contact-link__label">Email</span>
              <span class="contact-link__value">${email}</span>
              <span class="contact-link__arrow">→</span>
            </a>
          ` : ''}

          ${whatsapp ? `
            <a class="contact-link" href="https://wa.me/${whatsapp}" target="_blank" rel="noopener">
              <span class="contact-link__label">WhatsApp</span>
              <span class="contact-link__value">+${whatsapp}</span>
              <span class="contact-link__arrow">→</span>
            </a>
          ` : ''}

          ${morada ? `
            <a class="contact-link" href="https://maps.google.com/?q=${encodeURIComponent(morada)}" target="_blank" rel="noopener">
              <span class="contact-link__label">${L.address}</span>
              <span class="contact-link__value" style="font-size:0.95rem;line-height:1.4">${morada}</span>
              <span class="contact-link__arrow">→</span>
            </a>
          ` : ''}

          <div class="contacts-hours-mini">
            <h4>${L.hours}</h4>
            <div class="contacts-hours-row">
              <span class="day">${L.monFri}</span>
              <span class="hours">9h00 — 19h00</span>
            </div>
            <div class="contacts-hours-row">
              <span class="day">${L.sat}</span>
              <span class="hours">10h00 — 17h00</span>
            </div>
            <div class="contacts-hours-row">
              <span class="day">${L.sun}</span>
              <span class="hours" style="color:var(--muted)">${L.closed}</span>
            </div>
          </div>
        </div>

        <!-- Lado direito: Mapa em cima, formulário em baixo -->
        <div class="contacts-aside reveal">
          <div class="contacts-map-wrap">
            <iframe src="${mapEmbed}" width="100%" height="320" style="border:0;display:block" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>

          <div class="contacts-form-card">
            <h3>${L.quickMessage}</h3>
            <div class="contacts-form-grid">
              <input type="text" id="contact-name" class="translatable-input contacts-input" data-placeholder-pt="O seu nome..." data-placeholder-en="Your name..." placeholder="${namePlaceholder}">
              <input type="email" id="contact-email" class="translatable-input contacts-input" data-placeholder-pt="O seu email..." data-placeholder-en="Your email..." placeholder="${emailPlaceholder}">
            </div>
            <textarea id="contact-msg" rows="4" class="translatable-input contacts-input" data-placeholder-pt="A sua mensagem..." data-placeholder-en="Your message..." placeholder="${msgPlaceholder}"></textarea>
            <button class="btn-submit contacts-submit" onclick="sendMessage()" id="btn-send-msg" data-pt="Enviar Mensagem" data-en="Send Message">${L.send}</button>
            <p id="contact-success" style="margin-top:14px;color:var(--accent);font-weight:600;display:none;text-align:center;font-family:var(--serif)"></p>
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
    // Atualiza apenas os links do menu, mantendo os botões PT/EN e theme-icon
    // que já estão no HTML estático (com a nova estrutura minimalista)
    const existingActions = menuContainer.querySelector('div[style*="border-left"]');
    menuContainer.innerHTML = menuHTML;
    if (existingActions) {
      menuContainer.appendChild(existingActions);
    } else {
      // Fallback: cria os botões novos se não existirem
      const actions = document.createElement('div');
      actions.style.cssText = 'display:flex;align-items:center;gap:6px;margin-left:8px;border-left:1px solid var(--border);padding-left:12px';
      actions.innerHTML = `
        <button class="lang-link ${SITE.lang === 'pt' ? 'active' : ''}" id="lang-pt" onclick="setLang('pt')">PT</button>
        <span class="lang-sep">/</span>
        <button class="lang-link ${SITE.lang === 'en' ? 'active' : ''}" id="lang-en" onclick="setLang('en')">EN</button>
        <button class="theme-icon" id="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
          <span class="theme-icon__sun">☀</span>
          <span class="theme-icon__moon">☾</span>
        </button>
      `;
      menuContainer.appendChild(actions);
    }
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

// Modal editorial moderno: foto banner no topo + conteúdo em baixo
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

  // Modais com tourId (excursões) — Foto banner no topo + conteúdo em baixo
  if (m.tourId && m.imagem) {
    return `
      <div class="modal-overlay" id="${m.id}" onclick="closeModalOutside(event,'${m.id}')">
        <div class="modal-box modal-immersive">
          <button class="modal-immersive__close" onclick="closeModal('${m.id}')" aria-label="Fechar">✕</button>
          <div class="modal-immersive__banner">
            <img src="${m.imagem}" alt="${titulo}">
            <div class="modal-immersive__banner-overlay">
              <span class="modal-immersive__banner-eyebrow">${duracao || (SITE.lang === 'en' ? 'Tour' : 'Excursão')}</span>
              <h3 class="modal-immersive__banner-title" data-pt="${m.titulo}" data-en="${m.tituloEn || m.titulo}">${titulo}</h3>
            </div>
          </div>
          <div class="modal-immersive__content">
            ${subtitulo ? `<p class="modal-immersive__subtitle" data-pt="${m.subtitulo}" data-en="${m.subtituloEn || m.subtitulo}">${subtitulo}</p>` : ''}
            <div class="modal-immersive__body-text" data-pt="${m.conteudo}" data-en="${m.conteudoEn || m.conteudo}">${renderMarkdown(conteudo)}</div>
            ${incluidosHTML ? `
              <div class="modal-immersive__notes">
                <div class="modal-immersive__notes-title">${ts('Incluído no pacote:')}</div>
                <ul class="modal-immersive__notes-list">${incluidosHTML}</ul>
              </div>
            ` : ''}
            <div class="modal-immersive__footer">
              ${m.preco != null ? `<div class="modal-immersive__price">${m.preco}€<small>/${ts('pessoa')}</small></div>` : '<div></div>'}
              ${m.textoBotao ? `
                <button class="modal-immersive__cta" onclick="closeModal('${m.id}');openReservaModal('${m.tourId}')" data-pt="${m.textoBotao}" data-en="${m.textoBotaoEn || m.textoBotao}">
                  ${t(m.textoBotao, m.textoBotaoEn)} <span class="arrow">→</span>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Modais de blog — Layout artigo rico (intro + body + callout)
  if (m.id && m.id.startsWith('modal-blog-') && m.imagem) {
    const isEn = SITE.lang === 'en';
    // Procurar categoria correspondente no homepage.json
    const blogId = m.id.replace('modal-blog-', 'blog-');
    const blogSection = SITE.data?.secoes?.find(s => s.type === 'blog');
    const blogArtigo = blogSection?.artigos?.find(a => a.id === blogId);
    const categoria = blogArtigo ? t(blogArtigo.categoria, blogArtigo.categoriaEn) : (subtitulo || 'Blog');
    const dataStr = blogArtigo ? formatDate(blogArtigo.data) : '';

    // Parser melhor para o conteúdo do blog
    const parsed = parseBlogContent(conteudo);

    return `
      <div class="modal-overlay" id="${m.id}" onclick="closeModalOutside(event,'${m.id}')">
        <div class="modal-box modal-blog-article">
          <button class="modal-blog-article__close" onclick="closeModal('${m.id}')" aria-label="Fechar">✕</button>
          <div class="modal-blog-article__banner">
            <img src="${m.imagem}" alt="${titulo}">
            <div class="modal-blog-article__banner-overlay">
              <span class="modal-blog-article__banner-category">${categoria}</span>
              <h3 class="modal-blog-article__banner-title" data-pt="${m.titulo}" data-en="${m.tituloEn || m.titulo}">${titulo}</h3>
              ${dataStr ? `<div class="modal-blog-article__banner-meta">${dataStr}</div>` : ''}
            </div>
          </div>
          <div class="modal-blog-article__content">
            ${parsed.intro ? `<p class="modal-blog-article__intro">${parsed.intro}</p>` : ''}
            <div class="modal-blog-article__body">${parsed.body}</div>
            ${parsed.callout ? `
              <div class="modal-blog-article__callout">
                <div class="modal-blog-article__callout-title">${parsed.calloutTitle || (isEn ? 'Note' : 'Nota')}</div>
                <p>${parsed.callout}</p>
              </div>
            ` : ''}
            <div class="modal-blog-article__footer">
              <div class="modal-blog-article__footer-text">${isEn ? 'Inspired? Book your next adventure with us.' : 'Inspirado? Reserve a sua próxima aventura connosco.'}</div>
              <button class="modal-blog-article__cta" onclick="closeModal('${m.id}');scrollToSection('excursoes')">
                ${isEn ? 'View Tours' : 'Ver Excursões'} <span class="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Modais de sustentabilidade (com imagem, sem tourId, não-blog) — Foto banner + conteúdo
  if (m.imagem && !m.botoes) {
    return `
      <div class="modal-overlay" id="${m.id}" onclick="closeModalOutside(event,'${m.id}')">
        <div class="modal-box modal-immersive">
          <button class="modal-immersive__close" onclick="closeModal('${m.id}')" aria-label="Fechar">✕</button>
          <div class="modal-immersive__banner">
            <img src="${m.imagem}" alt="${titulo}">
            <div class="modal-immersive__banner-overlay">
              ${subtitulo ? `<span class="modal-immersive__banner-eyebrow" data-pt="${m.subtitulo}" data-en="${m.subtituloEn || m.subtitulo}">${subtitulo}</span>` : ''}
              <h3 class="modal-immersive__banner-title" data-pt="${m.titulo}" data-en="${m.tituloEn || m.titulo}">${titulo}</h3>
            </div>
          </div>
          <div class="modal-immersive__content">
            <div class="modal-immersive__body-text" data-pt="${m.conteudo}" data-en="${m.conteudoEn || m.conteudo}">${renderMarkdown(conteudo)}</div>
            ${incluidosHTML ? `
              <div class="modal-immersive__notes">
                <div class="modal-immersive__notes-title">${ts('Incluído no pacote:')}</div>
                <ul class="modal-immersive__notes-list">${incluidosHTML}</ul>
              </div>
            ` : ''}
            ${m.textoBotao ? `
              <div class="modal-immersive__footer">
                <div></div>
                <button class="modal-immersive__cta" onclick="closeModal('${m.id}');openReservaModal('${m.tourId || ''}')" data-pt="${m.textoBotao}" data-en="${m.textoBotaoEn || m.textoBotao}">
                  ${t(m.textoBotao, m.textoBotaoEn)} <span class="arrow">→</span>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // Fallback para modais genéricos (hero, privacidade, etc.) — sem layout split
  return renderModalGenerico(m);
}

// Parser para conteúdo de blog — separa intro, body (organizado em cards) e callout
function parseBlogContent(text) {
  if (!text) return { intro: '', body: '', callout: '', calloutTitle: '' };

  // Identificar callouts (secções tipo "### Quando Visitar", "### Dica")
  const calloutRegex = /### (Quando Visitar|Dica[^;\n]*|Como Planear[^\n]*)\n\n([^\n#]+(?:\n[^\n#]+)*?)(?=\n###|\n##|$)/i;
  let callout = '';
  let calloutTitle = '';
  let body = text;

  const calloutMatch = text.match(calloutRegex);
  if (calloutMatch) {
    calloutTitle = calloutMatch[1];
    callout = calloutMatch[2].trim();
    body = text.replace(calloutMatch[0], '').trim();
  }

  // Separar intro (primeiro parágrafo depois do primeiro ##)
  const lines = body.split('\n');
  let intro = '';
  let bodyRest = '';
  let inIntro = false;
  let foundFirstH2 = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      foundFirstH2 = true;
      bodyRest += line + '\n';
      continue;
    }
    if (foundFirstH2 && !inIntro && line.trim() && !line.startsWith('#')) {
      // primeiro parágrafo depois do primeiro h2
      intro = line.trim();
      inIntro = true;
      continue;
    }
    bodyRest += line + '\n';
  }

  // Renderizar bodyRest como HTML organizado em cards
  const bodyHTML = renderBlogBodyHTML(bodyRest.trim());

  return {
    intro: intro,
    body: bodyHTML,
    callout: callout,
    calloutTitle: calloutTitle
  };
}

// Renderiza o body do blog em cards organizados (h3 + lista = 1 card)
function renderBlogBodyHTML(text) {
  if (!text) return '';

  const lines = text.split('\n');
  let html = '';
  let i = 0;
  let currentList = [];
  let inOl = false;

  function flushList() {
    if (currentList.length === 0) return;
    const tag = inOl ? 'ol' : 'ul';
    html += `<${tag}>` + currentList.join('') + `</${tag}>`;
    currentList = [];
    inOl = false;
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      flushList();
      html += `<h2>${line.replace('## ', '').trim()}</h2>`;
    } else if (line.startsWith('### ')) {
      flushList();
      html += `<h3>${line.replace('### ', '').trim()}</h3>`;
    } else if (line.startsWith('#### ')) {
      flushList();
      html += `<h4>${line.replace('#### ', '').trim()}</h4>`;
    } else if (line.match(/^\d+\.\s/)) {
      // lista numerada
      if (!inOl) { flushList(); inOl = true; }
      const content = line.replace(/^\d+\.\s/, '').trim();
      currentList.push(`<li>${parseInlineMd(content)}</li>`);
    } else if (line.match(/^[-*]\s/)) {
      // lista com bullets
      if (inOl) { flushList(); }
      const content = line.replace(/^[-*]\s/, '').trim();
      currentList.push(`<li>${parseInlineMd(content)}</li>`);
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      html += `<p>${parseInlineMd(line.trim())}</p>`;
    }
    i++;
  }
  flushList();

  // Agrupar h3 + listas seguintes em cards
  // Estratégia: dividir o HTML por h3 e envolver cada secção
  const sections = html.split(/(?=<h3>)/);
  let result = '';
  let hasCards = false;
  const cardsBuffer = [];

  for (const section of sections) {
    if (section.startsWith('<h3>')) {
      // Esta secção começa com h3 — é um card
      hasCards = true;
      cardsBuffer.push(`<div class="blog-card-section">${section}</div>`);
    } else {
      // Conteúdo antes/depois dos cards — texto normal
      if (cardsBuffer.length > 0) {
        result += `<div class="blog-card-grid">${cardsBuffer.join('')}</div>`;
        cardsBuffer.length = 0;
      }
      result += section;
    }
  }
  if (cardsBuffer.length > 0) {
    result += `<div class="blog-card-grid">${cardsBuffer.join('')}</div>`;
  }

  return result;
}

// Parse inline markdown (bold, italic, links)
function parseInlineMd(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
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
  let toursList = [];
  if (m.id === 'modal-reserva') {
    // Fonte única: tours.json
    toursList = (SITE.tours?.tours || [])
      .filter(e => e.ativo !== false)
      .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    const fallbackTours = toursList.length > 0 ? toursList : (SITE.data?.secoes?.find(s => s.type === 'tours')?.excursoes || []);
    tourOptions = fallbackTours
      .map(e => {
        const nome = t(e.nome, e.nomeEn);
        return `<option value="${e.id}" data-preco="${e.preco}" data-duracao="${t(e.duracao, e.duracaoEn)}" data-data="${e.data?.dia || ''} ${e.data?.mes || ''}">${nome} — ${e.preco}€/${ts('pessoa')}</option>`;
      })
      .join('');
  }

  const titulo = t(m.titulo, m.tituloEn);
  const textoBotao = t(m.textoBotao, m.textoBotaoEn);

  // === MODAL DE RESERVA — Layout Contrato Premium (sem sidebar) ===
  if (m.id === 'modal-reserva') {
    const isEn = SITE.lang === 'en';
    const L = isEn ? {
      eyebrow: 'Booking Request',
      title: 'Reserve Your Journey',
      subtitle: 'Fill in the details below to confirm your reservation',
      sec1: 'Tour Selection',
      sec2: 'Passenger Details',
      sec3: 'Additional Notes',
      tourLabel: 'Choose Tour',
      paxLabel: 'Number of Passengers',
      nameLabel: 'Full Name',
      namePh: 'Your full name',
      emailLabel: 'Email',
      emailPh: 'your@email.com',
      phoneLabel: 'Phone',
      phonePh: '+351 ...',
      notesLabel: 'Special Requests',
      notesPh: 'Dietary restrictions, mobility needs, pickup point...',
      cta: 'Confirm Reservation',
      successIcon: '✓',
      successTitle: 'Reservation Received!',
      successText: 'Thank you! We will contact you within 24 hours to confirm your booking.'
    } : {
      eyebrow: 'Pedido de Reserva',
      title: 'Reserve a Sua Viagem',
      subtitle: 'Preencha os dados abaixo para confirmar a sua reserva',
      sec1: 'Seleção da Excursão',
      sec2: 'Dados do Passageiro',
      sec3: 'Observações Adicionais',
      tourLabel: 'Escolha a Excursão',
      paxLabel: 'Número de Passageiros',
      nameLabel: 'Nome Completo',
      namePh: 'O seu nome completo',
      emailLabel: 'Email',
      emailPh: 'seu@email.com',
      phoneLabel: 'Telefone',
      phonePh: '+351 ...',
      notesLabel: 'Pedidos Especiais',
      notesPh: 'Restrições alimentares, mobilidade, ponto de embarque...',
      cta: 'Confirmar Reserva',
      successIcon: '✓',
      successTitle: 'Reserva Recebida!',
      successText: 'Obrigado! Entraremos em contacto em até 24 horas para confirmar a sua reserva.'
    };

    return `
      <div class="modal-overlay" id="${m.id}" onclick="closeModalOutside(event,'${m.id}')">
        <div class="modal-box modal-contract">
          <button class="modal-contract__close" onclick="closeModal('${m.id}')" aria-label="Fechar">✕</button>
          <div class="modal-contract__form">
            <div class="modal-contract__header">
              <div class="modal-contract__header-eyebrow">${L.eyebrow}</div>
              <h3 class="modal-contract__header-title">${L.title}</h3>
              <p class="modal-contract__header-subtitle">${L.subtitle}</p>
            </div>

            <div class="modal-contract__section">
              <div class="modal-contract__section-title">
                <span class="modal-contract__section-num">1</span>
                ${L.sec1}
              </div>
              <div class="modal-contract__field">
                <label class="modal-contract__field-label">${L.tourLabel}</label>
                <select id="reserva-tour" class="modal-contract__field-select">
                  <option value="">${isEn ? '— Select —' : '— Selecionar —'}</option>
                  ${tourOptions}
                </select>
              </div>
              <div class="modal-contract__field">
                <label class="modal-contract__field-label">${L.paxLabel}</label>
                <input type="number" id="reserva-pax" class="modal-contract__field-input" min="1" max="50" value="1">
              </div>
            </div>

            <div class="modal-contract__section">
              <div class="modal-contract__section-title">
                <span class="modal-contract__section-num">2</span>
                ${L.sec2}
              </div>
              <div class="modal-contract__field">
                <label class="modal-contract__field-label">${L.nameLabel}</label>
                <input type="text" id="reserva-nome" class="modal-contract__field-input" placeholder="${L.namePh}">
              </div>
              <div class="modal-contract__field-row">
                <div class="modal-contract__field">
                  <label class="modal-contract__field-label">${L.emailLabel}</label>
                  <input type="email" id="reserva-email" class="modal-contract__field-input" placeholder="${L.emailPh}">
                </div>
                <div class="modal-contract__field">
                  <label class="modal-contract__field-label">${L.phoneLabel}</label>
                  <input type="tel" id="reserva-telefone" class="modal-contract__field-input" placeholder="${L.phonePh}">
                </div>
              </div>
            </div>

            <div class="modal-contract__section">
              <div class="modal-contract__section-title">
                <span class="modal-contract__section-num">3</span>
                ${L.sec3}
              </div>
              <div class="modal-contract__field">
                <label class="modal-contract__field-label">${L.notesLabel}</label>
                <textarea id="reserva-notas" class="modal-contract__field-textarea" placeholder="${L.notesPh}" rows="3"></textarea>
              </div>
            </div>
          </div>

          <div class="modal-contract__footer">
            <button class="modal-contract__cta" id="btn-submit-${m.id}" onclick="submitReservation('${m.id}', '${L.successIcon}', '${L.successTitle}', '${L.successText}')">
              ${L.cta} <span class="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // === OUTROS FORMULÁRIOS (contactos, etc.) — Manter layout antigo ===
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
        <button class="btn-submit" style="width:100%" id="btn-submit-${m.id}" onclick="submitForm('${m.id}')" data-pt="${m.textoBotao}" data-en="${m.textoBotaoEn || m.textoBotao}">${textoBotao}</button>
        <p id="form-success-${m.id}" style="margin-top:16px;color:#2d7a3a;font-weight:600;display:none;text-align:center"></p>
      </div>
    </div>
  `;
}

// Submete a reserva (envia para Web3Forms como antes mas com os novos campos)
function submitReservation(modalId, successIcon, successTitle, successText) {
  const tourSel = document.getElementById('reserva-tour');
  const tour = tourSel?.value || '';
  const tourName = tourSel?.selectedOptions?.[0]?.text?.split(' — ')[0] || tour;
  const pax = document.getElementById('reserva-pax')?.value || '1';
  const nome = document.getElementById('reserva-nome')?.value || '';
  const email = document.getElementById('reserva-email')?.value || '';
  const telefone = document.getElementById('reserva-telefone')?.value || '';
  const notas = document.getElementById('reserva-notas')?.value || '';

  if (!tour || !nome || !email) {
    alert(SITE.lang === 'en' ? 'Please fill in tour, name and email.' : 'Preencha excursão, nome e email.');
    return;
  }

  // Reutiliza o endpoint /api/submit (Web3Forms proxy)
  fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: SITE.lang === 'en' ? `New Reservation: ${tourName}` : `Nova Reserva: ${tourName}`,
      from_name: 'Cipritravel Website',
      tour: tourName,
      passageiros: pax,
      nome: nome,
      email: email,
      telefone: telefone,
      notas: notas,
      _subject: SITE.lang === 'en' ? `Reservation: ${tourName} (${pax} pax)` : `Reserva: ${tourName} (${pax} pax)`
    })
  }).then(r => r.json()).then(data => {
    if (data.success !== false) {
      const modalBox = document.querySelector(`#${modalId} .modal-contract`);
      if (modalBox) {
        modalBox.innerHTML = `
          <div class="modal-contract__success">
            <div class="modal-contract__success-icon">${successIcon}</div>
            <h3 class="modal-contract__success-title">${successTitle}</h3>
            <p class="modal-contract__success-text">${successText}</p>
          </div>
        `;
      }
    } else {
      alert(data.message || (SITE.lang === 'en' ? 'Error submitting. Try again.' : 'Erro ao enviar. Tente novamente.'));
    }
  }).catch(err => {
    console.error('Reservation error:', err);
    alert(SITE.lang === 'en' ? 'Network error. Try again.' : 'Erro de rede. Tente novamente.');
  });
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

  // Atualiza botões PT/EN minimalistas (desktop + mobile)
  ['lang-pt', 'lang-pt-m'].forEach(id => {
    document.getElementById(id)?.classList.toggle('active', lang === 'pt');
  });
  ['lang-en', 'lang-en-m'].forEach(id => {
    document.getElementById(id)?.classList.toggle('active', lang === 'en');
  });

  // Compatibilidade com botões antigos (caso ainda existam)
  document.querySelectorAll('.lang-toggle').forEach(toggle => {
    toggle.classList.toggle('is-en', lang === 'en');
    toggle.setAttribute('aria-label', lang === 'en' ? 'Switch to Portuguese' : 'Switch to English');
  });
  document.getElementById('btn-pt')?.classList.toggle('active', lang === 'pt');
  document.getElementById('btn-en')?.classList.toggle('active', lang === 'en');
  document.getElementById('btn-pt-m')?.classList.toggle('active', lang === 'pt');
  document.getElementById('btn-en-m')?.classList.toggle('active', lang === 'en');
}

// Toggle PT/EN: alterna entre os dois idiomas
function toggleLang() {
  setLang(SITE.lang === 'pt' ? 'en' : 'pt');
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
  // Não mexer no innerHTML — o CSS mostra/esconde os spans .theme-icon__sun e __moon
  // automaticamente conforme body.dark
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
// IMPORTANTE: só aplica reveal a elementos com .reveal-stagger (cards dentro de secções).
// NÃO aplica reveal a <section> — senão secções inteiras ficam invisíveis se o observer falhar.
function setupScrollReveal() {
  // Garante que todas as secções estão sempre visíveis
  document.querySelectorAll('main > section').forEach(el => {
    el.classList.add('visible');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-stagger').forEach(el => el.classList.add('visible'));
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
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  });

  // Só observa cards com reveal-stagger (não secções)
  document.querySelectorAll('.reveal-stagger').forEach(el => observer.observe(el));
}

// ============================================
// PARALLAX EFFECT — reverse (imagem sobe de baixo para cima com scroll)
// Imagem tem 130% da altura do container, move 30% (15% → -15%)
// Sempre cobre o container (sem cortes nas bordas visíveis)
// ============================================
function setupParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax-reverse]');
  if (!parallaxEls.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function update() {
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom > -200 && rect.top < windowHeight + 200) {
        // Progress: 0 quando a secção ainda está abaixo do viewport, 1 quando está centrada
        const visibleProgress = Math.max(0, Math.min(1,
          (windowHeight - rect.top) / (windowHeight + rect.height)
        ));

        // Imagem 130% do container, top: -15%
        // Começa translateY(15%) — imagem em baixo (parte inferior visível)
        // Termina translateY(-15%) — imagem subiu (parte superior visível)
        // Durante todo o movimento, a imagem cobre o container (sem cortes)
        const startOffset = 15;
        const endOffset = -15;
        const currentOffset = startOffset - (startOffset - endOffset) * visibleProgress;

        const img = el.querySelector('.parallax-showcase__bg');
        if (img) {
          img.style.transform = `translateY(${currentOffset}%)`;
        }
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

  update();
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
