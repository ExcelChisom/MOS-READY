/**
 * MOS-READY Question Bank
 * Real-scenario MOS Word exam questions organized by module
 * Used for Section Quizzes, Mock Exams, and Practice Exams
 */
const QUESTION_BANK = {
  // --- DOCUMENT MANAGEMENT ---
  'doc-management': [
    {
      id: 'dm1', type: 'mc',
      scenario: 'You need to create a new document based on the company\'s quarterly report template.',
      question: 'What is the correct way to create a document from a template in Word?',
      options: ['File → New → Search for or browse templates', 'File → Open → Browse templates folder', 'Insert → Template → New', 'Home → New Document → Template'],
      correct: 0,
      explanation: 'File → New displays available templates including built-in, custom, and online templates.',
      hint: 'Templates are accessed when creating something new, not opening existing files.'
    },
    {
      id: 'dm2', type: 'mc',
      scenario: 'Your supervisor asks you to save the document in a format that anyone can open regardless of their software.',
      question: 'Which format should you save the document as?',
      options: ['.docx', '.pdf', '.doc', '.rtf'],
      correct: 1,
      explanation: 'PDF is universally readable and preserves formatting across all devices and platforms.',
      hint: 'Think about what format doesn\'t require any specific software to open.'
    },
    {
      id: 'dm3', type: 'mc',
      question: 'What keyboard shortcut opens the Navigation Pane?',
      options: ['Ctrl+N', 'Ctrl+F', 'Ctrl+G', 'Ctrl+H'],
      correct: 1,
      explanation: 'Ctrl+F opens the Navigation Pane with search functionality in modern versions of Word.',
      hint: 'This shortcut is commonly associated with the "Find" function.'
    },
    {
      id: 'dm4', type: 'mc',
      scenario: 'Before sharing a document externally, you need to remove all personal information and hidden data.',
      question: 'Which feature should you use?',
      options: ['File → Info → Protect Document', 'File → Info → Inspect Document', 'Review → Track Changes', 'File → Options → Trust Center'],
      correct: 1,
      explanation: 'Document Inspector (File → Info → Check for Issues → Inspect Document) finds and removes hidden properties, personal information, and other metadata.',
      hint: 'You need to inspect what\'s hidden before you can remove it.'
    },
    {
      id: 'dm5', type: 'mc',
      question: 'Which shortcut jumps to a specific page, section, or bookmark?',
      options: ['Ctrl+F', 'Ctrl+G', 'Ctrl+H', 'Ctrl+J'],
      correct: 1,
      explanation: 'Ctrl+G opens the Go To dialog, allowing navigation to specific pages, sections, lines, bookmarks, comments, and more.',
      hint: 'G stands for "Go To" — it takes you somewhere specific.'
    },
    {
      id: 'dm6', type: 'mc',
      scenario: 'You accidentally closed a document without saving. You need to recover it.',
      question: 'Where can you find auto-recovered files?',
      options: ['File → Recent → Recover Recent Documents', 'File → Info → Manage Document → Recover Unsaved Documents', 'Home → Recovery', 'Edit → Undo Close'],
      correct: 1,
      explanation: 'File → Info → Manage Document → Recover Unsaved Documents shows auto-saved drafts of documents that weren\'t saved.',
      hint: 'Document management and recovery options are found in the Info backstage area.'
    },
    {
      id: 'dm7', type: 'mc',
      question: 'What does Ctrl+End do in Word?',
      options: ['Closes the document', 'Goes to the end of the current line', 'Goes to the end of the document', 'Selects to the end of the page'],
      correct: 2,
      explanation: 'Ctrl+End moves the cursor to the very end of the document.',
      hint: 'End = end. Ctrl makes navigation shortcuts move to extremes.'
    },
    {
      id: 'dm8', type: 'mc',
      scenario: 'You need to create a PDF of a report but only include pages 3 through 7.',
      question: 'What should you do?',
      options: ['File → Export → select page range', 'File → Print → set page range → print to PDF', 'File → Save As → PDF → Options → page range', 'All of the above work'],
      correct: 3,
      explanation: 'You can set page ranges when exporting, printing to PDF, or using Save As → PDF → Options.',
      hint: 'Word provides multiple ways to create PDFs with page range selection.'
    }
  ],

  // --- TEXT FORMATTING ---
  'text-formatting': [
    {
      id: 'tf1', type: 'mc',
      scenario: 'You need to apply the same formatting from a heading to three other sections of text.',
      question: 'What is the most efficient way to copy formatting to multiple selections?',
      options: ['Click Format Painter once for each section', 'Double-click Format Painter, then paint each section', 'Use Ctrl+C and Ctrl+V', 'Right-click → Copy Formatting'],
      correct: 1,
      explanation: 'Double-clicking Format Painter locks it on, allowing you to paint formatting on multiple selections. Press Escape or click it again to deactivate.',
      hint: 'Regular click applies once. How do you make a tool stay active?'
    },
    {
      id: 'tf2', type: 'mc',
      question: 'Which keyboard shortcut applies double line spacing to selected text?',
      options: ['Ctrl+1', 'Ctrl+2', 'Ctrl+5', 'Ctrl+D'],
      correct: 1,
      explanation: 'Ctrl+2 applies double line spacing. Ctrl+1 is single, Ctrl+5 is 1.5 spacing.',
      hint: 'The number key corresponds to the spacing multiplier.'
    },
    {
      id: 'tf3', type: 'mc',
      scenario: 'A legal document requires all body text to use a consistent style with Times New Roman, 12pt, justified alignment.',
      question: 'What is the best approach to ensure consistency?',
      options: ['Manually format each paragraph', 'Modify the Normal style to match requirements', 'Use Find & Replace for formatting', 'Create a template'],
      correct: 1,
      explanation: 'Modifying the Normal style automatically applies consistent formatting to all Normal-styled text throughout the document.',
      hint: 'Think about which approach automatically applies to ALL matching text at once.'
    },
    {
      id: 'tf4', type: 'mc',
      question: 'What does Ctrl+Shift+C do?',
      options: ['Copy text', 'Copy formatting', 'Clear formatting', 'Change case'],
      correct: 1,
      explanation: 'Ctrl+Shift+C copies formatting. Use Ctrl+Shift+V to paste the formatting elsewhere.',
      hint: 'Ctrl+C copies content. Adding Shift copies something else related to appearance.'
    },
    {
      id: 'tf5', type: 'mc',
      question: 'How do you remove all formatting from selected text?',
      options: ['Ctrl+Space', 'Ctrl+Z', 'Ctrl+Shift+N', 'Both A and C'],
      correct: 3,
      explanation: 'Ctrl+Space removes character formatting, and Ctrl+Shift+N applies Normal style (resetting paragraph formatting). Both effectively clear formatting.',
      hint: 'Formatting has two layers: character-level and paragraph-level.'
    },
    {
      id: 'tf6', type: 'mc',
      scenario: 'You want to find all text formatted as Bold and change it to Bold Italic throughout the document.',
      question: 'Which feature should you use?',
      options: ['Format Painter', 'Find & Replace with Format options', 'Styles Inspector', 'Font dialog box'],
      correct: 1,
      explanation: 'Find & Replace (Ctrl+H) with the Format button allows searching for specific formatting and replacing it with different formatting.',
      hint: 'You need to find ALL instances and replace them — think about which tool does that.'
    },
    {
      id: 'tf7', type: 'mc',
      question: 'In Find & Replace, what does the "Use wildcards" option enable?',
      options: ['Searching with * and ? as pattern characters', 'Finding hidden characters', 'Replacing styles', 'Searching in comments'],
      correct: 0,
      explanation: 'Wildcards like * (any characters) and ? (single character) allow pattern-based searching, similar to regex.',
      hint: 'Wildcards are special characters that match patterns, like * meaning "anything."'
    },
    {
      id: 'tf8', type: 'mc',
      scenario: 'You need the first line of every paragraph to be indented 0.5 inches.',
      question: 'Where is the most efficient place to set this?',
      options: ['Tab key at start of each paragraph', 'Paragraph dialog → Special → First line', 'Ruler → drag first line indent marker', 'Both B and C'],
      correct: 3,
      explanation: 'Both the Paragraph dialog and the ruler allow you to set first line indentation. The dialog is more precise, the ruler is faster for visual adjustments.',
      hint: 'There are two valid ways to set indentation precisely.'
    }
  ],

  // --- TABLES & LISTS ---
  'tables-lists': [
    {
      id: 'tl1', type: 'mc',
      scenario: 'You need to combine the contents of three cells in the top row of a table into a single header cell.',
      question: 'Which feature should you use?',
      options: ['Layout → Split Cells', 'Layout → Merge Cells', 'Table Design → Table Style', 'Layout → AutoFit'],
      correct: 1,
      explanation: 'Merge Cells combines multiple selected cells into one single cell.',
      hint: 'You want to join cells together, not separate them.'
    },
    {
      id: 'tl2', type: 'mc',
      question: 'How do you sort data in a Word table?',
      options: ['Right-click → Sort', 'Layout → Sort', 'Table Design → Sort', 'Home → Sort'],
      correct: 1,
      explanation: 'The Sort option is found on the Layout tab that appears when a table is selected.',
      hint: 'Sort is a layout/structure operation, not a design/style operation.'
    },
    {
      id: 'tl3', type: 'mc',
      scenario: 'You need to calculate the sum of values in a table column.',
      question: 'What formula do you use?',
      options: ['=SUM(ABOVE)', '=TOTAL(COLUMN)', '=ADD(A1:A5)', '=SUM(cells)'],
      correct: 0,
      explanation: 'Word uses positional references: =SUM(ABOVE), =SUM(LEFT), =SUM(BELOW), =SUM(RIGHT).',
      hint: 'Word tables don\'t use cell references like A1 — they use directional words.'
    },
    {
      id: 'tl4', type: 'mc',
      question: 'How do you convert existing text to a table?',
      options: ['Insert → Table → Convert Text to Table', 'Home → Table → From Text', 'Right-click → Convert to Table', 'Edit → Transform → Table'],
      correct: 0,
      explanation: 'Insert → Table → Convert Text to Table uses separators (commas, tabs, paragraphs) to split text into table cells.',
      hint: 'Converting text to a table is part of the Insert → Table menu.'
    },
    {
      id: 'tl5', type: 'mc',
      scenario: 'You want alternating colored rows in your table for readability.',
      question: 'Which option enables this?',
      options: ['Manually fill each row', 'Table Design → Banded Rows', 'Layout → Row Color', 'Insert → Table Style → Zebra'],
      correct: 1,
      explanation: 'Banded Rows is a checkbox on the Table Design tab that alternates row shading automatically.',
      hint: 'This is a design/style option, found on the Table Design tab.'
    },
    {
      id: 'tl6', type: 'mc',
      question: 'What keyboard shortcut indents a list item to create a sub-item?',
      options: ['Ctrl+Tab', 'Tab', 'Shift+Tab', 'Ctrl+Shift+Tab'],
      correct: 1,
      explanation: 'Pressing Tab at the beginning of a list item indents it to create a sub-item. Shift+Tab outdents.',
      hint: 'The simplest key for indentation.'
    },
    {
      id: 'tl7', type: 'mc',
      scenario: 'You need a table to repeat its header row on every printed page.',
      question: 'How do you configure this?',
      options: ['Table Design → Header Row', 'Layout → Repeat Header Rows', 'File → Page Setup → Table Headers', 'Layout → Properties → Repeat as header row'],
      correct: 1,
      explanation: 'Select the header row(s) and click Layout → Repeat Header Rows. This ensures headers appear on every page.',
      hint: 'This is a Layout tab feature — it controls the structural behavior of the table.'
    }
  ],

  // --- REFERENCES ---
  'references': [
    {
      id: 'rf1', type: 'mc',
      scenario: 'You need to create a Table of Contents that automatically updates when you add new sections.',
      question: 'What must you do FIRST before inserting a TOC?',
      options: ['Number all pages', 'Apply Heading styles to section titles', 'Create bookmarks', 'Add page breaks'],
      correct: 1,
      explanation: 'The Table of Contents is built from Heading styles (Heading 1, 2, 3). You must apply these styles first.',
      hint: 'The TOC needs to know what counts as a heading — how does it know?'
    },
    {
      id: 'rf2', type: 'mc',
      question: 'What is the keyboard shortcut to insert a footnote?',
      options: ['Ctrl+Alt+F', 'Ctrl+F', 'Alt+Shift+F', 'Ctrl+Shift+F'],
      correct: 0,
      explanation: 'Ctrl+Alt+F inserts a footnote at the cursor position and moves to the bottom of the page to type the note.',
      hint: 'It uses Ctrl+Alt + the first letter of "Footnote."'
    },
    {
      id: 'rf3', type: 'mc',
      scenario: 'Your professor requires APA-style citations in your research paper.',
      question: 'Where do you select the citation style?',
      options: ['File → Options → Citations', 'References → Style dropdown', 'Insert → Citation → Format', 'Review → Citation Style'],
      correct: 1,
      explanation: 'The References tab has a Style dropdown where you choose from APA, MLA, Chicago, Harvard, IEEE, etc.',
      hint: 'Citation management is done from the References tab.'
    },
    {
      id: 'rf4', type: 'mc',
      question: 'How do you update a Table of Contents after adding new headings?',
      options: ['Delete and re-insert it', 'Click the TOC and select "Update Table"', 'Press Ctrl+F9', 'References → Refresh'],
      correct: 1,
      explanation: 'Click the TOC, then click "Update Table" (or press F9). Choose to update page numbers only or the entire table.',
      hint: 'You don\'t need to recreate it — just refresh it.'
    },
    {
      id: 'rf5', type: 'mc',
      scenario: 'You want to refer to "Figure 3" in your text, and have it update automatically if figure numbers change.',
      question: 'Which feature should you use?',
      options: ['Manually type "Figure 3"', 'Insert → Cross-reference', 'References → Bibliography', 'Insert → Hyperlink'],
      correct: 1,
      explanation: 'Cross-references create dynamic links that update when figure numbers, heading numbers, or page numbers change.',
      hint: 'You need a reference that updates automatically — a dynamic cross-reference.'
    },
    {
      id: 'rf6', type: 'mc',
      question: 'What is the keyboard shortcut to mark an Index entry?',
      options: ['Alt+Shift+X', 'Ctrl+Alt+I', 'Alt+I', 'Ctrl+Shift+X'],
      correct: 0,
      explanation: 'Alt+Shift+X opens the Mark Index Entry dialog where you can define main entries, sub-entries, and cross-references.',
      hint: 'X marks the spot — Alt+Shift+X marks an index entry.'
    }
  ],

  // --- GRAPHICS ---
  'graphics': [
    {
      id: 'gr1', type: 'mc',
      scenario: 'You inserted an image but it\'s covering the text below it.',
      question: 'What should you change to make the text wrap around the image?',
      options: ['Image size', 'Text wrapping to "Square"', 'Image resolution', 'Paragraph spacing'],
      correct: 1,
      explanation: 'Setting text wrapping to Square (or Tight, Top and Bottom) allows text to flow around the image.',
      hint: 'Text wrapping controls the relationship between images and surrounding text.'
    },
    {
      id: 'gr2', type: 'mc',
      question: 'How do you maintain an image\'s aspect ratio when resizing?',
      options: ['Drag from center handles', 'Hold Shift while dragging a corner', 'Use Picture Format → Size → Lock Aspect Ratio', 'Both B and C'],
      correct: 3,
      explanation: 'Both holding Shift while dragging corners and checking "Lock Aspect Ratio" in size settings preserve proportions.',
      hint: 'There are two methods — one manual and one in settings.'
    },
    {
      id: 'gr3', type: 'mc',
      question: 'Which feature would you use to create an organizational chart?',
      options: ['Insert → Chart', 'Insert → SmartArt → Hierarchy', 'Insert → Shapes → Flowchart', 'Insert → Text Box'],
      correct: 1,
      explanation: 'SmartArt Hierarchy layouts are specifically designed for organizational charts with automatic formatting and layout.',
      hint: 'An org chart is a hierarchy — SmartArt has a dedicated category for this.'
    },
    {
      id: 'gr4', type: 'mc',
      scenario: 'You need to capture a portion of a webpage to include in your document.',
      question: 'Which Word feature is most appropriate?',
      options: ['Insert → Screenshot → Screen Clipping', 'Insert → Online Pictures', 'Print Screen → Paste', 'Insert → Picture from Web'],
      correct: 0,
      explanation: 'Screen Clipping (Insert → Screenshot → Screen Clipping) lets you select and capture a specific area of any open window.',
      hint: 'Word has a built-in screenshot tool that can capture parts of other windows.'
    },
    {
      id: 'gr5', type: 'mc',
      question: 'How do you add text inside a shape?',
      options: ['Insert a text box over the shape', 'Right-click shape → Add Text', 'Double-click the shape', 'Both B and C'],
      correct: 3,
      explanation: 'Both right-clicking → Add Text and double-clicking the shape allow you to type text inside it.',
      hint: 'There are two quick ways to start typing in a shape.'
    },
    {
      id: 'gr6', type: 'mc',
      scenario: 'You have 5 separate shapes that should move and resize together.',
      question: 'What should you do?',
      options: ['Select all and group them', 'Convert to SmartArt', 'Lock each shape\'s position', 'Save as a template'],
      correct: 0,
      explanation: 'Grouping shapes (Select all → right-click → Group) makes them behave as a single object for moving, resizing, and formatting.',
      hint: 'You want multiple objects to act as one — what operation does that?'
    }
  ],

  // --- COLLABORATION ---
  'collaboration': [
    {
      id: 'co1', type: 'mc',
      scenario: 'Your team needs to review a document. You want to see who made which changes.',
      question: 'Which feature should you enable?',
      options: ['Comments', 'Track Changes', 'Document Inspector', 'Version History'],
      correct: 1,
      explanation: 'Track Changes records every edit with the author\'s name, making it easy to see who changed what.',
      hint: 'You want to track the changes themselves, not just add notes.'
    },
    {
      id: 'co2', type: 'mc',
      question: 'What is the keyboard shortcut to toggle Track Changes on/off?',
      options: ['Ctrl+Shift+T', 'Ctrl+Shift+E', 'Alt+Shift+T', 'Ctrl+T'],
      correct: 1,
      explanation: 'Ctrl+Shift+E toggles Track Changes. E stands for "Editing" tracking.',
      hint: 'The shortcut uses Ctrl+Shift and a letter that might stand for "Editing."'
    },
    {
      id: 'co3', type: 'mc',
      scenario: 'You received two edited copies of the same document from different reviewers.',
      question: 'How do you merge both sets of changes into one document?',
      options: ['Copy and paste manually', 'Review → Combine', 'File → Merge', 'Review → Compare'],
      correct: 1,
      explanation: 'Review → Combine merges changes from multiple reviewers into a single document.',
      hint: 'Combine brings multiple sets of changes together, while Compare shows differences between two versions.'
    },
    {
      id: 'co4', type: 'mc',
      question: 'What is the keyboard shortcut to insert a comment?',
      options: ['Ctrl+Alt+C', 'Ctrl+Alt+M', 'Ctrl+Shift+C', 'Alt+C'],
      correct: 1,
      explanation: 'Ctrl+Alt+M inserts a new comment at the current selection.',
      hint: 'M could stand for "Markup" or "Margin note."'
    },
    {
      id: 'co5', type: 'mc',
      scenario: 'You want to prevent anyone from editing the document except for filling in form fields.',
      question: 'Which option should you use?',
      options: ['Review → Restrict Editing → Filling in forms', 'File → Protect → Read-only', 'Review → Protect → Password', 'File → Info → Permissions'],
      correct: 0,
      explanation: 'Restrict Editing with "Filling in forms" allows users only to fill in form fields while the rest of the document remains locked.',
      hint: 'Restrict Editing gives you fine-grained control over what users can do.'
    },
    {
      id: 'co6', type: 'mc',
      question: 'In Mail Merge, what is the data source?',
      options: ['The main document template', 'The list of recipients/records (e.g., Excel file)', 'The finished merged document', 'The merge fields in the document'],
      correct: 1,
      explanation: 'The data source contains the variable data (names, addresses, etc.) that gets inserted into the main document template.',
      hint: 'The data source provides the data — it\'s where information comes from.'
    }
  ],

  // --- PAGE LAYOUT ---
  'page-layout': [
    {
      id: 'pl1', type: 'mc',
      scenario: 'You need page 1 in portrait mode and pages 2-3 in landscape mode.',
      question: 'What do you need to insert between page 1 and 2?',
      options: ['Page break', 'Section break (Next Page)', 'Manual page break', 'Column break'],
      correct: 1,
      explanation: 'Section breaks allow different formatting (like page orientation) in different parts of the document.',
      hint: 'Different page orientations require different sections — not just page breaks.'
    },
    {
      id: 'pl2', type: 'mc',
      question: 'What is the keyboard shortcut to insert a page break?',
      options: ['Ctrl+Enter', 'Ctrl+Break', 'Alt+Enter', 'Shift+Enter'],
      correct: 0,
      explanation: 'Ctrl+Enter inserts a manual page break at the cursor position.',
      hint: 'It\'s Enter (new page) with the Ctrl modifier.'
    },
    {
      id: 'pl3', type: 'mc',
      scenario: 'You want different headers on odd and even pages for a book-style document.',
      question: 'Which option enables this?',
      options: ['Different First Page', 'Different Odd & Even Pages', 'Link to Previous', 'Section Break'],
      correct: 1,
      explanation: 'Checking "Different Odd & Even Pages" in the Header/Footer options allows unique headers on alternating pages.',
      hint: 'The option name directly describes what it does — different headers on odd vs even pages.'
    },
    {
      id: 'pl4', type: 'mc',
      question: 'How do you access Header/Footer editing mode quickly?',
      options: ['Insert → Header', 'Double-click the header/footer area', 'View → Header and Footer', 'Both A and B'],
      correct: 3,
      explanation: 'Both Insert → Header (or Footer) and double-clicking the margin area open header/footer editing mode.',
      hint: 'There\'s a menu method and a quick-click method.'
    },
    {
      id: 'pl5', type: 'mc',
      scenario: 'You need to create a document with a 2-column layout for the middle section, with single columns at top and bottom.',
      question: 'How do you achieve this?',
      options: ['Use section breaks before and after the 2-column area', 'Apply columns to the entire document', 'Use a table with 2 columns', 'Create text boxes side by side'],
      correct: 0,
      explanation: 'Insert section breaks before and after the area you want as 2 columns, then apply Columns → Two to just that section.',
      hint: 'Different column layouts in the same document require different sections.'
    },
    {
      id: 'pl6', type: 'mc',
      question: 'Which of these is NOT a type of section break?',
      options: ['Next Page', 'Continuous', 'Even Page', 'Paragraph Break'],
      correct: 3,
      explanation: 'Paragraph Break is not a section break type. Section breaks include: Next Page, Continuous, Even Page, and Odd Page.',
      hint: 'Section breaks control page/section structure. One of these options is a text formatting concept instead.'
    }
  ]
};

