rd build\testing\cooleriotmobile /s /q
sencha app build testing
cd build\testing\cooleriotmobile
"C:\Program Files\7-zip\7z.exe" a -r CoolerIotMobile.zip
cd..
cd..
cd..
rd cordova\www /s /q
md cordova\www
xcopy build\testing\cooleriotmobile\*.* cordova\www\*.* /s