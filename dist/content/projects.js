globalThis.NEZ_PROJECTS = (() => {
  const withMedia = project => ({ role: null, devlog: null, status: null, demo: null, source: null, media: { cover: null, gallery: [], video: null }, ...project });
  const studyVerseGallery = [
    {
      src: 'media/projects/studyverse/02_oyuncu_koyu.png', width: 1280, height: 800,
      alt: { tr: 'Godot prototipinde sekize sekiz izometrik araziye yerleştirilmiş mavi çatılı ev ve ağaç. Altta market ve soru çözme düğmeleri var.', en: 'A blue-roofed house and a tree placed on an eight-by-eight isometric plot in the Godot prototype, with Market and Solve a Question buttons below.' },
      caption: { tr: 'Godot prototipi · Oyuncunun geliştirdiği köy', en: 'Godot prototype · Player-built village' }
    },
    {
      src: 'media/projects/studyverse/01_tanitim_sitesi.png', width: 1280, height: 800,
      alt: { tr: 'StudyVerse tanıtım sitesinin giriş bölümünde “Bir soru çöz. Bir dünya kur.” başlığı ve örnek bir izometrik köy var.', en: 'The StudyVerse landing page shows the headline “Solve a question. Build a world.” and an example isometric village.' },
      caption: { tr: 'Tanıtım sitesi · Örnek köy görseli', en: 'Landing page · Example village illustration' }
    },
    {
      src: 'media/projects/studyverse/03_fonksiyon_sorusu.png', width: 1280, height: 800,
      alt: { tr: 'Köy ekranının üzerinde dört seçenekli bir demo fonksiyon sorusu. f(x) = 2x + 3 için f(2) soruluyor.', en: 'A four-option demo question over the village screen asks for f(2) when f(x) = 2x + 3.' },
      caption: { tr: 'Oyun prototipi · Demo fonksiyon sorusu', en: 'Game prototype · Sample function question' }
    }
  ];
  const sushiGallery = [
    {
      src: 'media/projects/sushisim/playing.webp', width: 1919, height: 1079,
      alt: { tr: 'Sushi, tırmalama direğinin yanında karton kutunun içinde. Oyun göstergeleri ve komut düğmeleri görünüyor.', en: 'Sushi sits in a cardboard box beside the scratching post, with the status bars and action buttons on screen.' },
      caption: { tr: 'Oyun zamanı', en: 'Playtime' }
    },
    {
      src: 'media/projects/sushisim/sleeping.webp', width: 1919, height: 1079,
      alt: { tr: 'Sushi, sağdaki pembe yatağında kıvrılıp uyuyor.', en: 'Sushi is curled up asleep in the pink bed on the right.' },
      caption: { tr: 'Uyku zamanı', en: 'Nap time' }
    },
    {
      src: 'media/projects/sushisim/feeding.webp', width: 1918, height: 1079,
      alt: { tr: 'Sushi, soldaki mavi mama kabının önünde oturuyor.', en: 'Sushi sits in front of the blue food bowl on the left.' },
      caption: { tr: 'Mama zamanı', en: 'Feeding time' }
    }
  ];
  const serverMedia = {
    'dashboard': {
      src: 'media/projects/server-suite/dashboard.webp', width: 1917, height: 1078,
      alt: { tr: 'WinForms ana panelinde veritabanı bağlantısı, aktif oyuncu ve sunucu sayaçları, destek talepleri, ban sayısı ve doluluk çubukları.', en: 'The WinForms dashboard shows the database connection, counts for active players and servers, support tickets and bans, and occupancy bars.' },
      caption: { tr: 'WinForms · SQL Server bağlantılı ana panel', en: 'WinForms · Dashboard connected to SQL Server' }
    },
    'admin-login': {
      src: 'media/projects/server-suite/admin-login.webp', width: 1086, height: 708,
      alt: { tr: 'Mor yönetici giriş ekranında boş kullanıcı adı ve şifre alanları.', en: 'The purple admin sign-in screen shows blank username and password fields.' },
      caption: { tr: 'Yönetici giriş ekranı', en: 'Admin sign-in screen' }
    },
    'players': {
      src: 'media/projects/server-suite/players.webp', width: 1133, height: 721,
      alt: { tr: 'Oyuncu kayıtları tablosu. Yanında arama, ekleme, güncelleme, silme ve listeleme kontrolleri var.', en: 'The player records table is shown with search, add, update, delete and list controls.' },
      caption: { tr: 'Oyuncu kayıtları ve CRUD arayüzü', en: 'Player records and CRUD interface' }
    },
    'servers': {
      src: 'media/projects/server-suite/servers.webp', width: 1137, height: 721,
      alt: { tr: 'WinForms ekranındaki SQL Server kayıtlarında bölge, kapasite, durum ve oyun modu sütunları ile kayıt yönetimi kontrolleri.', en: 'SQL Server records in WinForms show columns for region, capacity, status and game mode, alongside record management controls.' },
      caption: { tr: 'WinForms · SQL Server sunucu kayıtları', en: 'WinForms · SQL Server records' }
    },
    'support': {
      src: 'media/projects/server-suite/support.webp', width: 1137, height: 722,
      alt: { tr: 'Destek talepleri ekranında konu, mesaj, durum ve yönetici sütunları ile talep formu.', en: 'The support screen shows ticket subject, message, status and admin columns, along with a ticket form.' },
      caption: { tr: 'Destek talepleri', en: 'Support tickets' }
    },
    'bans': {
      src: 'media/projects/server-suite/bans.webp', width: 1300, height: 948,
      alt: { tr: 'Ban yönetimi ekranında bitiş tarihi ve kalan süre sütunları ile süreli veya süresiz yasaklama formu.', en: 'The ban management screen shows end dates and remaining time, with controls for timed or permanent bans.' },
      caption: { tr: 'Ban yönetimi', en: 'Ban management' }
    },
    'activity-logs': {
      src: 'media/projects/server-suite/activity-logs.webp', width: 1136, height: 721,
      alt: { tr: 'İşlem kayıtları tablosunda giriş, güncelleme, ban, talep ve ekleme kayıtları tarihleriyle listeleniyor.', en: 'The activity log lists dated sign-ins, updates, bans, tickets and additions.' },
      caption: { tr: 'İşlem kayıtları', en: 'Activity logs' }
    },
    'occupancy-report': {
      src: 'media/projects/server-suite/occupancy-report.webp', width: 1297, height: 950,
      alt: { tr: 'WinForms ekranında SQL Server doluluk raporu. Tabloda kapasite, oyuncu sayısı ve doluluk oranı ile oyuncusuz sunucular var. CSV dışa aktarma düğmesi görünüyor.', en: 'The SQL Server occupancy report in WinForms shows capacity, player count and occupancy, including servers with no players. A CSV export button is visible.' },
      caption: { tr: 'WinForms · SQL Server doluluk raporu ve CSV seçeneği', en: 'WinForms · SQL Server occupancy report and CSV option' }
    }
  };
  return [
    {
      id: 'mewmory', section: 'games', cover: 'moon', tech: ['Pixel art'],
      status: { tr: 'Yeni başlandı', en: 'Just started' },
      role: { tr: 'Kişisel oyun projesinin geliştiricisi', en: 'Developer of the personal game project' },
      name: { tr: 'Mewmory', en: 'Mewmory' },
      category: { tr: 'Psikolojik korku', en: 'Psychological horror' },
      summary: { tr: 'Kediler, sırlar ve karanlık bir pixel-art atmosferi.', en: 'Cats, secrets and a dark pixel-art atmosphere.' },
      detail: { tr: 'Kedileri ve gizemi psikolojik korkuyla birleştirdiğim kişisel oyun projem. Pixel-art atmosferi, hikâyenin ve keşif hissinin parçası.', en: 'My personal game project brings cats and mystery together with psychological horror. Its pixel-art atmosphere is part of the storytelling and exploration.' }
      // TODO: Confirm engine and public links when available.
    },
    {
      id: 'studyverse', section: 'games', cover: 'book',
      tech: ['Godot 4.6.2', 'GDScript', 'React', 'TypeScript', 'Vite', 'Supabase', 'PostgreSQL', 'SQL'],
      role: { tr: 'Görsel tasarımı, arayüz kararlarını, proje koordinasyonunu ve manuel testleri yürütüyorum. Teknik geliştirme yapay zekâ desteğiyle ilerliyor.', en: 'I handle visual design, interface decisions, project coordination and manual testing. Technical development is AI-assisted.' },
      name: { tr: 'StudyVerse', en: 'StudyVerse' },
      category: { tr: 'Web tabanlı eğitsel oyun', en: 'Web-based learning game' },
      status: { tr: 'Oynanabilir prototip · Geliştirme aşamasında', en: 'Playable prototype · In development' },
      summary: { tr: 'Fonksiyon sorularını çöz, altın kazan ve izometrik köyünü geliştir.', en: 'Solve function questions, earn gold and build an isometric village.' },
      detail: { tr: 'StudyVerse, lise düzeyinde fonksiyon sorularını izometrik köy geliştirmeyle birleştiren web tabanlı bir oyun prototipi. Doğru cevaplarla altın kazanırsın. Marketten aldığın yapıları arazine yerleştirerek köyünü büyütürsün.', en: 'StudyVerse is a web game prototype that pairs high-school function questions with isometric village building. Correct answers earn gold. Use it to buy structures at the market and place them on your plot.' },
      demo: 'https://remarkable-haupia-e626cf.netlify.app/',
      sections: [
        {
          heading: { tr: 'Prototipte çalışanlar', en: 'What works in the prototype' },
          items: [
            { tr: 'Demo sorusu, pekiştirme ve altın ödülü akışı çalışıyor. Demo soruları öğretmen onayını bekliyor.', en: 'The demo question, follow-up practice and gold reward flow works. The sample questions are awaiting teacher approval.' },
            { tr: 'Marketten yapı alma, köye yerleştirme ve ilerlemeyi tarayıcıda yerel olarak kaydetme çalışıyor.', en: 'You can buy structures at the market, place them in the village and save progress locally in the browser.' }
          ]
        },
        {
          heading: { tr: 'Geliştirme sürüyor', en: 'Still in development' },
          items: [
            { tr: 'Giriş ve öğretmen paneli üzerindeki çalışma sürüyor. Hesaba bağlı köy kaydı, bulut kayıtları, görev atama, aşamalar ve raporlama henüz tamamlanmadı.', en: 'Sign-in and the teacher dashboard are in progress. Account-linked village saves, cloud saves, task assignment, stages and reporting are still incomplete.' }
          ]
        },
        {
          heading: { tr: 'Mobil tanıtım sitesi önizlemesi', en: 'Mobile landing page preview' },
          items: [
            { tr: 'Aşağıdaki 26 saniyelik kayıt, StudyVerse tanıtım sitesinin mobil görünümünü gösterir. Oyun ekranları galeride yer alıyor.', en: 'The 26-second video below shows the StudyVerse landing page on mobile. The gallery contains the in-game screenshots.' }
          ]
        }
      ],
      media: {
        cover: studyVerseGallery[0], gallery: studyVerseGallery,
        video: {
          src: 'media/projects/studyverse/04_Mobil_Site_Onizleme.mp4', poster: studyVerseGallery[1].src,
          title: { tr: 'StudyVerse mobil tanıtım sitesi önizlemesi', en: 'StudyVerse mobile landing page preview' },
          width: 1920, height: 1080
        }
      }
    },
    {
      id: 'sushisim', section: 'games', cover: 'cat', tech: ['C', 'SDL2'],
      media: {
        cover: sushiGallery[0], gallery: sushiGallery,
        video: {
          src: 'media/projects/sushisim/gameplay.mp4', poster: 'media/projects/sushisim/poster.webp',
          title: { tr: 'SushiSim oynanış videosu', en: 'SushiSim gameplay video' },
          width: 1920, height: 1080
        }
      },
      name: { tr: 'SushiSim', en: 'SushiSim' },
      category: { tr: 'Sanal evcil hayvan', en: 'Virtual pet' },
      summary: { tr: 'Sushi adlı kedinin ihtiyaçlarını dengelediğin sanal evcil hayvan oyunu.', en: 'A virtual pet game about keeping a cat named Sushi happy.' },
      detail: { tr: 'Gerçek zamanlı bu mini simülasyonda Sushi’yi besler, onunla oynar ve dinlenmesine yardım edersin. Oyunun temelinde açlık, mutluluk ve enerji dengesini korumak var.', en: 'Feed Sushi, play together and help Sushi rest in this real-time mini simulation. The game is built around balancing hunger, happiness and energy.' },
      source: 'https://github.com/di3withd4zai/SUSHISIM_SANAL_KEDI_SIMULATORU'
      // TODO: Confirm release status.
    },
    {
      id: 'server-system', section: 'coding', cover: 'database', tech: ['SQL Server', 'SQL'],
      name: { tr: 'Online Oyun Sunucu Yönetim Sistemi', en: 'Online Game Server Management System' },
      category: { tr: 'SQL Server veri katmanı', en: 'SQL Server data layer' },
      summary: { tr: 'WinForms yönetim panelini besleyen sunucu, oyuncu ve raporlama verileri.', en: 'Server, player and reporting data for the WinForms administration panel.' },
      detail: { tr: 'Bu SQL Server projesi, çevrimiçi oyun sunucusu yönetim uygulamasının veri katmanıdır. C# Windows Forms paneli sunucu ve oyuncu kayıtlarını bu veritabanından gösterir. Galeride veritabanı sonuçlarını paneldeki görünümleriyle inceleyebilirsin.', en: 'This SQL Server project is the data layer for the online game server management app. The C# Windows Forms panel displays server and player records from this database. The gallery shows how those database results appear in the panel.' },
      sections: [
        {
          heading: { tr: 'Sunucu doluluk raporu', en: 'Server occupancy report' },
          items: [
            { tr: 'Rapor ekranı, oyuncu sayısını ve doluluk oranını hesaplamak için LEFT JOIN, COUNT, GROUP BY ve CASE kullanıldığını gösteriyor.', en: 'The report screen documents its use of LEFT JOIN, COUNT, GROUP BY and CASE to show player counts and occupancy rates.' },
            { tr: 'Tablo oyuncusu olmayan sunucuları da sıfırla gösteriyor. Sonuçların yanında CSV dışa aktarma seçeneği bulunuyor.', en: 'The table includes servers with zero players and displays a CSV export option beside the results.' }
          ]
        }
      ],
      related: { id: 'server-panel', label: { tr: 'WinForms panelini aç', en: 'Open the WinForms panel' } },
      source: 'https://github.com/di3withd4zai/ONLINE_OYUN_SUNUCU_YONETIM_SISTEMI',
      media: { cover: serverMedia['occupancy-report'], gallery: [serverMedia['occupancy-report'], serverMedia.dashboard, serverMedia.servers] }
    },
    {
      id: 'server-panel', section: 'coding', cover: 'terminal', tech: ['C#', 'WinForms', 'SQL Server'],
      role: { tr: 'Masaüstü arayüzü geliştirme', en: 'Desktop interface development' },
      name: { tr: 'Online Oyun Sunucu Yönetim Paneli', en: 'Online Game Server Management Panel' },
      category: { tr: 'C# Windows Forms uygulaması', en: 'C# Windows Forms app' },
      summary: { tr: 'SQL Server bağlantılı masaüstü yönetim paneli.', en: 'A desktop administration panel connected to SQL Server.' },
      detail: { tr: 'C# ve Windows Forms ile geliştirdiğim bu masaüstü paneli, Online Oyun Sunucu Yönetim Sistemi veritabanına bağlanır. Ana panel bağlantı durumunu ve sistem özetini gösterir. Oyuncu ve sunucu kayıtları, destek talepleri, banlar, işlem kayıtları ve raporlar ayrı ekranlarda yer alır.', en: 'I built this C# Windows Forms desktop panel to connect to the Online Game Server Management System database. The dashboard shows the connection status and a system overview. Separate screens present player and server records, support tickets, bans, activity logs and reports.' },
      related: { id: 'server-system', label: { tr: 'SQL Server veri katmanını aç', en: 'Open the SQL Server data layer' } },
      source: 'https://github.com/di3withd4zai/ONLINE_OYUN_SUNUCU_YONETIM_PANELI',
      media: {
        cover: serverMedia.dashboard,
        gallery: [serverMedia.dashboard, serverMedia['admin-login'], serverMedia.players, serverMedia.servers, serverMedia.support, serverMedia.bans, serverMedia['activity-logs'], serverMedia['occupancy-report']]
      }
    },
    {
      id: 'nekon5', section: 'coding', cover: 'script', tech: ['Java 21', 'OOP', 'Eclipse', 'Maven', 'JUnit'],
      name: { tr: 'NekoN5 (ねこN5)', en: 'NekoN5 (ねこN5)' },
      category: { tr: 'Oyunlaştırılmış masaüstü öğrenme uygulaması', en: 'Gamified desktop learning app' },
      summary: { tr: 'JLPT N5 düzeyinde Japonca çalışmak için kedi temalı bir Java uygulaması.', en: 'A cat-themed Java app for studying Japanese at JLPT N5 level.' },
      detail: { tr: 'NekoN5, Japoncaya yeni başlayanlar için masaüstünde kısa alıştırmalar sunmayı amaçlıyor. İlk çalışan sürüm bir konsol quiz’i. Masaüstü arayüzü ve oyunlaştırma katmanı sonraki aşamalar için planlandı.', en: 'NekoN5 aims to give beginners short Japanese practice sessions on desktop. The first working prototype is a console quiz. The desktop interface and game elements are planned for later stages.' },
      status: { tr: 'Aktif geliştirme', en: 'In active development' },
      releaseTarget: { tr: 'v1.0 · 20 Aralık 2026 (hedef tarih)', en: 'v1.0 · December 20, 2026 (target date)' },
      role: { tr: 'Tek geliştirici olarak fikir, gereksinimler, nesne yönelimli mimari, tasarım, kod, test ve dokümantasyonu yürütüyorum. Geliştirme ve öğrenme sürecinde yapay zekâ destekli araçlar kullanıyorum.', en: 'As the solo developer, I handle the concept, requirements, object-oriented architecture, design, code, tests and documentation. I use AI-assisted tools for development and learning.' },
      source: 'https://github.com/di3withd4zai/NekoN5',
      sections: [
        {
          heading: { tr: 'Şu an ne çalışıyor?', en: 'What works today' },
          items: [
            { tr: 'Temel konsol quiz’i soru, cevap, puanlama ve sonuç sınıflarıyla çalışıyor. Beş soru denendi.', en: 'The basic console quiz works with question, answer, scoring and result classes. Five questions were tested.' },
            { tr: 'Maven ve JUnit yapılandırması sürüyor. GitHub deposu açıldı, kod aktarımı ve ilk paketin hazırlanması devam ediyor. Demo henüz yayımlanmadı.', en: 'Maven and JUnit setup is underway. The GitHub repository exists, and code transfer and first package preparation are in progress. A demo has yet to be published.' }
          ]
        },
        {
          heading: { tr: 'Planlanan geliştirmeler', en: 'Planned development' },
          items: [
            { tr: 'Swing masaüstü arayüzü, SQLite ile kullanıcı hesapları ve kurulabilir Windows sürümü.', en: 'A Swing desktop interface, SQLite-backed user accounts and an installable Windows release.' },
            { tr: 'Hiragana, katakana, kelime, kanji ve dil bilgisi için genişletilmiş alıştırmalar.', en: 'Expanded practice modules for hiragana, katakana, vocabulary, kanji and grammar.' },
            { tr: 'Yanlış cevap analizi, aralıklı tekrar, ilerleme takibi ve kişiselleştirme.', en: 'Wrong-answer analysis, spaced repetition, progress tracking and personalization.' },
            { tr: 'Pastel mor piksel sanatla tasarlanan bir Japon kasabası, kedi maskotları, mini görevler ve deneyim puanı (XP).', en: 'A pastel purple pixel-art Japanese town with cat mascots, mini quests and experience points (XP).' }
          ]
        }
      ]
    },
    {
      id: 'portfolio', section: 'coding', cover: 'sparkle', tech: ['HTML', 'CSS', 'JavaScript'], status: 'online',
      role: { tr: 'Web geliştirme ve tasarım', en: 'Web development and design' },
      name: { tr: 'Kişisel portfolyo', en: 'Personal portfolio' },
      category: { tr: 'Web', en: 'Web' },
      summary: { tr: 'Web, kod ve tasarımı bir araya getiren kişisel sitem.', en: 'My personal site brings together web development, code and design.' },
      detail: { tr: 'Özgeçmişimi, projelerimi ve öğrenme notlarımı aynı çatı altında toplayan kişisel web sitem. Bağlantı, portfolyonun GitHub deposuna gider.', en: 'My personal website brings together my résumé, projects and learning notes. The link leads to my portfolio repository on GitHub.' },
      source: 'https://github.com/di3withd4zai/nezaketdemirci.com'
    }
  ].map(withMedia);
})();
