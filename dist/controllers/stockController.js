import * as stockService from '../services/stockService.js';
export const issue = async (req, res) => {
    try {
        const result = await stockService.issueStock(req.body.item_id, req.body.quantity, req.user.id);
        res.json({ message: 'Stock issued successfully', ...result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const batchIssue = async (req, res) => {
    try {
        const { items, worker_name } = req.body;
        if (!items || !Array.isArray(items))
            throw new Error('Items array is required');
        const result = await stockService.batchIssueStock(items, worker_name, req.user.id);
        res.json({ message: 'Batch stock issued successfully', result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const batchReceive = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items))
            throw new Error('Items array is required');
        const result = await stockService.batchReceiveStock(items, req.user.id);
        res.json({ message: 'Batch stock received successfully', result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const receive = async (req, res) => {
    try {
        const result = await stockService.receiveStock(req.body.item_id, req.body.quantity, req.user.id);
        res.json({ message: 'Stock received successfully', ...result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getHistory = async (req, res) => {
    try {
        const history = await stockService.getTransactionHistory();
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
export const getLowStock = async (req, res) => {
    try {
        const lowStock = await stockService.getLowStockItems();
        res.json(lowStock);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
