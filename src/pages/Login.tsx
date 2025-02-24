import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (err) {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {/* ... champs de formulaire ... */}
      </form>
    </div>
  );
} 