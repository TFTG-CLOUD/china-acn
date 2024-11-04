const mediaSchema = new mongoose.Schema({
  mediaType: {
    type: String,
    enum: ['ANIME', 'MANGA', 'NOVEL'],
    required: true
  },
  translations: {
    type: Map,
    of: {
      title: String,
      description: String
    }
  },
  releaseDate: Date,
  duration: Number,
  episodes: Number,
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'hidden'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  }]
}, {
  timestamps: true
});