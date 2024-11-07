export const getPatents = async () => {
  const resp = await fetch(import.meta.env.VITE_SERVICE_HOST + "/v1/patent");
  const { patents } = await resp.json();
  return patents;
}
