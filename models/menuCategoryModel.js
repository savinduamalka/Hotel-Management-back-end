import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true 
  }, 
  name: { 
    type: String, 
    required: true 
  },
  smallPrice: { 
    type: Number, 
    required: true 
  },
  largePrice: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String, 
    default: '' 
  },
  hot: { 
    type: Boolean, 
    default: false 
  }
}, { _id: false });

const menuCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  items: { 
    type: [menuItemSchema], 
    default: [] 
  }
}, { timestamps: true });

const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);
export default MenuCategory;
