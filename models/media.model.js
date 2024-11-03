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
  assets: [{
    type: {
      type: String,
      enum: ['IMAGE', 'VIDEO']
    },
    url: String
  }]
}, {
  timestamps: true
});