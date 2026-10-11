import { jsPDF } from 'jspdf';

const TYPE_LABEL = {
  'clinical-note': 'Clinical Note',
  'lab-explainer': 'Lab Explainer',
  triage: 'Smart Triage',
  'medication-check': 'Medication Check',
  'resource-forecast': 'Resource Forecast',
};

function flatten(obj, prefix = '', lines = []) {
  if (obj === null || obj === undefined) return lines;
  if (typeof obj !== 'object') {
    lines.push([prefix.trim(), String(obj)]);
    return lines;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      if (typeof item === 'object') {
        lines.push([`${prefix.trim()} [${i + 1}]`, '']);
        flatten(item, '  ', lines);
      } else {
        lines.push([`${prefix.trim()} [${i + 1}]`, String(item)]);
      }
    });
    return lines;
  }
  Object.entries(obj).forEach(([k, v]) => {
    const label = prefix ? `${prefix.trim()} → ${k}` : k;
    if (typeof v === 'object' && v !== null) {
      flatten(v, '  ', lines);
    } else {
      lines.push([label, String(v)]);
    }
  });
  return lines;
}

export function exportTaskPDF(task) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  // Header bar
  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, pageWidth, 80, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('MediCode', margin, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 190);
  doc.text('AI Healthcare Copilot', margin, 58);

  doc.text(
    new Date(task.createdAt).toLocaleString(),
    pageWidth - margin,
    40,
    { align: 'right' }
  );

  y = 110;

  // Title
  doc.setTextColor(20, 20, 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(TYPE_LABEL[task.type] || task.type, margin, y);
  y += 22;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 100);
  const titleLines = doc.splitTextToSize(task.title || '', pageWidth - margin * 2);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 14 + 10;

  // Severity badge
  const sev = task.severity || 'low';
  const sevColors = {
    low: [34, 197, 94],
    medium: [245, 158, 11],
    high: [249, 115, 22],
    critical: [239, 68, 68],
  };
  const col = sevColors[sev] || sevColors.low;
  doc.setFillColor(...col);
  doc.roundedRect(margin, y, 80, 20, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(sev.toUpperCase(), margin + 40, y + 14, { align: 'center' });
  y += 40;

  // Divider
  doc.setDrawColor(220, 220, 225);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Body — flatten output
  const lines = flatten(task.output || {});
  doc.setFontSize(10);

  lines.forEach(([key, value]) => {
    if (y > pageHeight - margin - 20) {
      doc.addPage();
      y = margin;
    }

    if (!value) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 90);
      doc.text(key, margin, y);
      y += 16;
      return;
    }

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 70);
    doc.text(key, margin, y);

    doc.setTextColor(20, 20, 25);
    const wrapped = doc.splitTextToSize(value, pageWidth - margin * 2 - 150);
    doc.text(wrapped, margin + 150, y);
    y += Math.max(16, wrapped.length * 13);
  });

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 160);
    doc.text(
      `MediCode · ${task._id?.slice(-8) || ''} · Page ${i} of ${pages}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );
  }

  doc.save(`medicode-${task.type}-${Date.now()}.pdf`);
}