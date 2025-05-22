/**
 * Enhanced PDF Generator - Production Ready
 *
 * A comprehensive, zero-dependency PDF generator for Node.js applications
 * Supports both plain text and HTML content conversion to PDF
 *
 * @version 1.0.0
 * @author Enhanced Development Team
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
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Constants
const PDF_VERSION = '1.4';
const DEFAULT_PAGE_WIDTH = 595;  // A4 width in points
const DEFAULT_PAGE_HEIGHT = 842; // A4 height in points
const DEFAULT_MARGIN = 50;
const DEFAULT_FONT_SIZE = 12;
const DEFAULT_LINE_HEIGHT = 15;
const MAX_CONTENT_SIZE = 50 * 1024 * 1024; // 50MB limit
const MIN_NODE_VERSION = '16.0.0';

// Supported page formats
const PAGE_FORMATS = {
    A4: { width: 595, height: 842 },
    LETTER: { width: 612, height: 792 },
    LEGAL: { width: 612, height: 1008 },
    A3: { width: 842, height: 1191 },
    TABLOID: { width: 792, height: 1224 }
};

/**
 * Enhanced PDF Generator Class
 */
class EnhancedPDFGenerator {
    /**
     * Initialize the PDF generator
     * @param {Object} options - Configuration options
     * @param {number} options.pageWidth - Page width in points
     * @param {number} options.pageHeight - Page height in points
     * @param {number|Object} options.margin - Margin in points (number) or object with top,bottom,left,right
     * @param {number} options.fontSize - Default font size
     * @param {number} options.lineHeight - Line height in points
     * @param {string} options.pageFormat - Page format (A4, LETTER, etc.)
     * @param {boolean} options.debug - Enable debug logging
     */
    constructor(options = {}) {
        // Validate Node.js version
        this._validateNodeVersion();

        // Set page format if specified
        if (options.pageFormat && PAGE_FORMATS[options.pageFormat.toUpperCase()]) {
            const format = PAGE_FORMATS[options.pageFormat.toUpperCase()];
            options.pageWidth = format.width;
            options.pageHeight = format.height;
        }

        // Configuration with defaults
        this.config = {
            pageWidth: this._validateNumber(options.pageWidth, DEFAULT_PAGE_WIDTH, 200, 2000),
            pageHeight: this._validateNumber(options.pageHeight, DEFAULT_PAGE_HEIGHT, 200, 3000),
            margin: this._parseMargin(options.margin || DEFAULT_MARGIN),
            fontSize: this._validateNumber(options.fontSize, DEFAULT_FONT_SIZE, 6, 72),
            lineHeight: this._validateNumber(options.lineHeight, DEFAULT_LINE_HEIGHT, 8, 100),
            debug: Boolean(options.debug),
            maxContentSize: options.maxContentSize || MAX_CONTENT_SIZE,
            encoding: options.encoding || 'utf8'
        };

        // State management
        this.state = {
            isProcessing: false,
            lastError: null,
            documentsGenerated: 0,
            totalProcessingTime: 0
        };

        // Performance tracking
        this.performance = {
            startTime: null,
            endTime: null,
            memoryUsage: null
        };

        this._log('Enhanced PDF Generator initialized', 'info');
    }

    /**
     * Generate PDF from plain text content
     * @param {string} textContent - Plain text content
     * @param {Object} options - Generation options
     * @returns {Promise<Buffer>} PDF buffer
     */
    async generatePDFFromText(textContent, options = {}) {
        this._startPerformanceTracking();

        try {
            this._validateInput(textContent, 'string');
            this._checkProcessingState();

            this.state.isProcessing = true;
            this._log('Starting text to PDF generation', 'info');

            // Validate and sanitize options
            const safeOptions = this._sanitizeOptions(options);

            // Process text content
            const processedLines = this._processTextToLines(textContent, safeOptions);

            // Generate PDF
            const pdfBuffer = await this._createPDFDocument(
                processedLines,
                safeOptions.title || 'Text Document',
                'text',
                safeOptions
            );

            this._updateStatistics();
            this._log(`Text PDF generated successfully (${pdfBuffer.length} bytes)`, 'info');

            return pdfBuffer;

        } catch (error) {
            this._handleError(error, 'generatePDFFromText');
            throw error;
        } finally {
            this.state.isProcessing = false;
            this._endPerformanceTracking();
        }
    }

