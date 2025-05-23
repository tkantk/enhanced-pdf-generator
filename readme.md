# Enhanced PDF Generator

A stable, production-ready Node.js library for generating PDF documents from HTML content with CSS styling support. This generator creates clean, properly formatted PDFs while handling text positioning, line breaks, and styling with maximum stability.

## Features

- ✅ **HTML to PDF conversion** with CSS style support
- ✅ **Stable PDF generation** without corruption issues
- ✅ **Automatic number formatting** (adds commas to large numbers)
- ✅ **Support for headings, paragraphs, and horizontal rules**
- ✅ **Color and font size customization**
- ✅ **Debug mode** for troubleshooting
- ✅ **Proper text spacing** and line height management
- ✅ **Special character handling**

## Installation

```bash
# Clone or copy the enhanced-pdf-generator.js file to your project
# No external dependencies required - uses only Node.js built-in modules
```

## Quick Start

```javascript
const EnhancedPDFGenerator = require('./enhanced-pdf-generator');

// Create generator instance
const generator = new EnhancedPDFGenerator({
    debug: false,      // Enable debug logging
    enableCSS: true    // Enable CSS style processing
});

// Generate PDF from HTML
const html = `
<!DOCTYPE html>
<html>
<head><title>My Document</title></head>
<body>
    <h1 style="font-size: 24px; color: #333;">Hello World</h1>
    <p style="font-size: 16px; color: #666;">This is a PDF generated from HTML.</p>
    <hr>
    <p>Generated on: ${new Date().toLocaleString()}</p>
</body>
</html>
`;

// Generate PDF
const pdfBuffer = await generator.generatePDFFromHTML(html, {
    title: 'My Document',
    pageWidth: 612,      // Letter width in points
    pageHeight: 792,     // Letter height in points
    margin: {
        top: 72,
        right: 72,
        bottom: 72,
        left: 72
    }
});

// Save to file
await generator.savePDF(pdfBuffer, './output.pdf');

// Get PDF info
const info = generator.getPDFInfo(pdfBuffer);
console.log(`PDF Size: ${info.sizeFormatted}`);
console.log(`Valid PDF: ${info.isValid}`);
```

## API Reference

### Constructor

```javascript
new EnhancedPDFGenerator(options)
```

**Options:**
- `debug` (boolean): Enable debug logging. Default: `false`
- `enableCSS` (boolean): Enable CSS style processing. Default: `true`

### Methods

#### generatePDFFromHTML(html, options)

Generates a PDF from HTML content.

**Parameters:**
- `html` (string): HTML content to convert
- `options` (object):
    - `title` (string): Document title. Default: `'Document'`
    - `pageWidth` (number): Page width in points. Default: `612` (Letter)
    - `pageHeight` (number): Page height in points. Default: `792` (Letter)
    - `margin` (object): Page margins
        - `top` (number): Top margin. Default: `72`
        - `right` (number): Right margin. Default: `72`
        - `bottom` (number): Bottom margin. Default: `72`
        - `left` (number): Left margin. Default: `72`

**Returns:** `Promise<Buffer>` - PDF file buffer

#### savePDF(pdfBuffer, filePath)

Saves a PDF buffer to file.

**Parameters:**
- `pdfBuffer` (Buffer): PDF buffer to save
- `filePath` (string): Path where to save the file

**Returns:** `Promise<void>`

#### getPDFInfo(pdfBuffer)

Gets information about a PDF buffer.

**Parameters:**
- `pdfBuffer` (Buffer): PDF buffer to analyze

**Returns:** `object`
- `size` (number): Size in bytes
- `sizeFormatted` (string): Human-readable size (e.g., "12.5 KB")
- `isValid` (boolean): Whether the buffer is a valid PDF

## Supported HTML Elements

### Headings
```html
<h1>Main Title</h1>
<h2>Subtitle</h2>
<h3>Section</h3>
<h4>Subsection</h4>
<h5>Minor Heading</h5>
<h6>Small Heading</h6>
```

