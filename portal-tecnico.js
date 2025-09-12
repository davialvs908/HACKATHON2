// Portal do Técnico JavaScript
let currentUser = null;
let userProgress = {
    videosWatched: 0,
    quizzesPassed: 0,
    certificatesEarned: 0
};

// Wait for Firebase to be available
let firebaseReady = false;
window.addEventListener('load', () => {
    if (window.firebaseAuth) {
        firebaseReady = true;
        initializeFirebaseAuth();
    }
});

// Sample data for courses
const coursesData = [
    {
        id: 'course_1',
        title: 'Fundamentos da Ordenha',
        description: 'Curso introdutório sobre os princípios básicos da ordenha mecânica e equipamentos.',
        duration: '2 horas',
        level: 'Iniciante',
        status: 'available',
        icon: 'fas fa-play-circle',
        videos: [
            {
                id: 'video_1',
                title: 'Introdução à Ordenha Mecânica',
                duration: '15 min',
                description: 'Conceitos básicos e histórico da ordenha mecânica',
                downloadUrl: 'https://example.com/videos/intro-ordenha.mp4',
                watchUrl: 'https://example.com/watch/intro-ordenha'
            },
            {
                id: 'video_2',
                title: 'Componentes do Sistema de Ordenha',
                duration: '20 min',
                description: 'Identificação e função de cada componente',
                downloadUrl: 'https://example.com/videos/componentes.mp4',
                watchUrl: 'https://example.com/watch/componentes'
            },
            {
                id: 'video_3',
                title: 'Segurança na Ordenha',
                duration: '25 min',
                description: 'Normas de segurança e boas práticas',
                downloadUrl: 'https://example.com/videos/seguranca.mp4',
                watchUrl: 'https://example.com/watch/seguranca'
            }
        ]
    },
    {
        id: 'course_2',
        title: 'Manutenção de Teteiras',
        description: 'Aprenda a realizar manutenção preventiva e corretiva em teteiras de acrílico.',
        duration: '3 horas',
        level: 'Intermediário',
        status: 'available',
        icon: 'fas fa-tools',
        videos: [
            {
                id: 'video_4',
                title: 'Identificação de Problemas em Teteiras',
                duration: '20 min',
                description: 'Como identificar desgastes e problemas',
                downloadUrl: 'https://example.com/videos/problemas-teteiras.mp4',
                watchUrl: 'https://example.com/watch/problemas-teteiras'
            },
            {
                id: 'video_5',
                title: 'Substituição de Teteiras de Acrílico',
                duration: '30 min',
                description: 'Processo completo de substituição',
                downloadUrl: 'https://example.com/videos/substituicao-teteiras.mp4',
                watchUrl: 'https://example.com/watch/substituicao-teteiras'
            },
            {
                id: 'video_6',
                title: 'Calibração e Testes de Funcionamento',
                duration: '25 min',
                description: 'Testes e calibração do sistema',
                downloadUrl: 'https://example.com/videos/calibracao.mp4',
                watchUrl: 'https://example.com/watch/calibracao'
            }
        ]
    },
    {
        id: 'course_3',
        title: 'Sistema de Vácuo e Reguladores',
        description: 'Conhecimento avançado sobre sistemas de vácuo e reguladores.',
        duration: '4 horas',
        level: 'Avançado',
        status: 'locked',
        icon: 'fas fa-cog',
        videos: [
            {
                id: 'video_7',
                title: 'Princípios do Sistema de Vácuo',
                duration: '30 min',
                description: 'Fundamentos físicos do vácuo na ordenha',
                downloadUrl: 'https://example.com/videos/vacuo-principios.mp4',
                watchUrl: 'https://example.com/watch/vacuo-principios'
            },
            {
                id: 'video_8',
                title: 'Manutenção de Reguladores',
                duration: '35 min',
                description: 'Manutenção preventiva e corretiva',
                downloadUrl: 'https://example.com/videos/reguladores.mp4',
                watchUrl: 'https://example.com/watch/reguladores'
            }
        ]
    }
];

