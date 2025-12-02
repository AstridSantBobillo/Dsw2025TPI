import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div className='
      flex
      flex-col
      justify-center
      h-[90dvh]
      bg-neutral-100
      sm:items-center
    '>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
