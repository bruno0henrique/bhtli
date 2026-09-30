(function () {
    'use strict';

    var year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    var header = document.querySelector('.site-header');
    function updateHeaderState() {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 96);
    }

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    var modalData = {
    "nexus": {
        "kicker": "Projeto",
        "title": "Nexus Engine",
        "text": "Sistema web de gestão empresarial para reunir dados e rotinas operacionais em uma mesma aplicação.",
        "list": [
            "Módulos de vendas e PDV, estoque, financeiro, clientes e auditoria.",
            "Controle de acesso, histórico de operações e importação de planilhas.",
            "Next.js, React, TypeScript, PostgreSQL/Neon e Drizzle ORM.",
            "Assistência por IA e integrações dependem da configuração e do escopo de cada módulo."
        ]
    },
    "belleland": {
        "kicker": "Projeto",
        "title": "Belleland Closet",
        "text": "Catálogo digital de roupas com experiência voltada ao celular e administração de produtos e vitrines.",
        "list": [
            "Gestão de categorias, promoções, imagens e produtos publicados.",
            "Autenticação, banco de dados e armazenamento com Supabase.",
            "Integração para captura de publicações e sugestões de cadastro por IA, com revisão humana.",
            "Next.js, React, TypeScript e Python na captura de publicações; contato via WhatsApp, sem pagamento no site."
        ]
    },
    "flow": {
        "kicker": "Projeto",
        "title": "Aldenn Flow",
        "text": "Plataforma para acompanhar projetos e organizar o trabalho em sprints, tarefas e demandas.",
        "list": [
            "Perfis de acesso, histórico de alterações e acompanhamento de progresso.",
            "Organização de demandas, sprints e roadmap por projeto.",
            "Next.js, React, TypeScript e PostgreSQL/Supabase.",
            "Interpretação estruturada opcional por IA; integrações externas dependem de configuração."
        ]
    },
    "synapse": {
        "kicker": "Em desenvolvimento",
        "title": "Synapse IA",
        "text": "Aplicação para organizar ideias em mapas visuais e expandir raciocínios com sugestões contextuais de IA.",
        "list": [
            "Criação e movimentação de ideias, conexões e navegação com zoom.",
            "Projetos separados, estatísticas e persistência dos mapas.",
            "React, TypeScript, Vite, Neon/PostgreSQL, Clerk e Gemini.",
            "A variante Synapse for Mars explora uma apresentação corporativa; integrações corporativas planejadas não representam implantação oficial na empresa."
        ]
    },
    "nexo": {
        "kicker": "Projeto",
        "title": "Nexo Produção",
        "text": "Aplicação para organizar equipes de produção e acompanhar alterações nas alocações.",
        "list": [
            "Registro de faltas, substituições e histórico de alocação.",
            "Next.js, React, TypeScript, Drizzle e Neon/PostgreSQL.",
            "Modo de demonstração no navegador quando o banco não está configurado."
        ]
    },
    "sheets": {
        "kicker": "Projeto",
        "title": "Synapse Sheets",
        "text": "Aplicação de aprendizado de planilhas com prática orientada e acompanhamento de progresso.",
        "list": [
            "Exercícios, dicas e validação de respostas em uma área de planilha.",
            "Autenticação e registro de progresso por usuário.",
            "React, TypeScript, Vite, Neon/PostgreSQL e Drizzle.",
            "Ambiente próprio de exercícios; não é uma integração com o Microsoft Excel."
        ]
    },
    "aldenn-sites": {
        "kicker": "Sites e demonstrações",
        "title": "Aldenn e vitrines digitais",
        "text": "Projetos de apresentação de serviços, qualificação de contatos e catálogos para diferentes segmentos.",
        "list": [
            "Aldenn: site institucional, Direcionador e módulo de propostas comerciais.",
            "Aldenn Imóveis: demonstração de catálogo, filtros, galerias e busca assistida por IA.",
            "Taeko Noivas, Maison Amora e FF Moda Festa: apresentações e vitrines demonstrativas.",
            "Interfaces responsivas com React, Next.js e TypeScript; integrações e persistência conforme o projeto.",
            "Modelos demonstrativos não representam contratação ou implantação comercial confirmada."
        ]
    },
    "pokedex": {
        "kicker": "Estudo",
        "title": "Pokédex",
        "text": "Projeto de estudo que apresenta dados de Pokémon consumindo a PokéAPI.",
        "list": [
            "HTML, CSS e JavaScript.",
            "Requisições com fetch e tratamento assíncrono com promises.",
            "Apresentação de nomes, tipos e imagens a partir da API."
        ]
    },
    "portfolio": {
        "kicker": "Projeto",
        "title": "Portfólio bhsti.online",
        "text": "Site pessoal que reúne projetos, formação e experiência, com foco em desenvolvimento Full Stack Júnior.",
        "list": [
            "HTML, CSS e JavaScript, com layout responsivo.",
            "Detalhes dos projetos em janelas acessíveis pelo mouse e teclado.",
            "Conteúdo alinhado ao currículo e às competências confirmadas."
        ]
    },
    "ifsp": {
        "kicker": "Formação",
        "title": "Técnico em Administração integrado ao Ensino Médio",
        "text": "Formação técnica pelo IFSP, concluída entre janeiro de 2016 e dezembro de 2018.",
        "list": [
            "Base em administração, organização e rotina de trabalho.",
            "Comunicação e visão de processos.",
            "Curso complementar de Office Avançado pelo IFSP."
        ]
    },
    "ads": {
        "kicker": "Formação em andamento",
        "title": "Análise e Desenvolvimento de Sistemas",
        "text": "Graduação pela Universidade Anhembi Morumbi - SJC, iniciada em julho de 2023, com conclusão prevista para dezembro de 2026.",
        "list": [
            "Programação e lógica de desenvolvimento.",
            "Banco de dados e fundamentos de sistemas.",
            "Aplicação dos estudos em projetos de sistemas web."
        ]
    },
    "tech-studies": {
        "kicker": "Estudos",
        "title": "Projetos e estudos em tecnologia",
        "text": "Aprendizado por meio de projetos de aplicações, integração de serviços e organização de dados.",
        "list": [
            "Foco em Python, lógica de programação e SQL.",
            "Conhecimentos básicos de HTML, CSS, JavaScript e TypeScript.",
            "React, Next.js, Neon e Supabase utilizados nos projetos.",
            "Curso complementar de Java e QA pela Ultima School."
        ]
    },
    "vetcia": {
        "kicker": "Experiência profissional",
        "title": "Operador de Produção - Vet&CIA",
        "text": "Atuação entre abril de 2020 e junho de 2023 em operação produtiva e organização das atividades da equipe.",
        "list": [
            "Atuação direta na operação.",
            "Apoio à liderança como backup.",
            "Responsabilidades de coordenação e acompanhamento da equipe."
        ]
    },
    "mars": {
        "kicker": "Experiência profissional",
        "title": "Operador de Produção - MARS Brasil",
        "text": "Atuação desde junho de 2023 em ambiente produtivo, com apoio à liderança e colaboração com a equipe.",
        "list": [
            "Criação e atualização de planilhas para acompanhamento de dados operacionais.",
            "Participação em rotinas de melhoria contínua, 5S e Kaizen.",
            "Organização de processos e análise de problemas na rotina de produção."
        ]
    },
    "skill-programming": {
        "kicker": "Competência",
        "title": "Programação",
        "text": "Python e lógica de programação são meus pontos mais fortes. Estou ampliando minha base em desenvolvimento web.",
        "list": [
            "Foco em Python e resolução de problemas por meio de lógica.",
            "Conhecimentos básicos de HTML, CSS, JavaScript e TypeScript.",
            "Contato com React e Next.js nos projetos, sem atribuir domínio avançado desses frameworks."
        ]
    },
    "skill-data": {
        "kicker": "Competência",
        "title": "Dados e SQL",
        "text": "Vivência com bancos de dados SQL e integração de aplicações com persistência de dados.",
        "list": [
            "SQL e organização dos dados utilizados pelas aplicações.",
            "PostgreSQL, Neon e Supabase utilizados nos projetos.",
            "Conexão entre as interfaces, os serviços e o banco de dados."
        ]
    },
    "skill-profile": {
        "kicker": "Competência",
        "title": "Perfil profissional",
        "text": "Minha experiência em produção contribui para a forma como organizo o trabalho e analiso problemas.",
        "list": [
            "Comunicação, colaboração em equipe e apoio à liderança.",
            "Atenção aos detalhes, organização e aprendizado de ferramentas.",
            "Melhoria contínua, 5S e Kaizen na experiência profissional."
        ]
    },
    "skill-integration": {
        "kicker": "Competência",
        "title": "Integrações e automação",
        "text": "Integrações de aplicativos, bancos de dados SQL e ferramentas de automação fazem parte da minha prática.",
        "list": [
            "Conexão entre aplicativos e serviços.",
            "Integração com bancos de dados e organização de fluxos.",
            "Contato com APIs externas e recursos de IA nos projetos."
        ]
    }
};

    var modal = document.getElementById('detailModal');
    var modalKicker = document.getElementById('modalKicker');
    var modalTitle = document.getElementById('modalTitle');
    var modalText = document.getElementById('modalText');
    var modalList = document.getElementById('modalList');
    var modalClose = document.querySelector('.modal-close');
    var modalTrigger = null;

    function closeModal() {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        modal.inert = true;
        if (modalTrigger) modalTrigger.focus({ preventScroll: true });
    }

    function openModal(id) {
        var item = modalData[id];
        if (!item || !modal) return;
        modalTrigger = document.activeElement;
        modal.inert = false;
        modalKicker.textContent = item.kicker;
        modalTitle.textContent = item.title;
        modalText.textContent = item.text;
        modalList.replaceChildren();
        item.list.forEach(function (line) {
            var entry = document.createElement('li');
            entry.textContent = line;
            modalList.appendChild(entry);
        });
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (modalClose) modalClose.focus();
    }

    document.querySelectorAll('[data-modal]').forEach(function (card) {
        card.addEventListener('click', function () {
            openModal(card.dataset.modal);
        });
        card.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(card.dataset.modal);
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeModal();
        if (event.key === 'Tab' && modal && modal.classList.contains('is-open')) {
            event.preventDefault();
            if (modalClose) modalClose.focus();
        }
    });

    var navLinks = document.querySelectorAll('.site-nav a');
    if ('IntersectionObserver' in window) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (link) {
                    if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
        document.querySelectorAll('#projetos, #trajetoria, #competencias, #contato').forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    var revealItems = document.querySelectorAll('.project-card, .timeline-card, .skill-group');
    revealItems.forEach(function (item) {
        item.classList.add('reveal');
    });

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach(function (item) {
            item.classList.add('is-visible');
        });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
        observer.observe(item);
    });
})();
