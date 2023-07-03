export class RetrieveChatRoomModel {
    public members: number[];
    public createdAt: string;
    public id: number;
    
    constructor(members:number[], createdAt:string, id:number) {
        this.members = members;
        this.createdAt = createdAt;
        this.id = id;
    }
  }