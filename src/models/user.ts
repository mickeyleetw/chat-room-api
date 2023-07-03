export class RetrieveUserModel {
    public id: number;
    public name: string;
    public lastLoginAt: Date;
    
    constructor(id:number, name:string, lastLoginAt:Date) {
        this.id = id;
        this.name = name;
        this.lastLoginAt = lastLoginAt;
    }
  }