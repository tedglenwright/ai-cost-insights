import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { getKeys, addKey, deleteKey, getToken, login, setToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export default function Settings() {
  const [keys, setKeys] = useState<any[]>([]);
  const [provider, setProvider] = useState("Anthropic");
  const [keyName, setKeyName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const loadKeys = async () => {
    if (!getToken()) {
      const data = await login("ted@aioptimizer.demo", "Demo1234!");
      setToken(data.token);
    }
    const data = await getKeys();
    setKeys(data);
    setLoading(false);
  };

  useEffect(() => { loadKeys().catch(console.error); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addKey(provider, keyName, apiKey);
      setMsg("API key added!");
      setKeyName("");
      setApiKey("");
      loadKeys();
    } catch (err) {
      setMsg("Failed to add key");
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this key?")) return;
    await deleteKey(id);
    loadKeys();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-3">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold">Settings</h1>
          </header>
          <main className="flex-1 p-5 space-y-6">

            {/* Add API Key */}
            <div className="bg-card rounded-lg border p-5 max-w-xl">
              <h2 className="text-sm font-semibold mb-1">Add API Key</h2>
              <p className="text-xs text-muted-foreground mb-4">Connect your AI provider API keys</p>
              {msg && <p className="text-xs text-green-600 mb-3">{msg}</p>}
              <form onSubmit={handleAdd} className="space-y-3">
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Anthropic">Anthropic</SelectItem>
                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="OpenRouter">OpenRouter</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Key name (e.g. Production)"
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  className="h-9 text-sm"
                  required
                />
                <Input
                  type="password"
                  placeholder="API Key"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="h-9 text-sm font-mono"
                  required
                />
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? "Adding..." : "Add Key"}
                </Button>
              </form>
            </div>

            {/* Connected Keys */}
            <div className="bg-card rounded-lg border p-5 max-w-xl">
              <h2 className="text-sm font-semibold mb-1">Connected API Keys</h2>
              <p className="text-xs text-muted-foreground mb-4">{keys.length} key{keys.length !== 1 ? "s" : ""} connected</p>
              {loading ? (
                <p className="text-xs text-muted-foreground">Loading...</p>
              ) : keys.length === 0 ? (
                <p className="text-xs text-muted-foreground">No API keys yet</p>
              ) : (
                <div className="space-y-2">
                  {keys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-0">{key.provider}</Badge>
                        <div>
                          <p className="text-sm font-medium">{key.keyName}</p>
                          <p className="text-xs text-muted-foreground">Added {new Date(key.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(key.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
