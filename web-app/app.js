document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const comicList = document.querySelector('.comic-list');
    const comicDetail = document.querySelector('.comic-detail');
    const backBtn = document.getElementById('backBtn');
    const syncBtn = document.getElementById('syncBtn');
    const themeBtn = document.getElementById('themeBtn');
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    // Sample data - in a real app, this would come from a server or IndexedDB
    let comics = [];
    
    // Initialize the app
    init();
    
    function init() {
      loadComics();
      setupEventListeners();
      checkThemePreference();
    }
    
    function loadComics() {
      // In a real app, you would fetch this from your database
      comics = JSON.parse(localStorage.getItem('cuutruyen_comics')) || [];
      renderComicList();
    }
    
    function renderComicList() {
      comicList.innerHTML = '';
      
      if (comics.length === 0) {
        comicList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-book-open"></i>
            <p>No comics found. Sync with extension to add comics.</p>
          </div>
        `;
        return;
      }
      
      comics.forEach(comic => {
        const comicCard = document.createElement('div');
        comicCard.className = 'comic-card';
        comicCard.innerHTML = `
          <img src="${comic.cover}" alt="${comic.title}" class="comic-cover-img">
          <div class="comic-info">
            <h3>${comic.title}</h3>
            <p>${comic.author}</p>
          </div>
        `;
        
        comicCard.addEventListener('click', () => showComicDetail(comic));
        comicList.appendChild(comicCard);
      });
    }
    
    function showComicDetail(comic) {
      document.querySelector('.comic-title').textContent = comic.title;
      document.querySelector('.comic-cover').src = comic.cover;
      document.querySelector('.comic-author').textContent = `Author: ${comic.author}`;
      document.querySelector('.comic-status').textContent = comic.status;
      document.querySelector('.comic-genres').textContent = `Genres: ${comic.genres.join(', ')}`;
      document.querySelector('.comic-description').textContent = comic.description;
      
      const chapterList = document.querySelector('.chapter-list');
      chapterList.innerHTML = '';
      
      comic.chapters.forEach(chapter => {
        const chapterItem = document.createElement('div');
        chapterItem.className = 'chapter-item';
        chapterItem.textContent = chapter.title;
        chapterItem.addEventListener('click', () => {
          // In a real app, you would open the chapter
          alert(`Opening chapter: ${chapter.title}`);
        });
        chapterList.appendChild(chapterItem);
      });
      
      comicList.style.display = 'none';
      comicDetail.classList.add('show');
    }
    
    function setupEventListeners() {
      backBtn.addEventListener('click', () => {
        comicDetail.classList.remove('show');
        comicList.style.display = 'grid';
      });
      
      syncBtn.addEventListener('click', simulateSync);
      
      themeBtn.addEventListener('click', toggleTheme);
    }
    
    function simulateSync() {
      showLoading();
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, you would get this data from your extension
        const sampleComic = {
          title: "Sample Comic",
          author: "Sample Author",
          cover: "https://via.placeholder.com/300x400?text=Comic+Cover",
          status: "Ongoing",
          description: "This is a sample comic description that would be extracted from cuutruyen.net",
          genres: ["Action", "Adventure", "Fantasy"],
          chapters: [
            { title: "Chapter 1", url: "#" },
            { title: "Chapter 2", url: "#" },
            { title: "Chapter 3", url: "#" }
          ]
        };
        
        comics.unshift(sampleComic);
        localStorage.setItem('cuutruyen_comics', JSON.stringify(comics));
        renderComicList();
        hideLoading();
      }, 1500);
    }
    
    function showLoading() {
      loadingOverlay.classList.remove('hidden');
    }
    
    function hideLoading() {
      loadingOverlay.classList.add('hidden');
    }
    
    function checkThemePreference() {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      } else {
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      }
    }
    
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
          console.log('ServiceWorker registration successful');
        }).catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  });