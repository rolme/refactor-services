import { DynamoDB } from 'aws-sdk';
import { IHash } from './types';

class Model {
  public static instance() {
    if (!Model._instance) {
      Model._instance = new Model();
    }
    return Model._instance;
  }

  public static attributeNames(obj: IHash) {
    const keys = Object.keys(obj);
    return keys.reduce((hash: IHash, key) => {
      hash[`#${key}`] = `"${key}"`;
      return hash;
    }, {});
  }

  public static attributeValues(obj: IHash) {
    const keys = Object.keys(obj);
    return keys.reduce((hash: IHash, key) => {
      // TODO: Determine if key is a string, number, array, or object.
      //       Is it possible to introspect the type and see if key matches an attribute?
      hash[`:${key}`] = `${obj[key]}`;
      return hash;
    }, {});
  }
  public static updateExpressions(obj: IHash) {
    const ExpressionAttributeNames = Model.attributeNames(obj);
    const ExpressionAttributeValues = Model.attributeValues(obj);

    const keys = Object.keys(obj);
    const UpdateExpression = keys.reduce((set: string, key) => {
      set += `#${key} = :${key}, `;
      return set;
    }, 'set ');

    return {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      UpdateExpression,
    };
  }

  // tslint:disable-next-line: variable-name
  private static _instance: Model;
  public docClient: DynamoDB.DocumentClient;

  private constructor() {
    this.docClient = new DynamoDB.DocumentClient();
  }
}

export default Model;
