import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

export const generatePDF = (title, headers, data, showSignatures = false) => {
  const doc = new jsPDF();
  
  // BRANDING HEADER
  doc.setFontSize(22);
  doc.setTextColor(26, 26, 26);
  doc.setFont("helvetica", "bold");
  doc.text("MultiKitchen ", 14, 20);
  doc.setTextColor(193, 91, 50); // Brand Orange
  doc.text("Pvt Ltd.", 70, 20);
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text("Industrial Kitchen & Warehouse Solutions", 14, 26);
  doc.text("Developed by SPSolutions | prabashana.se@gmail.com", 14, 30);

  // TITLE & DATE
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 26);
  doc.text(title, 14, 45);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 52);

  // TABLE
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 60,
    theme: 'grid',
    headStyles: { 
      fillColor: [26, 26, 26], 
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold'
    },
    styles: { fontSize: 8, cellPadding: 3 },
    alternateRowStyles: { fillColor: [250, 250, 250] }
  });

  // SIGNATURES
  if (showSignatures) {
    const finalY = doc.lastAutoTable.finalY + 30;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Left Signature
    doc.line(14, finalY, 80, finalY);
    doc.text("Accepted By (Recipient Signature)", 14, finalY + 5);
    
    // Right Signature
    doc.line(130, finalY, 196, finalY);
    doc.text("Authorized Signature/Stamp", 130, finalY + 5);
  }

  return doc.output('arraybuffer');
};

export const generateExcel = async (sheetName, headers, data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  worksheet.addRow(headers);
  data.forEach(row => worksheet.addRow(row));
  
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
