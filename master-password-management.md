# 🔐 Master Password و مدیریت دسترسی‌های Odoo

راهنمای جامع برای مدیریت Master Password و دسترسی‌های سرور Odoo در IranServer

---

## 📋 فهرست مطالب

1. [Master Password چیست؟](#master-password-چیست)
2. [یافتن Master Password فعلی](#یافتن-master-password-فعلی)
3. [تغییر یا ریست Master Password](#تغییر-یا-ریست-master-password)
4. [مدیریت دسترسی PostgreSQL](#مدیریت-دسترسی-postgresql)
5. [رفع خطای احراز هویت](#رفع-خطای-احراز-هویت)
6. [اسکریپت‌های آماده](#اسکریپتهای-آماده)

---

## Master Password چیست؟

**Master Password** یا **Admin Password** رمزی است که برای:
- ✅ ساخت دیتابیس جدید
- ✅ حذف دیتابیس
- ✅ گرفتن بکاپ از دیتابیس
- ✅ بازگردانی بکاپ
- ✅ تغییر نام دیتابیس

استفاده می‌شود. این پسورد در فایل `odoo.conf` با کلید `admin_passwd` ذخیره می‌شود.

---

## یافتن Master Password فعلی

### روش 1: از طریق SSH

**1. اتصال به سرور:**
```bash
ssh root@185.255.88.103 -p 3031
```

**2. مشاهده Master Password:**
```bash
cat /etc/odoo.conf | grep admin_passwd
```

**خروجی نمونه:**
```
admin_passwd = admin@2026!
```

یا اگه هش شده باشه:
```
admin_passwd = $pbkdf2-sha512$600000$...
```

### روش 2: از طریق FileZilla

1. به سرور وصل شوید (SFTP)
2. فایل `/etc/odoo.conf` را باز کنید
3. خط `admin_passwd` را پیدا کنید

---

## تغییر یا ریست Master Password

### ⚠️ هشدار مهم
قبل از هر تغییری، از فایل کانفیگ بکاپ بگیرید:
```bash
cp /etc/odoo.conf /etc/odoo.conf.backup.$(date +%Y%m%d)
```

---

### روش 1: ویرایش دستی فایل کانفیگ (توصیه می‌شود)

**1. اتصال به سرور:**
```bash
ssh root@185.255.88.103 -p 3031
```

**2. ویرایش فایل کانفیگ:**
```bash
nano /etc/odoo.conf
```

**3. پیدا کردن خط `admin_passwd`:**
```ini
[options]
...
admin_passwd = old_password_here
...
```

**4. تغییر پسورد:**
```ini
admin_passwd = new_password_2026!
```

**5. ذخیره و خروج:**
- فشردن `Ctrl + X`
- فشردن `Y`
- فشردن `Enter`

**6. ری‌استارت Odoo:**
```bash
systemctl restart odoo
```

**7. چک کردن وضعیت:**
```bash
systemctl status odoo
```

---

### روش 2: استفاده از دستور sed (سریع)

**تغییر یک‌خطی Master Password:**
```bash
# اتصال به سرور
ssh root@185.255.88.103 -p 3031

# بک‌آپ
cp /etc/odoo.conf /etc/odoo.conf.backup

# تغییر پسورد
sed -i 's/^admin_passwd = .*/admin_passwd = NewPassword123!/' /etc/odoo.conf

# بررسی تغییرات
cat /etc/odoo.conf | grep admin_passwd

# ری‌استارت
systemctl restart odoo
```

---

### روش 3: پاک کردن Master Password (غیرامن!)

⚠️ **توصیه نمی‌شود!** اما برای تست محلی مفید است:

```bash
sed -i 's/^admin_passwd = .*/admin_passwd = /' /etc/odoo.conf
systemctl restart odoo
```

بدون Master Password، هرکسی می‌تواند دیتابیس‌ها را مدیریت کند!

---

## مدیریت دسترسی PostgreSQL

### مشاهده یوزرهای PostgreSQL

```bash
sudo -u postgres psql -c "\du"
```

**خروجی نمونه:**
```
                                   List of roles
 Role name │  Attributes                         │ Member of 
───────────┼─────────────────────────────────────┼───────────
 odoo      │ Superuser, Create DB                │ {}
 postgres  │ Superuser, Create role, Create DB   │ {}
```

---

### ساخت یوزر جدید PostgreSQL

```bash
sudo -u postgres psql -c "CREATE USER odoo WITH PASSWORD 'your_password' CREATEDB SUPERUSER;"
```

---

### تغییر پسورد یوزر موجود

```bash
sudo -u postgres psql -c "ALTER USER odoo WITH PASSWORD 'new_password';"
```

---

### دادن دسترسی به دیتابیس خاص

```bash
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE siraf TO odoo;"
```

---

### تست اتصال PostgreSQL

```bash
PGPASSWORD='odoo_secure_pass_2026' psql -U odoo -d siraf -h localhost -c "SELECT version();"
```

اگه متصل شد، پیام مشخصات PostgreSQL نمایش داده می‌شود.

---

## رفع خطای احراز هویت

### خطا: `password authentication failed for user "odoo"`

**علت:** پسورد PostgreSQL با کانفیگ Odoo همخوانی ندارد.

**راه‌حل:**

**1. بررسی پسورد در کانفیگ Odoo:**
```bash
cat /etc/odoo.conf | grep -E "db_user|db_password"
```

**خروجی:**
```ini
db_user = odoo
db_password = odoo_secure_pass_2026
```

**2. بروزرسانی پسورد PostgreSQL:**
```bash
sudo -u postgres psql -c "ALTER USER odoo WITH PASSWORD 'odoo_secure_pass_2026';"
```

**3. ری‌استارت سرویس‌ها:**
```bash
systemctl restart postgresql
systemctl restart odoo
```

---

### خطا: `pg_dump: error: connection to server failed`

**علت:** ماژول بکاپ نمی‌تواند به PostgreSQL متصل شود.

**راه‌حل کامل:**

```bash
# 1. اتصال به سرور
ssh root@185.255.88.103 -p 3031

# 2. بررسی یوزرهای PostgreSQL
sudo -u postgres psql -c "\du"

# 3. اگه یوزر odoo نبود، بسازید
sudo -u postgres psql -c "CREATE USER odoo WITH PASSWORD 'odoo_secure_pass_2026' CREATEDB SUPERUSER;"

# 4. اگه یوزر odoo هست، فقط پسورد رو آپدیت کنید
sudo -u postgres psql -c "ALTER USER odoo WITH PASSWORD 'odoo_secure_pass_2026';"

# 5. دادن دسترسی به دیتابیس
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE siraf TO odoo;"

# 6. بروزرسانی کانفیگ Odoo
sed -i 's/^db_user = .*/db_user = odoo/' /etc/odoo.conf
sed -i 's/^db_password = .*/db_password = odoo_secure_pass_2026/' /etc/odoo.conf
sed -i 's/^db_name = .*/db_name = siraf/' /etc/odoo.conf

# 7. ری‌استارت
systemctl restart postgresql
systemctl restart odoo

# 8. تست اتصال
PGPASSWORD='odoo_secure_pass_2026' psql -U odoo -d siraf -h localhost -c "SELECT current_database();"
```

---

## اسکریپت‌های آماده

### اسکریپت 1: نمایش تمام اطلاعات دسترسی

```bash
#!/bin/bash
echo "======================================"
echo " Odoo Server Credentials"
echo "======================================"
echo ""
echo "Master Password:"
cat /etc/odoo.conf | grep admin_passwd
echo ""
echo "Database Config:"
cat /etc/odoo.conf | grep -E "db_name|db_user|db_password|db_host|db_port"
echo ""
echo "PostgreSQL Users:"
sudo -u postgres psql -c "\du"
echo ""
echo "======================================"
```

**استفاده:**
```bash
chmod +x show_credentials.sh
./show_credentials.sh
```

---

### اسکریپت 2: ریست کامل دسترسی‌ها

```bash
#!/bin/bash
# Reset All Credentials Script

echo "Resetting Master Password..."
sed -i 's/^admin_passwd = .*/admin_passwd = admin@2026!/' /etc/odoo.conf

echo "Updating PostgreSQL User..."
sudo -u postgres psql -c "ALTER USER odoo WITH PASSWORD 'odoo_secure_pass_2026';"

echo "Updating Odoo Config..."
sed -i 's/^db_user = .*/db_user = odoo/' /etc/odoo.conf
sed -i 's/^db_password = .*/db_password = odoo_secure_pass_2026/' /etc/odoo.conf
sed -i 's/^db_name = .*/db_name = siraf/' /etc/odoo.conf

echo "Granting Privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE siraf TO odoo;"

echo "Restarting Services..."
systemctl restart postgresql
systemctl restart odoo

echo ""
echo "======================================"
echo " All Credentials Reset Successfully!"
echo "======================================"
echo ""
echo "Master Password: admin@2026!"
echo "DB User: odoo"
echo "DB Password: odoo_secure_pass_2026"
echo "Database: siraf"
```

**استفاده:**
```bash
chmod +x reset_all_credentials.sh
./reset_all_credentials.sh
```

---

## 🔒 نکات امنیتی

1. **هرگز Master Password را در کدهای عمومی قرار ندهید**
2. **از پسوردهای قوی استفاده کنید:**
   - حداقل 12 کاراکتر
   - ترکیبی از حروف بزرگ، کوچک، اعداد و علائم
3. **به صورت دوره‌ای پسوردها را تغییر دهید**
4. **بکاپ منظم از کانفیگ بگیرید**
5. **دسترسی SSH را به IP‌های معتبر محدود کنید**
6. **از Firewall استفاده کنید**

---

## 📚 منابع مفید

- [مستندات رسمی Odoo](https://www.odoo.com/documentation/19.0/)
- [امنیت PostgreSQL](https://www.postgresql.org/docs/current/auth-methods.html)
- [بهترین روش‌های Odoo Deployment](https://www.odoo.com/documentation/19.0/administration/on_premise.html)

---

## 🆘 در صورت مشکل

اگه هر مشکلی پیش اومد:

1. **لاگ‌های Odoo را بررسی کنید:**
   ```bash
   tail -100 /var/log/odoo/odoo.log
   ```

2. **وضعیت سرویس‌ها را چک کنید:**
   ```bash
   systemctl status odoo
   systemctl status postgresql
   ```

3. **اتصال به PostgreSQL را تست کنید:**
   ```bash
   PGPASSWORD='your_password' psql -U odoo -d siraf -h localhost
   ```

---

**آخرین بروزرسانی:** 9 فوریه 2026
**نویسنده:** GitHub Copilot
**مجوز:** این راهنما برای استفاده شخصی است
