export const getPatents = async () => {
  const resp = await fetch(import.meta.env.VITE_SERVICE_HOST + "/patent")
  const { patents } = await resp.json();
  return patents;
}
