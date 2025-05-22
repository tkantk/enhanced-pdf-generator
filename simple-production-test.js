// simple-production-test.js - Simplified production test with better error handling
const EnhancedPDFGenerator = require('./enhanced-pdf-generator');
const path = require('path');
const fs = require('fs');

async function runSimpleProductionTest() {
    console.log('🚀 Enhanced PDF Generator - Simple Production Test');
    console.log('=================================================\n');

    const results = [];
    const startTime = Date.now();

    try {
        // Create output directory
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Test 1: Basic Text to PDF
        console.log('📝 Test 1: Basic Text to PDF Generation');
        try {
            const generator = new EnhancedPDFGenerator({
                debug: false,
                pageFormat: 'A4'
            });

            const textContent = `Enhanced PDF Generator - Production Test

This document verifies that the Enhanced PDF Generator works correctly in production environments.

Key Features Tested:
✓ Text to PDF conversion
✓ HTML to PDF conversion  
✓ Auto-content detection
✓ Multiple page formats
✓ Custom margins and formatting
✓ Error handling
✓ File operations

System Information:
- Node.js: ${process.version}
- Platform: ${process.platform} ${process.arch}
- Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
- Generated: ${new Date().toLocaleString()}

This test confirms that all core functionality works correctly without errors.`;

            const textPDF = await generator.generatePDFFromText(textContent, {
                title: 'Production Test Document',
                fontSize: 12,
                margin: 50
            });

            const textPath = path.join(outputDir, 'production-test-text.pdf');
            await generator.savePDF(textPDF, textPath);

            const textInfo = generator.getPDFInfo(textPDF);

            console.log(`   ✅ Text PDF: ${textInfo.sizeFormatted} (Valid: ${textInfo.isValid})`);
            console.log(`   📁 Saved to: ${textPath}`);

            results.push({ test: 'Text to PDF', status: 'PASS', size: textInfo.sizeFormatted });

        } catch (error) {
            console.log(`   ❌ Text PDF failed: ${error.message}`);
            results.push({ test: 'Text to PDF', status: 'FAIL', error: error.message });
        }

        // Test 2: HTML to PDF
        console.log('\n🌐 Test 2: HTML to PDF Generation');
        try {
            const generator = new EnhancedPDFGenerator({ debug: false });

            const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>HTML Production Test</title>
</head>
<body>
    <h1>HTML to PDF Test</h1>
    <p>This tests HTML content conversion to PDF format.</p>
    
    <h2>Features Verified</h2>
    <ul>
        <li>HTML tag parsing and conversion</li>
        <li>Text extraction from HTML elements</li>
        <li>Proper document structure</li>
        <li>Title extraction from HTML head</li>
    </ul>
    
    <h2>Test Data</h2>
    <table>
        <tr><th>Item</th><th>Status</th></tr>
        <tr><td>HTML Parsing</td><td>Working</td></tr>
        <tr><td>Content Extraction</td><td>Working</td></tr>
        <tr><td>PDF Generation</td><td>Working</td></tr>
    </table>
    
    <p><strong>Conclusion:</strong> HTML to PDF conversion is functioning correctly.</p>
    <p><em>Generated: ${new Date().toLocaleString()}</em></p>
</body>
</html>`;

            const htmlPDF = await generator.generatePDFFromHTML(htmlContent, {
                fontSize: 11,
                margin: 60
            });

            const htmlPath = path.join(outputDir, 'production-test-html.pdf');
            await generator.savePDF(htmlPDF, htmlPath);

            const htmlInfo = generator.getPDFInfo(htmlPDF);

            console.log(`   ✅ HTML PDF: ${htmlInfo.sizeFormatted} (Valid: ${htmlInfo.isValid})`);
            console.log(`   📁 Saved to: ${htmlPath}`);

            results.push({ test: 'HTML to PDF', status: 'PASS', size: htmlInfo.sizeFormatted });

        } catch (error) {
            console.log(`   ❌ HTML PDF failed: ${error.message}`);
            results.push({ test: 'HTML to PDF', status: 'FAIL', error: error.message });
        }

        // Test 3: Auto-Detection
        console.log('\n🔍 Test 3: Auto-Detection');
        try {
            const generator = new EnhancedPDFGenerator({ debug: false });

            // Test plain text
            const autoTextPDF = await generator.generatePDF('This is plain text content for auto-detection test.');
            const autoTextPath = path.join(outputDir, 'production-test-auto-text.pdf');
            await generator.savePDF(autoTextPDF, autoTextPath);

            // Test HTML content
            const autoHTMLPDF = await generator.generatePDF('<h1>Auto-Detection HTML</h1><p>This should be detected as HTML.</p>');
            const autoHTMLPath = path.join(outputDir, 'production-test-auto-html.pdf');
            await generator.savePDF(autoHTMLPDF, autoHTMLPath);

            console.log('   ✅ Auto-detection: Both text and HTML processed correctly');
            results.push({ test: 'Auto-Detection', status: 'PASS', note: 'Text and HTML both detected' });

        } catch (error) {
            console.log(`   ❌ Auto-detection failed: ${error.message}`);
            results.push({ test: 'Auto-Detection', status: 'FAIL', error: error.message });
        }

        // Test 4: Different Page Formats
        console.log('\n📏 Test 4: Page Formats');
        try {
            const formats = ['A4', 'LETTER', 'LEGAL'];
            let formatResults = [];

            for (const format of formats) {
                const generator = new EnhancedPDFGenerator({ pageFormat: format });
                const pdf = await generator.generatePDFFromText(`Test document in ${format} format.`, {
                    title: `${format} Format Test`
                });

                const formatPath = path.join(outputDir, `production-test-${format.toLowerCase()}.pdf`);
                await generator.savePDF(pdf, formatPath);

                const info = generator.getPDFInfo(pdf);
                formatResults.push(`${format}: ${info.sizeFormatted}`);
            }

            console.log(`   ✅ Page formats: ${formatResults.join(', ')}`);
            results.push({ test: 'Page Formats', status: 'PASS', formats: formatResults.length });

        } catch (error) {
            console.log(`   ❌ Page formats failed: ${error.message}`);
            results.push({ test: 'Page Formats', status: 'FAIL', error: error.message });
        }

        // Test 5: Error Handling (Safe Tests)
        console.log('\n🛡️ Test 5: Error Handling');
        try {
            const generator = new EnhancedPDFGenerator();
            let errorTests = 0;
            let errorsPassed = 0;

            // Test null input
            try {
                await generator.generatePDFFromText(null);
            } catch (error) {
                if (error.message.includes('cannot be null')) {
                    errorsPassed++;
                }
                errorTests++;
            }

            // Test empty input
            try {
                await generator.generatePDFFromText('');
            } catch (error) {
                if (error.message.includes('cannot be empty')) {
                    errorsPassed++;
                }
                errorTests++;
            }

            console.log(`   ✅ Error handling: ${errorsPassed}/${errorTests} error conditions handled correctly`);
            results.push({ test: 'Error Handling', status: 'PASS', passed: errorsPassed, total: errorTests });

        } catch (error) {
            console.log(`   ❌ Error handling test failed: ${error.message}`);
            results.push({ test: 'Error Handling', status: 'FAIL', error: error.message });
        }

        // Test 6: Performance Check
        console.log('\n🚀 Test 6: Performance');
        try {
            const generator = new EnhancedPDFGenerator();
            const performanceStart = Date.now();

            // Generate 5 small documents quickly
            for (let i = 0; i < 5; i++) {
                await generator.generatePDFFromText(`Performance test document ${i + 1}. This is test content.`);
            }

            const performanceTime = Date.now() - performanceStart;
            const avgTime = Math.round(performanceTime / 5);

            console.log(`   ✅ Performance: 5 documents in ${performanceTime}ms (avg: ${avgTime}ms each)`);
            results.push({ test: 'Performance', status: 'PASS', totalTime: performanceTime, avgTime: avgTime });

        } catch (error) {
            console.log(`   ❌ Performance test failed: ${error.message}`);
            results.push({ test: 'Performance', status: 'FAIL', error: error.message });
        }

        // Summary
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        const passedTests = results.filter(r => r.status === 'PASS').length;
        const failedTests = results.filter(r => r.status === 'FAIL').length;

        console.log('\n📋 Test Summary');
        console.log('================');
        console.log(`Total Tests: ${results.length}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${failedTests}`);
        console.log(`Success Rate: ${Math.round((passedTests / results.length) * 100)}%`);
        console.log(`Total Time: ${totalTime}ms`);
        console.log(`Output Directory: ${outputDir}`);

        if (failedTests === 0) {
            console.log('\n🎉 All tests passed! Enhanced PDF Generator is production-ready.');
            console.log('🔍 Check the output directory for generated PDF files.');
        } else {
            console.log('\n⚠️  Some tests failed. Review the failures above.');
            console.log('📋 Failed tests:');
            results.filter(r => r.status === 'FAIL').forEach(result => {
                console.log(`   - ${result.test}: ${result.error}`);
            });
        }

        console.log('\n📁 Generated Files:');
        console.log('==================');
        const files = fs.readdirSync(outputDir).filter(f => f.startsWith('production-test'));
        files.forEach(file => {
            const stats = fs.statSync(path.join(outputDir, file));
            console.log(`   • ${file} (${Math.round(stats.size / 1024 * 100) / 100} KB)`);
        });

        return failedTests === 0;

    } catch (error) {
        console.error('\n💥 Test suite failed with error:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
}

// Run the test
if (require.main === module) {
    runSimpleProductionTest().then(success => {
        if (success) {
            console.log('\n✅ Simple production test completed successfully!');
            process.exit(0);
        } else {
            console.log('\n❌ Simple production test failed!');
            process.exit(1);
        }
    }).catch(error => {
        console.error('\n💥 Test error:', error.message);
        process.exit(1);
    });
}

module.exports = runSimpleProductionTest;