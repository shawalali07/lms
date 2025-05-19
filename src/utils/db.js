// src/utils/db.js
// Initialize data from localStorage or empty arrays
let lectures = JSON.parse(localStorage.getItem('lectures') || '[]');
let notices = JSON.parse(localStorage.getItem('notices') || '[]');
let quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
let classes = JSON.parse(localStorage.getItem('classes') || '[]');

// Helper function to save data to localStorage
const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const db = {
  Lectures: {
    create: async (data) => {
      const record = { id: Date.now().toString(), fields: { ...data } };
      lectures.push(record);
      saveToStorage('lectures', lectures);
      return record;
    },
    select: async ({ filterByFormula } = {}) => {
      try {
        if (filterByFormula) {
          const [key, value] = filterByFormula.match(/{([^}]+)} = '([^']+)'/).slice(1);
          return {
            all: async () => lectures.filter((record) => record.fields[key] === value),
          };
        }
        return { all: async () => lectures };
      } catch (err) {
        console.error('Error fetching lectures:', err);
        throw new Error('Error fetching lectures');
      }
    },
    update: async (id, data) => {
      try {
        const index = lectures.findIndex((lecture) => lecture.id === id);
        if (index === -1) throw new Error('Lecture not found');
        lectures[index].fields = { ...lectures[index].fields, ...data };
        saveToStorage('lectures', lectures);
        return lectures[index];
      } catch (err) {
        console.error('Error updating lecture:', err);
        throw new Error('Error updating lecture');
      }
    },
    delete: async (id) => {
      try {
        const index = lectures.findIndex((lecture) => lecture.id === id);
        if (index === -1) throw new Error('Lecture not found');
        lectures.splice(index, 1);
        saveToStorage('lectures', lectures);
        return true;
      } catch (err) {
        console.error('Error deleting lecture:', err);
        throw new Error('Error deleting lecture');
      }
    },
  },

  Notices: {
    create: async (data) => {
      const record = { id: Date.now().toString(), fields: { ...data } };
      notices.push(record);
      saveToStorage('notices', notices);
      return record;
    },
    select: async () => {
      try {
        return { all: async () => notices };
      } catch (err) {
        console.error('Error fetching notices:', err);
        throw new Error('Error fetching notices');
      }
    },
    update: async (id, data) => {
      try {
        const index = notices.findIndex((notice) => notice.id === id);
        if (index === -1) throw new Error('Notice not found');
        notices[index].fields = { ...notices[index].fields, ...data };
        saveToStorage('notices', notices);
        return notices[index];
      } catch (err) {
        console.error('Error updating notice:', err);
        throw new Error('Error updating notice');
      }
    },
    delete: async (id) => {
      try {
        const index = notices.findIndex((notice) => notice.id === id);
        if (index === -1) throw new Error('Notice not found');
        notices.splice(index, 1);
        saveToStorage('notices', notices);
        return true;
      } catch (err) {
        console.error('Error deleting notice:', err);
        throw new Error('Error deleting notice');
      }
    },
  },

  Quizzes: {
    create: async (data) => {
      const record = { id: Date.now().toString(), fields: { ...data } };
      quizzes.push(record);
      saveToStorage('quizzes', quizzes);
      return record;
    },
    select: async () => {
      try {
        return { all: async () => quizzes };
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        throw new Error('Error fetching quizzes');
      }
    },
    update: async (id, data) => {
      try {
        const index = quizzes.findIndex((quiz) => quiz.id === id);
        if (index === -1) throw new Error('Quiz not found');
        quizzes[index].fields = { ...quizzes[index].fields, ...data };
        saveToStorage('quizzes', quizzes);
        return quizzes[index];
      } catch (err) {
        console.error('Error updating quiz:', err);
        throw new Error('Error updating quiz');
      }
    },
    delete: async (id) => {
      try {
        const index = quizzes.findIndex((quiz) => quiz.id === id);
        if (index === -1) throw new Error('Quiz not found');
        quizzes.splice(index, 1);
        saveToStorage('quizzes', quizzes);
        return true;
      } catch (err) {
        console.error('Error deleting quiz:', err);
        throw new Error('Error deleting quiz');
      }
    },
  },

  Classes: {
    create: async (data) => {
      const record = { id: Date.now().toString(), fields: { ...data } };
      classes.push(record);
      saveToStorage('classes', classes);
      return record;
    },
    select: async () => {
      try {
        return { all: async () => classes };
      } catch (err) {
        console.error('Error fetching classes:', err);
        throw new Error('Error fetching classes');
      }
    },
    update: async (id, data) => {
      try {
        const index = classes.findIndex((classRecord) => classRecord.id === id);
        if (index === -1) throw new Error('Class not found');
        classes[index].fields = { ...classes[index].fields, ...data };
        saveToStorage('classes', classes);
        return classes[index];
      } catch (err) {
        console.error('Error updating class:', err);
        throw new Error('Error updating class');
      }
    },
    delete: async (id) => {
      try {
        const index = classes.findIndex((classRecord) => classRecord.id === id);
        if (index === -1) throw new Error('Class not found');
        classes.splice(index, 1);
        saveToStorage('classes', classes);
        return true;
      } catch (err) {
        console.error('Error deleting class:', err);
        throw new Error('Error deleting class');
      }
    },
  },
};

export default db;