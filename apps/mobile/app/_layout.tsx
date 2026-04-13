import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#0f1629' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: '#0f1629', borderTopColor: 'rgba(255,255,255,0.08)' },
          tabBarActiveTintColor: '#00e676',
          tabBarInactiveTintColor: '#64748b',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Dashboard', tabBarLabel: 'Home', tabBarIcon: ({ color }) => <TabIcon label="🏠" color={color} /> }}
        />
        <Tabs.Screen
          name="matches"
          options={{ title: 'Spiele', tabBarIcon: ({ color }) => <TabIcon label="⚽" color={color} /> }}
        />
        <Tabs.Screen
          name="accuracy"
          options={{ title: 'Trefferquote', tabBarIcon: ({ color }) => <TabIcon label="📊" color={color} /> }}
        />
      </Tabs>
    </>
  );
}

function TabIcon({ label, color }: { label: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20 }}>{label}</Text>;
}
