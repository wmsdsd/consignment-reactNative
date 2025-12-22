import { ActivityIndicator, FlatList, LayoutAnimation, Pressable, Text, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { dateFormatter } from '@/lib/utils';
import { usePushNotificationList, usePushNotificationRead } from '@/hooks/useApi';

const typeColor = {
    "INFO": "bg-primary",
    "MESSAGE": "bg-receive",
    "WARNING": "bg-dispute",
}

export default function notificationScreen() {
    const { data: list, isLoading, refetch } = usePushNotificationList()

    const readMutation = usePushNotificationRead()

    const renderEmptyList = () => {
        return <Text style={{ textAlign: 'center', marginTop: 20, color: 'white' }}>알림 내역이 없습니다.</Text>
    }

    const PushNotificationItem = ({ item }) => {
        const MAX_LINES = 1
        const [expanded, setExpanded] = useState(false)
        const [canExpand, setCanExpand] = useState(false)

        return (
            <View className="mb-4 w-full rounded-xl bg-[#1E1E1E] p-4">
                <View className={"flex-row items-center justify-between"}>
                    <View className={`rounded-md px-3 py-1 ${typeColor[item.type] || 'bg-gray-600'}`}>
                        <Text className="text-xs font-semibold text-white">{item.typeName}</Text>
                    </View>
                    <View>
                        <Text className={"color-white text-sm"}>{dateFormatter(item.createdAt)}</Text>
                    </View>
                </View>
                <View className={"flex-row justify-between mt-2"}>
                    <View>
                        <Text className={"color-white text-lg"}>{item.title}</Text>
                    </View>
                </View>
                <View className={"flex-row justify-between mt-2"}>
                    <View className={"flex-1 mr-4"}>
                        {!canExpand && (
                            <Text
                                style={{ position: "absolute", opacity: 0, zIndex: -1 }}
                                onTextLayout={(e) => {
                                    const lines = e?.nativeEvent?.lines;
                                    if (!lines) return;
                                    setCanExpand(lines.length > MAX_LINES);
                                }}
                            >
                                {item.content}
                            </Text>
                        )}

                        <Text
                            numberOfLines={expanded ? undefined : MAX_LINES}
                            className="text-white"
                        >
                            {item.content}
                        </Text>
                    </View>
                    <View>
                        {canExpand && (
                            <Pressable
                                onPress={() => {
                                    LayoutAnimation.configureNext(
                                        LayoutAnimation.Presets.easeInEaseOut
                                    );
                                    setExpanded((p) => !p);
                                }}
                            >
                                <Text className="text-blue-400 mt-1">
                                    {expanded ? "접기" : "더보기"}
                                </Text>
                            </Pressable>
                        )}
                    </View>

                </View>
            </View>
        )
    }

    useEffect(() => {
        ;(async () => {
            await readMutation.mutateAsync()
        })()
    }, [])

    return (
        isLoading
            ? (<ActivityIndicator size="large" color="#0000ff" />)
            : (
                <FlatList
                    data={list ?? []}
                    renderItem={({ item }) => (<PushNotificationItem item={item} />)}
                    keyExtractor={item => item.uid}
                    contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
                    className="flex-1 bg-black"
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyList}
                    refreshing={isLoading}
                    onRefresh={refetch}
                />
            )
    )
}