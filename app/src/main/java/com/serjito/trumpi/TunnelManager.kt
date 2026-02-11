package com.serjito.trumpi

import android.content.Context
import android.content.Intent
import android.util.Log
import com.wireguard.android.backend.Backend
import com.wireguard.android.backend.GoBackend
import com.wireguard.android.backend.Tunnel
import com.wireguard.config.Config
import com.wireguard.config.InetNetwork
import com.wireguard.config.Interface
import com.wireguard.config.Peer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import java.net.InetAddress

class TunnelManager(private val context: Context) {

    private val backend: Backend = GoBackend(context)
    private val tunnelName = "TrumpiTunnel"
    
    // Estado observable para la UI
    private val _tunnelState = MutableStateFlow(Tunnel.State.DOWN)
    val tunnelState: StateFlow<Tunnel.State> = _tunnelState

    // Implementación simple de la interfaz Tunnel
    private val tunnel = object : Tunnel {
        override fun getName() = tunnelName
        override fun onStateChange(newState: Tunnel.State) {
            Log.d("TrumpiVPN", "Tunnel state changed: $newState")
            _tunnelState.value = newState
        }
    }

    // Configuración HARDCODED (Reemplazar con datos reales)
    // Para producción, esto debería venir de una API o archivo encriptado
    private fun getVpnConfig(): Config {
        val interfaceBuilder = Interface.Builder()
        
        // Clave Privada del Cliente (Generada en el servidor o app)
        // EJEMPLO: interfaceBuilder.parsePrivateKey("CLIENT_PRIVATE_KEY")
        interfaceBuilder.parsePrivateKey("cGFyYS1yZWVtcGxhemFyLWNvbi1jbYl2ZS1wcml2YWRhLQ==") // Placeholder
        
        // IP del Cliente en la VPN
        interfaceBuilder.addAddress(InetNetwork.parse("10.100.0.2/24"))
        interfaceBuilder.addDns(InetAddress.getByName("8.8.8.8"))

        val peerBuilder = Peer.Builder()
        // Clave Pública del Servidor
        // EJEMPLO: peerBuilder.parsePublicKey("SERVER_PUBLIC_KEY")
        peerBuilder.parsePublicKey("cGFyYS1yZWVtcGxhemFyLWNvbi1jbYl2ZS1wdWJsaWNhLQ==") // Placeholder
        
        // Endpoint (IP:Puerto del servidor VPN)
        peerBuilder.setEndpoint(com.wireguard.config.InetEndpoint.parse("192.168.1.100:51820")) // Placeholder
        
        // Allowed IPs (0.0.0.0/0 para todo el tráfico)
        peerBuilder.addAllowedIp(InetNetwork.parse("0.0.0.0/0"))
        
        // Keepalive (importante para NAT)
        peerBuilder.setPersistentKeepalive(25)

        return Config.Builder()
            .setInterface(interfaceBuilder.build())
            .addPeer(peerBuilder.build())
            .build()
    }

    fun getPermissionIntent(): Intent? {
        // WireGuard GoBackend devuelve null si ya tiene permisos
        return GoBackend.VpnService.prepare(context)
    }

    suspend fun connect() {
        try {
            val config = getVpnConfig()
            // setState es bloqueante en GoBackend, idealmente correr en IO Dispatcher
            backend.setState(tunnel, Tunnel.State.UP, config)
        } catch (e: Exception) {
            Log.e("TrumpiVPN", "Error connecting", e)
            _tunnelState.value = Tunnel.State.DOWN
        }
    }

    suspend fun disconnect() {
        try {
            backend.setState(tunnel, Tunnel.State.DOWN, null)
        } catch (e: Exception) {
            Log.e("TrumpiVPN", "Error disconnecting", e)
        }
    }
}
