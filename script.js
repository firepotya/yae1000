// 等待 DOM 完全載入
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滾動效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 導航欄滾動效果
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // 作品集圖片加載動畫
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (portfolioItems.length > 0) {
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        portfolioItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(item);
        });
    }

    // 表單提交處理
    try {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // 獲取表單數據
                const formData = new FormData(contactForm);
                const formObject = {};
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });
                
                // 這裡可以添加表單提交到後端的邏輯
                console.log('表單數據：', formObject);
                
                // 顯示成功訊息
                alert('感謝您的訊息！我們會盡快與您聯繫。');
                contactForm.reset();
            });
        }
    } catch (error) {
        console.log('聯絡表單不存在於此頁面');
    }

    // 回到頂部按鈕功能
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        // 監聽滾動事件
        window.addEventListener('scroll', () => {
            // 當頁面滾動超過 300px 時顯示按鈕
            if (window.pageYOffset > 300 || document.documentElement.scrollTop > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // 點擊按鈕回到頂部
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // 為了確保在所有瀏覽器中都能正常工作
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
    }
}); 