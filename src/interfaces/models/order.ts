import IProduct from './product';

export default interface IOrder {
  id?: number;
  total: number;
  status: string;
  products: IProduct[];

  createdDate?: Date;
  updatedDate?: Date;
}

export enum enStatus {
  created = 'Criado',
  analyzing = 'Analisando',
  done = 'Pronto',
  canceled = 'Cancelado'
}
