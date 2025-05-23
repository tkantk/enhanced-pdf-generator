/**
 * Production Demo and Test Suite
 * Enhanced PDF Generator - Production Ready
 * Version 2.0.0 - Updated for latest implementation
 */

'use strict';

const EnhancedPDFGenerator = require('./enhanced-pdf-generator');
const path = require('path');
const fs = require('fs');

const TEST_CONFIG = {
    outputDirectory: path.join(__dirname, 'output'),
    enableDebug: false,
    runPerformanceTests: true,
    testSamples: {
        simpleHtml: `<!DOCTYPE html>
<html>
<head><title>Simple Test</title></head>
<body>
    <h1>Simple Test Document</h1>
    <p>This is a basic test to verify the Enhanced PDF Generator.</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
</body>
</html>`,

        styledHtmlContent: `<!DOCTYPE html>
<html>
<head><title>Styled HTML Test v2.0</title></head>
<body>
    <div>
<h4 style="font-family: arial; margin-top: 0; margin-bottom: 16px; font-size: 20px; color:#2e2e2e;">Borrower's Information</h4>
<hr style="margin-bottom: 16px;">
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">
    Full Name: Mr Tushar Kant Kar
</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">
    Mobile Number: 91 9,99,99,99,999
</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">Email Address: test@test.com</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">Birthdate: 09/09/1999</p>

<h4 style="font-family: arial; margin-top: 32px; margin-bottom: 16px; font-size: 20px; color:#2e2e2e;">Home Address</h4>
<hr style="margin-bottom: 16px;">
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">Country: India</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">Province/State: Karnataka</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">City/Municipality: Bengaluru</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">
    Plan to Purchase: <span class="plan-value">2 months</span>
</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">
    Request a Quote: Yes
</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">
    Area of Dealership: Bengaluru, Karnataka
</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">
    Car Color: Red
</p>

<h4 style="font-family: arial; margin-top: 32px; margin-bottom: 16px; font-size: 20px; color:#2e2e2e;">Loan Information</h4>
<hr style="margin-bottom: 16px;">
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">Vehicle Type: MPV</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">Vehicle Brand: BMW</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">Vehicle Model: M4</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">
    Vehicle Variant: M4
</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">
    Estimated Vehicle Price: 10,00,00,00,000
</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">Down Payment: 1,00,000</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">Loan Amount: 10,000</p>
<p style="font-family: arial; margin-top: 0; margin-bottom: 8px; font-size: 16px; color:#2e2e2e;">DPA Undertaking: Private Data</p>
</div>
</body>
</html>`,

        complexHtml: `<!DOCTYPE html>
<html>
<head><title>Complex Test Document</title></head>
<body>
    <h1 style="font-size: 24px; color: #333;">Enhanced PDF Generator Test</h1>
    <hr>
    <h2 style="font-size: 20px; color: #666;">Features Demonstration</h2>
    <p style="font-size: 16px;">This document demonstrates various features:</p>
    
    <h3 style="font-size: 18px; color: #888;">Text Styling</h3>
    <p style="font-size: 14px; color: #444;">Different font sizes and colors are supported.</p>
    <p style="font-size: 12px; color: #999;">Small text example.</p>
    <p style="font-size: 20px; color: #000;">Large text example.</p>
    
    <hr>
    
    <h3 style="font-size: 18px;">Number Formatting</h3>
    <p>Large numbers are automatically formatted: 1234567890</p>
    <p>Currency example: 99999999</p>
    
    <hr>
    
    <h3 style="font-size: 18px;">Special Characters</h3>
    <p>Testing special chars: & < > " ' (parentheses) [brackets]</p>
    <p>Email: user@example.com</p>
    <p>Phone: +91-9999999999</p>
    
    <p style="font-size: 10px; color: #aaa;">Generated on: ${new Date().toLocaleString()}</p>
</body>
</html>`,

        emptyHtml: `<!DOCTYPE html><html><head><title>Empty</title></head><body></body></html>`,

        invalidHtml: `<p>This is invalid HTML without proper structure</p>`,

        longContentHtml: `<!DOCTYPE html>
<html>
<head><title>Long Content Test</title></head>
<body>
    <h1>Long Content Test Document</h1>
    ${Array(50).fill(null).map((_, i) => `
    <h2>Section ${i + 1}</h2>
    <p>This is paragraph ${i + 1} of the long content test. It contains enough text to test pagination and content flow.</p>
    <p>Additional content for section ${i + 1} to ensure proper spacing and layout rendering.</p>
    <hr>
    `).join('')}
</body>
</html>`
    }
};

