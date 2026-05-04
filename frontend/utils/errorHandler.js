export const handleError = (err, fallback = "Something went wrong") => {
  if (!err.response) {
    return "Network error. Check your internet.";
  }

  return err.response?.data?.message || fallback;
};