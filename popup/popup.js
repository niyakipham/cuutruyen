document.addEventListener('DOMContentLoaded', () => {
    const extractBtn = document.getElementById('extractBtn');
    const sendToAppBtn = document.getElementById('sendToAppBtn');
    const dataPreview = document.querySelector('.data-preview');
    const previewContent = document.querySelector('.preview-content');
    const statusText = document.querySelector('.status-text');
    const progressBar = document.querySelector('.progress');
    
    extractBtn.addEventListener('click', () => {
      statusText.textContent = "Extracting data...";
      progressBar.style.width = "30%";
      
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "extractComicData"}, (response) => {
          if (response && response.success) {
            progressBar.style.width = "100%";
            statusText.textContent = "Data extracted successfully";
            
            // Display preview
            previewContent.innerHTML = `
              <p><strong>Title:</strong> ${response.data.title}</p>
              <p><strong>Author:</strong> ${response.data.author}</p>
              <p><strong>Chapters:</strong> ${response.data.chapters.length}</p>
              <p><strong>Genres:</strong> ${response.data.genres.join(', ')}</p>
            `;
            
            dataPreview.classList.remove('hidden');
            sendToAppBtn.classList.remove('hidden');
            
            // Store data temporarily
            chrome.storage.local.set({comicData: response.data}, () => {
              console.log('Data stored temporarily');
            });
          } else {
            progressBar.style.width = "0%";
            statusText.textContent = "Failed to extract data";
            previewContent.textContent = "Please make sure you're on a comic page at cuutruyen.net";
            dataPreview.classList.remove('hidden');
          }
        });
      });
    });
    
    sendToAppBtn.addEventListener('click', () => {
      statusText.textContent = "Sending to app...";
      progressBar.style.width = "0%";
      
      chrome.storage.local.get(['comicData'], (result) => {
        if (result.comicData) {
          // In a real app, you would send this to your web server or use another method
          // For this example, we'll just show a message
          setTimeout(() => {
            statusText.textContent = "Data sent to app!";
            progressBar.style.width = "100%";
          }, 1000);
        }
      });
    });
  });