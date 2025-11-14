import { Redirect } from 'expo-router';

export default function Index() {
  // 스플래시 스크린 후 로그인 페이지로 이동
  return <Redirect href="/(auth)/login" />;
}
