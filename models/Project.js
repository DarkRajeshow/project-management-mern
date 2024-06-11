import mongoose, { Schema } from "mongoose";

// Define sub-schemas for each section
const BasicInfoSchema = new Schema({
  name: {
    type: String,
    required: function () { return this.basicInfo != null; }
  },
  state: {
    type: String,
    required: function () { return this.basicInfo != null; },
  },
  address: {
    type: String,
    required: function () { return this.basicInfo != null; },
  },
  dateOfCompletion: {
    type: Date,
    required: function () { return this.basicInfo != null; }
  },
  projectType: {
    type: String,
    enum: ["residential", "commercial", "open plot", "res + comm"],
    required: function () { return this.basicInfo != null; },
  },
  city: {
    type: String,
    required: function () { return this.basicInfo != null; },
  },
  landStatus: {
    type: String,
    required: function () { return this.basicInfo != null; },
  },
  reraNumber: {
    type: String,
    required: function () { return this.basicInfo != null; },
  },
});

const PropertyInfoSchema = new Schema({
  totalPlats: {
    type: Number,
    required: function () { return this.propertyInfo != null; }
  },
  totalShops: {
    type: Number,
    required: function () { return this.propertyInfo != null; }
  },
  totalOffices: {
    type: Number,
    required: function () { return this.propertyInfo != null; }
  },
  totalFloors: {
    type: Number,
    required: function () { return this.propertyInfo != null; }
  },
  engineerName: {
    type: String,
    required: function () { return this.propertyInfo != null; }
  },
  architectName: {
    type: String,
    required: function () { return this.propertyInfo != null; }
  },
  estimatedCost: {
    type: Number,
    required: function () { return this.propertyInfo != null; }
  },
});


const GallerySchema = new Schema({
  siteElevations: [{
    type: String,
    required: function () { return this.gallery != null; }
  }],
  siteImages: [{
    type: String,
    required: function () { return this.gallery != null; }
  }],
  siteBrochore: [{
    type: String,
    required: function () { return this.gallery != null; }
  }]
});

const DocumentSchema = new Schema({
  title: {
    type: String,
    required: function () { return this.documents != null; }
  },
  filename: {
    type: String,
    required: function () { return this.documents != null; }
  }
});

const ProjectSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  basicInfo: BasicInfoSchema,
  propertyInfo: PropertyInfoSchema,
  amenities: [{
    type: String,
  }],
  gallery: GallerySchema,
  documents: [DocumentSchema],
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);
