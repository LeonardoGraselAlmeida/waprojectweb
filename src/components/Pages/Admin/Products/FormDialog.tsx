import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IProduct from 'interfaces/models/product';
import React, { forwardRef, Fragment, memo, useCallback } from 'react';
import { tap } from 'rxjs/operators';
import productService from 'services/product';
import * as yup from 'yup';

interface IProps {
  opened: boolean;
  product?: IProduct;
  onComplete: (product: IProduct) => void;
  onCancel: () => void;
}

const validationSchema = yup.object().shape({
  description: yup.string().required().min(3).max(50),
  amount: yup.number().required().min(1),
  price: yup.number().required().min(1)
});

const useStyle = makeStyles({
  content: {
    width: 250,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const FormDialog = memo((props: IProps) => {
  const classes = useStyle(props);

  const formik = useFormikObservable<IProduct>({
    initialValues: {},
    validationSchema,
    onSubmit(model) {
      return productService.save(model).pipe(
        tap(product => {
          Toast.show(`${product.description} foi salvo.`);
          props.onComplete(product);
        }),
        logError(true)
      );
    }
  });

  const handleEnter = useCallback(() => {
    formik.setValues(props.product ?? formik.initialValues, false);
  }, [formik, props.product]);

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

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
        <DialogTitle>{formik.values.id ? 'Editar' : 'Novo'} Produto</DialogTitle>
        <DialogContent className={classes.content}>
          <Fragment>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField label='Descrição' name='description' formik={formik} />
              </Grid>
              <Grid item xs={12}>
                <TextField label='Quantidade' name='amount' mask='number' formik={formik} />
              </Grid>
              <Grid item xs={12}>
                <TextField label='Preço' name='price' mask='money' formik={formik} />
              </Grid>
            </Grid>
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
