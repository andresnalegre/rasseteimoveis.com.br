/**  Header **/

// Green Banner
const GreenBannerModule = {
    list: null,
    items: null,
    totalItems: 0,
    currentIndex: 0,
    interval: null,
    scrollContainer: null,

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    },

    setup() {
        this.list = document.querySelector('#info-list');
        if (!this.list) {
            console.warn('GreenBannerModule: Elemento #info-list não encontrado');
            return;
        }

        this.items = document.querySelectorAll('#info-list li');
        this.totalItems = this.items.length;

        if (this.totalItems === 0) {
            console.warn('GreenBannerModule: Nenhum item encontrado em #info-list');
            return;
        }

        this.createScrollContainer();
        this.hideOriginalItems();
        this.bindEvents();
        this.startInitialAnimation();
        this.startRotation();
    },

    createScrollContainer() {
        this.scrollContainer = document.createElement('div');
        this.scrollContainer.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.scrollContainer.style.opacity = '1';
        this.scrollContainer.style.transform = 'translateY(0)';
        this.scrollContainer.style.textAlign = 'center';
        this.scrollContainer.style.width = '100%';
        
        this.list.appendChild(this.scrollContainer);
    },

    hideOriginalItems() {
        this.items.forEach(item => item.style.display = 'none');
    },

    showNextMessage() {
        this.scrollContainer.style.opacity = '0.3';
        this.scrollContainer.style.transform = 'translateY(-25px)';
        
        setTimeout(() => {
            this.currentIndex = (this.currentIndex + 1) % this.totalItems;
            this.scrollContainer.textContent = this.items[this.currentIndex].textContent;
            
            this.scrollContainer.style.transform = 'translateY(25px)';
            this.scrollContainer.style.opacity = '0';
            
            setTimeout(() => {
                this.scrollContainer.style.opacity = '1';
                this.scrollContainer.style.transform = 'translateY(0)';
            }, 100);
            
        }, 600);
    },

    startRotation() {
        this.interval = setInterval(() => this.showNextMessage(), 4000);
    },

    stopRotation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },

    startInitialAnimation() {
        this.scrollContainer.textContent = this.items[this.currentIndex].textContent;
        this.scrollContainer.style.transform = 'translateY(20px)';
        this.scrollContainer.style.opacity = '0';
        
        setTimeout(() => {
            this.scrollContainer.style.opacity = '1';
            this.scrollContainer.style.transform = 'translateY(0)';
        }, 300);
    },

    bindEvents() {
        this.list.addEventListener('mouseenter', () => this.stopRotation());
        this.list.addEventListener('mouseleave', () => this.startRotation());
    },

    restart() {
        this.stopRotation();
        this.currentIndex = 0;
        if (this.scrollContainer) {
            this.scrollContainer.remove();
        }
        this.setup();
    },

    destroy() {
        this.stopRotation();
        if (this.scrollContainer) {
            this.scrollContainer.remove();
        }
        this.items.forEach(item => item.style.display = '');
        this.list?.removeEventListener('mouseenter', () => this.stopRotation());
        this.list?.removeEventListener('mouseleave', () => this.startRotation());
    }
};

