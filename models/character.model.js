const characterSchema = new mongoose.Schema({
  translations: {
    type: Map,
    of: {
      name: String,
      description: String
    }
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  avatarUrl: String,
  mediaRefs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }]
}, {
  timestamps: true
});