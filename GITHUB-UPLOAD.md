# 🚀 آپلود به GitHub - 3 مرحله ساده!

## ✅ مراحل انجام شده:
- [x] فایل‌های پروژه آماده شدند
- [x] Git مقداردهی اولیه شد
- [x] فایل‌ها commit شدند
- [x] Branch به main تغییر کرد

---

## 🎯 مراحل باقی‌مانده (فقط 3 دقیقه!):

### 📝 مرحله 1: ساخت Repository در GitHub (1 دقیقه)

1. برید به **https://github.com** و لاگین کنید
2. روی دکمه سبز **New** یا آیکون **+** (بالا راست) کلیک کنید
3. **New repository** را انتخاب کنید
4. اطلاعات را پر کنید:
   ```
   Repository name: odoo-troubleshoot-guide
   Description: راهنمای فارسی رفع مشکلات Odoo 19
   ✅ Public (انتخاب کنید)
   ❌ Initialize this repository... (تیک نزنید!)
   ```
5. روی **Create repository** کلیک کنید

---

### 💻 مرحله 2: آپلود فایل‌ها (1 دقیقه)

بعد از ساخت repository، GitHub یک صفحه با دستورات نشان می‌دهد.

**روش A: اگر صفحه دستورات را دیدید**
- فقط دستوری که شبیه این است را کپی کنید:
  ```
  git remote add origin https://github.com/YOUR-USERNAME/odoo-troubleshoot-guide.git
  ```
- و در PowerShell این پوشه paste کنید

**روش B: دستورات دستی**

یکی از این دو روش را انتخاب کنید:

#### گزینه 1: با نام کاربری و رمز عبور (ساده‌تر)
```powershell
# جای YOUR-USERNAME نام کاربری GitHub خودتون رو بزنید
git remote add origin https://github.com/YOUR-USERNAME/odoo-troubleshoot-guide.git
git push -u origin main
```
بعد از `git push` نام کاربری و رمز عبور GitHub را می‌پرسد.

#### گزینه 2: با Personal Access Token (امن‌تر)
اگر خطای authentication گرفتید:
1. برید به GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
2. یک توکن با دسترسی `repo` بسازید
3. توکن را کپی کنید (فقط یک بار نشان داده می‌شود!)
4. این دستورات را اجرا کنید:
```powershell
# جای YOUR-USERNAME و YOUR-TOKEN مقادیر خودتون رو بزنید
git remote add origin https://YOUR-USERNAME:YOUR-TOKEN@github.com/YOUR-USERNAME/odoo-troubleshoot-guide.git
git push -u origin main
```

---

### 🌐 مرحله 3: فعال‌سازی GitHub Pages (1 دقیقه)

1. در repository خودتون، روی **Settings** کلیک کنید (تب بالا)
2. از منوی سمت چپ، **Pages** را پیدا کنید
3. در بخش **Branch**:
   - انتخاب کنید: **main**
   - پوشه: **/ (root)**
4. روی **Save** کلیک کنید
5. صبر کنید 1-2 دقیقه
6. صفحه را Refresh کنید

یک باکس سبز ظاهر می‌شود با لینک سایت شما:
```
🎉 Your site is live at https://YOUR-USERNAME.github.io/odoo-troubleshoot-guide/
```

---

## 🎊 تمام! سایت شما آماده است!

### لینک‌های مهم:
- 📦 **Repository**: `https://github.com/YOUR-USERNAME/odoo-troubleshoot-guide`
- 🌐 **سایت زنده**: `https://YOUR-USERNAME.github.io/odoo-troubleshoot-guide/`

---

## 🔄 آپدیت کردن در آینده:

وقتی فایل `index.html` را تغییر دادید، این دستورات را بزنید:

```powershell
cd "C:\Users\My Computer\OneDrive\Desktop\odoo-troubleshoot-guide"
git add index.html
git commit -m "Updated troubleshooting guide"
git push
```

بعد از 1-2 دقیقه، تغییرات در سایت اعمال می‌شود.

---

## ❓ مشکلات رایج:

### خطا: remote origin already exists
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/odoo-troubleshoot-guide.git
```

### خطا: Authentication failed
از Personal Access Token استفاده کنید (توضیح داده شد).

### خطا: Repository not found
مطمئن شوید نام repository دقیقا `odoo-troubleshoot-guide` باشد.

---

## 📢 بعد از انتشار:

1. ✅ لینک را در گروه‌های تلگرام Odoo ایران به اشتراک بگذارید
2. ✅ در LinkedIn پست کنید
3. ✅ از دوستان بخواهید Star بزنند ⭐
4. ✅ در README.md فایل GitHub خودتون لینک بذارید

---

**موفق باشید! 🚀**

هر سوالی داشتید، یک Issue در GitHub باز کنید.
