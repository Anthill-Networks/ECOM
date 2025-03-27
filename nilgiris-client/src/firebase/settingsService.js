const { db } = require('./firebase');

const SETTINGS_DOC_ID = 'NILGIRIS_SETTINGS';

const saveSettings = async (settings) => {
  try {
    await db.collection('settings').doc(SETTINGS_DOC_ID).set(settings, { merge: true });
    console.log('Settings saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

const getSettings = async () => {
  try {
    const doc = await db.collection('settings').doc(SETTINGS_DOC_ID).get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

module.exports = {
  saveSettings,
  getSettings
}; 