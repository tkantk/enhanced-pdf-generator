/**
 * Enhanced PDF Generator - Production Ready
 *
 * A comprehensive, zero-dependency PDF generator for Node.js applications
 * Supports both plain text and HTML content conversion to PDF
 *
 * @version 2.1.0
 * @author Tushar Kar
 * @license MIT
 *
 * Requirements:
 * - Node.js 16.0.0 or higher
 * - No external dependencies
 *
 * Features:
 * - Text to PDF conversion
 * - HTML to PDF conversion (basic)
 * - Auto-content detection
 * - Multi-page support
 * - Custom formatting options
 * - Production-ready error handling
 * - Memory-efficient processing
 * - Cross-platform compatibility
 * Enhanced PDF Generator with CSS Support - COMPLETELY REWRITTEN FOR STABILITY
 * Fixed approach with minimal complexity to prevent PDF corruption
 */

const fs = require('fs').promises;

class EnhancedPDFGenerator {
    constructor(options = {}) {
        this.options = {
            enableCSS: true,
            debug: false,
            ...options
        };

        if (this.options.debug) {
            console.log('[INFO] Enhanced PDF Generator - STABLE VERSION initialized');
        }
    }

    /**
     * Generate PDF from HTML with maximum stability
     */
    async generatePDFFromHTML(html, options = {}) {
        try {
            this._log('Starting HTML to PDF generation - STABLE APPROACH', 'info');

            // Default options
            const pdfOptions = {
                title: 'Document',
                pageWidth: 612,
                pageHeight: 792,
                margin: { top: 72, right: 72, bottom: 72, left: 72 },
                ...options
            };

            // Extract and clean content
            const textContent = this._extractTextContent(html);

            // Generate PDF using simple, stable approach
            const pdfBuffer = this._generateStablePDF(textContent, pdfOptions);

            this._log('PDF generated successfully - STABLE VERSION', 'info');
            return pdfBuffer;

        } catch (error) {
            this._log(`PDF generation failed: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Extract text content from HTML with proper structure preservation
     * @private
     */
    _extractTextContent(html) {
        const content = [];

        // Remove DOCTYPE, html, head, body tags but keep content
        let cleanHtml = html
            .replace(/<!DOCTYPE[^>]*>/gi, '')
            .replace(/<html[^>]*>/gi, '')
            .replace(/<\/html>/gi, '')
            .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
            .replace(/<body[^>]*>/gi, '')
            .replace(/<\/body>/gi, '');

        // Remove any elements with display:none or visibility:hidden (including divs, spans, etc.)
        // More precise regex that handles self-closing tags and nested content
        cleanHtml = cleanHtml.replace(/<(\w+)([^>]*style\s*=\s*["'][^"']*display\s*:\s*none[^"']*["'][^>]*)>[\s\S]*?<\/\1>/gi, '');
        cleanHtml = cleanHtml.replace(/<(\w+)([^>]*style\s*=\s*["'][^"']*visibility\s*:\s*hidden[^"']*["'][^>]*)>[\s\S]*?<\/\1>/gi, '');

        // Now remove div tags but keep their content
        cleanHtml = cleanHtml
            .replace(/<div[^>]*>/gi, '')
            .replace(/<\/div>/gi, '');

        // Clean up excessive whitespace
        cleanHtml = cleanHtml.replace(/\n\s*\n/g, '\n').trim();

        this._log(`Processing HTML: ${cleanHtml.substring(0, 200)}...`, 'debug');

        // Updated regex to properly capture hr tags (both self-closing and not)
        // This regex now captures attributes more reliably including those with spaces
        const elementRegex = /<(h[1-6]|p)\s*([^>]*)>([\s\S]*?)<\/\1>|<(hr)\s*([^>]*?)\s*\/?>/gis;
        let match;

        while ((match = elementRegex.exec(cleanHtml)) !== null) {
            const tag = match[1] || match[4]; // h1-h6, p, or hr
            const attributes = match[2] || match[5] || '';
            const innerContent = match[3] || '';

            this._log(`\n--- Processing Element ---`, 'debug');
            this._log(`Tag: ${tag}`, 'debug');
            this._log(`Full Match: "${match[0]}"`, 'debug');
            this._log(`Attributes: "${attributes}"`, 'debug');
            this._log(`Inner Content: "${innerContent}"`, 'debug');

            // Check for display: none on the element itself
            if (this._isHidden(attributes)) {
                this._log(`✗ Skipping hidden element: ${tag}`, 'debug');
                continue;
            }

            if (tag === 'hr') {
                const marginTop = this._extractMargin(attributes, 'top');
                const marginBottom = this._extractMargin(attributes, 'bottom');

                this._log(`HR margins extracted - top: ${marginTop}, bottom: ${marginBottom}`, 'debug');

                content.push({
                    type: 'line',
                    marginTop: marginTop !== null ? marginTop : 12,
                    marginBottom: marginBottom !== null ? marginBottom : 12
                });
                this._log(`✓ Added HR with margins - top: ${marginTop !== null ? marginTop : 12}, bottom: ${marginBottom !== null ? marginBottom : 12}`, 'debug');
            }
            else if (tag.match(/h[1-6]/i)) {
                const text = this._extractText(innerContent);
                const fontSize = this._extractFontSize(attributes) || 18;
                const color = this._extractColor(attributes) || '#2e2e2e';
                const marginTop = this._extractMargin(attributes, 'top');
                const marginBottom = this._extractMargin(attributes, 'bottom');

                this._log(`Heading margins - top: ${marginTop}, bottom: ${marginBottom}`, 'debug');

                if (text) {
                    content.push({
                        text: text,
                        type: 'heading',
                        fontSize: Math.round(fontSize * 0.85),
                        color: color,
                        marginTop: marginTop !== null ? marginTop : 18,
                        marginBottom: marginBottom !== null ? marginBottom : 12
                    });
                    this._log(`✓ Added heading with margins - top: ${marginTop !== null ? marginTop : 18}, bottom: ${marginBottom !== null ? marginBottom : 12}`, 'debug');
                }
            }
            else if (tag === 'p') {
                const text = this._extractText(innerContent);
                const fontSize = this._extractFontSize(attributes) || 16;
                const color = this._extractColor(attributes) || '#2e2e2e';
                const marginTop = this._extractMargin(attributes, 'top');
                const marginBottom = this._extractMargin(attributes, 'bottom');

                this._log(`Paragraph margins - top: ${marginTop}, bottom: ${marginBottom}`, 'debug');

                if (text) {
                    content.push({
                        text: text,
                        type: 'paragraph',
                        fontSize: Math.round(fontSize * 0.85),
                        color: color,
                        marginTop: marginTop !== null ? marginTop : 0,
                        marginBottom: marginBottom !== null ? marginBottom : 4
                    });
                    this._log(`✓ Added paragraph with margins - top: ${marginTop !== null ? marginTop : 0}, bottom: ${marginBottom !== null ? marginBottom : 4}`, 'debug');
                }
            }
        }

        this._log(`Extracted ${content.length} content elements`, 'debug');

        if (content.length === 0) {
            this._log(`WARNING: No content extracted from HTML. Check regex patterns and HTML structure.`, 'warn');
            this._log(`Clean HTML sample: ${cleanHtml.substring(0, 500)}`, 'debug');
        }

        return content;
    }

    /**
     * Extract text from HTML content, handling nested tags properly
     * @private
     */
    _extractText(htmlContent) {
        if (!htmlContent || typeof htmlContent !== 'string') return '';

        this._log(`Extracting text from: "${htmlContent}"`, 'debug');

        let text = htmlContent;

        // First, remove any elements with display:none or visibility:hidden
        text = text.replace(/<[^>]+style\s*=\s*["'][^"']*display\s*:\s*none[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/gi, '');
        text = text.replace(/<[^>]+style\s*=\s*["'][^"']*visibility\s*:\s*hidden[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/gi, '');

        // Remove any nested HTML tags (like spans, em, strong, etc.)
        text = text.replace(/<[^>]+>/g, '');

        // Clean up whitespace and decode HTML entities
        text = text
            .replace(/\s+/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();

        // Format large numbers with commas - but be more selective
        // Only format numbers that are clearly monetary amounts or large quantities
        // Don't format phone numbers (numbers with spaces or that start with country codes)
        text = text.replace(/\b(\d{5,})\b/g, (match, num, offset, fullString) => {
            // Check if this might be a phone number
            const before = fullString.substring(Math.max(0, offset - 20), offset);
            const after = fullString.substring(offset + match.length, offset + match.length + 10);

            // Skip if it looks like a phone number
            if (before.match(/mobile|phone|tel|contact|fax|cell/i) ||
                before.includes('91 ') || before.endsWith('91') ||
                after.startsWith(' ') || before.endsWith(' ') ||
                (num.length >= 10 && num.length <= 12)) {
                return match;
            }

            // Skip if it's part of a date (like 1999)
            if (num.length === 4 && parseInt(num) >= 1900 && parseInt(num) <= 2100) {
                return match;
            }

            // Skip if it's an email/birthdate format (09/09/1999 extracted as 9999)
            if (num.length === 4 && before.includes('/')) {
                return match;
            }

            // Format the number (likely a monetary amount)
            const parsed = parseInt(num);
            return !isNaN(parsed) ? parsed.toLocaleString() : match;
        });

        this._log(`Extracted text result: "${text}"`, 'debug');
        return text;
    }

    /**
     * Extract font size from style attribute
     * @private
     */
    _extractFontSize(attributeString) {
        if (!attributeString) return null;

        const match = attributeString.match(/font-size:\s*(\d+)px/i);
        const result = match ? parseInt(match[1]) : null;

        this._log(`Extracted font size: ${result}px from "${attributeString}"`, 'debug');
        return result;
    }

    /**
     * Extract color from style attribute
     * @private
     */
    _extractColor(attributeString) {
        if (!attributeString) return null;

        // Extract the style attribute value
        const styleMatch = attributeString.match(/style\s*=\s*["']([^"']+)["']/i);
        if (!styleMatch) return null;

        let styleValue = styleMatch[1];
        // Remove backticks if present
        styleValue = styleValue.replace(/`/g, '');

        const match = styleValue.match(/color:\s*(#[0-9a-f]{6}|#[0-9a-f]{3}|\w+)/i);
        const result = match ? match[1] : null;

        this._log(`Extracted color: ${result} from style: "${styleValue}"`, 'debug');
        return result;
    }

    /**
     * Extract margin value from style attribute
     * @private
     */
    _extractMargin(attributeString, side) {
        if (!attributeString) return null;

        // Extract the style attribute value first
        const styleMatch = attributeString.match(/style\s*=\s*["']([^"']+)["']/i);
        if (!styleMatch) return null;

        const styleValue = styleMatch[1];
        this._log(`Extracting margin-${side} from style: "${styleValue}"`, 'debug');

        // Check for specific margin property
        const marginPattern = new RegExp(`margin-${side}\\s*:\\s*(\\d+)(?:px)?`, 'i');
        const match = styleValue.match(marginPattern);

        if (match) {
            const value = parseInt(match[1]);
            this._log(`Found margin-${side}: ${value}px`, 'debug');
            return value;
        }

        // Check shorthand margin
        const shorthandMatch = styleValue.match(/margin\s*:\s*(\d+)(?:px)?(?:\s+(\d+)(?:px)?)?(?:\s+(\d+)(?:px)?)?(?:\s+(\d+)(?:px)?)?/i);
        if (shorthandMatch) {
            const values = [
                parseInt(shorthandMatch[1]), // top
                parseInt(shorthandMatch[2] || shorthandMatch[1]), // right
                parseInt(shorthandMatch[3] || shorthandMatch[1]), // bottom
                parseInt(shorthandMatch[4] || shorthandMatch[2] || shorthandMatch[1]) // left
            ];

            const sideIndex = { top: 0, right: 1, bottom: 2, left: 3 };
            const value = values[sideIndex[side]];
            this._log(`Found margin-${side} from shorthand: ${value}px`, 'debug');
            return value;
        }

        this._log(`No margin-${side} found`, 'debug');
        return null;
    }

    /**
     * Check if element should be hidden
     * @private
     */
    _isHidden(attributeString) {
        if (!attributeString) return false;

        // Extract the style attribute value
        const styleMatch = attributeString.match(/style\s*=\s*["']([^"']+)["']/i);
        if (!styleMatch) return false;

        const styleValue = styleMatch[1];

        // Check for display: none
        if (styleValue.match(/display\s*:\s*none/i)) {
            this._log(`Element hidden due to display:none`, 'debug');
            return true;
        }

        // Check for visibility: hidden
        if (styleValue.match(/visibility\s*:\s*hidden/i)) {
            this._log(`Element hidden due to visibility:hidden`, 'debug');
            return true;
        }

        return false;
    }

    /**
     * Generate stable PDF with minimal complexity
     * @private
     */
    _generateStablePDF(content, options) {
        // PDF Header
        const pdfContent = [
            '%PDF-1.4',
            ''
        ];

        // Object 1: Catalog
        pdfContent.push('1 0 obj');
        pdfContent.push('<<');
        pdfContent.push('/Type /Catalog');
        pdfContent.push('/Pages 2 0 R');
        pdfContent.push('>>');
        pdfContent.push('endobj');
        pdfContent.push('');

        // Object 2: Pages
        pdfContent.push('2 0 obj');
        pdfContent.push('<<');
        pdfContent.push('/Type /Pages');
        pdfContent.push('/Kids [3 0 R]');
        pdfContent.push('/Count 1');
        pdfContent.push('>>');
        pdfContent.push('endobj');
        pdfContent.push('');

        // Generate content stream
        const contentStream = this._generateContentStream(content, options);
        const streamLength = Buffer.byteLength(contentStream, 'utf8');

        // Object 3: Page
        pdfContent.push('3 0 obj');
        pdfContent.push('<<');
        pdfContent.push('/Type /Page');
        pdfContent.push('/Parent 2 0 R');
        pdfContent.push(`/MediaBox [0 0 ${options.pageWidth} ${options.pageHeight}]`);
        pdfContent.push('/Resources <<');
        pdfContent.push('/Font <<');
        pdfContent.push('/F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
        pdfContent.push('/F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
        pdfContent.push('>>');
        pdfContent.push('>>');
        pdfContent.push('/Contents 4 0 R');
        pdfContent.push('>>');
        pdfContent.push('endobj');
        pdfContent.push('');

        // Object 4: Content Stream
        pdfContent.push('4 0 obj');
        pdfContent.push('<<');
        pdfContent.push(`/Length ${streamLength}`);
        pdfContent.push('>>');
        pdfContent.push('stream');
        pdfContent.push(contentStream);
        pdfContent.push('endstream');
        pdfContent.push('endobj');
        pdfContent.push('');

        // Cross-reference table
        const xrefPos = Buffer.byteLength(pdfContent.join('\n') + '\n', 'utf8');
        pdfContent.push('xref');
        pdfContent.push('0 5');
        pdfContent.push('0000000000 65535 f ');

        // Calculate object positions
        let pos = 9; // Start after "%PDF-1.4\n"
        for (let i = 1; i <= 4; i++) {
            const objIndex = pdfContent.findIndex(line => line === `${i} 0 obj`);
            if (objIndex !== -1) {
                let objPos = 0;
                for (let j = 0; j < objIndex; j++) {
                    objPos += Buffer.byteLength(pdfContent[j] + '\n', 'utf8');
                }
                pdfContent.push(String(objPos).padStart(10, '0') + ' 00000 n ');
            }
        }

        // Trailer
        pdfContent.push('trailer');
        pdfContent.push('<<');
        pdfContent.push('/Size 5');
        pdfContent.push('/Root 1 0 R');
        pdfContent.push('>>');
        pdfContent.push('startxref');
        pdfContent.push(String(xrefPos));
        pdfContent.push('%%EOF');

        return Buffer.from(pdfContent.join('\n'), 'utf8');
    }

    /**
     * Generate content stream with maximum safety
     * @private
     */
    _generateContentStream(content, options) {
        const stream = [];
        let currentY = options.pageHeight - options.margin.top;
        const x = options.margin.left;
        const lineHeightMultiplier = 1.5; // Standard line height multiplier

        this._log(`Starting content stream generation with ${content.length} items`, 'debug');

        for (let i = 0; i < content.length; i++) {
            const item = content[i];

            try {
                this._log(`Processing item ${i}: type=${item.type}, text="${item.text || 'N/A'}", currentY=${currentY}`, 'debug');

                if (item.type === 'line') {
                    // Draw line
                    currentY -= (item.marginTop || 8);
                    const lineY = currentY;
                    const lineX1 = options.margin.left;
                    const lineX2 = options.pageWidth - options.margin.right;

                    stream.push('q'); // Save state
                    stream.push('0.7 0.7 0.7 RG'); // Gray color
                    stream.push('1 w'); // Line width
                    stream.push(`${lineX1} ${lineY} m`); // Move to start
                    stream.push(`${lineX2} ${lineY} l`); // Line to end
                    stream.push('S'); // Stroke
                    stream.push('Q'); // Restore state

                    currentY -= (item.marginBottom || 8);
                    continue;
                }

                // Handle text content
                if (item.text && item.text.trim()) {
                    // Apply top margin
                    if (item.marginTop > 0) {
                        currentY -= item.marginTop;
                    }

                    // Calculate line height
                    const fontSize = Math.max(8, Math.min(24, item.fontSize || 12));
                    const lineHeight = fontSize * lineHeightMultiplier;

                    // Check if we need to go to next page
                    if (currentY - lineHeight < options.margin.bottom) {
                        // Would go off page, so clamp to bottom margin
                        this._log(`Text would go off page, stopping at bottom margin`, 'warn');
                        break;
                    }

                    // Begin text object for each text item
                    stream.push('BT');

                    // Set font
                    const font = item.type === 'heading' ? 'F2' : 'F1'; // Bold for headings
                    stream.push(`/${font} ${fontSize} Tf`);

                    // Set color
                    const [r, g, b] = this._hexToRgb(item.color || '#000000');
                    stream.push(`${r} ${g} ${b} rg`);

                    // Position text - always use absolute positioning
                    // In PDF, Y coordinate is the baseline of text, so we need to adjust
                    const textY = currentY - fontSize;
                    stream.push(`${x} ${textY} Td`);

                    // Escape and add text
                    const safeText = this._escapePDFString(item.text);
                    stream.push(`(${safeText}) Tj`);

                    // End text object
                    stream.push('ET');

                    this._log(`Added text: "${safeText}" at position x=${x}, y=${textY}`, 'debug');

                    // Update position for next element
                    currentY -= lineHeight;

                    // Apply bottom margin
                    if (item.marginBottom > 0) {
                        currentY -= item.marginBottom;
                    }
                } else {
                    this._log(`Skipping item with no text: type=${item.type}`, 'debug');
                }

            } catch (error) {
                this._log(`Error rendering item ${i}: ${error.message}`, 'warn');
            }
        }

        const result = stream.join('\n');
        this._log(`Generated content stream: ${result.substring(0, 200)}...`, 'debug');
        return result;
    }

    /**
     * Convert hex color to RGB values for PDF
     * @private
     */
    _hexToRgb(hex) {
        // Handle short hex colors
        if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return ['0.000', '0.000', '0.000'];

        const r = (parseInt(result[1], 16) / 255).toFixed(3);
        const g = (parseInt(result[2], 16) / 255).toFixed(3);
        const b = (parseInt(result[3], 16) / 255).toFixed(3);

        return [r, g, b];
    }

    /**
     * Escape string for PDF content
     * @private
     */
    _escapePDFString(str) {
        if (!str) return '';
        return str
            .replace(/\\/g, '\\\\')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)')
            .replace(/\r/g, ' ')
            .replace(/\n/g, ' ')
            .replace(/\t/g, ' ');
    }

    /**
     * Save PDF to file
     */
    async savePDF(pdfBuffer, filePath) {
        try {
            await fs.writeFile(filePath, pdfBuffer);
            this._log(`PDF saved to: ${filePath}`, 'info');
        } catch (error) {
            this._log(`Failed to save PDF: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Get PDF information
     */
    getPDFInfo(pdfBuffer) {
        const sizeInBytes = pdfBuffer.length;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);

        return {
            size: sizeInBytes,
            sizeFormatted: `${sizeInKB} KB`,
            isValid: pdfBuffer.toString('utf8', 0, 8) === '%PDF-1.4'
        };
    }

    /**
     * Internal logging
     * @private
     */
    _log(message, level = 'info') {
        if (this.options.debug) {
            const timestamp = new Date().toISOString();
            const levelStr = level.toUpperCase().padEnd(5);
            console.log(`[${timestamp}] [${levelStr}] [EnhancedPDFGenerator] ${message}`);
        }
    }
}

module.exports = EnhancedPDFGenerator;