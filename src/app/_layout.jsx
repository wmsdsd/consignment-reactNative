import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { View } from 'react-native';
import { AuthProvider } from '../hooks/useAuth';
import '../../global.css';

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* <AuthProvider> */}
      <View className="bg-primary flex-1">
        <Slot />
      </View>
      {/* </AuthProvider> */}
    </QueryClientProvider>
  );
}
