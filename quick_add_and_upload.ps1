###############################################
# اسکریپت سریع: اضافه کردن خطا + آپلود به GitHub
# استفاده: .\quick_add_and_upload.ps1
###############################################

Write-Host "=========================================" -ForegroundColor Magenta
Write-Host "  ⚡ افزودن سریع خطا + آپلود" -ForegroundColor Magenta
Write-Host "=========================================" -ForegroundColor Magenta

# اجرای اسکریپت Python برای اضافه کردن خطا
Write-Host "`n[1/2] اضافه کردن خطای جدید..." -ForegroundColor Yellow
python add_error.py

# چک کردن موفقیت
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ خطا با موفقیت اضافه شد!" -ForegroundColor Green
    
    # سوال برای آپلود
    $upload = Read-Host "`nآیا می‌خواهید الان به GitHub آپلود کنید؟ (y/n)"
    
    if ($upload -eq 'y' -or $upload -eq 'Y') {
        Write-Host "`n[2/2] آپلود به GitHub..." -ForegroundColor Yellow
        $commitMsg = Read-Host "توضیح تغییرات (Enter برای پیش‌فرض)"
        
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            .\upload_to_github.ps1
        } else {
            .\upload_to_github.ps1 -CommitMessage $commitMsg
        }
    } else {
        Write-Host "`n💾 فایل errors.json ذخیره شد. برای آپلود بعدی:" -ForegroundColor Cyan
        Write-Host "  .\upload_to_github.ps1" -ForegroundColor White
    }
} else {
    Write-Host "`n❌ خطا در افزودن! لطفاً دوباره تلاش کنید." -ForegroundColor Red
}

Write-Host ""