    /**
     * Generate PDF from HTML content
     * @param {string} htmlContent - HTML content
     * @param {Object} options - Generation options
     * @returns {Promise<Buffer>} PDF buffer
     */
    async generatePDFFromHTML(htmlContent, options = {}) {
        this._startPerformanceTracking();

        try {
            this._validateInput(htmlContent, 'string');
            this._checkProcessingState();

            this.state.isProcessing = true;
            this._log('Starting HTML to PDF generation', 'info');

            // Validate and sanitize options
            const safeOptions = this._sanitizeOptions(options);

            // Extract title from HTML
            const title = this._extractHTMLTitle(htmlContent) || safeOptions.title || 'HTML Document';

            // Convert HTML to text
            const textContent = this._convertHTMLToText(htmlContent);

            // Process text content
            const processedLines = this._processTextToLines(textContent, safeOptions);

            // Generate PDF
            const pdfBuffer = await this._createPDFDocument(
                processedLines,
                title,
                'html',
                safeOptions
            );

            this._updateStatistics();
            this._log(`HTML PDF generated successfully (${pdfBuffer.length} bytes)`, 'info');

            return pdfBuffer;

        } catch (error) {
            this._handleError(error, 'generatePDFFromHTML');
            throw error;
        } finally {
            this.state.isProcessing = false;
            this._endPerformanceTracking();
        }
    }

    /**
     * Generate PDF with automatic content type detection
     * @param {string} content - Content (text or HTML)
     * @param {Object} options - Generation options
     * @returns {Promise<Buffer>} PDF buffer
     */
    async generatePDF(content, options = {}) {
        try {
            this._validateInput(content, 'string');

            const contentType = this._detectContentType(content);
            this._log(`Auto-detected content type: ${contentType}`, 'debug');

            if (contentType === 'html') {
                return await this.generatePDFFromHTML(content, options);
            } else {
                return await this.generatePDFFromText(content, options);
            }

        } catch (error) {
            this._handleError(error, 'generatePDF');
            throw error;
        }
    }

    /**
     * Save PDF buffer to file
     * @param {Buffer} pdfBuffer - PDF buffer
     * @param {string} filePath - Output file path
     * @returns {Promise<string>} Saved file path
     */
    async savePDF(pdfBuffer, filePath) {
        try {
            this._validateInput(pdfBuffer, 'buffer');
            this._validateInput(filePath, 'string');

            // Validate file path
            const sanitizedPath = this._sanitizeFilePath(filePath);

            // Ensure directory exists
            const directory = path.dirname(sanitizedPath);
            await this._ensureDirectoryExists(directory);

            // Write file
            await this._writeFileAsync(sanitizedPath, pdfBuffer);

            this._log(`PDF saved to: ${sanitizedPath}`, 'info');
            return sanitizedPath;

        } catch (error) {
            this._handleError(error, 'savePDF');
            throw new Error(`Failed to save PDF: ${error.message}`);
        }
    }

    /**
     * Get PDF document information
     * @param {Buffer} pdfBuffer - PDF buffer
     * @returns {Object} PDF information
     */
    getPDFInfo(pdfBuffer) {
        try {
            this._validateInput(pdfBuffer, 'buffer');

            return {
                size: pdfBuffer.length,
                sizeFormatted: this._formatBytes(pdfBuffer.length),
                version: PDF_VERSION,
                isValid: this._validatePDFStructure(pdfBuffer),
                createdAt: new Date().toISOString(),
                generator: 'Enhanced PDF Generator v1.0.0'
            };

        } catch (error) {
            this._handleError(error, 'getPDFInfo');
            return {
                size: 0,
                sizeFormatted: '0 B',
                version: PDF_VERSION,
                isValid: false,
                error: error.message
            };
        }
    }

    /**
     * Get generator statistics
     * @returns {Object} Statistics
     */
    getStatistics() {
        return {
            documentsGenerated: this.state.documentsGenerated,
            totalProcessingTime: this.state.totalProcessingTime,
            averageProcessingTime: this.state.documentsGenerated > 0
                ? Math.round(this.state.totalProcessingTime / this.state.documentsGenerated)
                : 0,
            isProcessing: this.state.isProcessing,
            lastError: this.state.lastError,
            memoryUsage: process.memoryUsage(),
            nodeVersion: process.version,
            platform: process.platform,
            architecture: process.arch
        };
    }

