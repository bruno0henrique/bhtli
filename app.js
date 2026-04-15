(function () {
    'use strict';

    // ===== CONSTANTS =====
    const STORAGE_KEY = 'bhlti_portfolio_data';
    const PASSWORD = '0410';

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
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ===== DEFAULT DATA =====
    function createDefaultData() {
        return {
            version: 1,
            header: {
                logo: 'bhsti.online',
                subtitle: 'Sistemas e Aplicações Web'
            },
            rows: [
                {
                    id: uid(),
                    layout: 'full',
                    sections: [{
                        id: uid(),
                        type: 'projects',
                        title: 'Projetos Selecionados',
                        icon: 'ph-squares-four',
                        items: [
                            { id: uid(), title: 'Terradata', desc: 'Sistema de Gestão Territorial', icon: 'ph-map-trifold', link: '/terradata/' },
                            { id: uid(), title: 'PDV Mercadinho', desc: 'Frente de Caixa e Gestão', icon: 'ph-storefront', link: '/pdv-mercadinho/' }
                        ]
                    }]
                },
                {
                    id: uid(),
                    layout: 'columns',
                    sections: [
                        {
                            id: uid(),
                            type: 'timeline',
                            title: 'Experiências',
                            icon: 'ph-briefcase',
                            items: [
                                { id: uid(), badge: 'Atual', badgeType: 'primary', title: 'Desenvolvedor Flutter & Firebase', company: 'Desenvolvimento de sistemas PDV e arquitetura de aplicações web/mobile.', body: ['Especialista na criação de soluções escaláveis utilizando Flutter para o frontend e Firebase para infraestrutura serverless, autenticação e banco de dados em tempo real.'] },
                                { id: uid(), badge: 'Anterior', badgeType: 'secondary', title: 'Profissional Industrial - Mars Wrigley', company: 'Atuação em linhas de produção de alta performance e projetos Kaizen.', body: ['Otimização de processos produtivos e implementação de melhorias contínuas seguindo a metodologia Lean Manufacturing.'] }
                            ]
                        },
                        {
                            id: uid(),
                            type: 'timeline',
                            title: 'Estudos',
                            icon: 'ph-graduation-cap',
                            items: [
                                { id: uid(), badge: 'Em Andamento', badgeType: 'primary', title: 'Modelagem 3D e Projetos Mecânicos', company: 'Desenvolvimento de peças industriais (como raspadores) utilizando Onshape, CATIA e AutoCAD.', body: ['Criação de modelos tridimensionais complexos e detalhamento de desenhos técnicos para fabricação industrial.'] },
                                { id: uid(), badge: 'Em Andamento', badgeType: 'primary', title: 'Inglês Técnico', company: 'Foco em vocabulário corporativo, TI e conversação.', body: ['Aprimoramento da comunicação em ambientes profissionais internacionais e compreensão de documentações técnicas.'] }
                            ]
                        }
                    ]
                },
                {
                    id: uid(),
                    layout: 'columns',
                    sections: [
                        {
                            id: uid(),
                            type: 'timeline',
                            title: 'Formação',
                            icon: 'ph-graduation-cap',
                            items: [
                                { id: uid(), badge: 'Graduação', badgeType: 'primary', title: 'Análise e Desenvolvimento de Sistemas', company: 'Instituição de Ensino Superior', body: ['Foco em engenharia de software, banco de dados, desenvolvimento web e metodologias ágeis.'] }
                            ]
                        },
                        {
                            id: uid(),
                            type: 'skills',
                            title: 'Habilidades',
                            icon: 'ph-lightning',
                            groups: [
                                { id: uid(), title: 'Frontend', tags: ['Flutter', 'HTML5', 'CSS3', 'JavaScript'] },
                                { id: uid(), title: 'Backend & Ferramentas', tags: ['Firebase', 'Git & GitHub', 'Onshape', 'AutoCAD'] }
                            ]
                        }
                    ]
                }
            ],
            footer: '© 2026 bhsti.online. Todos os direitos reservados.'
        };
    }

    // ===== STATE =====
    let data = loadData();
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

    // ===== DATA PERSISTENCE =====
    function loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Migrate old body format (string -> array)
                if (parsed.rows) {
                    parsed.rows.forEach(row => {
                        (row.sections || []).forEach(sec => {
                            if (sec.type === 'timeline' && sec.items) {
                                sec.items.forEach(item => {
                                    if (typeof item.body === 'string') {
                                        item.body = [item.body];
                                    }
                                });
                            }
                        });
                    });
                }
                return parsed;
            }
        } catch (e) {
            console.warn('Failed to load data:', e);
        }
        return createDefaultData();
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

        // Icon picker logic
        var iconPickers = modalOverlay.querySelectorAll('.icon-picker');
        iconPickers.forEach(function (picker) {
            picker.addEventListener('click', function (e) {
                var option = e.target.closest('.icon-option');
                if (!option) return;
                picker.querySelectorAll('.icon-option').forEach(function (o) { o.classList.remove('selected'); });
                option.classList.add('selected');
            });
        });

        // Focus first input
        var firstInput = modalOverlay.querySelector('.form-input, .form-textarea');
        if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);

        // Enter key to confirm
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

                    if (isEditMode) {
                        var deleteBtn = createDeleteBtn();
                        deleteBtn.title = 'Remover seção';
                        deleteBtn.addEventListener('click', function () { confirmDeleteRow(row.id); });
                        wrapper.appendChild(deleteBtn);
                    }

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

                if (isEditMode) {
                    var deleteBtn = createDeleteBtn();
                    deleteBtn.title = 'Remover linha';
                    deleteBtn.addEventListener('click', function () { confirmDeleteRow(row.id); });
                    grid.appendChild(deleteBtn);
                }

                mainContent.appendChild(grid);
            }
        });

        // Footer
        footerText.textContent = data.footer;
        if (isEditMode) {
            footerText.contentEditable = 'true';
            footerText.addEventListener('blur', function () {
                data.footer = footerText.textContent.trim();
                saveData();
            });
        }

        // Header editability
        var logoEl = document.getElementById('logo');
        var subtitleEl = document.getElementById('subtitle');

        if (isEditMode) {
            // We keep the dot span, so we use a special approach
            subtitleEl.contentEditable = 'true';
            subtitleEl.addEventListener('blur', function () {
                data.header.subtitle = subtitleEl.textContent.trim();
                saveData();
            });
        }
    }

    function renderSection(section, rowId) {
        if (section.type === 'projects') return renderProjectsSection(section);
        if (section.type === 'timeline') return renderTimelineSection(section);
        if (section.type === 'skills') return renderSkillsSection(section);

        // Fallback
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

        if (isEditMode) {
            titleSpan.contentEditable = 'true';
            titleSpan.addEventListener('blur', function () {
                section.title = titleSpan.textContent.trim();
                saveData();
            });
        }

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
                    item.title = titleEl.textContent.trim();
                    saveData();
                });

                descEl.addEventListener('blur', function () {
                    item.desc = descEl.textContent.trim();
                    saveData();
                });

                card.style.position = 'relative';
                var delBtn = createDeleteBtn();
                delBtn.addEventListener('click', function () {
                    confirmDeleteItem(section, item.id, 'projeto');
                });
                card.appendChild(delBtn);
            } else {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    e.preventDefault();
                    showToast('Realizando ajustes, tente novamente em breve', 'ph-wrench');
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

            // Badge
            var badge = document.createElement('span');
            badge.className = 'timeline-badge' + (item.badgeType === 'secondary' ? ' timeline-badge-secondary' : '');
            badge.textContent = item.badge;
            content.appendChild(badge);

            // Title
            var title = document.createElement('h3');
            title.className = 'timeline-title';
            title.textContent = item.title;
            content.appendChild(title);

            // Company
            var company = document.createElement('p');
            company.className = 'timeline-company';
            company.textContent = item.company;
            content.appendChild(company);

            // Body
            var bodyDiv = document.createElement('div');
            bodyDiv.className = 'timeline-body';

            var bodyArr = Array.isArray(item.body) ? item.body : [item.body || ''];
            bodyArr.forEach(function (text, bIdx) {
                var p = document.createElement('p');
                p.textContent = text;

                if (isEditMode) {
                    p.contentEditable = 'true';
                    p.addEventListener('blur', function () {
                        item.body[bIdx] = p.textContent.trim();
                        saveData();
                    });
                }

                bodyDiv.appendChild(p);
            });

            if (isEditMode) {
                var addBodyBtn = document.createElement('button');
                addBodyBtn.className = 'edit-add-body-btn';
                addBodyBtn.innerHTML = '<i class="ph ph-plus"></i> Texto';
                addBodyBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    item.body.push('Novo parágrafo...');
                    saveData();
                    render();
                });
                bodyDiv.appendChild(addBodyBtn);
            }

            content.appendChild(bodyDiv);

            if (isEditMode) {
                badge.contentEditable = 'true';
                title.contentEditable = 'true';
                company.contentEditable = 'true';

                badge.addEventListener('blur', function () {
                    item.badge = badge.textContent.trim();
                    saveData();
                });
                title.addEventListener('blur', function () {
                    item.title = title.textContent.trim();
                    saveData();
                });
                company.addEventListener('blur', function () {
                    item.company = company.textContent.trim();
                    saveData();
                });

                // Prevent card expansion when editing
                content.addEventListener('click', function (e) {
                    e.stopPropagation();
                });
            } else {
                content.addEventListener('click', function () {
                    var wasExpanded = content.classList.contains('expanded');

                    // Close other expanded cards
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
                    confirmDeleteItem(section, item.id, 'item');
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

            group.tags.forEach(function (tag, tagIdx) {
                var tagSpan = document.createElement('span');
                tagSpan.className = 'skill-tag';
                tagSpan.textContent = tag;

                if (isEditMode) {
                    tagSpan.contentEditable = 'true';
                    tagSpan.style.display = 'inline-flex';
                    tagSpan.style.alignItems = 'center';

                    tagSpan.addEventListener('blur', function () {
                        group.tags[tagIdx] = tagSpan.textContent.trim();
                        saveData();
                    });

                    var removeTagBtn = document.createElement('button');
                    removeTagBtn.className = 'edit-tag-remove';
                    removeTagBtn.innerHTML = '<i class="ph ph-x"></i>';
                    removeTagBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        group.tags.splice(tagIdx, 1);
                        saveData();
                        render();
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
                addTagBtn.addEventListener('click', function () {
                    group.tags.push('Nova Tag');
                    saveData();
                    render();
                });
                tagsList.appendChild(addTagBtn);
            }

            groupDiv.appendChild(tagsList);

            if (isEditMode) {
                groupTitle.contentEditable = 'true';
                groupTitle.addEventListener('blur', function () {
                    group.title = groupTitle.textContent.trim();
                    saveData();
                });
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

    // ===== CRUD OPERATIONS =====

    // --- Add Project ---
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
            section.items.push({
                id: uid(),
                title: result.title,
                desc: result.desc || '',
                icon: result.icon || 'ph-app-window',
                link: result.link || '#'
            });
            saveData();
            render();
            showToast('Projeto adicionado!', 'ph-check-circle');
        }
    }

    // --- Add Timeline Item ---
    async function addTimelineItem(section) {
        var result = await showModal({
            title: 'Novo Item',
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
                { key: 'body', label: 'Detalhes', type: 'textarea', placeholder: 'Texto expandível com mais detalhes...' }
            ],
            confirmText: 'Adicionar'
        });

        if (result && result.title) {
            section.items.push({
                id: uid(),
                badge: result.badge || 'Novo',
                badgeType: result.badgeType || 'primary',
                title: result.title,
                company: result.company || '',
                body: [result.body || '']
            });
            saveData();
            render();
            showToast('Item adicionado!', 'ph-check-circle');
        }
    }

    // --- Add Skill Group ---
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
            if (!section.groups) section.groups = [];
            section.groups.push({
                id: uid(),
                title: result.title,
                tags: result.tags ? result.tags.split(',').map(function (t) { return t.trim(); }).filter(Boolean) : []
            });
            saveData();
            render();
            showToast('Grupo adicionado!', 'ph-check-circle');
        }
    }

    // --- Add New Section (Row) ---
    async function addNewSection() {
        var result = await showModal({
            title: 'Nova Seção',
            fields: [
                { key: 'title', label: 'Título da Seção', type: 'text', placeholder: 'Ex: Certificações, Contato' },
                {
                    key: 'type', label: 'Tipo', type: 'select', value: 'timeline',
                    options: [
                        { value: 'timeline', label: 'Timeline (cards expansíveis)' },
                        { value: 'projects', label: 'Projetos (grid de cards)' },
                        { value: 'skills', label: 'Habilidades (tags)' }
                    ]
                },
                {
                    key: 'layout', label: 'Layout', type: 'select', value: 'full',
                    options: [
                        { value: 'full', label: 'Largura total' },
                        { value: 'columns', label: 'Duas colunas (adiciona à esquerda)' }
                    ]
                },
                { key: 'icon', label: 'Ícone', type: 'icon-picker', value: 'ph-squares-four' }
            ],
            confirmText: 'Criar Seção'
        });

        if (result && result.title) {
            var newSection = {
                id: uid(),
                type: result.type,
                title: result.title,
                icon: result.icon || 'ph-squares-four'
            };

            if (result.type === 'projects') {
                newSection.items = [];
            } else if (result.type === 'timeline') {
                newSection.items = [];
            } else if (result.type === 'skills') {
                newSection.groups = [];
            }

            if (result.layout === 'columns') {
                // Create a row with two columns, second is empty timeline by default
                var secondSection = {
                    id: uid(),
                    type: 'timeline',
                    title: 'Nova Coluna',
                    icon: 'ph-squares-four',
                    items: []
                };

                data.rows.push({
                    id: uid(),
                    layout: 'columns',
                    sections: [newSection, secondSection]
                });
            } else {
                data.rows.push({
                    id: uid(),
                    layout: 'full',
                    sections: [newSection]
                });
            }

            saveData();
            render();
            showToast('Seção criada!', 'ph-check-circle');

            // Scroll to new section
            setTimeout(function () {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
    }

    // --- Delete Item ---
    async function confirmDeleteItem(section, itemId, label) {
        var result = await showModal({
            title: 'Confirmar Exclusão',
            fields: [],
            confirmText: 'Excluir ' + label,
            cancelText: 'Cancelar',
            dangerConfirm: true
        });

        if (result) {
            if (section.items) {
                section.items = section.items.filter(function (i) { return i.id !== itemId; });
            }
            if (section.groups) {
                section.groups = section.groups.filter(function (g) { return g.id !== itemId; });
            }
            saveData();
            render();
            showToast('Item removido.', 'ph-trash');
        }
    }

    // --- Delete Row ---
    async function confirmDeleteRow(rowId) {
        var result = await showModal({
            title: 'Remover Seção Inteira?',
            fields: [],
            confirmText: 'Excluir',
            cancelText: 'Cancelar',
            dangerConfirm: true
        });

        if (result) {
            data.rows = data.rows.filter(function (r) { return r.id !== rowId; });
            saveData();
            render();
            showToast('Seção removida.', 'ph-trash');
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
        saveData();
        render();
        showToast('Alterações salvas!', 'ph-floppy-disk');
    }

    // ===== RESET DATA =====
    async function resetAllData() {
        var result = await showModal({
            title: 'Resetar Todos os Dados?',
            fields: [],
            confirmText: 'Resetar Tudo',
            cancelText: 'Cancelar',
            dangerConfirm: true
        });

        if (result) {
            data = createDefaultData();
            saveData();
            render();
            showToast('Dados restaurados ao padrão!', 'ph-arrow-counter-clockwise');
        }
    }

    // ===== EVENT LISTENERS =====
    customizeBtn.addEventListener('click', toggleEditMode);
    addSectionBtn.addEventListener('click', addNewSection);
    saveExitBtn.addEventListener('click', exitEditMode);
    resetDataBtn.addEventListener('click', resetAllData);

    // ===== INITIALIZATION =====
    function init() {
        render();
    }

    // Wait for DOM and fonts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
