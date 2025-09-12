// Global variables
let cart = [];
let cartTotal = 0;

// Tech Portal variables
let currentTechUser = null;
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizAnswers = [];
let techProgress = {
    videosWatched: 0,
    quizzesPassed: 0,
    certificatesEarned: 0
};

// Local users storage (simulating database)
let localUsers = JSON.parse(localStorage.getItem('sanityTechUsers')) || [];
let currentUserProgress = JSON.parse(localStorage.getItem('sanityUserProgress')) || {};

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

// Tech Portal Data
const techCourses = [
    {
        id: 1,
        title: "Fundamentos da Ordenha",
        description: "Curso introdutório sobre os princípios básicos da ordenha mecânica e equipamentos.",
        duration: "2 horas",
        level: "Iniciante",
        status: "available",
        videos: [
            { title: "Introdução à Ordenha", duration: "15 min", watched: false },
            { title: "Componentes Básicos", duration: "20 min", watched: false },
            { title: "Segurança na Ordenha", duration: "25 min", watched: false }
        ]
    },
    {
        id: 2,
        title: "Manutenção de Teteiras",
        description: "Aprenda a realizar manutenção preventiva e corretiva em teteiras de acrílico.",
        duration: "3 horas",
        level: "Intermediário",
        status: "locked",
        videos: [
            { title: "Identificação de Problemas", duration: "20 min", watched: false },
            { title: "Substituição de Teteiras", duration: "30 min", watched: false },
            { title: "Calibração e Testes", duration: "25 min", watched: false }
        ]
    },
    {
        id: 3,
        title: "Sistema de Vácuo",
        description: "Domine a manutenção e calibração do sistema de vácuo da ordenha.",
        duration: "4 horas",
        level: "Avançado",
        status: "locked",
        videos: [
            { title: "Princípios do Vácuo", duration: "25 min", watched: false },
            { title: "Regulador de Vácuo", duration: "35 min", watched: false },
            { title: "Diagnóstico de Problemas", duration: "30 min", watched: false }
        ]
    }
];

const techQuizzes = [
    {
        id: 1,
        title: "Prova: Fundamentos da Ordenha",
        description: "Avalie seus conhecimentos sobre os princípios básicos da ordenha.",
        questions: 5,
        passingScore: 70,
        timeLimit: 15,
        status: "available",
        questions: [
            {
                question: "Qual é a pressão de vácuo ideal para ordenha?",
                options: [
                    "30-35 kPa",
                    "40-50 kPa", 
                    "20-25 kPa",
                    "60-70 kPa"
                ],
                correct: 1
            },
            {
                question: "Qual componente é responsável por criar o vácuo?",
                options: [
                    "Teteira",
                    "Bomba de vácuo",
                    "Regulador",
                    "Coletor"
                ],
                correct: 1
            },
            {
                question: "Com que frequência as teteiras devem ser substituídas?",
                options: [
                    "A cada 6 meses",
                    "A cada 2.500 ordenhas",
                    "A cada ano",
                    "Quando quebrar"
                ],
                correct: 1
            },
            {
                question: "Qual é a temperatura ideal da água para limpeza?",
                options: [
                    "30-35°C",
                    "40-45°C",
                    "50-55°C",
                    "60-65°C"
                ],
                correct: 2
            },
            {
                question: "O que indica uma teteira com rachaduras?",
                options: [
                    "Funcionamento normal",
                    "Necessidade de substituição",
                    "Calibração necessária",
                    "Limpeza inadequada"
                ],
                correct: 1
            }
        ]
    },
    {
        id: 2,
        title: "Prova: Manutenção de Teteiras",
        description: "Teste seus conhecimentos sobre manutenção de teteiras de acrílico.",
        questions: 5,
        passingScore: 80,
        timeLimit: 20,
        status: "locked",
        questions: [
            {
                question: "Qual ferramenta é essencial para remoção de teteiras?",
                options: [
                    "Chave de fenda",
                    "Chave específica para teteiras",
                    "Martelo",
                    "Alicate"
                ],
                correct: 1
            },
            {
                question: "Como identificar uma teteira com vazamento?",
                options: [
                    "Visualmente",
                    "Teste de vácuo",
                    "Ambos os métodos",
                    "Nenhum método"
                ],
                correct: 2
            }
        ]
    }
];

let filteredKits = [...kitsData];
let filteredVideos = [...videosData];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderKits();
    renderVideos();
    setupEventListeners();
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

function addToCart(kitId) {
    const kit = kitsData.find(k => k.id === kitId);
    alert(`Kit "${kit.title}" adicionado ao carrinho!`);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target === modal) {
        closeModal();
    }
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
                const navHeight = document.querySelector('nav').offsetHeight;
                const offsetTop = target.offsetTop - headerHeight - navHeight - 20;
                
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