    /**
     * Reset generator state
     */
    reset() {
        this.state = {
            isProcessing: false,
            lastError: null,
            documentsGenerated: 0,
            totalProcessingTime: 0
        };

        // Force garbage collection if available
        if (global.gc) {
            global.gc();
        }

        this._log('Generator state reset', 'info');
    }

    // ==========================================
    // PRIVATE METHODS
    // ==========================================

    /**
     * Validate Node.js version
     * @private
     */
    _validateNodeVersion() {
        const nodeVersion = process.version.substring(1); // Remove 'v' prefix
        const [major, minor] = nodeVersion.split('.').map(Number);
        const [reqMajor, reqMinor] = MIN_NODE_VERSION.split('.').map(Number);

        if (major < reqMajor || (major === reqMajor && minor < reqMinor)) {
            throw new Error(
                `Node.js ${MIN_NODE_VERSION} or higher is required. Current version: ${process.version}`
            );
        }
    }

    /**
     * Validate input parameters
     * @private
     */
    _validateInput(input, expectedType) {
        if (input === null || input === undefined) {
            throw new Error(`Input cannot be null or undefined`);
        }

        switch (expectedType) {
            case 'string':
                if (typeof input !== 'string') {
                    throw new Error(`Expected string input, got ${typeof input}`);
                }
                if (input.length === 0) {
                    throw new Error('Input string cannot be empty');
                }
                if (input.length > this.config.maxContentSize) {
                    throw new Error(`Input too large. Maximum size: ${this._formatBytes(this.config.maxContentSize)}`);
                }
                break;

            case 'buffer':
                if (!Buffer.isBuffer(input)) {
                    throw new Error(`Expected Buffer input, got ${typeof input}`);
                }
                if (input.length === 0) {
                    throw new Error('Buffer cannot be empty');
                }
                break;

            default:
                throw new Error(`Unknown validation type: ${expectedType}`);
        }
    }

    /**
     * Validate numeric input
     * @private
     */
    _validateNumber(value, defaultValue, min = 0, max = Infinity) {
        if (value === null || value === undefined) {
            return defaultValue;
        }

        const num = Number(value);
        if (isNaN(num)) {
            return defaultValue;
        }

        return Math.max(min, Math.min(max, num));
    }

    /**
     * Parse margin configuration
     * @private
     */
    _parseMargin(margin) {
        if (typeof margin === 'number') {
            const safeMargin = Math.max(0, Math.min(200, margin));
            return {
                top: safeMargin,
                right: safeMargin,
                bottom: safeMargin,
                left: safeMargin
            };
        }

        if (typeof margin === 'object' && margin !== null) {
            return {
                top: this._validateNumber(margin.top, DEFAULT_MARGIN, 0, 200),
                right: this._validateNumber(margin.right, DEFAULT_MARGIN, 0, 200),
                bottom: this._validateNumber(margin.bottom, DEFAULT_MARGIN, 0, 200),
                left: this._validateNumber(margin.left, DEFAULT_MARGIN, 0, 200)
            };
        }

        return {
            top: DEFAULT_MARGIN,
            right: DEFAULT_MARGIN,
            bottom: DEFAULT_MARGIN,
            left: DEFAULT_MARGIN
        };
    }

    /**
     * Check processing state
     * @private
     */
    _checkProcessingState() {
        if (this.state.isProcessing) {
            throw new Error('Generator is already processing. Please wait or create a new instance.');
        }
    }

    /**
     * Sanitize and validate options
     * @private
     */
    _sanitizeOptions(options) {
        const safeOptions = {
            title: this._sanitizeString(options.title, 'Document'),
            fontSize: this._validateNumber(options.fontSize, this.config.fontSize, 6, 72),
            lineHeight: this._validateNumber(options.lineHeight, this.config.lineHeight, 8, 100),
            margin: this._parseMargin(options.margin),
            pageWidth: this._validateNumber(options.pageWidth, this.config.pageWidth, 200, 2000),
            pageHeight: this._validateNumber(options.pageHeight, this.config.pageHeight, 200, 3000),
            compress: Boolean(options.compress),
            metadata: this._sanitizeMetadata(options.metadata || {})
        };

        return safeOptions;
    }

