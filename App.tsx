import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Layout, 
  Code2, 
  Settings, 
  AlertTriangle, 
  ChevronRight,
  Monitor,
  Terminal,
  FileCode,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import Header from './components/Header';
import Section from './components/Section';
import CodeBlock from './components/CodeBlock';
import Sidebar from './components/Sidebar';
import GeminiExpert from './components/GeminiExpert';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('arch');
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar Navigation */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <Header />
        
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-20 pb-32">
          {activeSection === 'arch' && <ArchitectureSection />}
          {activeSection === 'integration' && <IntegrationSection />}
          {activeSection === 'structure' && <StructureSection />}
          {activeSection === 'code' && <CodeSnippetSection />}
          {activeSection === 'build' && <BuildSection />}
          {activeSection === 'risks' && <RisksSection />}
        </div>

        {/* Floating AI Action */}
        <button 
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl transition-all flex items-center gap-2 group"
        >
          <Sparkles size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Ask Android Senior Expert
          </span>
        </button>
      </main>

      {/* Gemini Expert Modal */}
      {isAiOpen && <GeminiExpert onClose={() => setIsAiOpen(false)} />}
    </div>
  );
};

const ArchitectureSection = () => (
  <Section id="arch" title="System Architecture" icon={<ShieldCheck className="text-blue-400" />}>
    <div className="space-y-4">
      <p className="text-lg text-slate-400 leading-relaxed">
        Building for low-end Android TV boxes requires a <span className="text-white font-semibold">Lean & Reliable</span> architecture. 
        We prioritize memory efficiency and D-pad interaction.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
            <Cpu size={18} /> Presentation Layer
          </h3>
          <ul className="text-sm space-y-2 text-slate-400">
            <li>• <span className="text-slate-200">Leanback UI:</span> Minimalist design with high-contrast focus states.</li>
            <li>• <span className="text-slate-200">Single Activity:</span> Reduction in lifecycle overhead.</li>
            <li>• <span className="text-slate-200">LiveData/StateFlow:</span> Reactive UI updates for connection status.</li>
          </ul>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
            <Settings size={18} /> Service Layer
          </h3>
          <ul className="text-sm space-y-2 text-slate-400">
            <li>• <span className="text-slate-200">VpnService:</span> Android's native hook for tunnel management.</li>
            <li>• <span className="text-slate-200">WireGuard Backend:</span> Wrapping the official Go-userspace implementation.</li>
            <li>• <span className="text-slate-200">Foreground Service:</span> Ensures stability on RAM-constrained devices.</li>
          </ul>
        </div>
      </div>
    </div>
  </Section>
);

const IntegrationSection = () => (
  <Section id="integration" title="WireGuard Integration" icon={<Terminal className="text-purple-400" />}>
    <div className="prose prose-invert max-w-none space-y-6">
      <p className="text-slate-400">
        We utilize the official <code className="bg-slate-800 px-1.5 py-0.5 rounded">com.wireguard.android:wireguard-android</code> library. 
        On cheap TV boxes (Android 9+), we target the <span className="text-white">Userspace Go-backend</span> because most of these kernels do not have the native WireGuard module compiled in.
      </p>
      
      <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h4 className="text-blue-300 font-bold mb-1">Why Go-userspace?</h4>
        <p className="text-sm text-slate-300 italic">
          While slightly heavier on CPU than a kernel module, it offers 100% compatibility across 
          heterogeneous hardware found in generic TV boxes.
        </p>
      </div>

      <div className="space-y-4 mt-6">
        <h4 className="text-white font-semibold">Implementation Strategy:</h4>
        <ol className="list-decimal pl-5 space-y-3 text-slate-400">
          <li>Instantiate <code className="text-slate-200">GoBackend</code> using the Application Context.</li>
          <li>Parse static configuration into a <code className="text-slate-200">Config</code> object.</li>
          <li>Map the Config to a named tunnel (e.g., "wg_tv_tunnel").</li>
          <li>Handle Permission Request for <code className="text-slate-200">VpnService.prepare()</code>.</li>
        </ol>
      </div>
    </div>
  </Section>
);

const StructureSection = () => (
  <Section id="structure" title="Project Structure" icon={<Layout className="text-yellow-400" />}>
    <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm border border-slate-800">
      <div className="text-slate-500">app/src/main/kotlin/com/example/wgtv/</div>
      <div className="pl-4 mt-2 space-y-1">
        <div>├── <span className="text-blue-400">di/</span> <span className="text-slate-500">// Minimal Hilt/Manual Injection</span></div>
        <div>├── <span className="text-blue-400">service/</span></div>
        <div className="pl-4">└── <span className="text-green-400">WireGuardVpnService.kt</span> <span className="text-slate-500">// VpnService implementation</span></div>
        <div>├── <span className="text-blue-400">ui/</span></div>
        <div className="pl-4">├── <span className="text-green-400">MainActivity.kt</span> <span className="text-slate-500">// One-button Entry</span></div>
        <div className="pl-4">└── <span className="text-green-400">MainViewModel.kt</span> <span className="text-slate-500">// Connection state mgmt</span></div>
        <div>├── <span className="text-blue-400">tunnel/</span></div>
        <div className="pl-4">└── <span className="text-green-400">TunnelManager.kt</span> <span className="text-slate-500">// Backend wrapper</span></div>
        <div>├── <span className="text-blue-400">util/</span></div>
        <div className="pl-4">└── <span className="text-green-400">ConfigLoader.kt</span> <span className="text-slate-500">// Assets config parser</span></div>
      </div>
    </div>
  </Section>
);