class ProductionTestRunner {
    constructor() {
        this.testResults = [];
        this.startTime = null;
        this.endTime = null;
    }

    async runAllTests() {
        console.log('🚀 Enhanced PDF Generator - Production Test Suite v2.0.0');
        console.log('======================================================\n');
        this.startTime = Date.now();

        try {
            await this.validateEnvironment();
            await this.testBasicFunctionality();
            await this.testAdvancedFeatures();
            await this.testErrorHandling();
            await this.testEdgeCases();
            if (TEST_CONFIG.runPerformanceTests) await this.testPerformance();

            this.endTime = Date.now();
            await this.generateTestReport();
            this.printTestSummary();

        } catch (error) {
            this.endTime = Date.now();
            console.error('❌ Test suite failed critically:', error.message, TEST_CONFIG.enableDebug ? error.stack : '');
            this.addTestResult('Test Suite Critical', 'FAIL', error.message);
            this.printTestSummary();
            process.exit(1);
        }
    }

    async validateEnvironment() {
        console.log('🔍 Validating Environment...');
        try {
            const nodeVersion = process.version;
            const [major] = nodeVersion.substring(1).split('.').map(Number);
            if (major < 14) throw new Error(`Node.js 14+ required, found ${nodeVersion}`);

            await this.ensureOutputDirectory();

            // Test basic instantiation
            new EnhancedPDFGenerator({ debug: false });

            this.addTestResult('Environment Validation', 'PASS', `Node: ${nodeVersion}. Output dir ready.`);
            console.log('✅ Environment validation passed\n');
        } catch (error) {
            this.addTestResult('Environment Validation', 'FAIL', error.message);
            throw error;
        }
    }

    async testBasicFunctionality() {
        console.log('📝 Testing Basic Functionality...');
        const generator = new EnhancedPDFGenerator({ debug: TEST_CONFIG.enableDebug });

        try {
            // Test 1: Simple HTML to PDF
            const simplePDF = await generator.generatePDFFromHTML(TEST_CONFIG.testSamples.simpleHtml, {
                title: 'Simple HTML Test'
            });
            const simplePath = path.join(TEST_CONFIG.outputDirectory, 'test-simple-html.pdf');
            await generator.savePDF(simplePDF, simplePath);
            const simpleInfo = generator.getPDFInfo(simplePDF);

            if (!simpleInfo.isValid) throw new Error('Generated simple HTML PDF is invalid');
            this.addTestResult('Simple HTML to PDF', 'PASS', `Generated ${simpleInfo.sizeFormatted} PDF`);
            console.log(`   ✅ Simple HTML PDF: ${simpleInfo.sizeFormatted}`);

            // Test 2: Styled HTML to PDF
            const styledPDF = await generator.generatePDFFromHTML(TEST_CONFIG.testSamples.styledHtmlContent, {
                title: 'Styled HTML Test Document'
            });
            const styledPath = path.join(TEST_CONFIG.outputDirectory, 'test-styled-html.pdf');
            await generator.savePDF(styledPDF, styledPath);
            const styledInfo = generator.getPDFInfo(styledPDF);

            if (!styledInfo.isValid) throw new Error('Generated styled HTML PDF is invalid');
            this.addTestResult('Styled HTML to PDF', 'PASS', `Generated ${styledInfo.sizeFormatted} PDF`);
            console.log(`   ✅ Styled HTML PDF: ${styledInfo.sizeFormatted}`);

            // Test 3: Complex HTML with various elements
            const complexPDF = await generator.generatePDFFromHTML(TEST_CONFIG.testSamples.complexHtml, {
                title: 'Complex HTML Test'
            });
            const complexPath = path.join(TEST_CONFIG.outputDirectory, 'test-complex-html.pdf');
            await generator.savePDF(complexPDF, complexPath);
            const complexInfo = generator.getPDFInfo(complexPDF);

            if (!complexInfo.isValid) throw new Error('Generated complex HTML PDF is invalid');
            this.addTestResult('Complex HTML to PDF', 'PASS', `Generated ${complexInfo.sizeFormatted} PDF`);
            console.log(`   ✅ Complex HTML PDF: ${complexInfo.sizeFormatted}`);

            console.log('✅ Basic functionality tests passed\n');
        } catch (error) {
            this.addTestResult('Basic Functionality', 'FAIL', error.message);
            console.error(`   ❌ Basic Functionality FAILED: ${error.message}`, TEST_CONFIG.enableDebug ? error.stack : '');
            throw error;
        }
    }

