export const getCompanies = async () => {
  const resp = await fetch(import.meta.env.VITE_SERVICE_HOST + "/company");
  const { companies } = await resp.json();
  return companies;
}
