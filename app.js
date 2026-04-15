(function () {
    'use strict';

    // ===== CONSTANTS =====
    const STORAGE_KEY = 'bhlti_portfolio_data';
    const PASSWORD = '0410';

    // ======= CONFIGURAÇÃO SUPABASE ========
    // Substitua pela sua URL e ROLE KEY/ANON KEY reais
    const SUPABASE_URL = 'SUA_URL_SUPABASE'; 
    const SUPABASE_KEY = 'SUA_CHAVE_ANON_SUPABASE';
    let supabase = null;
    try {
        if (SUPABASE_URL.startsWith('http')) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
    } catch(e) {
        console.warn('Supabase não inicializado ou URL inválida.');
    }

    const AVAILABLE_ICONS = [
        'ph-squares-four', 'ph-map-trifold', 'ph-storefront', 'ph-briefcase',
        'ph-graduation-cap', 'ph-lightning', 'ph-code', 'ph-database',
        'ph-globe', 'ph-app-window', 'ph-rocket', 'ph-gear',
        'ph-chart-line', 'ph-shield-check', 'ph-users', 'ph-calendar',
        'ph-chat-circle-text', 'ph-image', 'ph-file-text', 'ph-terminal',
        'ph-cpu', 'ph-device-mobile', 'ph-paint-brush', 'ph-book',
        'ph-certificate', 'ph-truck', 'ph-package', 'ph-wrench',
        'ph-heart', 'ph-star', 'ph-flag', 'ph-house'
    ];

    // ===== UTILITY =====
    function uid() {
        return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    }

    function escapeHtml(str) {
        if(!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Script para enviar os dados estáticos locais para o Supabase (para não perdê-los)
    // Para rodar, digite no console: migrarDadosLocaisParaSupabase()
    window.migrarDadosLocaisParaSupabase = async function() {
        showToast('Iniciando migração dos dados...', 'ph-cloud-arrow-up');
        try {
            // 1. Projetos
            const projetos = [
                {titulo: 'Terradata', descricao: 'Sistema de Gestão Territorial', icone: 'ph-map-trifold', link_projeto: '/terradata/'},
                {titulo: 'PDV Mercadinho', descricao: 'Frente de Caixa e Gestão', icone: 'ph-storefront', link_projeto: '/pdv-mercadinho/'}
            ];
            await supabase.from('projetos').insert(projetos);

            // 2. Cronograma
            const expediencias = [
                {categoria: 'Experiências', badge: 'Atual', tipo_badge: 'primary', titulo: 'Desenvolvedor Flutter & Firebase', subtitulo_empresa: 'Desenvolvimento de sistemas PDV e arquitetura de aplicações web/mobile.', detalhes: JSON.stringify(['Especialista na criação de soluções escaláveis utilizando Flutter para o frontend e Firebase para infraestrutura serverless, autenticação e banco de dados em tempo real.'])},
                {categoria: 'Experiências', badge: 'Anterior', tipo_badge: 'secondary', titulo: 'Profissional Industrial - Mars Wrigley', subtitulo_empresa: 'Atuação em linhas de produção de alta performance e projetos Kaizen.', detalhes: JSON.stringify(['Otimização de processos produtivos e implementação de melhorias contínuas seguindo a metodologia Lean Manufacturing.'])},
                {categoria: 'Estudos', badge: 'Em Andamento', tipo_badge: 'primary', titulo: 'Modelagem 3D e Projetos Mecânicos', subtitulo_empresa: 'Desenvolvimento de peças industriais (como raspadores) utilizando Onshape, CATIA e AutoCAD.', detalhes: JSON.stringify(['Criação de modelos tridimensionais complexos e detalhamento de desenhos técnicos para fabricação industrial.'])},
                {categoria: 'Estudos', badge: 'Em Andamento', tipo_badge: 'primary', titulo: 'Inglês Técnico', subtitulo_empresa: 'Foco em vocabulário corporativo, TI e conversação.', detalhes: JSON.stringify(['Aprimoramento da comunicação em ambientes profissionais internacionais e compreensão de documentações técnicas.'])},
                {categoria: 'Formação', badge: 'Graduação', tipo_badge: 'primary', titulo: 'Análise e Desenvolvimento de Sistemas', subtitulo_empresa: 'Instituição de Ensino Superior', detalhes: JSON.stringify(['Foco em engenharia de software, banco de dados, desenvolvimento web e metodologias ágeis.'])}
            ];
            await supabase.from('cronograma').insert(expediencias);

            // 3. Habilidades Grupos e Tags
            const habFrontend = await supabase.from('habilidades_grupos').insert({titulo: 'Frontend'}).select();
            if(habFrontend.data && habFrontend.data.length > 0) {
                const gId = habFrontend.data[0].id;
                await supabase.from('habilidades_tags').insert([
                    {grupo_id: gId, tag: 'Flutter'},{grupo_id: gId, tag: 'HTML5'},{grupo_id: gId, tag: 'CSS3'},{grupo_id: gId, tag: 'JavaScript'}
                ]);
            }
            
            const habBackend = await supabase.from('habilidades_grupos').insert({titulo: 'Backend & Ferramentas'}).select();
            if(habBackend.data && habBackend.data.length > 0) {
                const gId2 = habBackend.data[0].id;
                await supabase.from('habilidades_tags').insert([
                    {grupo_id: gId2, tag: 'Firebase'},{grupo_id: gId2, tag: 'Git & GitHub'},{grupo_id: gId2, tag: 'Onshape'},{grupo_id: gId2, tag: 'AutoCAD'}
                ]);
            }

            showToast('Migração finalizada! Recarregando...', 'ph-check-circle');
            setTimeout(()=> location.reload(), 2000);
        } catch(e) {
            console.error('Erro na migração', e);
            showToast('Erro ao migrar dados.', 'ph-warning');
        }
    }

    // ===== STATE =====
    let data = {
        version: 2,
        header: { logo: 'bhsti.online', subtitle: 'Sistemas e Aplicações Web' },
        rows: [],
        footer: '© 2026 bhsti.online. Todos os direitos reservados.'
    };
    
    let isEditMode = false;
    let expandedCards = new Set();

    // ===== DOM REFERENCES =====
    const mainContent = document.getElementById('mainContent');
    const footerText = document.getElementById('footerText');
    const customizeBtn = document.getElementById('customizeBtn');
    const adminToolbar = document.getElementById('adminToolbar');
    const modalOverlay = document.getElementById('modalOverlay');
    const toastContainer = document.getElementById('toastContainer');
    const addSectionBtn = document.getElementById('addSectionBtn');
    const saveExitBtn = document.getElementById('saveExitBtn');
    const resetDataBtn = document.getElementById('resetDataBtn');

    // ===== SUPABASE DATA RETRIEVAL =====
    async function fetchFromSupabase() {
        try {
            // Load header/footer state from LocalStorage if customized
            const savedLocal = localStorage.getItem(STORAGE_KEY);
            if(savedLocal) {
                const parsed = JSON.parse(savedLocal);
                if(parsed.header) data.header = parsed.header;
                if(parsed.footer) data.footer = parsed.footer;
            }

            if (!supabase) {
                throw new Error("Supabase não configurado.");
            }

            const { data: projetos } = await supabase.from('projetos').select('*').order('id');
            const { data: cronogramas } = await supabase.from('cronograma').select('*').order('id');
            const { data: grupos } = await supabase.from('habilidades_grupos').select('*').order('id');
            const { data: tags } = await supabase.from('habilidades_tags').select('*').order('id');

            const parseBody = (str) => {
                try {
                    const parsed = JSON.parse(str);
                    if(Array.isArray(parsed)) return parsed;
                    return [str || ''];
                } catch(e) { return [str || '']; }
            };

            const expData = (cronogramas||[]).filter(c => c.categoria === 'Experiências');
            const estData = (cronogramas||[]).filter(c => c.categoria === 'Estudos');
            const formData = (cronogramas||[]).filter(c => c.categoria === 'Formação');
            
            const pGroup = (projetos||[]).map(p => ({
                id: p.id, title: p.titulo, desc: p.descricao, icon: p.icone, link: p.link_projeto
            }));

            const eGroup = expData.map(c => ({
                id: c.id, badge: c.badge, badgeType: c.tipo_badge, title: c.titulo, company: c.subtitulo_empresa, body: parseBody(c.detalhes)
            }));
            const estGroup = estData.map(c => ({
                id: c.id, badge: c.badge, badgeType: c.tipo_badge, title: c.titulo, company: c.subtitulo_empresa, body: parseBody(c.detalhes)
            }));
            const formGroup = formData.map(c => ({
                id: c.id, badge: c.badge, badgeType: c.tipo_badge, title: c.titulo, company: c.subtitulo_empresa, body: parseBody(c.detalhes)
            }));
            
            const gruposMap = (grupos||[]).map(g => ({
                id: g.id,
                title: g.titulo,
                tagsData: (tags||[]).filter(t => t.grupo_id === g.id).map(t => ({id: t.id, tag: t.tag}))
            }));

            // Montar data.rows estruturalmente baseado nos novos dados
            data.rows = [
                {
                    id: 'r_proj', layout: 'full',
                    sections: [{id: 's_proj', tabela: 'projetos', type: 'projects', title: 'Projetos Selecionados', icon: 'ph-squares-four', items: pGroup}]
                },
                {
                    id: 'r_timeline1', layout: 'columns',
                    sections: [
                        {id: 's_exp', tabela: 'cronograma', categoriaRef: 'Experiências', type: 'timeline', title: 'Experiências', icon: 'ph-briefcase', items: eGroup},
                        {id: 's_est', tabela: 'cronograma', categoriaRef: 'Estudos', type: 'timeline', title: 'Estudos', icon: 'ph-graduation-cap', items: estGroup}
                    ]
                },
                {
                    id: 'r_timeline2', layout: 'columns',
                    sections: [
                        {id: 's_form', tabela: 'cronograma', categoriaRef: 'Formação', type: 'timeline', title: 'Formação', icon: 'ph-graduation-cap', items: formGroup},
                        {id: 's_hab', tabela: 'habilidades_grupos', type: 'skills', title: 'Habilidades', icon: 'ph-lightning', groups: gruposMap}
                    ]
                }
            ];

            render();
        } catch(e) {
            console.warn('Falha de conexão Supabase ou não configurado', e);
            if (!supabase) {
                showToast('Aviso: Configure as credenciais do Supabase no app.js', 'ph-warning');
            } else {
                showToast('Erro ao carregar dados do banco.', 'ph-warning');
            }
            
            // Garantir que a estrutura base seja renderizada mesmo se o Supabase falhar/estiver sem credencial
            // Assim a página não fica em branco e o botão admin funciona.
            data.rows = [
                {
                    id: 'r_proj', layout: 'full',
                    sections: [{id: 's_proj', tabela: 'projetos', type: 'projects', title: 'Projetos Selecionados', icon: 'ph-squares-four', items: []}]
                },
                {
                    id: 'r_timeline1', layout: 'columns',
                    sections: [
                        {id: 's_exp', tabela: 'cronograma', categoriaRef: 'Experiências', type: 'timeline', title: 'Experiências', icon: 'ph-briefcase', items: []},
                        {id: 's_est', tabela: 'cronograma', categoriaRef: 'Estudos', type: 'timeline', title: 'Estudos', icon: 'ph-graduation-cap', items: []}
                    ]
                },
                {
                    id: 'r_timeline2', layout: 'columns',
                    sections: [
                        {id: 's_form', tabela: 'cronograma', categoriaRef: 'Formação', type: 'timeline', title: 'Formação', icon: 'ph-graduation-cap', items: []},
                        {id: 's_hab', tabela: 'habilidades_grupos', type: 'skills', title: 'Habilidades', icon: 'ph-lightning', groups: []}
                    ]
                }
            ];
            render();
        }
    }

    // Salvar itens estruturais simples: Footer, Header UI locally
    function saveLocalUIState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            header: data.header,
            footer: data.footer
        }));
    }

    // Atualiza um item individual no Supabase
    async function atualizarCampoGlobal(tabela, id, payload) {
        if(!id || (typeof id === 'string' && id.startsWith('id_'))) return; // Item ainda mockado no local sem bind
        try {
            await supabase.from(tabela).update(payload).eq('id', id);
        } catch(e) { console.error('Erro Update Supabase:', e); }
    }

    // ===== TOAST =====
    function showToast(message, icon) {
        icon = icon || 'ph-info';
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<i class="ph ' + escapeHtml(icon) + '"></i> ' + escapeHtml(message);
        toastContainer.appendChild(toast);

        setTimeout(function () {
            toast.classList.add('leaving');
            setTimeout(function () { toast.remove(); }, 300);
        }, 3000);
    }

    // ===== MODAL SYSTEM =====
    function showModal(config) {
        var html = '<div class="modal">';
        html += '<div class="modal-header">';
        html += '<h3 class="modal-title">' + escapeHtml(config.title) + '</h3>';
        html += '<button class="modal-close" id="modalCloseBtn"><i class="ph ph-x"></i></button>';
        html += '</div>';
        html += '<div class="modal-body">';

        config.fields.forEach(function (field) {
            html += '<div class="form-group">';
            html += '<label class="form-label">' + escapeHtml(field.label) + '</label>';

            if (field.type === 'text' || field.type === 'password') {
                html += '<input class="form-input" type="' + field.type + '" id="field_' + field.key + '" placeholder="' + escapeHtml(field.placeholder || '') + '" value="' + escapeHtml(field.value || '') + '">';
            } else if (field.type === 'textarea') {
                html += '<textarea class="form-textarea" id="field_' + field.key + '" placeholder="' + escapeHtml(field.placeholder || '') + '">' + escapeHtml(field.value || '') + '</textarea>';
            } else if (field.type === 'select') {
                html += '<select class="form-select" id="field_' + field.key + '">';
                field.options.forEach(function (opt) {
                    var selected = opt.value === field.value ? ' selected' : '';
                    html += '<option value="' + escapeHtml(opt.value) + '"' + selected + '>' + escapeHtml(opt.label) + '</option>';
                });
                html += '</select>';
            } else if (field.type === 'icon-picker') {
                html += '<div class="icon-picker" id="field_' + field.key + '">';
                AVAILABLE_ICONS.forEach(function (iconName) {
                    var selectedClass = iconName === field.value ? ' selected' : '';
                    html += '<div class="icon-option' + selectedClass + '" data-icon="' + iconName + '"><i class="ph ' + iconName + '"></i></div>';
                });
                html += '</div>';
            }
            html += '</div>';
        });

        html += '</div>';
        html += '<div class="modal-footer">';
        if (config.cancelText !== false) {
            html += '<button class="btn btn-secondary" id="modalCancelBtn">' + escapeHtml(config.cancelText || 'Cancelar') + '</button>';
        }
        var btnClass = config.dangerConfirm ? 'btn btn-danger' : 'btn btn-primary';
        html += '<button class="' + btnClass + '" id="modalConfirmBtn">' + escapeHtml(config.confirmText || 'Confirmar') + '</button>';
        html += '</div>';
        html += '</div>';

        modalOverlay.innerHTML = html;
        modalOverlay.classList.add('visible');

        var iconPickers = modalOverlay.querySelectorAll('.icon-picker');
        iconPickers.forEach(function (picker) {
            picker.addEventListener('click', function (e) {
                var option = e.target.closest('.icon-option');
                if (!option) return;
                picker.querySelectorAll('.icon-option').forEach(function (o) { o.classList.remove('selected'); });
                option.classList.add('selected');
            });
        });

        var firstInput = modalOverlay.querySelector('.form-input, .form-textarea');
        if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);

        var inputs = modalOverlay.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(function (input) {
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey && input.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    document.getElementById('modalConfirmBtn').click();
                }
            });
        });

        return new Promise(function (resolve) {
            document.getElementById('modalCloseBtn').addEventListener('click', function () {
                hideModal();
                resolve(null);
            });

            if (document.getElementById('modalCancelBtn')) {
                document.getElementById('modalCancelBtn').addEventListener('click', function () {
                    hideModal();
                    resolve(null);
                });
            }

            document.getElementById('modalConfirmBtn').addEventListener('click', function () {
                var result = {};
                config.fields.forEach(function (field) {
                    if (field.type === 'icon-picker') {
                        var selected = document.querySelector('#field_' + field.key + ' .icon-option.selected');
                        result[field.key] = selected ? selected.dataset.icon : field.value || AVAILABLE_ICONS[0];
                    } else {
                        var el = document.getElementById('field_' + field.key);
                        result[field.key] = el ? el.value : '';
                    }
                });
                hideModal();
                resolve(result);
            });

            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) {
                    hideModal();
                    resolve(null);
                }
            });
        });
    }

    function hideModal() {
        modalOverlay.classList.remove('visible');
        setTimeout(function () { modalOverlay.innerHTML = ''; }, 300);
    }

    // ===== RENDERING ENGINE =====
    function render() {
        mainContent.innerHTML = '';
        expandedCards.clear();

        data.rows.forEach(function (row, rowIndex) {
            if (row.layout === 'full') {
                row.sections.forEach(function (section) {
                    var wrapper = document.createElement('div');
                    if (isEditMode) wrapper.className = 'edit-section-wrapper';
                    wrapper.appendChild(renderSection(section, row.id));
                    wrapper.style.animationDelay = (rowIndex * 0.08) + 's';
                    wrapper.classList.add('animate-in');
                    mainContent.appendChild(wrapper);
                });
            } else if (row.layout === 'columns') {
                var grid = document.createElement('div');
                grid.className = 'columns-grid';
                if (isEditMode) grid.classList.add('edit-section-wrapper');
                grid.style.animationDelay = (rowIndex * 0.08) + 's';
                grid.classList.add('animate-in');

                row.sections.forEach(function (section) {
                    grid.appendChild(renderSection(section, row.id));
                });
                mainContent.appendChild(grid);
            }
        });

        // Footer
        footerText.textContent = data.footer;
        if (isEditMode) {
            footerText.contentEditable = 'true';
            footerText.addEventListener('blur', function () {
                data.footer = footerText.textContent.trim();
                saveLocalUIState();
            });
        }

        // Header editability
        var subtitleEl = document.getElementById('subtitle');
        if (isEditMode) {
            subtitleEl.contentEditable = 'true';
            subtitleEl.addEventListener('blur', function () {
                data.header.subtitle = subtitleEl.textContent.trim();
                saveLocalUIState();
            });
        }
    }

    function renderSection(section, rowId) {
        if (section.type === 'projects') return renderProjectsSection(section);
        if (section.type === 'timeline') return renderTimelineSection(section);
        if (section.type === 'skills') return renderSkillsSection(section);

        var div = document.createElement('div');
        div.textContent = 'Seção desconhecida';
        return div;
    }

    function renderSectionTitle(section) {
        var h2 = document.createElement('h2');
        h2.className = 'section-title';
        h2.innerHTML = '<i class="ph ' + escapeHtml(section.icon) + '"></i> ';

        var titleSpan = document.createElement('span');
        titleSpan.textContent = section.title;
        h2.appendChild(titleSpan);

        return h2;
    }

    // ===== PROJECTS RENDERING =====
    function renderProjectsSection(section) {
        var container = document.createElement('section');
        container.className = 'projects-section';
        container.appendChild(renderSectionTitle(section));

        var grid = document.createElement('div');
        grid.className = 'projects-grid';

        section.items.forEach(function (item) {
            var card = document.createElement('div');
            card.className = 'project-card animate-in';

            card.innerHTML =
                '<div class="card-icon"><i class="ph ' + escapeHtml(item.icon) + '"></i></div>' +
                '<div class="card-content">' +
                    '<h3 class="card-title"></h3>' +
                    '<p class="card-desc"></p>' +
                '</div>' +
                '<div class="card-arrow"><i class="ph ph-arrow-right"></i></div>';

            card.querySelector('.card-title').textContent = item.title;
            card.querySelector('.card-desc').textContent = item.desc;

            if (isEditMode) {
                var titleEl = card.querySelector('.card-title');
                var descEl = card.querySelector('.card-desc');
                titleEl.contentEditable = 'true';
                descEl.contentEditable = 'true';

                titleEl.addEventListener('blur', function () {
                    atualizarCampoGlobal('projetos', item.id, {titulo: titleEl.textContent.trim()});
                });

                descEl.addEventListener('blur', function () {
                    atualizarCampoGlobal('projetos', item.id, {descricao: descEl.textContent.trim()});
                });

                card.style.position = 'relative';
                var delBtn = createDeleteBtn();
                delBtn.addEventListener('click', function () {
                    confirmDeleteItem('projetos', item.id, 'projeto');
                });
                card.appendChild(delBtn);
            } else if (item.link && item.link !== '#') {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function () {
                    window.location.href = item.link;
                });
            }

            grid.appendChild(card);
        });

        container.appendChild(grid);

        if (isEditMode) {
            var addBtn = createAddBtn('Adicionar Projeto');
            addBtn.addEventListener('click', function () { addProjectItem(section); });
            container.appendChild(addBtn);
        }

        return container;
    }

    // ===== TIMELINE RENDERING =====
    function renderTimelineSection(section) {
        var container = document.createElement('section');
        container.appendChild(renderSectionTitle(section));

        var timeline = document.createElement('div');
        timeline.className = 'timeline';

        section.items.forEach(function (item) {
            var timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item animate-in';
            timelineItem.style.position = 'relative';

            var dot = document.createElement('div');
            dot.className = 'timeline-dot';
            timelineItem.appendChild(dot);

            var content = document.createElement('div');
            content.className = 'timeline-content';

            var badge = document.createElement('span');
            badge.className = 'timeline-badge' + (item.badgeType === 'secondary' ? ' timeline-badge-secondary' : '');
            badge.textContent = item.badge;
            content.appendChild(badge);

            var title = document.createElement('h3');
            title.className = 'timeline-title';
            title.textContent = item.title;
            content.appendChild(title);

            var company = document.createElement('p');
            company.className = 'timeline-company';
            company.textContent = item.company;
            content.appendChild(company);

            var bodyDiv = document.createElement('div');
            bodyDiv.className = 'timeline-body';

            item.body.forEach(function (text, bIdx) {
                var p = document.createElement('p');
                p.textContent = text;
                if (isEditMode) {
                    p.contentEditable = 'true';
                    p.addEventListener('blur', function () {
                        item.body[bIdx] = p.textContent.trim();
                        atualizarCampoGlobal('cronograma', item.id, {detalhes: JSON.stringify(item.body)});
                    });
                }
                bodyDiv.appendChild(p);
            });

            if (isEditMode) {
                var addBodyBtn = document.createElement('button');
                addBodyBtn.className = 'edit-add-body-btn';
                addBodyBtn.innerHTML = '<i class="ph ph-plus"></i> Texto';
                addBodyBtn.addEventListener('click', async function (e) {
                    e.stopPropagation();
                    item.body.push('Novo parágrafo...');
                    await atualizarCampoGlobal('cronograma', item.id, {detalhes: JSON.stringify(item.body)});
                    fetchFromSupabase();
                });
                bodyDiv.appendChild(addBodyBtn);
            }

            content.appendChild(bodyDiv);

            if (isEditMode) {
                badge.contentEditable = 'true';
                title.contentEditable = 'true';
                company.contentEditable = 'true';

                badge.addEventListener('blur', function () {
                    atualizarCampoGlobal('cronograma', item.id, {badge: badge.textContent.trim()});
                });
                title.addEventListener('blur', function () {
                    atualizarCampoGlobal('cronograma', item.id, {titulo: title.textContent.trim()});
                });
                company.addEventListener('blur', function () {
                    atualizarCampoGlobal('cronograma', item.id, {subtitulo_empresa: company.textContent.trim()});
                });

                content.addEventListener('click', function (e) {
                    e.stopPropagation();
                });
            } else {
                content.addEventListener('click', function () {
                    var wasExpanded = content.classList.contains('expanded');
                    document.querySelectorAll('.timeline-content.expanded').forEach(function (other) {
                        if (other !== content) other.classList.remove('expanded');
                    });
                    content.classList.toggle('expanded');
                });
            }

            timelineItem.appendChild(content);

            if (isEditMode) {
                var delBtn = createDeleteBtn();
                delBtn.style.top = '8px';
                delBtn.style.right = '-4px';
                delBtn.style.zIndex = '10';
                delBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    confirmDeleteItem('cronograma', item.id, 'item cronograma');
                });
                timelineItem.appendChild(delBtn);
            }

            timeline.appendChild(timelineItem);
        });

        container.appendChild(timeline);

        if (isEditMode) {
            var addBtn = createAddBtn('Adicionar Item');
            addBtn.addEventListener('click', function () { addTimelineItem(section); });
            container.appendChild(addBtn);
        }

        return container;
    }

    // ===== SKILLS RENDERING =====
    function renderSkillsSection(section) {
        var container = document.createElement('section');
        container.appendChild(renderSectionTitle(section));

        var card = document.createElement('div');
        card.className = 'skills-card';

        section.groups.forEach(function (group) {
            var groupDiv = document.createElement('div');
            groupDiv.className = 'skills-group';

            var groupTitle = document.createElement('h3');
            groupTitle.className = 'skills-group-title';
            groupTitle.textContent = group.title;
            groupDiv.appendChild(groupTitle);

            var tagsList = document.createElement('div');
            tagsList.className = 'skills-list';

            group.tagsData.forEach(function (tagItem, tagIdx) {
                var tagSpan = document.createElement('span');
                tagSpan.className = 'skill-tag';
                tagSpan.textContent = tagItem.tag;

                if (isEditMode) {
                    tagSpan.contentEditable = 'true';
                    tagSpan.style.display = 'inline-flex';
                    tagSpan.style.alignItems = 'center';

                    tagSpan.addEventListener('blur', function () {
                        atualizarCampoGlobal('habilidades_tags', tagItem.id, {tag: tagSpan.textContent.trim()});
                    });

                    var removeTagBtn = document.createElement('button');
                    removeTagBtn.className = 'edit-tag-remove';
                    removeTagBtn.innerHTML = '<i class="ph ph-x"></i>';
                    removeTagBtn.addEventListener('click', async function (e) {
                        e.stopPropagation();
                        await confirmDeleteItem('habilidades_tags', tagItem.id, 'tag');
                    });
                    tagSpan.appendChild(removeTagBtn);
                }

                tagsList.appendChild(tagSpan);
            });

            if (isEditMode) {
                var addTagBtn = document.createElement('button');
                addTagBtn.className = 'skill-tag';
                addTagBtn.style.cursor = 'pointer';
                addTagBtn.style.borderStyle = 'dashed';
                addTagBtn.style.color = 'var(--text-tertiary)';
                addTagBtn.innerHTML = '<i class="ph ph-plus"></i>';
                addTagBtn.addEventListener('click', async function () {
                    await supabase.from('habilidades_tags').insert({grupo_id: group.id, tag: 'Nova Tag'});
                    showToast('Tag adicionada', 'ph-plus');
                    fetchFromSupabase();
                });
                tagsList.appendChild(addTagBtn);
            }

            groupDiv.appendChild(tagsList);

            if (isEditMode) {
                groupTitle.contentEditable = 'true';
                groupTitle.addEventListener('blur', function () {
                    atualizarCampoGlobal('habilidades_grupos', group.id, {titulo: groupTitle.textContent.trim()});
                });
                
                var topRowGroup = document.createElement('div');
                topRowGroup.style.display = 'flex';
                topRowGroup.style.justifyContent = 'space-between';
                topRowGroup.style.alignItems = 'center';
                topRowGroup.appendChild(groupTitle);
                
                var delGroup = createDeleteBtn();
                delGroup.style.position = 'relative';
                delGroup.addEventListener('click', async () => {
                   await confirmDeleteItem('habilidades_grupos', group.id, 'Grupo Inteiro');
                });
                topRowGroup.appendChild(delGroup);
                
                groupDiv.prepend(topRowGroup);
            }

            card.appendChild(groupDiv);
        });

        container.appendChild(card);

        if (isEditMode) {
            var addBtn = createAddBtn('Adicionar Grupo');
            addBtn.addEventListener('click', function () { addSkillGroup(section); });
            container.appendChild(addBtn);
        }

        return container;
    }

    // ===== HELPER BUTTONS =====
    function createDeleteBtn() {
        var btn = document.createElement('button');
        btn.className = 'edit-delete-btn';
        btn.innerHTML = '<i class="ph ph-trash"></i>';
        return btn;
    }

    function createAddBtn(text) {
        var btn = document.createElement('button');
        btn.className = 'edit-action-btn add-full';
        btn.innerHTML = '<i class="ph ph-plus"></i> ' + escapeHtml(text);
        return btn;
    }

    // ===== CRUD SUPABASE =====

    async function addProjectItem(section) {
        var result = await showModal({
            title: 'Novo Projeto',
            fields: [
                { key: 'title', label: 'Título', type: 'text', placeholder: 'Nome do projeto' },
                { key: 'desc', label: 'Descrição', type: 'text', placeholder: 'Breve descrição' },
                { key: 'icon', label: 'Ícone', type: 'icon-picker', value: 'ph-app-window' },
                { key: 'link', label: 'Link (opcional)', type: 'text', placeholder: '/meu-projeto/' }
            ],
            confirmText: 'Adicionar'
        });

        if (result && result.title) {
            const { error } = await supabase.from('projetos').insert({
                titulo: result.title,
                descricao: result.desc || '',
                icone: result.icon || 'ph-app-window',
                link_projeto: result.link || '#'
            });
            if(!error) {
                showToast('Projeto adicionado!', 'ph-check-circle');
                fetchFromSupabase();
            } else {
                showToast('Falha ao adicionar.', 'ph-warning');
            }
        }
    }

    async function addTimelineItem(section) {
        var result = await showModal({
            title: 'Novo Item (' + section.categoriaRef + ')',
            fields: [
                { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Ex: Atual, Anterior, Em Andamento' },
                {
                    key: 'badgeType', label: 'Tipo do Badge', type: 'select', value: 'primary',
                    options: [
                        { value: 'primary', label: 'Destaque (laranja)' },
                        { value: 'secondary', label: 'Secundário (cinza)' }
                    ]
                },
                { key: 'title', label: 'Título', type: 'text', placeholder: 'Título do item' },
                { key: 'company', label: 'Subtítulo / Empresa', type: 'text', placeholder: 'Descrição breve' },
                { key: 'body', label: 'Detalhes', type: 'textarea', placeholder: 'Texto com mais detalhes...' }
            ],
            confirmText: 'Adicionar'
        });

        if (result && result.title) {
            const { error } = await supabase.from('cronograma').insert({
                categoria: section.categoriaRef,
                badge: result.badge || 'Novo',
                tipo_badge: result.badgeType || 'primary',
                titulo: result.title,
                subtitulo_empresa: result.company || '',
                detalhes: JSON.stringify([result.body || ''])
            });
            if(!error) {
                showToast('Item adicionado!', 'ph-check-circle');
                fetchFromSupabase();
            }
        }
    }

    async function addSkillGroup(section) {
        var result = await showModal({
            title: 'Novo Grupo de Habilidades',
            fields: [
                { key: 'title', label: 'Título do Grupo', type: 'text', placeholder: 'Ex: DevOps, Mobile' },
                { key: 'tags', label: 'Tags (separadas por vírgula)', type: 'text', placeholder: 'Docker, Kubernetes, AWS' }
            ],
            confirmText: 'Adicionar'
        });

        if (result && result.title) {
            const { data: gData, error: gError } = await supabase.from('habilidades_grupos').insert({titulo: result.title}).select();
            if(!gError && gData && gData.length > 0) {
                const arr = result.tags ? result.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                if(arr.length > 0) {
                    const tagPayload = arr.map(t => ({grupo_id: gData[0].id, tag: t}));
                    await supabase.from('habilidades_tags').insert(tagPayload);
                }
                showToast('Grupo adicionado!', 'ph-check-circle');
                fetchFromSupabase();
            }
        }
    }

    async function confirmDeleteItem(tabela, itemId, label) {
        var result = await showModal({
            title: 'Confirmar Exclusão',
            fields: [],
            confirmText: 'Excluir ' + label,
            cancelText: 'Cancelar',
            dangerConfirm: true
        });

        if (result) {
            const { error } = await supabase.from(tabela).delete().eq('id', itemId);
            if(!error) {
                showToast(label + ' removido(a).', 'ph-trash');
                fetchFromSupabase();
            }
        }
    }

    // ===== EDIT MODE =====
    async function toggleEditMode() {
        if (!isEditMode) {
            var result = await showModal({
                title: 'Autenticação Admin',
                fields: [
                    { key: 'password', label: 'Senha', type: 'password', placeholder: 'Digite a senha...' }
                ],
                confirmText: 'Entrar',
                cancelText: 'Cancelar'
            });

            if (result && result.password === PASSWORD) {
                enterEditMode();
            } else if (result) {
                showToast('Senha incorreta.', 'ph-lock');
            }
        } else {
            exitEditMode();
        }
    }

    function enterEditMode() {
        isEditMode = true;
        document.body.classList.add('edit-mode-active');
        customizeBtn.classList.add('active');
        adminToolbar.classList.add('visible');
        render();
        showToast('Modo admin ativado!', 'ph-pencil-simple');
    }

    function exitEditMode() {
        isEditMode = false;
        document.body.classList.remove('edit-mode-active');
        customizeBtn.classList.remove('active');
        adminToolbar.classList.remove('visible');
        showToast('Saída do Modo Admin', 'ph-floppy-disk');
        fetchFromSupabase();
    }

    // ===== EVENT LISTENERS =====
    customizeBtn.addEventListener('click', toggleEditMode);
    
    // Opcional: remover "nova seção" se sua modelagem não suporta novas seções dinâmicas estruturais globalmente.
    if(addSectionBtn) addSectionBtn.style.display = 'none'; 
    if(resetDataBtn) resetDataBtn.style.display = 'none';

    saveExitBtn.addEventListener('click', exitEditMode);

    // ===== INITIALIZATION =====
    function init() {
        fetchFromSupabase();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
