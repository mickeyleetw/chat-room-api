import { Router } from 'express';
import { ChatRoomUseCase } from '../usecases';

const userRouter = Router();

userRouter.get('/:userId/chatrooms', getUserChatRoom);

async function getUserChatRoom(req, res): Promise<void> {
    try{
        const {user_id}=req.params;
        const userChatRooms=await ChatRoomUseCase.getUserChatRooms(user_id);
        res.json(userChatRooms);
        return;
    }catch(error){
        res.status(error.statusCode).json(error);
    }
}


export default userRouter;