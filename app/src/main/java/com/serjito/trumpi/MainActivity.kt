package com.serjito.trumpi

import android.app.Activity
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.wireguard.android.backend.Tunnel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity() {

    private lateinit var tunnelManager: TunnelManager
    private lateinit var btnConnect: Button
    private lateinit var tvStatus: TextView
    
    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private val VPN_REQUEST_CODE = 100

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tunnelManager = TunnelManager(applicationContext)
        
        btnConnect = findViewById(R.id.btnConnect)
        tvStatus = findViewById(R.id.tvStatus)

        btnConnect.setOnClickListener {
            handleConnectClick()
        }

        // Observar cambios de estado
        scope.launch {
            tunnelManager.tunnelState.collect { state ->
                updateUi(state)
            }
        }
    }

    private fun handleConnectClick() {
        val intent = tunnelManager.getPermissionIntent()
        if (intent != null) {
            // Necesitamos permiso del usuario (primera vez)
            startActivityForResult(intent, VPN_REQUEST_CODE)
        } else {
            // Ya tenemos permiso, procedemos
            toggleVpn()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == VPN_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
            toggleVpn()
        } else if (requestCode == VPN_REQUEST_CODE) {
            Toast.makeText(this, "Se requiere permiso para conectar", Toast.LENGTH_LONG).show()
        }
    }

    private fun toggleVpn() {
        scope.launch(Dispatchers.IO) {
            if (tunnelManager.tunnelState.value == Tunnel.State.UP) {
                tunnelManager.disconnect()
            } else {
                tunnelManager.connect()
            }
        }
    }

    private fun updateUi(state: Tunnel.State) {
        runOnUiThread {
            when (state) {
                Tunnel.State.UP -> {
                    btnConnect.text = getString(R.string.disconnect)
                    btnConnect.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#333333")) // Normal
                    tvStatus.text = getString(R.string.status_connected)
                    tvStatus.setTextColor(ContextCompat.getColor(this, R.color.status_connected))
                }
                Tunnel.State.DOWN -> {
                    btnConnect.text = getString(R.string.connect)
                    btnConnect.backgroundTintList = ColorStateList.valueOf(ContextCompat.getColor(this, R.color.button_focused)) // Highlight
                    tvStatus.text = getString(R.string.status_disconnected)
                    tvStatus.setTextColor(ContextCompat.getColor(this, R.color.status_disconnected))
                }
                else -> {
                    btnConnect.text = "..."
                    tvStatus.text = "Cambiando estado..."
                }
            }
        }
    }
}
