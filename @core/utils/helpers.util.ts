export const getResponseError = (error: any): string => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.error && error.error.message) {
    return error.error.message
  }
  return error.message;
}
