window.Resources = {
  init() {
    // Load saved notes if any
    const saved = localStorage.getItem('mos_saved_notes');
    if (saved) {
      const el = document.getElementById('resource-notes');
      if(el) el.value = saved;
    }
  },

  saveNotes() {
    const el = document.getElementById('resource-notes');
    if(el) {
       localStorage.setItem('mos_saved_notes', el.value);
       if(window.Toast) Toast.success("Notes saved successfully!");
       if(window.Storage) Storage.addActivity({ type: 'other', text: 'Saved a study mindmap/note' });
    }
  },

  async processFile() {
    const fileInput = document.getElementById('resource-file-upload');
    const amountInput = document.getElementById('resource-q-amount');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      if(window.Toast) Toast.error("Please upload a .txt or .md file first!");
      return;
    }
    
    const file = fileInput.files[0];
    const amount = parseInt(amountInput.value) || 5;
    
    if(window.Toast) Toast.info("Analyzing document...");
    
    const text = await file.text();
    
    // Simple heuristic parser for the mock AI
    const sentences = text.split(/[.?!]/).filter(s => s.trim().length > 10);
    const words = text.split(/\s+/);
    
    // Extract keywords (words with length > 6 and capitalized, or common Word terms)
    const mosTerms = ['Ribbon', 'Layout', 'Margin', 'Font', 'Paragraph', 'Style', 'Table', 'Insert', 'Header', 'Footer', 'Reference', 'Mailings', 'Review', 'View', 'Clipboard', 'Format', 'Painter'];
    const keywordsFound = [...new Set(words.filter(w => mosTerms.some(t => w.toLowerCase().includes(t.toLowerCase()))))];
    
    // Generate explanation chunks
    let breakdownHTML = '';
    if (keywordsFound.length > 0) {
       breakdownHTML += `<p><strong>Core Concepts Detected:</strong> ${keywordsFound.join(', ')}</p>`;
       breakdownHTML += `<ul style="margin-top:10px; padding-left:20px">`;
       keywordsFound.slice(0, 3).forEach(kw => {
          breakdownHTML += `<li style="margin-bottom:5px"><b>${kw}:</b> This is a crucial element in MOS Word exams, usually located in the top navigation ribbon. Ensure you know how to apply and modify it.</li>`;
       });
       breakdownHTML += `</ul>`;
    } else {
       breakdownHTML = `<p>The uploaded text appears to be general notes. Break them down into bullet points and memorize the sequence of clicks for each feature mentioned.</p>`;
    }
    
    // Generate questions
    let questionsHTML = '';
    const qCount = Math.min(amount, sentences.length || 5);
    for(let i = 0; i < qCount; i++) {
       let source = sentences[i % sentences.length];
       if(!source) source = "To save a document quickly, you should press Ctrl+S.";
       questionsHTML += `
         <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:5px; margin-bottom:10px; border-left:3px solid var(--accent-yellow)">
           <p style="margin-bottom:5px; font-weight:bold">Q${i+1}: Based on your notes, what is the significance of the following statement?</p>
           <p style="font-style:italic; opacity:0.8">"${source.trim()}"</p>
         </div>
       `;
    }
    
    // Generate YouTube links
    let ytHTML = '';
    let searchTerms = keywordsFound.slice(0, 3);
    if(searchTerms.length === 0) searchTerms = ['MOS Word 2019', 'Microsoft Word Tutorial'];
    
    searchTerms.forEach(term => {
       ytHTML += `
         <a href="https://www.youtube.com/results?search_query=${encodeURIComponent('MOS Word ' + term)}" target="_blank" class="btn btn-secondary" style="text-align:left; display:flex; justify-content:space-between">
           <span>📺 Learn about ${term}</span>
           <span>↗</span>
         </a>
       `;
    });
    
    // Display results
    document.getElementById('resource-explanation-content').innerHTML = breakdownHTML;
    document.getElementById('resource-questions-content').innerHTML = questionsHTML;
    document.getElementById('resource-youtube-links').innerHTML = ytHTML;
    
    const outArea = document.getElementById('resource-output-area');
    outArea.style.display = 'block';
    outArea.scrollIntoView({ behavior: 'smooth' });
    
    if(window.Storage) Storage.addActivity({ type: 'other', text: `Generated ${amount} questions from uploaded notes` });
    if(window.Toast) Toast.success("Analysis complete!");
  }
};
