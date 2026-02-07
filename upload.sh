#!/bin/bash
###############################################
# اسکریپت آپلود به GitHub (Linux/Mac/Git Bash)
###############################################

COMMIT_MSG=${1:-"Update errors database"}

echo "========================================="
echo "  📤 آپلود به GitHub Pages"
echo "========================================="

# بررسی وضعیت
echo -e "\n[1/5] بررسی وضعیت Git..."
git status

# اضافه کردن فایل‌ها
echo -e "\n[2/5] اضافه کردن فایل‌ها..."
git add errors.json index.html errors-loader.js add_error.py README.md GUIDE.md

# نمایش تغییرات
echo -e "\n[3/5] تغییرات:"
git diff --cached --name-only

# Commit
echo -e "\n[4/5] ثبت تغییرات..."
git commit -m "$COMMIT_MSG"

# Push
echo -e "\n[5/5] آپلود به GitHub..."
git push origin main

echo -e "\n========================================="
echo -e "  ✅ آپلود با موفقیت انجام شد!"
echo -e "========================================="
echo -e "\n  🌐 مشاهده: https://shehneh.github.io/odoo-troubleshoot-guide/\n"
