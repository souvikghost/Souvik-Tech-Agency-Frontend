import { getAPI, postAPI, patchAPI, delAPI } from "../lib/api";

export const getPayments            = ()       => getAPI("/payments");
export const getPaymentByProject    = (id)     => getAPI(`/payments/project/${id}`);
export const getPaymentStats        = ()       => getAPI("/payments/stats");
export const createPayment          = (body)   => postAPI("/payments", body);
export const updatePayment          = (id, body) => patchAPI(`/payments/${id}`, body);
export const deletePayment          = (id)     => delAPI(`/payments/${id}`);