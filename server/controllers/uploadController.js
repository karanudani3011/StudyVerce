// @desc    Upload media (image/video/pdf) to Cloudinary
// @route   POST /api/upload
// @access  Private
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file.' });
    }

    return res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
      resourceType: req.file.mimetype.startsWith('video') ? 'video' : 'image',
      format: req.file.format || req.file.mimetype.split('/')[1],
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return res.status(500).json({ message: error.message || 'Media upload failed.' });
  }
};
