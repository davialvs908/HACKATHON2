const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sanity-milk-secret-key-2024';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('sanity_milk.db');

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        difficulty TEXT,
        price REAL NOT NULL,
        features TEXT,
        image TEXT,
        icon TEXT,
        stock INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        items TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Videos table
    db.run(`CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        difficulty TEXT,
        duration TEXT,
        thumbnail TEXT,
        video_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tech users table
    db.run(`CREATE TABLE IF NOT EXISTS tech_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        experience TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tech courses table
    db.run(`CREATE TABLE IF NOT EXISTS tech_courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        duration TEXT,
        level TEXT,
        status TEXT DEFAULT 'available',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tech quizzes table
    db.run(`CREATE TABLE IF NOT EXISTS tech_quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        questions TEXT,
        passing_score INTEGER,
        time_limit INTEGER,
        status TEXT DEFAULT 'available',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tech progress table
    db.run(`CREATE TABLE IF NOT EXISTS tech_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        course_id INTEGER,
        quiz_id INTEGER,
        completed BOOLEAN DEFAULT FALSE,
        score INTEGER,
        completed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES tech_users (id),
        FOREIGN KEY (course_id) REFERENCES tech_courses (id),
        FOREIGN KEY (quiz_id) REFERENCES tech_quizzes (id)
    )`);

    // Insert sample products
    const products = [
        {
            title: "Kit Reparo Teteiras de Acrílico",
            description: "Kit completo para reparos e substituição de teteiras de borracha atóxica e peças de acrílico do sistema de ordenha.",
            category: "acrilico",
            difficulty: "facil",
            price: 40.00,
            features: JSON.stringify(["4 teteiras de borracha atóxica", "Cola especial para acrílico", "Lixas 220 e 400", "Espátula plástica", "Luvas de proteção", "Manual instrutivo"]),
            image: "fas fa-cube",
            icon: "🔧",
            stock: 50
        },
        {
            title: "Kit Manutenção Regulador de Vácuo",
            description: "Kit para manutenção e calibração do regulador de vácuo do sistema de ordenha.",
            category: "vacuo",
            difficulty: "medio",
            price: 50.00,
            features: JSON.stringify(["Vacuômetro analógico", "Chaves de calibração", "Vedações de borracha", "Ferramentas específicas", "Manual técnico"]),
            image: "fas fa-tachometer-alt",
            icon: "📊",
            stock: 30
        },
        {
            title: "Kit Reparo Torneira de Vácuo",
            description: "Kit para reparos na torneira de vácuo, incluindo vedações e mecanismo de alívio.",
            category: "hidraulico",
            difficulty: "facil",
            price: 40.00,
            features: JSON.stringify(["Vedações de borracha", "Mecanismo de alívio", "Chave de grifo específica", "Fita veda rosca", "Guia de reparos"]),
            image: "fas fa-faucet",
            icon: "🚰",
            stock: 25
        },
        {
            title: "Kit Manutenção Pulsador Pneumático",
            description: "Kit para manutenção do pulsador pneumático com relação 60/40.",
            category: "pneumatico",
            difficulty: "medio",
            price: 60.00,
            features: JSON.stringify(["Diafragmas de reposição", "Vedações específicas", "Ferramentas de calibração", "Óleo lubrificante", "Manual técnico"]),
            image: "fas fa-cog",
            icon: "⚙️",
            stock: 20
        },
        {
            title: "Kit Limpeza Lavador Interno",
            description: "Kit para limpeza e manutenção do lavador interno do conjunto de ordenha.",
            category: "limpeza",
            difficulty: "facil",
            price: 40.00,
            features: JSON.stringify(["Detergente especializado", "Escovas de limpeza", "Desinfetante", "Luvas de proteção", "Manual de limpeza"]),
            image: "fas fa-spray-can",
            icon: "🧽",
            stock: 40
        },
        {
            title: "Kit Reparo Coletor de Leite",
            description: "Kit para reparos no coletor de leite e conexões do sistema de ordenha.",
            category: "coletor",
            difficulty: "facil",
            price: 50.00,
            features: JSON.stringify(["Conexões de reposição", "Vedações de borracha", "Tubos flexíveis", "Ferramentas básicas", "Manual instrutivo"]),
            image: "fas fa-tint",
            icon: "🥛",
            stock: 35
        }
    ];

    // Check if products already exist
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO products (title, description, category, difficulty, price, features, image, icon, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            products.forEach(product => {
                stmt.run(product.title, product.description, product.category, product.difficulty, product.price, product.features, product.image, product.icon, product.stock);
            });
            stmt.finalize();
            console.log('Sample products inserted');
        }
    });
});

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'contato@sanitymilk.com',
        pass: process.env.EMAIL_PASS || 'your-email-password'
    }
});

// Routes

