// Global variables
let cart = [];
let cartTotal = 0;

// Sample data for kits and videos - Foco em equipamentos de ordenha
const kitsData = [
    {
        id: 1,
        title: "Kit Reparo Teteiras de Acrílico",
        description: "Kit completo para reparos e substituição de teteiras de borracha atóxica e peças de acrílico do sistema de ordenha.",
        category: "acrilico",
        difficulty: "facil",
        price: 40.00,
        features: ["4 teteiras de borracha atóxica", "Cola especial para acrílico", "Lixas 220 e 400", "Espátula plástica", "Luvas de proteção", "Manual instrutivo"],
        image: "fas fa-cube",
        icon: "🔧"
    },
    {
        id: 2,
        title: "Kit Manutenção Regulador de Vácuo",
        description: "Kit para manutenção e calibração do regulador de vácuo do sistema de ordenha.",
        category: "vacuo",
        difficulty: "medio",
        price: 50.00,
        features: ["Vacuômetro analógico", "Chaves de calibração", "Vedações de borracha", "Ferramentas específicas", "Manual técnico"],
        image: "fas fa-tachometer-alt",
        icon: "📊"
    },
    {
        id: 3,
        title: "Kit Reparo Torneira de Vácuo",
        description: "Kit para reparos na torneira de vácuo, incluindo vedações e mecanismo de alívio.",
        category: "hidraulico",
        difficulty: "facil",
        price: 40.00,
        features: ["Vedações de borracha", "Mecanismo de alívio", "Chave de grifo específica", "Fita veda rosca", "Guia de reparos"],
        image: "fas fa-faucet",
        icon: "🚰"
    },
    {
        id: 4,
        title: "Kit Manutenção Pulsador Pneumático",
        description: "Kit para manutenção do pulsador pneumático com relação 60/40.",
        category: "pneumatico",
        difficulty: "medio",
        price: 60.00,
        features: ["Diafragmas de reposição", "Vedações específicas", "Ferramentas de calibração", "Óleo lubrificante", "Manual técnico"],
        image: "fas fa-cog",
        icon: "⚙️"
    },
    {
        id: 5,
        title: "Kit Limpeza Lavador Interno",
        description: "Kit para limpeza e manutenção do lavador interno do conjunto de ordenha.",
        category: "limpeza",
        difficulty: "facil",
        price: 40.00,
        features: ["Detergente especializado", "Escovas de limpeza", "Desinfetante", "Luvas de proteção", "Manual de limpeza"],
        image: "fas fa-spray-can",
        icon: "🧽"
    },
    {
        id: 6,
        title: "Kit Reparo Coletor de Leite",
        description: "Kit para reparos no coletor de leite e conexões do sistema de ordenha.",
        category: "coletor",
        difficulty: "facil",
        price: 50.00,
        features: ["Conexões de reposição", "Vedações de borracha", "Tubos flexíveis", "Ferramentas básicas", "Manual instrutivo"],
        image: "fas fa-tint",
        icon: "🥛"
    }
];

const videosData = [
    {
        id: 1,
        title: "Como Trocar Teteiras de Acrílico",
        description: "Aprenda a trocar teteiras de borracha atóxica e peças de acrílico do sistema de ordenha de forma segura.",
        category: "acrilico",
        difficulty: "facil",
        duration: "8:45",
        thumbnail: "fas fa-cube",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 2,
        title: "Calibração do Regulador de Vácuo",
        description: "Tutorial completo para calibrar e manter o regulador de vácuo do sistema de ordenha.",
        category: "vacuo",
        difficulty: "medio",
        duration: "12:30",
        thumbnail: "fas fa-tachometer-alt",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 3,
        title: "Reparo da Torneira de Vácuo",
        description: "Como identificar e corrigir problemas na torneira de vácuo e seu mecanismo de alívio.",
        category: "hidraulico",
        difficulty: "facil",
        duration: "6:20",
        thumbnail: "fas fa-faucet",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 4,
        title: "Manutenção do Pulsador Pneumático",
        description: "Reparos e manutenção do pulsador pneumático com relação 60/40.",
        category: "pneumatico",
        difficulty: "medio",
        duration: "15:10",
        thumbnail: "fas fa-cog",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 5,
        title: "Limpeza do Lavador Interno",
        description: "Processo completo de limpeza e desinfecção do lavador interno do conjunto de ordenha.",
        category: "limpeza",
        difficulty: "facil",
        duration: "10:15",
        thumbnail: "fas fa-spray-can",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 6,
        title: "Reparo do Coletor de Leite",
        description: "Como reparar vazamentos e problemas no coletor de leite e suas conexões.",
        category: "coletor",
        difficulty: "facil",
        duration: "7:30",
        thumbnail: "fas fa-tint",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 7,
        title: "Manutenção Preventiva do Sistema",
        description: "Checklist completo para manutenção preventiva de todo o sistema de ordenha.",
        category: "manutencao",
        difficulty: "medio",
        duration: "18:45",
        thumbnail: "fas fa-tools",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 8,
        title: "Identificação de Problemas Comuns",
        description: "Como identificar e diagnosticar problemas comuns no sistema de ordenha.",
        category: "diagnostico",
        difficulty: "facil",
        duration: "11:20",
        thumbnail: "fas fa-search",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];

let filteredKits = [...kitsData];
let filteredVideos = [...videosData];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderKits();
    renderVideos();
    setupEventListeners();
    setupFAQ();
    setupSmoothScrolling();
    setupScrollAnimations();
    updateCartUI();
});

