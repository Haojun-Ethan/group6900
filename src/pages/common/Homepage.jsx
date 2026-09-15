import { useAuth } from "../../hooks/useAuth";

function Homepage() {
    const { user, logout } = useAuth();

    return (
        <div>
            <h1>Welcome, {user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Roles: {user.roles.join(', ')}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Homepage;