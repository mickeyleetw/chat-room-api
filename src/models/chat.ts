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
