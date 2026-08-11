import React, { useState } from 'react';
import { User, Shield, Bell, Lock, Globe, Trash2 } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Input, Toggle, Tabs } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [tab, setTab] = useState('account');
  const [notif, setNotif] = useState(true);

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Security & Password' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Settings</h1>
          <p className="text-sm text-[#64748B]">Manage your account credentials, preferences, and privacy.</p>
        </div>

        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        {tab === 'account' && (
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-[#1E293B]">Account Information</h3>
            <Input label="Email Address" value={user.email} disabled />
            <Input label="Institution / University" value={user.institution} />
            <Button variant="primary" onClick={() => addToast('Settings saved!', 'success')}>Save Settings</Button>
          </Card>
        )}

        {tab === 'security' && (
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-[#1E293B]">Change Password</h3>
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Button variant="primary" onClick={() => addToast('Password updated!', 'success')}>Update Password</Button>
          </Card>
        )}

        {tab === 'notifications' && (
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-[#1E293B]">Email & Push Alerts</h3>
            <Toggle checked={notif} onChange={setNotif} label="Receive daily study streak reminders" />
            <Toggle checked={true} onChange={() => {}} label="Receive notification when AI finishes grading notes" />
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