// Navbar
const NavbarModule = {
    menuButton: null,
    navbarMenu: null,
    dropdownToggles: null,
    dropdownMenus: null,
    modals: {
        quemSomos: null,
        faleConosco: null,
        favoritos: null
    },
    forms: {
        contact: null
    },

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    },

    setup() {
        this.cacheElements();
        this.bindEvents();
        this.setupKeyboardNavigation();
    },

    cacheElements() {
        this.menuButton = document.querySelector('.menu');
        this.navbarMenu = document.getElementById('navbarMenu');
        this.dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        this.dropdownMenus = document.querySelectorAll('.dropdown-menu');
        this.modals.quemSomos = document.getElementById('quemSomosModal');
        this.modals.faleConosco = document.getElementById('faleConoscoModal');
        this.modals.favoritos = document.getElementById('favoritosModal');
        this.forms.contact = document.querySelector('.contact-form');

        if (!this.menuButton || !this.navbarMenu) {
            console.warn('NavbarModule: Elementos essenciais da navbar não encontrados');
        }
    },

    bindEvents() {
        if (this.menuButton && this.navbarMenu) {
            this.menuButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleMenu();
            });
        }

        this.dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (event) => this.handleDropdownToggle(event));
        });

        document.addEventListener('click', (event) => this.handleDocumentClick(event));
        window.addEventListener('click', (event) => this.handleWindowClick(event));

        if (this.forms.contact) {
            this.forms.contact.addEventListener('submit', (event) => this.handleContactForm(event));
        }
    },

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeAllModals();
                this.closeAllDropdowns();
            }
        });
    },

    toggleMenu() {
        if (this.navbarMenu) {
            this.navbarMenu.classList.toggle('show');
        }
        if (this.menuButton) {
            this.menuButton.classList.toggle('opened');
            this.menuButton.setAttribute('aria-expanded', this.menuButton.classList.contains('opened'));
        }
    },

    closeMenu() {
        if (this.navbarMenu) {
            this.navbarMenu.classList.remove('show');
        }
        if (this.menuButton) {
            this.menuButton.classList.remove('opened');
            this.menuButton.setAttribute('aria-expanded', 'false');
        }
    },

    handleDropdownToggle(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const dropdown = event.target.nextElementSibling;
        if (dropdown && dropdown.classList.contains('dropdown-menu')) {
            this.closeAllDropdowns();
            dropdown.classList.toggle('show');
        }
    },

    closeAllDropdowns() {
        this.dropdownMenus.forEach(menu => {
            menu.classList.remove('show');
        });
    },

    handleDocumentClick(event) {
        if (!event.target.closest('.dropdown-toggle')) {
            this.closeAllDropdowns();
        }
    },

    openModal(modalType) {
        const modal = this.modals[modalType];
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    },

    closeModal(modalType) {
        const modal = this.modals[modalType];
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    },

    closeAllModals() {
        Object.keys(this.modals).forEach(modalType => {
            this.closeModal(modalType);
        });
    },

    handleWindowClick(event) {
        if (event.target === this.modals.quemSomos) {
            this.closeModal('quemSomos');
        }
        if (event.target === this.modals.faleConosco) {
            this.closeModal('faleConosco');
        }
        if (event.target === this.modals.favoritos) {
            this.closeModal('favoritos');
        }
    },

    handleContactForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const contactData = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            whatsapp: formData.get('whatsapp') ? 'Sim' : 'Não',
            mensagem: formData.get('mensagem')
        };
        
        this.submitContactData(contactData);
        event.target.reset();
        this.closeModal('faleConosco');
    },

    openFavoritesModal() {
        this.updateFavoritesContent();
        this.openModal('favoritos');
    },

    updateFavoritesContent() {
        const favoritesContainer = document.querySelector('#favoritosModal .favorites-list');
        if (!favoritesContainer) {
            console.warn('NavbarModule: Container .favorites-list não encontrado');
            return;
        }

        if (typeof CatalogModule !== 'undefined') {
            const favorites = CatalogModule.api.getFavorites();
            console.log('Favoritos encontrados:', favorites);
            this.renderFavorites(favoritesContainer, favorites);
        } else {
            console.warn('NavbarModule: CatalogModule não disponível');
            this.renderEmptyFavorites(favoritesContainer);
        }
    },

    renderFavorites(container, favoriteIds) {
        if (favoriteIds.length === 0) {
            console.log('Nenhum favorito para renderizar');
            this.renderEmptyFavorites(container);
            return;
        }

        console.log('Renderizando favoritos:', favoriteIds);

        const favoritesHtml = favoriteIds.map(id => {
            const propertyData = this.getPropertyData(id);
            console.log(`Dados do imóvel ${id}:`, propertyData);
            return this.createFavoriteItemHtml(propertyData);
        }).join('');

        container.innerHTML = favoritesHtml;
    },

    renderEmptyFavorites(container) {
        container.innerHTML = `
            <div class="empty-favorites">
                <i class="lni-star" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                <h3>Nenhum favorito ainda</h3>
                <p>Adicione imóveis aos seus favoritos para vê-los aqui!</p>
            </div>
        `;
    },

    getPropertyData(propertyId) {
        const propertyButton = document.querySelector(`[data-property-id="${propertyId}"]`);
        if (!propertyButton) {
            console.warn(`Botão com ID ${propertyId} não encontrado`);
            return { id: propertyId, title: 'Imóvel não encontrado', image: '', price: '', location: '' };
        }

        const propertyCard = propertyButton.closest('.property-card');
        if (!propertyCard) {
            console.warn(`Card do imóvel ${propertyId} não encontrado`);
            return { id: propertyId, title: 'Card não encontrado', image: '', price: '', location: '' };
        }

        console.log(`Analisando card do imóvel ${propertyId}`);
        
        const allText = propertyCard.textContent.trim();
        console.log('Texto completo do card:', allText);

        let title = '';
        let image = '';
        let price = '';
        let location = '';

        const titleElements = propertyCard.querySelectorAll('h1, h2, h3, h4, h5, h6, .title, .nome, .descricao, [class*="title"]');
        for (const el of titleElements) {
            const text = el.textContent.trim();
            if (text && text.length > 5 && !text.includes('R$') && !text.includes('m²')) {
                title = text;
                break;
            }
        }

        if (!title) {
            const lines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            for (const line of lines) {
                if (!line.includes('R$') && 
                    !line.includes('m²') && 
                    !line.includes('Cód.') &&
                    !line.includes(' - ') &&
                    line.length > 10) {
                    title = line;
                    break;
                }
            }
        }

        const imgEl = propertyCard.querySelector('img');
        if (imgEl && imgEl.src && !imgEl.src.includes('data:')) {
            image = imgEl.src;
        }

        const priceMatch = allText.match(/R\$\s*[\d,.]+(?:,\d{2})?/);
        if (priceMatch) {
            price = priceMatch[0];
        }

        const locationMatch = allText.match(/([A-Za-zÀ-ÿ\s]+)\s*-\s*([A-Za-zÀ-ÿ\s\/]+)/);
        if (locationMatch) {
            location = locationMatch[0];
        }

        if (!title) {
            const codeMatch = allText.match(/C[óo]d\.?\s*(\d+)/);
            title = codeMatch ? `Imóvel Código ${codeMatch[1]}` : `Imóvel ${propertyId}`;
        }

        const result = { id: propertyId, title, image, price, location };
        console.log(`Dados capturados para ${propertyId}:`, result);
        
        return result;
    },

    createFavoriteItemHtml(property) {
        const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0xNDEuNjY3IDk1SDE1OC4zMzNWMTA1SDE0MS42NjdWOTVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
        
        return `
            <div class="favorite-item" data-property-id="${property.id}">
                <div class="favorite-image">
                    <img src="${property.image || placeholderImage}" alt="${property.title}" onerror="this.src='${placeholderImage}'">
                </div>
                <div class="favorite-content">
                    <h4 class="favorite-title">${property.title}</h4>
                    <p class="favorite-location">${property.location || 'Localização não informada'}</p>
                    <p class="favorite-price">${property.price || 'Preço sob consulta'}</p>
                </div>
                <button class="remove-favorite" onclick="NavbarModule.removeFavorite('${property.id}')" title="Remover dos favoritos"></button>
            </div>
        `;
    },

    removeFavorite(propertyId) {
        if (typeof CatalogModule !== 'undefined') {
            const favoriteButton = document.querySelector(`[data-property-id="${propertyId}"].favorite-btn`);
            if (favoriteButton && favoriteButton.classList.contains('active')) {
                favoriteButton.click();
            }
        }
        this.updateFavoritesContent();
    },

    submitContactData(data) {
        const message = `Mensagem enviada com sucesso!\n\nNome: ${data.nome}\nEmail: ${data.email}\nTelefone: ${data.telefone}\nWhatsApp: ${data.whatsapp}\nMensagem: ${data.mensagem}`;
        alert(message);
    },

    isElementVisible(element) {
        return element && element.offsetParent !== null;
    },

    api: {
        openQuemSomosModal: () => NavbarModule.openModal('quemSomos'),
        closeQuemSomosModal: () => NavbarModule.closeModal('quemSomos'),
        openFaleConoscoModal: () => NavbarModule.openModal('faleConosco'),
        closeFaleConoscoModal: () => NavbarModule.closeModal('faleConosco'),
        openFavoritosModal: () => NavbarModule.openFavoritesModal(),
        closeFavoritosModal: () => NavbarModule.closeModal('favoritos'),
        updateFavorites: () => NavbarModule.updateFavoritesContent(),
        toggleMenu: () => NavbarModule.toggleMenu(),
        closeAllDropdowns: () => NavbarModule.closeAllDropdowns()
    },

    destroy() {
        if (this.menuButton) {
            this.menuButton.removeEventListener('click', this.toggleMenu);
        }
        
        this.dropdownToggles.forEach(toggle => {
            toggle.removeEventListener('click', this.handleDropdownToggle);
        });
        
        document.removeEventListener('click', this.handleDocumentClick);
        window.removeEventListener('click', this.handleWindowClick);
        document.removeEventListener('keydown', this.setupKeyboardNavigation);
        
        if (this.forms.contact) {
            this.forms.contact.removeEventListener('submit', this.handleContactForm);
        }
        
        document.body.style.overflow = 'auto';
    }
};

