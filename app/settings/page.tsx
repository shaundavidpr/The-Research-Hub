import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Settings, Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your application preferences and settings."
        icon={<Settings className="h-5 w-5 text-muted-foreground" />}
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your general application preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-save" className="flex flex-col space-y-1">
                  <span>Auto-save</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically save your work every few minutes
                  </span>
                </Label>
                <Switch id="auto-save" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="citation-auto" className="flex flex-col space-y-1">
                  <span>Automatic citation detection</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Detect and suggest citations when you paste text
                  </span>
                </Label>
                <Switch id="citation-auto" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="ai-suggestions" className="flex flex-col space-y-1">
                  <span>AI research suggestions</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Allow Aethon to suggest related research and papers
                  </span>
                </Label>
                <Switch id="ai-suggestions" defaultChecked />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your research workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span>Dark Mode</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </span>
                </Label>
                <Switch id="dark-mode" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="compact-view" className="flex flex-col space-y-1">
                  <span>Compact View</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Display more content with reduced spacing
                  </span>
                </Label>
                <Switch id="compact-view" />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">Receive notifications via email</span>
                </Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="deadline-reminders" className="flex flex-col space-y-1">
                  <span>Deadline Reminders</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get reminders for upcoming deadlines
                  </span>
                </Label>
                <Switch id="deadline-reminders" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="collaboration-updates" className="flex flex-col space-y-1">
                  <span>Collaboration Updates</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Notifications when team members make changes
                  </span>
                </Label>
                <Switch id="collaboration-updates" defaultChecked />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect with other research tools and services.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Settings className="h-12 w-12 text-muted-foreground/60 mb-4" />
                <h3 className="text-lg font-medium">Integrations coming soon</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  We're working on integrations with popular research tools, reference managers, and academic databases.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