### Paragraphs
```html
<p>Regular paragraph text.</p>
<p style="font-size: 18px; color: #333;">Styled paragraph.</p>
```

### Horizontal Rules
```html
<hr>
<hr style="margin-top: 20px; margin-bottom: 20px;">
```

## Supported CSS Styles

The generator supports inline CSS styles on elements:

- `font-size`: Sets text size (in pixels)
- `color`: Sets text color (hex format preferred)
- `margin-top`: Top margin for elements
- `margin-bottom`: Bottom margin for elements

Example:
```html
<h1 style="font-size: 24px; color: #2e2e2e;">Styled Heading</h1>
<p style="font-size: 16px; color: #666666;">Styled paragraph text.</p>
```

## Common Page Sizes

| Format | Width | Height |
|--------|-------|--------|
| Letter | 612   | 792    |
| Legal  | 612   | 1008   |
| A4     | 595   | 842    |
| A3     | 842   | 1191   |

## Running Tests

```bash
# Run the production test suite
node production-demo.js

# Tests will generate PDFs in the ./output directory
```

## Troubleshooting

### Text Not Appearing
- Ensure your HTML has proper structure with `<html>`, `<body>` tags
- Check that text is within supported elements (`<h1>` to `<h6>`, `<p>`)
- Enable debug mode to see extraction details

### Text Overlapping
- This has been fixed in the latest version
- Ensure you're using the latest `enhanced-pdf-generator.js`

### Special Characters
- Special characters in text are automatically escaped
- Large numbers are automatically formatted with commas

### Debug Mode
Enable debug mode to see detailed processing information:
```javascript
const generator = new EnhancedPDFGenerator({ debug: true });
```

## Examples

### Invoice/Form Generation
```javascript
const invoiceHtml = `
<!DOCTYPE html>
<html>
<body>
    <h1 style="font-size: 24px;">Invoice #12345</h1>
    <hr>
    <p style="font-size: 16px;">Date: ${new Date().toLocaleDateString()}</p>
    <p style="font-size: 16px;">Customer: John Doe</p>
    <hr>
    <h2 style="font-size: 20px;">Items</h2>
    <p>Product A - $100.00</p>
    <p>Product B - $200.00</p>
    <hr>
    <p style="font-size: 18px; color: #000;"><strong>Total: $300.00</strong></p>
</body>
</html>
`;

const pdfBuffer = await generator.generatePDFFromHTML(invoiceHtml, {
    title: 'Invoice #12345'
});
```

### Report Generation
```javascript
const reportHtml = `
<!DOCTYPE html>
<html>
<body>
    <h1 style="font-size: 28px; color: #1a1a1a;">Annual Report 2024</h1>
    <hr style="margin-bottom: 20px;">
    <h2 style="font-size: 22px; color: #333;">Executive Summary</h2>
    <p style="font-size: 16px; color: #555;">
        This report provides a comprehensive overview of our operations...
    </p>
    <hr>
    <h2 style="font-size: 22px; color: #333;">Financial Highlights</h2>
    <p>Revenue: 10000000</p>
    <p>Profit: 2500000</p>
    <p>Growth: 25%</p>
</body>
</html>
`;

const pdfBuffer = await generator.generatePDFFromHTML(reportHtml, {
    title: 'Annual Report 2024',
    margin: { top: 100, right: 80, bottom: 100, left: 80 }
});
```

## Limitations

- Currently supports single-page PDFs (content that exceeds page height will be cut off)
- Limited to Helvetica font family
- No support for images, tables, or lists
- CSS must be inline (no external stylesheets)
- No JavaScript execution in HTML

## Version History

- **v2.0.0** - Fixed text positioning, improved spacing, removed text truncation
- **v1.2.0** - Added styled HTML support, improved debugging
- **v1.0.0** - Initial stable release

## License

This code is provided as-is for use in your projects.

## Contributing

Feel free to submit issues or pull requests for improvements.

## Support

For issues or questions:
1. Enable debug mode to see detailed logs
2. Check the troubleshooting section
3. Review the test suite for working examples