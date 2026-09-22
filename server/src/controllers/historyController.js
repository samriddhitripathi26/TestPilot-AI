const { localDb, isUsingMongo } = require('../config/db');
const TestGeneration = require('../models/TestGeneration');

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, language, favorite } = req.query;

    if (isUsingMongo()) {
      const query = { userId };
      if (search) {
        query.$or = [
          { functionName: { $regex: search, $options: 'i' } },
          { sourceCode: { $regex: search, $options: 'i' } },
          { language: { $regex: search, $options: 'i' } }
        ];
      }
      if (language && language !== 'all') {
        query.language = new RegExp(`^${language}$`, 'i');
      }
      if (favorite === 'true') {
        query.isFavorite = true;
      }

      const items = await TestGeneration.find(query)
        .sort({ createdAt: -1 })
        .limit(100)
        .select('-sourceCode'); // Exclude large source code for list efficiency

      return res.json({ items });
    } else {
      const items = localDb.getGenerations(userId, {
        search,
        language,
        isFavorite: favorite === 'true' ? true : undefined
      });
      return res.json({ items });
    }
  } catch (err) {
    console.error('[History Controller Error]:', err);
    res.status(500).json({ error: 'Failed to fetch test generation history.' });
  }
};

const getHistoryItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (isUsingMongo()) {
      const item = await TestGeneration.findOne({ _id: id, userId });
      if (!item) {
        return res.status(404).json({ error: 'Test generation record not found.' });
      }
      return res.json({ item });
    } else {
      const item = localDb.getGenerationById(id, userId);
      if (!item) {
        return res.status(404).json({ error: 'Test generation record not found.' });
      }
      return res.json({ item });
    }
  } catch (err) {
    console.error('[History Item Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve test generation.' });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (isUsingMongo()) {
      const item = await TestGeneration.findOne({ _id: id, userId });
      if (!item) {
        return res.status(404).json({ error: 'Record not found.' });
      }
      item.isFavorite = !item.isFavorite;
      await item.save();
      return res.json({ success: true, isFavorite: item.isFavorite });
    } else {
      const item = localDb.getGenerationById(id, userId);
      if (!item) {
        return res.status(404).json({ error: 'Record not found.' });
      }
      const updated = localDb.updateGeneration(id, userId, { isFavorite: !item.isFavorite });
      return res.json({ success: true, isFavorite: updated.isFavorite });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update favorite status.' });
  }
};

const deleteHistoryItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (isUsingMongo()) {
      const result = await TestGeneration.findOneAndDelete({ _id: id, userId });
      if (!result) {
        return res.status(404).json({ error: 'Record not found.' });
      }
      return res.json({ success: true, message: 'Generation deleted successfully.' });
    } else {
      const deleted = localDb.deleteGeneration(id, userId);
      if (!deleted) {
        return res.status(404).json({ error: 'Record not found.' });
      }
      return res.json({ success: true, message: 'Generation deleted successfully.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
};

module.exports = {
  getHistory,
  getHistoryItem,
  toggleFavorite,
  deleteHistoryItem
};
