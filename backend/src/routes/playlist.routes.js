import express from 'express';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllListDetails,
  getPlayListDetails,
  removeProblemFromPlaylist,
  updatePlaylist
} from '../controllers/playlist.controller.js';

const router = express.Router();

// Playlist routes
router.get('/', isLoggedIn, getAllListDetails);
router.get('/:playlistId', isLoggedIn, getPlayListDetails);
router.post('/', isLoggedIn, createPlaylist);
router.patch('/:playlistId', isLoggedIn, updatePlaylist);
router.post('/:playlistId/problems', isLoggedIn, addProblemToPlaylist);
router.delete('/:playlistId/problems', isLoggedIn, removeProblemFromPlaylist);
router.delete('/:playlistId', isLoggedIn, deletePlaylist);

export default router;
