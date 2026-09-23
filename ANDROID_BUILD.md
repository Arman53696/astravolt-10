# Astravolt — Android (Capacitor) build guide

App ID: `app.nexora.astravolt` · App name: **Astravolt**

## What is set up
- `public/game/index.html` — the full game (bundled offline into the APK).
- `capacitor.config.ts` — Capacitor config, `webDir: public/game`.
- `android/` — native Android project (Gradle, Android Studio ready).
- `cordova-plugin-purchase` (Google Play Billing 9) is installed and wired
  to the shop through the native billing bridge at the bottom of the game's
  script. In a browser the shop still shows "Install from Google Play to
  purchase"; inside the app it uses real Play Billing.

## Toolchain versions (all latest)
- Capacitor 8.5.x (`@capacitor/core`, `cli`, `android`)
- compileSdk / targetSdk **36** (Android 16), minSdk 24
- Android Gradle Plugin **8.13.0**, Gradle **8.14.3**, JDK **21**
- Android Studio: latest stable (Narwhal or newer)
- cordova-plugin-purchase 13.18.x, cordova-android 14.0.1

## Build the APK / AAB
Run locally (needs latest Android Studio + JDK 21, not available in Lovable):


```bash
npm install
npx cap sync android
npx cap open android      # or: cd android && ./gradlew assembleRelease
```

- Debug APK: `cd android && ./gradlew assembleDebug`
  → `android/app/build/outputs/apk/debug/app-debug.apk`
- Play Store bundle: `cd android && ./gradlew bundleRelease`
  → `android/app/build/outputs/bundle/release/app-release.aab`

Sign the release build (Android Studio → Build → Generate Signed Bundle) or
add a `signingConfig` in `android/app/build.gradle` with your keystore.

## Google Play Console setup (required for purchases)
1. Create the app with package name `app.nexora.astravolt` and upload a
   signed AAB to **internal testing**, then install the game from that Play
   test link. A sideloaded APK can never buy anything — Play only sells to
   builds it delivered itself, signed with the same key.
2. Monetize → Products → In-app products: create products with exactly these
   IDs, set a price for each, and **activate** them:
   - consumable (coins): `coin_450, coin_900, coin_915, coin_1455, coin_1815,
     coin_2025, coin_2715, coin_3615, coin_3795, coin_4140, coin_4230,
     coin_4335, coin_4485, coin_4515, coin_4875, coin_4950, coin_5415,
     coin_7215, coin_9045, coin_9465, coin_18045, coin_22545, coin_27045,
     coin_36045, coin_45015, coin_90900`
   - non-consumable (remove ads): `ad_4`
3. Add license testers (Play Console → Setup → License testing) so purchases
   are free for you.
4. Prices shown in the shop come from Play automatically once the products are
   active. Until then the shop shows "isn't available on your Google Play
   account yet".

## Google Sign-In setup (required for login in the APK)
Login shows "sign-in failed" with no account picker when the signing key of
the installed APK isn't registered:
1. `cd android && ./gradlew signingReport` → copy the **SHA1** of the config
   you actually ship with (release key, not debug).
2. Firebase console → Project settings → your Android app
   (`app.nexora.astravolt`) → Add fingerprint → paste that SHA1.
3. Play Console → Setup → App signing → copy the **App signing key SHA-1**
   and add that fingerprint too (Play re-signs your AAB, so this is the key
   users actually get).
4. Download the refreshed `google-services.json` into `android/app/` if you
   use one, then rebuild. Fingerprint changes can take a few minutes.

## Notes
- Purchases are granted on-device. For fraud protection, verify purchase
  tokens server-side with the Google Play Developer API before granting coins.
- The web "Sign in with Google" (GSI) button does not work inside an Android
  WebView. Use "Continue as Guest", or add a native Google Sign-In plugin if
  you need accounts in the app.
- After changing anything in `public/game/`, run `npx cap sync android` again.

## Build/Gradle error হলে (Windows)

Android Studio বন্ধ করে PowerShell-এ:

```powershell
cd android
./gradlew --stop
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches"
Remove-Item -Recurse -Force .gradle, build, app\build -ErrorAction SilentlyContinue
./gradlew clean --no-daemon
./gradlew assembleRelease
```

শর্ত:
- Android Studio-র Gradle JDK অবশ্যই **JDK 21** (Settings > Build Tools > Gradle)।
- কোড আপডেটের পর সবসময়: `git pull` → `npm install` → `npx cap sync android`।
- release signing-এর জন্য `android/keystore.properties` + আসল `.jks` ফাইল লাগবে; না থাকলে release বিল্ড unsigned হবে কিন্তু ফেল করবে না।
