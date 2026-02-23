export function useApi() {
  const get = async (path) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api${path}`);
    return res.json();
  };

  const post = async (path, body) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  return { get, post };
}
