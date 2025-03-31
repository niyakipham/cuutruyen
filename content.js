chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractComicData") {
      const comicData = extractComicData();
      sendResponse({success: true, data: comicData});
    }
  });
  
  function extractComicData() {
    // Extract comic info
    const title = document.querySelector('.comic-detail h1')?.innerText || 'Unknown';
    const author = document.querySelector('.author a')?.innerText || 'Unknown';
    const cover = document.querySelector('.comic-cover img')?.src || '';
    const status = document.querySelector('.status')?.innerText || 'Unknown';
    const description = document.querySelector('.comic-description')?.innerText || '';
    
    // Extract chapters
    const chapters = [];
    document.querySelectorAll('.chapter-list li a').forEach(el => {
      chapters.push({
        title: el.innerText.trim(),
        url: el.href
      });
    });
    
    // Extract genres
    const genres = [];
    document.querySelectorAll('.genre-list a').forEach(el => {
      genres.push(el.innerText.trim());
    });
    
    return {
      title,
      author,
      cover,
      status,
      description,
      genres,
      chapters
    };
  }