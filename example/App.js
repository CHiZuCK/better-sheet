import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { BetterSheet } from 'better-sheet';
import { StatusBar } from 'expo-status-bar';

export default function App() {
    const [basicVisible, setBasicVisible] = useState(false);
    const [scrollableVisible, setScrollableVisible] = useState(false);
    const [smallVisible, setSmallVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.content}>
                <Text style={styles.title}>Better Sheet Demo</Text>
                <Text style={styles.subtitle}>
                    Try out different bottom sheet configurations
                </Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setBasicVisible(true)}
                    >
                        <Text style={styles.buttonText}>Basic Sheet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonSecondary]}
                        onPress={() => setScrollableVisible(true)}
                    >
                        <Text style={styles.buttonText}>Scrollable Content</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonTertiary]}
                        onPress={() => setSmallVisible(true)}
                    >
                        <Text style={styles.buttonText}>Small Sheet</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Basic Sheet */}
            <BetterSheet
                visible={basicVisible}
                onClose={() => setBasicVisible(false)}
                snapPoints={[0.3, 0.6, 0.9]}
                initialSnapIndex={1}
            >
                <Text style={styles.sheetTitle}>Basic Bottom Sheet</Text>
                <Text style={styles.sheetText}>
                    This is a basic bottom sheet with three snap points: 30%, 60%, and 90% of screen height.
                </Text>
                <Text style={styles.sheetText}>
                    Try dragging it up and down to see how it snaps to different positions.
                </Text>
                <Text style={styles.sheetText}>
                    You can also quickly swipe down to dismiss it completely.
                </Text>
            </BetterSheet>

            {/* Scrollable Sheet */}
            <BetterSheet
                visible={scrollableVisible}
                onClose={() => setScrollableVisible(false)}
                snapPoints={[0.4, 0.7, 0.95]}
                initialSnapIndex={1}
                backdropOpacity={0.5}
            >
                <Text style={styles.sheetTitle}>Scrollable Content</Text>
                <Text style={styles.sheetText}>
                    This sheet has lots of content. Try scrolling within the sheet!
                </Text>
                <Text style={styles.sheetText}>
                    When you're scrolled to the top and drag down, it will move the sheet instead.
                </Text>

                {Array.from({ length: 25 }).map((_, i) => (
                    <View key={i} style={styles.listItem}>
                        <Text style={styles.listItemNumber}>{i + 1}</Text>
                        <View style={styles.listItemContent}>
                            <Text style={styles.listItemTitle}>Item {i + 1}</Text>
                            <Text style={styles.listItemSubtitle}>
                                This is a sample list item with some content
                            </Text>
                        </View>
                    </View>
                ))}
            </BetterSheet>

            {/* Small Sheet */}
            <BetterSheet
                visible={smallVisible}
                onClose={() => setSmallVisible(false)}
                snapPoints={[0.25]}
                initialSnapIndex={0}
                backdropOpacity={0.25}
                closeOnBackdropPress={true}
            >
                <Text style={styles.sheetTitle}>Quick Action</Text>
                <Text style={styles.sheetText}>
                    This is a small sheet with only one snap point.
                </Text>
                <Text style={styles.sheetText}>
                    Perfect for quick actions or confirmations!
                </Text>
                <TouchableOpacity
                    style={[styles.button, { marginTop: 16 }]}
                    onPress={() => setSmallVisible(false)}
                >
                    <Text style={styles.buttonText}>Got it!</Text>
                </TouchableOpacity>
            </BetterSheet>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonSecondary: {
        backgroundColor: '#8b5cf6',
    },
    buttonTertiary: {
        backgroundColor: '#ec4899',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    sheetTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    sheetText: {
        fontSize: 16,
        color: '#4b5563',
        lineHeight: 24,
        marginBottom: 12,
    },
    listItem: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    listItemNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#9ca3af',
        width: 40,
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    listItemSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
});
