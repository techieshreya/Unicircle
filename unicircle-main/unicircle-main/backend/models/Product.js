import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['electronics', 'furniture', 'books', 'stationary', 'others']
  },
  image: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['sell', 'rent']
  },
  duration: {
    type: Number,
    min: 1
  },
  durationType: {
    type: String,
    enum: ['days', 'weeks', 'months', 'years']
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  college:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = model('Product', productSchema);

export default Product;