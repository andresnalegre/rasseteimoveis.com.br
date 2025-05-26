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
        faleConosco: null
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

function submitContactForm(event) {
    NavbarModule.handleContactForm(event);
}

// Hero

document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper('.swiper', {
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
        },
        on: {
            init: function() {
                const swiperEl = this.el;
                swiperEl.addEventListener('mouseenter', () => {
                    this.autoplay.stop();
                });
                swiperEl.addEventListener('mouseleave', () => {
                    this.autoplay.start();
                });
            }
        }
    });
});

// Search
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.searching');
    const searchButton = document.querySelector('.btn-search');
    
    form.addEventListener('submit', function(e) {
        searchButton.innerHTML = 'BUSCANDO...';
        searchButton.disabled = true;
        
        setTimeout(() => {
            searchButton.innerHTML = 'BUSCAR';
            searchButton.disabled = false;
        }, 3000);
    });
});

// Catalog
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            const targetTab = this.getAttribute('data-tab');
            document.getElementById(`tab-${targetTab}`).classList.add('active');

            setTimeout(() => {
                adjustGrid(targetTab);
            }, 50);
        });
    });

    function adjustGrid(tab) {
        const activeContent = document.getElementById(`tab-${tab}`);
        const grid = activeContent.querySelector('.properties-grid');
        const cards = grid.querySelectorAll('.property-card');
        
        grid.classList.remove('center-2', 'center-1');
        
        if (cards.length === 2) {
            grid.classList.add('center-2');
        } else if (cards.length === 1) {
            grid.classList.add('center-1');
        }
    }

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    adjustGrid('venda');
});

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
    
    const indicator = document.querySelector('.indicator-content');
    
    if (indicator) {
        setInterval(() => {
            indicator.style.opacity = '0.7';
            setTimeout(() => {
                indicator.style.opacity = '1';
            }, 500);
        }, 5000);
    }
    
    function smoothScroll() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    console.log('Footer carregado com sucesso!');
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

// Initialize the Green Banner Module
GreenBannerModule.init();
NavbarModule.init();