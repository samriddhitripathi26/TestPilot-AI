const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Embedded fallback JSON database for instant out-of-the-box operation without cloud/local Mongo setup
class LocalDatabase {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = { users: [], generations: [] };
    this.init();
  }

  init() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.users) this.data.users = [];
        if (!this.data.generations) this.data.generations = [];
      } catch (err) {
        console.warn('[LocalDB] Warning reading database file, initializing fresh:', err.message);
        this.save();
      }
    } else {
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[LocalDB] Error saving to file:', err.message);
    }
  }

  // Users
  findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  // Generations
  getGenerations(userId, filters = {}) {
    let items = this.data.generations.filter(g => g.userId === userId);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(g =>
        (g.functionName && g.functionName.toLowerCase().includes(q)) ||
        (g.sourceCode && g.sourceCode.toLowerCase().includes(q)) ||
        (g.language && g.language.toLowerCase().includes(q))
      );
    }
    if (filters.language && filters.language !== 'all') {
      items = items.filter(g => g.language.toLowerCase() === filters.language.toLowerCase());
    }
    if (filters.isFavorite !== undefined) {
      items = items.filter(g => !!g.isFavorite === !!filters.isFavorite);
    }
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getGenerationById(id, userId) {
    return this.data.generations.find(g => g.id === id && g.userId === userId);
  }

  createGeneration(genData) {
    const newGen = {
      id: 'gen_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      isFavorite: false,
      ...genData
    };
    this.data.generations.unshift(newGen);
    this.save();
    return newGen;
  }

  updateGeneration(id, userId, updates) {
    const idx = this.data.generations.findIndex(g => g.id === id && g.userId === userId);
    if (idx !== -1) {
      this.data.generations[idx] = {
        ...this.data.generations[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.data.generations[idx];
    }
    return null;
  }

  deleteGeneration(id, userId) {
    const idx = this.data.generations.findIndex(g => g.id === id && g.userId === userId);
    if (idx !== -1) {
      const deleted = this.data.generations.splice(idx, 1)[0];
      this.save();
      return deleted;
    }
    return null;
  }

  getStats(userId) {
    const userGenerations = this.data.generations.filter(g => g.userId === userId);
    const languages = {};
    const frameworks = {};
    let totalTestCases = 0;
    let totalBugsCaught = 0;

    userGenerations.forEach(g => {
      languages[g.language] = (languages[g.language] || 0) + 1;
      frameworks[g.framework] = (frameworks[g.framework] || 0) + 1;
      if (Array.isArray(g.testCases)) {
        totalTestCases += g.testCases.length;
      }
      if (Array.isArray(g.detectedBugs)) {
        totalBugsCaught += g.detectedBugs.length;
      }
    });

    return {
      totalGenerations: userGenerations.length,
      totalTestCases,
      totalBugsCaught,
      languages,
      frameworks,
      estimatedHoursSaved: Math.round(userGenerations.length * 0.75 * 10) / 10
    };
  }
}

const localDbPath = path.join(__dirname, '../../data/testpilot.json');
const localDb = new LocalDatabase(localDbPath);

let isUsingMongo = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Database] MONGODB_URI not provided. Using persistent local database:', localDbPath);
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isUsingMongo = true;
    console.log('[Database] Connected to MongoDB Atlas successfully.');
  } catch (err) {
    console.warn('[Database] MongoDB connection failed:', err.message);
    console.log('[Database] Automatically falling back to persistent local storage:', localDbPath);
    isUsingMongo = false;
  }
};

module.exports = {
  connectDB,
  localDb,
  isUsingMongo: () => isUsingMongo
};
