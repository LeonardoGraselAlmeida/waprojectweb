import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IOrder, { enStatus } from 'interfaces/models/order';
import React, { forwardRef, Fragment, memo } from 'react';
import TableWrapper from 'components/Shared/TableWrapper';
import { moneyFormat } from 'formatters/money';

interface IProps {
  opened: boolean;
  order: IOrder;
  onClose: () => void;
}

const useStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const DetailsDialog = memo((props: IProps) => {
  const classes = useStyle(props);

  return (
    <Dialog open={props.opened} disableEscapeKeyDown TransitionComponent={Transition} disableBackdropClick>
      <DialogTitle>Pedido #{props.order?.id} </DialogTitle>
      <DialogContent className={classes.content}>
        <Fragment>
          <TableWrapper minWidth={500}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{enStatus[props.order?.status]}</TableCell>
                  <TableCell>{moneyFormat(props.order?.total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <DialogTitle>Produtos </DialogTitle>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Preço</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.order?.products?.map(product => {
                  return (
                    <TableRow key={`product-${product.id}`}>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.amount}</TableCell>
                      <TableCell>{moneyFormat(product.price)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableWrapper>
        </Fragment>
        <DialogActions>
          <Button onClick={props.onClose}>Fechar</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default DetailsDialog;