/**
 * Additional questions specifically for Mock Exams (scenario-heavy)
 * These are mixed across all topics for realistic exam simulation
 */
const MOCK_EXAM_QUESTIONS = [
  {
    id: 'mock1', type: 'mc',
    scenario: 'A project manager asks you to create a professional memo. The memo header must include the company name in a decorative format.',
    question: 'Which feature would you use for the decorative company name?',
    options: ['Insert → WordArt', 'Home → Font Size increase', 'Insert → Header', 'Design → Themes'],
    correct: 0,
    explanation: 'WordArt provides decorative text effects perfect for logos and headings that need visual impact.',
    hint: 'You need decorative/stylized text — think artistic.'
  },
  {
    id: 'mock2', type: 'mc',
    scenario: 'You\'re creating a newsletter with text that should flow from one text box to another when the first is full.',
    question: 'What should you do?',
    options: ['Link the text boxes', 'Use columns instead', 'Copy-paste manually', 'Use section breaks'],
    correct: 0,
    explanation: 'Linked text boxes allow text to flow automatically from one box to the next. Select the first text box, then use Create Link on the Format tab.',
    hint: 'Text boxes can be connected so content flows between them.'
  },
  {
    id: 'mock3', type: 'mc',
    scenario: 'An employee handbook needs a cover page, table of contents, and the first content page starting on page 1.',
    question: 'How do you restart page numbering at the first content page?',
    options: ['Delete page numbers from the cover page', 'Insert section break, then set page number to start at 1', 'Use Different First Page option', 'Format Page Numbers → Start at 0'],
    correct: 1,
    explanation: 'Insert a section break after the TOC, then in the new section\'s footer, deselect "Link to Previous" and set page number format to start at 1.',
    hint: 'You need a section break to create an independent numbering zone.'
  },
  {
    id: 'mock4', type: 'mc',
    scenario: 'Your report has 50 figures and you need to add "Figure X" labels below each one.',
    question: 'What is the most efficient method?',
    options: ['Type "Figure 1", "Figure 2", etc. manually', 'Use References → Insert Caption', 'Use Headers and Footers', 'Insert → Quick Parts → Field'],
    correct: 1,
    explanation: 'Insert Caption automatically numbers figures sequentially and updates when you add or remove figures.',
    hint: 'Captions auto-number and auto-update — much better than manual typing.'
  },
  {
    id: 'mock5', type: 'mc',
    scenario: 'You need to create form letters for 500 customers using data from an Excel spreadsheet.',
    question: 'Which feature should you use?',
    options: ['Copy and paste for each customer', 'Mailings → Start Mail Merge → Letters', 'File → New → Template', 'References → Bibliography'],
    correct: 1,
    explanation: 'Mail Merge connects your letter template to the Excel data source and automatically generates personalized letters for each record.',
    hint: 'Merging a letter template with data for mass personalization — that\'s Mail Merge.'
  },
  {
    id: 'mock6', type: 'mc',
    scenario: 'A colleague sent you a document. You want to see what they changed compared to the original.',
    question: 'What should you use?',
    options: ['Review → Compare', 'Review → Track Changes', 'File → Version History', 'Review → Check Accessibility'],
    correct: 0,
    explanation: 'Review → Compare shows all differences between an original and a revised document, even if Track Changes wasn\'t used.',
    hint: 'You\'re comparing two documents after-the-fact to see differences.'
  },
  {
    id: 'mock7', type: 'mc',
    scenario: 'Your document has multiple images. You need all images to be exactly 3 inches wide while keeping proportions.',
    question: 'What is the best approach?',
    options: ['Drag each image to look roughly the same size', 'Select each image → Picture Format → Size → Lock Aspect Ratio → set width to 3"', 'Use a macro', 'Insert a table and put images in cells'],
    correct: 1,
    explanation: 'Using Picture Format → Size with Lock Aspect Ratio ensures exact dimensions while maintaining proportions.',
    hint: 'Precise sizing requires the Size dialog, not dragging.'
  },
  {
    id: 'mock8', type: 'mc',
    scenario: 'Your document needs to display the file name in the footer automatically.',
    question: 'Which approach auto-updates if the file name changes?',
    options: ['Type the file name manually', 'Insert → Header & Footer → Document Info → File Name', 'Insert → Quick Parts → Field → FileName', 'Both B and C'],
    correct: 3,
    explanation: 'Both Document Info and Field → FileName insert dynamic field codes that update automatically when the file is renamed.',
    hint: 'Dynamic fields automatically update — you need the file name to be a field, not typed text.'
  },
  {
    id: 'mock9', type: 'mc',
    scenario: 'You\'re drafting a contract and want to prevent accidental edits to standard clauses while allowing editing only in fill-in areas.',
    question: 'What should you configure?',
    options: ['Review → Restrict Editing with editable regions', 'File → Info → Protect → Read Only', 'Mark all clauses as Final', 'Review → Lock Document'],
    correct: 0,
    explanation: 'Restrict Editing lets you protect the whole document but define specific "editable regions" (exceptions) where users can type.',
    hint: 'You want partial protection — some areas locked, some areas open.'
  },
  {
    id: 'mock10', type: 'mc',
    scenario: 'A research paper needs footnotes with Roman numeral numbering (i, ii, iii) instead of standard numbers.',
    question: 'Where do you change the footnote number format?',
    options: ['References → Insert Footnote → dropdown', 'References → Footnote dialog launcher → Number format', 'Right-click footnote → Format', 'File → Options → Footnotes'],
    correct: 1,
    explanation: 'Click the dialog launcher (small arrow) in the Footnotes group on the References tab to access formatting options including number format.',
    hint: 'Detailed formatting options are accessed via the dialog launcher (small corner arrow).'
  },
  {
    id: 'mock11', type: 'mc',
    scenario: 'You need to ensure your document is accessible to people with disabilities.',
    question: 'Which tool identifies accessibility issues?',
    options: ['Review → Spelling & Grammar', 'File → Info → Check Accessibility', 'Review → Check Document', 'File → Options → Accessibility'],
    correct: 1,
    explanation: 'The Accessibility Checker (File → Info → Check for Issues → Check Accessibility) identifies issues like missing alt text, low contrast, and reading order problems.',
    hint: 'It\'s in the Info backstage area under "Check for Issues."'
  },
  {
    id: 'mock12', type: 'mc',
    scenario: 'Your brochure has a "DRAFT" stamp visible behind all the text.',
    question: 'What feature was used to create this?',
    options: ['Text box', 'Watermark', 'Header', 'Shape with text'],
    correct: 1,
    explanation: 'Watermarks are semi-transparent text or images that appear behind document content, commonly used for "DRAFT," "CONFIDENTIAL," etc.',
    hint: 'It\'s visible behind text on every page — like a stamp on paper.'
  },
  {
    id: 'mock13', type: 'mc',
    scenario: 'You need to insert the current date that updates automatically every time the document is opened.',
    question: 'How should you insert the date?',
    options: ['Type today\'s date manually', 'Insert → Date & Time with "Update automatically" checked', 'Insert → Quick Parts → Date', 'Home → Date format'],
    correct: 1,
    explanation: 'Insert → Date & Time with the "Update automatically" checkbox creates a dynamic field that shows the current date each time the document opens.',
    hint: 'The key is the "Update automatically" option — it makes the date dynamic.'
  },
  {
    id: 'mock14', type: 'mc',
    scenario: 'A legal document requires line numbers in the margin for easy reference during review.',
    question: 'How do you add line numbers?',
    options: ['Layout → Line Numbers', 'Insert → Page Numbers → Line', 'View → Line Numbers', 'Home → Paragraph → Numbers'],
    correct: 0,
    explanation: 'Layout → Line Numbers adds sequential line numbering in the margin. You can set continuous, restart each page, or restart each section.',
    hint: 'Line numbers are a page layout feature — they affect how the page is structured.'
  },
  {
    id: 'mock15', type: 'mc',
    scenario: 'You need to create labels for a mass mailing.',
    question: 'Which Mail Merge type should you select?',
    options: ['Letters', 'Labels', 'Envelopes', 'Directory'],
    correct: 1,
    explanation: 'Mailings → Start Mail Merge → Labels lets you select label dimensions and connect to a data source for mass label printing.',
    hint: 'The merge type matches exactly what you\'re trying to create.'
  },
  {
    id: 'mock16', type: 'mc',
    scenario: 'You want text to wrap only above and below an image, not along the sides.',
    question: 'Which text wrapping option should you choose?',
    options: ['Square', 'Tight', 'Top and Bottom', 'Through'],
    correct: 2,
    explanation: 'Top and Bottom wrapping places text only above and below the image, leaving the sides of the image clear.',
    hint: 'The option name describes exactly where text should appear relative to the image.'
  },
  {
    id: 'mock17', type: 'mc',
    question: 'What does pressing Shift+Enter create?',
    options: ['A new paragraph', 'A line break (within same paragraph)', 'A page break', 'A section break'],
    correct: 1,
    explanation: 'Shift+Enter creates a manual line break (soft return) that starts a new line without creating a new paragraph.',
    hint: 'Enter = new paragraph. Shift modifies it to something smaller.'
  },
  {
    id: 'mock18', type: 'mc',
    scenario: 'You need to create a process diagram showing sequential steps in a project.',
    question: 'Which SmartArt category is most appropriate?',
    options: ['List', 'Process', 'Cycle', 'Hierarchy'],
    correct: 1,
    explanation: 'Process SmartArt layouts are designed for showing sequential steps or stages in a process workflow.',
    hint: 'Sequential steps in a project = a process flow.'
  },
  {
    id: 'mock19', type: 'mc',
    scenario: 'Your document has custom styles but they don\'t appear when you create a new document.',
    question: 'How do you make custom styles available in all new documents?',
    options: ['Copy styles manually each time', 'Modify the style and select "New documents based on this template"', 'Export styles to a .dotx file', 'Both B and C'],
    correct: 3,
    explanation: 'You can either save the style to the Normal template (option when modifying) or create a custom .dotx template file.',
    hint: 'Styles stick around through templates — either the default one or a custom one.'
  },
  {
    id: 'mock20', type: 'mc',
    scenario: 'A document contains tracked changes. You need to produce a clean final version.',
    question: 'What should you do?',
    options: ['Review → Accept All Changes', 'Delete the markup manually', 'Save As a new file', 'Print without markup'],
    correct: 0,
    explanation: 'Accept All Changes accepts every tracked change, removing the markup and producing a clean document.',
    hint: 'You want to finalize all the proposed changes — accept them all.'
  },
  {
    id: 'mock21', type: 'mc',
    scenario: 'You need to set different margins for the first page compared to the rest.',
    question: 'How would you accomplish this?',
    options: ['Layout → Margins → Different First Page', 'Insert a Section Break after page 1 and set different margins', 'It\'s not possible in Word', 'Use indentation instead of margins'],
    correct: 1,
    explanation: 'Section breaks allow each section to have independent page layout settings, including margins.',
    hint: 'Different formatting for different pages requires different sections.'
  },
  {
    id: 'mock22', type: 'mc',
    question: 'What keyboard shortcut selects the entire document?',
    options: ['Ctrl+A', 'Ctrl+Shift+End', 'Ctrl+Home, then Ctrl+Shift+End', 'Both A and C'],
    correct: 0,
    explanation: 'Ctrl+A is the standard shortcut to select all content in a document.',
    hint: 'A = All. This is a universal shortcut across many applications.'
  },
  {
    id: 'mock23', type: 'mc',
    scenario: 'Your document uses Heading 1 for chapters. You want chapter numbers to appear automatically.',
    question: 'Which feature should you configure?',
    options: ['Insert → Page Numbers with chapter numbering', 'Home → Multilevel List (linked to Heading styles)', 'References → Table of Contents', 'Layout → Line Numbers'],
    correct: 1,
    explanation: 'A Multilevel List linked to Heading styles automatically numbers your headings as Chapter 1, 1.1, 1.1.1, etc.',
    hint: 'Multilevel lists connected to heading styles create automatic chapter numbering.'
  },
  {
    id: 'mock24', type: 'mc',
    scenario: 'You\'re working on a bilingual document. You need to check spelling in both English and French.',
    question: 'How do you set the proofing language for a French section?',
    options: ['Review → Language → Set Proofing Language', 'File → Options → Language', 'Right-click → Language', 'Both A and C'],
    correct: 3,
    explanation: 'You can set the proofing language by selecting text and using Review → Language → Set Proofing Language, or by right-clicking and accessing Language options.',
    hint: 'You can set language at the text-selection level, not just document-wide.'
  },
  {
    id: 'mock25', type: 'mc',
    scenario: 'Your team uses a SharePoint document library. You want the document to save automatically as you work.',
    question: 'Which feature enables this?',
    options: ['AutoSave toggle (title bar)', 'File → Options → Save → AutoSave', 'AutoRecover', 'Ctrl+S at intervals'],
    correct: 0,
    explanation: 'The AutoSave toggle in the title bar automatically saves documents stored in OneDrive or SharePoint in real-time.',
    hint: 'It\'s a simple toggle right in the title bar — visible at the top of the window.'
  },
  {
    id: 'mock26', type: 'mc',
    scenario: 'You want a decorative page border around every page of your invitation.',
    question: 'Where do you find this feature?',
    options: ['Design → Page Borders', 'Layout → Margins → Border', 'Insert → Shapes → Rectangle', 'Home → Borders → Page Border'],
    correct: 0,
    explanation: 'Design → Page Borders opens the Borders and Shading dialog where you can set border style, color, width, and even art borders.',
    hint: 'Page-level design elements are on the Design tab.'
  },
  {
    id: 'mock27', type: 'mc',
    question: 'What is the purpose of a Building Block in Word?',
    options: ['A paragraph formatting tool', 'Reusable pre-formatted content (like headers, cover pages, text boxes)', 'A macro type', 'A style category'],
    correct: 1,
    explanation: 'Building Blocks are reusable content pieces stored in galleries. They include AutoText, Quick Parts, headers, footers, cover pages, and more.',
    hint: 'Building Blocks are pre-built content you can insert repeatedly.'
  },
  {
    id: 'mock28', type: 'mc',
    scenario: 'You need to show paragraph marks, spaces, and tab characters in your document.',
    question: 'How do you display formatting marks?',
    options: ['Home → ¶ (Show/Hide) button', 'View → Formatting Marks', 'Ctrl+Shift+8', 'Both A and C'],
    correct: 3,
    explanation: 'Both the ¶ button on the Home tab and Ctrl+Shift+8 (or Ctrl+*) toggle the display of formatting marks.',
    hint: 'The paragraph symbol ¶ button and its keyboard shortcut both work.'
  },
  {
    id: 'mock29', type: 'mc',
    scenario: 'You need a table of figures separate from the table of contents.',
    question: 'What must you do FIRST?',
    options: ['Insert captions on all figures', 'Create bookmarks for each figure', 'Apply Heading styles to figure titles', 'Number figures manually'],
    correct: 0,
    explanation: 'The Table of Figures is built from caption fields. You must first add captions to your figures using References → Insert Caption.',
    hint: 'Table of Figures reads from captions — just like TOC reads from heading styles.'
  },
  {
    id: 'mock30', type: 'mc',
    question: 'What is the difference between "Save" and "Save As"?',
    options: ['Save creates a copy; Save As overwrites', 'Save overwrites current file; Save As lets you choose a new name/location/format', 'They do the same thing', 'Save is for local; Save As for cloud'],
    correct: 1,
    explanation: 'Save updates the current file in place. Save As lets you specify a new file name, location, or format — creating a new copy if changed.',
    hint: 'Save = overwrite current. Save As = save somewhere else or as something else.'
  }
];

