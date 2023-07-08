import { Router } from 'express';
import { ChatRoomUseCase } from '../usecases';

const chatRoomRouter = Router();

chatRoomRouter.get('/:chatRoomId', getChatRoom);

async function getChatRoom(req, res): Promise<void> {
    try{
        const {chatRoomId}=req.params;
        const userChatRooms=await ChatRoomUseCase.getUserChatRooms(chatRoomId);
        res.status(200).json(userChatRooms);
        return;
    }catch(error){
        res.status(error.statusCode).json(error);
    }
}


export default chatRoomRouter;