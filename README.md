# Installation
- [React Native Environment](https://reactnative.dev/docs/environment-setup)
- Build thành công trên phiên bản Android Studio:

>Android Studio Chipmunk | 2021.2.1 Patch 1\
Build #AI-212.5712.43.2112.8609683, built on May 18, 2022\
Runtime version: 11.0.12+7-b1504.28-7817840 amd64\
VM: OpenJDK 64-Bit Server VM by Oracle Corporation
- Đối với thiết bị giả lập, lưu ý [tối thiểu 4GB RAM](https://stackoverflow.com/a/71309984
)

```bash
# debug variant
npx react-native run-android --variant=officialPlayDebug

# deploy variant
npx react-native run-android --variant=officialPlayRelease

```

- Để theo dõi log debug, chạy [Reactron](https://github.com/infinitered/reactotron/releases), chạy `adb reverse 9090:9090`

# Error
- Build lỗi:
  - Xóa thư mục `./node_moudles/` rồi cài lại
- Metro lỗi:
  - chạy `npx react-native start --reset-cache`
