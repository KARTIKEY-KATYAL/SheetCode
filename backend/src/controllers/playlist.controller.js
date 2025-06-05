import { asyncHandler } from "../libs/async-handler.js";
import { ApiResponse } from "../libs/api-response.js";
import { ApiError } from "../libs/api-error.js";
import { db } from '../libs/db.js';

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json(new ApiError(400, "Playlist name is required"));
  }

  const userId = req.user.id;

  const playList = await db.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, playList, "Playlist created successfully")
  );
});

export const getAllListDetails = asyncHandler(async (req, res) => {
  const playlists = await db.playlist.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  return res.status(200).json(
    new ApiResponse(200, playlists, "Playlists fetched successfully")
  );
});

export const getPlayListDetails = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  
  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }
  
  return res.status(200).json(
    new ApiResponse(200, playlist, "Playlist fetched successfully")
  );
});

export const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    return res.status(400).json(new ApiError(400, "Invalid or missing problemIds"));
  }

  // Verify the playlist belongs to the user
  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId: req.user.id
    }
  });

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found or unauthorized"));
  }

  try {
    // Fix: Change playlistId to playListId (matching your schema)
    const problemsInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playListId: playlistId,  // Fixed: use correct casing to match schema
        problemId,
      })),
      skipDuplicates: true,
    });

    return res.status(201).json(
      new ApiResponse(201, problemsInPlaylist, "Problems added to playlist successfully")
    );
  } catch (error) {
    console.error("Error adding problems to playlist:", error);
    return res.status(500).json(
      new ApiError(500, "Failed to add problems to playlist")
    );
  }
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  // Verify the playlist belongs to the user
  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId: req.user.id
    }
  });

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found or unauthorized"));
  }

  const deletedPlaylist = await db.playlist.delete({
    where: {
      id: playlistId,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully")
  );
});

export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    return res.status(400).json(new ApiError(400, "Invalid or missing problemIds"));
  }

  // Verify the playlist belongs to the user
  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId: req.user.id
    }
  });

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found or unauthorized"));
  }

  const deletedProblems = await db.problemInPlaylist.deleteMany({
    where: {
      playListId: playlistId,  // Match your schema's casing
      problemId: {
        in: problemIds,
      },
    },
  });

  return res.status(200).json(
    new ApiResponse(200, deletedProblems, "Problems removed from playlist successfully")
  );
});

export const updatePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, description, isPublic } = req.body;
    const userId = req.user.id;

    if (!playlistId) {
      return res.status(400).json(new ApiError(400, 'Playlist ID is required'));
    }

    // Check if playlist exists and belongs to user
    const existingPlaylist = await db.playlist.findFirst({
      where: {
        id: playlistId,
        userId: userId,
      },
    });

    if (!existingPlaylist) {
      return res.status(404).json(new ApiError(404, 'Playlist not found or access denied'));
    }

    // Update playlist
    const updatedPlaylist = await db.playlist.update({
      where: { id: playlistId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(typeof isPublic === 'boolean' && { isPublic }),
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    return res.status(200).json(
      new ApiResponse(200, updatedPlaylist, 'Playlist updated successfully')
    );
  } catch (error) {
    console.error('Error updating playlist:', error);
    return res.status(500).json(
      new ApiError(500, 'Error while updating playlist')
    );
  }
});