function openModal() {
    NavbarModule.api.openQuemSomosModal();
}

function closeModal() {
    NavbarModule.api.closeQuemSomosModal();
}

function openContactModal() {
    NavbarModule.api.openFaleConoscoModal();
}

function closeContactModal() {
    NavbarModule.api.closeFaleConoscoModal();
}

function openFavoritesModal() {
    NavbarModule.api.openFavoritosModal();
}

function closeFavoritesModal() {
    NavbarModule.api.closeFavoritosModal();
}

function submitContactForm(event) {
    NavbarModule.handleContactForm(event);
}

// Hero
const HeroModule = {
    swiper: null,
    swiperElement: null,
    config: {
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        speed: 800,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    },

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    },

    setup() {
        this.swiperElement = document.querySelector('.swiper');
        
        if (!this.swiperElement) {
            console.warn('HeroModule: Elemento .swiper não encontrado');
            return;
        }

        if (typeof Swiper === 'undefined') {
            console.error('HeroModule: Swiper library não encontrada');
            return;
        }

        this.createSwiper();
        this.bindHoverEvents();
    },

    createSwiper() {
        this.swiper = new Swiper(this.swiperElement, this.config);
    },

    bindHoverEvents() {
        if (!this.swiperElement || !this.swiper) return;

        this.swiperElement.addEventListener('mouseenter', () => {
            this.pauseAutoplay();
        });

        this.swiperElement.addEventListener('mouseleave', () => {
            this.resumeAutoplay();
        });
    },

    pauseAutoplay() {
        if (this.swiper && this.swiper.autoplay) {
            this.swiper.autoplay.stop();
        }
    },

    resumeAutoplay() {
        if (this.swiper && this.swiper.autoplay) {
            this.swiper.autoplay.start();
        }
    },

    goToSlide(index) {
        if (this.swiper) {
            this.swiper.slideTo(index);
        }
    },

    nextSlide() {
        if (this.swiper) {
            this.swiper.slideNext();
        }
    },

    prevSlide() {
        if (this.swiper) {
            this.swiper.slidePrev();
        }
    },

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.restart();
    },

    restart() {
        this.destroy();
        this.setup();
    },

    destroy() {
        if (this.swiper) {
            this.swiper.destroy(true, true);
            this.swiper = null;
        }
        
        if (this.swiperElement) {
            this.swiperElement.removeEventListener('mouseenter', this.pauseAutoplay);
            this.swiperElement.removeEventListener('mouseleave', this.resumeAutoplay);
        }
    },

    api: {
        pause: () => HeroModule.pauseAutoplay(),
        resume: () => HeroModule.resumeAutoplay(),
        next: () => HeroModule.nextSlide(),
        prev: () => HeroModule.prevSlide(),
        goTo: (index) => HeroModule.goToSlide(index),
        restart: () => HeroModule.restart(),
        updateConfig: (config) => HeroModule.updateConfig(config)
    }
};