/**
 * Practice Exam questions (40 per exam)
 * Additional harder/longer scenario questions for paid practice exams
 */
const PRACTICE_EXAM_QUESTIONS = [
  ...MOCK_EXAM_QUESTIONS,
  {
    id: 'pe1', type: 'mc',
    scenario: 'You are formatting a report with a complex header: Chapter title on odd pages, document title on even pages, and no header on the first page.',
    question: 'Which combination of settings achieves this?',
    options: [
      'Different First Page + Different Odd & Even Pages',
      'Three section breaks with different headers',
      'Different First Page only',
      'Different Odd & Even Pages only'
    ],
    correct: 0,
    explanation: 'You need both "Different First Page" (to hide header on page 1) and "Different Odd & Even Pages" (for alternating chapter/document titles).',
    hint: 'Two separate requirements = two separate options that can both be enabled.'
  },
  {
    id: 'pe2', type: 'mc',
    scenario: 'A user reports that Track Changes is enabled but changes appear accepted immediately without markup.',
    question: 'What is the most likely cause?',
    options: [
      'Track Changes is set to "No Markup" display',
      'The document is in Protected View',
      'AutoSave is conflicting',
      'The document is in Read Mode'
    ],
    correct: 0,
    explanation: 'When the display mode is set to "No Markup," changes are tracked but not visually shown. Switch to "All Markup" or "Simple Markup" to see them.',
    hint: 'Changes ARE being tracked but the display is set to hide them.'
  },
  {
    id: 'pe3', type: 'mc',
    scenario: 'Your 100-page document has inconsistent spacing throughout. Some paragraphs use 6pt After, others use 12pt.',
    question: 'What is the fastest way to standardize all paragraph spacing?',
    options: [
      'Select all, then adjust in Paragraph dialog',
      'Modify the Normal style to include correct spacing',
      'Find & Replace with paragraph formatting',
      'Any of these would work, but B is most maintainable'
    ],
    correct: 3,
    explanation: 'While all three methods work, modifying the Normal style is the best practice because it ensures consistency for future edits too.',
    hint: 'Think about which approach is most sustainable and self-maintaining.'
  },
  {
    id: 'pe4', type: 'mc',
    scenario: 'You\'re creating a form in Word with dropdown lists, date pickers, and text fields.',
    question: 'Which tab contains the form field controls?',
    options: [
      'Developer tab',
      'Insert tab',
      'Design tab',
      'Review tab'
    ],
    correct: 0,
    explanation: 'The Developer tab contains Content Controls (Rich Text, Plain Text, Picture, Date Picker, Combo Box, Drop-Down List, Check Box) for creating forms.',
    hint: 'Form controls are an advanced feature found on a tab that may need to be enabled first.'
  },
  {
    id: 'pe5', type: 'mc',
    scenario: 'You need to apply a style to text, but the style doesn\'t exist yet. You want to create it based on the formatting of currently selected text.',
    question: 'How do you create a new style from existing formatting?',
    options: [
      'Right-click in Styles gallery → Create a Style',
      'Home → Styles → dialog launcher → New Style',
      'Select text, then click "Create a Style" in the Styles pane',
      'All of the above'
    ],
    correct: 3,
    explanation: 'Word offers multiple paths to create new styles from existing formatting.',
    hint: 'Word typically offers multiple ways to accomplish the same task.'
  },
  {
    id: 'pe6', type: 'mc',
    scenario: 'A table spans multiple pages but loses its header row on subsequent pages.',
    question: 'How do you repeat the header row on every page?',
    options: [
      'Copy the header to each page manually',
      'Select header row → Layout → Repeat Header Rows',
      'Table Properties → Row → Repeat as header row at top of each page',
      'Both B and C'
    ],
    correct: 3,
    explanation: 'You can either use the Repeat Header Rows button on the Layout tab or check the option in Table Properties → Row tab.',
    hint: 'There are two paths to this setting — one quick, one through properties.'
  },
  {
    id: 'pe7', type: 'mc',
    scenario: 'Your document has a blank page at the end that you cannot delete by pressing Delete or Backspace.',
    question: 'What is the most common cause and fix?',
    options: [
      'Hidden paragraph mark — show formatting marks and delete it',
      'A section break — delete the section break',
      'A page break — delete the page break',
      'Any of these could cause a blank page at the end'
    ],
    correct: 3,
    explanation: 'Unwanted blank pages can be caused by extra paragraph marks, page breaks, section breaks, or table formatting. Show formatting marks (Ctrl+Shift+8) to find and delete the cause.',
    hint: 'Blank pages can have multiple causes — you need to investigate the formatting marks.'
  },
  {
    id: 'pe8', type: 'mc',
    scenario: 'You inserted a table of contents, but it doesn\'t show all headings — only Heading 1 levels appear.',
    question: 'How do you include Heading 2 and Heading 3 levels?',
    options: [
      'Click the TOC → Update Table → Entire Table',
      'References → Table of Contents → Custom TOC → set Show levels to 3',
      'Re-apply heading styles',
      'Insert a new TOC below the existing one'
    ],
    correct: 1,
    explanation: 'Custom Table of Contents lets you set the number of heading levels to include (Show levels: 1, 2, 3, etc.).',
    hint: 'The "Show levels" setting controls how many heading levels appear in the TOC.'
  },
  {
    id: 'pe9', type: 'mc',
    scenario: 'You want to insert a symbol (©) that isn\'t on your keyboard.',
    question: 'Which method inserts special symbols?',
    options: [
      'Insert → Symbol',
      'Type the character code and press Alt+X',
      'Use an AutoCorrect shortcut like (c)',
      'All of the above'
    ],
    correct: 3,
    explanation: 'Word supports multiple methods for inserting symbols: the Symbol dialog, Unicode character codes with Alt+X, and AutoCorrect entries.',
    hint: 'Word provides many ways to insert symbols — from menus to keyboard tricks.'
  },
  {
    id: 'pe10', type: 'mc',
    scenario: 'Your document must meet specific industry compliance standards. You need to verify the reading level.',
    question: 'Which built-in feature shows readability statistics?',
    options: [
      'File → Options → Proofing → Show readability statistics',
      'Review → Check Readability',
      'View → Readability Mode',
      'Review → Word Count → Readability'
    ],
    correct: 0,
    explanation: 'Enabling "Show readability statistics" in File → Options → Proofing displays Flesch Reading Ease and Flesch-Kincaid Grade Level after running the spelling checker.',
    hint: 'Readability stats are a proofing option that shows after spell check completes.'
  }
];

// Make available globally
if (typeof window !== 'undefined') {
  window.QUESTION_BANK = QUESTION_BANK;
  window.MOCK_EXAM_QUESTIONS = MOCK_EXAM_QUESTIONS;
  window.PRACTICE_EXAM_QUESTIONS = PRACTICE_EXAM_QUESTIONS;
}
if (typeof module !== 'undefined') {
  module.exports = { QUESTION_BANK, MOCK_EXAM_QUESTIONS, PRACTICE_EXAM_QUESTIONS };
}
