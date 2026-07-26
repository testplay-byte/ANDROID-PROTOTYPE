package com.testplaybyte.setupwizard

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.testplaybyte.setupwizard.ui.theme.SetupWizardTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SetupWizardTheme {
                SetupWizardApp()
            }
        }
    }
}
