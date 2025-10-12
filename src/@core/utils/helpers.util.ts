export const getResponseError = (error: any): string => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.error && error.error.message) {
    return error.error.message
  }
  return error.message;
}

export const syrianPhoneNumberRegex = /^(0?(?:93|98|99|94|95|96|91|92|50)\d{7})$/;

export const uriToBlob = async (uri: string) => {
  const response = await fetch(uri);
  return await response.blob();
};
