export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to manage your stacks.
          </p>
        </div>
        {/* TODO: Sign-in form / OAuth buttons */}
      </div>
    </div>
  );
}
