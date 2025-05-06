
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Profile = () => {
  const [fullName, setFullName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex@example.com");
  const [company, setCompany] = useState("Acme Inc");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your plan and usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground">Current Plan</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-lg font-medium">Pro Plan</div>
                    <Badge variant="outline" className="bg-primary/10 text-primary">Active</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Member Since</div>
                  <div className="font-medium mt-1">March 15, 2023</div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium">Usage</div>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Landing Pages</span>
                      <span>7 / 20</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Heatmaps</span>
                      <span>3 / 15</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>A/B Tests</span>
                      <span>1 / 10</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
