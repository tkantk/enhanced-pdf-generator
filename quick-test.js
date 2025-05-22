// quick-test.js - Quick test to verify the fix
const EnhancedPDFGenerator = require('./enhanced-pdf-generator');
const fs = require('fs');
const path = require('path');

async function quickTest() {
    console.log('🔧 Quick Test - Enhanced PDF Generator Fix');
    console.log('==========================================\n');

    try {
        // Create output directory
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Initialize generator with debug mode
        const generator = new EnhancedPDFGenerator({
            debug: true,
            pageFormat: 'A4',
            fontSize: 12
        });

        console.log('📝 Test 1: Simple text to PDF...');

        const testText = `Enhanced PDF Generator - Quick Test

This is a simple test to verify the PDF generator creates valid PDFs.

Key points:
- PDF structure validation
- Proper object references  
- Valid xref table
- Correct content streams

If you can open this PDF without errors, the fix worked!

Generated: ${new Date().toLocaleString()}
Test ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Generate PDF
        const pdf = await generator.generatePDFFromText(testText, {
            title: 'Quick Test Document',
            fontSize: 12,
            margin: 50
        });

        console.log(`✅ PDF generated: ${pdf.length} bytes`);

        // Save PDF
        const filePath = path.join(outputDir, 'quick-test-fix.pdf');
        await generator.savePDF(pdf, filePath);
        console.log(`✅ PDF saved: ${filePath}`);

        // Validate PDF
        const info = generator.getPDFInfo(pdf);
        console.log(`✅ PDF info:`, {
            size: info.sizeFormatted,
            version: info.version,
            isValid: info.isValid
        });

        if (info.isValid) {
            console.log('\n🎉 SUCCESS! PDF validation passed.');
            console.log('🔍 Try opening the generated PDF to verify it works.');
        } else {
            console.log('\n❌ FAILED! PDF validation failed.');
            console.log('📋 Check the debug logs above for details.');
        }

        // Get generator statistics
        const stats = generator.getStatistics();
        console.log('\n📊 Generator Statistics:');
        console.log(`   Documents generated: ${stats.documentsGenerated}`);
        console.log(`   Processing time: ${stats.totalProcessingTime}ms`);
        console.log(`   Memory usage: ${Math.round(stats.memoryUsage.heapUsed / 1024 / 1024)}MB`);

        return info.isValid;

    } catch (error) {
        console.error('❌ Quick test failed:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
}

// Run quick test
if (require.main === module) {
    quickTest().then(success => {
        if (success) {
            console.log('\n✅ Quick test completed successfully!');
            process.exit(0);
        } else {
            console.log('\n❌ Quick test failed!');
            process.exit(1);
        }
    }).catch(error => {
        console.error('\n💥 Test error:', error.message);
        process.exit(1);
    });
}

module.exports = quickTest;