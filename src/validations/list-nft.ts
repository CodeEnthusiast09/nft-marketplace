import * as yup from "yup";

export const listNftValidationSchema = yup.object().shape({
  nftAddress: yup.string().required("This field is required"),
  tokenId: yup.string().required("This field is required"),
  paymentToken: yup.string().required("This field is required"),
  price: yup.string().required("This field is required"),
});