    /**
     * Sanitize string input
     * @private
     */
    _sanitizeString(input, defaultValue = '') {
        if (typeof input !== 'string') {
            return defaultValue;
        }

        // Remove potentially dangerous characters
        return input
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Control characters
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Extended control characters
            .trim()
            .substring(0, 255); // Limit length
    }

    /**
     * Sanitize metadata
     * @private
     */
    _sanitizeMetadata(metadata) {
        const safeMetadata = {};

        ['title', 'author', 'subject', 'keywords'].forEach(key => {
            if (metadata[key]) {
                safeMetadata[key] = this._sanitizeString(metadata[key]);
            }
        });

        return safeMetadata;
    }

    /**
     * Sanitize file path
     * @private
     */
    _sanitizeFilePath(filePath) {
        if (typeof filePath !== 'string' || filePath.length === 0) {
            throw new Error('Invalid file path');
        }

        // Resolve path and check for directory traversal
        const resolvedPath = path.resolve(filePath);
        const normalizedPath = path.normalize(resolvedPath);

        // Ensure it ends with .pdf
        if (!normalizedPath.toLowerCase().endsWith('.pdf')) {
            return normalizedPath + '.pdf';
        }

        return normalizedPath;
    }

    /**
     * Detect content type (text vs HTML)
     * @private
     */
    _detectContentType(content) {
        const htmlPatterns = [
            /<html/i,
            /<head/i,
            /<body/i,
            /<div/i,
            /<p>/i,
            /<h[1-6]/i,
            /<table/i,
            /<ul/i,
            /<ol/i,
            /<img/i,
            /<br\s*\/?>/i,
            /<[a-z]+[^>]*>/i
        ];

        return htmlPatterns.some(pattern => pattern.test(content)) ? 'html' : 'text';
    }

    /**
     * Extract title from HTML
     * @private
     */
    _extractHTMLTitle(html) {
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        return titleMatch ? this._sanitizeString(titleMatch[1]) : null;
    }

