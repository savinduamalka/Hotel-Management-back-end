import MenuCategory from '../models/menuCategoryModel.js';
import { checkAdmin } from './userController.js';

export async function addMenuData(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!checkAdmin(req)) {
      return res.status(403).json({ message: 'Admin privileges required' });
    }

    const data = req.body; 
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const categoryNames = Object.keys(data);
    const results = [];

    for (const categoryName of categoryNames) {
      const rawItems = data[categoryName];
      if (!Array.isArray(rawItems)) continue;

      const items = rawItems.map((it) => ({
        id: it.id, 
        name: it.Name,
        smallPrice: it['s:price'],
        largePrice: it['l:price'],
        image: it.image || '',
        hot: !!it.hot,
      }));

      const updated = await MenuCategory.findOneAndUpdate(
        { name: categoryName },
        { name: categoryName, items },
        { new: true, upsert: true, runValidators: true }
      );
      results.push(updated);
    }

    res.status(201).json({ message: 'Menu data saved', categories: results });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}