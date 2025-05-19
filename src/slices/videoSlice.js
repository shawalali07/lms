import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
  },
  reducers: {
    addVideo: (state, action) => {
      state.videos.push(action.payload);
    },
    setVideos: (state, action) => {
      state.videos = action.payload;
    },
  },
});

export const { addVideo, setVideos } = videoSlice.actions;
export default videoSlice.reducer;