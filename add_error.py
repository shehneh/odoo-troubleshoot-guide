#!/usr/bin/env python3
"""
اسکریپت اضافه کردن خطای جدید به سیستم رفع خطاهای اودو
"""
import json
import os
import re
from datetime import datetime

# مسیر فایل errors.json
ERRORS_FILE = os.path.join(os.path.dirname(__file__), 'errors.json')

def generate_id(title):
    """تولید ID یکتا از روی عنوان"""
    # حذف ایموجی‌ها و کاراکترهای خاص
    clean_title = re.sub(r'[^\w\s-]', '', title)
    # تبدیل به lowercase و جایگزینی فاصله با -
    error_id = re.sub(r'[\s_]+', '-', clean_title.strip().lower())
    # محدود کردن طول
    error_id = error_id[:50]
    # اضافه کردن timestamp برای یکتایی
    timestamp = datetime.now().strftime('%y%m%d')
    return f"{error_id}-{timestamp}"

def load_errors():
    """بارگذاری خطاهای موجود"""
    if os.path.exists(ERRORS_FILE):
        with open(ERRORS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_errors(errors):
    """ذخیره خطاها"""
    with open(ERRORS_FILE, 'w', encoding='utf-8') as f:
        json.dump(errors, f, ensure_ascii=False, indent=2)

def get_multiline_input(prompt):
    """دریافت ورودی چند خطی"""
    print(f"\n{prompt}")
    print("(برای پایان، یک خط خالی وارد کنید)")
    lines = []
    while True:
        line = input()
        if line == "":
            break
        lines.append(line)
    return "\n".join(lines)

def add_error_interactive():
    """اضافه کردن خطا به صورت تعاملی"""
    print("\n" + "="*60)
    print("🔧 اضافه کردن خطای جدید به سیستم رفع خطاها")
    print("="*60)
    
    # دریافت اطلاعات خطا
    title = input("\n📝 عنوان خطا (با ایموجی): ").strip()
    error_id = generate_id(title)
    
    print(f"\n🆔 ID خودکار: {error_id}")
    
    # نوع خطا
    print("\n🎨 نوع خطا:")
    print("  1. error (قرمز)")
    print("  2. warning (نارنجی)")
    print("  3. info (آبی)")
    print("  4. success (سبز)")
    error_type = input("انتخاب کنید [1-4] (پیش‌فرض: 1): ").strip() or "1"
    type_map = {"1": "error", "2": "warning", "3": "info", "4": "success"}
    error_type = type_map.get(error_type, "error")
    
    # متن خطا
    error_text = get_multiline_input("\n❌ متن خطای اصلی (انگلیسی):")
    
    # توضیح
    description = input("\n📄 توضیح کوتاه (فارسی): ").strip()
    
    # تگ‌ها
    tags_input = input("\n🏷️ تگ‌ها (با کاما جدا کنید): ").strip()
    tags = [t.strip() for t in tags_input.split(',') if t.strip()]
    
    # کلمات کلیدی
    keywords_input = input("\n🔑 کلمات کلیدی (با کاما جدا کنید): ").strip()
    keywords = [k.strip() for k in keywords_input.split(',') if k.strip()]
    # اضافه کردن خودکار کلمات از عنوان و تگ‌ها
    keywords.extend(tags)
    keywords = list(set(keywords))  # حذف تکراری
    
    # راه حل‌ها
    solutions = []
    print("\n💡 راه حل‌ها:")
    solution_num = 1
    while True:
        add_solution = input(f"\nآیا راه حل {solution_num} را اضافه می‌کنید؟ (y/n): ").lower()
        if add_solution != 'y':
            break
        
        solution_title = input(f"  عنوان راه حل {solution_num}: ").strip()
        
        steps = []
        step_num = 1
        print(f"  مراحل راه حل {solution_num}:")
        while True:
            add_step = input(f"    آیا مرحله {step_num} را اضافه می‌کنید؟ (y/n): ").lower()
            if add_step != 'y':
                break
            
            step_text = input(f"    متن مرحله {step_num}: ").strip()
            step_code = input(f"    کد (اختیاری، Enter برای رد): ").strip()
            
            steps.append({
                "number": step_num,
                "text": step_text,
                "code": step_code
            })
            step_num += 1
        
        solutions.append({
            "title": solution_title,
            "steps": steps
        })
        solution_num += 1
    
    # ساخت شیء خطا
    new_error = {
        "id": error_id,
        "title": title,
        "type": error_type,
        "errorText": error_text,
        "keywords": keywords,
        "description": description,
        "solutions": solutions,
        "tags": tags,
        "dateAdded": datetime.now().isoformat()
    }
    
    # نمایش پیش‌نمایش
    print("\n" + "="*60)
    print("📋 پیش‌نمایش خطای جدید:")
    print("="*60)
    print(json.dumps(new_error, ensure_ascii=False, indent=2))
    
    # تایید
    confirm = input("\n✅ آیا این خطا را اضافه کنیم؟ (y/n): ").lower()
    if confirm == 'y':
        errors = load_errors()
        errors.append(new_error)
        save_errors(errors)
        print(f"\n✅ خطا با موفقیت اضافه شد! (Total: {len(errors)} errors)")
        print(f"🆔 ID: {error_id}")
        return True
    else:
        print("\n❌ لغو شد")
        return False

def add_error_quick(title, error_text, description, solutions_text):
    """اضافه کردن سریع خطا با پارامترها"""
    error_id = generate_id(title)
    
    # پردازش راه حل‌ها
    solutions = []
    if solutions_text:
        solution_lines = solutions_text.strip().split('\n')
        current_solution = {"title": "راه حل", "steps": []}
        step_num = 1
        
        for line in solution_lines:
            line = line.strip()
            if line:
                current_solution["steps"].append({
                    "number": step_num,
                    "text": line,
                    "code": ""
                })
                step_num += 1
        
        if current_solution["steps"]:
            solutions.append(current_solution)
    
    new_error = {
        "id": error_id,
        "title": title,
        "type": "error",
        "errorText": error_text,
        "keywords": [title, error_text],
        "description": description,
        "solutions": solutions,
        "tags": ["General"],
        "dateAdded": datetime.now().isoformat()
    }
    
    errors = load_errors()
    errors.append(new_error)
    save_errors(errors)
    
    print(f"✅ خطا اضافه شد! ID: {error_id}")
    return error_id

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # حالت سریع با آرگومان‌ها
        if len(sys.argv) >= 4:
            title = sys.argv[1]
            error_text = sys.argv[2]
            description = sys.argv[3]
            solutions = sys.argv[4] if len(sys.argv) > 4 else ""
            add_error_quick(title, error_text, description, solutions)
        else:
            print("Usage: python add_error.py <title> <error_text> <description> [solutions]")
    else:
        # حالت تعاملی
        add_error_interactive()
