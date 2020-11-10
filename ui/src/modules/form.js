import { useFormik } from 'formik';

const Form = (initialValues, validationSchema) => {
  useFormik({
    initialValues,
    onSubmit: values => values,
    validationSchema,
  });
};

export default Form;
