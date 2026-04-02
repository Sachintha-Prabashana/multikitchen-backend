import * as itemService from '../services/itemService.js';
export const getItems = async (req, res) => {
    try {
        const items = await itemService.getAllItems();
        res.json(items);
    }
    catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
export const createItem = async (req, res) => {
    try {
        const item = await itemService.createNewItem(req.body);
        res.status(201).json(item);
    }
    catch (error) {
        console.error('Create item error:', error);
        res.status(400).json({ error: error.message || 'Invalid data' });
    }
};
export const updateItem = async (req, res) => {
    try {
        const item = await itemService.updateExistingItem(req.params.id, req.body);
        res.json(item);
    }
    catch (error) {
        console.error('Update item error:', error);
        res.status(400).json({ error: error.message || 'Update failed' });
    }
};
export const deleteItem = async (req, res) => {
    try {
        await itemService.deleteExistingItem(req.params.id);
        res.json({ message: 'Item deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'Deletion failed' });
    }
};
