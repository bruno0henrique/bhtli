/* ==========================================================================
   MOTION ENGINE & DATA BINDING - APP.JS (bhsti.online Premium Portfolio)
   ========================================================================== */

(function () {
    'use strict';

    // ===== CONSTANTS & STATE =====
    const STORAGE_KEY_CREDS = 'bhsti_supabase_credentials';
    const PASSWORD_ADMIN = '0410'; // Feature parity with original site password

    let supabase = null;
    let isEditMode = false;

    // Local fallback data to guarantee visual excellence out of the box
    let fallbackData = {
        projetos: [
            { id: 1, titulo: 'ActiveGym / IronPulse', descricao: 'Plataforma robusta para gestão de academias, matrículas, treinos personalizados, agendamento de aulas e acompanhamento físico com dashboards analíticos em tempo real.', icone: 'ph-barbell', link_projeto: '#', accent: 'orange', tags: 'Flutter, Firebase, Web & Mobile' },
            { id: 2, titulo: 'NexusERP', descricao: 'Sistema empresarial e frente de caixa (PDV) com gestão integrada de estoque com alertas, fluxo de caixa unificado e relatórios analíticos de faturamento rápidos.', icone: 'ph-storefront', link_projeto: '#', accent: 'cyan', tags: 'HTML5/JS, Supabase, Tailwind' },
            { id: 3, titulo: 'MindFlow', descricao: 'Ambiente criativo infinito em tela (Infinite Canvas) para mapeamento mental, encadeamento de ideias, anotações rápidas e conexões de fluxos corporativos em equipe.', icone: 'ph-brain', link_projeto: '#', accent: 'purple', tags: 'React, NodeJS, Canvas API' }
        ],
        cronograma: [
            { id: 1, categoria: 'Experiências', badge: 'Atual', tipo_badge: 'primary', titulo: 'Desenvolvedor Flutter & Firebase', subtitulo_empresa: 'Sistemas Web & Mobile', detalhes: 'Especialista na criação de soluções escaláveis utilizando Flutter para o frontend e Firebase para infraestrutura serverless, autenticação e banco de dados em tempo real.' },
            { id: 2, categoria: 'Experiências', badge: 'Anterior', tipo_badge: 'secondary', titulo: 'Profissional Industrial', subtitulo_empresa: 'Mars Wrigley', detalhes: 'Otimização de processos produtivos, atuação em linhas de produção de alta performance e projetos Kaizen seguindo metodologias ágeis de melhoria contínua.' },
            { id: 3, categoria: 'Estudos', badge: 'Estudos', tipo_badge: 'primary', titulo: 'Modelagem 3D & Projetos Mecânicos', subtitulo_empresa: 'Onshape, CATIA & AutoCAD', detalhes: 'Desenvolvimento de desenhos técnicos detalhados e peças industriais complexas tridimensionais (como raspadores de alto desgaste).' },
            { id: 4, categoria: 'Formação', badge: 'Graduação', tipo_badge: 'primary', titulo: 'Análise e Desenvolvimento de Sistemas', subtitulo_empresa: 'Ensino Superior', detalhes: 'Formação estruturada com foco em arquitetura de software, banco de dados relacionais e não relacionais, metodologias ágeis de entrega contínua.' }
        ],
        habilidades: [
            { id: 1, titulo: 'Frontend', tags: ['Flutter', 'HTML5', 'CSS3', 'JavaScript'] },
            { id: 2, titulo: 'Backend & Ferramentas', tags: ['Firebase', 'Supabase', 'Git & GitHub', 'NodeJS'] },
            { id: 3, titulo: 'Engenharia & 3D', tags: ['Onshape', 'CATIA', 'AutoCAD', 'Desenho Técnico'] }
        ]
    };

    // Available icons for picker
    const AVAILABLE_ICONS = [
        'ph-barbell', 'ph-storefront', 'ph-brain', 'ph-squares-four', 'ph-briefcase',
        'ph-graduation-cap', 'ph-lightning', 'ph-code', 'ph-database', 'ph-globe',
        'ph-app-window', 'ph-rocket', 'ph-gear', 'ph-chart-line', 'ph-shield-check',
        'ph-users', 'ph-calendar', 'ph-chat-circle-text', 'ph-image', 'ph-terminal',
        'ph-cpu', 'ph-device-mobile', 'ph-paint-brush', 'ph-wrench', 'ph-heart', 'ph-star'
    ];

    // ===== DOM REFERENCES =====
    const customCursor = document.getElementById('customCursor');
    const customCursorFollower = document.getElementById('customCursorFollower');
    const heroCanvas = document.getElementById('heroCanvas');
    const navbar = document.getElementById('navbar');
    
    // Tracks & Lists
    const projectsTrack = document.getElementById('projectsTrack');
    const experienceList = document.getElementById('experienceList');
    const educationList = document.getElementById('educationList');
    const skillsGrid = document.getElementById('skillsGrid');
    
    // Drawer
    const adminDrawer = document.getElementById('adminDrawer');
    const adminToggleBtn = document.getElementById('adminToggleBtn');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const saveDbCredentialsBtn = document.getElementById('saveDbCredentialsBtn');
    const enterAdminModeBtn = document.getElementById('enterAdminModeBtn');
    const exitAdminModeBtn = document.getElementById('exitAdminModeBtn');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const addTimelineBtn = document.getElementById('addTimelineBtn');
    const addSkillGroupBtn = document.getElementById('addSkillGroupBtn');
    const adminControlsContainer = document.getElementById('adminControlsContainer');
    
    // Form Inputs
    const supabaseUrlInput = document.getElementById('supabaseUrlInput');
    const supabaseKeyInput = document.getElementById('supabaseKeyInput');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    
    // Overlays
    const modalOverlay = document.getElementById('modalOverlay');
    const toastContainer = document.getElementById('toastContainer');

    // ===== INITIALIZATION =====
    document.addEventListener('DOMContentLoaded', () => {
        setupCustomCursor();
        initLenisWithGSAP();
        initHeroCanvasParticles();
        loadCredentials();
        fetchData();
        setupDrawerEvents();
        setupHeroReveal();
    });

    // ===== 1. LENIS SMOOTH SCROLL & GSAP SYNC =====
    let lenisInstance = null;

    function initLenisWithGSAP() {
        gsap.registerPlugin(ScrollTrigger);

        // Initialize Lenis
        lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing premium
            smoothWheel: true,
            smoothTouch: false
        });

        // Sync ScrollTrigger on scroll
        lenisInstance.on('scroll', ScrollTrigger.update);

        // Feed Lenis loop to GSAP ticker
        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Navbar Hide/Show on Scroll
        let lastScrollY = 0;
        lenisInstance.on('scroll', (e) => {
            if (e.scroll > 100) {
                if (e.scroll > lastScrollY) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.backgroundColor = 'rgba(7, 7, 9, 0.85)';
                }
            } else {
                navbar.style.transform = 'translateY(0)';
                navbar.style.backgroundColor = 'rgba(7, 7, 9, 0.6)';
            }
            lastScrollY = e.scroll;
        });
    }

    // ===== 2. HERO PARTICLES MESH CANVAS =====
    function initHeroCanvasParticles() {
        if (!heroCanvas) return;
        const ctx = heroCanvas.getContext('2d');
        let width = heroCanvas.width = window.innerWidth;
        let height = heroCanvas.height = window.innerHeight;

        let particles = [];
        let mouse = { x: null, y: null, radius: 180 };

        window.addEventListener('resize', () => {
            width = heroCanvas.width = window.innerWidth;
            height = heroCanvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.baseRadius = Math.random() * 2 + 1;
                this.radius = this.baseRadius;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 69, 0, 0.35)'; // Orange translucent
                ctx.fill();
            }

            update() {
                // Bounds collision
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction (gravity attraction field)
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        let force = (mouse.radius - dist) / mouse.radius;
                        this.x -= dx * force * 0.03;
                        this.y -= dy * force * 0.03;
                        this.radius = this.baseRadius * (1 + force * 1.5);
                    } else {
                        this.radius = this.baseRadius;
                    }
                }
            }
        }

        // Initialize particles based on screen resolution
        const count = Math.min(100, Math.floor((width * height) / 14000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw lines between close particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        let alpha = (100 - dist) / 100 * 0.08;
                        ctx.strokeStyle = `rgba(255, 69, 0, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ===== 3. HERO TEXT REVEAL =====
    function setupHeroReveal() {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

        tl.to('.word-reveal', {
            y: '0%',
            stagger: 0.1,
            delay: 0.2
        })
        .to('.hero-badge, .hero-subtitle, .hero-actions, .scroll-indicator', {
            opacity: 1,
            y: 0,
            stagger: 0.1
        }, '-=0.6');
    }

    // ===== 4. DYNAMIC ACCENT ADAPTATION =====
    function updateAccent(accentType) {
        let root = document.documentElement;
        let spotlight = document.querySelector('.background-spotlight');
        
        let primaryColor;
        if (accentType === 'cyan') {
            root.style.setProperty('--accent', 'var(--accent-cyan)');
            primaryColor = 'hsla(var(--accent-cyan), 0.12)';
        } else if (accentType === 'purple') {
            root.style.setProperty('--accent', 'var(--accent-purple)');
            primaryColor = 'hsla(var(--accent-purple), 0.12)';
        } else {
            root.style.setProperty('--accent', 'var(--accent-orange)');
            primaryColor = 'hsla(var(--accent-orange), 0.12)';
        }

        // Smooth spotlight transformation
        spotlight.style.background = `
            radial-gradient(circle at 10% 20%, hsla(var(--accent-purple), 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, hsla(var(--accent-cyan), 0.07) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, ${primaryColor} 0%, transparent 50%),
            radial-gradient(circle at 50% -10%, ${primaryColor} 0%, transparent 50%)
        `;
    }

    // ===== 5. HORIZONTAL PIN SCROLL ANIMATION =====
    let projectsTrigger = null;

    function initHorizontalScroll() {
        // Kill existing triggers before rebuild to prevent overlap bugs
        if (projectsTrigger) {
            projectsTrigger.kill();
        }

        const track = document.getElementById('projectsTrack');
        if (!track) return;

        // Animate projects horizontal slide
        projectsTrigger = ScrollTrigger.create({
            trigger: '.projects-section-container',
            pin: true,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth + 200}`,
            scrub: 1, // Smooth scrolling catch-up
            invalidateOnRefresh: true, // Perfect for responsive recalculations
            animation: gsap.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth + 80),
                ease: 'none'
            }),
            onUpdate: (self) => {
                // Adaptive spotlight transition based on current active slides
                const progress = self.progress;
                const slides = track.querySelectorAll('.project-slide-card');
                if (slides.length > 1) {
                    const activeIndex = Math.min(slides.length - 1, Math.floor(progress * slides.length));
                    const currentSlide = slides[activeIndex];
                    if (currentSlide) {
                        const accent = currentSlide.getAttribute('data-accent');
                        updateAccent(accent);
                    }
                }
            }
        });

        // Trigger dynamic ScrollTrigger recalculations
        ScrollTrigger.refresh();
    }

    // ===== 6. TIMELINE & SKILLS SCROLL IN EFFECTS =====
    function initScrollInEffects() {
        const cards = gsap.utils.toArray('.animate-scroll-in');
        cards.forEach(card => {
            gsap.fromTo(card, 
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    // ===== 7. CUSTOM MAGNETIC CURSOR =====
    function setupCustomCursor() {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Draw core immediately
            customCursor.style.left = mouseX + 'px';
            customCursor.style.top = mouseY + 'px';
        });

        // Follower smooth lagging ease
        function animateFollower() {
            let dx = mouseX - followerX;
            let dy = mouseY - followerY;
            
            followerX += dx * 0.15;
            followerY += dy * 0.15;

            customCursorFollower.style.left = followerX + 'px';
            customCursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Magnetic element mapping
        function mapCursorInteractions() {
            const targets = document.querySelectorAll('a, button, .project-slide-card, .timeline-card, .skill-pill, .form-input-drawer');
            targets.forEach(target => {
                target.removeEventListener('mouseenter', onMouseEnter);
                target.removeEventListener('mouseleave', onMouseLeave);
                
                target.addEventListener('mouseenter', onMouseEnter);
                target.addEventListener('mouseleave', onMouseLeave);
            });
        }

        function onMouseEnter() {
            document.body.classList.add('cursor-hover');
        }

        function onMouseLeave() {
            document.body.classList.remove('cursor-hover');
        }

        mapCursorInteractions();

        // Re-bind on dynamic rendering modifications
        window.rebindCursorInteractions = mapCursorInteractions;
    }

    // ===== 8. SUPABASE / STATE DATA INTEGRATION =====
    function loadCredentials() {
        const creds = localStorage.getItem(STORAGE_KEY_CREDS);
        if (creds) {
            try {
                const parsed = JSON.parse(creds);
                supabaseUrlInput.value = parsed.url || '';
                supabaseKeyInput.value = parsed.key || '';
                
                if (parsed.url && parsed.key) {
                    supabase = window.supabase.createClient(parsed.url, parsed.key);
                }
            } catch (e) {
                console.error("Erro credenciais", e);
            }
        }
    }

    async function fetchData() {
        if (!supabase) {
            console.warn("Utilizando Fallback Local: Supabase offline");
            renderData(fallbackData);
            return;
        }

        showToast("Conectando ao Supabase...", "ph-cloud");
        try {
            const { data: projetos, error: err1 } = await supabase.from('projetos').select('*').order('id');
            const { data: cronogramas, error: err2 } = await supabase.from('cronograma').select('*').order('id');
            const { data: grupos, error: err3 } = await supabase.from('habilidades_grupos').select('*').order('id');
            const { data: tags, error: err4 } = await supabase.from('habilidades_tags').select('*').order('id');

            if (err1 || err2 || err3 || err4) throw new Error("Erro nas tabelas");

            // Format retrieved data to match layout models
            let data = { projetos: [], cronograma: [], habilidades: [] };
            
            // Format Projects
            const accents = ['orange', 'cyan', 'purple'];
            data.projetos = (projetos || []).map((p, idx) => ({
                id: p.id,
                titulo: p.titulo,
                descricao: p.descricao,
                icone: p.icone || 'ph-app-window',
                link_projeto: p.link_projeto || '#',
                accent: accents[idx % accents.length],
                tags: 'Flutter, Web & Mobile'
            }));

            // Format Timeline
            data.cronograma = (cronogramas || []).map(c => ({
                id: c.id,
                categoria: c.categoria,
                badge: c.badge,
                tipo_badge: c.tipo_badge,
                titulo: c.titulo,
                subtitulo_empresa: c.subtitulo_empresa,
                detalhes: parseJSONDetails(c.detalhes)
            }));

            // Format Skills
            data.habilidades = (grupos || []).map(g => ({
                id: g.id,
                titulo: g.titulo,
                tags: (tags || []).filter(t => t.grupo_id === g.id).map(t => t.tag)
            }));

            renderData(data);
            showToast("Dados sincronizados com sucesso!", "ph-check-circle");
        } catch (e) {
            console.error("Falha no banco Supabase", e);
            showToast("Erro Supabase, carregando local...", "ph-warning");
            renderData(fallbackData);
        }
    }

    function parseJSONDetails(str) {
        try {
            const parsed = JSON.parse(str);
            if (Array.isArray(parsed)) return parsed[0] || '';
            return str;
        } catch(e) { return str; }
    }

    // ===== 9. RENDERING DATA TO VIEWPORTS =====
    function renderData(data) {
        // --- Render Projects ---
        projectsTrack.innerHTML = '';
        data.projetos.forEach((proj) => {
            const card = document.createElement('div');
            card.className = 'project-slide-card animate-scroll-in';
            card.setAttribute('data-accent', proj.accent || 'orange');
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-glow"></div>
                    <div class="card-glass-panel">
                        <div class="card-header-meta">
                            <span class="project-tag">Case Study</span>
                            <div class="project-icon-box ${proj.accent || 'orange'}"><i class="ph ${proj.icone}"></i></div>
                        </div>
                        <h3 class="project-card-title" ${isEditMode ? 'contenteditable="true"' : ''} data-table="projetos" data-field="titulo" data-id="${proj.id}">${escapeHtml(proj.titulo)}</h3>
                        <p class="project-card-desc" ${isEditMode ? 'contenteditable="true"' : ''} data-table="projetos" data-field="descricao" data-id="${proj.id}">${escapeHtml(proj.descricao)}</p>
                        <div class="project-footer">
                            <span class="tech-badge">${escapeHtml(proj.tags || 'Soluções Web')}</span>
                            <a href="${proj.link_projeto}" class="project-link" target="_blank"><i class="ph ph-arrow-up-right"></i></a>
                        </div>
                    </div>
                </div>
            `;

            if (isEditMode) {
                const delBtn = createDeleteBtn();
                delBtn.addEventListener('click', () => confirmDelete('projetos', proj.id));
                card.querySelector('.card-glass-panel').appendChild(delBtn);
                bindLiveEdits(card);
            }

            projectsTrack.appendChild(card);
        });

        // Append the Future Slide at the end
        const futureCard = document.createElement('div');
        futureCard.className = 'project-slide-card animate-scroll-in';
        futureCard.setAttribute('data-accent', 'grey');
        futureCard.innerHTML = `
            <div class="card-inner">
                <div class="card-glow"></div>
                <div class="card-glass-panel future-card">
                    <div class="radar-container">
                        <div class="radar-circle"></div>
                        <div class="radar-line"></div>
                        <div class="radar-blip"></div>
                    </div>
                    <h3 class="project-card-title text-center">Laboratório do Futuro</h3>
                    <p class="project-card-desc text-center">
                        Novos sistemas web inteligentes e aplicações em modelagem 3D industrial estão atualmente na mesa de desenvolvimento.
                    </p>
                    <div class="project-footer justify-center">
                        <span class="loading-text"><i class="ph ph-spinner-gap icon-spin"></i> Compilando novos projetos</span>
                    </div>
                </div>
            </div>
        `;
        projectsTrack.appendChild(futureCard);

        // --- Render Timeline ---
        experienceList.innerHTML = '';
        educationList.innerHTML = '';

        const experiences = data.cronograma.filter(c => c.categoria === 'Experiências');
        const studies = data.cronograma.filter(c => c.categoria !== 'Experiências');

        experiences.forEach(item => {
            experienceList.appendChild(createTimelineCard(item));
        });

        studies.forEach(item => {
            educationList.appendChild(createTimelineCard(item));
        });

        // --- Render Skills ---
        skillsGrid.innerHTML = '';
        data.habilidades.forEach(group => {
            const card = document.createElement('div');
            card.className = 'skill-category-card animate-scroll-in';
            
            let tagHTML = '';
            group.tags.forEach((tag, idx) => {
                tagHTML += `
                    <span class="skill-pill">
                        <span ${isEditMode ? 'contenteditable="true"' : ''} data-table="habilidades_tags" data-field="tag" data-id="${group.id}_${idx}">${escapeHtml(tag)}</span>
                        ${isEditMode ? `<button class="edit-tag-remove" data-id="${group.id}_${idx}"><i class="ph ph-x"></i></button>` : ''}
                    </span>`;
            });

            if (isEditMode) {
                tagHTML += `
                    <button class="skill-pill" style="border-style: dashed; cursor: pointer; color: var(--text-tertiary);" id="addTagTo_${group.id}">
                        <i class="ph ph-plus"></i> Adicionar
                    </button>`;
            }

            card.innerHTML = `
                <h3 class="category-card-title">
                    <i class="ph ph-cpu"></i> 
                    <span ${isEditMode ? 'contenteditable="true"' : ''} data-table="habilidades_grupos" data-field="titulo" data-id="${group.id}">${escapeHtml(group.titulo)}</span>
                </h3>
                <div class="tags-container">${tagHTML}</div>
            `;

            if (isEditMode) {
                bindLiveEdits(card);
                card.querySelector(`#addTagTo_${group.id}`).addEventListener('click', () => addTagToGroup(group.id));
                card.querySelectorAll('.edit-tag-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const compositeId = btn.getAttribute('data-id');
                        removeTagFromGroup(compositeId);
                    });
                });
            }

            skillsGrid.appendChild(card);
        });

        // Re-initialize layouts and scroll hooks
        initHorizontalScroll();
        initScrollInEffects();
        if (window.rebindCursorInteractions) {
            window.rebindCursorInteractions();
        }
    }

    function createTimelineCard(item) {
        const card = document.createElement('div');
        card.className = 'timeline-card animate-scroll-in';
        card.innerHTML = `
            <div class="timeline-header-card">
                <span class="timeline-card-badge ${item.tipo_badge === 'secondary' ? 'badge-grey' : ''}" ${isEditMode ? 'contenteditable="true"' : ''} data-table="cronograma" data-field="badge" data-id="${item.id}">${escapeHtml(item.badge)}</span>
                <h4 class="timeline-card-title" ${isEditMode ? 'contenteditable="true"' : ''} data-table="cronograma" data-field="titulo" data-id="${item.id}">${escapeHtml(item.titulo)}</h4>
                <span class="timeline-card-subtitle" ${isEditMode ? 'contenteditable="true"' : ''} data-table="cronograma" data-field="subtitulo_empresa" data-id="${item.id}">${escapeHtml(item.subtitulo_empresa)}</span>
            </div>
            <p class="timeline-card-desc" ${isEditMode ? 'contenteditable="true"' : ''} data-table="cronograma" data-field="detalhes" data-id="${item.id}">${escapeHtml(item.detalhes)}</p>
        `;

        if (isEditMode) {
            const delBtn = createDeleteBtn();
            delBtn.style.top = '12px';
            delBtn.style.right = '12px';
            delBtn.addEventListener('click', () => confirmDelete('cronograma', item.id));
            card.appendChild(delBtn);
            bindLiveEdits(card);
        }

        return card;
    }

    function createDeleteBtn() {
        const btn = document.createElement('button');
        btn.className = 'edit-delete-btn';
        btn.innerHTML = '<i class="ph ph-trash"></i>';
        return btn;
    }

    // ===== 10. LIVE EDIT MODE DATA BINDING =====
    function bindLiveEdits(container) {
        const fields = container.querySelectorAll('[contenteditable="true"]');
        fields.forEach(field => {
            field.addEventListener('blur', async () => {
                const tabela = field.getAttribute('data-table');
                const campo = field.getAttribute('data-field');
                const id = field.getAttribute('data-id');
                const valor = field.textContent.trim();

                if (!id || (typeof id === 'string' && id.startsWith('local_'))) return;

                showToast("Salvando alteração...", "ph-floppy-disk");

                if (supabase) {
                    try {
                        let payload = {};
                        if (tabela === 'cronograma' && campo === 'detalhes') {
                            payload[campo] = JSON.stringify([valor]);
                        } else {
                            payload[campo] = valor;
                        }

                        const { error } = await supabase.from(tabela).update(payload).eq('id', id);
                        if (error) throw error;
                        showToast("Alteração salva no Supabase!", "ph-check-circle");
                    } catch (e) {
                        console.error(e);
                        showToast("Erro ao salvar no Supabase.", "ph-warning");
                    }
                } else {
                    // Update Local Mock Data
                    updateLocalData(tabela, campo, id, valor);
                    showToast("Alteração salva localmente!", "ph-check-circle");
                }
            });

            field.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey && field.tagName !== 'P') {
                    e.preventDefault();
                    field.blur();
                }
            });
        });
    }

    function updateLocalData(tabela, campo, id, valor) {
        if (tabela === 'projetos') {
            const item = fallbackData.projetos.find(p => p.id == id);
            if (item) item[campo] = valor;
        } else if (tabela === 'cronograma') {
            const item = fallbackData.cronograma.find(c => c.id == id);
            if (item) item[campo] = valor;
        } else if (tabela === 'habilidades_grupos') {
            const item = fallbackData.habilidades.find(h => h.id == id);
            if (item) item[campo] = valor;
        }
    }

    // ===== 11. MODAL SYSTEM IMPLEMENTATION =====
    function showModal(config) {
        let html = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">${escapeHtml(config.title)}</h3>
                    <button class="modal-close" id="modalCloseBtn"><i class="ph ph-x"></i></button>
                </div>
                <div class="modal-body">
        `;

        config.fields.forEach(field => {
            html += `<div class="form-group">`;
            html += `<label class="form-label">${escapeHtml(field.label)}</label>`;

            if (field.type === 'text' || field.type === 'password') {
                html += `<input class="form-input" type="${field.type}" id="field_${field.key}" placeholder="${escapeHtml(field.placeholder || '')}" value="${escapeHtml(field.value || '')}">`;
            } else if (field.type === 'textarea') {
                html += `<textarea class="form-textarea" id="field_${field.key}" placeholder="${escapeHtml(field.placeholder || '')}">${escapeHtml(field.value || '')}</textarea>`;
            } else if (field.type === 'select') {
                html += `<select class="form-select" id="field_${field.key}">`;
                field.options.forEach(opt => {
                    html += `<option value="${escapeHtml(opt.value)}" ${opt.value === field.value ? 'selected' : ''}>${escapeHtml(opt.label)}</option>`;
                });
                html += `</select>`;
            } else if (field.type === 'icon-picker') {
                html += `<div class="icon-picker" id="field_${field.key}">`;
                AVAILABLE_ICONS.forEach(iconName => {
                    html += `<div class="icon-option ${iconName === field.value ? 'selected' : ''}" data-icon="${iconName}"><i class="ph ${iconName}"></i></div>`;
                });
                html += `</div>`;
            }
            html += `</div>`;
        });

        html += `
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="modalCancelBtn">Cancelar</button>
                    <button class="btn btn-primary" id="modalConfirmBtn">${escapeHtml(config.confirmText || 'Confirmar')}</button>
                </div>
            </div>
        `;

        modalOverlay.innerHTML = html;
        modalOverlay.classList.add('visible');

        // Picker interaction hook
        const options = modalOverlay.querySelectorAll('.icon-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                modalOverlay.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            });
        });

        return new Promise((resolve) => {
            const close = () => {
                modalOverlay.classList.remove('visible');
                setTimeout(() => modalOverlay.innerHTML = '', 300);
            };

            document.getElementById('modalCloseBtn').addEventListener('click', () => { close(); resolve(null); });
            document.getElementById('modalCancelBtn').addEventListener('click', () => { close(); resolve(null); });

            document.getElementById('modalConfirmBtn').addEventListener('click', () => {
                let res = {};
                config.fields.forEach(field => {
                    if (field.type === 'icon-picker') {
                        const sel = modalOverlay.querySelector('.icon-option.selected');
                        res[field.key] = sel ? sel.getAttribute('data-icon') : AVAILABLE_ICONS[0];
                    } else {
                        const el = document.getElementById(`field_${field.key}`);
                        res[field.key] = el ? el.value : '';
                    }
                });
                close();
                resolve(res);
            });
        });
    }

    // ===== 12. DYNAMIC CRUD CREATION MODALS =====
    async function createProjectItem() {
        const res = await showModal({
            title: 'Novo Projeto Premium',
            fields: [
                { key: 'titulo', label: 'Título', type: 'text', placeholder: 'Ex: ActiveGym' },
                { key: 'desc', label: 'Descrição Completa', type: 'textarea', placeholder: 'Explique o projeto...' },
                { key: 'icone', label: 'Ícone da Ficha', type: 'icon-picker', value: 'ph-app-window' },
                { key: 'link', label: 'Link do Projeto', type: 'text', placeholder: '#' }
            ],
            confirmText: 'Adicionar'
        });

        if (res && res.titulo) {
            if (supabase) {
                const { error } = await supabase.from('projetos').insert({
                    titulo: res.titulo,
                    descricao: res.desc || '',
                    icone: res.icone || 'ph-app-window',
                    link_projeto: res.link || '#'
                });
                if (!error) fetchData();
            } else {
                fallbackData.projetos.push({
                    id: Date.now(),
                    titulo: res.titulo,
                    descricao: res.desc || '',
                    icone: res.icone || 'ph-app-window',
                    link_projeto: res.link || '#',
                    accent: 'cyan',
                    tags: 'Frontend, Firebase'
                });
                renderData(fallbackData);
            }
        }
    }

    async function createTimelineItem() {
        const res = await showModal({
            title: 'Novo Item de Trajetória',
            fields: [
                {
                    key: 'categoria', label: 'Categoria', type: 'select', value: 'Experiências',
                    options: [{ value: 'Experiências', label: 'Experiência' }, { value: 'Estudos', label: 'Estudo/Formação' }]
                },
                { key: 'badge', label: 'Badge (Tag)', type: 'text', placeholder: 'Ex: Atual, Concluído' },
                {
                    key: 'tipo_badge', label: 'Destacar Badge?', type: 'select', value: 'primary',
                    options: [{ value: 'primary', label: 'Sim (Neon)' }, { value: 'secondary', label: 'Não (Cinza)' }]
                },
                { key: 'titulo', label: 'Título Principal', type: 'text', placeholder: 'Ex: Analista de Sistemas' },
                { key: 'subtitulo', label: 'Subtítulo / Instituição', type: 'text', placeholder: 'Ex: Mars Wrigley' },
                { key: 'detalhes', label: 'Detalhes Descritivos', type: 'textarea', placeholder: 'Atribuições...' }
            ],
            confirmText: 'Adicionar'
        });

        if (res && res.titulo) {
            if (supabase) {
                const { error } = await supabase.from('cronograma').insert({
                    categoria: res.categoria,
                    badge: res.badge || '',
                    tipo_badge: res.tipo_badge,
                    titulo: res.titulo,
                    subtitulo_empresa: res.subtitulo,
                    detalhes: JSON.stringify([res.detalhes || ''])
                });
                if (!error) fetchData();
            } else {
                fallbackData.cronograma.push({
                    id: Date.now(),
                    categoria: res.categoria,
                    badge: res.badge || '',
                    tipo_badge: res.tipo_badge,
                    titulo: res.titulo,
                    subtitulo_empresa: res.subtitulo,
                    detalhes: res.detalhes || ''
                });
                renderData(fallbackData);
            }
        }
    }

    async function createSkillGroup() {
        const res = await showModal({
            title: 'Novo Grupo de Habilidades',
            fields: [
                { key: 'titulo', label: 'Nome da Categoria', type: 'text', placeholder: 'Ex: Banco de Dados' }
            ],
            confirmText: 'Criar'
        });

        if (res && res.titulo) {
            if (supabase) {
                const { error } = await supabase.from('habilidades_grupos').insert({
                    titulo: res.titulo
                });
                if (!error) fetchData();
            } else {
                fallbackData.habilidades.push({
                    id: Date.now(),
                    titulo: res.titulo,
                    tags: ['Nova Habilidade']
                });
                renderData(fallbackData);
            }
        }
    }

    async function addTagToGroup(grupoId) {
        const res = await showModal({
            title: 'Adicionar Tag de Habilidade',
            fields: [
                { key: 'tag', label: 'Nome da Habilidade', type: 'text', placeholder: 'Ex: Git' }
            ],
            confirmText: 'Adicionar'
        });

        if (res && res.tag) {
            if (supabase) {
                const { error } = await supabase.from('habilidades_tags').insert({
                    grupo_id: grupoId,
                    tag: res.tag
                });
                if (!error) fetchData();
            } else {
                const group = fallbackData.habilidades.find(h => h.id == grupoId);
                if (group) group.tags.push(res.tag);
                renderData(fallbackData);
            }
        }
    }

    async function removeTagFromGroup(compositeId) {
        const parts = compositeId.split('_');
        const grupoId = parts[0];
        const idx = parts[1];

        if (supabase) {
            showToast("Buscando e apagando tag...", "ph-trash");
            try {
                // Fetch group tags, find matching index
                const { data: tags } = await supabase.from('habilidades_tags').select('*').eq('grupo_id', grupoId).order('id');
                if (tags && tags[idx]) {
                    await supabase.from('habilidades_tags').delete().eq('id', tags[idx].id);
                    fetchData();
                }
            } catch(e) {}
        } else {
            const group = fallbackData.habilidades.find(h => h.id == grupoId);
            if (group && group.tags[idx]) {
                group.tags.splice(idx, 1);
                renderData(fallbackData);
            }
        }
    }

    async function confirmDelete(tabela, id) {
        const res = await showModal({
            title: 'Excluir Item',
            fields: [
                { key: 'info', label: 'Deseja realmente excluir este item permanentemente?', type: 'select', value: 'não', options: [{value: 'não', label: 'Não'}, {value: 'sim', label: 'Sim (Apagar)'}] }
            ],
            confirmText: 'Confirmar'
        });

        if (res && res.info === 'sim') {
            showToast("Excluindo item...", "ph-trash");
            if (supabase) {
                try {
                    const { error } = await supabase.from(tabela).delete().eq('id', id);
                    if (error) throw error;
                    fetchData();
                } catch(e) {
                    showToast("Erro ao excluir do Supabase", "ph-warning");
                }
            } else {
                if (tabela === 'projetos') fallbackData.projetos = fallbackData.projetos.filter(p => p.id != id);
                if (tabela === 'cronograma') fallbackData.cronograma = fallbackData.cronograma.filter(c => c.id != id);
                renderData(fallbackData);
                showToast("Item excluído localmente", "ph-trash");
            }
        }
    }

    // ===== 13. DRAWER ADMINISTRATIVE EVENT HOOKS =====
    function setupDrawerEvents() {
        const openDrawer = () => adminDrawer.classList.add('visible');
        const closeDrawer = () => adminDrawer.classList.remove('visible');

        adminToggleBtn.addEventListener('click', openDrawer);
        drawerCloseBtn.addEventListener('click', closeDrawer);
        drawerOverlay.addEventListener('click', closeDrawer);

        // Save Supabase Credentials
        saveDbCredentialsBtn.addEventListener('click', () => {
            const url = supabaseUrlInput.value.trim();
            const key = supabaseKeyInput.value.trim();

            if (url && key) {
                localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify({ url, key }));
                supabase = window.supabase.createClient(url, key);
                showToast("Credenciais conectadas!", "ph-check-circle");
                fetchData();
                closeDrawer();
            } else {
                localStorage.removeItem(STORAGE_KEY_CREDS);
                supabase = null;
                showToast("Credenciais limpas. Modo offline.", "ph-info");
                fetchData();
                closeDrawer();
            }
        });

        // Login to Live Visual Editor
        enterAdminModeBtn.addEventListener('click', () => {
            const pass = adminPasswordInput.value.trim();
            if (pass === PASSWORD_ADMIN) {
                isEditMode = true;
                document.body.classList.add('edit-mode-active');
                adminControlsContainer.classList.remove('hide-initially');
                enterAdminModeBtn.style.display = 'none';
                
                showToast("Modo editor ativado! Altere itens diretamente na tela.", "ph-pencil-simple");
                
                // Re-render to load contenteditable targets and buttons
                if (supabase) {
                    fetchData();
                } else {
                    renderData(fallbackData);
                }
                closeDrawer();
            } else {
                showToast("Senha incorreta.", "ph-warning");
            }
        });

        // Exit Visual Editor
        exitAdminModeBtn.addEventListener('click', () => {
            isEditMode = false;
            document.body.classList.remove('edit-mode-active');
            adminControlsContainer.classList.add('hide-initially');
            enterAdminModeBtn.style.display = 'flex';
            adminPasswordInput.value = '';
            
            showToast("Modo editor desativado.", "ph-info");
            
            if (supabase) {
                fetchData();
            } else {
                renderData(fallbackData);
            }
            closeDrawer();
        });

        // Drawer Add Item Clicks
        addProjectBtn.addEventListener('click', () => { closeDrawer(); createProjectItem(); });
        addTimelineBtn.addEventListener('click', () => { closeDrawer(); createTimelineItem(); });
        addSkillGroupBtn.addEventListener('click', () => { closeDrawer(); createSkillGroup(); });
    }

    // ===== 14. DYNAMIC NOTIFICATIONS (TOASTS) =====
    function showToast(message, iconName = 'ph-info') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="ph ${iconName}"></i> ${escapeHtml(message)}`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('leaving');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    function escapeHtml(str) {
        if (!str) return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

})();
