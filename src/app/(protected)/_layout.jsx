// app/(protected)/_layout.js
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerToggleButton } from "@react-navigation/drawer";

export default function ProtectedLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
            headerShown: true,
            headerLeft: () => <DrawerToggleButton />,
          drawerType: "front",
          drawerStyle: { width: 260 },
        }}
      >
        {/* Drawer 안의 탭 그룹 */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "홈 탭",
            title: "홈",
          }}
        />

        {/* Drawer 안의 개별 화면 */}
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "설정",
            title: "설정",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
