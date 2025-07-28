package com.apkpure.aegon.application;

import android.content.Context;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.multidex.MultiDex;

/**
 * Main Application class for APKPure (decompiled from original APK)
 * This is a reconstruction based on the smali code found in the original APK
 */
public class AegonApplication extends android.app.Application {
    
    private boolean d = true;
    private ClassLoader e;
    
    static {
        // Enable vector drawables support
        AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
    }
    
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        
        // Install MultiDex support for large apps
        MultiDex.install(base);
        
        // Set application theme
        base.setTheme(R.style.AppTheme);
    }
    
    @Override
    public void onCreate() {
        super.onCreate();
        
        // Initialize application components
        initializeApplication();
    }
    
    private void initializeApplication() {
        // Add any initialization logic here
        // Based on original APKPure functionality
    }
}