console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

export function useApi() {
  const get = async (path) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api${path}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res.json();
  };

  const post = async (path, body) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });

    return res.json();
  };

  return { get, post };
}
