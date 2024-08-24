import {Schema, model, models} from 'mongoose'

const PromptSchema = new Schema({
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    prompt:{
        type: String,
        required: [true, 'Prompt is required.']
    },
    title:{
        type: String,
        required: [true, 'Title is required.']
    },
    date:{
        type: String,
        required: [true, 'Date is required.'] 
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

// Virtual for like count
PromptSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

// Method to toggle like
PromptSchema.methods.toggleLike = function(userId) {
    const userIdString = userId.toString();
    const userLikeIndex = this.likes.findIndex(id => id.toString() === userIdString);
    
    if (userLikeIndex > -1) {
        // User has already liked, so unlike
        this.likes.splice(userLikeIndex, 1);
    } else {
        // User hasn't liked, so add like
        this.likes.push(userId);
    }
    
    return this.save();
};

const Prompt = models.Prompt || model('Prompt', PromptSchema)

export default Prompt