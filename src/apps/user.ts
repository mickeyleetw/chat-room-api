import { Router } from 'express';
import { ChatRoomUseCase,ChatUseCase } from '../usecases';
import { ChatModels } from '../models';

const userRouter = Router();

userRouter.get('/:userId/chatrooms', getUserChatRoom);

async function getUserChatRoom(req, res): Promise<void> {
    try{
        const {userId}=req.params;
        const userChatRooms=await ChatRoomUseCase.getUserChatRooms(userId);
        res.status(200).json(userChatRooms);
        return;
    }catch(error){
        res.status(error.statusCode).json(error);
    }
}

userRouter.post('/:userId/messages', createUserMessage);

async function createUserMessage(req, res): Promise<void> {
    try{
        const {userId}=req.params;
        const message=ChatModels.CreateChatModel.fromRequest(req.body);
        const userChatId=await ChatUseCase.createUserChat(userId,message);
        res.status(201).json(userChatId);
        return;
    }catch(error){
        res.status(error.statusCode).json(error);
    }
}

export default userRouter;