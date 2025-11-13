// app/(protected)/_layout.js
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function ProtectedLayout() {
  return (
    <GestureHandlerRootView className="flex-1 bg-black">
      <Drawer
        screenOptions={{
          headerShown: true,
          // headerLeft: () => <DrawerToggleButton tintColor="#ffffff" />,
          drawerType: 'front',
          drawerStyle: { width: 260, backgroundColor: '#1E1E1E' },
          drawerActiveTintColor: '#ffffff',
          drawerInactiveTintColor: '#888888',
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { color: '#ffffff' },
          contentStyle: { backgroundColor: '#000000' },
        }}
      >
        {/* Drawer 안의 탭 그룹 */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: '홈 탭',
            title: '홈',
          }}
        />

        {/* Drawer 안의 개별 화면 */}
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: '설정',
            title: '설정',
          }}
        />
        <Drawer.Screen
          name="taksongs"
          options={{
            drawerLabel: '탁송 목록',
            title: '탁송 목록',
            headerShown: false, // Stack이 자체 헤더를 관리하므로 Drawer 헤더 숨김
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