// Sample data for quizzes
const quizzesData = [
    {
        id: 'quiz_1',
        title: 'Prova: Fundamentos da Ordenha',
        description: 'Avalie seus conhecimentos sobre os princípios básicos da ordenha.',
        passingScore: 70,
        timeLimit: 15,
        status: 'available',
        icon: 'fas fa-question-circle',
        questions: [
            {
                question: 'Qual é a pressão de vácuo ideal para ordenha?',
                options: ['30-35 kPa', '40-50 kPa', '20-25 kPa', '60-70 kPa'],
                correct: 1
            },
            {
                question: 'Qual componente é responsável por criar o vácuo?',
                options: ['Teteira', 'Bomba de vácuo', 'Regulador', 'Coletor'],
                correct: 1
            },
            {
                question: 'Com que frequência as teteiras devem ser substituídas?',
                options: ['A cada 6 meses', 'A cada 2.500 ordenhas', 'A cada ano', 'Quando quebrar'],
                correct: 1
            },
            {
                question: 'Qual é a temperatura ideal da água para limpeza?',
                options: ['30-35°C', '40-45°C', '50-55°C', '60-65°C'],
                correct: 2
            },
            {
                question: 'O que indica uma teteira com rachaduras?',
                options: ['Funcionamento normal', 'Necessidade de substituição', 'Calibração necessária', 'Limpeza inadequada'],
                correct: 1
            }
        ]
    },
    {
        id: 'quiz_2',
        title: 'Prova: Manutenção de Teteiras',
        description: 'Teste seus conhecimentos sobre manutenção de teteiras.',
        passingScore: 80,
        timeLimit: 20,
        status: 'locked',
        icon: 'fas fa-tools',
        questions: [
            {
                question: 'Qual é o material mais comum para teteiras?',
                options: ['Borracha', 'Acrílico', 'Silicone', 'Plástico'],
                correct: 1
            },
            {
                question: 'Como identificar desgaste em teteiras?',
                options: ['Apenas visualmente', 'Teste de pressão', 'Ambos visual e teste', 'Nenhuma das opções'],
                correct: 2
            },
            {
                question: 'Qual é a frequência recomendada para troca de teteiras?',
                options: ['A cada 6 meses', 'A cada 2.500 ordenhas', 'A cada ano', 'Quando quebrar'],
                correct: 1
            },
            {
                question: 'O que pode causar rachaduras em teteiras de acrílico?',
                options: ['Uso normal', 'Exposição ao sol', 'Limpeza inadequada', 'Todas as opções'],
                correct: 3
            },
            {
                question: 'Qual é a temperatura ideal para limpeza de teteiras?',
                options: ['30-35°C', '40-45°C', '50-55°C', '60-65°C'],
                correct: 2
            },
            {
                question: 'Como deve ser o armazenamento das teteiras?',
                options: ['Em local seco e escuro', 'Ao sol para secar', 'Em água', 'Não importa'],
                correct: 0
            }
        ]
    }
];

// Sample certificates data
const certificatesData = [
    {
        id: 'cert_1',
        title: 'Certificado de Fundamentos da Ordenha',
        description: 'Certificado de conclusão do curso básico',
        courseId: 'course_1',
        earned: false,
        earnedDate: null,
        downloadUrl: 'https://example.com/certificates/fundamentos.pdf'
    },
    {
        id: 'cert_2',
        title: 'Certificado de Manutenção de Teteiras',
        description: 'Certificado de conclusão do curso intermediário',
        courseId: 'course_2',
        earned: false,
        earnedDate: null,
        downloadUrl: 'https://example.com/certificates/teteiras.pdf'
    }
];

// Initialize portal
document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase is ready, otherwise use local storage
    if (firebaseReady) {
        initializeFirebaseAuth();
    } else {
        checkLoginStatus();
        loadUserData();
    }
});

function initializeFirebaseAuth() {
    if (!window.firebaseAuth) return;
    
    // Listen for auth state changes
    window.firebaseAuth.onAuthStateChange((user) => {
        if (user) {
            // User is signed in
            currentUser = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || 'Usuário'
            };
            
            // Load user data from Firebase
            loadUserDataFromFirebase();
            showPortalContent();
        } else {
            // User is signed out
            currentUser = null;
            showLoginForm();
        }
    });
}

