// app/index.js
import { Redirect } from "expo-router";

export default function Index() {
  // 앱 첫 진입 시 (protected)/(tabs)/home 으로 이동
  return <Redirect href="/(protected)/(tabs)/home" />;
}
