```
my-blink-project/ (Root Repository)
├── backend/            <-- (โค้ด AWS Serverless ที่เราทำกัน)
│   ├── serverless.yml
│   ├── src/
│   └── package.json
├── frontend/           <-- (Next.js Dashboard ที่กำลังจะทำ)
│   ├── app/
│   └── package.json
├── mobile/             <-- (Android App ที่เพิ่งถามมา)
│   ├── app/
│   ├── build.gradle
│   └── settings.gradle
└── .github/
    └── workflows/      <-- (ตัวคุม CI/CD แยกงานกันทำ)
```

```
moblie/
├─ app/
│  ├─ src/main/java/com/example/tunnel/
│  │  ├─ MainActivity.kt
│  │  ├─ nav/NavGraph.kt
│  │  ├─ ui/SendScreen.kt
│  │  ├─ ui/ReceiveScreen.kt
│  │  ├─ ui/HistoryScreen.kt
│  │  ├─ data/HistoryRepo.kt
│  │  └─ net/TunnelClient.kt
│  ├─ src/androidTest/...
│  ├─ src/test/java/com/example/tunnel/HistoryRepoTest.kt
│  ├─ src/main/AndroidManifest.xml
│  └─ build.gradle
└─ settings.gradle
```
