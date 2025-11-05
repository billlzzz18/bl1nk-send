// MainActivity.kt
package com.example.tunnel

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.*
import com.example.tunnel.nav.NavItem
import com.example.tunnel.ui.HistoryScreen
import com.example.tunnel.ui.ReceiveScreen
import com.example.tunnel.ui.SendScreen
import com.example.tunnel.net.TunnelClient

class MainActivity : ComponentActivity() {

    private val baseUrl = "http://10.0.2.2:8080" // dev

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val client = TunnelClient(baseUrl, contentResolver)
        setContent {
            App(client)
        }
    }
}

@Composable
fun App(client: TunnelClient) {
    val navController = rememberNavController()
    val items = listOf(NavItem.Send, NavItem.Receive, NavItem.History)

    Scaffold(
        bottomBar = {
            NavigationBar {
                val current = navController.currentBackStackEntryAsState().value?.destination?.route
                items.forEach { item ->
                    NavigationBarItem(
                        selected = current == item.route,
                        onClick = { navController.navigate(item.route) },
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) }
                    )
                }
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = NavItem.Send.route,
            modifier = Modifier.padding(padding)
        ) {
            composable(NavItem.Send.route) { SendScreen(client) }
            composable(NavItem.Receive.route) { ReceiveScreen(client) }
            composable(NavItem.History.route) { HistoryScreen() }
        }
    }
}