function techRegister(event) {
    event.preventDefault();
    const name = document.getElementById('techName').value;
    const email = document.getElementById('techEmailReg').value;
    const password = document.getElementById('techPasswordReg').value;
    const confirmPassword = document.getElementById('techPasswordConfirm').value;
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    
    if (!name || !email || !password) {
        showNotification('Preencha todos os campos!', 'error');
        return;
    }
    
    // Check if email already exists
    const existingUser = localUsers.find(u => u.email === email);
    if (existingUser) {
        showNotification('Email já está em uso!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    // Add to local storage
    localUsers.push(newUser);
    localStorage.setItem('sanityTechUsers', JSON.stringify(localUsers));
    
    // Initialize user progress
    currentUserProgress[newUser.id] = {
        videosWatched: 0,
        quizzesPassed: 0,
        certificatesEarned: 0
    };
    localStorage.setItem('sanityUserProgress', JSON.stringify(currentUserProgress));
    
    currentTechUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    };
    
    techProgress = currentUserProgress[newUser.id];
    
    closeTechModal();
    openTechDashboard();
    showNotification('Cadastro realizado com sucesso!', 'success');
}

function openTechDashboard() {
    const dashboardModal = document.getElementById('techDashboardModal');
    const userName = document.getElementById('techUserName');
    
    if (currentTechUser) {
        userName.textContent = currentTechUser.name;
    }
    
    dashboardModal.style.display = 'block';
    renderTechDashboard();
}

function closeTechDashboard() {
    const dashboardModal = document.getElementById('techDashboardModal');
    dashboardModal.style.display = 'none';
}

function switchDashboardTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dashboard-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected tab
    document.getElementById(tab + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

function renderTechDashboard() {
    renderCourses();
    renderQuizzes();
    renderProgress();
    renderCertificates();
}

function renderCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = techCourses.map(course => `
        <div class="course-card">
            <div class="course-header">
                <h3 class="course-title">${course.title}</h3>
                <span class="course-status status-${course.status}">
                    ${course.status === 'available' ? 'Disponível' : 
                      course.status === 'completed' ? 'Concluído' : 'Bloqueado'}
                </span>
            </div>
            <p class="course-description">${course.description}</p>
            <div class="course-meta">
                <span><i class="fas fa-clock"></i> ${course.duration}</span>
                <span><i class="fas fa-signal"></i> ${course.level}</span>
            </div>
            <div class="course-actions">
                <button class="btn-start" onclick="startCourse(${course.id})" 
                        ${course.status === 'locked' ? 'disabled' : ''}>
                    <i class="fas fa-play"></i>
                    ${course.status === 'available' ? 'Iniciar' : 
                      course.status === 'completed' ? 'Revisar' : 'Bloqueado'}
                </button>
            </div>
        </div>
    `).join('');
}

function renderQuizzes() {
    const quizzesGrid = document.getElementById('quizzesGrid');
    quizzesGrid.innerHTML = techQuizzes.map(quiz => `
        <div class="quiz-card">
            <div class="quiz-header">
                <h3 class="quiz-title">${quiz.title}</h3>
                <span class="quiz-status status-${quiz.status}">
                    ${quiz.status === 'available' ? 'Disponível' : 
                      quiz.status === 'completed' ? 'Concluído' : 'Bloqueado'}
                </span>
            </div>
            <p class="quiz-description">${quiz.description}</p>
            <div class="quiz-meta">
                <span><i class="fas fa-question-circle"></i> ${quiz.questions} perguntas</span>
                <span><i class="fas fa-clock"></i> ${quiz.timeLimit} min</span>
            </div>
            <div class="quiz-actions">
                <button class="btn-take" onclick="startQuiz(${quiz.id})" 
                        ${quiz.status === 'locked' ? 'disabled' : ''}>
                    <i class="fas fa-play"></i>
                    ${quiz.status === 'available' ? 'Iniciar Prova' : 
                      quiz.status === 'completed' ? 'Refazer' : 'Bloqueado'}
                </button>
            </div>
        </div>
    `).join('');
}

function renderProgress() {
    document.getElementById('videosWatched').textContent = techProgress.videosWatched;
    document.getElementById('quizzesPassed').textContent = techProgress.quizzesPassed;
    document.getElementById('certificatesEarned').textContent = techProgress.certificatesEarned;
}

function renderCertificates() {
    const certificatesGrid = document.getElementById('certificatesGrid');
    const certificates = [
        {
            title: "Certificado de Fundamentos",
            description: "Concluído com sucesso o curso de Fundamentos da Ordenha",
            date: "15/12/2024",
            status: "earned"
        },
        {
            title: "Certificado de Manutenção",
            description: "Aprovação na prova de Manutenção de Teteiras",
            date: "Em andamento",
            status: "pending"
        }
    ];
    
    certificatesGrid.innerHTML = certificates.map(cert => `
        <div class="certificate-card">
            <div class="certificate-header">
                <h3 class="certificate-title">${cert.title}</h3>
                <span class="certificate-status status-${cert.status}">
                    ${cert.status === 'earned' ? 'Conquistado' : 'Pendente'}
                </span>
            </div>
            <p class="certificate-description">${cert.description}</p>
            <div class="certificate-meta">
                <span><i class="fas fa-calendar"></i> ${cert.date}</span>
            </div>
            <div class="certificate-actions">
                <button class="btn-view" ${cert.status === 'pending' ? 'disabled' : ''}>
                    <i class="fas fa-download"></i>
                    ${cert.status === 'earned' ? 'Baixar' : 'Indisponível'}
                </button>
            </div>
        </div>
    `).join('');
}

function startCourse(courseId) {
    const course = techCourses.find(c => c.id === courseId);
    if (course) {
        showNotification(`Iniciando curso: ${course.title}`, 'success');
        // In real app, this would open the course player
    }
}

function startQuiz(quizId) {
    const quiz = techQuizzes.find(q => q.id === quizId);
    if (quiz) {
        currentQuiz = quiz;
        currentQuestionIndex = 0;
        quizAnswers = [];
        openQuizModal();
    }
}

function openQuizModal() {
    const quizModal = document.getElementById('quizModal');
    const quizTitle = document.getElementById('quizTitle');
    
    quizTitle.textContent = currentQuiz.title;
    quizModal.style.display = 'block';
    
    showQuestion();
}

function closeQuizModal() {
    const quizModal = document.getElementById('quizModal');
    quizModal.style.display = 'none';
    currentQuiz = null;
    currentQuestionIndex = 0;
    quizAnswers = [];
}

function showQuestion() {
    const quizContent = document.getElementById('quizContent');
    const quizProgress = document.getElementById('quizProgress');
    const quizProgressText = document.getElementById('quizProgressText');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    const question = currentQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    
    quizProgress.style.width = progress + '%';
    quizProgressText.textContent = `Pergunta ${currentQuestionIndex + 1} de ${currentQuiz.questions.length}`;
    
    quizContent.innerHTML = `
        <div class="quiz-question">
            <h3>${question.question}</h3>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" onclick="selectAnswer(${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    nextBtn.textContent = currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finalizar' : 'Próxima';
    nextBtn.disabled = true;
}

function selectAnswer(answerIndex) {
    // Remove previous selection
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    event.target.classList.add('selected');
    
    // Store answer
    quizAnswers[currentQuestionIndex] = answerIndex;
    
    // Enable next button
    document.getElementById('nextQuestionBtn').disabled = false;
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const correctAnswers = quizAnswers.filter((answer, index) => 
        answer === currentQuiz.questions[index].correct
    ).length;
    
    const score = (correctAnswers / currentQuiz.questions.length) * 100;
    const passed = score >= currentQuiz.passingScore;
    
    // Save quiz result to localStorage
    const quizResult = {
        quizId: currentQuiz.id,
        quizTitle: currentQuiz.title,
        score: Math.round(score),
        passed: passed,
        answers: quizAnswers,
        completedAt: new Date().toISOString()
    };
    
    // Get existing quiz results
    let quizResults = JSON.parse(localStorage.getItem('sanityQuizResults')) || {};
    if (!quizResults[currentTechUser.id]) {
        quizResults[currentTechUser.id] = [];
    }
    quizResults[currentTechUser.id].push(quizResult);
    localStorage.setItem('sanityQuizResults', JSON.stringify(quizResults));
    
    // Update user progress
    if (passed) {
        techProgress.quizzesPassed++;
        currentUserProgress[currentTechUser.id] = techProgress;
        localStorage.setItem('sanityUserProgress', JSON.stringify(currentUserProgress));
    }
    
    if (passed) {
        showNotification(`Parabéns! Você passou na prova com ${score.toFixed(0)}%!`, 'success');
    } else {
        showNotification(`Você obteve ${score.toFixed(0)}%. Necessário ${currentQuiz.passingScore}% para aprovação.`, 'error');
    }
    
    closeQuizModal();
    renderProgress();
}

function techLogout() {
    // Save current progress before logout
    if (currentTechUser) {
        currentUserProgress[currentTechUser.id] = techProgress;
        localStorage.setItem('sanityUserProgress', JSON.stringify(currentUserProgress));
    }
    
    currentTechUser = null;
    closeTechDashboard();
    showNotification('Logout realizado com sucesso!', 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-green)' : 'var(--error-red)'};
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize local sample data
function initializeLocalData() {
    // Create a test user if none exists
    if (localUsers.length === 0) {
        const testUser = {
            id: 'test_user_001',
            name: 'Técnico Teste',
            email: 'tecnico@sanity.com',
            password: '123456',
            createdAt: new Date().toISOString()
        };
        
        localUsers.push(testUser);
        localStorage.setItem('sanityTechUsers', JSON.stringify(localUsers));
        
        // Initialize test user progress
        currentUserProgress[testUser.id] = {
            videosWatched: 0,
            quizzesPassed: 0,
            certificatesEarned: 0
        };
        localStorage.setItem('sanityUserProgress', JSON.stringify(currentUserProgress));
        
        console.log('Test user created: tecnico@sanity.com / 123456');
    }
    
    console.log('Local system initialized successfully');
    console.log('Users stored in localStorage:', localUsers.length);
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    renderKits();
    renderVideos();
    setupEventListeners();
    setupFAQ();
    setupSmoothScrolling();
    setupScrollAnimations();
    updateCartUI();
    
    // Initialize local system
    initializeLocalData();
});
