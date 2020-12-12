import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Container,
  CardHeader,
  Grid,
  TextField
} from '@material-ui/core';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../../actions';


const Order = ({ className, table, ...rest }) => {

  const dispatch = useDispatch();
  const productState = useSelector(state => state.product);
  const tableState = useSelector(state => state.table);

  const products= productState && productState.products || []
  return (
    <Box display="flex" flexDirection="column" height="100%" justifyContent="center">
      <Container maxWidth="sm">
        <Formik
          initialValues={{
            tableId: '',
            productId: '',
            productName: '',
            quantity:1,
            notes:'',
            status:'ordered'
          }}
          validationSchema={Yup.object().shape({
              productId: Yup.string()
              .max(255)
              .required('Please select an item'),
              quantity: Yup.number()
              .required('Please select quantity'),
          })}
          onSubmit={(values, formik) => {
            values.productName = products.reduce(function(productNameArray, product) {
              if (product.id === values.productId) {
                productNameArray.push(product.name);
              }
              return productNameArray;
            }, [])[0]
            values.tableId = tableState && tableState.selectedTable && tableState.selectedTable.id
            dispatch(addOrder(values));
            formik.setSubmitting(false);
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <form onSubmit={handleSubmit}>
               <Card>
            <CardHeader subheader="Place an order" title="Place order" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Select Product"
                    name="productId"
                    error={Boolean(touched.productId && errors.productId)}
                    helperText={touched.productId && errors.productId}
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.productId}
                    variant="outlined"
                  >
                      <option key="" value="">
                      </option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.quantity && errors.quantity)}
                    fullWidth
                    helperText={touched.quantity && errors.quantity}
                    label="Quantity"
                    margin="normal"
                    name="quantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quantity}
                    variant="outlined"
                    type="number"
                  />
                </Grid>
          
                <Grid item md={12} xs={12}>
                  <TextField
                    error={Boolean(touched.notes && errors.notes)}
                    fullWidth
                    helperText={touched.notes && errors.notes}
                    label="Notes"
                    margin="normal"
                    name="notes"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.notes}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button color="primary" type="submit" variant="contained">
                Save details
              </Button>
            </Box>
          </Card>
            </form>
          )}
        </Formik>
      </Container>
    </Box>
  );
};

Order.propTypes = {
  className: PropTypes.string,
};

export default Order;
