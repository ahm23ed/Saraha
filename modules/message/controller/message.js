import { messageModel } from "../../../DB/model/message.js"
import { userModel } from "../../../DB/model/user.model.js"
import { asyncHandler } from "../../../services/errorHandling.js"



export const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { receiverUsername } = req.params;
        const { text } = req.body;
        const receiver = await userModel.findOne({ userName: receiverUsername }).select('_id')
        if (!receiver) {
            return res.status(404).json({ message: 'User not found' })
        }
        const newMessage = new messageModel({
            reciverId: receiver._id, 
            text,
        
        })
        const savedMessage = await newMessage.save();
        return res.status(201).json({ message: 'Message sent successfully', data: savedMessage })
    } catch (err) {
        console.error('Error sending message:', err);
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
})



export const myMessages = asyncHandler( async (req, res) => {
    const messageList = await messageModel.find({ reciverId: req.user._id }).populate({
        path:'reciverId',
        match:{
            gender:"Fmale"
        }
    })
    res.json({ message: "Message module", messageList })
}
)

export const deleteMessage = asyncHandler( async (req, res) => {
    const { id } = req.params
    const message = await messageModel.deleteOne({ reciverId: req.user._id, _id: id })
    message.deletedCount ? res.json({ message: "Done" }) :
        res.json({ message: "In-valid message ID or you are not auth" })
}
)