# 📱 APKPure Decompiled Android Project

Dự án Android được tái tạo từ việc decompile file APK của APKPure (v3.20.51).

## 🎯 Tính năng

- ✅ **Cấu trúc Android Studio hoàn chỉnh** - Sẵn sàng import và build
- ✅ **GitHub Actions tự động** - Build APK mỗi khi push code  
- ✅ **Tất cả resources gốc** - Layout, hình ảnh, strings, styles
- ✅ **Java code tái tạo** - Các class chính đã được convert từ smali
- ✅ **Build system hiện đại** - Gradle với Android Gradle Plugin mới nhất

## 📊 Thông tin APK

- **Package Name**: `com.apkpure.aegon`
- **Version**: 3.20.51
- **Target SDK**: 34 (Android 14)
- **Min SDK**: 21 (Android 5.0)
- **Build Tools**: 34.0.0

## 🚀 Cách sử dụng

### 1. Tự động build APK (Khuyến nghị)
```bash
# Push code lên GitHub
git push origin main

# GitHub Actions sẽ tự động:
# 1. Setup Android build environment  
# 2. Build debug APK
# 3. Tạo Release với APK đính kèm
# 4. APK sẵn sàng tải về
```

### 2. Build thủ công với Android Studio
```bash
# Mở Android Studio
# File → Open → Chọn thư mục này
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

### 3. Build với command line
```bash
./gradlew assembleDebug
# APK output: app/build/outputs/apk/debug/app-debug.apk
```

## 📥 Tải APK

Sau khi push code:
1. Vào tab **Actions** để xem quá trình build (5-10 phút)
2. Vào tab **Releases** để tải APK
3. File APK có tên `app-debug.apk`
4. Cài đặt trên điện thoại Android

## 🏗️ Cấu trúc dự án

```
app/
├── src/main/
│   ├── java/com/apkpure/aegon/
│   │   ├── application/AegonApplication.java    # Main Application
│   │   └── main/activity/
│   │       ├── SplashActivity.java              # Launcher activity
│   │       └── MainActivity.java                # Main activity
│   ├── res/                                     # Tất cả resources gốc
│   │   ├── layout/                              # UI layouts  
│   │   ├── drawable/                            # Icons, images
│   │   ├── values/                              # Strings, colors, styles
│   │   └── ... (40+ resource folders)
│   └── AndroidManifest.xml                      # App manifest
├── build.gradle                                 # Build configuration
└── proguard-rules.pro                           # ProGuard rules
```

## 🔧 Dependencies chính

- **AndroidX Libraries** - Core, AppCompat, Material Design
- **Networking** - Retrofit, OkHttp
- **Image Loading** - Glide
- **Database** - Room
- **UI Components** - RecyclerView, ViewPager2, CardView

## ⚡ GitHub Actions Workflow

File `.github/workflows/build-apk.yml` tự động:
- Setup Java 17 và Android SDK
- Build debug APK
- Tạo GitHub Release
- Upload APK artifact
- Lưu trữ APK trong 30 ngày

## 📋 Yêu cầu hệ thống

- **Android Studio**: Arctic Fox trở lên
- **JDK**: 17 trở lên  
- **Android SDK**: API level 34
- **Gradle**: 8.0+

## ⚠️ Lưu ý quan trọng

- Dự án này được tái tạo từ APK gốc cho mục đích học tập
- Code gốc thuộc về APKPure Inc.
- Không sử dụng cho mục đích thương mại
- Tuân thủ bản quyền phần mềm gốc

## 🐛 Troubleshooting

**Build failed?**
- Kiểm tra Java 17 được cài đặt
- Sync Gradle files
- Clean project: `./gradlew clean`

**APK không cài được?**
- Enable "Unknown sources" trên Android
- Kiểm tra file APK không bị lỗi
- Thử uninstall app cũ trước

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra GitHub Actions logs
2. Xem Issues tab trên repo
3. Đảm bảo follow đúng build instructions

---

**🎉 Chúc mừng! Bạn đã có một dự án Android hoàn chỉnh từ APK decompiled!**