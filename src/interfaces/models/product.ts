export default interface IProduct {
  id?: number;
  description: string;
  amount: number;
  price: number;
  selected: boolean;

  createdDate?: Date;
  updatedDate?: Date;
}
