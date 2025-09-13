// Mapa Técnico JavaScript com Integração Google Maps
let map;
let directionsService;
let directionsRenderer;
let geocoder;
let clientsData = [];
let clientMarkers = [];
let currentRoute = [];
let selectedClient = null;
let firebaseReady = false;
let trafficLayer = null;
let trafficEnabled = false;

// Aguardar Firebase estar disponível
window.addEventListener('load', () => {
    if (window.firebaseAuth) {
        firebaseReady = true;
        loadClientsFromFirebase();
    }
});

// Dados de clientes de exemplo com endereços reais para geocoding
const sampleClients = [
    {
        id: 'client_1',
        name: 'João Silva',
        farm: 'Fazenda São José',
        address: 'Rodovia BR-101, Km 45, Zona Rural, São Paulo, SP',
        phone: '(11) 99999-1111',
        equipment: '2 ordenhadeiras, 1 resfriador',
        lastVisit: '2024-01-15',
        priority: 'high',
        status: 'pending',
        coordinates: null,
        notes: 'Necessita manutenção preventiva nas teteiras'
    },
    {
        id: 'client_2',
        name: 'Maria Santos',
        farm: 'Sítio Boa Vista',
        address: 'Estrada da Pedra, 123, São Paulo, SP',
        phone: '(11) 99999-2222',
        equipment: '1 ordenhadeira',
        lastVisit: '2024-01-10',
        priority: 'medium',
        status: 'pending',
        coordinates: null,
        notes: 'Relatório de problemas com pressão de vácuo'
    },
    {
        id: 'client_3',
        name: 'Pedro Oliveira',
        farm: 'Fazenda Esperança',
        address: 'Rua das Flores, 456, São Paulo, SP',
        phone: '(11) 99999-3333',
        equipment: '3 ordenhadeiras, 2 resfriadores',
        lastVisit: '2024-01-20',
        priority: 'low',
        status: 'visited',
        coordinates: null,
        notes: 'Sistema funcionando perfeitamente'
    },
    {
        id: 'client_4',
        name: 'Ana Costa',
        farm: 'Chácara Verde',
        address: 'Avenida Principal, 789, São Paulo, SP',
        phone: '(11) 99999-4444',
        equipment: '1 ordenhadeira',
        lastVisit: '2024-01-12',
        priority: 'high',
        status: 'pending',
        coordinates: null,
        notes: 'Urgente: Teteiras com vazamento'
    },
    {
        id: 'client_5',
        name: 'Carlos Mendes',
        farm: 'Fazenda Progresso',
        address: 'Estrada do Leite, Km 12, São Paulo, SP',
        phone: '(11) 99999-5555',
        equipment: '2 ordenhadeiras',
        lastVisit: '2024-01-18',
        priority: 'medium',
        status: 'pending',
        coordinates: null,
        notes: 'Calibração necessária nos reguladores'
    },
    {
        id: 'client_6',
        name: 'Lucia Ferreira',
        farm: 'Sítio das Palmeiras',
        address: 'Rua do Campo, 321, São Paulo, SP',
        phone: '(11) 99999-6666',
        equipment: '1 ordenhadeira, 1 resfriador',
        lastVisit: '2024-01-08',
        priority: 'low',
        status: 'visited',
        coordinates: null,
        notes: 'Manutenção preventiva realizada'
    },
    {
        id: 'client_7',
        name: 'Roberto Alves',
        farm: 'Fazenda Nova Era',
        address: 'Rodovia Estadual, Km 8, São Paulo, SP',
        phone: '(11) 99999-7777',
        equipment: '4 ordenhadeiras, 3 resfriadores',
        lastVisit: '2024-01-22',
        priority: 'high',
        status: 'pending',
        coordinates: null,
        notes: 'Sistema com falhas intermitentes'
    },
    {
        id: 'client_8',
        name: 'Fernanda Lima',
        farm: 'Chácara dos Sonhos',
        address: 'Estrada Rural, 654, São Paulo, SP',
        phone: '(11) 99999-8888',
        equipment: '1 ordenhadeira',
        lastVisit: '2024-01-14',
        priority: 'medium',
        status: 'pending',
        coordinates: null,
        notes: 'Treinamento de operadores necessário'
    }
];

