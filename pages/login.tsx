import { supabase } from '@/lib/supabase-client';

export default function Login() {
  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`, // ログイン後のリダイレクト先
      },
    });
    if (error) console.error('GitHub login error:', error);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">ログイン</h1>
      <button
        onClick={handleGitHubLogin}
        className="px-6 py-3 bg-gray-800 text-white rounded-lg flex items-center space-x-2 hover:bg-gray-700"
      >
        <i className="fab fa-github"></i>
        <span>GitHub でログイン</span>
      </button>
    </div>
  );
}
