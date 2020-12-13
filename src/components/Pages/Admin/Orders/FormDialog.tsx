/* eslint-disable react/jsx-no-bind */
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Toast from 'components/Shared/Toast';
import { moneyFormat } from 'formatters/money';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IOrder from 'interfaces/models/order';
import React, { forwardRef, Fragment, memo, useCallback } from 'react';
import { tap } from 'rxjs/operators';
import orderService from 'services/order';
import productService from 'services/product';
import usePaginationObservable from 'hooks/usePagination';
import EmptyAndErrorMessages from 'components/Shared/Pagination/EmptyAndErrorMessages';
import TableWrapper from 'components/Shared/TableWrapper';

interface IProps {
  opened: boolean;
  order?: IOrder;
  onComplete: (order: IOrder) => void;
  onCancel: () => void;
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

const FormDialog = memo((props: IProps) => {
  const classes = useStyle(props);

  const [, , loading, data, error, , refresh] = usePaginationObservable(
    params => productService.list(params),
    { orderBy: 'description', orderDirection: 'asc', pageSize: 100 },
    []
  );

  const formik = useFormikObservable<IOrder>({
    initialValues: {},
    onSubmit(model) {
      const products = results
        .filter(product => product.selected)
        .map(product => {
          delete product.selected;
          return product;
        });
      if (products.length > 0) {
        model.products = products;
        model.status = 'created';
        model.total = products.reduce((accumlator, product) => accumlator + product.price, 0);
        return orderService.save(model).pipe(
          tap(order => {
            Toast.show(`Pedido #${order.id} foi criado.`);
            props.onComplete(order);
          }),
          logError(true)
        );
      }
      return null;
    }
  });

  const handleEnter = useCallback(() => {
    formik.setValues(props.order ?? formik.initialValues, false);
  }, [formik, props.order]);

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  const { results } = data || ({ results: [] } as typeof data);

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleEnter}
      onExited={handleExit}
      TransitionComponent={Transition}
    >
      {formik.isSubmitting && <LinearProgress color='primary' />}

      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Novo Pedido</DialogTitle>
        <DialogContent className={classes.content}>
          <Fragment>
            <DialogTitle>Produtos </DialogTitle>
            <TableWrapper minWidth={500}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Preço</TableCell>
                    <TableCell>Adicionar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <EmptyAndErrorMessages
                    colSpan={3}
                    error={error}
                    loading={loading}
                    hasData={results.length > 0}
                    onTryAgain={refresh}
                  />
                  {results.map(product => (
                    <TableRow key={`product-${product.id}`}>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.amount}</TableCell>
                      <TableCell>{moneyFormat(product.price)}</TableCell>
                      <TableCell>
                        <Checkbox
                          onChange={event => {
                            product.selected = event.target.checked;
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </Fragment>

          <DialogActions>
            <Button onClick={props.onCancel}>Cancelar</Button>
            <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
              Salvar
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default FormDialog;
