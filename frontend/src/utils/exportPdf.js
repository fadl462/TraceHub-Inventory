import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Builds a clean, branded PDF report and triggers a download - entirely in
 * the browser, no backend service required (same approach as exportToCsv).
 *
 * @param {string} filename - without extension
 * @param {string} title - report title, shown at the top of page 1
 * @param {string} [subtitle] - e.g. company name / date range
 * @param {Array<{ heading: string, columns: string[], rows: (string|number)[][] }>} sections
 */
export function exportToPdf(filename, title, subtitle, sections) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 40;
  let cursorY = 50;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(26, 77, 143); // TraceHub brand navy
  doc.text('TraceHub Inventory', marginX, cursorY);

  cursorY += 26;
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text(title, marginX, cursorY);

  if (subtitle) {
    cursorY += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, marginX, cursorY);
  }

  cursorY += 12;
  doc.setDrawColor(230, 236, 244);
  doc.line(marginX, cursorY, doc.internal.pageSize.getWidth() - marginX, cursorY);
  cursorY += 20;

  sections.forEach((section) => {
    if (section.heading) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text(section.heading, marginX, cursorY);
      cursorY += 8;
    }
    autoTable(doc, {
      startY: cursorY,
      head: [section.columns],
      body: section.rows,
      margin: { left: marginX, right: marginX },
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [26, 77, 143], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [244, 247, 250] },
      didDrawPage: (data) => { cursorY = data.cursor.y; },
    });
    cursorY = doc.lastAutoTable.finalY + 24;
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated ${new Date().toLocaleString()} \u00b7 Page ${i} of ${pageCount}`,
      marginX,
      doc.internal.pageSize.getHeight() - 20,
    );
  }

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
