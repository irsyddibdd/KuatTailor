document.addEventListener('DOMContentLoaded', function() {

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar.offsetHeight; // Dapatkan tinggi navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > navbarHeight / 2) { // Aktif setelah scroll sedikit
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Ganti ikon burger/close
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                 // Optional: disable scroll on body when menu is open
                 // document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Optional: enable scroll
                // document.body.style.overflow = '';
            }
        });

        // Tutup menu saat link di klik (untuk SPA)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                     // Optional: enable scroll
                    // document.body.style.overflow = '';
                }
            });
        });

        // Tutup menu jika klik di luar area menu (optional)
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navbar.contains(event.target);
            // Pastikan target klik bukan tombol toggle itu sendiri
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                 navMenu.classList.remove('active');
                 menuToggle.querySelector('i').classList.remove('fa-times');
                 menuToggle.querySelector('i').classList.add('fa-bars');
                  // Optional: enable scroll
                 // document.body.style.overflow = '';
            }
        });
    }


    // --- Smooth Scroll & Active Link Highlighting ---
    const allNavLinks = document.querySelectorAll('.nav-link, .logo[href^="#"], .btn[href^="#"]'); // Semua link internal

    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Ambil tinggi navbar TERBARU setiap kali klik, karena bisa berubah (meski jarang)
                    const currentNavbarHeight = document.getElementById('navbar').offsetHeight;
                    const offsetPosition = targetElement.offsetTop - currentNavbarHeight + 1; // Offset +1px

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Tutup menu mobile jika terbuka setelah klik
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        menuToggle.querySelector('i').classList.remove('fa-times');
                        menuToggle.querySelector('i').classList.add('fa-bars');
                        // document.body.style.overflow = '';
                    }
                }
            }
        });
    });

     // --- Active link highlighting on scroll ---
     const sectionsForHighlight = document.querySelectorAll('section[id]'); // Dapatkan semua section yang punya ID
     window.addEventListener('scroll', navHighlighter);

     function navHighlighter() {
         // Ambil tinggi navbar TERBARU saat scroll
         const currentNavbarHeight = document.getElementById('navbar').offsetHeight;
         let scrollY = window.pageYOffset;

         sectionsForHighlight.forEach(current => {
             const sectionHeight = current.offsetHeight;
             // Sesuaikan offset dengan tinggi navbar saat ini
             const sectionTop = current.offsetTop - currentNavbarHeight - 50;
             let sectionId = current.getAttribute('id');

             /* Pastikan elemen target link ada sebelum mencoba mengakses classList */
             const targetLink = document.querySelector('#nav-menu a[href="#' + sectionId + '"]'); // Lebih spesifik href="#id"
             if (targetLink) {
                 if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    // Hapus active dari semua link dulu
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Tambahkan active ke link yang sesuai
                    targetLink.classList.add('active');
                 } else {
                     targetLink.classList.remove('active');
                 }
             }
         });

          // Penanganan khusus untuk highlight "Home" saat di paling atas
         const homeLink = document.querySelector('#nav-menu a[href="#hero"]');
         if(homeLink){
             // Jika scroll di atas section pertama (dikurangi offset) ATAU scroll benar2 di 0
             if (scrollY < sectionsForHighlight[0].offsetTop - currentNavbarHeight - 50 || scrollY < 50) {
                // Hapus active dari semua link dulu
                navLinks.forEach(link => link.classList.remove('active'));
                // Tambahkan ke home
                homeLink.classList.add('active');
             } else if (scrollY >= sectionsForHighlight[0].offsetTop - currentNavbarHeight - 50) {
                // Jika sudah masuk section pertama, hapus paksa active dari home jika section pertama BELUM active
                const firstSectionLink = document.querySelector('#nav-menu a[href="#' + sectionsForHighlight[0].id + '"]');
                if (firstSectionLink && !firstSectionLink.classList.contains('active')) {
                     homeLink.classList.remove('active');
                }
             }
         }
     }
     // Initial call to set active link on page load
     navHighlighter();


    // --- Section Fade-in Animation on Scroll ---
    const sectionsToFade = document.querySelectorAll('.fade-in-section');
    const appearOptions = {
        threshold: 0.15, // Trigger saat 15% section terlihat
        rootMargin: "0px 0px -50px 0px" // Trigger sedikit lebih awal
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // Jangan lakukan apa-apa jika tidak terlihat
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Hentikan observasi setelah tampil
            }
        });
    }, appearOptions);

    sectionsToFade.forEach(section => {
        appearOnScroll.observe(section);
    });

    // --- Update Footer Year ---
    const currentYearElement = document.getElementById('currentYear');
    if(currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }


