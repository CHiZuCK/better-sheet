# Better Sheet

A highly customizable and performant React Native bottom sheet component with smooth animations, snap points, and intelligent scroll coordination.

## Features

- 🎯 **Snap Points**: Define multiple heights where the sheet can rest
- 🎨 **Customizable**: Control backdrop opacity, close behavior, and initial position
- 📱 **Smart Scrolling**: Automatic scroll coordination - drag the sheet or scroll content seamlessly
- ⚡ **Performant**: Uses native driver for smooth 60fps animations
- 🤏 **Gesture Handling**: Intuitive drag-to-dismiss and snap-to-point gestures
- 🔧 **TypeScript Support**: Fully typed for better developer experience
- 📦 **Zero Dependencies**: Only requires React and React Native

## Installation

```bash
npm install better-sheet
```

or

```bash
yarn add better-sheet
```

## Usage

### Basic Example

```jsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BetterSheet } from 'better-sheet';

export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Sheet" onPress={() => setVisible(true)} />

      <BetterSheet
        visible={visible}
        onClose={() => setVisible(false)}
        snapPoints={[0.25, 0.5, 0.9]}
        initialSnapIndex={1}
      >
        <Text style={styles.title}>Hello from Better Sheet!</Text>
        <Text style={styles.content}>
          Drag me up or down to snap to different heights.
          Pull down quickly to dismiss.
        </Text>
      </BetterSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
```

### Advanced Example with Scrollable Content

```jsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BetterSheet } from 'better-sheet';

export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Menu" onPress={() => setVisible(true)} />

      <BetterSheet
        visible={visible}
        onClose={() => setVisible(false)}
        snapPoints={[0.3, 0.6, 0.95]}
        initialSnapIndex={1}
        backdropOpacity={0.5}
        closeOnBackdropPress={true}
      >
        <Text style={styles.header}>Menu Options</Text>
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} style={styles.item}>
            <Text>Item {i + 1}</Text>
          </View>
        ))}
      </BetterSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | **required** | Controls whether the sheet is visible |
| `onClose` | `() => void` | **required** | Callback fired when sheet is closed |
| `snapPoints` | `number[]` | `[0.25, 0.6, 0.9]` | Array of snap point heights as fractions of screen height (0-1) |
| `initialSnapIndex` | `number` | `1` | Index of snap point to open to initially |
| `backdropOpacity` | `number` | `0.35` | Opacity of the backdrop (0-1) |
| `closeOnBackdropPress` | `boolean` | `true` | Whether tapping backdrop closes the sheet |
| `children` | `ReactNode` | - | Content to render inside the sheet |

### Snap Points

Snap points are defined as fractions of the screen height:
- `0.25` = 25% of screen height
- `0.5` = 50% of screen height
- `0.9` = 90% of screen height

The sheet will automatically animate to the nearest snap point when released. You can define as many snap points as needed.

### Gestures

- **Drag Handle**: Drag the handle or sheet to move between snap points
- **Quick Swipe Down**: Quickly swipe down to dismiss the sheet
- **Scroll Content**: When scrolled to top, dragging down moves the sheet instead of scrolling
- **Backdrop Tap**: Tap the backdrop to close (if `closeOnBackdropPress` is true)

## How It Works

Better Sheet uses React Native's `PanResponder` for gesture handling and `Animated` API with native driver for performant animations. The component intelligently coordinates between sheet dragging and content scrolling:

- When content is scrolled to the top and you drag down, it moves the sheet
- When content is in the middle of scrolling, dragging moves the content
- Dragging up always tries to expand the sheet to the next snap point

## Local Testing

To test this package locally:

1. Clone the repository
```bash
git clone https://github.com/yourusername/better-sheet.git
cd better-sheet
```

2. Navigate to the example directory
```bash
cd example
npm install
```

3. Run on iOS or Android
```bash
# iOS
npm run ios

# Android
npm run android
```

## Requirements

- React Native >= 0.60.0
- React >= 16.8.0

## Platform Support

- ✅ iOS
- ✅ Android

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © better-sheet contributors

## Changelog

### 1.0.0 (2026-01-15)
- Initial release
- Snap points support
- Smooth animations with native driver
- Intelligent scroll coordination
- Customizable backdrop
- TypeScript definitions
