export const isAuthenticated = () => {
  if (localStorage.getItem('hash')) {
    return true;
  }

  return false;
}