function checkLoginStatus() {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('sanityCurrentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showPortalContent();
    } else {
        showLoginForm();
    }
}

function loadUserData() {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('sanityUserProgress');
    if (savedProgress) {
        const allProgress = JSON.parse(savedProgress);
        if (currentUser && allProgress[currentUser.id]) {
            userProgress = allProgress[currentUser.id];
        }
    }
}

async function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (firebaseReady && window.firebaseAuth) {
        // Use Firebase Authentication
        const result = await window.firebaseAuth.loginUser(email, password);
        
        if (result.success) {
            currentUser = result.user;
            showNotification('Login realizado com sucesso!', 'success');
        } else {
            showNotification(result.error, 'error');
        }
    } else {
        // Fallback to local storage
        const users = JSON.parse(localStorage.getItem('sanityTechUsers')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            
            localStorage.setItem('sanityCurrentUser', JSON.stringify(currentUser));
            loadUserData();
            showPortalContent();
            showNotification('Login realizado com sucesso!', 'success');
        } else {
            showNotification('Email ou senha incorretos!', 'error');
        }
    }
}

async function logout() {
    if (firebaseReady && window.firebaseAuth) {
        // Use Firebase logout
        const result = await window.firebaseAuth.logoutUser();
        if (result.success) {
            showNotification('Logout realizado com sucesso!', 'success');
        }
    } else {
        // Fallback to local storage
        currentUser = null;
        localStorage.removeItem('sanityCurrentUser');
        showLoginForm();
        showNotification('Logout realizado com sucesso!', 'success');
    }
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('portalContent').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('portalContent').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

async function register(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    
    if (firebaseReady && window.firebaseAuth) {
        // Use Firebase Authentication
        const result = await window.firebaseAuth.registerUser(email, password, name);
        
        if (result.success) {
            currentUser = result.user;
            showNotification('Conta criada com sucesso!', 'success');
        } else {
            showNotification(result.error, 'error');
        }
    } else {
        // Fallback to local storage
        const users = JSON.parse(localStorage.getItem('sanityTechUsers')) || [];
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            showNotification('Este email já está em uso!', 'error');
            return;
        }
        
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password
        };
        
        users.push(newUser);
        localStorage.setItem('sanityTechUsers', JSON.stringify(users));
        
        currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };
        
        localStorage.setItem('sanityCurrentUser', JSON.stringify(currentUser));
        loadUserData();
        showPortalContent();
        showNotification('Conta criada com sucesso!', 'success');
    }
}

function showPortalContent() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('portalContent').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
    
    // Update user info
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
    
    // Load all sections
    loadCourses();
    loadQuizzes();
    loadProgress();
    loadCertificates();
}

async function loadUserDataFromFirebase() {
    if (!firebaseReady || !window.firebaseAuth || !currentUser) return;
    
    try {
        // Load user data
        const userData = await window.firebaseAuth.getUserData(currentUser.uid);
        if (userData) {
            currentUser = { ...currentUser, ...userData };
        }
        
        // Load user progress
        const progress = await window.firebaseAuth.getUserProgress(currentUser.uid);
        if (progress) {
            userProgress = progress;
        }
    } catch (error) {
        console.error('Error loading user data from Firebase:', error);
    }
}