// Get all products
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const products = rows.map(row => ({
            ...row,
            features: JSON.parse(row.features)
        }));
        res.json(products);
    });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        const product = {
            ...row,
            features: JSON.parse(row.features)
        };
        res.json(product);
    });
});

// User registration
app.post('/api/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run("INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, phone, address], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        res.status(400).json({ error: 'Email already exists' });
                    } else {
                        res.status(500).json({ error: err.message });
                    }
                    return;
                }
                
                const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: '24h' });
                res.json({ 
                    message: 'User created successfully',
                    token,
                    user: { id: this.lastID, name, email, phone, address }
                });
            });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        
        try {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address }
            });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Create order
app.post('/api/orders', (req, res) => {
    const { items, total, user_id } = req.body;
    
    db.run("INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)",
        [user_id, JSON.stringify(items), total], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Send email notification
            const mailOptions = {
                from: 'contato@sanitymilk.com',
                to: 'contato@sanitymilk.com',
                subject: 'Novo Pedido - SANITY MILK',
                html: `
                    <h2>Novo Pedido Recebido</h2>
                    <p><strong>ID do Pedido:</strong> ${this.lastID}</p>
                    <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
                    <p><strong>Itens:</strong></p>
                    <ul>
                        ${items.map(item => `<li>${item.title} - Qtd: ${item.quantity} - R$ ${item.price.toFixed(2)}</li>`).join('')}
                    </ul>
                `
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Email error:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
            
            res.json({ 
                message: 'Order created successfully',
                orderId: this.lastID
            });
        });
});

// Get user orders
app.get('/api/orders/:userId', (req, res) => {
    const { userId } = req.params;
    
    db.all("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const orders = rows.map(row => ({
            ...row,
            items: JSON.parse(row.items)
        }));
        
        res.json(orders);
    });
});

// Get all videos
app.get('/api/videos', (req, res) => {
    db.all("SELECT * FROM videos ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Contact form
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;
    
    const mailOptions = {
        from: 'contato@sanitymilk.com',
        to: 'contato@sanitymilk.com',
        subject: 'Contato - SANITY MILK',
        html: `
            <h2>Novo Contato</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
            <p><strong>Mensagem:</strong></p>
            <p>${message}</p>
        `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).json({ error: 'Failed to send message' });
        } else {
            res.json({ message: 'Message sent successfully' });
        }
    });
});

// Tech Portal Routes

// Tech user registration
app.post('/api/tech/register', async (req, res) => {
    const { name, email, password, phone, experience } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run("INSERT INTO tech_users (name, email, password, phone, experience) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, phone, experience], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        res.status(400).json({ error: 'Email already exists' });
                    } else {
                        res.status(500).json({ error: err.message });
                    }
                    return;
                }
                
                const token = jwt.sign({ userId: this.lastID, type: 'tech' }, JWT_SECRET, { expiresIn: '24h' });
                res.json({ 
                    message: 'Tech user created successfully',
                    token,
                    user: { id: this.lastID, name, email, phone, experience }
                });
            });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Tech user login
app.post('/api/tech/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get("SELECT * FROM tech_users WHERE email = ?", [email], async (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        
        try {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            
            const token = jwt.sign({ userId: user.id, type: 'tech' }, JWT_SECRET, { expiresIn: '24h' });
            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, name: user.name, email: user.email, phone: user.phone, experience: user.experience }
            });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Get tech courses
app.get('/api/tech/courses', (req, res) => {
    db.all("SELECT * FROM tech_courses ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get tech quizzes
app.get('/api/tech/quizzes', (req, res) => {
    db.all("SELECT * FROM tech_quizzes ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const quizzes = rows.map(row => ({
            ...row,
            questions: JSON.parse(row.questions)
        }));
        res.json(quizzes);
    });
});

// Submit quiz result
app.post('/api/tech/quiz/submit', (req, res) => {
    const { userId, quizId, score, answers } = req.body;
    
    db.run("INSERT INTO tech_progress (user_id, quiz_id, score, completed, completed_at) VALUES (?, ?, ?, ?, ?)",
        [userId, quizId, score, true, new Date().toISOString()], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            res.json({ 
                message: 'Quiz result saved successfully',
                progressId: this.lastID
            });
        });
});

// Get tech user progress
app.get('/api/tech/progress/:userId', (req, res) => {
    const { userId } = req.params;
    
    db.all(`SELECT p.*, c.title as course_title, q.title as quiz_title 
            FROM tech_progress p 
            LEFT JOIN tech_courses c ON p.course_id = c.id 
            LEFT JOIN tech_quizzes q ON p.quiz_id = q.id 
            WHERE p.user_id = ? 
            ORDER BY p.completed_at DESC`, [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SANITY MILK Backend running on port ${PORT}`);
    console.log(`📧 Email: contato@sanitymilk.com`);
    console.log(`📞 Phone: (11) 3030-2198`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('📦 Database connection closed');
        process.exit(0);
    });
});
