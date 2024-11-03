const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  translations: {
    type: Map,
    of: {
      comment: String
    }
  }
}, {
  timestamps: true
});