function switchTab(tabName) {
    // Remove active class from all tabs and sections
    document.querySelectorAll('.portal-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    
    // Add active class to selected tab and section
    event.target.classList.add('active');
    document.getElementById(tabName + 'Section').classList.add('active');
}

function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = '';
    
    coursesData.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        
        const isLocked = course.status === 'locked';
        const lockIcon = isLocked ? '<i class="fas fa-lock" style="color: var(--text-gray); margin-left: 0.5rem;"></i>' : '';
        
        courseCard.innerHTML = `
            <div class="course-header">
                <div class="course-icon">
                    <i class="${course.icon}"></i>
                </div>
                <div class="course-info">
                    <h3>${course.title}${lockIcon}</h3>
                </div>
            </div>
            <p style="color: var(--text-gray); margin-bottom: 1rem;">${course.description}</p>
            <div class="course-meta">
                <span><i class="fas fa-clock"></i> ${course.duration}</span>
                <span><i class="fas fa-signal"></i> ${course.level}</span>
            </div>
            <div class="course-videos">
                ${course.videos.map(video => `
                    <div class="video-item">
                        <div class="video-info">
                            <i class="fas fa-play video-icon"></i>
                            <div>
                                <div class="video-title">${video.title}</div>
                                <div class="video-duration">${video.duration}</div>
                            </div>
                        </div>
                        <div class="video-actions">
                            <button class="btn-watch" onclick="watchVideo('${video.id}')" ${isLocked ? 'disabled' : ''}>
                                <i class="fas fa-play"></i>
                                Assistir
                            </button>
                            <button class="btn-download" onclick="downloadVideo('${video.id}', '${video.title}')" ${isLocked ? 'disabled' : ''}>
                                <i class="fas fa-download"></i>
                                Baixar
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        coursesGrid.appendChild(courseCard);
    });
}

function loadQuizzes() {
    const quizGrid = document.getElementById('quizGrid');
    quizGrid.innerHTML = '';
    
    quizzesData.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        
        const isLocked = quiz.status === 'locked';
        const lockIcon = isLocked ? '<i class="fas fa-lock" style="color: var(--text-gray); margin-left: 0.5rem;"></i>' : '';
        
        quizCard.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-icon">
                    <i class="${quiz.icon}"></i>
                </div>
                <div class="quiz-info">
                    <h3>${quiz.title}${lockIcon}</h3>
                </div>
            </div>
            <p style="color: var(--text-gray); margin-bottom: 1rem;">${quiz.description}</p>
            <div class="quiz-meta">
                <span><i class="fas fa-question"></i> ${quiz.questions.length} questões</span>
                <span><i class="fas fa-clock"></i> ${quiz.timeLimit} min</span>
                <span><i class="fas fa-percentage"></i> ${quiz.passingScore}% para aprovação</span>
            </div>
            <div class="quiz-actions">
                <button class="btn-take-quiz" onclick="startQuiz('${quiz.id}')" ${isLocked ? 'disabled' : ''}>
                    <i class="fas fa-play"></i>
                    ${isLocked ? 'Bloqueado' : 'Iniciar Prova'}
                </button>
            </div>
        `;
        
        quizGrid.appendChild(quizCard);
    });
}

function loadProgress() {
    const progressStats = document.getElementById('progressStats');
    progressStats.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${userProgress.videosWatched}</div>
            <div class="stat-label">Vídeos Assistidos</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${userProgress.quizzesPassed}</div>
            <div class="stat-label">Provas Aprovadas</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${userProgress.certificatesEarned}</div>
            <div class="stat-label">Certificados</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${Math.round((userProgress.videosWatched + userProgress.quizzesPassed) / 2)}%</div>
            <div class="stat-label">Progresso Geral</div>
        </div>
    `;
}

function loadCertificates() {
    const certificatesGrid = document.getElementById('certificatesGrid');
    certificatesGrid.innerHTML = '';
    
    certificatesData.forEach(cert => {
        const certCard = document.createElement('div');
        certCard.className = 'certificate-card';
        
        certCard.innerHTML = `
            <div class="certificate-icon">
                <i class="fas fa-certificate"></i>
            </div>
            <div class="certificate-info">
                <h3>${cert.title}</h3>
                <p>${cert.description}</p>
                ${cert.earned ? 
                    `<p style="color: var(--success-green); font-weight: 600; margin-top: 0.5rem;">
                        <i class="fas fa-check-circle"></i> Conquistado em ${new Date(cert.earnedDate).toLocaleDateString('pt-BR')}
                    </p>` :
                    `<p style="color: var(--text-gray); font-style: italic; margin-top: 0.5rem;">Não conquistado ainda</p>`
                }
            </div>
            <button class="btn-download-cert" onclick="downloadCertificate('${cert.id}')" ${!cert.earned ? 'disabled' : ''}>
                <i class="fas fa-download"></i>
                ${cert.earned ? 'Baixar Certificado' : 'Bloqueado'}
            </button>
        `;
        
        certificatesGrid.appendChild(certCard);
    });
}