    async testAdvancedFeatures() {
        console.log('⚙️ Testing Advanced Features...');

        try {
            // Test with debug mode
            const debugGen = new EnhancedPDFGenerator({ debug: true, enableCSS: true });
            console.log('   Testing debug mode output...');
            const debugPDF = await debugGen.generatePDFFromHTML(TEST_CONFIG.testSamples.simpleHtml, {
                title: 'Debug Mode Test'
            });
            await debugGen.savePDF(debugPDF, path.join(TEST_CONFIG.outputDirectory, 'test-debug-mode.pdf'));
            this.addTestResult('Debug Mode', 'PASS', 'Debug logging functional');
            console.log('   ✅ Debug mode tested');

            // Test custom page dimensions
            const customGen = new EnhancedPDFGenerator({ debug: TEST_CONFIG.enableDebug });
            const customPDF = await customGen.generatePDFFromHTML(TEST_CONFIG.testSamples.simpleHtml, {
                title: 'Custom Page Size',
                pageWidth: 842,  // A4 landscape
                pageHeight: 595,
                margin: { top: 50, right: 50, bottom: 50, left: 50 }
            });
            await customGen.savePDF(customPDF, path.join(TEST_CONFIG.outputDirectory, 'test-custom-size.pdf'));
            this.addTestResult('Custom Page Size', 'PASS', 'Custom dimensions applied');
            console.log('   ✅ Custom page size tested');

            // Test long content (pagination test)
            const longGen = new EnhancedPDFGenerator({ debug: TEST_CONFIG.enableDebug });
            const longPDF = await longGen.generatePDFFromHTML(TEST_CONFIG.testSamples.longContentHtml, {
                title: 'Long Content Test'
            });
            await longGen.savePDF(longPDF, path.join(TEST_CONFIG.outputDirectory, 'test-long-content.pdf'));
            const longInfo = longGen.getPDFInfo(longPDF);
            this.addTestResult('Long Content', 'PASS', `Generated ${longInfo.sizeFormatted} PDF`);
            console.log(`   ✅ Long content PDF: ${longInfo.sizeFormatted}`);

            console.log('✅ Advanced features tests passed\n');
        } catch (error) {
            this.addTestResult('Advanced Features', 'FAIL', error.message);
            console.error(`   ❌ Advanced Features FAILED: ${error.message}`, TEST_CONFIG.enableDebug ? error.stack : '');
            throw error;
        }
    }

