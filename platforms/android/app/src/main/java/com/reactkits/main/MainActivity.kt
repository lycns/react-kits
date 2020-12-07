package com.reactkits.main

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val btn = findViewById<Button>(R.id.open_rn)
        btn.setOnClickListener {
            val intent = Intent(this, ReactNativeActivity::class.java)
            startActivity(intent)
        }

        findViewById<Button>(R.id.open_download).setOnClickListener {
            val intent = Intent(this, DownloadActivity::class.java)
            startActivity(intent)
        }
    }
}
