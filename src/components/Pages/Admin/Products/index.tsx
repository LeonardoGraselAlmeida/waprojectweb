import React, { memo } from 'react';
import { Route, Switch } from 'react-router-dom';

import ProductListPage from './List';

const ProductIndexPage = memo(() => {
  return (
    <Switch>
      <Route path='/' component={ProductListPage} />
    </Switch>
  );
});

export default ProductIndexPage;
