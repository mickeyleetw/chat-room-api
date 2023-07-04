import { User } from '../schemas';
import {RetrieveChatModel } from './chat';

export class RetrievePartialChatRoomModel {
    public members: User[];
    public createdAt: Date;
    public id: number;

    constructor(members: User[], createdAt: Date, id: number) {
        this.members = members;
        this.createdAt = createdAt;
        this.id = id;
    }
}


export class RetrieveChatRoomDetailModel{
    public createdAt: Date;
    public id: number;
    public messages: RetrieveChatModel[];
    
    constructor(messages:RetrieveChatModel[], createdAt:Date, id:number) {
        this.messages = messages;
        this.createdAt = createdAt;
        this.id = id;

    }
  }