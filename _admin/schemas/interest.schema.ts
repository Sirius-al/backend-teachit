import mongoose from 'mongoose';


const InterestSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    img: {
        type: String,
    },
})

const InterestModel = mongoose.model('interests', InterestSchema);
export default InterestModel;
