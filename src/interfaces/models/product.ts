export default interface IProduct {
  id?: number;
  description: string;
  amount: number;
  price: number;

  createdDate?: Date;
  updatedDate?: Date;
}