// Inicializar Google Maps
function initMap() {
    // Usar configuração do google-maps-config.js
    const config = window.GOOGLE_MAPS_CONFIG || {
        DEFAULT_CENTER: { lat: -23.5505, lng: -46.6333 },
        DEFAULT_ZOOM: 10,
        MAP_STYLES: []
    };
    
    // Inicializar mapa
    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: config.DEFAULT_ZOOM,
        center: config.DEFAULT_CENTER,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: config.MAP_STYLES
    });
    
    // Inicializar serviços
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        suppressMarkers: true
    });
    directionsRenderer.setMap(map);
    
    geocoder = new google.maps.Geocoder();
    trafficLayer = new google.maps.TrafficLayer();
    
    // Carregar clientes e geocodificar endereços
    loadClientsAndGeocode();
    
    // Configurar event listeners
    setupEventListeners();
}

// Carregar clientes e geocodificar endereços
async function loadClientsAndGeocode() {
    if (firebaseReady && window.firebaseAuth) {
        try {
            const firebaseClients = await window.firebaseAuth.getClientsData();
            if (firebaseClients && firebaseClients.length > 0) {
                clientsData = firebaseClients;
            } else {
                clientsData = [...sampleClients];
                for (const client of sampleClients) {
                    await window.firebaseAuth.saveClientData(client);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar clientes do Firebase:', error);
            clientsData = [...sampleClients];
        }
    } else {
        clientsData = [...sampleClients];
    }
    
    // Geocodificar todos os endereços dos clientes
    await geocodeAllClients();
    
    // Renderizar marcadores
    renderClientMarkers();
    updateStats();
}

// Geocodificar todos os endereços dos clientes
async function geocodeAllClients() {
    const geocodePromises = clientsData.map(client => geocodeClient(client));
    await Promise.all(geocodePromises);
}

// Geocodificar endereço de um cliente
function geocodeClient(client) {
    return new Promise((resolve) => {
        const config = window.GOOGLE_MAPS_CONFIG || {};
        const geocodingConfig = {
            address: client.address,
            region: config.GEOCODING?.region || 'BR',
            language: config.GEOCODING?.language || 'pt-BR'
        };
        
        geocoder.geocode(geocodingConfig, (results, status) => {
            if (status === 'OK' && results[0]) {
                client.coordinates = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                };
            } else {
                // Coordenadas aleatórias ao redor do centro padrão se geocoding falhar
                const defaultCenter = config.DEFAULT_CENTER || { lat: -23.5505, lng: -46.6333 };
                client.coordinates = {
                    lat: defaultCenter.lat + (Math.random() - 0.5) * 0.2,
                    lng: defaultCenter.lng + (Math.random() - 0.5) * 0.2
                };
                console.warn(`Geocoding falhou para ${client.name}: ${status}`);
            }
            resolve();
        });
    });
}

// Renderizar marcadores dos clientes no mapa
function renderClientMarkers() {
    // Limpar marcadores existentes
    clientMarkers.forEach(marker => marker.setMap(null));
    clientMarkers = [];
    
    clientsData.forEach(client => {
        if (client.coordinates) {
            const marker = createClientMarker(client);
            clientMarkers.push(marker);
        }
    });
}

// Criar marcador de cliente
function createClientMarker(client) {
    const icon = getMarkerIcon(client.priority, client.status);
    
    const marker = new google.maps.Marker({
        position: client.coordinates,
        map: map,
        title: `${client.name} - ${client.farm}`,
        icon: icon,
        animation: client.priority === 'high' ? google.maps.Animation.BOUNCE : null
    });
    
    // Criar janela de informações
    const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(client)
    });
    
    // Adicionar listener de clique
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
        selectedClient = client;
    });
    
    return marker;
}

// Obter ícone do marcador baseado na prioridade e status
function getMarkerIcon(priority, status) {
    const baseIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: getPriorityColor(priority, status),
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
    };
    
    if (status === 'visited') {
        baseIcon.fillOpacity = 0.6;
    }
    
    return baseIcon;
}

