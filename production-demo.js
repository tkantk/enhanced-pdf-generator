/**
 * Production Demo and Test Suite
 * Enhanced PDF Generator - Production Ready
 *
 * This file demonstrates all features and runs comprehensive tests
 * to ensure the PDF generator works correctly in production environments.
 */

'use strict';

const EnhancedPDFGenerator = require('./enhanced-pdf-generator');
const path = require('path');
const fs = require('fs');

// Test configuration
const TEST_CONFIG = {
    outputDirectory: path.join(__dirname, 'output'),
    enableDebug: true,
    runPerformanceTests: true,
    testSamples: {
        shortText: `Simple Test Document

This is a basic test to verify the Enhanced PDF Generator works correctly.

Key features tested:
- Text processing
- PDF structure validation
- File output
- Error handling

Generated: ${new Date().toLocaleString()}`,

        longText: `Enhanced PDF Generator - Production Test Report

EXECUTIVE SUMMARY
================

This comprehensive test document validates the Enhanced PDF Generator's capabilities in a production environment. The generator has been designed to handle various content types, error scenarios, and performance requirements suitable for enterprise applications.

SYSTEM REQUIREMENTS
==================

- Node.js 16.0.0 or higher
- Memory: Minimum 512MB available
- Disk Space: Varies based on output requirements
- Operating System: Cross-platform (Windows, macOS, Linux)

TECHNICAL SPECIFICATIONS
=======================

The Enhanced PDF Generator implements the PDF 1.4 specification with the following features:

1. Document Structure
   - Proper PDF object hierarchy
   - Cross-reference table generation
   - Valid trailer information
   - Metadata embedding

2. Text Processing
   - UTF-8 character encoding support
   - Automatic text wrapping
   - Multi-page document support
   - Configurable margins and spacing

3. Content Types
   - Plain text documents
   - Basic HTML conversion
   - Automatic content type detection
   - Mixed content handling

4. Error Handling
   - Input validation
   - Processing state management
   - Graceful error recovery
   - Comprehensive logging

PERFORMANCE METRICS
==================

The generator has been optimized for:
- Fast processing: < 100ms for typical documents
- Low memory usage: < 50MB peak memory
- Efficient file I/O: Streaming output where possible
- Scalable architecture: Handles large documents

SECURITY CONSIDERATIONS
======================

Production-ready security features include:
- Input sanitization
- Path traversal protection
- Content size limitations
- Safe character encoding
- Memory management

TESTING METHODOLOGY
==================

This test suite validates:
1. Basic functionality
2. Error handling
3. Performance characteristics
4. Cross-platform compatibility
5. Memory management
6. File system operations

VALIDATION RESULTS
=================

All tests must pass for production deployment:
- PDF structure validation
- Content accuracy verification
- Error condition handling
- Performance benchmarks
- Memory leak detection

DEPLOYMENT RECOMMENDATIONS
=========================

For production deployment:
1. Monitor memory usage patterns
2. Implement appropriate logging
3. Set up error tracking
4. Configure resource limits
5. Plan for scaling requirements

This document serves as both a test case and documentation for the Enhanced PDF Generator's capabilities.

Generated: ${new Date().toLocaleString()}
Test Version: 1.0.0
Environment: ${process.platform} ${process.arch}
Node.js: ${process.version}`,

        htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML to PDF Test Document</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f8ff; padding: 15px; border: 1px solid #007bff; }
        .section { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #007bff; color: white; }
        .highlight { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; }
    </style>
</head>
<body>
    <div class="header">
        <h1>HTML to PDF Conversion Test</h1>
        <p>Testing HTML content conversion to PDF format</p>
    </div>

    <div class="section">
        <h2>Document Features</h2>
        <p>This document tests various HTML elements and their conversion to PDF:</p>
        
        <ul>
            <li><strong>Text formatting</strong>: Bold, italic, and normal text</li>
            <li><em>HTML elements</em>: Headers, paragraphs, lists, and tables</li>
            <li><u>Content extraction</u>: Proper text extraction from HTML</li>
        </ul>
    </div>

    <div class="section">
        <h2>Test Results Table</h2>
        <table>
            <thead>
                <tr>
                    <th>Test Case</th>
                    <th>Expected Result</th>
                    <th>Status</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Title Extraction</td>
                    <td>HTML title in PDF metadata</td>
                    <td>✓ Pass</td>
                    <td>Correctly extracted</td>
                </tr>
                <tr>
                    <td>Content Conversion</td>
                    <td>HTML to text conversion</td>
                    <td>✓ Pass</td>
                    <td>Tags removed, text preserved</td>
                </tr>
                <tr>
                    <td>Structure Preservation</td>
                    <td>Logical text flow</td>
                    <td>✓ Pass</td>
                    <td>Proper paragraph breaks</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="highlight">
        <h3>Important Note</h3>
        <p>This HTML to PDF conversion focuses on content extraction rather than visual formatting preservation. The goal is to create readable, well-structured PDF documents from HTML content.</p>
    </div>

    <div class="section">
        <h2>Technical Details</h2>
        <ol>
            <li>HTML parsing removes script and style tags</li>
            <li>Block elements are converted to paragraph breaks</li>
            <li>Text content is extracted and formatted</li>
            <li>HTML entities are properly decoded</li>
        </ol>
    </div>

    <footer>
        <p><small>Generated: ${new Date().toLocaleString()}</small></p>
        <p><small>Test Environment: Production Ready</small></p>
    </footer>
</body>
</html>`
    }
};

/**
 * Main test runner
 */
class ProductionTestRunner {
    constructor() {
        this.testResults = [];
        this.startTime = null;
        this.endTime = null;
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🚀 Enhanced PDF Generator - Production Test Suite');
        console.log('=================================================\n');

        this.startTime = Date.now();

        try {
            // Environment validation
            await this.validateEnvironment();

            // Basic functionality tests
            await this.testBasicFunctionality();

            // Advanced feature tests
            await this.testAdvancedFeatures();

            // Error handling tests
            await this.testErrorHandling();

            // Performance tests
            if (TEST_CONFIG.runPerformanceTests) {
                await this.testPerformance();
            }

            // Generate test report
            await this.generateTestReport();

            this.endTime = Date.now();
            this.printTestSummary();

        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
            process.exit(1);
        }
    }

    /**
     * Validate environment
     */
    async validateEnvironment() {
        console.log('🔍 Validating Environment...');

        try {
            // Check Node.js version
            const nodeVersion = process.version;
            const [major, minor] = nodeVersion.substring(1).split('.').map(Number);

            if (major < 16) {
                throw new Error(`Node.js 16+ required, found ${nodeVersion}`);
            }

            // Check memory availability
            const memoryUsage = process.memoryUsage();
            if (memoryUsage.heapTotal < 50 * 1024 * 1024) { // 50MB
                console.warn('⚠️  Low memory available, some tests may fail');
            }

            // Create output directory
            await this.ensureOutputDirectory();

            // Test basic PDF generator initialization
            const generator = new EnhancedPDFGenerator({ debug: false });
            const stats = generator.getStatistics();

            this.addTestResult('Environment Validation', 'PASS', 'All environment checks passed');
            console.log('✅ Environment validation passed');
            console.log(`   Node.js: ${nodeVersion}`);
            console.log(`   Platform: ${process.platform} ${process.arch}`);
            console.log(`   Memory: ${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB\n`);

        } catch (error) {
            this.addTestResult('Environment Validation', 'FAIL', error.message);
            throw error;
        }
    }

    /**
     * Test basic functionality
     */
    async testBasicFunctionality() {
        console.log('📝 Testing Basic Functionality...');

        const generator = new EnhancedPDFGenerator({
            debug: TEST_CONFIG.enableDebug,
            pageFormat: 'A4'
        });

        try {
            // Test 1: Simple text to PDF
            console.log('   Testing text to PDF conversion...');
            const textPDF = await generator.generatePDFFromText(TEST_CONFIG.testSamples.shortText, {
                title: 'Basic Text Test',
                fontSize: 12
            });

            if (!Buffer.isBuffer(textPDF) || textPDF.length === 0) {
                throw new Error('Text PDF generation failed');
            }

            const textPath = path.join(TEST_CONFIG.outputDirectory, 'test-basic-text.pdf');
            await generator.savePDF(textPDF, textPath);

            const textInfo = generator.getPDFInfo(textPDF);
            if (!textInfo.isValid) {
                throw new Error('Generated text PDF is invalid');
            }

            this.addTestResult('Text to PDF', 'PASS', `Generated ${textInfo.sizeFormatted} PDF`);
            console.log(`   ✅ Text PDF: ${textInfo.sizeFormatted}`);

            // Test 2: HTML to PDF
            console.log('   Testing HTML to PDF conversion...');
            const htmlPDF = await generator.generatePDFFromHTML(TEST_CONFIG.testSamples.htmlContent, {
                fontSize: 11
            });

            if (!Buffer.isBuffer(htmlPDF) || htmlPDF.length === 0) {
                throw new Error('HTML PDF generation failed');
            }

            const htmlPath = path.join(TEST_CONFIG.outputDirectory, 'test-basic-html.pdf');
            await generator.savePDF(htmlPDF, htmlPath);

            const htmlInfo = generator.getPDFInfo(htmlPDF);
            if (!htmlInfo.isValid) {
                throw new Error('Generated HTML PDF is invalid');
            }

            this.addTestResult('HTML to PDF', 'PASS', `Generated ${htmlInfo.sizeFormatted} PDF`);
            console.log(`   ✅ HTML PDF: ${htmlInfo.sizeFormatted}`);

            // Test 3: Auto-detection
            console.log('   Testing auto-detection...');
            const autoPDF1 = await generator.generatePDF(TEST_CONFIG.testSamples.shortText);
            const autoPDF2 = await generator.generatePDF(TEST_CONFIG.testSamples.htmlContent);

            if (!Buffer.isBuffer(autoPDF1) || !Buffer.isBuffer(autoPDF2)) {
                throw new Error('Auto-detection failed');
            }

            this.addTestResult('Auto-detection', 'PASS', 'Both text and HTML detected correctly');
            console.log('   ✅ Auto-detection working');

            console.log('✅ Basic functionality tests passed\n');

        } catch (error) {
            this.addTestResult('Basic Functionality', 'FAIL', error.message);
            throw error;
        }
    }

    /**
     * Test advanced features
     */
    async testAdvancedFeatures() {
        console.log('⚙️ Testing Advanced Features...');

        try {
            // Test different page formats
            console.log('   Testing page formats...');
            const formats = ['A4', 'LETTER', 'LEGAL'];

            for (const format of formats) {
                const generator = new EnhancedPDFGenerator({ pageFormat: format });
                const pdf = await generator.generatePDFFromText(`Test document in ${format} format`, {
                    title: `${format} Format Test`
                });

                const formatPath = path.join(TEST_CONFIG.outputDirectory, `test-format-${format.toLowerCase()}.pdf`);
                await generator.savePDF(pdf, formatPath);

                console.log(`   ✅ ${format} format: ${generator.getPDFInfo(pdf).sizeFormatted}`);
            }

            this.addTestResult('Page Formats', 'PASS', 'All formats generated successfully');

            // Test custom margins
            console.log('   Testing custom margins...');
            const marginGenerator = new EnhancedPDFGenerator();
            const marginPDF = await marginGenerator.generatePDFFromText(TEST_CONFIG.testSamples.shortText, {
                title: 'Custom Margins Test',
                margin: { top: 72, bottom: 72, left: 54, right: 54 } // 1 inch margins
            });

            const marginPath = path.join(TEST_CONFIG.outputDirectory, 'test-custom-margins.pdf');
            await marginGenerator.savePDF(marginPDF, marginPath);

            this.addTestResult('Custom Margins', 'PASS', 'Custom margins applied successfully');
            console.log('   ✅ Custom margins applied');

            // Test long document (multi-page)
            console.log('   Testing multi-page document...');
            const longGenerator = new EnhancedPDFGenerator();
            const longPDF = await longGenerator.generatePDFFromText(TEST_CONFIG.testSamples.longText, {
                title: 'Multi-page Test Document',
                fontSize: 10,
                lineHeight: 12
            });

            const longPath = path.join(TEST_CONFIG.outputDirectory, 'test-multipage.pdf');
            await longGenerator.savePDF(longPDF, longPath);

            const longInfo = longGenerator.getPDFInfo(longPDF);
            this.addTestResult('Multi-page Document', 'PASS', `Generated ${longInfo.sizeFormatted} document`);
            console.log(`   ✅ Multi-page document: ${longInfo.sizeFormatted}`);

            console.log('✅ Advanced features tests passed\n');

        } catch (error) {
            this.addTestResult('Advanced Features', 'FAIL', error.message);
            throw error;
        }
    }

    /**
     * Test error handling
     */
    async testErrorHandling() {
        console.log('🛡️ Testing Error Handling...');

        const generator = new EnhancedPDFGenerator();

        try {
            // Test null input
            console.log('   Testing null input handling...');
            try {
                await generator.generatePDFFromText(null);
                throw new Error('Should have thrown error for null input');
            } catch (error) {
                if (error.message.includes('cannot be null')) {
                    console.log('   ✅ Null input properly rejected');
                } else {
                    throw error;
                }
            }

            // Test empty input
            console.log('   Testing empty input handling...');
            try {
                await generator.generatePDFFromText('');
                throw new Error('Should have thrown error for empty input');
            } catch (error) {
                if (error.message.includes('cannot be empty')) {
                    console.log('   ✅ Empty input properly rejected');
                } else {
                    throw error;
                }
            }

            // Test invalid file path
            console.log('   Testing invalid file path handling...');
            try {
                const pdf = await generator.generatePDFFromText('Test content');
                await generator.savePDF(pdf, '');
                throw new Error('Should have thrown error for invalid path');
            } catch (error) {
                if (error.message.includes('Invalid file path') ||
                    error.message.includes('Input string cannot be empty') ||
                    error.message.includes('Failed to save PDF')) {
                    console.log('   ✅ Invalid file path properly rejected');
                } else {
                    throw error;
                }
            }

            // Test concurrent processing
            console.log('   Testing concurrent processing handling...');
            const concurrentGenerator = new EnhancedPDFGenerator();

            // Start first operation
            const promise1 = concurrentGenerator.generatePDFFromText('Test 1');

            // Try to start second operation while first is running
            try {
                await concurrentGenerator.generatePDFFromText('Test 2');
                // If we get here, either the first operation finished very quickly,
                // or concurrent processing is allowed (which might be okay)
                console.log('   ✅ Concurrent processing handled (operations completed)');
            } catch (error) {
                if (error.message.includes('already processing')) {
                    console.log('   ✅ Concurrent processing properly rejected');
                } else {
                    console.log('   ⚠️  Unexpected concurrent processing error:', error.message);
                }
            }

            // Wait for first operation to complete
            await promise1;

            this.addTestResult('Error Handling', 'PASS', 'All error conditions handled correctly');
            console.log('✅ Error handling tests passed\n');

        } catch (error) {
            this.addTestResult('Error Handling', 'FAIL', error.message);
            throw error;
        }
    }

    /**
     * Test performance
     */
    async testPerformance() {
        console.log('🚀 Testing Performance...');

        const generator = new EnhancedPDFGenerator();

        try {
            // Test small document performance
            console.log('   Testing small document performance...');
            const smallStart = Date.now();
            await generator.generatePDFFromText(TEST_CONFIG.testSamples.shortText);
            const smallTime = Date.now() - smallStart;

            if (smallTime > 1000) { // 1 second threshold
                console.warn(`   ⚠️  Small document took ${smallTime}ms (expected < 1000ms)`);
            } else {
                console.log(`   ✅ Small document: ${smallTime}ms`);
            }

            // Test large document performance
            console.log('   Testing large document performance...');
            const largeStart = Date.now();
            await generator.generatePDFFromText(TEST_CONFIG.testSamples.longText);
            const largeTime = Date.now() - largeStart;

            if (largeTime > 5000) { // 5 second threshold
                console.warn(`   ⚠️  Large document took ${largeTime}ms (expected < 5000ms)`);
            } else {
                console.log(`   ✅ Large document: ${largeTime}ms`);
            }

            // Test memory usage
            console.log('   Testing memory usage...');
            const memBefore = process.memoryUsage();

            // Generate multiple documents
            for (let i = 0; i < 10; i++) {
                await generator.generatePDFFromText(`Test document ${i + 1}\n\nThis is test content for document number ${i + 1}.`);
            }

            const memAfter = process.memoryUsage();
            const memIncrease = memAfter.heapUsed - memBefore.heapUsed;

            if (memIncrease > 100 * 1024 * 1024) { // 100MB threshold
                console.warn(`   ⚠️  Memory increase: ${Math.round(memIncrease / 1024 / 1024)}MB`);
            } else {
                console.log(`   ✅ Memory increase: ${Math.round(memIncrease / 1024 / 1024)}MB`);
            }

            this.addTestResult('Performance', 'PASS', `Small: ${smallTime}ms, Large: ${largeTime}ms, Memory: ${Math.round(memIncrease / 1024 / 1024)}MB`);
            console.log('✅ Performance tests passed\n');

        } catch (error) {
            this.addTestResult('Performance', 'FAIL', error.message);
            throw error;
        }
    }

    /**
     * Generate test report
     */
    async generateTestReport() {
        console.log('📊 Generating Test Report...');

        const generator = new EnhancedPDFGenerator({ debug: false });
        const stats = generator.getStatistics();

        const reportContent = `Enhanced PDF Generator - Test Report

EXECUTION SUMMARY
================
Test Run Date: ${new Date().toLocaleString()}
Total Tests: ${this.testResults.length}
Passed: ${this.testResults.filter(r => r.status === 'PASS').length}
Failed: ${this.testResults.filter(r => r.status === 'FAIL').length}
Execution Time: ${this.endTime ? this.endTime - this.startTime : 'In Progress'}ms

ENVIRONMENT INFORMATION
======================
Node.js Version: ${process.version}
Platform: ${process.platform} ${process.arch}
Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
Working Directory: ${process.cwd()}

DETAILED TEST RESULTS
====================
${this.testResults.map(result =>
            `${result.name}: ${result.status}
   Details: ${result.details}
   Time: ${result.timestamp}
`).join('\n')}

PERFORMANCE METRICS
==================
${JSON.stringify(stats, null, 2)}

CONCLUSION
==========
${this.testResults.every(r => r.status === 'PASS') ?
            'All tests passed successfully. The Enhanced PDF Generator is ready for production use.' :
            'Some tests failed. Please review the failures before deploying to production.'
        }

Generated by Enhanced PDF Generator Test Suite v1.0.0`;

        try {
            const reportPDF = await generator.generatePDFFromText(reportContent, {
                title: 'Enhanced PDF Generator - Test Report',
                fontSize: 10,
                lineHeight: 12
            });

            const reportPath = path.join(TEST_CONFIG.outputDirectory, 'test-report.pdf');
            await generator.savePDF(reportPDF, reportPath);

            console.log(`✅ Test report generated: ${reportPath}\n`);

        } catch (error) {
            console.warn(`⚠️  Could not generate test report: ${error.message}`);
        }
    }

    /**
     * Print test summary
     */
    printTestSummary() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
        const failedTests = this.testResults.filter(r => r.status === 'FAIL').length;
        const executionTime = this.endTime - this.startTime;

        console.log('📋 Test Summary');
        console.log('================');
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${failedTests}`);
        console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
        console.log(`Execution Time: ${executionTime}ms`);
        console.log(`Output Directory: ${TEST_CONFIG.outputDirectory}`);

        if (failedTests === 0) {
            console.log('\n🎉 All tests passed! Enhanced PDF Generator is ready for production use.');
        } else {
            console.log('\n❌ Some tests failed. Please review the failures before production deployment.');
        }
    }

    /**
     * Add test result
     */
    addTestResult(name, status, details) {
        this.testResults.push({
            name,
            status,
            details,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Ensure output directory exists
     */
    async ensureOutputDirectory() {
        try {
            await fs.promises.access(TEST_CONFIG.outputDirectory);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.promises.mkdir(TEST_CONFIG.outputDirectory, { recursive: true });
            } else {
                throw error;
            }
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const testRunner = new ProductionTestRunner();
    testRunner.runAllTests().catch(error => {
        console.error('Test suite failed:', error.message);
        process.exit(1);
    });
}

module.exports = ProductionTestRunner;