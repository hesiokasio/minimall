import AuthForm from '../../../components/auth/AuthForm';

export default function AdminLoginPage() {
  return (
    <AuthForm
      role="admin"
      loginTitle="Admin OS Login"
      signupTitle="Register Super Admin"
      loginSubtitle="Enter your credentials to access the admin workspace"
      signupSubtitle="Create a new administrator account in the database"
      redirectPath="/admin"
      emailPlaceholder="admin@minimall.com"
    />
  );
}