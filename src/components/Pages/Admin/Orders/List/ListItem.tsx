import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { moneyFormat } from 'formatters/money';
import { logError } from 'helpers/rxjs-operators/logError';
import IOrder, { enStatus } from 'interfaces/models/order';
import CloseIcon from 'mdi-react/CloseIcon';
import FileDocumentIcon from 'mdi-react/FileDocumentIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import orderService from 'services/order';
interface IProps {
  order: IOrder;
  onDetails: (order: IOrder) => void;
  onUpdateComplete: () => void;
}

const ListItem = memo((props: IProps) => {
  const { order, onDetails, onUpdateComplete } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => setError(null), []);

  const [handleDetails] = useCallbackObservable(() => {
    return of(true).pipe(
      tap(() => setLoading(true)),
      switchMap(() => orderService.getDescribe(order.id)),
      logError(),
      tap(
        current => {
          setLoading(false);
          onDetails(current);
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, [onDetails, order]);

  const [handleCancel] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja cancelar o pedido ${order.id}?`)).pipe(
      filter(ok => ok),
      tap(() => setLoading(true)),
      switchMap(() => orderService.cancel(order.id)),
      logError(),
      tap(
        () => {
          Toast.show(`Pedido #${order.id} foi cancelado`);
          setLoading(false);
          onUpdateComplete();
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, []);

  const options = useMemo<IOption[]>(() => {
    return enStatus[order.status] === enStatus.canceled
      ? [{ text: 'Detalhes', icon: FileDocumentIcon, handler: handleDetails }]
      : [
          { text: 'Detalhes', icon: FileDocumentIcon, handler: handleDetails },
          { text: 'Cancelar', icon: CloseIcon, handler: handleCancel }
        ];
  }, [handleCancel, handleDetails, order.status]);

  return (
    <TableRow>
      <TableCell>#{order.id}</TableCell>
      <TableCell>{enStatus[order.status]}</TableCell>
      <TableCell>{moneyFormat(order.total)}</TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
});

export default ListItem;
