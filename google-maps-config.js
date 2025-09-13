// Configuração do Google Maps
// Chave da API configurada para uso com embed

const GOOGLE_MAPS_CONFIG = {
    // Chave da API do Google Maps para embed
    API_KEY: 'AIzaSyBAUwtoCN6GHLTG33FFKNxroaybLSmxqhM',
    
    // Configurações padrão do mapa
    DEFAULT_CENTER: {
        lat: -23.5505,  // São Paulo, SP
        lng: -46.6333
    },
    
    DEFAULT_ZOOM: 10,
    
    // Estilos personalizados do mapa
    MAP_STYLES: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ],
    
    // Configurações de geocoding
    GEOCODING: {
        region: 'BR',  // Brasil
        language: 'pt-BR'
    },
    
    // Configurações de rotas
    ROUTING: {
        avoidHighways: false,
        avoidTolls: false,
        optimizeWaypoints: true
    }
};

// Função para inicializar a API do Google Maps
function initializeGoogleMaps() {
    // Verificar se a chave da API foi configurada
    if (GOOGLE_MAPS_CONFIG.API_KEY === 'YOUR_API_KEY') {
        console.warn('⚠️ ATENÇÃO: Configure sua chave da API do Google Maps em google-maps-config.js');
        console.warn('Para obter uma chave gratuita, acesse: https://console.cloud.google.com/');
        
        // Mostrar notificação para o usuário
        showApiKeyWarning();
        return false;
    }
    
    return true;
}

// Mostrar aviso sobre a chave da API
function showApiKeyWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff9800;
        color: white;
        padding: 1rem;
        text-align: center;
        z-index: 10000;
        font-weight: 600;
    `;
    warningDiv.innerHTML = `
        ⚠️ Configure sua chave da API do Google Maps para usar todas as funcionalidades
        <button onclick="this.parentElement.remove()" style="margin-left: 1rem; background: white; color: #ff9800; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
            Entendi
        </button>
    `;
    document.body.appendChild(warningDiv);
}

// Função para obter a URL da API com a chave
function getGoogleMapsApiUrl() {
    return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.API_KEY}&libraries=geometry,places&callback=initMap`;
}

// Exportar configurações para uso global
window.GOOGLE_MAPS_CONFIG = GOOGLE_MAPS_CONFIG;
window.initializeGoogleMaps = initializeGoogleMaps;
window.getGoogleMapsApiUrl = getGoogleMapsApiUrl;
