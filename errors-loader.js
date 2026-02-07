/**
 * سیستم بارگذاری و نمایش خطاها از فایل JSON
 */

// بارگذاری خطاها از JSON
async function loadErrorsFromJSON() {
    try {
        console.log('🔄 در حال بارگذاری errors.json...');
        const response = await fetch('errors.json');
        const errors = await response.json();
        console.log(`📦 ${errors.length} خطا از JSON دریافت شد:`, errors.map(e => e.title));
        renderErrors(errors);
        return errors;
    } catch (error) {
        console.error('❌ Error loading errors.json:', error);
        return [];
    }
}

// رندر کردن خطاها
function renderErrors(errors) {
    const problemsList = document.getElementById('problemsList');
    
    // اضافه کردن خطاهای JSON به کارت‌های موجود (بدون پاک کردن)
    errors.forEach(error => {
        const card = createErrorCard(error);
        problemsList.appendChild(card);
    });
    
    console.log(`✅ ${errors.length} خطا از JSON اضافه شد`);
}

// ساخت کارت خطا
function createErrorCard(error) {
    const card = document.createElement('div');
    card.className = 'problem-card';
    card.id = error.id;
    card.dataset.keywords = error.keywords.join(' ').toLowerCase();
    
    // تعیین رنگ header بر اساس نوع
    const headerColors = {
        error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        warning: 'linear-gradient(135deg, #f39c12, #d68910)',
        info: 'linear-gradient(135deg, #3498db, #2980b9)',
        success: 'linear-gradient(135deg, #27ae60, #1e8449)'
    };
    
    // ساخت header
    const header = document.createElement('div');
    header.className = 'problem-header';
    header.style.background = headerColors[error.type] || headerColors.error;
    header.innerHTML = `
        <h3>${error.title}</h3>
        <span class="toggle-icon">▼</span>
    `;
    header.onclick = () => toggleCard(card);
    
    // ساخت محتوا
    const content = document.createElement('div');
    content.className = 'problem-content';
    
    let contentHTML = '';
    
    // متن خطا
    if (error.errorText) {
        contentHTML += `
            <div class="error-box">${escapeHtml(error.errorText)}</div>
        `;
    }
    
    // توضیح
    if (error.description) {
        contentHTML += `
            <p style="margin-bottom: 20px; line-height: 1.8; color: #444;">
                ${escapeHtml(error.description)}
            </p>
        `;
    }
    
    // راه حل‌ها
    if (error.solutions && error.solutions.length > 0) {
        error.solutions.forEach((solution, index) => {
            contentHTML += `
                <div class="solution-section">
                    <h4>💡 ${escapeHtml(solution.title)}</h4>
            `;
            
            solution.steps.forEach(step => {
                contentHTML += `
                    <div class="step">
                        <div class="step-number">${step.number}</div>
                        <div class="step-content">
                            <p>${escapeHtml(step.text)}</p>
                `;
                
                if (step.code) {
                    const codeId = `code-${error.id}-${index}-${step.number}`;
                    contentHTML += `
                        <div class="code-block" id="${codeId}">
                            <button class="copy-btn" onclick="copyCode('${codeId}')">📋 کپی</button>
                            ${escapeHtml(step.code)}
                        </div>
                    `;
                }
                
                contentHTML += `
                        </div>
                    </div>
                `;
            });
            
            contentHTML += `</div>`;
        });
    }
    
    // تگ‌ها
    if (error.tags && error.tags.length > 0) {
        contentHTML += `
            <div class="keywords">
                ${error.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
        `;
    }
    
    content.innerHTML = contentHTML;
    
    card.appendChild(header);
    card.appendChild(content);
    
    return card;
}

// تابع کمکی برای escape کردن HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
}

// Toggle کارت
function toggleCard(card) {
    card.classList.toggle('open');
}

// کپی کردن کد
function copyCode(elementId) {
    const codeBlock = document.getElementById(elementId);
    const button = codeBlock.querySelector('.copy-btn');
    const codeText = codeBlock.textContent.replace('📋 کپی', '').trim();
    
    navigator.clipboard.writeText(codeText).then(() => {
        const originalText = button.textContent;
        button.textContent = '✅ کپی شد!';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#667eea';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        button.textContent = '❌ خطا';
        button.style.background = '#e74c3c';
    });
}

// جستجوی خطاها
function searchErrors(query) {
    const cards = document.querySelectorAll('.problem-card');
    const searchQuery = query.toLowerCase().trim();
    let visibleCount = 0;
    
    console.log(`🔍 جستجو برای: "${query}"`);
    console.log(`📋 تعداد کارت‌ها: ${cards.length}`);
    
    cards.forEach((card, index) => {
        const keywords = card.dataset.keywords || '';
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const content = card.textContent.toLowerCase();
        
        console.log(`📌 کارت ${index + 1}:`, {
            id: card.id,
            title: card.querySelector('h3')?.textContent,
            keywords: keywords.substring(0, 100), // فقط 100 کاراکتر اول
            matched: keywords.includes(searchQuery) || title.includes(searchQuery)
        });
        
        if (!searchQuery || 
            keywords.includes(searchQuery) || 
            title.includes(searchQuery) || 
            content.includes(searchQuery)) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    console.log(`✅ نتایج: ${visibleCount} از ${cards.length}`);
    updateResultsInfo(visibleCount, cards.length);
}

// آپدیت اطلاعات نتایج
function updateResultsInfo(visible, total) {
    const resultsInfo = document.getElementById('resultsInfo');
    const clearBtn = document.getElementById('clearBtn');
    
    if (visible === total) {
        resultsInfo.textContent = `${total} مشکل موجود`;
        clearBtn.style.display = 'none';
    } else {
        resultsInfo.textContent = `${visible} از ${total} مشکل یافت شد`;
        clearBtn.style.display = 'inline-block';
    }
}

// پاک کردن جستجو
function clearSearch() {
    document.getElementById('searchInput').value = '';
    searchErrors('');
}

// فیلتر بر اساس تگ
function filterByTag(tag) {
    document.getElementById('searchInput').value = tag;
    searchErrors(tag);
}

// جستجوی دقیق
function exactSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    
    const cards = document.querySelectorAll('.problem-card');
    let found = false;
    
    cards.forEach(card => {
        const errorBox = card.querySelector('.error-box');
        if (errorBox && errorBox.textContent.includes(query)) {
            card.classList.remove('hidden');
            card.classList.add('open');
            found = true;
        } else {
            card.classList.add('hidden');
        }
    });
    
    if (found) {
        updateResultsInfo(1, cards.length);
    } else {
        alert('❌ خطای دقیق یافت نشد! جستجوی عادی را امتحان کنید.');
        searchErrors(query);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    // بارگذاری خطاها
    await loadErrorsFromJSON();
    
    // تنظیم جستجو
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchErrors(e.target.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            exactSearch();
        }
    });
    
    // نمایش تعداد کل
    const totalCards = document.querySelectorAll('.problem-card').length;
    updateResultsInfo(totalCards, totalCards);
});
