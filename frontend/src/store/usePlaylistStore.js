import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const usePlaylistStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  createPlaylist: async (playlistData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post("/playlist", playlistData);

      set((state) => ({
        playlists: [...state.playlists, response.data.data],
      }));

      toast.success("Playlist created successfully");
      return response.data.data;
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast.error(error.response?.data?.error || "Failed to create playlist");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPlaylists: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/playlist");
      set({ playlists: response.data.data });
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error("Failed to fetch playlists");
    } finally {
      set({ isLoading: false });
    }
  },

  getPlaylistDetails: async (playlistId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/playlist/${playlistId}`);
      set({ currentPlaylist: response.data.data });
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      toast.error("Failed to fetch playlist details");
    } finally {
      set({ isLoading: false });
    }
  },

  addProblemToPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true });
      console.log("API request:", {
        url: `/playlist/${playlistId}/problems`,
        data: { problemIds },
      });

      const response = await axiosInstance.post(
        `/playlist/${playlistId}/problems`,
        {
          problemIds,
        }
      );

      console.log("API response:", response.data);
      toast.success("Problem added to playlist");

      // Refresh the playlist details
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Error adding problem to playlist:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to add problem to playlist"
      );
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeProblemFromPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true });
      await axiosInstance.delete(`/playlist/${playlistId}/problems`, {
        data: { problemIds }, // When sending data with DELETE, use the data property
      });

      toast.success("Problem removed from playlist");

      // Refresh the playlist details
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      console.error("Error removing problem from playlist:", error);
      toast.error("Failed to remove problem from playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (playlistId) => {
    try {
      set({ isLoading: true });
      await axiosInstance.delete(`/playlist/${playlistId}`);

      set((state) => ({
        playlists: state.playlists.filter((p) => p.id !== playlistId),
      }));

      toast.success("Playlist deleted successfully");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Failed to delete playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlaylist: async (playlistData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.patch("/playlist", playlistData);

      // Update the playlists array with the updated playlist
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p.id === playlistData.id ? response.data.data : p
        ),
      }));

      toast.success("Sheet updated successfully");
      return response.data.data;
    } catch (error) {
      console.error("Error updating sheet:", error);
      toast.error(error.response?.data?.message || "Failed to update sheet");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));