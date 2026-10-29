/**
 * Generates a beautiful 8-page sample brochure/magazine PDF
 * to allow immediate interactive testing of the Flipbook converter,
 * LTR/RTL reading modes, covers, and color filters.
 */

interface SamplePageContent {
  title: string;
  subtitle: string;
  body: string;
  isCover?: boolean;
  isBackCover?: boolean;
  bgGradient: [string, string];
  accentColor: string;
  tag: string;
}

const samplePagesData: SamplePageContent[] = [
  {
    title: 'HORIZONS',
    subtitle: 'MODERN ARCHITECTURE & SPATIAL DESIGN',
    body: 'Vol. XIV — Spring Edition\nA Curated Survey of Contemporary Monolithic Structures and Biophilic Spaces.',
    isCover: true,
    bgGradient: ['#0f172a', '#1e293b'],
    accentColor: '#f59e0b',
    tag: 'ANNUAL ISSUE',
  },
  {
    title: 'THE MONOLITH',
    subtitle: 'BRUTALISM REIMAGINED',
    body: 'Raw concrete meets refined natural timber. In the Scandinavian highlands, architects blend heavy geological mass with soaring double-height apertures that channel ambient northern daylight.',
    bgGradient: ['#18181b', '#27272a'],
    accentColor: '#38bdf8',
    tag: 'FEATURE · PAGE 02',
  },
  {
    title: 'LIGHT & VOID',
    subtitle: 'THE SACRED GEOMETRY OF PERFORATION',
    body: 'Shadows become materials as tangible as steel. Perforated aluminum mashrabiya facades generate dynamic geometric patterns across terracotta floors throughout the solar diurnal cycle.',
    bgGradient: ['#1c1917', '#292524'],
    accentColor: '#fbbf24',
    tag: 'FEATURE · PAGE 03',
  },
  {
    title: 'TACTILE TEXTURES',
    subtitle: 'ORGANIC MATERIALS IN URBAN SANCTUARIES',
    body: 'Travertine, hand-chiseled slate, and brushed patinated brass anchor the sensory journey. Minimalist living does not mean sterile surfaces—it elevates the grain and imperfection of raw earth.',
    bgGradient: ['#09090b', '#18181b'],
    accentColor: '#10b981',
    tag: 'MATERIALS · PAGE 04',
  },
  {
    title: 'BIOPHILIC LIVING',
    subtitle: 'BRINGING FORESTS INDOORS',
    body: 'Internal courtyard atriums featuring mature Japanese black pines, reflective moss gardens, and natural airflow cross-ventilation reduce energy footprint while calming the human nervous system.',
    bgGradient: ['#064e3b', '#065f46'],
    accentColor: '#34d399',
    tag: 'SUSTAINABILITY · PAGE 05',
  },
  {
    title: 'ACOUSTIC CALM',
    subtitle: 'ENGINEERING TRANQUILITY',
    body: 'Concealed acoustic slat baffles and micro-perforated wood veneers absorb reverberation in open-plan spaces, creating monastic listening rooms where every whisper resonates clearly.',
    bgGradient: ['#172554', '#1e3a8a'],
    accentColor: '#60a5fa',
    tag: 'ACOUSTICS · PAGE 06',
  },
  {
    title: 'THE HORIZON LINE',
    subtitle: 'CANTILEVERED RETREATS',
    body: 'Perched upon granite bluffs overlooking the North Pacific, post-tensioned concrete slabs extend 12 meters outward without ground columns, offering uninterrupted 270-degree ocean panoramas.',
    bgGradient: ['#312e81', '#3730a3'],
    accentColor: '#a78bfa',
    tag: 'ENGINEERING · PAGE 07',
  },
  {
    title: 'HORIZONS PRESS',
    subtitle: 'INDEX & COLOPHON',
    body: 'Published by Horizons Studio Ltd.\nStockholm · Tokyo · Dubai\nAll rights reserved. Printed on 180gsm recycled FSC matte paper.\nwww.horizons-magazine.example',
    isBackCover: true,
    bgGradient: ['#0f172a', '#020617'],
    accentColor: '#f59e0b',
    tag: 'BACK COVER',
  },
];

