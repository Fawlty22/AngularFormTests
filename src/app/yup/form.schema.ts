import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  newsletter: Yup.bool().oneOf([true], 'You must agree to the newsletter').required(),
  gender: Yup.string().oneOf(['Male', 'Female', 'Other'], 'Invalid gender').required('Gender is required'),
  interests: Yup.array().of(Yup.string()).min(1, 'At least one interest must be selected').required('Interests are required'),
});
