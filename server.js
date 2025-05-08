const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// 設定靜態檔案目錄
app.use(express.static('public'));
app.use('/images', express.static('images'));

// 設定 multer 儲存選項
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 限制 5MB
    },
    fileFilter: function (req, file, cb) {
        // 只接受圖片檔案
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('只允許上傳圖片檔案！'), false);
        }
        cb(null, true);
    }
});

// 處理圖片上傳
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '沒有上傳檔案' });
        }

        const imageInfo = {
            id: Date.now(),
            url: `/images/${req.file.filename}`,
            name: req.file.originalname,
            size: req.file.size,
            type: req.body.type || 'portfolio',
            status: 'pending'
        };

        // 讀取現有的圖片資訊
        let uploadedImages = [];
        try {
            const data = fs.readFileSync('images/images.json', 'utf8');
            uploadedImages = JSON.parse(data);
        } catch (error) {
            // 如果檔案不存在，創建新的陣列
        }

        // 添加新圖片資訊
        uploadedImages.push(imageInfo);

        // 保存更新後的圖片資訊
        fs.writeFileSync('images/images.json', JSON.stringify(uploadedImages, null, 2));

        res.json(imageInfo);
    } catch (error) {
        console.error('上傳錯誤:', error);
        res.status(500).json({ error: '上傳失敗' });
    }
});

// 獲取所有圖片資訊
app.get('/images', (req, res) => {
    try {
        const data = fs.readFileSync('images/images.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.json([]);
    }
});

// 更新圖片狀態
app.put('/images/:id', express.json(), (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const data = fs.readFileSync('images/images.json', 'utf8');
        let uploadedImages = JSON.parse(data);

        const imageIndex = uploadedImages.findIndex(img => img.id === parseInt(id));
        if (imageIndex === -1) {
            return res.status(404).json({ error: '找不到圖片' });
        }

        uploadedImages[imageIndex].status = status;

        // 如果是首頁圖片且狀態為啟用，將其他首頁圖片設為停用
        if (uploadedImages[imageIndex].type === 'homepage' && status === 'active') {
            uploadedImages.forEach((img, index) => {
                if (index !== imageIndex && img.type === 'homepage') {
                    img.status = 'inactive';
                }
            });
        }

        fs.writeFileSync('images/images.json', JSON.stringify(uploadedImages, null, 2));
        res.json(uploadedImages[imageIndex]);
    } catch (error) {
        res.status(500).json({ error: '更新失敗' });
    }
});

// 刪除圖片
app.delete('/images/:id', (req, res) => {
    try {
        const { id } = req.params;
        const data = fs.readFileSync('images/images.json', 'utf8');
        let uploadedImages = JSON.parse(data);

        const imageIndex = uploadedImages.findIndex(img => img.id === parseInt(id));
        if (imageIndex === -1) {
            return res.status(404).json({ error: '找不到圖片' });
        }

        // 刪除實體檔案
        const imagePath = path.join(__dirname, uploadedImages[imageIndex].url);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // 從陣列中移除圖片資訊
        uploadedImages.splice(imageIndex, 1);

        // 保存更新後的圖片資訊
        fs.writeFileSync('images/images.json', JSON.stringify(uploadedImages, null, 2));
        res.json({ message: '刪除成功' });
    } catch (error) {
        res.status(500).json({ error: '刪除失敗' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`伺服器運行在 http://localhost:${PORT}`);
}); 