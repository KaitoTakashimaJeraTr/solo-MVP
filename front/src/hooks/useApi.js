export function useApi() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const post = async (path, body) => {
    const res = await fetch(`$/api${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const get = async (path) => {
    const res = await fetch(`$/api${path}`);
    return res.json();
  };

  return { get, post };
}
