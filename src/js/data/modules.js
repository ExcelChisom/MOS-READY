/**
 * MOS-READY Learning Modules Data
 * Covers all MOS Word Exam Objectives (MO-100)
 */
const LEARNING_MODULES = [
  {
    id: 'doc-management',
    title: 'Document Management',
    emoji: '📂',
    description: 'Navigate, create, save, and manage Word documents like a pro.',
    gradient: 'linear-gradient(135deg, #7c5cfc 0%, #3a86ff 100%)',
    xpReward: 50,
    steps: [
      {
        title: 'Creating & Opening Documents',
        content: 'To create a new document, go to <code>File → New</code>. Choose from Blank Document or templates. To open an existing file, use <code>File → Open</code> or <code>Ctrl+O</code>.',
        tip: 'Use Ctrl+N for a quick blank document. Templates save time for common formats!'
      },
      {
        title: 'Saving Documents',
        content: 'Save with <code>Ctrl+S</code> or <code>File → Save As</code> to choose format and location. Word supports .docx, .doc, .pdf, .rtf, and more. Enable AutoSave for OneDrive/SharePoint files.',
        tip: 'Always save in .docx for full formatting support. Use Save As PDF for sharing.'
      },
      {
        title: 'Navigating Documents',
        content: 'Use <code>Ctrl+Home</code> to go to the start, <code>Ctrl+End</code> to the end. The Navigation Pane (<code>View → Navigation Pane</code>) lets you browse headings, pages, and search results.',
        tip: 'Ctrl+G opens the Go To dialog for jumping to specific pages, sections, or bookmarks.'
      },
      {
        title: 'Document Properties & Metadata',
        content: 'Access document properties via <code>File → Info</code>. Here you can set Title, Author, Tags, Comments, and Categories. Use "Inspect Document" to remove personal info before sharing.',
        tip: 'Document Inspector can remove hidden data, comments, and revision marks.'
      },
      {
        title: 'Printing & Exporting',
        content: 'Print via <code>File → Print</code> or <code>Ctrl+P</code>. Adjust settings like page range, copies, and print layout. Export to PDF/XPS via <code>File → Export</code>.',
        tip: 'Use Print Preview to check layout before wasting paper!'
      }
    ]
  },
  {
    id: 'text-formatting',
    title: 'Text & Paragraph Formatting',
    emoji: '✏️',
    description: 'Master fonts, styles, alignment, spacing, and advanced text effects.',
    gradient: 'linear-gradient(135deg, #f72585 0%, #ff6b35 100%)',
    xpReward: 60,
    steps: [
      {
        title: 'Font Formatting Basics',
        content: 'Select text and use the Home tab to change Font, Size, Bold (<code>Ctrl+B</code>), Italic (<code>Ctrl+I</code>), Underline (<code>Ctrl+U</code>), Color, and Highlight. The Font dialog (<code>Ctrl+D</code>) offers advanced options.',
        tip: 'Use the Mini Toolbar that appears when you select text for quick formatting!'
      },
      {
        title: 'Paragraph Formatting',
        content: 'Control alignment (Left, Center, Right, Justify), line spacing, and paragraph spacing from the Home tab or Paragraph dialog. Indents can be set via ruler or <code>Paragraph → Indentation</code>.',
        tip: 'Ctrl+1 = Single spacing, Ctrl+2 = Double spacing, Ctrl+5 = 1.5 spacing.'
      },
      {
        title: 'Using Styles',
        content: 'Styles apply consistent formatting across your document. Use built-in styles (Heading 1, Title, Normal) from the Styles gallery on the Home tab. Modify styles by right-clicking them.',
        tip: 'Always use Heading styles for document structure — they power the Navigation Pane and Table of Contents!'
      },
      {
        title: 'Format Painter & Clear Formatting',
        content: 'Format Painter (<code>Home → Format Painter</code> or <code>Ctrl+Shift+C</code> / <code>Ctrl+Shift+V</code>) copies formatting from one place to another. Double-click it to paint multiple selections. Clear all formatting with <code>Ctrl+Space</code>.',
        tip: 'Double-click the Format Painter button to apply the same format to multiple areas.'
      },
      {
        title: 'Find & Replace',
        content: 'Use <code>Ctrl+H</code> for Find & Replace. You can search for specific text, formatting, or special characters. Advanced options include Match Case, Whole Words, and Wildcards.',
        tip: 'Use Find & Replace with formatting options to change all instances of a specific font or style at once!'
      },
      {
        title: 'Text Effects & WordArt',
        content: 'Apply text effects like Shadow, Reflection, Glow, and 3D via <code>Home → Text Effects</code>. Insert WordArt via <code>Insert → WordArt</code> for decorative text.',
        tip: 'Text Effects work on regular text. WordArt is for standalone decorative text objects.'
      }
    ]
  },
  {
    id: 'tables-lists',
    title: 'Tables & Lists',
    emoji: '📊',
    description: 'Create, format, and manage tables and various list types.',
    gradient: 'linear-gradient(135deg, #00f5d4 0%, #3a86ff 100%)',
    xpReward: 55,
    steps: [
      {
        title: 'Creating Tables',
        content: 'Insert a table via <code>Insert → Table</code>. Choose grid size, use "Insert Table" dialog for specific dimensions, or "Draw Table" for custom layouts. You can also convert text to table.',
        tip: 'Quick Tables in the Insert Table menu provide pre-formatted table templates!'
      },
      {
        title: 'Modifying Table Structure',
        content: 'Use the Table Design and Layout tabs (appear when table is selected). Add/remove rows and columns, merge and split cells, adjust row height and column width.',
        tip: 'Right-click a table for quick access to Insert, Delete, Merge, and Split options.'
      },
      {
        title: 'Formatting Tables',
        content: 'Apply Table Styles from the Design tab for instant formatting. Customize borders, shading, and effects. Use Banded Rows/Columns for readability.',
        tip: 'The "No Border" style is useful for creating invisible tables used for layout alignment.'
      },
      {
        title: 'Table Data & Sorting',
        content: 'Sort table data via <code>Layout → Sort</code>. Perform basic calculations with <code>Layout → Formula</code> (e.g., =SUM(ABOVE)). Convert tables back to text if needed.',
        tip: 'Table formulas update when you right-click and select "Update Field" or press F9.'
      },
      {
        title: 'Bulleted & Numbered Lists',
        content: 'Create lists from the Home tab: Bullets, Numbering, or Multilevel List. Customize bullet characters and number formats. Increase/decrease indent to create sub-lists.',
        tip: 'Press Tab to indent a list item (create sub-list), Shift+Tab to outdent.'
      }
    ]
  },
  {
    id: 'references',
    title: 'References & Citations',
    emoji: '📖',
    description: 'Build table of contents, footnotes, citations, and cross-references.',
    gradient: 'linear-gradient(135deg, #fee440 0%, #ff6b35 100%)',
    xpReward: 65,
    steps: [
      {
        title: 'Table of Contents',
        content: 'Insert a TOC via <code>References → Table of Contents</code>. It automatically builds from Heading styles. Update it by clicking "Update Table" or pressing F9.',
        tip: 'Always apply proper Heading styles to your text first — the TOC pulls from these automatically!'
      },
      {
        title: 'Footnotes & Endnotes',
        content: 'Insert footnotes (<code>References → Insert Footnote</code> or <code>Alt+Ctrl+F</code>) and endnotes (<code>Alt+Ctrl+D</code>). Customize number format and placement via the Footnotes dialog.',
        tip: 'Footnotes appear at the bottom of the page; endnotes appear at the end of the document or section.'
      },
      {
        title: 'Citations & Bibliography',
        content: 'Manage sources via <code>References → Manage Sources</code>. Insert citations with <code>Insert Citation</code>. Generate a bibliography or works cited list automatically.',
        tip: 'Choose your citation style (APA, MLA, Chicago) from the References tab before inserting citations.'
      },
      {
        title: 'Captions & Cross-References',
        content: 'Add captions to figures, tables, and equations via <code>References → Insert Caption</code>. Create cross-references to bookmarks, headings, figures, or equations.',
        tip: 'Cross-references update automatically — use them instead of typing "see page X" manually!'
      },
      {
        title: 'Index & Bookmarks',
        content: 'Mark index entries with <code>Alt+Shift+X</code> and insert the index via <code>References → Insert Index</code>. Add bookmarks (<code>Insert → Bookmark</code>) to mark important locations.',
        tip: 'Index entries can have sub-entries for more organized indexing.'
      }
    ]
  },
  {
    id: 'graphics',
    title: 'Graphics & Media',
    emoji: '🖼️',
    description: 'Insert and format images, shapes, SmartArt, charts, and text boxes.',
    gradient: 'linear-gradient(135deg, #a8e10c 0%, #00f5d4 100%)',
    xpReward: 55,
    steps: [
      {
        title: 'Inserting Images',
        content: 'Insert images via <code>Insert → Pictures</code> (from file) or <code>Online Pictures</code> (from web). Resize by dragging handles. Use <code>Picture Format</code> tab for effects, borders, and cropping.',
        tip: 'Hold Shift while dragging corner handles to maintain aspect ratio!'
      },
      {
        title: 'Text Wrapping & Positioning',
        content: 'Control how text flows around images with <code>Picture Format → Wrap Text</code>: In Line, Square, Tight, Behind Text, In Front of Text. Use Position for preset placements.',
        tip: 'In Line with Text keeps the image anchored to text. Other options allow free positioning.'
      },
      {
        title: 'Shapes & Drawing Tools',
        content: 'Insert shapes from <code>Insert → Shapes</code>. Customize fill, outline, and effects. Add text inside shapes. Group multiple shapes together for easier management.',
        tip: 'Hold Shift while drawing to create perfect squares and circles!'
      },
      {
        title: 'SmartArt Graphics',
        content: 'Create visual diagrams with <code>Insert → SmartArt</code>. Choose from List, Process, Cycle, Hierarchy, and more. Add/remove shapes and edit text directly.',
        tip: 'The Text Pane (click arrow on left of SmartArt) makes editing text much easier than clicking each shape.'
      },
      {
        title: 'Charts',
        content: 'Insert charts via <code>Insert → Chart</code>. Choose type (Column, Pie, Line, Bar, etc.). Edit data in the embedded spreadsheet. Format via Chart Design and Format tabs.',
        tip: 'Right-click chart elements to format specific parts like data labels, axes, or gridlines.'
      },
      {
        title: 'Screenshots & Screen Clippings',
        content: 'Capture screenshots of open windows via <code>Insert → Screenshot</code>. Use "Screen Clipping" to select a specific area of your screen to insert.',
        tip: 'Screen Clipping is perfect for capturing just the relevant part of a reference document!'
      }
    ]
  },
  {
    id: 'collaboration',
    title: 'Collaboration & Review',
    emoji: '👥',
    description: 'Track changes, add comments, compare documents, and use mail merge.',
    gradient: 'linear-gradient(135deg, #3a86ff 0%, #7c5cfc 100%)',
    xpReward: 60,
    steps: [
      {
        title: 'Track Changes',
        content: 'Enable Track Changes via <code>Review → Track Changes</code> or <code>Ctrl+Shift+E</code>. All edits will be marked. Accept or reject changes individually or all at once.',
        tip: 'Use "Simple Markup" view for a clean look that shows changes with red lines in the margin.'
      },
      {
        title: 'Comments',
        content: 'Add comments via <code>Review → New Comment</code> or <code>Ctrl+Alt+M</code>. Reply to comments for threaded discussions. Resolve or delete comments when done.',
        tip: 'Comments are essential for feedback — they don\'t modify the document text itself.'
      },
      {
        title: 'Comparing & Combining Documents',
        content: 'Compare two versions via <code>Review → Compare</code>. Word highlights all differences. Use Combine to merge changes from multiple reviewers into one document.',
        tip: 'Compare is perfect for finding what changed between an original and edited version.'
      },
      {
        title: 'Document Protection',
        content: 'Protect your document via <code>Review → Restrict Editing</code>. Set formatting restrictions, editing restrictions, or require a password to modify.',
        tip: 'Use "Mark as Final" to discourage editing while still allowing it if needed.'
      },
      {
        title: 'Mail Merge',
        content: 'Create personalized letters, labels, or emails via <code>Mailings → Start Mail Merge</code>. Connect to a data source (Excel, contacts), insert merge fields, and preview results.',
        tip: 'Use Rules in Mail Merge for conditional content (If...Then...Else fields).'
      }
    ]
  },
  {
    id: 'page-layout',
    title: 'Page Layout & Design',
    emoji: '📐',
    description: 'Control margins, orientation, columns, headers, footers, and page breaks.',
    gradient: 'linear-gradient(135deg, #ff6b35 0%, #fee440 100%)',
    xpReward: 50,
    steps: [
      {
        title: 'Page Setup',
        content: 'Set margins via <code>Layout → Margins</code>. Change orientation (Portrait/Landscape), paper size, and apply settings to whole document or specific sections.',
        tip: 'Custom Margins let you set exact values. Mirror Margins are for double-sided printing.'
      },
      {
        title: 'Page Breaks & Section Breaks',
        content: 'Insert page breaks with <code>Ctrl+Enter</code> or <code>Insert → Page Break</code>. Section breaks (<code>Layout → Breaks</code>) let you apply different formatting to different parts.',
        tip: 'Section breaks are key for different headers/footers, margins, or orientation within one document.'
      },
      {
        title: 'Headers & Footers',
        content: 'Edit headers/footers via <code>Insert → Header/Footer</code>. Add page numbers, date, file name, or custom text. Use "Different First Page" and "Different Odd & Even Pages" options.',
        tip: 'Double-click the top or bottom margin area to quickly enter Header/Footer editing mode.'
      },
      {
        title: 'Columns',
        content: 'Create multi-column layouts via <code>Layout → Columns</code>. Choose preset layouts or custom widths. Use column breaks to control where text splits.',
        tip: 'For a newsletter layout, use section breaks to switch between 1-column and 2-column areas.'
      },
      {
        title: 'Watermarks & Page Colors',
        content: 'Add watermarks via <code>Design → Watermark</code> (text or image). Set page color with <code>Design → Page Color</code>. Add page borders via <code>Design → Page Borders</code>.',
        tip: 'Custom watermarks let you use your own text or image with adjustable transparency.'
      },
      {
        title: 'Themes & Style Sets',
        content: 'Apply document themes via <code>Design → Themes</code> for consistent colors, fonts, and effects. Change style sets to alter the overall look. Customize theme colors and fonts.',
        tip: 'Themes affect the entire document\'s color scheme — great for professional consistency.'
      },
      {
        title: 'Line Numbers & Hyphenation',
        content: 'Add line numbers via <code>Layout → Line Numbers</code> (Continuous, Restart Each Page, or Per Section). Control hyphenation via <code>Layout → Hyphenation</code> to prevent awkward word breaks.',
        tip: 'Line numbers are required in many legal and academic documents for easy reference.'
      },
      {
        title: 'Vertical Alignment & Page Borders',
        content: 'Set vertical alignment (Top, Center, Justified, Bottom) via <code>Layout → Page Setup → Layout tab</code>. Add decorative Page Borders through <code>Design → Page Borders</code> including art borders for invitations.',
        tip: 'Center vertical alignment is perfect for title pages and cover sheets.'
      }
    ]
  },
  {
    id: 'forms-fields',
    title: 'Forms & Content Controls',
    emoji: '📝',
    description: 'Create interactive forms with text fields, dropdowns, date pickers, checkboxes, and more.',
    gradient: 'linear-gradient(135deg, #e040fb 0%, #7c5cfc 100%)',
    xpReward: 60,
    steps: [
      {
        title: 'Enabling the Developer Tab',
        content: 'The Developer tab contains all form controls. Enable it via <code>File → Options → Customize Ribbon → check Developer</code>. This tab gives you Content Controls, Legacy Tools, Macros, and more.',
        tip: 'The Developer tab is hidden by default — you must enable it once and it stays visible.'
      },
      {
        title: 'Rich Text & Plain Text Controls',
        content: 'Insert text input fields via <code>Developer → Rich Text Content Control</code> or <code>Plain Text Content Control</code>. Rich text allows formatting; plain text restricts to single-format text.',
        tip: 'Use Plain Text for fields like "Name" where formatting doesn\'t matter. Use Rich Text for free-form responses.'
      },
      {
        title: 'Drop-Down Lists & Combo Boxes',
        content: 'Insert a Drop-Down List or Combo Box from the Developer tab. Click <code>Properties</code> to add list items. Drop-down forces a selection; Combo Box also allows typed input.',
        tip: 'Drop-down lists prevent typos and ensure consistent data entry!'
      },
      {
        title: 'Date Picker & Check Boxes',
        content: 'Insert Date Picker Content Controls for date fields — users click to select a date from a calendar. Check Box controls create toggleable checkboxes for yes/no options.',
        tip: 'Set default dates and display formats via the Properties button on the Developer tab.'
      },
      {
        title: 'Picture Content Controls',
        content: 'Insert a Picture Content Control to create a placeholder where users can insert an image. Perfect for ID photos, logos, or signature areas in forms.',
        tip: 'Picture controls show a placeholder icon until the user clicks and inserts their image.'
      },
      {
        title: 'Legacy Form Fields',
        content: 'Legacy tools include <code>Text Form Field</code>, <code>Check Box Form Field</code>, and <code>Drop-Down Form Field</code>. These are older but still used for compatibility with Word 97-2003 forms.',
        tip: 'Legacy form fields require form protection (Restrict Editing) to work properly.'
      },
      {
        title: 'Protecting Forms',
        content: 'After adding controls, protect the form via <code>Developer → Restrict Editing → Filling in forms → Yes, Start Enforcing Protection</code>. Users can only fill in form fields.',
        tip: 'Set a password for protection so only you can unlock the form for editing.'
      }
    ]
  },
  {
    id: 'accessibility',
    title: 'Accessibility & Proofing',
    emoji: '♿',
    description: 'Make documents accessible, check readability, and use proofing tools effectively.',
    gradient: 'linear-gradient(135deg, #00bcd4 0%, #4caf50 100%)',
    xpReward: 50,
    steps: [
      {
        title: 'Accessibility Checker',
        content: 'Run the Accessibility Checker via <code>File → Info → Check for Issues → Check Accessibility</code> (or <code>Review → Check Accessibility</code>). It identifies issues like missing alt text, poor heading structure, and low contrast.',
        tip: 'Fix all "Errors" first — these make content impossible to access. "Warnings" and "Tips" improve the experience.'
      },
      {
        title: 'Alternative Text for Images',
        content: 'Add descriptive alt text to all images, shapes, charts, and SmartArt. Right-click the object → <code>Edit Alt Text</code> or use the Alt Text pane. Decorative images can be marked as decorative.',
        tip: 'Good alt text describes what the image shows AND why it matters in context.'
      },
      {
        title: 'Heading Structure & Reading Order',
        content: 'Use proper heading hierarchy (H1 → H2 → H3, never skip levels). This creates a logical reading order for screen readers. Use the Navigation Pane to verify heading structure.',
        tip: 'Never use bold/large text as fake headings — always use actual Heading styles!'
      },
      {
        title: 'Table Accessibility',
        content: 'For accessible tables: designate a header row (<code>Table Design → Header Row</code>), keep tables simple (avoid merged cells when possible), and add alt text to the table.',
        tip: 'Screen readers read tables left-to-right, top-to-bottom. Complex merged cells can confuse them.'
      },
      {
        title: 'Spelling & Grammar Check',
        content: 'Run spell check with <code>F7</code> or <code>Review → Spelling & Grammar</code>. Configure proofing settings in <code>File → Options → Proofing</code>. Set language per text selection.',
        tip: 'Enable "Show readability statistics" to see Flesch Reading Ease after spell check.'
      },
      {
        title: 'Language & Readability',
        content: 'Set proofing language via <code>Review → Language → Set Proofing Language</code>. Enable readability statistics in <code>File → Options → Proofing</code>. Aim for Flesch-Kincaid Grade Level appropriate to your audience.',
        tip: 'For general audiences, aim for Flesch Reading Ease above 60 and Grade Level below 8.'
      },
      {
        title: 'Document Structure with Styles',
        content: 'Use the built-in style system for ALL structural elements: Title, Subtitle, Heading 1-6, Normal, List Paragraph, Quote. This ensures screen readers and TOCs work correctly.',
        tip: 'Properly styled documents are more accessible AND easier to format with themes!'
      }
    ]
  },
  {
    id: 'advanced-features',
    title: 'Advanced Document Features',
    emoji: '⚙️',
    description: 'Master macros, Quick Parts, building blocks, fields, and advanced automation.',
    gradient: 'linear-gradient(135deg, #795548 0%, #ff6b35 100%)',
    xpReward: 70,
    steps: [
      {
        title: 'Quick Parts & AutoText',
        content: 'Save frequently used content as Quick Parts via <code>Insert → Quick Parts → Save Selection to Quick Part Gallery</code>. AutoText stores reusable text blocks. Access via <code>Insert → Quick Parts → AutoText</code>.',
        tip: 'Type the AutoText name and press F3 to quickly insert it!'
      },
      {
        title: 'Building Blocks Organizer',
        content: 'Manage all building blocks (headers, footers, cover pages, text boxes, Quick Parts) via <code>Insert → Quick Parts → Building Blocks Organizer</code>. Create, edit, and delete entries.',
        tip: 'Building blocks are stored in templates — save to Normal.dotm for availability in all documents.'
      },
      {
        title: 'Field Codes',
        content: 'Insert fields via <code>Insert → Quick Parts → Field</code>. Fields auto-update content: DATE, PAGE, NUMPAGES, FILENAME, AUTHOR, TOC, IF, etc. Toggle field code view with <code>Alt+F9</code>.',
        tip: 'Press F9 to update fields. Ctrl+A then F9 updates ALL fields in the document.'
      },
      {
        title: 'Macros Basics',
        content: 'Record macros via <code>Developer → Record Macro</code> or <code>View → Macros → Record Macro</code>. Macros automate repetitive tasks. Assign to buttons or keyboard shortcuts.',
        tip: 'Start with recording simple formatting macros — they save massive time on repetitive tasks!'
      },
      {
        title: 'Templates & .dotx Files',
        content: 'Create document templates by saving as <code>.dotx</code> (or <code>.dotm</code> with macros). Templates define default styles, content, and layout. Set custom template location in <code>File → Options → Save</code>.',
        tip: 'The Normal.dotm template controls default settings for ALL new blank documents.'
      },
      {
        title: 'Linked & Embedded Objects',
        content: 'Insert external content via <code>Insert → Object</code>. Link to keep content updated from the source file, or embed to include a copy. Works with Excel charts, PDFs, and more.',
        tip: 'Linked objects update when the source changes. Embedded objects are independent copies.'
      },
      {
        title: 'Document Versions & AutoRecover',
        content: 'Configure AutoRecover in <code>File → Options → Save</code>. Set save interval (default 10 min). Recover unsaved documents via <code>File → Info → Manage Document</code>. View version history for OneDrive files.',
        tip: 'Set AutoRecover to every 2-3 minutes for critical documents!'
      },
      {
        title: 'Digital Signatures & Encryption',
        content: 'Add digital signatures via <code>Insert → Signature Line</code> or <code>File → Info → Protect Document → Add a Digital Signature</code>. Encrypt with password via <code>File → Info → Protect → Encrypt with Password</code>.',
        tip: 'A digital signature verifies the document hasn\'t been altered after signing.'
      }
    ]
  },
  {
    id: 'keyboard-mastery',
    title: 'Keyboard Shortcuts Mastery',
    emoji: '⌨️',
    description: 'Master the essential keyboard shortcuts that will speed you through the MOS exam.',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #e040fb 100%)',
    xpReward: 45,
    steps: [
      {
        title: 'File Operations',
        content: '<code>Ctrl+N</code> New document, <code>Ctrl+O</code> Open, <code>Ctrl+S</code> Save, <code>Ctrl+P</code> Print, <code>Ctrl+W</code> Close document, <code>F12</code> Save As.',
        tip: 'F12 for Save As is faster than navigating the File menu!'
      },
      {
        title: 'Text Selection',
        content: '<code>Ctrl+A</code> Select all, <code>Shift+Arrow</code> Extend selection, <code>Ctrl+Shift+End</code> Select to end, <code>Double-click</code> Select word, <code>Triple-click</code> Select paragraph.',
        tip: 'Hold Ctrl while clicking to select non-contiguous text sections!'
      },
      {
        title: 'Formatting Shortcuts',
        content: '<code>Ctrl+B</code> Bold, <code>Ctrl+I</code> Italic, <code>Ctrl+U</code> Underline, <code>Ctrl+D</code> Font dialog, <code>Ctrl+]</code> Increase font size, <code>Ctrl+[</code> Decrease font size.',
        tip: 'Ctrl+Shift+> and Ctrl+Shift+< adjust size by the preset font size increments.'
      },
      {
        title: 'Paragraph Shortcuts',
        content: '<code>Ctrl+E</code> Center, <code>Ctrl+L</code> Left align, <code>Ctrl+R</code> Right align, <code>Ctrl+J</code> Justify, <code>Ctrl+1</code> Single space, <code>Ctrl+2</code> Double space.',
        tip: 'Remember: E=cEnter, L=Left, R=Right, J=Justify.'
      },
      {
        title: 'Navigation Shortcuts',
        content: '<code>Ctrl+Home</code> Go to start, <code>Ctrl+End</code> Go to end, <code>Ctrl+G</code> Go To dialog, <code>Ctrl+F</code> Find, <code>Ctrl+H</code> Replace.',
        tip: 'F5 also opens Go To — it\'s the same as Ctrl+G!'
      },
      {
        title: 'Advanced Shortcuts',
        content: '<code>Ctrl+Shift+E</code> Track Changes, <code>Ctrl+Alt+M</code> Insert Comment, <code>Ctrl+Alt+F</code> Insert Footnote, <code>Alt+Shift+X</code> Mark Index Entry, <code>Ctrl+Enter</code> Page Break.',
        tip: 'These advanced shortcuts save critical seconds during the timed MOS exam!'
      }
    ]
  }
];

// Make it available globally
if (typeof window !== 'undefined') {
  window.LEARNING_MODULES = LEARNING_MODULES;
}
if (typeof module !== 'undefined') {
  module.exports = { LEARNING_MODULES };
}
