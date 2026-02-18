const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, trim: true },
    text: { type: String, trim: true },
    helpful: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