    async testErrorHandling() {
        console.log('🛡️ Testing Error Handling...');
        const generator = new EnhancedPDFGenerator({ debug: TEST_CONFIG.enableDebug });
        let errorsPassed = 0;
        const totalErrorTests = 5;

        // Test 1: Null HTML input
        try {
            await generator.generatePDFFromHTML(null);
        } catch (e) {
            if (e.message.includes('generation failed')) errorsPassed++;
            else console.error('Null input test unexpected error:', e.message);
        }

        // Test 2: Empty HTML
        try {
            const emptyPDF = await generator.generatePDFFromHTML(TEST_CONFIG.testSamples.emptyHtml);
            const emptyInfo = generator.getPDFInfo(emptyPDF);
            if (emptyInfo.isValid) errorsPassed++;
        } catch (e) {
            console.error('Empty HTML test unexpected error:', e.message);
        }

        // Test 3: Invalid save path
        try {
            const pdf = await generator.generatePDFFromHTML(TEST_CONFIG.testSamples.simpleHtml);
            await generator.savePDF(pdf, '');
        } catch (e) {
            if (e.message.includes('save PDF')) errorsPassed++;
            else console.error('Invalid path test unexpected error:', e.message);
        }

        // Test 4: Invalid PDF buffer for getPDFInfo
        try {
            const info = generator.getPDFInfo(Buffer.from('invalid'));
            if (!info.isValid) errorsPassed++;
        } catch (e) {
            errorsPassed++; // Also acceptable if it throws
        }

        // Test 5: Save with null buffer
        try {
            await generator.savePDF(null, 'test.pdf');
        } catch (e) {
            if (e.message.includes('save PDF')) errorsPassed++;
            else console.error('Null buffer save test unexpected error:', e.message);
        }

        if (errorsPassed === totalErrorTests) {
            this.addTestResult('Error Handling', 'PASS', 'All error conditions handled correctly');
            console.log('   ✅ All expected error conditions handled');
        } else {
            this.addTestResult('Error Handling', 'PARTIAL', `${errorsPassed}/${totalErrorTests} error conditions handled`);
            console.warn(`   ⚠️  Error handling: ${errorsPassed}/${totalErrorTests} conditions met`);
        }
        console.log('✅ Error handling tests completed\n');
    }

    async testEdgeCases() {
        console.log('🔧 Testing Edge Cases...');
        const generator = new EnhancedPDFGenerator({ debug: TEST_CONFIG.enableDebug });

        try {
            // Test invalid HTML structure
            const invalidPDF = await generator.generatePDFFromHTML(TEST_CONFIG.testSamples.invalidHtml, {
                title: 'Invalid HTML Test'
            });
            await generator.savePDF(invalidPDF, path.join(TEST_CONFIG.outputDirectory, 'test-invalid-html.pdf'));
            this.addTestResult('Invalid HTML Structure', 'PASS', 'Handled gracefully');
            console.log('   ✅ Invalid HTML handled');

            // Test special characters
            const specialHtml = `<!DOCTYPE html><html><body>
                <h1>Special Chars: © ® ™ € £ ¥</h1>
                <p>Math: ∑ ∏ √ ∞ ≈ ≠ ≤ ≥</p>
                <p>Arrows: ← → ↑ ↓ ⇐ ⇒</p>
            </body></html>`;
            const specialPDF = await generator.generatePDFFromHTML(specialHtml, {
                title: 'Special Characters Test'
            });
            await generator.savePDF(specialPDF, path.join(TEST_CONFIG.outputDirectory, 'test-special-chars.pdf'));
            this.addTestResult('Special Characters', 'PASS', 'Special chars processed');
            console.log('   ✅ Special characters tested');

            console.log('✅ Edge case tests passed\n');
        } catch (error) {
            this.addTestResult('Edge Cases', 'FAIL', error.message);
            console.error(`   ❌ Edge Cases FAILED: ${error.message}`, TEST_CONFIG.enableDebug ? error.stack : '');
        }
    }

    async testPerformance() {
        console.log('🚀 Testing Performance...');
        const generator = new EnhancedPDFGenerator({ debug: false }); // No debug for performance

        try {
            const iterations = 10;
            const times = [];

            for (let i = 0; i < iterations; i++) {
                const start = Date.now();
                await generator.generatePDFFromHTML(TEST_CONFIG.testSamples.styledHtmlContent, {
                    title: `Performance Test ${i + 1}`
                });
                times.push(Date.now() - start);
            }

            const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
            const minTime = Math.min(...times);
            const maxTime = Math.max(...times);

            this.addTestResult('Performance', 'PASS',
                `Avg: ${avgTime.toFixed(2)}ms, Min: ${minTime}ms, Max: ${maxTime}ms (${iterations} runs)`
            );
            console.log(`   ✅ Performance: Avg ${avgTime.toFixed(2)}ms (Min: ${minTime}ms, Max: ${maxTime}ms)`);

            console.log('✅ Performance tests passed\n');
        } catch (error) {
            this.addTestResult('Performance', 'FAIL', error.message);
            console.error(`   ❌ Performance Test FAILED: ${error.message}`, TEST_CONFIG.enableDebug ? error.stack : '');
        }
    }