function watchVideo(videoId) {
    // Find video data
    let video = null;
    coursesData.forEach(course => {
        const foundVideo = course.videos.find(v => v.id === videoId);
        if (foundVideo) video = foundVideo;
    });
    
    if (video) {
        // Simulate watching video
        userProgress.videosWatched++;
        saveProgress();
        loadProgress();
        
        showNotification(`Abrindo vídeo: ${video.title}`, 'success');
        
        // In a real application, this would open the video player
        // For now, we'll just show a message
        setTimeout(() => {
            alert(`Vídeo: ${video.title}\nDuração: ${video.duration}\n\nEm uma aplicação real, este vídeo seria reproduzido aqui.`);
        }, 1000);
    }
}

function downloadVideo(videoId, videoTitle) {
    // Find video data
    let video = null;
    coursesData.forEach(course => {
        const foundVideo = course.videos.find(v => v.id === videoId);
        if (foundVideo) video = foundVideo;
    });
    
    if (video) {
        showNotification(`Iniciando download: ${videoTitle}`, 'success');
        
        // Simulate download progress
        setTimeout(() => {
            // Create a fake download link
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Vídeo: ${videoTitle}\nDuração: ${video.duration}\nDescrição: ${video.description}\n\nEste é um arquivo de exemplo. Em uma aplicação real, este seria o vídeo real para download.`);
            link.download = `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
            link.click();
            
            showNotification(`Download concluído: ${videoTitle}`, 'success');
        }, 1500);
    }
}

function startQuiz(quizId) {
    const quiz = quizzesData.find(q => q.id === quizId);
    if (quiz) {
        showNotification(`Iniciando prova: ${quiz.title}`, 'success');
        
        // Open quiz modal
        openQuizModal(quiz);
    }
}

