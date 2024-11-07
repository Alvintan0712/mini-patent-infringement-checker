export const checkInfringement = async payload => {
  const resp = await fetch(import.meta.env.VITE_SERVICE_HOST + "/v1/check", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await resp.json();
  return data;
}