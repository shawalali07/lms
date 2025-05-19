import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import db from '../utils/db';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Input,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Delete, Edit } from '@mui/icons-material';

// Styled components
const FileInput = styled('input')({
  display: 'none',
});

const AspectBox = styled(Box)(({ ratio = 16 / 9 }) => ({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingTop: `${100 / ratio}%`,
  overflow: 'hidden',
  borderRadius: 8,
  backgroundColor: '#000',
  boxSizing: 'border-box',
  minHeight: '200px',
}));

const IFrame = styled('iframe')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 0,
});

const Video = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const MyLectures = () => {
  const { user } = useUser();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null);
  const [selectedEditFile, setSelectedEditFile] = useState(null);
  const fileInputRef = useRef();

  const CLOUD_NAME = 'deyvimtcm';
  const UPLOAD_PRESET = 'lecture_upload';
  const ASSET_FOLDER = 'samples/ecommerce';

  // Helper functions
  const getYouTubeEmbed = (url) => {
    const regExp = /(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/))([^?&]+)/;
    const match = url.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  // Data fetching
  useEffect(() => {
    const fetchLectures = async () => {
      if (!user) return;
      try {
        const result = await db.Lectures.select({
          filterByFormula: `{teacherId} = '${user.id}'`,
        });
        const all = await result.all();
        setLectures(all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, [user]);

  // CRUD operations
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', ASSET_FOLDER);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
      { method: 'POST', body: formData }
    );
    const json = await res.json();
    return json.secure_url;
  };

  const handleCreateLecture = async () => {
    if (!newTitle.trim() || !selectedFile) return;
    try {
      const url = await handleFileUpload(selectedFile);
      const record = await db.Lectures.create({
        title: newTitle,
        url,
        teacherId: user.id,
      });
      setLectures([...lectures, record]);
      setNewTitle('');
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleDeleteLecture = async (id) => {
    try {
      await db.Lectures.delete(id);
      setLectures(lectures.filter(lec => lec.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleUpdateLecture = async () => {
    if (!editingLecture?.title.trim()) return;
    try {
      let newUrl = editingLecture.url;
      if (selectedEditFile) {
        newUrl = await handleFileUpload(selectedEditFile);
      }
      const updated = await db.Lectures.update(editingLecture.id, {
        title: editingLecture.title,
        url: newUrl,
      });
      setLectures(lectures.map(lec => 
        lec.id === updated.id ? updated : lec
      ));
      setEditingLecture(null);
      setSelectedEditFile(null);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  // Filter lectures
  const youtubeLectures = lectures.filter(lec =>
    getYouTubeEmbed(lec.fields?.url || lec.url)
  );
  const uploadedLectures = lectures.filter(lec =>
    !getYouTubeEmbed(lec.fields?.url || lec.url)
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Create Section */}
      <Card sx={{ mb: 4, p: 2, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Create New Lecture</Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Lecture Title"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <label>
            <FileInput
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              ref={fileInputRef}
            />
            <Button variant="contained" component="span">
              {selectedFile?.name || 'Choose File'}
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateLecture}
            disabled={!newTitle.trim() || !selectedFile}
          >
            Upload
          </Button>
        </Box>
      </Card>

      {/* YouTube Lectures Grid */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>YouTube Lectures</Typography>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {youtubeLectures.map(lec => {
            const url = lec.fields?.url || lec.url;
            const embedUrl = getYouTubeEmbed(url);
            return (
              <Card key={lec.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <AspectBox ratio={16/9}>
                  <IFrame src={embedUrl} allowFullScreen />
                </AspectBox>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      {lec.fields?.title || lec.title}
                    </Typography>
                    <Box>
                      <IconButton onClick={() => setEditingLecture({
                        id: lec.id,
                        title: lec.fields?.title || lec.title,
                        url: lec.fields?.url || lec.url
                      })}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteLecture(lec.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Box>

      {/* Uploaded Lectures Grid */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>Uploaded Lectures</Typography>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {uploadedLectures.map(lec => {
            const url = lec.fields?.url || lec.url;
            return (
              <Card key={lec.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <AspectBox ratio={16/9}>
                  <Video src={url} controls />
                </AspectBox>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      {lec.fields?.title || lec.title}
                    </Typography>
                    <Box>
                      <IconButton onClick={() => setEditingLecture({
                        id: lec.id,
                        title: lec.fields?.title || lec.title,
                        url: lec.fields?.url || lec.url
                      })}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteLecture(lec.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={!!editingLecture} onClose={() => setEditingLecture(null)}>
        <DialogTitle>Edit Lecture</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editingLecture?.title || ''}
            onChange={(e) => setEditingLecture({...editingLecture, title: e.target.value})}
            sx={{ my: 2 }}
          />
          
          {editingLecture && getYouTubeEmbed(editingLecture.url) ? (
            <TextField
              fullWidth
              label="YouTube URL"
              value={editingLecture?.url || ''}
              onChange={(e) => setEditingLecture({...editingLecture, url: e.target.value})}
              sx={{ my: 2 }}
            />
          ) : (
            <Box sx={{ my: 2 }}>
              <label>
                <FileInput
                  type="file"
                  onChange={(e) => setSelectedEditFile(e.target.files[0])}
                />
                <Button variant="contained" component="span">
                  {selectedEditFile?.name || 'Upload New Video'}
                </Button>
              </label>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingLecture(null)}>Cancel</Button>
          <Button onClick={handleUpdateLecture} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyLectures;