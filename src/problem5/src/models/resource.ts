import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ResourceDocument extends Document {
    name: string;
    description?: string;
    price: number;
    active?: boolean;
}

const resourceSchema: Schema = new Schema<ResourceDocument>({
    name: { type: String, required: [true, "Name required"] },
    description: { type: String, required: false },
    price: {
        type: Number,
        required: [true, 'Price required'],
        min: [0, "Value must greater than 0"],
    },
    active:{
        type:Boolean,
        required:false,
        default:1
    }
}, {
    timestamps: true
});

const Resource = mongoose.model<ResourceDocument>('Resource', resourceSchema);

export default Resource;
