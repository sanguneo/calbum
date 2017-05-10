### 우선 설정

    keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
    

~/.gradle/gradle.properties

    MYAPP_RELEASE_STORE_FILE=myapp.keystore
    MYAPP_RELEASE_KEY_ALIAS=myapp
    MYAPP_RELEASE_STORE_PASSWORD=myapp_pw
    MYAPP_RELEASE_KEY_PASSWORD=myapp_pw
