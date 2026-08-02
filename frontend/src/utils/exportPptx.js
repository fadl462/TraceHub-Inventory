import PptxGenJS from 'pptxgenjs';

const BRAND_NAVY = '1A4D8F';
const BRAND_LIGHT = 'F4F7FA';

/**
 * Builds a presentation-ready .pptx and triggers a download - entirely in
 * the browser, no backend service required. Produces a title slide plus one
 * table slide per section, so a company admin can hand this straight to
 * their leadership without reformatting anything.
 *
 * @param {string} filename - without extension
 * @param {string} title
 * @param {string} [subtitle]
 * @param {Array<{ heading: string, columns: string[], rows: (string|number)[][] }>} sections
 */
export function exportToPptx(filename, title, subtitle, sections) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'TRACEHUB', width: 10, height: 5.63 });
  pptx.layout = 'TRACEHUB';

  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: BRAND_NAVY };
  titleSlide.addText('TraceHub Inventory', {
    x: 0.5, y: 1.6, w: 9, h: 0.5, fontSize: 14, color: 'FFFFFF', bold: true, fontFace: 'Arial',
  });
  titleSlide.addText(title, {
    x: 0.5, y: 2.1, w: 9, h: 0.9, fontSize: 28, color: 'FFFFFF', bold: true, fontFace: 'Arial',
  });
  if (subtitle) {
    titleSlide.addText(subtitle, {
      x: 0.5, y: 2.95, w: 9, h: 0.4, fontSize: 14, color: 'CBD9EE', fontFace: 'Arial',
    });
  }
  titleSlide.addText(`Generated ${new Date().toLocaleDateString()}`, {
    x: 0.5, y: 5.05, w: 9, h: 0.3, fontSize: 10, color: '8FAFD4', fontFace: 'Arial',
  });

  // One table slide per section
  sections.forEach((section) => {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };
    slide.addText(section.heading, {
      x: 0.4, y: 0.3, w: 9.2, h: 0.5, fontSize: 20, color: BRAND_NAVY, bold: true, fontFace: 'Arial',
    });

    const headerRow = section.columns.map((c) => ({
      text: c,
      options: { fill: { color: BRAND_NAVY }, color: 'FFFFFF', bold: true, fontSize: 11 },
    }));
    const bodyRows = section.rows.slice(0, 14).map((row, i) => row.map((cell) => ({
      text: String(cell ?? ''),
      options: { fill: { color: i % 2 === 0 ? 'FFFFFF' : BRAND_LIGHT }, fontSize: 10, color: '2C2C2C' },
    })));

    slide.addTable([headerRow, ...bodyRows], {
      x: 0.4, y: 1.0, w: 9.2, h: 4.2, fontFace: 'Arial', border: { type: 'solid', color: 'E6ECF4', pt: 0.5 }, autoPage: false,
    });

    if (section.rows.length > 14) {
      slide.addText(`+ ${section.rows.length - 14} more rows — see the full CSV export for the complete dataset.`, {
        x: 0.4, y: 5.25, w: 9.2, h: 0.3, fontSize: 9, italic: true, color: '8A8A8A', fontFace: 'Arial',
      });
    }
  });

  pptx.writeFile({ fileName: filename.endsWith('.pptx') ? filename : `${filename}.pptx` });
}
