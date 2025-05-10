import express from 'express';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllListDetails,
  getPlayListDetails,
  removeProblemFromPlaylist,
} from '../controllers/playlist.controller.js';

const router = express.Router();

// Get all playlists for the logged-in user
router.get('/', isLoggedIn, getAllListDetails);

// Get a single playlist by ID
router.get('/:playlistId', isLoggedIn, getPlayListDetails);

// Create a new playlist
router.post('/', isLoggedIn, createPlaylist);

// Add problems to a playlist
router.post('/:playlistId/problems', isLoggedIn, addProblemToPlaylist);

// Remove problems from a playlist
router.delete('/:playlistId/problems', isLoggedIn, removeProblemFromPlaylist);

// Delete a playlist
router.delete('/:playlistId', isLoggedIn, deletePlaylist);

export default router;
