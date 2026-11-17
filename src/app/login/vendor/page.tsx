import AuthForm from '../../../components/auth/AuthForm';

export default function VendorLoginPage() {
  return (
    <AuthForm
      role="vendor"
      loginTitle="Vendor Portal Login"
      signupTitle="Register New Store"
      loginSubtitle="Sign in to manage your store, inventory, and orders"
      signupSubtitle="Create a vendor account to start selling on Minimall"
      redirectPath="/dashboard"
      emailPlaceholder="store@minimall.com"
    />
  );
}