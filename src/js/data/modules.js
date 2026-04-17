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
