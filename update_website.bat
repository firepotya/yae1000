@echo off
echo 正在更新網站...
echo.

echo 步驟 1: 添加所有更改的檔案
git add .
echo.

echo 步驟 2: 提交更改
git commit -m "更新網站內容"
echo.

echo 步驟 3: 推送到 GitHub
git push origin main
echo.

echo 更新完成！
echo 請等待 1-2 分鐘後重新整理 https://firepotya.github.io/yae1000
echo.

pause 