// Search
const SearchModule = {
    form: null,
    searchButton: null,
    originalButtonText: 'BUSCAR',
    loadingButtonText: 'BUSCANDO...',
    loadingDuration: 3000,
    isSearching: false,

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    },

    setup() {
        this.cacheElements();
        this.bindEvents();
        this.setInitialState();
    },

    cacheElements() {
        this.form = document.querySelector('.searching');
        this.searchButton = document.querySelector('.btn-search');

        if (!this.form) {
            console.warn('SearchModule: Elemento .searching não encontrado');
        }

        if (!this.searchButton) {
            console.warn('SearchModule: Elemento .btn-search não encontrado');
        }
    },

    setInitialState() {
        if (this.searchButton) {
            this.originalButtonText = this.searchButton.innerHTML.trim() || 'BUSCAR';
        }
    },

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (event) => this.handleFormSubmit(event));
        }
    },

    handleFormSubmit(event) {
        if (this.isSearching) {
            event.preventDefault();
            return;
        }

        this.startSearching();
        
        setTimeout(() => {
            this.stopSearching();
        }, this.loadingDuration);
    },

    startSearching() {
        if (!this.searchButton) return;

        this.isSearching = true;
        this.searchButton.innerHTML = this.loadingButtonText;
        this.searchButton.disabled = true;
        this.searchButton.classList.add('searching-state');
    },

    stopSearching() {
        if (!this.searchButton) return;

        this.isSearching = false;
        this.searchButton.innerHTML = this.originalButtonText;
        this.searchButton.disabled = false;
        this.searchButton.classList.remove('searching-state');
    },

    updateButtonTexts(originalText, loadingText) {
        this.originalButtonText = originalText || this.originalButtonText;
        this.loadingButtonText = loadingText || this.loadingButtonText;
        
        if (!this.isSearching && this.searchButton) {
            this.searchButton.innerHTML = this.originalButtonText;
        }
    },

    updateLoadingDuration(duration) {
        this.loadingDuration = duration;
    },

    triggerSearch() {
        if (this.form && !this.isSearching) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            this.form.dispatchEvent(submitEvent);
        }
    },

    resetForm() {
        if (this.form) {
            this.form.reset();
        }
        this.stopSearching();
    },

    getFormData() {
        if (!this.form) return null;
        
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    },

    setFormData(data) {
        if (!this.form || !data) return;

        Object.keys(data).forEach(key => {
            const input = this.form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    },

    restart() {
        this.destroy();
        this.setup();
    },

    destroy() {
        if (this.form) {
            this.form.removeEventListener('submit', this.handleFormSubmit);
        }
        
        this.stopSearching();
        
        this.form = null;
        this.searchButton = null;
        this.isSearching = false;
    },

    api: {
        search: () => SearchModule.triggerSearch(),
        reset: () => SearchModule.resetForm(),
        start: () => SearchModule.startSearching(),
        stop: () => SearchModule.stopSearching(),
        getData: () => SearchModule.getFormData(),
        setData: (data) => SearchModule.setFormData(data),
        updateTexts: (original, loading) => SearchModule.updateButtonTexts(original, loading),
        updateDuration: (duration) => SearchModule.updateLoadingDuration(duration),
        restart: () => SearchModule.restart()
    }
};

// Catalog
const CatalogModule = {
    tabButtons: null,
    tabContents: null,
    favoriteButtons: null,
    activeTab: 'venda',
    gridClasses: {
        center2: 'center-2',
        center1: 'center-1'
    },

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    },

    setup() {
        this.cacheElements();
        this.bindEvents();
        this.setInitialState();
        
        // Carregar favoritos do localStorage após um delay
        setTimeout(() => {
            this.loadStoredFavorites();
        }, 500);
    },

    loadStoredFavorites() {
        if (typeof NavbarModule !== 'undefined' && NavbarModule.getFavoritesFromStorage) {
            const storedFavorites = NavbarModule.getFavoritesFromStorage();
            console.log(`CatalogModule: Carregando ${storedFavorites.length} favoritos salvos`);
            
            storedFavorites.forEach(favorite => {
                const button = document.querySelector(`[data-property-id="${favorite.id}"]`);
                if (button && !button.classList.contains('active')) {
                    button.classList.add('active');
                    console.log(`Favorito ${favorite.id} restaurado`);
                }
            });
        }
    },

    cacheElements() {
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.favoriteButtons = document.querySelectorAll('.favorite-btn');

        if (this.tabButtons.length === 0) {
            console.warn('CatalogModule: Nenhum .tab-button encontrado');
        }

        if (this.tabContents.length === 0) {
            console.warn('CatalogModule: Nenhum .tab-content encontrado');
        }
    },

    bindEvents() {
        this.bindTabEvents();
        this.ensurePropertyIds();
        this.bindFavoriteEvents();
    },

    bindTabEvents() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (event) => this.handleTabClick(event, button));
        });
    },

    bindFavoriteEvents() {
        this.favoriteButtons.forEach(button => {
            // Remover listeners antigos se existirem
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', (event) => this.handleFavoriteClick(event, newButton));
        });
        
        // Atualizar referência para os novos botões
        this.favoriteButtons = document.querySelectorAll('.favorite-btn');
    },

    ensurePropertyIds() {
        this.favoriteButtons.forEach((button, index) => {
            if (!button.getAttribute('data-property-id')) {
                const propertyCard = button.closest('.property-card');
                if (propertyCard) {
                    // Tentar pegar do código visível
                    const codeElement = propertyCard.querySelector('[class*="cod"], [class*="code"]');
                    if (codeElement) {
                        const codeText = codeElement.textContent.trim();
                        const codeMatch = codeText.match(/\d+/);
                        if (codeMatch) {
                            button.setAttribute('data-property-id', codeMatch[0]);
                            console.log(`ID ${codeMatch[0]} adicionado ao botão ${index + 1}`);
                        }
                    }
                }
                
                // Fallback: usar índice
                if (!button.getAttribute('data-property-id')) {
                    button.setAttribute('data-property-id', `property-${index + 1}`);
                    console.log(`ID fallback property-${index + 1} adicionado`);
                }
            }
        });
    },

    setInitialState() {
        setTimeout(() => {
            this.adjustGrid(this.activeTab);
        }, 50);
    },

    handleTabClick(event, button) {
        event.preventDefault();
        
        const targetTab = button.getAttribute('data-tab');
        if (!targetTab) {
            console.warn('CatalogModule: data-tab attribute não encontrado');
            return;
        }

        this.switchTab(targetTab);
    },

    switchTab(targetTab) {
        this.deactivateAllTabs();
        this.activateTab(targetTab);
        this.activeTab = targetTab;

        setTimeout(() => {
            this.adjustGrid(targetTab);
        }, 50);
    },

    deactivateAllTabs() {
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));
    },

    activateTab(targetTab) {
        const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
        const targetContent = document.getElementById(`tab-${targetTab}`);

        if (targetButton) {
            targetButton.classList.add('active');
        }

        if (targetContent) {
            targetContent.classList.add('active');
        } else {
            console.warn(`CatalogModule: Tab content #tab-${targetTab} não encontrado`);
        }
    },

    adjustGrid(tab) {
        const activeContent = document.getElementById(`tab-${tab}`);
        if (!activeContent) return;

        const grid = activeContent.querySelector('.properties-grid');
        if (!grid) return;

        const cards = grid.querySelectorAll('.property-card');
        
        this.resetGridClasses(grid);
        this.applyGridClasses(grid, cards.length);
    },

    resetGridClasses(grid) {
        grid.classList.remove(this.gridClasses.center2, this.gridClasses.center1);
    },

    applyGridClasses(grid, cardCount) {
        if (cardCount === 2) {
            grid.classList.add(this.gridClasses.center2);
        } else if (cardCount === 1) {
            grid.classList.add(this.gridClasses.center1);
        }
    },

    handleFavoriteClick(event, button) {
        event.stopPropagation();
        event.preventDefault();
        this.toggleFavorite(button);
    },

    toggleFavorite(button) {
        const propertyId = button.getAttribute('data-property-id');
        if (!propertyId) {
            console.warn('Botão sem data-property-id');
            return;
        }

        const wasActive = button.classList.contains('active');
        
        if (wasActive) {
            // Remover favorito
            button.classList.remove('active');
            this.handleFavoriteChange(propertyId, false);
            console.log(`❤️ Favorito ${propertyId} removido`);
        } else {
            // Adicionar favorito
            button.classList.add('active');
            this.handleFavoriteChange(propertyId, true);
            console.log(`❤️ Favorito ${propertyId} adicionado`);
        }
    },

    handleFavoriteChange(propertyId, isFavorite) {
        if (typeof NavbarModule !== 'undefined' && NavbarModule.api) {
            if (isFavorite) {
                NavbarModule.api.addToFavorites(propertyId);
            } else {
                NavbarModule.api.removeFromFavorites(propertyId);
            }
        }
    },

    getActiveTab() {
        return this.activeTab;
    },

    getFavorites() {
        const favorites = [];
        const activeButtons = document.querySelectorAll('.favorite-btn.active');
        
        activeButtons.forEach(button => {
            const propertyId = button.getAttribute('data-property-id');
            if (propertyId) {
                favorites.push(propertyId);
            }
        });
        
        return favorites;
    },

    setFavorites(favoriteIds) {
        this.favoriteButtons.forEach(button => {
            const propertyId = button.getAttribute('data-property-id');
            if (propertyId && favoriteIds.includes(propertyId)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    },

    refreshGrid() {
        this.adjustGrid(this.activeTab);
    },

    updateFavoriteButtons() {
        this.favoriteButtons = document.querySelectorAll('.favorite-btn');
        this.ensurePropertyIds();
        this.bindFavoriteEvents();
    },

    restart() {
        this.destroy();
        this.setup();
    },

    destroy() {
        this.tabButtons.forEach(button => {
            button.removeEventListener('click', this.handleTabClick);
        });

        this.favoriteButtons.forEach(button => {
            button.removeEventListener('click', this.handleFavoriteClick);
        });

        this.tabButtons = null;
        this.tabContents = null;
        this.favoriteButtons = null;
        this.activeTab = 'venda';
    },

    api: {
        switchTab: (tab) => CatalogModule.switchTab(tab),
        getActiveTab: () => CatalogModule.getActiveTab(),
        getFavorites: () => CatalogModule.getFavorites(),
        setFavorites: (ids) => CatalogModule.setFavorites(ids),
        refreshGrid: () => CatalogModule.refreshGrid(),
        updateFavorites: () => CatalogModule.updateFavoriteButtons(),
        restart: () => CatalogModule.restart()
    }
};

// Financing modal
function openFinancingModal() {
    const modal = document.getElementById('financingModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeFinancingModal() {
    const modal = document.getElementById('financingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.addEventListener('click', function(event) {
    const financingModal = document.getElementById('financingModal');
    if (financingModal && event.target === financingModal) {
        closeFinancingModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeFinancingModal();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('financingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    const openButtons = document.querySelectorAll('[data-open-financing-modal], .open-financing-modal, #openFinancingBtn');
    openButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openFinancingModal();
        });
    });

    const closeButtons = document.querySelectorAll('[data-close-financing-modal], .close-financing-modal, #closeFinancingBtn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            closeFinancingModal();
        });
    });

    setupFormMasks();
    
    setupFormValidation();
});

