import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, User, Bell, Shield, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    username: user?.username || '',
    contact: '',
    email: '',
  });

  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [updatingPwd, setUpdatingPwd] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase.from('users').select('contact, username').eq('id', user.id).maybeSingle();
      setProfile((p) => ({ ...p, username: data?.username || user.username, contact: data?.contact || '' }));
    };
    load();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ username: profile.username, contact: profile.contact })
        .eq('id', user.id);
      if (error) throw error;
      toast({ title: 'Profile Updated', description: 'Your profile has been saved.' });
      // Persist to local storage so UI reflects change next load
      const stored = localStorage.getItem('sternkern-user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.username = profile.username;
        parsed.contact = profile.contact;
        localStorage.setItem('sternkern-user', JSON.stringify(parsed));
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Failed', description: 'Could not save profile.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    if (!user) return;
    if (!pwd.current || !pwd.next || !pwd.confirm) {
      toast({ title: 'Missing fields', description: 'Fill all password fields.', variant: 'destructive' });
      return;
    }
    if (pwd.next !== pwd.confirm) {
      toast({ title: 'Mismatch', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    setUpdatingPwd(true);
    try {
      // Update password in users table after verifying current password
      const { data, error } = await supabase
        .from('users')
        .update({ password: pwd.next })
        .eq('id', user.id)
        .eq('password', pwd.current)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        toast({ title: 'Incorrect current password', description: 'Please try again.', variant: 'destructive' });
        return;
      }
      toast({ title: 'Password Updated', description: 'Use the new password next time you login.' });
      setPwd({ current: '', next: '', confirm: '' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Failed', description: 'Could not update password.', variant: 'destructive' });
    } finally {
      setUpdatingPwd(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Profile Settings</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" value={profile.contact} onChange={(e) => setProfile({ ...profile, contact: e.target.value })} />
            </div>
            <Button className="w-full" onClick={saveProfile} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payment Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified about upcoming payments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Requests</Label>
                <p className="text-sm text-muted-foreground">Alerts for new maintenance requests</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Monthly Reports</Label>
                <p className="text-sm text-muted-foreground">Automatic monthly financial reports</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
            </div>
            <Button variant="outline" className="w-full" onClick={updatePassword} disabled={updatingPwd}>
              {updatingPwd ? 'Updating...' : 'Update Password'}
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <CardTitle>System Settings</CardTitle>
            </div>
            <CardDescription>Application preferences and defaults</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Input id="currency" defaultValue="KSh" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Africa/Nairobi" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark theme</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
