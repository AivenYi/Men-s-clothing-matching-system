const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 6666;

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'admin'));

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Session配置
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// 创建必要的目录
const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(__dirname, 'uploads');
const adminDir = path.join(__dirname, 'admin');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// 模拟数据存储
const OUTFITS_FILE = path.join(dataDir, 'outfits.json');
const ADMIN_FILE = path.join(dataDir, 'admin.json');

// 初始化数据文件
if (!fs.existsSync(OUTFITS_FILE)) {
    fs.writeFileSync(OUTFITS_FILE, '[]');
}
if (!fs.existsSync(ADMIN_FILE)) {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify([{
        id: 1,
        username: 'admin',
        password: 'admin123'
    }]));
}

// 文件上传配置
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// 路由处理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 登录页面
app.get('/admin/login', (req, res) => {
    res.render('login');
});

// 登录处理
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const admins = JSON.parse(fs.readFileSync(ADMIN_FILE));
    const admin = admins.find(a => a.username === username && a.password === password);
    
    if (admin) {
        req.session.adminId = admin.id;
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/login');
    }
});

// 管理面板
app.get('/admin/dashboard', (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }
    res.render('dashboard');
});

// 添加新搭配
app.post('/admin/outfits/add', upload.single('image'), (req, res) => {
    if (!req.session.adminId) {
        return res.status(401).json({ error: '未授权' });
    }

    try {
        const outfits = JSON.parse(fs.readFileSync(OUTFITS_FILE));
        const newOutfit = {
            id: outfits.length + 1,
            title: req.body.title,
            scene: req.body.scene,
            age_range: req.body.age_range,
            price: parseFloat(req.body.price),
            image: req.file.filename,
            created_at: new Date().toISOString()
        };
        
        outfits.push(newOutfit);
        fs.writeFileSync(OUTFITS_FILE, JSON.stringify(outfits, null, 2));
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('服务器错误');
    }
});

// API：获取搭配列表
app.get('/api/outfits', (req, res) => {
    try {
        const outfits = JSON.parse(fs.readFileSync(OUTFITS_FILE));
        res.json(outfits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});