function setupFormMasks() {
    const cpfInput = document.querySelector('.financing-form-control[name="cpf"]');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                e.target.value = value;
            }
        });
    }

    const dateInput = document.querySelector('.financing-form-control[name="nascimento"]');
    if (dateInput) {
        dateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
                e.target.value = value;
            }
        });
    }

    const phoneInput = document.querySelector('.financing-form-control[name="telefone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    }

    const moneyInputs = document.querySelectorAll('.financing-form-control[data-mask="#.##0,00"]');
    moneyInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value) {
                const numericValue = parseInt(value) / 100;
                const formattedValue = numericValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                e.target.value = 'R$ ' + formattedValue;
            } else {
                e.target.value = '';
            }
        });

        input.addEventListener('focus', function(e) {
            if (e.target.value.startsWith('R$ ')) {
                const numericValue = e.target.value.replace(/[^\d,]/g, '').replace(',', '.');
                if (numericValue) {
                    e.target.value = parseFloat(numericValue).toFixed(2).replace('.', ',');
                }
            }
        });

        input.addEventListener('blur', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            if (value) {
                const numericValue = parseInt(value) / 100;
                const formattedValue = numericValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                e.target.value = 'R$ ' + formattedValue;
            }
        });
    });
}

function setupFormValidation() {
    const financingForm = document.querySelector('#financingModal form');
    if (financingForm) {
        financingForm.addEventListener('submit', function(e) {
            const requiredFields = financingForm.querySelectorAll('.financing-form-control[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc2626';
                    isValid = false;
                } else {
                    field.style.borderColor = '#e5e7eb';
                }
            });

            const emailField = financingForm.querySelector('.financing-form-control[name="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.style.borderColor = '#dc2626';
                    isValid = false;
                } else {
                    emailField.style.borderColor = '#e5e7eb';
                }
            }

            const cpfField = financingForm.querySelector('.financing-form-control[name="cpf"]');
            if (cpfField && cpfField.value) {
                const cpfValue = cpfField.value.replace(/\D/g, '');
                if (cpfValue.length !== 11) {
                    cpfField.style.borderColor = '#dc2626';
                    isValid = false;
                } else {
                    cpfField.style.borderColor = '#e5e7eb';
                }
            }

            if (!isValid) {
                e.preventDefault();
                alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            }
        });
    }
}