// --- Penanganan Form Kontak untuk WhatsApp (REVISI: Tampilan Status Lebih Baik) ---
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status'); // Ambil elemen status

if (contactForm && formStatus) { // Pastikan form dan status elemen ada
    contactForm.addEventListener('submit', function(event) {
        // 1. Hentikan pengiriman form default
        event.preventDefault();

        // --- Bersihkan status sebelumnya ---
        formStatus.textContent = '';
        formStatus.className = ''; // Hapus semua class styling sebelumnya
        formStatus.classList.remove('visible'); // Pastikan tersembunyi sebelum mulai

        // 2. Ambil nilai dari field form
        const nama = document.getElementById('name').value.trim();
        const telepon = document.getElementById('phone').value.trim();
        const layananElement = document.getElementById('service');
        const layananValue = layananElement.value;
        // Ambil teks opsi yang dipilih, bukan value-nya, jika ada
        const layananText = layananValue ? layananElement.options[layananElement.selectedIndex].text : '';
        const pesanUser = document.getElementById('message').value.trim();

        // --- Validasi Sederhana ---
        if (!nama || !pesanUser) {
            formStatus.textContent = ' Mohon lengkapi Nama dan Pesan Anda.'; // Tambah spasi agar tidak terlalu dekat ikon
            formStatus.className = 'error visible'; // Terapkan class error dan visible
            return; // Hentikan proses
        }
        // --- Akhir Validasi ---

        // 3. Tampilkan status loading yang lebih menarik
        formStatus.textContent = ' Mempersiapkan pesan ke WhatsApp...'; // Tambah spasi
        formStatus.className = 'loading visible'; // Terapkan class loading dan visible

        // 4. Siapkan data untuk WhatsApp
        const nomorWhatsApp = '6283842431599'; // Pastikan nomor benar
        let pesanWA = `*Pesan dari Website Kuat Tailor*\n\n`;
        pesanWA += `Nama: *${nama}*\n`;
        if (telepon) {
            pesanWA += `Telepon: ${telepon}\n`;
        }
        if (layananText) {
            pesanWA += `Layanan: *${layananText}*\n`;
        }
        pesanWA += `\nPesan:\n${pesanUser}\n`;
        const pesanEncoded = encodeURIComponent(pesanWA);
        const urlWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${pesanEncoded}`;

        // 5. Beri jeda sejenak, lalu buka WhatsApp & update status
        setTimeout(() => {
            // Buka WhatsApp di tab baru
            window.open(urlWhatsApp, '_blank');

            // 6. Update status ke sukses & Reset form
            formStatus.textContent = ' Pengalihan berhasil! Silakan periksa tab/aplikasi WhatsApp Anda.'; // Pesan lebih jelas
            formStatus.className = 'success visible'; // Ganti class ke success dan visible
            contactForm.reset(); // Reset field form

            // 7. (Opsional) Sembunyikan pesan status setelah beberapa detik agar tidak permanen
            setTimeout(() => {
                formStatus.classList.remove('visible');
                // Kita bisa tunda penghapusan class styling jika perlu (misal, agar transisi opacity selesai)
                // setTimeout(() => { formStatus.className = ''; }, 400); // Sesuaikan delay dengan durasi transisi CSS
            }, 8000); // Biarkan pesan sukses terlihat selama 8 detik

        }, 1200); // Jeda 1.2 detik sebelum membuka WhatsApp (user sempat lihat loading)
    });
}
// --- Akhir Penanganan Form Kontak ---


}); // End DOMContentLoaded