const CodeSnippetSection = () => (
  <Section id="code" title="Core Code Snippets" icon={<Code2 className="text-indigo-400" />}>
    <div className="space-y-12">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
          <FileCode size={18} className="text-indigo-400" /> Tunnel Implementation
        </h3>
        <CodeBlock 
          language="kotlin"
          title="SimpleTunnel.kt"
          code={`class SimpleTunnel(private val name: String) : Tunnel {
    override fun getName(): String = name
    
    override fun onStateChange(newState: Tunnel.State) {
        // Broadcast state to UI (CONNECTED, DISCONNECTED, etc)
    }
}`}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
          <FileCode size={18} className="text-indigo-400" /> Backend Management
        </h3>
        <CodeBlock 
          language="kotlin"
          title="TunnelManager.kt"
          code={`class TunnelManager(context: Context) {
    private val backend = GoBackend(context)
    private val tunnel = SimpleTunnel("WG_TV")

    suspend fun toggle() {
        val currentState = backend.getState(tunnel)
        if (currentState == Tunnel.State.UP) {
            backend.setState(tunnel, Tunnel.State.DOWN, null)
        } else {
            val config = loadHardcodedConfig()
            backend.setState(tunnel, Tunnel.State.UP, config)
        }
    }

    private fun loadHardcodedConfig(): Config {
        // Pre-defined in constants or assets
        return Config.Builder()
            .setInterface(Interface.Builder()
                .addAddress(InetNetwork.parse("10.0.0.2/32"))
                .parsePrivateKey(PRIVATE_KEY)
                .build())
            .addPeer(Peer.Builder()
                .addAllowedIp(InetNetwork.parse("0.0.0.0/0"))
                .setEndpoint(InetEndpoint.parse("SERVER_IP:51820"))
                .parsePublicKey(SERVER_PUB_KEY)
                .build())
            .build()
    }
}`}
        />
      </div>
    </div>
  </Section>
);

const BuildSection = () => (
  <Section id="build" title="Build & Sideloading" icon={<Monitor className="text-orange-400" />}>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="text-white font-bold">Build Considerations</h4>
        <ul className="text-sm space-y-3 text-slate-400">
          <li className="flex gap-2">
            <ChevronRight size={16} className="text-orange-400 flex-shrink-0" />
            <span>Target SDK 28+ to ensure VpnService stability on older boxes.</span>
          </li>
          <li className="flex gap-2">
            <ChevronRight size={16} className="text-orange-400 flex-shrink-0" />
            <span>Use R8/ProGuard to shrink APK size (critical for low storage devices).</span>
          </li>
          <li className="flex gap-2">
            <ChevronRight size={16} className="text-orange-400 flex-shrink-0" />
            <span>Include <code className="bg-slate-800 px-1 rounded">android:banner</code> for TV launcher.</span>
          </li>
        </ul>
      </div>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h4 className="text-white font-bold mb-4">Sideloading Strategy</h4>
        <p className="text-xs text-slate-500 mb-4 font-mono">
          # Typical ADB install command
          adb install -r wgtv-release.apk
        </p>
        <div className="space-y-2 text-sm text-slate-300">
          <p>1. Sign with a production V2/V3 signature.</p>
          <p>2. Ensure <code className="text-orange-300">RECEIVE_BOOT_COMPLETED</code> permission if auto-start is needed.</p>
          <p>3. Use <code className="text-orange-300">alwaysOnVpn</code> system setting for high reliability.</p>
        </div>
      </div>
    </div>
  </Section>
);

const RisksSection = () => (
  <Section id="risks" title="Limitations & Risks" icon={<AlertTriangle className="text-red-400" />}>
    <div className="space-y-6">
      <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-xl space-y-4">
        <p className="text-slate-300">Low-end TV boxes (AllWinner/Rockchip) present unique challenges:</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="text-red-400 font-bold text-sm uppercase tracking-wider">Memory Constraints</h5>
            <p className="text-sm text-slate-400">Aggressive LMK (Low Memory Killer) might kill the VPN service. Must use a Foreground Service with a sticky notification.</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-red-400 font-bold text-sm uppercase tracking-wider">CPU Overhead</h5>
            <p className="text-sm text-slate-400">Go-userspace encryption consumes cycles. 4K streaming might stutter if the box has < 4 cores or low clock speed.</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-red-400 font-bold text-sm uppercase tracking-wider">Storage Speed</h5>
            <p className="text-sm text-slate-400">Loading configs from flash might be slow. Cache the Config object in memory after the first read.</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-red-400 font-bold text-sm uppercase tracking-wider">System Limitations</h5>
            <p className="text-sm text-slate-400">Some cheap boxes have "broken" VpnService implementations. Test against multiple firmware versions.</p>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

export default App;