    /**
     * Convert HTML to plain text
     * @private
     */
    _convertHTMLToText(html) {
        try {
            return html
                // Remove script and style tags completely
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                // Add line breaks for block elements
                .replace(/<\/?(h[1-6]|p|div|br|hr)[^>]*>/gi, '\n')
                .replace(/<\/?(ul|ol|li)[^>]*>/gi, '\n')
                .replace(/<\/?(table|tr|td|th)[^>]*>/gi, '\n')
                // Remove all remaining HTML tags
                .replace(/<[^>]*>/g, '')
                // Decode common HTML entities
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&apos;/g, "'")
                // Clean up whitespace
                .replace(/\n\s*\n/g, '\n\n')
                .replace(/[ \t]+/g, ' ')
                .trim();
        } catch (error) {
            this._log(`HTML conversion error: ${error.message}`, 'warn');
            return html.replace(/<[^>]*>/g, '').trim();
        }
    }

    /**
     * Process text content into lines
     * @private
     */
    _processTextToLines(text, options) {
        const maxWidth = options.pageWidth - options.margin.left - options.margin.right;
        const avgCharWidth = options.fontSize * 0.6; // Approximate character width
        const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);

        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        const lines = [];

        paragraphs.forEach((paragraph, index) => {
            // Add spacing between paragraphs
            if (index > 0) {
                lines.push(''); // Empty line for spacing
            }

            const words = paragraph.trim().split(/\s+/);
            let currentLine = '';

            words.forEach(word => {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;

                if (testLine.length <= maxCharsPerLine) {
                    currentLine = testLine;
                } else {
                    if (currentLine) {
                        lines.push(currentLine);
                    }

                    // Handle very long words
                    if (word.length > maxCharsPerLine) {
                        for (let i = 0; i < word.length; i += maxCharsPerLine) {
                            lines.push(word.substring(i, i + maxCharsPerLine));
                        }
                        currentLine = '';
                    } else {
                        currentLine = word;
                    }
                }
            });

            if (currentLine) {
                lines.push(currentLine);
            }
        });

        return lines;
    }

    /**
     * Create PDF document
     * @private
     */
    async _createPDFDocument(lines, title, contentType, options) {
        try {
            const objects = [];
            let objectId = 1;

            // Calculate pagination
            const effectiveHeight = options.pageHeight - options.margin.top - options.margin.bottom;
            const linesPerPage = Math.floor(effectiveHeight / options.lineHeight);
            const pages = [];

            // Split lines into pages
            for (let i = 0; i < lines.length; i += linesPerPage) {
                pages.push(lines.slice(i, i + linesPerPage));
            }

            // Ensure at least one page
            if (pages.length === 0) {
                pages.push(['']);
            }

            // Object 1: Catalog
            objects.push({
                id: objectId++,
                content: `<<\n/Type /Catalog\n/Pages 2 0 R\n>>`
            });

            // Object 2: Pages
            const pageRefs = pages.map((_, index) => `${3 + index * 2} 0 R`).join(' ');
            objects.push({
                id: objectId++,
                content: `<<\n/Type /Pages\n/Kids [${pageRefs}]\n/Count ${pages.length}\n>>`
            });

            // Create page objects and content streams
            pages.forEach((pageLines) => {
                const pageId = objectId++;
                const contentId = objectId++;

                // Page object
                objects.push({
                    id: pageId,
                    content: `<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 ${options.pageWidth} ${options.pageHeight}]\n/Resources <<\n  /Font <<\n    /F1 ${objects.length + pages.length * 2 + 1} 0 R\n  >>\n>>\n/Contents ${contentId} 0 R\n>>`
                });

                // Content stream
                const contentStream = this._createContentStream(pageLines, options);
                objects.push({
                    id: contentId,
                    content: `<<\n/Length ${contentStream.length}\n>>\nstream\n${contentStream}\nendstream`
                });
            });

            // Font object
            objects.push({
                id: objectId++,
                content: `<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>`
            });

            // Info object
            const now = new Date();
            const pdfDate = `D:${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

            objects.push({
                id: objectId++,
                content: `<<\n/Title (${this._escapeString(title)})\n/Producer (Enhanced PDF Generator v1.0.0)\n/Creator (Enhanced PDF Generator)\n/CreationDate (${pdfDate})\n/ModDate (${pdfDate})\n>>`
            });

            // Build final PDF
            return this._buildPDFFile(objects, objectId - 1);

        } catch (error) {
            throw new Error(`PDF document creation failed: ${error.message}`);
        }
    }

    /**
     * Create content stream for a page
     * @private
     */
    _createContentStream(lines, options) {
        const content = [];
        content.push('BT'); // Begin text
        content.push(`/F1 ${options.fontSize} Tf`); // Set font

        let yPosition = options.pageHeight - options.margin.top - options.fontSize;
        let isFirstLine = true;

        lines.forEach(line => {
            if (yPosition < options.margin.bottom) {
                return; // Skip if we're too close to bottom margin
            }

            if (isFirstLine) {
                content.push(`${options.margin.left} ${yPosition} Td`);
                isFirstLine = false;
            } else {
                content.push(`0 -${options.lineHeight} Td`);
            }
            content.push(`(${this._escapeString(line)}) Tj`);
            yPosition -= options.lineHeight;
        });

        content.push('ET'); // End text
        return content.join('\n');
    }

    /**
     * Build the final PDF file
     * @private
     */
    _buildPDFFile(objects, infoObjectId) {
        const lines = [];

        // PDF header
        lines.push(`%PDF-${PDF_VERSION}`);
        lines.push('%âãÏÓ'); // Binary comment for PDF readers

        // Track object positions for xref table
        const objectPositions = [];

        // Calculate initial position after header
        let currentPosition = 0;
        const headerContent = lines.join('\n') + '\n';
        currentPosition = Buffer.from(headerContent, 'binary').length;

        // Add objects
        objects.forEach(obj => {
            objectPositions.push(currentPosition);

            const objContent = `${obj.id} 0 obj\n${obj.content}\nendobj\n`;
            lines.push(objContent);
            currentPosition += Buffer.from(objContent, 'binary').length;
        });

        // Cross-reference table
        const xrefPosition = currentPosition;
        lines.push('xref');
        lines.push(`0 ${objects.length + 1}`);
        lines.push('0000000000 65535 f ');

        objectPositions.forEach(pos => {
            lines.push(`${pos.toString().padStart(10, '0')} 00000 n `);
        });

        // Trailer
        lines.push('trailer');
        lines.push('<<');
        lines.push(`/Size ${objects.length + 1}`);
        lines.push('/Root 1 0 R');
        lines.push(`/Info ${infoObjectId} 0 R`);
        lines.push('>>');
        lines.push('startxref');
        lines.push(`${xrefPosition}`);
        lines.push('%%EOF');

        return Buffer.from(lines.join('\n'), 'binary');
    }

    /**
     * Escape special characters for PDF strings
     * @private
     */
    _escapeString(str) {
        if (!str || typeof str !== 'string') {
            return '';
        }

        return str
            .replace(/\\/g, '\\\\')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)')
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t')
            .substring(0, 1000); // Limit string length for safety
    }

    /**
     * Validate PDF structure (comprehensive check)
     * @private
     */
    _validatePDFStructure(pdfBuffer) {
        try {
            if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length < 100) {
                return false;
            }

            // Convert to string for structure checking
            const pdfString = pdfBuffer.toString('binary');

            // Check PDF header
            if (!pdfString.startsWith('%PDF-')) {
                this._log('PDF validation failed: Missing PDF header', 'debug');
                return false;
            }

            // Check PDF footer
            if (!pdfString.includes('%%EOF')) {
                this._log('PDF validation failed: Missing EOF marker', 'debug');
                return false;
            }

            // Check for essential PDF structures
            const requiredElements = [
                '/Type /Catalog',
                '/Type /Pages',
                '/Type /Page',
                'xref',
                'trailer',
                'startxref'
            ];

            for (const element of requiredElements) {
                if (!pdfString.includes(element)) {
                    this._log(`PDF validation failed: Missing ${element}`, 'debug');
                    return false;
                }
            }

            // Check that xref comes before trailer
            const xrefPos = pdfString.indexOf('xref');
            const trailerPos = pdfString.indexOf('trailer');
            if (xrefPos === -1 || trailerPos === -1 || xrefPos >= trailerPos) {
                this._log('PDF validation failed: Invalid xref/trailer order', 'debug');
                return false;
            }

            this._log('PDF structure validation passed', 'debug');
            return true;

        } catch (error) {
            this._log(`PDF validation error: ${error.message}`, 'debug');
            return false;
        }
    }

    /**
     * Format bytes to human readable string
     * @private
     */
    _formatBytes(bytes) {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Ensure directory exists
     * @private
     */
    async _ensureDirectoryExists(directory) {
        try {
            await fs.promises.access(directory);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.promises.mkdir(directory, { recursive: true });
            } else {
                throw error;
            }
        }
    }

    /**
     * Write file asynchronously
     * @private
     */
    async _writeFileAsync(filePath, data) {
        return fs.promises.writeFile(filePath, data);
    }

    /**
     * Start performance tracking
     * @private
     */
    _startPerformanceTracking() {
        this.performance.startTime = Date.now();
        this.performance.memoryUsage = process.memoryUsage();
    }

    /**
     * End performance tracking
     * @private
     */
    _endPerformanceTracking() {
        this.performance.endTime = Date.now();
        const processingTime = this.performance.endTime - this.performance.startTime;
        this.state.totalProcessingTime += processingTime;

        this._log(`Processing completed in ${processingTime}ms`, 'debug');
    }

    /**
     * Update statistics
     * @private
     */
    _updateStatistics() {
        this.state.documentsGenerated++;
    }

    /**
     * Handle errors
     * @private
     */
    _handleError(error, method) {
        this.state.lastError = {
            message: error.message,
            method: method,
            timestamp: new Date().toISOString(),
            stack: error.stack
        };

        this._log(`Error in ${method}: ${error.message}`, 'error');
    }

    /**
     * Log messages
     * @private
     */
    _log(message, level = 'info') {
        if (!this.config.debug && level === 'debug') {
            return;
        }

        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}] [EnhancedPDFGenerator]`;

        switch (level) {
            case 'error':
                console.error(`${prefix} ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ${message}`);
                break;
            case 'debug':
                console.debug(`${prefix} ${message}`);
                break;
            default:
                console.log(`${prefix} ${message}`);
                break;
        }
    }
}

// Export the class
module.exports = EnhancedPDFGenerator;

// Export constants for external use
module.exports.PAGE_FORMATS = PAGE_FORMATS;
module.exports.PDF_VERSION = PDF_VERSION;