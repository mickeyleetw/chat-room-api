export class BaseError extends Error{
    public statusCode: number;
    public message: string;
    public dataObject: string;

    constructor(dataObject:string, statusCode: number,message: string) {
        super();
      this.message = message;
      this.dataObject = dataObject;
      this.statusCode = statusCode;
    }
  }

export class ResourceNotFoundError extends BaseError {

    constructor(dataObject:string) {
      super(dataObject, 404, 'not found');
    }
  }