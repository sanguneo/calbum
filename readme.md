### 우선 설정

#### 키 생성
키 생성 : **<JAVA_HOME>/bin** 에서

    keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

~/.gradle/gradle.properties

    MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
    MYAPP_RELEASE_KEY_ALIAS=my-key-alias
    MYAPP_RELEASE_STORE_PASSWORD=myapp_store_pw
    MYAPP_RELEASE_KEY_PASSWORD=myapp_key_pw
