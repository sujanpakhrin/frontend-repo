import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load users from the backend.");
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <h1>Assignment 11 Multi-Tier Application</h1>

      <h2>Users</h2>

      {loading && <p>Loading users...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} — {user.email}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