function renderPageToCanvas(page: SamplePageContent, pageNum: number, total: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  // A4 proportion: 800 x 1131
  canvas.width = 800;
  canvas.height = 1131;
  const ctx = canvas.getContext('2d')!;

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, page.bgGradient[0]);
  grad.addColorStop(1, page.bgGradient[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle architectural grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 60; x < canvas.width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 60);
    ctx.lineTo(x, canvas.height - 60);
    ctx.stroke();
  }
  for (let y = 60; y < canvas.height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(canvas.width - 60, y);
    ctx.stroke();
  }

  // Thin outer border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // Header tag
  ctx.font = '600 13px system-ui, sans-serif';
  ctx.fillStyle = page.accentColor;
  ctx.fillText(page.tag, 70, 90);

  // Folio / page number indicator
  ctx.font = '500 13px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  const pageStr = `${pageNum.toString().padStart(2, '0')} / ${total.toString().padStart(2, '0')}`;
  ctx.fillText(pageStr, canvas.width - 140, 90);

  // Accent divider
  ctx.fillStyle = page.accentColor;
  ctx.fillRect(70, 105, 48, 3);

  // If cover
  if (page.isCover) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 58px system-ui, sans-serif';
    ctx.fillText(page.title, 70, 320);

    ctx.font = '500 16px monospace';
    ctx.fillStyle = page.accentColor;
    ctx.fillText(page.subtitle, 70, 365);

    // Architectural geometric centerpiece
    ctx.save();
    ctx.translate(canvas.width / 2, 600);
    ctx.strokeStyle = page.accentColor;
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.rotate((Math.PI / 2) * i + 0.2);
      ctx.strokeRect(-120, -120, 240, 240);
    }
    ctx.restore();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '400 18px system-ui, sans-serif';
    const lines = page.body.split('\n');
    lines.forEach((line, idx) => {
      ctx.fillText(line, 70, 900 + idx * 28);
    });
  } else if (page.isBackCover) {
    // Back cover layout
    ctx.save();
    ctx.translate(canvas.width / 2, 420);
    ctx.fillStyle = page.accentColor;
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('H·Z', 0, 8);
    ctx.restore();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(page.title, canvas.width / 2, 540);

    ctx.font = '500 14px monospace';
    ctx.fillStyle = page.accentColor;
    ctx.fillText(page.subtitle, canvas.width / 2, 575);

    ctx.font = '400 16px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const lines = page.body.split('\n');
    lines.forEach((line, idx) => {
      ctx.fillText(line, canvas.width / 2, 660 + idx * 30);
    });

    // Barcode simulation
    const barcodeX = canvas.width / 2 - 100;
    const barcodeY = 880;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(barcodeX - 10, barcodeY - 10, 220, 70);
    ctx.fillStyle = '#000000';
    for (let b = 0; b < 200; b += Math.floor(Math.random() * 5 + 3)) {
      ctx.fillRect(barcodeX + b, barcodeY, Math.random() > 0.5 ? 2 : 1, 45);
    }
    ctx.fillStyle = '#000000';
    ctx.font = '10px monospace';
    ctx.fillText('9 780201 379624', canvas.width / 2, barcodeY + 55);
  } else {
    // Interior Spread page
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 38px system-ui, sans-serif';
    ctx.fillText(page.title, 70, 210);

    ctx.font = '600 14px monospace';
    ctx.fillStyle = page.accentColor;
    ctx.fillText(page.subtitle, 70, 245);

    // Artistic visual container
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.fillRect(70, 290, canvas.width - 140, 360);
    ctx.strokeRect(70, 290, canvas.width - 140, 360);

    // Geometric pattern inside frame
    ctx.save();
    ctx.translate(canvas.width / 2, 470);
    ctx.strokeStyle = page.accentColor;
    ctx.lineWidth = 1.5;
    for (let r = 20; r <= 140; r += 24) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-150, 0);
    ctx.lineTo(150, 0);
    ctx.moveTo(0, -150);
    ctx.lineTo(0, 150);
    ctx.stroke();
    ctx.restore();

    // Body text formatted into 2 clean columns
    ctx.font = '400 17px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';

    const words = page.body.split(' ');
    let line = '';
    let y = 700;
    const maxWidth = canvas.width - 140;
    const lineHeight = 28;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 70, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 70, y);

    // Callout quote
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(70, y + 40, canvas.width - 140, 90);
    ctx.fillStyle = page.accentColor;
    ctx.fillRect(70, y + 40, 4, 90);

    ctx.font = 'italic 16px serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`“Design is not merely aesthetic ornamentation; it is the physical architecture of thought.”`, 95, y + 90);
  }

  return canvas;
}

