import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    }
});

export default mongoose.model("File", fileSchema);
