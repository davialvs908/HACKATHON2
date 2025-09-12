// Mapa Técnico JavaScript
let clientsData = [];
let currentRoute = [];
let selectedClient = null;
let mapOffset = { x: 0, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let firebaseReady = false;

// Wait for Firebase to be available
window.addEventListener('load', () => {
    if (window.firebaseAuth) {
        firebaseReady = true;
        loadClientsFromFirebase();
    }
});

// Sample client data
const sampleClients = [
    {
        id: 'client_1',
        name: 'João Silva',
        farm: 'Fazenda São José',
        address: 'Rodovia BR-101, Km 45, Zona Rural',
        phone: '(11) 99999-1111',
        equipment: '2 ordenhadeiras, 1 resfriador',
        lastVisit: '2024-01-15',
        priority: 'high',
        status: 'pending',
        position: { x: 150, y: 200 },
        notes: 'Necessita manutenção preventiva nas teteiras'
    },
    {
        id: 'client_2',
        name: 'Maria Santos',
        farm: 'Sítio Boa Vista',
        address: 'Estrada da Pedra, 123',
        phone: '(11) 99999-2222',
        equipment: '1 ordenhadeira',
        lastVisit: '2024-01-10',
        priority: 'medium',
        status: 'pending',
        position: { x: 300, y: 150 },
        notes: 'Relatório de problemas com pressão de vácuo'
    },
    {
        id: 'client_3',
        name: 'Pedro Oliveira',
        farm: 'Fazenda Esperança',
        address: 'Rua das Flores, 456',
        phone: '(11) 99999-3333',
        equipment: '3 ordenhadeiras, 2 resfriadores',
        lastVisit: '2024-01-20',
        priority: 'low',
        status: 'visited',
        position: { x: 450, y: 300 },
        notes: 'Sistema funcionando perfeitamente'
    },
    {
        id: 'client_4',
        name: 'Ana Costa',
        farm: 'Chácara Verde',
        address: 'Avenida Principal, 789',
        phone: '(11) 99999-4444',
        equipment: '1 ordenhadeira',
        lastVisit: '2024-01-12',
        priority: 'high',
        status: 'pending',
        position: { x: 200, y: 350 },
        notes: 'Urgente: Teteiras com vazamento'
    },
    {
        id: 'client_5',
        name: 'Carlos Mendes',
        farm: 'Fazenda Progresso',
        address: 'Estrada do Leite, Km 12',
        phone: '(11) 99999-5555',
        equipment: '2 ordenhadeiras',
        lastVisit: '2024-01-18',
        priority: 'medium',
        status: 'pending',
        position: { x: 350, y: 250 },
        notes: 'Calibração necessária nos reguladores'
    },
    {
        id: 'client_6',
        name: 'Lucia Ferreira',
        farm: 'Sítio das Palmeiras',
        address: 'Rua do Campo, 321',
        phone: '(11) 99999-6666',
        equipment: '1 ordenhadeira, 1 resfriador',
        lastVisit: '2024-01-08',
        priority: 'low',
        status: 'visited',
        position: { x: 500, y: 180 },
        notes: 'Manutenção preventiva realizada'
    },
    {
        id: 'client_7',
        name: 'Roberto Alves',
        farm: 'Fazenda Nova Era',
        address: 'Rodovia Estadual, Km 8',
        phone: '(11) 99999-7777',
        equipment: '4 ordenhadeiras, 3 resfriadores',
        lastVisit: '2024-01-22',
        priority: 'high',
        status: 'pending',
        position: { x: 100, y: 100 },
        notes: 'Sistema com falhas intermitentes'
    },
    {
        id: 'client_8',
        name: 'Fernanda Lima',
        farm: 'Chácara dos Sonhos',
        address: 'Estrada Rural, 654',
        phone: '(11) 99999-8888',
        equipment: '1 ordenhadeira',
        lastVisit: '2024-01-14',
        priority: 'medium',
        status: 'pending',
        position: { x: 400, y: 400 },
        notes: 'Treinamento de operadores necessário'
    }
];

// Initialize map
document.addEventListener('DOMContentLoaded', function() {
    if (firebaseReady) {
        loadClientsFromFirebase();
    } else {
        clientsData = [...sampleClients];
        renderMap();
        updateStats();
    }
    setupEventListeners();
});

async function loadClientsFromFirebase() {
    if (!firebaseReady || !window.firebaseAuth) {
        clientsData = [...sampleClients];
        renderMap();
        updateStats();
        return;
    }
    
    try {
        const firebaseClients = await window.firebaseAuth.getClientsData();
        if (firebaseClients && firebaseClients.length > 0) {
            clientsData = firebaseClients;
        } else {
            // If no clients in Firebase, use sample data and save them
            clientsData = [...sampleClients];
            for (const client of sampleClients) {
                await window.firebaseAuth.saveClientData(client);
            }
        }
        renderMap();
        updateStats();
    } catch (error) {
        console.error('Error loading clients from Firebase:', error);
        clientsData = [...sampleClients];
        renderMap();
        updateStats();
    }
}

function setupEventListeners() {
    // Filter controls
    document.getElementById('filterPriority').addEventListener('change', filterClients);
    document.getElementById('filterStatus').addEventListener('change', filterClients);
    document.getElementById('searchClient').addEventListener('input', filterClients);
    
    // Map dragging
    const mapArea = document.getElementById('mapArea');
    mapArea.addEventListener('mousedown', startDrag);
    mapArea.addEventListener('mousemove', drag);
    mapArea.addEventListener('mouseup', endDrag);
    mapArea.addEventListener('mouseleave', endDrag);
    
    // Touch events for mobile
    mapArea.addEventListener('touchstart', startDrag);
    mapArea.addEventListener('touchmove', drag);
    mapArea.addEventListener('touchend', endDrag);
}

function renderMap() {
    const mapArea = document.getElementById('mapArea');
    
    // Clear existing markers and routes
    mapArea.querySelectorAll('.client-marker, .route-line').forEach(el => el.remove());
    
    // Render client markers
    clientsData.forEach(client => {
        const marker = createClientMarker(client);
        mapArea.appendChild(marker);
    });
    
    // Render route if exists
    if (currentRoute.length > 1) {
        renderRoute();
    }
}

function createClientMarker(client) {
    const marker = document.createElement('div');
    marker.className = `client-marker priority-${client.priority} ${client.status === 'visited' ? 'visited' : ''}`;
    marker.style.left = `${client.position.x + mapOffset.x}px`;
    marker.style.top = `${client.position.y + mapOffset.y}px`;
    marker.innerHTML = `<i class="fas fa-user"></i>`;
    marker.title = `${client.name} - ${client.farm}`;
    
    marker.addEventListener('click', (e) => {
        e.stopPropagation();
        showClientDetails(client);
    });
    
    return marker;
}

function renderRoute() {
    const mapArea = document.getElementById('mapArea');
    
    for (let i = 0; i < currentRoute.length - 1; i++) {
        const start = currentRoute[i];
        const end = currentRoute[i + 1];
        
        const line = document.createElement('div');
        line.className = 'route-line';
        
        const dx = end.position.x - start.position.x;
        const dy = end.position.y - start.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        line.style.left = `${start.position.x + mapOffset.x}px`;
        line.style.top = `${start.position.y + mapOffset.y}px`;
        line.style.width = `${distance}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        mapArea.appendChild(line);
    }
}

function showClientDetails(client) {
    selectedClient = client;
    
    document.getElementById('clientName').textContent = client.name;
    document.getElementById('clientFarm').textContent = client.farm;
    document.getElementById('clientAddress').textContent = client.address;
    document.getElementById('clientPhone').textContent = client.phone;
    document.getElementById('clientEquipment').textContent = client.equipment;
    document.getElementById('lastVisit').textContent = formatDate(client.lastVisit);
    document.getElementById('clientNotes').textContent = client.notes;
    
    // Update priority badge
    const priorityBadge = document.getElementById('clientPriority');
    priorityBadge.textContent = getPriorityText(client.priority);
    priorityBadge.className = `priority-badge priority-${client.priority}`;
    
    document.getElementById('clientModal').style.display = 'flex';
}

function closeClientModal() {
    document.getElementById('clientModal').style.display = 'none';
    selectedClient = null;
}

function markAsVisited() {
    if (selectedClient) {
        selectedClient.status = 'visited';
        selectedClient.lastVisit = new Date().toISOString().split('T')[0];
        
        // Update in clientsData
        const index = clientsData.findIndex(c => c.id === selectedClient.id);
        if (index !== -1) {
            clientsData[index] = selectedClient;
        }
        
        renderMap();
        updateStats();
        closeClientModal();
        
        showNotification(`${selectedClient.name} marcado como visitado!`, 'success');
    }
}

function callClient() {
    if (selectedClient) {
        showNotification(`Ligando para ${selectedClient.name}...`, 'info');
        // In a real application, this would initiate a phone call
        setTimeout(() => {
            showNotification(`Chamada para ${selectedClient.phone} iniciada`, 'success');
        }, 1000);
    }
}

function planRoute() {
    const pendingClients = clientsData.filter(c => c.status === 'pending');
    
    if (pendingClients.length === 0) {
        showNotification('Não há clientes pendentes para planejar rota', 'info');
        return;
    }
    
    // Simple route planning: start from top-left, visit by priority
    const sortedClients = pendingClients.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    currentRoute = sortedClients;
    renderMap();
    updateRouteDistance();
    
    showNotification(`Rota planejada para ${currentRoute.length} clientes`, 'success');
}

function updateRouteDistance() {
    let totalDistance = 0;
    
    for (let i = 0; i < currentRoute.length - 1; i++) {
        const start = currentRoute[i];
        const end = currentRoute[i + 1];
        
        const dx = end.position.x - start.position.x;
        const dy = end.position.y - start.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Convert pixels to approximate kilometers (1 pixel = 0.1 km)
        totalDistance += distance * 0.1;
    }
    
    document.getElementById('routeDistance').textContent = `${totalDistance.toFixed(1)} km`;
}

function filterClients() {
    const priorityFilter = document.getElementById('filterPriority').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const searchTerm = document.getElementById('searchClient').value.toLowerCase();
    
    let filteredClients = [...sampleClients];
    
    // Apply filters
    if (priorityFilter !== 'all') {
        filteredClients = filteredClients.filter(c => c.priority === priorityFilter);
    }
    
    if (statusFilter !== 'all') {
        filteredClients = filteredClients.filter(c => c.status === statusFilter);
    }
    
    if (searchTerm) {
        filteredClients = filteredClients.filter(c => 
            c.name.toLowerCase().includes(searchTerm) || 
            c.farm.toLowerCase().includes(searchTerm)
        );
    }
    
    clientsData = filteredClients;
    renderMap();
    updateStats();
}

function updateStats() {
    const total = clientsData.length;
    const pending = clientsData.filter(c => c.status === 'pending').length;
    const visited = clientsData.filter(c => c.status === 'visited').length;
    
    document.getElementById('totalClients').textContent = total;
    document.getElementById('pendingClients').textContent = pending;
    document.getElementById('visitedClients').textContent = visited;
}

// Map dragging functionality
function startDrag(e) {
    isDragging = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    dragStart = { x: clientX - mapOffset.x, y: clientY - mapOffset.y };
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    mapOffset.x = clientX - dragStart.x;
    mapOffset.y = clientY - dragStart.y;
    
    renderMap();
    e.preventDefault();
}

function endDrag() {
    isDragging = false;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getPriorityText(priority) {
    const priorities = {
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa'
    };
    return priorities[priority] || priority;
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
    } else if (type === 'info') {
        notification.style.background = 'var(--primary-orange)';
    } else {
        notification.style.background = 'var(--warning-yellow)';
        notification.style.color = 'var(--dark-gray)';
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