/**
 * Builds a valid, lightweight PDF file containing 8 rendered pages.
 */
export async function createSamplePdfFile(): Promise<File> {
  const canvases = samplePagesData.map((data, idx) =>
    renderPageToCanvas(data, idx + 1, samplePagesData.length)
  );

  // Convert each canvas to JPEG binary data
  const jpegBlobs: ArrayBuffer[] = [];
  for (const canvas of canvases) {
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.85);
    });
    jpegBlobs.push(await blob.arrayBuffer());
  }

  // Construct PDF 1.4 binary structure
  const pdfParts: (string | Uint8Array)[] = [];
  const offsets: number[] = [];
  let currentOffset = 0;

  function write(chunk: string | Uint8Array) {
    const bytes = typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk;
    pdfParts.push(bytes);
    currentOffset += bytes.length;
  }

  function startObj(objNum: number) {
    offsets[objNum] = currentOffset;
    write(`${objNum} 0 obj\n`);
  }

  function endObj() {
    write('endobj\n');
  }

  // PDF Header
  write('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

  const totalPages = canvases.length;
  // Obj 1: Catalog
  startObj(1);
  write('<< /Type /Catalog /Pages 2 0 R >>\n');
  endObj();

  // Obj 2: Pages root
  const pageObjRefs: string[] = [];
  for (let i = 0; i < totalPages; i++) {
    pageObjRefs.push(`${3 + i * 3} 0 R`);
  }
  startObj(2);
  write(`<< /Type /Pages /Kids [${pageObjRefs.join(' ')}] /Count ${totalPages} >>\n`);
  endObj();

  // For each page:
  // Obj (3 + i*3): Page dictionary
  // Obj (4 + i*3): Content stream
  // Obj (5 + i*3): Image XObject
  for (let i = 0; i < totalPages; i++) {
    const pageObjNum = 3 + i * 3;
    const contentObjNum = 4 + i * 3;
    const imgObjNum = 5 + i * 3;
    const jpegData = new Uint8Array(jpegBlobs[i]);
    const canvas = canvases[i];

    // Page Object
    startObj(pageObjNum);
    write(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${canvas.width} ${canvas.height}] ` +
      `/Contents ${contentObjNum} 0 R ` +
      `/Resources << /XObject << /Im0 ${imgObjNum} 0 R >> /ProcSet [/PDF /ImageC] >> >>\n`
    );
    endObj();

    // Content Stream (Draw Image)
    const contentStream = `q\n${canvas.width} 0 0 ${canvas.height} 0 0 cm\n/Im0 Do\nQ\n`;
    const contentBytes = new TextEncoder().encode(contentStream);
    startObj(contentObjNum);
    write(`<< /Length ${contentBytes.length} >>\nstream\n`);
    write(contentBytes);
    write('\nendstream\n');
    endObj();

    // Image XObject (JPEG pass-through)
    startObj(imgObjNum);
    write(
      `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegData.length} >>\nstream\n`
    );
    write(jpegData);
    write('\nendstream\n');
    endObj();
  }

  // Cross-reference table (xref)
  const xrefOffset = currentOffset;
  const totalObjects = 2 + totalPages * 3;
  write(`xref\n0 ${totalObjects + 1}\n`);
  write('0000000000 65535 f \n');
  for (let i = 1; i <= totalObjects; i++) {
    const offsetStr = offsets[i].toString().padStart(10, '0');
    write(`${offsetStr} 00000 n \n`);
  }

  // Trailer
  write(`trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const combinedBlob = new Blob(pdfParts as BlobPart[], { type: 'application/pdf' });
  return new File([combinedBlob], 'Architecture_Design_Portfolio.pdf', {
    type: 'application/pdf',
    lastModified: Date.now(),
  });
}
