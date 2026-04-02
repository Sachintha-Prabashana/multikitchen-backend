import * as backupService from '../services/backupService.js';

export const createBackup = async (req, res) => {
  try {
    const backup = await backupService.performBackup(req.user.id);
    res.json({ message: 'Backup created successfully', backup });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBackups = async (req, res) => {
  try {
    const backups = await backupService.getAllBackupLogs();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const restoreBackup = async (req, res) => {
  try {
    const result = await backupService.performRestore(req.body.fileName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