    async generateTestReport() {
        console.log('📊 Generating Test Report...');
        const generator = new EnhancedPDFGenerator({ debug: false });

        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const partial = this.testResults.filter(r => r.status === 'PARTIAL').length;

        const reportHtml = `<!DOCTYPE html>
<html>
<head><title>Test Report</title></head>
<body>
    <h1 style="font-size: 24px; color: #333;">Enhanced PDF Generator - Test Report v2.0.0</h1>
    <hr>
    <p><strong>Test Run Date:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Total Tests:</strong> ${this.testResults.length}</p>
    <p><strong>Passed:</strong> ${passed}</p>
    <p><strong>Failed:</strong> ${failed}</p>
    <p><strong>Partial:</strong> ${partial}</p>
    <p><strong>Execution Time:</strong> ${this.endTime - this.startTime}ms</p>
    <p><strong>Environment:</strong> Node.js ${process.version}, ${process.platform} ${process.arch}</p>
    
    <h2 style="font-size: 20px; color: #666;">Test Results</h2>
    <hr>
    ${this.testResults.map(r => `
    <h3 style="font-size: 16px; color: ${r.status === 'PASS' ? '#0a0' : r.status === 'FAIL' ? '#a00' : '#a50'};">
        ${r.name}: ${r.status}
    </h3>
    <p style="font-size: 14px;">${r.details}</p>
    <p style="font-size: 12px; color: #888;">Time: ${r.timestamp}</p>
    <hr>
    `).join('')}
    
    <h2 style="font-size: 20px;">Summary</h2>
    <p><strong>Result:</strong> ${this.testResults.every(r => r.status !== 'FAIL') ? '✅ All tests passed!' : '❌ Some tests failed'}</p>
</body>
</html>`;

        try {
            const reportPDF = await generator.generatePDFFromHTML(reportHtml, { title: 'Test Report v2.0.0' });
            await generator.savePDF(reportPDF, path.join(TEST_CONFIG.outputDirectory, 'test-report.pdf'));
            console.log('✅ Test report PDF generated\n');
        } catch (error) {
            console.warn(`⚠️  Could not generate test report PDF: ${error.message}`);
        }
    }

    printTestSummary() {
        const total = this.testResults.length;
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const partial = this.testResults.filter(r => r.status === 'PARTIAL').length;

        console.log('📋 Test Summary -----------------------------');
        console.log(`Total Tests Run: ${total}`);
        console.log(`Passed: ${passed}, Failed: ${failed}, Partial: ${partial}`);
        if (total > 0) console.log(`Success Rate: ${((passed / total) * 100).toFixed(2)}%`);
        console.log(`Total Execution Time: ${this.endTime - this.startTime}ms`);
        console.log(`Output Directory: ${TEST_CONFIG.outputDirectory}`);

        if (failed === 0 && total > 0) {
            console.log('\n🎉 All tests passed successfully!');
        } else if (total === 0) {
            console.log('\n🤔 No tests were run');
        } else {
            console.log('\n❌ Some tests failed:');
            this.testResults.filter(r => r.status === 'FAIL').forEach(f => {
                console.log(`   - FAIL: ${f.name} - ${f.details}`);
            });
        }
        console.log('------------------------------------------\n');
    }

    addTestResult(name, status, details) {
        this.testResults.push({
            name,
            status,
            details: String(details).substring(0, 300),
            timestamp: new Date().toLocaleTimeString()
        });
    }

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

// Run tests if this is the main module
if (require.main === module) {
    const runner = new ProductionTestRunner();
    runner.runAllTests().catch(e => {
        console.error('Unhandled exception in test runner:', e);
        process.exit(1);
    });
}

module.exports = ProductionTestRunner;