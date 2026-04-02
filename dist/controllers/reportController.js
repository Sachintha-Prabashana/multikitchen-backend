import * as reportService from '../services/reportService.js';
import { generatePDF, generateExcel } from '../utils/reportGenerator.js';
export const getStockReport = async (req, res) => {
    try {
        const report = await reportService.getStockAnalytics();
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
export const getAggregatedReport = async (req, res) => {
    try {
        const report = await reportService.getAggregatedAnalytics();
        res.json(report);
    }
    catch (error) {
        console.error('Aggregated report error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
export const getDailyReport = async (req, res) => {
    try {
        const report = await reportService.getDailyAnalytics(req.query.date);
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
export const getMonthlyReport = async (req, res) => {
    try {
        const report = await reportService.getMonthlyAnalytics(req.query.year, req.query.month);
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
export const exportStockReport = async (req, res) => {
    const { format, reportType = 'STOCK', periodType = 'DAILY', dateValue = new Date() } = req.query;
    try {
        let headers, data, title;
        if (reportType === 'TRANSACTIONS') {
            title = `${periodType} Transaction Report (${new Date(dateValue).toLocaleDateString()})`;
            headers = ['Date', 'Item Name', 'Operation', 'Quantity', 'Recipient/By', 'Total Value'];
            data = await reportService.getTransactionsReportData(periodType, dateValue);
        }
        else {
            title = `Stock Inventory Summary (${new Date().toLocaleDateString()})`;
            const { items } = await reportService.getStockAnalytics();
            headers = ['ID', 'Brand', 'Name', 'Barcode', 'Buy', 'Sell', 'Stock', 'Min'];
            data = items.map(i => [i.item_id, i.brand?.name || 'GENERIC', i.item_name, i.barcode || '-', i.buying_price, i.selling_price, i.quantity, i.min_quantity]);
        }
        if (format === 'pdf') {
            const buffer = generatePDF(title, headers, data);
            res.contentType('application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Report-${Date.now()}.pdf`);
            return res.send(Buffer.from(buffer));
        }
        else if (format === 'excel') {
            const buffer = await generateExcel(reportType, headers, data);
            res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Report-${Date.now()}.xlsx`);
            return res.send(buffer);
        }
        res.status(400).json({ error: 'Invalid format' });
    }
    catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Server error during report generation' });
    }
};
export const exportIssueSlip = async (req, res) => {
    const { items, workerName } = req.body;
    try {
        const title = `Official Issue Slip: ${workerName || 'Staff Member'}`;
        const headers = ['#', 'Brand', 'Item Name', 'Quantity', 'Unit'];
        const data = items.map((i, idx) => [idx + 1, i.brand?.name || 'GENERIC', i.item_name, i.quantity, 'Units']);
        const buffer = generatePDF(title, headers, data, true);
        res.contentType('application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=IssueSlip-${Date.now()}.pdf`);
        return res.send(Buffer.from(buffer));
    }
    catch (error) {
        console.error('Issue slip error:', error);
        res.status(500).json({ error: 'Server error during slip generation' });
    }
};
