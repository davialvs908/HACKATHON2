# 🐄 SANITY MILK - Equipamentos de Ordenha

## 📋 Sobre o Projeto

O **SANITY MILK** é uma plataforma completa para produtores rurais que oferece equipamentos de ordenha de alta qualidade, kits de manutenção especializados e vídeo aulas instrutivas. O projeto foi desenvolvido para reduzir a necessidade de visitas presenciais para problemas menores, permitindo que os próprios produtores realizem pequenos reparos.

## ✨ Funcionalidades

### 🛒 Frontend
- **Design Moderno**: Interface responsiva com gradientes e animações suaves
- **Carrinho de Compras**: Sistema completo de carrinho com notificações
- **Filtros Avançados**: Por categoria, dificuldade e preço
- **Vídeo Aulas**: Modal interativo para assistir vídeos instrutivos
- **FAQ Interativo**: Seção de perguntas frequentes com accordion
- **Acesso Rápido**: Seção com ícones visuais para melhor acessibilidade

### 🔧 Backend
- **API RESTful**: Endpoints para produtos, usuários e pedidos
- **Banco de Dados**: SQLite com tabelas para usuários, produtos, pedidos e vídeos
- **Autenticação**: Sistema de login/registro com JWT
- **Email**: Notificações automáticas de pedidos e contato
- **Segurança**: Senhas criptografadas com bcrypt

## 🚀 Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Variáveis CSS, Grid, Flexbox, Animações
- **JavaScript**: Vanilla JS com funcionalidades modernas
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia Inter

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **SQLite3**: Banco de dados (produtos e pedidos)
- **Firebase**: Autenticação e banco de dados em tempo real
- **Firebase Auth**: Sistema de login/cadastro para técnicos
- **Firebase Realtime Database**: Armazenamento de dados dos técnicos
- **JWT**: Autenticação
- **bcryptjs**: Criptografia de senhas
- **nodemailer**: Envio de emails

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/sanity-milk.git
cd sanity-milk
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
JWT_SECRET=seu-jwt-secret-aqui
```

4. **Configure o Firebase**
- O projeto já está configurado com Firebase
- URL do Realtime Database: `https://adm23-217f5-default-rtdb.firebaseio.com/`
- Autenticação e dados dos técnicos são salvos no Firebase

5. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

6. **Acesse a aplicação**
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
sanity-milk/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript frontend
├── server.js           # Servidor Node.js
├── package.json        # Dependências
├── sanity_milk.db      # Banco de dados SQLite
└── README.md           # Documentação
```

## 🎨 Design System

### Cores
- **Primária**: #E55A2B (Laranja SANITY)
- **Secundária**: #FF8C42 (Laranja claro)
- **Accent**: #FFB366 (Laranja suave)
- **Sucesso**: #28a745 (Verde)
- **Aviso**: #ffc107 (Amarelo)
- **Erro**: #dc3545 (Vermelho)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800, 900

### Componentes
- **Botões**: Gradientes com hover effects
- **Cards**: Sombras suaves e bordas arredondadas
- **Modais**: Backdrop blur e animações
- **Formulários**: Validação visual

## 🔌 API Endpoints

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Buscar produto por ID

### Usuários
- `POST /api/register` - Registrar usuário
- `POST /api/login` - Login do usuário

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/:userId` - Listar pedidos do usuário

### Contato
- `POST /api/contact` - Enviar mensagem de contato

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🎯 Funcionalidades Futuras

- [ ] Sistema de avaliações
- [ ] Chat em tempo real
- [ ] App mobile
- [ ] Integração com pagamentos
- [ ] Painel administrativo
- [ ] Sistema de notificações push

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

**SANITY MILK**
- 📧 Email: contato@sanitymilk.com
- 📞 Telefone: (11) 3030-2198
- 🌐 Website: [www.sanitymilk.com](https://www.sanitymilk.com)

---

Desenvolvido com ❤️ para produtores rurais brasileiros
