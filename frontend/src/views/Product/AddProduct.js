import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Chip,
} from "@material-ui/core";

import { Formik } from "formik";
import {
  getBranches,
  addProduct,
  getSimilarTags,
  getKitchens,
  initiateProductAdd,
  setProductInState,
} from "../../actions";
import { remoteValidate } from "../../modules/helpers";
import CustomisationList from "./CustomisationList";
import Toast from "../../modules/toast";

const AddProduct = () => {
  const dispatch = useDispatch();
  const branchState = useSelector((state) => state.branch);
  const kitchenState = useSelector((state) => state.kitchen);
  const productState = useSelector((state) => state.product);
  const userState = useSelector((state) => state.user)|| {};
const user = userState && userState.user || {}
  const [addCustomisation, setAddCustomisation] = useState(false);
  const [customisations, setCustomisations] = useState([]);
  const [image, setImage] = useState(null);
  const [tag, setTag] = useState([]);
  const [similarTags, setSimilarTags] = useState([]);
  const formErrors = useRef({});
  const formValues = useRef({});
  const fileEl = React.useRef(null);
  const [customisationItem, setCustomisationItem] = useState({
    title: "",
    itemDescription: "",
    itemPrice: "",
  });

  const branches = (branchState && branchState.branches) || [];
  const kitchens = (kitchenState && kitchenState.kitchens) || [];
  const tagState = useSelector((state) => state.tag);
  const similarTagsFromState = (tagState && tagState.similar) || [];

  const [product, setProduct] = useState({
    id: "",
    name: "",
    branchId: "",
    kitchenId: "",
    price: "",
    description: "",
    discount: 0,
    file: null,
    quantity: 0,
    tags: "",
    customisations: [],
    edit: false,
  });
  const customisationAdd = () => {
    setCustomisations([...customisations, customisationItem]);
    setCustomisationItem({
      title: "",
      itemDescription: "",
      itemPrice: "",
    });
  };
  const onCustomisationItemChange = (event) => {
    const { name, value } = event.target;
    setCustomisationItem({ ...customisationItem, [name]: value });
  };

  const customisationEdit = (customisation) => {
    setCustomisationItem(customisation);
    setCustomisations(
      customisations.filter((item) => {
        return customisation.title !== item.title;
      })
    );
  };

  const customisationDelete = (customisation) => {
    setCustomisations(
      customisations.filter((item) => customisation.title !== item.title)
    );
  };
  useEffect(() => {
    if (productState.selectedProduct) {
      const productClone = Object.assign({}, productState.selectedProduct);
      productClone.tags =
        (productClone.tags && productClone.tags.map((tag) => tag.name)) || "";
      setTag(productClone.tags);
      setProduct(productClone);
      setCustomisations(
        productClone.customisation.map((item) => ({
          title: item.name,
          itemDescription: item.description,
          itemPrice: item.price,
        })) || []
      );
    }
  }, [productState.selectedProduct]);

  const errorRules = {
    name: {
      required: true,
      remoteValidate: true,
      url: `${window.restAppConfig.api}product/validate?productName`,
      errorMessages: {
        required: "Product name is Required",
        remoteValidate: "Another product with same name exists",
      },
    },
    branchId: {
      required: true,
      errorMessages: {
        required: "Please select a branch",
      },
    },
    kitchenId: {
      required: true,
      errorMessages: {
        required: "Please select a kitchen",
      },
    },
    price: {
      required: true,
      errorMessages: {
        required: "Price is required",
      },
    },
  };

  const back = () => {
    dispatch(initiateProductAdd(false));
    dispatch(setProductInState({}));
  };

  const validate = async (values) => {
    const errors = {};
    for (let value in values) {
      if (errorRules[value] && errorRules[value].required) {
        if (!values[value]) {
          errors[value] = errorRules[value]["errorMessages"]["required"];
        }
        if (errorRules[value].remoteValidate) {
          if (
            formValues.current[value] !== values[value] ||
            formErrors.current[value]
          ) {
            let url = `${errorRules[value].url}=${values[value]}`;
            if(!values.branchId &&  user.role === 'admin')Toast({message: 'Branch should be selected for product name validation'})
            user.role === 'admin' ? url =  `${url}&branchId=${values.branchId}` : url =`${url}`  ;

            if (product.id) {
              url = `${url}&id=${product.id}`;
            }
            const result = await remoteValidate(url);
            if (!result)
              errors[value] =
                errorRules[value]["errorMessages"]["remoteValidate"];
          }
        }
      }
    }

    formErrors.current = errors;
    formValues.current = { ...formValues.current, values };
    return errors;
  };

  const onButtonClick = () => {
    fileEl.current.click();
  };

  const fileChange = (e) => {
    setImage(e.target.files[0]);
  };
  useEffect(() => {
    setSimilarTags(
      similarTagsFromState.map((tag) => {
        return tag.name;
      })
    );
  }, [similarTagsFromState]);
  useEffect(() => {
    dispatch(getKitchens());
    dispatch(getBranches());
  }, []);
  const getTagSuggestions = (branchId, tagName) => {
    dispatch(getSimilarTags({ branchId, tagName }));
  };
  return (
    <Formik
      enableReinitialize
      initialValues={product}
      validate={validate}
      onSubmit={(values, formik) => {
        formik.setSubmitting(false);
        values.branchName = branches.reduce(function (branchNameArray, branch) {
          if (branch.branchId === values.branchId) {
            branchNameArray.push(branch.name);
          }
          return branchNameArray;
        }, [])[0];

        values.kitchenName = kitchens.reduce(function (
          kitchenNameArray,
          kitchen
        ) {
          if (kitchen.id === values.kitchenId) {
            kitchenNameArray.push(kitchen.name);
          }
          return kitchenNameArray;
        },
        [])[0];

        values.edit = Boolean(product.id)
        values.file = image;
        values.tags = tag;
        values.customisations = JSON.stringify(customisations);
        const form = new FormData();
        for (let value in values) {
          form.append(value, values[value]);
        }
        dispatch(addProduct(form));
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
            <CardHeader subheader="Add new product" title="Add product" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Product Name"
                    margin="normal"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={2} xs={4}>
                  <TextField
                    error={Boolean(touched.price && errors.price)}
                    fullWidth
                    helperText={touched.price && errors.price}
                    label="Price"
                    margin="normal"
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={2} xs={4}>
                  <TextField
                    error={Boolean(touched.discount && errors.discount)}
                    fullWidth
                    helperText={touched.discount && errors.discount}
                    label="Discount"
                    margin="normal"
                    name="discount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.discount}
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                <Grid item md={2} xs={4}>
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

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Select Branch"
                    name="branchId"
                    margin="normal"
                    error={Boolean(touched.branchId && errors.branchId)}
                    helperText={touched.branchId && errors.branchId}
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.branchId}
                    variant="outlined"
                  >
                    <option key="" value=""></option>
                    {branches.map((branch) => (
                      <option key={branch.branchId} value={branch.branchId}>
                        {branch.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Select Kitchen"
                    name="kitchenId"
                    margin="normal"
                    error={Boolean(touched.kitchenId && errors.kitchenId)}
                    helperText={touched.kitchenId && errors.kitchenId}
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.kitchenId}
                    variant="outlined"
                  >
                    <option key="" value=""></option>
                    {kitchens.map((kitchen) => (
                      <option key={kitchen.id} value={kitchen.id}>
                        {kitchen.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="Product Description"
                    margin="normal"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    value={tag}
                    margin="normal"
                    onChange={(event, newValue) => {
                      setTag(newValue);
                    }}
                    options={similarTags}
                    getOptionLabel={(option) => option}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => {
                        return (
                          <Chip label={option} {...getTagProps({ index })} />
                        );
                      })
                    }
                    onInputChange={(event, newInput) => {
                      getTagSuggestions(values.branchId, newInput);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        variant="outlined"
                        placeholder="Tags"
                      />
                    )}
                  />
                </Grid>
                <Grid item md={2} xs={6}>
                  <input
                    accept="image/*"
                    type="file"
                    ref={fileEl}
                    onChange={fileChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant={image ? "contained" : "outlined"}
                    color="primary"
                    margin="normal"
                    onClick={() => onButtonClick()}
                  >
                    {image ? image.name : "Upload Pic"}
                  </Button>
                </Grid>
                {addCustomisation || customisations.length ? (
                  <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    item
                    md={10}
                    xs={10}
                  >
                    <Grid container md={12} spacing={2} xs={12}>
                      <Grid item md={6} xs={12}>
                        <TextField
                          error={Boolean(
                            touched.customisation && errors.customisation
                          )}
                          fullWidth
                          label="Item title"
                          margin="normal"
                          name="title"
                          onBlur={handleBlur}
                          onChange={(event) => {
                            onCustomisationItemChange(event);
                          }}
                          value={customisationItem.title}
                          variant="outlined"
                        />{" "}
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          error={Boolean(
                            touched.customisation && errors.customisation
                          )}
                          fullWidth
                          label="Item price"
                          margin="normal"
                          name="itemPrice"
                          onBlur={handleBlur}
                          onChange={(event) => {
                            onCustomisationItemChange(event);
                          }}
                          value={customisationItem.itemPrice}
                          variant="outlined"
                        />{" "}
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField
                          fullWidth
                          helperText={
                            touched.customisation && errors.customisation
                          }
                          label="Item description"
                          margin="normal"
                          name="itemDescription"
                          onBlur={handleBlur}
                          onChange={(event) => {
                            onCustomisationItemChange(event);
                          }}
                          value={customisationItem.itemDescription}
                          variant="outlined"
                        />{" "}
                      </Grid>
                    </Grid>

                    <Button
                      variant={"contained"}
                      color="primary"
                      margin="normal"
                      onClick={() => {
                        customisationAdd();
                      }}
                    >
                      Add
                    </Button>
                  </Grid>
                ) : (
                  <Box pt={2}>
                    <Button
                      variant={"contained"}
                      color="primary"
                      margin="normal"
                      size="small"
                      onClick={() => setAddCustomisation(!addCustomisation)}
                    >
                      Add Customisation
                    </Button>
                  </Box>
                )}
              {
                addCustomisation || customisations.length ? <Grid item md={12} xs={12}>
                <CustomisationList
                  onEdit={customisationEdit}
                  onDelete={customisationDelete}
                  list={customisations}
                />
              </Grid> : <span></span>
              } 
              </Grid>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="space-between" p={2}>
              <Button
                color="secondary"
                onClick={() => {
                  back();
                }}
                type="button"
                variant="contained"
              >
                Go back
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={isSubmitting}
                variant="contained"
              >
                {product.id ? "Update Product" : "Add Product"}
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default AddProduct;
