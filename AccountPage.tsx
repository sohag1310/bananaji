import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  LogOut, 
  ShieldCheck
} from 'lucide-react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  User
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../lib/firebase';
import { saveUserProfileToFirebase } from '../lib/dbService';
import { UserProfile } from '../types';

interface AccountPageProps {
  currentUser: User | null;
  userProfile?: UserProfile | null;
  initialMode?: 'signin' | 'signup' | 'profile';
  onBackToHome: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  currentUser,
  userProfile,
  initialMode = 'signin',
  onBackToHome
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'profile'>(
    currentUser ? 'profile' : (initialMode === 'profile' ? 'signin' : initialMode)
  );

  // Sign In Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentUser) {
      setMode('profile');
    } else if (mode === 'profile') {
      setMode('signin');
    }
  }, [currentUser]);

  // Validation helpers
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[\s-]/g, '');
    return /^(?:\+?\d{8,15})$/.test(cleaned);
  };

  // 1. Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setSocialLoading('google');
      setErrorMessage('');
      setSuccessMessage('');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      await saveUserProfileToFirebase({
        uid: user.uid,
        displayName: user.displayName || 'Valued Member',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        photoURL: user.photoURL || '',
        providerId: 'google.com',
        createdAt: new Date().toISOString()
      });

      setSuccessMessage(`Welcome, ${user.displayName || 'Friend'}! Signed in successfully with Google.`);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in cancelled. Please complete the Google login popup.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setErrorMessage(err.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setSocialLoading(null);
    }
  };

  // 2. Facebook Sign In
  const handleFacebookSignIn = async () => {
    try {
      setSocialLoading('facebook');
      setErrorMessage('');
      setSuccessMessage('');
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      
      await saveUserProfileToFirebase({
        uid: user.uid,
        displayName: user.displayName || 'Valued Member',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        photoURL: user.photoURL || '',
        providerId: 'facebook.com',
        createdAt: new Date().toISOString()
      });

      setSuccessMessage(`Welcome, ${user.displayName || 'Friend'}! Signed in successfully with Facebook.`);
    } catch (err: any) {
      console.error('Facebook Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in cancelled. Please complete the Facebook login popup.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setErrorMessage('An account already exists with this email using Google or Password. Please sign in using that method.');
      } else {
        setErrorMessage(err.message || 'Failed to sign in with Facebook.');
      }
    } finally {
      setSocialLoading(null);
    }
  };

  // 3. Email/Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const errors: Record<string, string> = {};

    if (!loginEmail.trim()) {
      errors.loginEmail = 'Email address is required';
    } else if (!validateEmail(loginEmail)) {
      errors.loginEmail = 'Please enter a valid email address';
    }

    if (!loginPassword) {
      errors.loginPassword = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      setSuccessMessage('Signed in successfully!');
    } catch (err: any) {
      console.error('Email sign in error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMessage('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMessage('Too many failed attempts. Please try again in a few minutes or reset your password.');
      } else {
        setErrorMessage(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 4. Email/Password Registration
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!signupEmail.trim()) {
      errors.signupEmail = 'Email address is required';
    } else if (!validateEmail(signupEmail)) {
      errors.signupEmail = 'Please enter a valid email address (e.g. name@gmail.com)';
    }

    if (!signupPassword) {
      errors.signupPassword = 'Password is required';
    } else if (signupPassword.length < 6) {
      errors.signupPassword = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (signupPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.trim(), signupPassword);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName.trim()
      });

      await saveUserProfileToFirebase({
        uid: user.uid,
        displayName: fullName.trim(),
        email: signupEmail.trim(),
        phoneNumber: phoneNumber.trim(),
        photoURL: '',
        providerId: 'password',
        createdAt: new Date().toISOString()
      });

      setSuccessMessage('Account created successfully! Welcome to Banana Ji.');
    } catch (err: any) {
      console.error('Sign up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please sign in or use another email.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email format provided.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Please use at least 6 characters.');
      } else {
        setErrorMessage(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 5. Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const errors: Record<string, string> = {};

    if (!resetEmail.trim()) {
      errors.resetEmail = 'Please enter your registered email address';
    } else if (!validateEmail(resetEmail)) {
      errors.resetEmail = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setSuccessMessage(`A password reset link has been sent to ${resetEmail.trim()}. Please check your inbox.`);
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setErrorMessage('No account found with this email address.');
      } else {
        setErrorMessage(err.message || 'Failed to send password reset email.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 6. Sign Out
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setSuccessMessage('You have been logged out successfully.');
      setMode('signin');
    } catch (err: any) {
      console.error('Sign out error:', err);
      setErrorMessage('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserInitial = () => {
    const name = userProfile?.displayName || currentUser?.displayName || currentUser?.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-[85vh] bg-[#f8fafc] text-[#0f172a] font-sans pb-24">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#0ea5e9] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
          <div className="text-xs text-slate-500 font-medium">
            Banana Ji Account Portal
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Global Feedback Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-sm max-w-2xl mx-auto">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">{successMessage}</div>
          </div>
        )}

        {/* View 1: LOGGED IN USER PROFILE (Full Screen Page) */}
        {currentUser && mode === 'profile' ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* User Profile Header Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center text-2xl font-bold">
                      {getUserInitial()}
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a]">
                      {userProfile?.displayName || currentUser.displayName || 'Valued Member'}
                    </h1>
                    <p className="text-sm text-slate-500">{currentUser.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Member
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-semibold text-sm transition-colors cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Account Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium mb-1">Email Address</div>
                  <div className="text-sm font-semibold text-slate-800 break-all">{currentUser.email || 'None'}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium mb-1">Phone Number</div>
                  <div className="text-sm font-semibold text-slate-800">{userProfile?.phoneNumber || currentUser.phoneNumber || 'Not provided'}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium mb-1">Sign-In Provider</div>
                  <div className="text-sm font-semibold text-slate-800 capitalize">
                    {userProfile?.providerId?.replace('.com', '') || 'Password Account'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* View 2: SIGN IN / SIGN UP / FORGOT PASSWORD FULL SCREEN */
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-10">
            {/* Tabs for switching between Sign In and Sign Up */}
            {mode !== 'forgot' && (
              <div className="flex border-b border-slate-200 mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                    setFieldErrors({});
                  }}
                  className={`flex-1 pb-3.5 text-center text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'border-[#0ea5e9] text-[#0ea5e9]'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                    setSuccessMessage('');
                    setFieldErrors({});
                  }}
                  className={`flex-1 pb-3.5 text-center text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'border-[#0ea5e9] text-[#0ea5e9]'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Social Logins */}
            {mode !== 'forgot' && (
              <div className="space-y-3 mb-6">
                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={socialLoading !== null || loading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {socialLoading === 'google' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* Facebook Sign In */}
                <button
                  type="button"
                  onClick={handleFacebookSignIn}
                  disabled={socialLoading !== null || loading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {socialLoading === 'facebook' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  <span>Continue with Facebook</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="shrink-0 mx-4 text-slate-400 text-xs uppercase font-medium">Or continue with email</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
              </div>
            )}

            {/* FORM 1: SIGN IN */}
            {mode === 'signin' && (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (fieldErrors.loginEmail) setFieldErrors({ ...fieldErrors, loginEmail: '' });
                      }}
                      placeholder="name@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                        fieldErrors.loginEmail ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white`}
                    />
                  </div>
                  {fieldErrors.loginEmail && (
                    <p className="text-[11px] text-red-500 mt-1">{fieldErrors.loginEmail}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="text-xs text-[#0ea5e9] hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (fieldErrors.loginPassword) setFieldErrors({ ...fieldErrors, loginPassword: '' });
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border ${
                        fieldErrors.loginPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.loginPassword && (
                    <p className="text-[11px] text-red-500 mt-1">{fieldErrors.loginPassword}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0ea5e9] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Sign In to Banana Ji</span>
                </button>
              </form>
            )}

            {/* FORM 2: SIGN UP */}
            {mode === 'signup' && (
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: '' });
                      }}
                      placeholder="Your full name"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                        fieldErrors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white`}
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="text-[11px] text-red-500 mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (fieldErrors.phoneNumber) setFieldErrors({ ...fieldErrors, phoneNumber: '' });
                      }}
                      placeholder="+8801XXXXXXXXX"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                        fieldErrors.phoneNumber ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white`}
                    />
                  </div>
                  {fieldErrors.phoneNumber && (
                    <p className="text-[11px] text-red-500 mt-1">{fieldErrors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gmail / Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (fieldErrors.signupEmail) setFieldErrors({ ...fieldErrors, signupEmail: '' });
                      }}
                      placeholder="name@gmail.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                        fieldErrors.signupEmail ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white`}
                    />
                  </div>
                  {fieldErrors.signupEmail && (
                    <p className="text-[11px] text-red-500 mt-1">{fieldErrors.signupEmail}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => {
                          setSignupPassword(e.target.value);
                          if (fieldErrors.signupPassword) setFieldErrors({ ...fieldErrors, signupPassword: '' });
                        }}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border ${
                          fieldErrors.signupPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.signupPassword && (
                      <p className="text-[11px] text-red-500 mt-1">{fieldErrors.signupPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                        }}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border ${
                          fieldErrors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="text-[11px] text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Create Free Account</span>
                </button>
              </form>
            )}

            {/* FORM 3: FORGOT PASSWORD */}
            {mode === 'forgot' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="text-center pb-2">
                  <h3 className="text-lg font-bold text-slate-900">Reset Your Password</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the email address associated with your account and we will send you a password reset link.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => {
                        setResetEmail(e.target.value);
                        if (fieldErrors.resetEmail) setFieldErrors({ ...fieldErrors, resetEmail: '' });
                      }}
                      placeholder="name@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                        fieldErrors.resetEmail ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white`}
                    />
                  </div>
                  {fieldErrors.resetEmail && (
                    <p className="text-[11px] text-red-500 mt-1">{fieldErrors.resetEmail}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Send Reset Email</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-[#0ea5e9] transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
