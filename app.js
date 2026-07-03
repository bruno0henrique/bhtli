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
        pdv: {
            kicker: 'Projeto',
            title: 'PDV Mercadinho',
            text: 'Sistema de frente de caixa pensado para pequenos mercados. A ideia é deixar a rotina de venda mais direta, com organização de produtos e apoio ao controle operacional.',
            list: [
                'Fluxo de venda simples para o operador.',
                'Organização de produtos e informações principais.',
                'Base para evoluir controle, gestão e relatórios.'
            ]
        },
        terradata: {
            kicker: 'Projeto',
            title: 'Terradata',
            text: 'Projeto voltado para organizar dados territoriais e facilitar a leitura de informações em um formato mais prático.',
            list: [
                'Estrutura para consulta e organização de dados.',
                'Foco em clareza, filtros e leitura rápida.',
                'Área reservada para evolução do estudo.'
            ]
        },
        nexus: {
            kicker: 'Projeto',
            title: 'Nexus Engine',
            text: 'Estudo de uma base para conectar regras, fluxos e partes de uma aplicação de forma mais organizada.',
            list: [
                'Organização de lógica e responsabilidades.',
                'Pensado para reaproveitar partes do sistema.',
                'Projeto em desenvolvimento para estudar arquitetura.'
            ]
        },
        portfolio: {
            kicker: 'Projeto',
            title: 'Portfólio bhsti.online',
            text: 'Site pessoal criado para reunir projetos, estudos, competências e trajetória em um só lugar.',
            list: [
                'Estrutura em HTML, CSS e JavaScript.',
                'Visual escuro com destaque em laranja.',
                'Conteúdo organizado para mostrar evolução profissional.'
            ]
        },
        ifsp: {
            kicker: 'Formação',
            title: 'Administração integrada ao Ensino Médio',
            text: 'Formação técnica pelo IFSP, com base em rotina administrativa, organização e visão de processos.',
            list: [
                'Noções de administração e atividades administrativas.',
                'Organização, comunicação e rotina de trabalho.',
                'Base importante para lidar com processos e equipe.'
            ]
        },
        ads: {
            kicker: 'Formação',
            title: 'Análise e Desenvolvimento de Sistemas',
            text: 'Graduação pela Universidade Anhembi Morumbi - SJC, com foco em desenvolvimento de sistemas e fundamentos de tecnologia.',
            list: [
                'Programação e lógica de desenvolvimento.',
                'Banco de dados, web e fundamentos de sistemas.',
                'Contato com metodologia ágil e resolução de problemas.'
            ]
        },
        'tech-studies': {
            kicker: 'Estudos',
            title: 'Projetos e estudos em tecnologia',
            text: 'Estudos práticos para evoluir na área de tecnologia, ligando teoria, projetos próprios e rotina de aprendizado.',
            list: [
                'Java, Python e C/C++.',
                'HTML, CSS e JavaScript.',
                'Aplicações web, organização de projetos e boas práticas.'
            ]
        },
        vetcia: {
            kicker: 'Trabalho',
            title: 'Operador de Produção - Vet&CIA',
            text: 'Experiência em operação produtiva, com apoio à liderança e acompanhamento de rotina com responsabilidade de equipe.',
            list: [
                'Atuação direta na operação.',
                'Apoio à liderança como backup.',
                'Organização de rotina e acompanhamento de equipe.'
            ]
        },
        mars: {
            kicker: 'Trabalho',
            title: 'Auxiliar de Produção - MARS Brasil',
            text: 'Atuação na área produtiva com contato com melhoria contínua, SAP GUI, 5S e Kaizen.',
            list: [
                'Uso de SAP GUI na rotina de trabalho.',
                'Treinamentos em 5S, Kaizen e melhoria contínua.',
                'Vivência com trabalho em equipe e relações humanas.'
            ]
        },
        'skill-programming': {
            kicker: 'Competência',
            title: 'Programação',
            text: 'Conhecimentos em linguagens e base de desenvolvimento para criar e entender sistemas.',
            list: [
                'Java, Python e C/C++.',
                'HTML, CSS e JavaScript.',
                'Lógica, estrutura de código e prática com projetos.'
            ]
        },
        'skill-process': {
            kicker: 'Competência',
            title: 'Processos',
            text: 'Vivência com ferramentas e práticas usadas em ambiente produtivo e administrativo.',
            list: [
                'SAP GUI e pacote Office.',
                '5S, Kaizen e melhoria contínua.',
                'Análise de problemas e organização de rotina.'
            ]
        },
        'skill-profile': {
            kicker: 'Competência',
            title: 'Perfil profissional',
            text: 'Pontos que levo para o dia a dia de trabalho e para projetos em equipe.',
            list: [
                'Boa comunicação e trabalho em equipe.',
                'Aprendizado rápido e atenção a detalhes.',
                'Responsabilidade, organização e vontade de evoluir.'
            ]
        },
        'skill-english': {
            kicker: 'Competência',
            title: 'Inglês',
            text: 'Conhecimento em desenvolvimento, principalmente para leitura e contato com materiais técnicos.',
            list: [
                'Leitura de conteúdos e documentações.',
                'Escrita em evolução.',
                'Comunicação básica em desenvolvimento.'
            ]
        }
    };

    var modal = document.getElementById('detailModal');
    var modalKicker = document.getElementById('modalKicker');
    var modalTitle = document.getElementById('modalTitle');
    var modalText = document.getElementById('modalText');
    var modalList = document.getElementById('modalList');
    var modalClose = document.querySelector('.modal-close');

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function openModal(id) {
        var item = modalData[id];
        if (!item || !modal) return;
        modalKicker.textContent = item.kicker;
        modalTitle.textContent = item.title;
        modalText.textContent = item.text;
        modalList.innerHTML = item.list.map(function (line) {
            return '<li>' + line + '</li>';
        }).join('');
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
    });

    var revealItems = document.querySelectorAll('.intro-section, .section-band, .project-card, .timeline-card, .skill-group');
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
