import * as brandService from '../services/brandService.js';
export const getBrands = async (req, res) => {
    try {
        const brands = await brandService.getBrands();
        res.status(200).json(brands);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Brand name is required' });
        }
        const brand = await brandService.createBrand(name);
        res.status(201).json(brand);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