function openQuizModal(quiz) {
    // Create quiz modal if it doesn't exist
    let quizModal = document.getElementById('quizModal');
    if (!quizModal) {
        quizModal = document.createElement('div');
        quizModal.id = 'quizModal';
        quizModal.className = 'modal';
        quizModal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
                <div class="quiz-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 id="quizTitle">${quiz.title}</h2>
                    <span class="close" onclick="closeQuizModal()" style="font-size: 2rem; cursor: pointer;">&times;</span>
                </div>
                
                <div class="quiz-progress" style="margin-bottom: 2rem;">
                    <div style="background: #f0f0f0; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div id="quizProgressFill" style="background: var(--gradient-primary); height: 100%; width: 0%; transition: width 0.3s ease;"></div>
                    </div>
                    <span id="quizProgressText" style="display: block; text-align: center; margin-top: 0.5rem; color: var(--text-gray);">Questão 1 de ${quiz.questions.length}</span>
                </div>
                
                <div id="quizQuestion" style="margin-bottom: 2rem;">
                    <!-- Question content will be loaded here -->
                </div>
                
                <div class="quiz-actions" style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-secondary" onclick="closeQuizModal()">Cancelar</button>
                    <button class="btn btn-primary" id="nextQuestionBtn" onclick="nextQuestion()" disabled>Próxima</button>
                </div>
            </div>
        `;
        document.body.appendChild(quizModal);
    }
    
    // Initialize quiz
    window.currentQuiz = quiz;
    window.currentQuestionIndex = 0;
    window.quizAnswers = [];
    
    // Show modal
    quizModal.style.display = 'block';
    
    // Show first question
    showQuestion();
}

function showQuestion() {
    const quiz = window.currentQuiz;
    const questionIndex = window.currentQuestionIndex;
    const question = quiz.questions[questionIndex];
    
    // Update progress
    const progress = ((questionIndex + 1) / quiz.questions.length) * 100;
    document.getElementById('quizProgressFill').style.width = progress + '%';
    document.getElementById('quizProgressText').textContent = `Questão ${questionIndex + 1} de ${quiz.questions.length}`;
    
    // Show question
    document.getElementById('quizQuestion').innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow-card);">
            <h3 style="margin-bottom: 1.5rem; color: var(--dark-gray);">${question.question}</h3>
            <div class="quiz-options" style="display: flex; flex-direction: column; gap: 1rem;">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" onclick="selectAnswer(${index})" style="padding: 1rem; border: 2px solid var(--light-gray); border-radius: var(--border-radius); cursor: pointer; transition: var(--transition);">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update next button
    const nextBtn = document.getElementById('nextQuestionBtn');
    nextBtn.disabled = true;
    nextBtn.textContent = questionIndex === quiz.questions.length - 1 ? 'Finalizar' : 'Próxima';
}

function selectAnswer(answerIndex) {
    // Remove previous selection
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.style.borderColor = 'var(--light-gray)';
        option.style.backgroundColor = 'transparent';
    });
    
    // Add selection to clicked option
    event.target.style.borderColor = 'var(--primary-orange)';
    event.target.style.backgroundColor = 'rgba(229, 90, 43, 0.1)';
    
    // Store answer
    window.quizAnswers[window.currentQuestionIndex] = answerIndex;
    
    // Enable next button
    document.getElementById('nextQuestionBtn').disabled = false;
}

function nextQuestion() {
    if (window.currentQuestionIndex < window.currentQuiz.questions.length - 1) {
        window.currentQuestionIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const quiz = window.currentQuiz;
    const correctAnswers = window.quizAnswers.filter((answer, index) => 
        answer === quiz.questions[index].correct
    ).length;
    
    const score = (correctAnswers / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;
    
    // Update progress
    if (passed) {
        userProgress.quizzesPassed++;
        saveProgress();
        loadProgress();
    }
    
    // Show result
    const resultMessage = passed ? 
        `Parabéns! Você passou na prova com ${score.toFixed(0)}%!` : 
        `Você obteve ${score.toFixed(0)}%. Necessário ${quiz.passingScore}% para aprovação.`;
    
    showNotification(resultMessage, passed ? 'success' : 'error');
    
    // Close modal
    closeQuizModal();
}

function closeQuizModal() {
    const quizModal = document.getElementById('quizModal');
    if (quizModal) {
        quizModal.style.display = 'none';
    }
    window.currentQuiz = null;
    window.currentQuestionIndex = 0;
    window.quizAnswers = [];
}

function downloadCertificate(certId) {
    const cert = certificatesData.find(c => c.id === certId);
    if (cert && cert.earned) {
        showNotification(`Baixando certificado: ${cert.title}`, 'success');
        
        // Simulate certificate download
        setTimeout(() => {
            // Create a fake certificate download
            const certificateContent = `
CERTIFICADO DE CONCLUSÃO
DIGISANITY MILK

Certificamos que ${currentUser.name}
concluiu com sucesso o curso:
${cert.title}

Data de conclusão: ${new Date().toLocaleDateString('pt-BR')}
Código do certificado: ${certId.toUpperCase()}

Este certificado é válido e pode ser verificado
através do portal DIGISANITY MILK.

DIGISANITY MILK
Equipamentos de Ordenha
            `;
            
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(certificateContent);
            link.download = `certificado_${cert.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
            link.click();
            
            showNotification(`Certificado baixado: ${cert.title}`, 'success');
        }, 1500);
    }
}

async function saveProgress() {
    if (currentUser) {
        if (firebaseReady && window.firebaseAuth) {
            // Save to Firebase
            try {
                await window.firebaseAuth.updateUserProgress(currentUser.uid, userProgress);
            } catch (error) {
                console.error('Error saving progress to Firebase:', error);
            }
        } else {
            // Fallback to local storage
            const allProgress = JSON.parse(localStorage.getItem('sanityUserProgress')) || {};
            allProgress[currentUser.id] = userProgress;
            localStorage.setItem('sanityUserProgress', JSON.stringify(allProgress));
        }
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: var(--shadow-hover);
    `;
    
    if (type === 'success') {
        notification.style.background = 'var(--success-green)';
    } else if (type === 'error') {
        notification.style.background = 'var(--error-red)';
    } else {
        notification.style.background = 'var(--primary-orange)';
    }
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function openMap() {
    // Redirect to map page
    window.location.href = 'mapa-tecnico.html';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
