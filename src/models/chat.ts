export class RetrieveChatModel {
    public content: string;
    public createdAt: Date;
    public userId: number;
    public id: number;

    constructor(content: string, createdAt: Date, userId: number, id: number) {
        this.content = content;
        this.createdAt = createdAt;
        this.userId = userId;
        this.id = id;
    }
}


export class CreateChatModel {
    public message: string;
    public receiverId: number;

    constructor(message: string, receiverId: number) {
        this.message = message;
        this.receiverId = receiverId;
    }

    static fromRequest(req): CreateChatModel {
        return new CreateChatModel(req.message, req.receiverId);
    }
}