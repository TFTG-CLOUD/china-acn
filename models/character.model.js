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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  avatarUrl: String,
  mediaRefs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }]
}, {
  timestamps: true
});