function setupEventListeners() {
    // Navigation smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        searchContent();
    });
}

function renderKits() {
    const kitsGrid = document.getElementById('kitsGrid');
    kitsGrid.innerHTML = '';

    filteredKits.forEach(kit => {
        const kitCard = document.createElement('div');
        kitCard.className = 'kit-card';
        kitCard.innerHTML = `
            <div class="kit-image">
                <div class="kit-icon-large">${kit.icon}</div>
                <i class="${kit.image}"></i>
            </div>
            <div class="kit-content">
                <h3><span class="kit-icon-small">${kit.icon}</span> ${kit.title}</h3>
                <p>${kit.description}</p>
                <ul class="kit-features">
                    ${kit.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
                <div class="kit-price">R$ ${kit.price.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="addToCart(${kit.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
        kitsGrid.appendChild(kitCard);
    });
}

function renderVideos() {
    const videosGrid = document.getElementById('videosGrid');
    videosGrid.innerHTML = '';

    filteredVideos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <div class="video-thumbnail" onclick="openVideoModal('${video.videoUrl}', '${video.title}', '${video.description}')">
                <i class="${video.thumbnail}"></i>
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-content">
                <h3>${video.title}</h3>
                <div class="video-meta">
                    <span><i class="fas fa-clock"></i> ${video.duration}</span>
                    <span class="video-duration">${getDifficultyText(video.difficulty)}</span>
                </div>
                <p>${video.description}</p>
            </div>
        `;
        videosGrid.appendChild(videoCard);
    });
}

function filterContent() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const difficultyFilter = document.getElementById('difficultyFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;

    // Filter kits
    filteredKits = kitsData.filter(kit => {
        const categoryMatch = !categoryFilter || kit.category === categoryFilter;
        const difficultyMatch = !difficultyFilter || kit.difficulty === difficultyFilter;
        const priceMatch = !priceFilter || checkPriceRange(kit.price, priceFilter);
        return categoryMatch && difficultyMatch && priceMatch;
    });

    // Filter videos
    filteredVideos = videosData.filter(video => {
        const categoryMatch = !categoryFilter || video.category === categoryFilter;
        const difficultyMatch = !difficultyFilter || video.difficulty === difficultyFilter;
        return categoryMatch && difficultyMatch;
    });

    renderKits();
    renderVideos();
}

function checkPriceRange(price, range) {
    switch(range) {
        case '0-45':
            return price <= 45;
        case '45-55':
            return price > 45 && price <= 55;
        case '55+':
            return price > 55;
        default:
            return true;
    }
}

function searchContent() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredKits = kitsData.filter(kit => 
        kit.title.toLowerCase().includes(searchTerm) ||
        kit.description.toLowerCase().includes(searchTerm) ||
        kit.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );

    filteredVideos = videosData.filter(video =>
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm)
    );

    renderKits();
    renderVideos();
}

function getDifficultyText(difficulty) {
    const difficulties = {
        'facil': 'Fácil',
        'medio': 'Médio',
        'dificil': 'Difícil'
    };
    return difficulties[difficulty] || difficulty;
}

function openVideoModal(videoUrl, title, description) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalVideo').src = videoUrl;
    document.getElementById('videoModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('modalVideo').src = '';
}

// FAQ functionality
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Smooth scrolling for navigation
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const offsetTop = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.stat-item, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Cart functions
function addToCart(kitId) {
    const kit = kitsData.find(k => k.id === kitId);
    if (!kit) return;
    
    const existingItem = cart.find(item => item.id === kitId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: kit.id,
            title: kit.title,
            price: kit.price,
            image: kit.image,
            icon: kit.icon,
            quantity: 1
        });
    }
    
    updateCartUI();
    showCartNotification();
}

function removeFromCart(kitId) {
    cart = cart.filter(item => item.id !== kitId);
    updateCartUI();
}

function updateQuantity(kitId, change) {
    const item = cart.find(item => item.id === kitId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(kitId);
    } else {
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="${item.image}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
        cartFooter.style.display = 'block';
    }
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'block';
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
}

function checkout() {
    if (cart.length === 0) return;
    
    // Simulate order processing
    const orderData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage (in a real app, this would go to a server)
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Clear cart
    cart = [];
    updateCartUI();
    
    // Close cart modal
    closeCart();
    
    // Show success modal
    const successModal = document.getElementById('successModal');
    successModal.style.display = 'block';
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.style.display = 'none';
}

function showCartNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Item adicionado ao carrinho!</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-green);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const videoModal = document.getElementById('videoModal');
    const cartModal = document.getElementById('cartModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === videoModal) {
        closeModal();
    }
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
}

