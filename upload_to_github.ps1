###############################################
# اسکریپت آپلود تغییرات به GitHub Pages
# استفاده: .\upload_to_github.ps1 "توضیح تغییرات"
###############################################

param(
    [string]$CommitMessage = "Update errors database"
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  📤 آپلود به GitHub Pages" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# بررسی وضعیت git
Write-Host "`n[1/5] بررسی وضعیت Git..." -ForegroundColor Yellow
git status

# اضافه کردن فایل‌های تغییر یافته
Write-Host "`n[2/5] اضافه کردن فایل‌ها..." -ForegroundColor Yellow
git add errors.json
git add index.html
git add errors-loader.js
git add add_error.py
git add README.md

# نمایش تغییرات
Write-Host "`n[3/5] تغییرات:" -ForegroundColor Yellow
git diff --cached --name-only

# Commit
Write-Host "`n[4/5] ثبت تغییرات..." -ForegroundColor Yellow
$commitMsg = if ($CommitMessage) { $CommitMessage } else { "Update errors: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
git commit -m $commitMsg

# Push به GitHub
Write-Host "`n[5/5] آپلود به GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "  ✅ آپلود با موفقیت انجام شد!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  🌐 مشاهده تغییرات (چند دقیقه صبر کنید):" -ForegroundColor Cyan
Write-Host "  https://shehneh.github.io/odoo-troubleshoot-guide/" -ForegroundColor White
Write-Host ""
