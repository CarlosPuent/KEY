import { useAuth0 } from '@auth0/auth0-react';

export default function Login() {
  const { loginWithRedirect, isLoading, error } = useAuth0();
  if (isLoading) return <p>Cargando…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{display:'flex',height:'100vh',justifyContent:'center',alignItems:'center',background:'#eef2f5'}}>
      <button onClick={()=>loginWithRedirect()}>Entrar con Auth0</button>
    </div>
  );
}