function clearFinancingForm() {
    const form = document.querySelector('#financingModal form');
    if (form) {
        form.reset();
        const fields = form.querySelectorAll('.financing-form-control');
        fields.forEach(field => {
            field.style.borderColor = '#e5e7eb';
        });
    }
}

const originalCloseFinancingModal = closeFinancingModal;
closeFinancingModal = function() {
    clearFinancingForm();
    originalCloseFinancingModal();
};

// Adverts

document.addEventListener('DOMContentLoaded', function() {
    const arrow = document.querySelector('.minimal-arrow');
    const ctaMinimal = document.querySelector('.cta-minimal');
    const counter = document.querySelector('.counter');

    function animateCounter() {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            current = Math.floor(target * progress);
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    setTimeout(animateCounter, 500);

    arrow.addEventListener('click', function(e) {
        e.preventDefault();
        
        this.classList.add('clicked');
        
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 400);
        
        setTimeout(() => {
            window.open(ctaMinimal.href, '_blank');
        }, 200);
    });
});

// Footer
document.addEventListener('DOMContentLoaded', function() {
    
    const contactLinks = document.querySelectorAll('.footer-section a');
    
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(3px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            this.style.color = '#34d399';
            setTimeout(() => {
                this.style.color = '';
            }, 200);
        });
    });
    
    const emailLink = document.querySelector('a[href^="mailto:"]');
    
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            const email = this.getAttribute('href').replace('mailto:', '');
            console.log('Abrindo email para:', email);
        });
    }
    
});

function updateIndicator(newValue, newPercentage) {
    const priceElement = document.querySelector('.price');
    const indicatorContent = document.querySelector('.indicator-content');
    
    if (priceElement && indicatorContent) {
        priceElement.textContent = newValue;
        console.log('Indicador atualizado:', newValue, newPercentage);
    }
}

function addSocialLink(platform, url, iconClass) {
    const socialContainer = document.querySelector('.social');
    
    if (socialContainer) {
        const newLink = document.createElement('a');
        newLink.href = url;
        newLink.target = '_blank';
        newLink.className = `social-link ${platform}`;
        newLink.innerHTML = `<i class="${iconClass}"></i>`;
        
        socialContainer.appendChild(newLink);
        console.log('Link social adicionado:', platform);
    }
}

//fix


// Initialize the Green Banner Module
GreenBannerModule.init();
NavbarModule.init();
HeroModule.init();
SearchModule.init();
CatalogModule.init();