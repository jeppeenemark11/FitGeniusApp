import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { EmailAuthProvider, reauthenticateWithCredential, GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
import { deleteUser, updateProfile } from '@/lib/authFunctions';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';


const PasswordModal = ({ isOpen, onClose, onSubmit }: any) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(password);
    setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Confirm Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4"
            placeholder="Enter your password"
            required
          />
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Settings = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [draftName, setDraftName] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      const currentName = user.displayName || '';
      setProfile({ name: currentName, email: user.email || '' });
      setDraftName(currentName);
    }
  }, [user, router]);

  // Validate the display name
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z0-9 _-]{3,20}$/;
    return nameRegex.test(name);
  };

  // Handle input changes locally
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setDraftName(newName);
    setNameError(validateName(newName) ? null : 'Display name should be 3-20 characters long, and can only include letters, numbers, hyphens, or underscores.');
  };

  // Update profile only when "Confirm" is clicked
  const handleProfileChange = async () => {
    setShowErrors(true);
    if (!nameError && draftName) {
      await updateProfile(draftName, profile.email);
      setProfile({ ...profile, name: draftName });
      setSuccessMessage('Profile successfully updated.');
      setIsConfirming(false);
      setShowErrors(false);
    }
  };

  // Function to show password modal or directly prompt for Google reauthentication
  const promptForReauthentication = () => {
    if (user) {
      const isPasswordProvider = user.providerData.some((provider) => provider.providerId === 'password');
      if (isPasswordProvider) {
        setIsPasswordModalOpen(true);
      } else {
        handleReauthenticateAndDelete(); // Directly call reauthentication for Google
      }
    }
  };

  // Function to handle password confirmation and user deletion
  const handleReauthenticateAndDelete = async (password?: string) => {
    if (user) {
      try {
        if (password) {
          const credential = EmailAuthProvider.credential(user.email!, password);
          await reauthenticateWithCredential(user, credential);
        } else {
          const provider = new GoogleAuthProvider();
          await reauthenticateWithPopup(user, provider);
        }

        await deleteUser();
        router.push('/');
      } catch (error) {
        console.error('Error during re-authentication:', error);
        setErrorMessage('Re-authentication failed. Please try again.');
      } finally {
        if (password) {
          setIsPasswordModalOpen(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
       <Head>
        <title>Settings | FitGeniusApp</title>
        </Head>
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Profile Details */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Profile Details</h2>
          <div className="space-y-4">
            <input
              type="email"
              value={profile.email}
              placeholder="Email"
              className="w-full p-3 border rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed"
              readOnly
            />
            <input
              type="text"
              value={draftName}
              onChange={handleNameChange}
              placeholder="Name"
              className={`w-full p-3 border rounded-xl ${
                showErrors && nameError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              style={showErrors && nameError ? { animation: 'shake 0.4s ease' } : {}}
            />
            {showErrors && nameError && <p className="text-red-600">{nameError}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            {!isConfirming ? (
              <button
                onClick={() => setIsConfirming(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl transition hover:bg-blue-500"
              >
                Save Changes
              </button>
            ) : (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleProfileChange}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl transition hover:bg-green-500"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setIsConfirming(false);
                    setShowErrors(false);
                    setDraftName(profile.name);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl transition hover:bg-red-500"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Account Management */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Account Management</h2>
          {!confirmDelete ? (
            <div className="flex justify-center">
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-6 py-2 bg-red-600 text-white rounded-xl transition hover:bg-red-500"
              >
                Delete Account
              </button>
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <button
                onClick={promptForReauthentication}
                className="px-6 py-2 bg-red-600 text-white rounded-xl transition hover:bg-red-500"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-xl transition hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          )}
        </section>

        {/* Error Message */}
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

        {/* Password Modal */}
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handleReauthenticateAndDelete}
        />
      </div>
    </div>
  );
};

export default Settings;
