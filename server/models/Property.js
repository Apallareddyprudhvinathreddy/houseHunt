const mongoose = require('mongoose');
const { Schema } = mongoose;

const propertySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    location: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true, index: true },
      state: { type: String, trim: true },
      zipcode: { type: String, trim: true }
    },
    propertyType: {
      type: String,
      enum: ['Apartment', 'House', 'Condo', 'Studio', 'Other'],
      default: 'Other'
    },
    images: [{ type: String }],
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

propertySchema.index({ 'location.city': 'text', title: 'text', description: 'text' });

module.exports = mongoose.model('Property', propertySchema);
