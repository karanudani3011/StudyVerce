import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Input, Textarea, Avatar } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Handle local image file upload & convert to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        addToast('Profile picture preview loaded!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure username starts with '@'
    let formattedUsername = username.trim();
    if (formattedUsername && !formattedUsername.startsWith('@')) {
      formattedUsername = `@${formattedUsername}`;
    }

    setUser(prev => ({
      ...prev,
      name: name.trim(),
      username: formattedUsername,
      institution: institution.trim(),
      bio: bio.trim(),
      avatar: avatar
    }));

    addToast('Profile updated successfully! ✨', 'success');
    navigate('/profile');
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6 pb-24 md:pb-8">
        {/* Header with back navigation */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/profile')} 
            className="p-2 hover:bg-[#EEF4FF] text-[#64748B] hover:text-[#4F7DF6] rounded-[12px] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Edit Profile</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar upload/preview section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-4 border-b border-[#EDF2F7]">
              <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                <Avatar src={avatar} size="2xl" alt={name} className="ring-4 ring-[#EEF4FF]" />
                <div className="absolute inset-0 bg-[#1E293B]/40 hover:bg-[#1E293B]/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6" />
                </div>
              </div>

              <div className="text-center sm:text-left space-y-2">
                <h3 className="text-sm font-bold text-[#1E293B]">Profile Image</h3>
                <p className="text-xs text-[#94A3B8]">Upload a local image (JPG, PNG, max 2MB) or specify a picture URL below.</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                    Upload File
                  </Button>
                  {avatar && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="text-[#EF4444] border-[#FCA5A5] hover:bg-rose-50" 
                      onClick={() => setAvatar('')}
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <Input 
                label="Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="e.g. Alex Johnson"
              />

              <Input 
                label="Username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                placeholder="e.g. @alexjohnson"
              />

              <Input 
                label="Institution (School/University)" 
                value={institution} 
                onChange={e => setInstitution(e.target.value)} 
                placeholder="e.g. Stanford University"
              />

              <Input 
                label="Profile Picture URL" 
                value={avatar.startsWith('data:') ? '' : avatar} 
                onChange={e => setAvatar(e.target.value)} 
                placeholder="Paste an image URL (optional)"
              />

              <Textarea 
                label="Academic Bio" 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                rows={4} 
                placeholder="Tell others about your learning interests, subjects, or academic goals..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                fullWidth 
                onClick={() => navigate('/profile')}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