// Obter cor baseada na prioridade e status
function getPriorityColor(priority, status) {
    if (status === 'visited') {
        return '#9e9e9e';
    }
    
    switch (priority) {
        case 'high': return '#f44336';
        case 'medium': return '#ff9800';
        case 'low': return '#4caf50';
        default: return '#2196f3';
    }
}

// Criar conteúdo da janela de informações
function createInfoWindowContent(client) {
    return `
        <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 10px 0; color: var(--primary-orange);">${client.name}</h3>
            <p style="margin: 5px 0; font-weight: 600;">${client.farm}</p>
            <p style="margin: 5px 0;">${client.address}</p>
            <p style="margin: 5px 0;">📞 ${client.phone}</p>
            <p style="margin: 5px 0;">🔧 ${client.equipment}</p>
            <p style="margin: 5px 0;">📅 Última visita: ${formatDate(client.lastVisit)}</p>
            <p style="margin: 5px 0;">
                <span style="background: ${getPriorityColor(client.priority, client.status)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                    ${getPriorityText(client.priority)}
                </span>
            </p>
            <div style="margin-top: 10px;">
                <button onclick="showClientDetails('${client.id}')" style="background: var(--primary-orange); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 5px;">
                    Ver Detalhes
                </button>
                <button onclick="addToRoute('${client.id}')" style="background: var(--success-green); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Adicionar à Rota
                </button>
            </div>
        </div>
    `;
}

// Planejar rota usando Google Directions API
function planRoute() {
    const pendingClients = clientsData.filter(c => c.status === 'pending' && c.coordinates);
    
    if (pendingClients.length === 0) {
        showNotification('Não há clientes pendentes para planejar rota', 'info');
        return;
    }
    
    const optimizationType = document.getElementById('optimizationType').value;
    const routeMode = document.getElementById('routeMode').value;
    
    let waypoints = [...pendingClients];
    
    // Ordenar waypoints baseado no tipo de otimização
    if (optimizationType === 'priority') {
        waypoints.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    } else if (optimizationType === 'distance' || optimizationType === 'time') {
        // Usar otimização do Google
        waypoints = optimizeWaypoints(waypoints, optimizationType);
    }
    
    // Criar requisição de rota
    const config = window.GOOGLE_MAPS_CONFIG || {};
    const routingConfig = config.ROUTING || {};
    
    const request = {
        origin: waypoints[0].coordinates,
        destination: waypoints[waypoints.length - 1].coordinates,
        waypoints: waypoints.slice(1, -1).map(client => ({
            location: client.coordinates,
            stopover: true
        })),
        travelMode: google.maps.TravelMode[routeMode],
        optimizeWaypoints: optimizationType === 'distance' || optimizationType === 'time',
        avoidHighways: routingConfig.avoidHighways || false,
        avoidTolls: routingConfig.avoidTolls || false
    };
    
    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            currentRoute = waypoints;
            updateRouteStats(result);
            showNotification(`Rota planejada para ${waypoints.length} clientes`, 'success');
        } else {
            console.error('Falha na requisição de direções:', status);
            showNotification('Erro ao planejar rota. Tente novamente.', 'error');
        }
    });
}

// Otimizar waypoints usando matriz de distância
function optimizeWaypoints(waypoints, optimizationType) {
    // Por enquanto, retornar waypoints ordenados por prioridade
    // Em uma implementação completa, você usaria a API Distance Matrix do Google
    return waypoints.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}

// Atualizar estatísticas da rota
function updateRouteStats(result) {
    const route = result.routes[0];
    const leg = route.legs[0];
    
    let totalDistance = 0;
    let totalDuration = 0;
    
    route.legs.forEach(leg => {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;
    });
    
    document.getElementById('routeDistance').textContent = `${(totalDistance / 1000).toFixed(1)} km`;
    document.getElementById('routeTime').textContent = `${Math.round(totalDuration / 60)} min`;
    document.getElementById('routeClients').textContent = currentRoute.length;
}

// Otimizar rota usando algoritmos avançados
function optimizeRoute() {
    if (currentRoute.length === 0) {
        showNotification('Nenhuma rota ativa para otimizar', 'info');
        return;
    }
    
    // Re-planejar rota com configurações atuais
    planRoute();
}

