import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  Platform,
} from 'react-native';

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

/**
 * snapPoints: array of numbers between 0 and 1 representing
 *   visible sheet height as a fraction of screen height.
 * Example: [0.25, 0.55, 0.9]
 */
export function BetterSheet({
  visible,
  onClose,
  snapPoints = [0.25, 0.6, 0.9],
  initialSnapIndex = 1,
  backdropOpacity = 0.35,
  closeOnBackdropPress = true,
  children,
}) {
  const screenHeight = Dimensions.get('window').height;

  // Convert snapPoints (heights) to translateY positions (top offset)
  // translateY = how far from bottom the sheet is pushed down.
  // 0 => fully open to max snap height, screenHeight => offscreen
  const sortedSnaps = useMemo(
    () => [...snapPoints].map((p) => clamp(p, 0.05, 1)).sort((a, b) => a - b),
    [snapPoints]
  );

  const snapTranslateYs = useMemo(() => {
    // For each snap height H = p*screenHeight, translateY = screenHeight - H
    return sortedSnaps.map((p) => screenHeight - p * screenHeight);
  }, [sortedSnaps, screenHeight]);

  const maxOpenTranslateY = snapTranslateYs[0]; // smallest height => sheet lowest (most closed but still snapped)
  const minOpenTranslateY = snapTranslateYs[snapTranslateYs.length - 1]; // biggest height => sheet highest (most open)

  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  const [mounted, setMounted] = useState(visible);

  // Scroll coordination
  const scrollY = useRef(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const isDraggingSheet = useRef(false);
  const dragStartTranslateY = useRef(screenHeight);

  const animateTo = (toValue, { velocity } = {}) =>
    new Promise((resolve) => {
      Animated.spring(translateY, {
        toValue,
        velocity,
        damping: 28,
        stiffness: 260,
        useNativeDriver: true,
      }).start(() => resolve());
    });

  const openToIndex = async (index) => {
    const clampedIndex = clamp(index, 0, snapTranslateYs.length - 1);
    const targetY = snapTranslateYs[clampedIndex];

    // Backdrop on
    Animated.timing(backdrop, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    await animateTo(targetY);
  };

  const closeSheet = async () => {
    // Animate offscreen then notify parent
    await new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });

    onClose?.();
  };

  // Mount/unmount lifecycle
  useEffect(() => {
    if (visible) {
      setMounted(true);
      // Start from offscreen for clean open animation
      translateY.setValue(screenHeight);
      backdrop.setValue(0);
      openToIndex(initialSnapIndex);
    } else if (mounted) {
      // If parent hides it, we still animate out
      closeSheet().finally(() => setMounted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // When fully unmounted
  useEffect(() => {
    if (!visible && !mounted) {
      translateY.setValue(screenHeight);
      backdrop.setValue(0);
    }
  }, [visible, mounted, translateY, backdrop, screenHeight]);

  const findNearestSnap = (currentY, vy) => {
    // Predict a little based on velocity to feel natural
    const projected = currentY + vy * 120; // tweakable
    let nearest = snapTranslateYs[0];
    let minDist = Math.abs(projected - nearest);

    for (const s of snapTranslateYs) {
      const d = Math.abs(projected - s);
      if (d < minDist) {
        minDist = d;
        nearest = s;
      }
    }
    return nearest;
  };

  const shouldSetPanResponder = (_, gesture) => {
    // Only start sheet-drag when:
    // - user is dragging vertically
    // - and either:
    //    a) dragging down and scroll is at top
    //    b) dragging up (to expand) (optional) — we allow it generally
    const isVertical = Math.abs(gesture.dy) > Math.abs(gesture.dx);
    if (!isVertical) return false;

    const draggingDown = gesture.dy > 4;
    const draggingUp = gesture.dy < -4;

    const atTop = scrollY.current <= 0;

    if (draggingDown && atTop) return true;
    if (draggingUp) return true;

    return false;
  };

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: shouldSetPanResponder,
      onPanResponderGrant: () => {
        isDraggingSheet.current = true;
        setScrollEnabled(false);

        // Snapshot current translateY as baseline
        translateY.stopAnimation((value) => {
          dragStartTranslateY.current = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const base = dragStartTranslateY.current;
        const next = base + gesture.dy;

        // Allow dragging:
        // - up to minOpenTranslateY (most open)
        // - down to screenHeight (offscreen)
        const clamped = clamp(next, minOpenTranslateY, screenHeight);

        translateY.setValue(clamped);

        // Backdrop fades with openness (optional)
        const openness =
          1 -
          (clamped - minOpenTranslateY) / (screenHeight - minOpenTranslateY);
        backdrop.setValue(clamp(openness, 0, 1));
      },
      onPanResponderRelease: async (_, gesture) => {
        isDraggingSheet.current = false;
        setScrollEnabled(true);

        // Determine current translateY value
        let currentY = screenHeight;
        translateY.stopAnimation((value) => {
          currentY = value;
        });

        const vy = gesture.vy;
        const dy = gesture.dy;

        // If user pulled far enough down OR fast downward -> close
        const closeThresholdY =
          maxOpenTranslateY + 0.35 * (screenHeight - maxOpenTranslateY);
        const fastDown = vy > 1.3;

        if (currentY > closeThresholdY || (dy > 30 && fastDown)) {
          await closeSheet();
          return;
        }

        // Otherwise snap to nearest point
        const nearest = findNearestSnap(currentY, vy);

        // Restore backdrop fully on
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }).start();

        await animateTo(nearest, { velocity: vy });
      },
      onPanResponderTerminate: () => {
        isDraggingSheet.current = false;
        setScrollEnabled(true);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minOpenTranslateY, maxOpenTranslateY, screenHeight, snapTranslateYs]);

  if (!mounted) return null;

  const backdropStyle = {
    opacity: backdrop.interpolate({
      inputRange: [0, 1],
      outputRange: [0, backdropOpacity],
    }),
  };

  // Sheet container height = max snap height (largest fraction of screen)
  const maxSnapHeight = sortedSnaps[sortedSnaps.length - 1] * screenHeight;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeSheet}
    >
      <View style={styles.root}>
        {/* Backdrop (tap to close) */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeOnBackdropPress ? closeSheet : undefined}
          pointerEvents={closeOnBackdropPress ? 'auto' : 'none'}
        >
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </Pressable>

        {/* Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              height: maxSnapHeight,
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Grab handle */}
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>

          {/* Scrollable content */}
          <Animated.ScrollView
            scrollEnabled={scrollEnabled}
            bounces={true}
            onScroll={(e) => {
              scrollY.current = e.nativeEvent.contentOffset.y;
            }}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
            // This helps reduce weirdness during drag transitions
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'black',
  },
  sheet: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.14,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -6 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  handleArea: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D1D5DB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
