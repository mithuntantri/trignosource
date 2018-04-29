#cordova plugin rm org.apache.cordova.console --save
cordova build --release android
cd platforms/android/build/outputs/apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore trignosource-mobileapps.keystore android-release-unsigned.apk trignosource-mobileapps
zipalign -v 4 android-release-unsigned.apk TrignoEd-v1.03.apk