// Limpar rota atual
function clearRoute() {
    directionsRenderer.setDirections({ routes: [] });
    currentRoute = [];
    document.getElementById('routeDistance').textContent = '0 km';
    document.getElementById('routeTime').textContent = '0 min';
    document.getElementById('routeClients').textContent = '0';
    showNotification('Rota removida', 'info');
}

// Alternar camada de tráfego
function toggleTraffic() {
    if (trafficEnabled) {
        trafficLayer.setMap(null);
        trafficEnabled = false;
        showNotification('Tráfego desabilitado', 'info');
    } else {
        trafficLayer.setMap(map);
        trafficEnabled = true;
        showNotification('Tráfego habilitado', 'info');
    }
}

// Adicionar cliente à rota
function addToRoute(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (client && !currentRoute.find(c => c.id === clientId)) {
        currentRoute.push(client);
        showNotification(`${client.name} adicionado à rota`, 'success');
    }
}

// Mostrar modal de detalhes do cliente
function showClientDetails(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;
    
    selectedClient = client;
    
    document.getElementById('clientName').textContent = client.name;
    document.getElementById('clientFarm').textContent = client.farm;
    document.getElementById('clientAddress').textContent = client.address;
    document.getElementById('clientPhone').textContent = client.phone;
    document.getElementById('clientEquipment').textContent = client.equipment;
    document.getElementById('lastVisit').textContent = formatDate(client.lastVisit);
    document.getElementById('clientNotes').textContent = client.notes;
    
    // Atualizar badge de prioridade
    const priorityBadge = document.getElementById('clientPriority');
    priorityBadge.textContent = getPriorityText(client.priority);
    priorityBadge.className = `priority-badge priority-${client.priority}`;
    
    const modal = document.getElementById('clientModal');
    modal.style.display = 'flex';
    
    // Prevenir scroll do body no mobile
    document.body.style.overflow = 'hidden';
    
    // Adicionar fechamento ao clicar no backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeClientModal();
        }
    });
}

function closeClientModal() {
    document.getElementById('clientModal').style.display = 'none';
    selectedClient = null;
    
    // Restore body scroll
    document.body.style.overflow = '';
}

function markAsVisited() {
    if (selectedClient) {
        selectedClient.status = 'visited';
        selectedClient.lastVisit = new Date().toISOString().split('T')[0];
        
        // Atualizar em clientsData
        const index = clientsData.findIndex(c => c.id === selectedClient.id);
        if (index !== -1) {
            clientsData[index] = selectedClient;
        }
        
        // Re-renderizar marcadores
        renderClientMarkers();
        updateStats();
        closeClientModal();
        
        showNotification(`${selectedClient.name} marcado como visitado!`, 'success');
    }
}

function callClient() {
    if (selectedClient) {
        showNotification(`Ligando para ${selectedClient.name}...`, 'info');
        // Em uma aplicação real, isso iniciaria uma chamada telefônica
        setTimeout(() => {
            showNotification(`Chamada para ${selectedClient.phone} iniciada`, 'success');
        }, 1000);
    }
}

function setupEventListeners() {
    // Controles de filtro
    document.getElementById('filterPriority').addEventListener('change', filterClients);
    document.getElementById('filterStatus').addEventListener('change', filterClients);
    document.getElementById('searchClient').addEventListener('input', filterClients);
    
    // Mudanças de modo de rota e otimização
    document.getElementById('routeMode').addEventListener('change', () => {
        if (currentRoute.length > 0) {
            planRoute();
        }
    });
    
    document.getElementById('optimizationType').addEventListener('change', () => {
        if (currentRoute.length > 0) {
            planRoute();
        }
    });
    
    // Handler de redimensionamento da janela
    window.addEventListener('resize', handleResize);
    
    // Handler de mudança de orientação
    window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 100);
    });
}

function handleResize() {
    if (map) {
        google.maps.event.trigger(map, 'resize');
    }
}

function filterClients() {
    const priorityFilter = document.getElementById('filterPriority').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const searchTerm = document.getElementById('searchClient').value.toLowerCase();
    
    let filteredClients = [...sampleClients];
    
    // Aplicar filtros
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
    renderClientMarkers();
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

// Funções utilitárias
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

// Adicionar animações CSS
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
