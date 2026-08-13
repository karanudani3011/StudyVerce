import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, ImagePlus, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Input, Textarea, Avatar } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// ─── Banner Upload Constraints ────────────────────────────────────────────────
const BANNER_MIN_W  = 800;   // px
const BANNER_MIN_H  = 200;   // px
const BANNER_MAX_W  = 4000;  // px
const BANNER_MAX_H  = 1200;  // px
const BANNER_MAX_MB = 5;     // MB
const BANNER_MAX_BYTES = BANNER_MAX_MB * 1024 * 1024;

const IDEAL_HINT = `Recommended: 1200 × 300 px · Max ${BANNER_MAX_MB}MB · JPG or PNG`;

export default function EditProfile() {
  const { user, setUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [name, setName]               = useState(user?.name || '');
  const [username, setUsername]       = useState(user?.username || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [bio, setBio]                 = useState(user?.bio || '');
  const [avatar, setAvatar]           = useState(user?.avatar || '');
  const [coverImage, setCoverImage]   = useState(user?.coverImage || '');

  // Banner validation state
  const [bannerStatus, setBannerStatus] = useState(null); // null | 'loading' | 'ok' | 'error'
  const [bannerError, setBannerError]   = useState('');

  // ─── Avatar Upload ───────────────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('Profile photo must be less than 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      addToast('Profile photo updated!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // ─── Banner Upload with full validation ─────────────────────────────────────
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerStatus('loading');
    setBannerError('');

    // 1. File size check
    if (file.size > BANNER_MAX_BYTES) {
      setBannerStatus('error');
      setBannerError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is ${BANNER_MAX_MB}MB.`);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;

      // 2. Dimension check via an Image element
      const img = new Image();
      img.onload = () => {
        const { naturalWidth: w, naturalHeight: h } = img;

        if (w < BANNER_MIN_W || h < BANNER_MIN_H) {
          setBannerStatus('error');
          setBannerError(
            `Image is too small (${w}×${h}px). Minimum size is ${BANNER_MIN_W}×${BANNER_MIN_H}px.`
          );
          e.target.value = '';
          return;
        }

        if (w > BANNER_MAX_W || h > BANNER_MAX_H) {
          setBannerStatus('error');
          setBannerError(
            `Image is too large (${w}×${h}px). Maximum size is ${BANNER_MAX_W}×${BANNER_MAX_H}px.`
          );
          e.target.value = '';
          return;
        }

        // All checks passed ✓
        setCoverImage(dataUrl);
        setBannerStatus('ok');
        setBannerError('');
        addToast('Banner image updated!', 'success');
      };
      img.onerror = () => {
        setBannerStatus('error');
        setBannerError('Could not read image dimensions. Please try a different file.');
        e.target.value = '';
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const removeBanner = () => {
    setCoverImage('');
    setBannerStatus(null);
    setBannerError('');
    if (bannerInputRef.current) bannerInputRef.current.value = '';
  };

  // ─── Form Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    let formattedUsername = username.trim();
    if (formattedUsername && !formattedUsername.startsWith('@')) {
      formattedUsername = `@${formattedUsername}`;
    }

    try {
      await updateUserProfile({
        name: name.trim(),
        username: formattedUsername,
        institution: institution.trim(),
        bio: bio.trim(),
        avatar,
        coverImage,
      });

      addToast('Profile updated successfully! ✨', 'success');
      navigate('/profile');
    } catch (error) {
      addToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6 pb-24 md:pb-8">

        {/* Header */}
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

            {/* ── Banner Section ───────────────────────────────────────────── */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-[#1E293B]">Cover Banner</h3>
                {coverImage && (
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              {/* Banner Preview / Upload Zone */}
              <div
                onClick={() => bannerInputRef.current?.click()}
                className={`relative w-full h-36 rounded-[16px] overflow-hidden border-2 border-dashed cursor-pointer group transition-all
                  ${bannerStatus === 'error'
                    ? 'border-rose-400 bg-rose-50'
                    : bannerStatus === 'ok'
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#4F7DF6] hover:bg-[#EEF4FF]/40'
                  }`}
              >
                {coverImage ? (
                  <>
                    {/* Live Preview */}
                    <img
                      src={coverImage}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#1E293B]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-sm font-semibold">
                      <Camera className="w-5 h-5" /> Change Banner
                    </div>
                    {/* OK badge */}
                    {bannerStatus === 'ok' && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </div>
                    )}
                  </>
                ) : (
                  /* Empty state */
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#94A3B8] group-hover:text-[#4F7DF6] transition-colors">
                    <ImagePlus className="w-8 h-8" />
                    <span className="text-sm font-semibold">Click to upload banner image</span>
                    <span className="text-xs opacity-70">{IDEAL_HINT}</span>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />

              {/* Hint row — always visible */}
              <div className={`flex items-start gap-2 rounded-[10px] px-3 py-2.5 text-xs transition-all
                ${bannerStatus === 'error'
                  ? 'bg-rose-50 border border-rose-200 text-rose-600'
                  : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]'
                }`}
              >
                {bannerStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-rose-500" />
                    <span>{bannerError}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#94A3B8]" />
                    <span>
                      <strong className="text-[#475569]">Recommended size:</strong> 1200 × 300 px &nbsp;·&nbsp;
                      <strong className="text-[#475569]">Min:</strong> {BANNER_MIN_W} × {BANNER_MIN_H} px &nbsp;·&nbsp;
                      <strong className="text-[#475569]">Max file size:</strong> {BANNER_MAX_MB}MB &nbsp;·&nbsp;
                      JPG, PNG, or WebP
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* ── Avatar Section ────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-4 border-b border-[#EDF2F7]">
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                <Avatar src={avatar} size="2xl" alt={name} className="ring-4 ring-[#EEF4FF]" />
                <div className="absolute inset-0 bg-[#1E293B]/40 hover:bg-[#1E293B]/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6" />
                </div>
              </div>
              <div className="text-center sm:text-left space-y-2">
                <h3 className="text-sm font-bold text-[#1E293B]">Profile Photo</h3>
                <p className="text-xs text-[#94A3B8]">JPG or PNG · Max 2MB</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Button type="button" variant="outline" size="sm" onClick={() => avatarInputRef.current?.click()}>
                    Upload Photo
                  </Button>
                  {avatar && (
                    <Button
                      type="button" variant="outline" size="sm"
                      className="text-[#EF4444] border-[#FCA5A5] hover:bg-rose-50"
                      onClick={() => setAvatar('')}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  type="file" ref={avatarInputRef}
                  onChange={handleAvatarChange} accept="image/*" className="hidden"
                />
              </div>
            </div>

            {/* ── Form Fields ───────────────────────────────────────────────── */}
            <div className="space-y-4">
              <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Alex Johnson" />
              <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} required placeholder="e.g. @alexjohnson" />
              <Input label="Institution (School/University)" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="e.g. Stanford University" />
              <Input
                label="Profile Picture URL"
                value={avatar.startsWith('data:') ? '' : avatar}
                onChange={e => setAvatar(e.target.value)}
                placeholder="Paste an image URL (optional)"
              />
              <Textarea label="Academic Bio" value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Tell others about your learning interests..." />
            </div>

            {/* ── Actions ──────────────────────────────────────────────────── */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" fullWidth disabled={saving} onClick={() => navigate('/profile')}>Cancel</Button>
              <Button type="submit" variant="primary" fullWidth disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>

          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
