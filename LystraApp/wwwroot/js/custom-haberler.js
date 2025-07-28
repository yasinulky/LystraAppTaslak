const newsData = [
    {
        title: "Yapay Zeka ile Gelecek",
        image: "/images/all/1.jpg",
        date: "2024-06-01",
        summary: "Yapay zeka teknolojileri iş dünyasında devrim yaratıyor. Sektör liderleri, yeni nesil çözümlerle verimliliği artırıyor.",
        content: "Yapay zeka teknolojileri, iş dünyasında verimlilik ve inovasyonun anahtarı haline geldi. Son yıllarda yapılan yatırımlar ve geliştirilen projeler, şirketlerin rekabet gücünü artırıyor. Bu gelişmelerin detayları ve sektörel etkileri için haberimizin tamamını okuyun.",
        category: "Teknoloji"
    },
    {
        title: "Güneş Enerjisinde Yeni Dönem",
        image: "/images/all/2.jpg",
        date: "2024-05-20",
        summary: "Yenilenebilir enerji yatırımları hızla artıyor. Güneş panelleriyle sürdürülebilir bir gelecek mümkün.",
        content: "Güneş enerjisi alanında yapılan yeni yatırımlar, sürdürülebilir bir gelecek için umut vadediyor. Türkiye'de ve dünyada güneş enerjisi projeleri hızla yaygınlaşıyor. Detaylar için haberimizin tamamını inceleyin.",
        category: "Enerji"
    },
    {
        title: "Sağlıkta Dijitalleşme",
        image: "/images/all/3.jpg",
        date: "2024-05-10",
        summary: "Tele-tıp ve uzaktan sağlık hizmetleri, hastalara hızlı ve etkili çözümler sunuyor.",
        content: "Sağlık sektöründe dijitalleşme, hastalara daha hızlı ve etkili hizmet sunulmasını sağlıyor. Tele-tıp uygulamaları ve uzaktan sağlık hizmetlerinin avantajları, yeni teknolojilerle birleşiyor. Ayrıntılar için haberimizin detayına göz atın.",
        category: "Sağlık"
    },
    {
        title: "Uzayda Türk Bilim İnsanları",
        image: "/images/all/4.jpg",
        date: "2024-04-28",
        summary: "Türk bilim insanları, uluslararası uzay projelerinde önemli başarılara imza atıyor.",
        content: "Türk bilim insanlarının uluslararası uzay projelerindeki başarıları, ülkemizin bilim dünyasındaki yerini güçlendiriyor. Uzay araştırmalarında elde edilen son gelişmeler ve projeler için haberimizin tamamını okuyun.",
        category: "Bilim"
    },
    {
        title: "Akıllı Şehirler Yükseliyor",
        image: "/images/all/5.jpg",
        date: "2024-04-15",
        summary: "IoT ve büyük veri ile şehirler daha yaşanabilir ve güvenli hale geliyor.",
        content: "Akıllı şehir projeleri, IoT ve büyük veri teknolojileriyle şehir yaşamını daha güvenli ve konforlu hale getiriyor. Türkiye'den ve dünyadan örneklerle akıllı şehirlerin geleceği haberimizde.",
        category: "Şehircilik"
    },
    {
        title: "Mobil Uygulamalarda Güvenlik",
        image: "/images/all/6.jpg",
        date: "2024-04-01",
        summary: "Kişisel verilerin korunması için mobil uygulama güvenliği ön planda tutuluyor.",
        content: "Mobil uygulama güvenliği, kişisel verilerin korunmasında kritik rol oynuyor. Kullanıcıların güvenliği için alınan önlemler ve yeni teknolojiler haberimizin detayında.",
        category: "Teknoloji"
    }
];

let filteredNews = [...newsData];

function renderNewsGrid() {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';
    if(filteredNews.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#bfa76a;font-size:1.2rem;">Sonuç bulunamadı.</div>';
        return;
    }
    filteredNews.forEach((news, idx) => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <div class="news-img" style="background-image:url('${news.image}');"></div>
            <div class="news-content">
                <h2>${news.title}</h2>
                <p>${news.summary}</p>
                <span class="news-link" onclick="openNewsModal(${idx})">Devamını Oku &rarr;</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openNewsModal(idx) {
    const news = filteredNews[idx];
    document.getElementById('modalImage').src = news.image;
    document.getElementById('modalTitle').textContent = news.title;
    document.getElementById('modalDescription').textContent = news.content;
    document.getElementById('modalMeta').innerHTML = `
        <div class="meta-item"><strong>Kategori:</strong> ${news.category}</div>
        <div class="meta-item"><strong>Tarih:</strong> ${news.date}</div>
    `;
    document.getElementById('newsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeNewsModal() {
    document.getElementById('newsModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}
document.getElementById('newsModal').addEventListener('click', function(e) {
    if (e.target === this) closeNewsModal();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNewsModal();
});

document.getElementById('sortNews').addEventListener('change', function() {
    const val = this.value;
    if(val === 'desc') filteredNews.sort((a,b)=>b.date.localeCompare(a.date));
    else if(val === 'asc') filteredNews.sort((a,b)=>a.date.localeCompare(b.date));
    else if(val === 'az') filteredNews.sort((a,b)=>a.title.localeCompare(b.title));
    else if(val === 'za') filteredNews.sort((a,b)=>b.title.localeCompare(a.title));
    renderNewsGrid();
});
document.getElementById('searchNews').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    filteredNews = newsData.filter(n=>n.title.toLowerCase().includes(q));
    document.getElementById('sortNews').dispatchEvent(new Event('change'));
});
// Varsayılan sıralama: en yeni
filteredNews.sort((a,b)=>b.date.localeCompare(a.date));
renderNewsGrid(); 