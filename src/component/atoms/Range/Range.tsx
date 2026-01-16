import React, { useRef, useState, useCallback } from "react";
import {
    View,
    StyleSheet,
    PanResponder,
    GestureResponderEvent,
    PanResponderGestureState,
    LayoutChangeEvent,
    ViewStyle,
    Animated,
} from "react-native";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { P } from "../Typhography/variants";

export type Mode = "single" | "range";

export type Props = {
    mode?: Mode;
    min?: number;
    max?: number;
    step?: number;
    value?: number; // for single controlled
    defaultValue?: number; // for single uncontrolled
    rangeValue?: [number, number]; // for range controlled
    defaultRange?: [number, number]; // for range uncontrolled
    onChange?: (val: number) => void;
    onChangeRange?: (val: [number, number]) => void;
    disabled?: boolean;
    height?: number;
    knobSize?: number;
    style?: ViewStyle;
    testID?: string;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const roundToStep = (v: number, step: number, min: number) =>
    Math.round((v - min) / step) * step + min;

export const Range: React.FC<Props> = ({
    mode = "single",
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    rangeValue,
    defaultRange = [min, max],
    onChange,
    onChangeRange,
    disabled = false,
    height = 6,
    knobSize = 20,
    style,
    testID,
}) => {
    const theme: any = useTheme();

    // resolve colors with fallbacks
    const trackBg = typeof theme.background01 === "function" ? theme.background01(100) : theme.colors?.surface ?? "#f0f0f0";
    const activeColor =
        typeof theme.button01 === "function"
            ? theme.button01(100)
            : typeof theme.primary01 === "function"
                ? theme.primary01(100)
                : theme.colors?.primary ?? "#0d6efd";

    // tooltip background (uses lighter surface shade)
    const tooltipBg = typeof theme.background01 === "function" ? theme.background01(75) : theme.colors?.surface ?? "#ffffff";
    // layout
    const trackWidthRef = useRef<number>(0);

    const isControlledSingle = typeof value === "number";
    const isControlledRange = Array.isArray(rangeValue);

    const [internalValue, setInternalValue] = useState<number>(defaultValue ?? min);
    const [internalRange, setInternalRange] = useState<[number, number]>([
        defaultRange[0] ?? min,
        defaultRange[1] ?? max,
    ]);

    const v = isControlledSingle ? (value as number) : internalValue;
    const rv: [number, number] = isControlledRange
        ? (rangeValue as [number, number])
        : internalRange;

    // Refs to always read latest current values inside responder closures
    const currentValueRef = useRef<number>(v);
    const currentRangeRef = useRef<[number, number]>(rv);

    // NEW: render-time dragging state so UI updates (tooltips) show while dragging
    const [isDragging, setIsDragging] = useState<boolean>(false);

    // keep refs in sync whenever values update
    React.useEffect(() => {
        currentValueRef.current = v;
    }, [v]);
    React.useEffect(() => {
        currentRangeRef.current = rv;
    }, [rv]);

    // helpers: value -> x (pixels) and x -> value
    const valueToX = useCallback(
        (val: number) => {
            const w = Math.max(1, trackWidthRef.current - knobSize);
            const ratio = (val - min) / (max - min || 1);
            return ratio * w;
        },
        [min, max, knobSize]
    );
    const xToValue = useCallback(
        (x: number) => {
            const w = Math.max(1, trackWidthRef.current - knobSize);
            const ratio = clamp(x / w, 0, 1);
            const raw = min + ratio * (max - min);
            const stepped = roundToStep(raw, step, min);
            return clamp(stepped, min, max);
        },
        [min, max, step, knobSize]
    );

    // Animated positions for rendering (create once)
    const leftX = useRef(new Animated.Value(0)).current;
    const rightX = useRef(new Animated.Value(0)).current;

    // Keep track of start positions when dragging begins
    const startLeftRef = useRef<number>(0);
    const startRightRef = useRef<number>(0);
    const isDraggingRef = useRef<boolean>(false); // existing ref

    // tooltip offset to help center small tooltip above knob (approx)
    const tooltipCenterOffset = useRef<number>(Math.max(-20 + knobSize / 2, -knobSize)).current;

    // initialize animated values when layout/value available
    const initAnimatedPositions = useCallback(() => {
        const l = valueToX(mode === "single" ? v : rv[0]);
        const r = valueToX(mode === "single" ? v : rv[1]);
        leftX.setValue(l);
        rightX.setValue(r);
        startLeftRef.current = l;
        startRightRef.current = r;
    }, [v, rv, valueToX, leftX, rightX, mode]);

    // sync animated when values change externally or when needed (but not during drag)
    React.useEffect(() => {
        if (isDraggingRef.current) return; // skip during drag to prevent jumps
        const targetLeft = valueToX(mode === "single" ? v : rv[0]);
        const targetRight = valueToX(mode === "single" ? v : rv[1]);
        Animated.timing(leftX, { toValue: targetLeft, duration: 120, useNativeDriver: false }).start();
        Animated.timing(rightX, { toValue: targetRight, duration: 120, useNativeDriver: false }).start();
        startLeftRef.current = targetLeft;
        startRightRef.current = targetRight;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [v, rv]);

    const onLayout = (e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        trackWidthRef.current = w;
        initAnimatedPositions();
    };

    // Pan handling - use start refs so dx is applied relative to start position
    const createResponder = (which: "left" | "right" | "single") =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => !disabled,
            onMoveShouldSetPanResponder: () => !disabled,
            onPanResponderGrant: () => {
                // set both ref and state to indicate dragging
                isDraggingRef.current = true;
                setIsDragging(true);

                // stop any running animation and capture current animated values
                try {
                    leftX.stopAnimation((val: number) => {
                        startLeftRef.current = val;
                        leftX.setValue(val);
                    });
                    rightX.stopAnimation((val: number) => {
                        startRightRef.current = val;
                        rightX.setValue(val);
                    });
                } catch {
                    // fallback: compute from current value -> pixel mapping
                    // use refs to avoid stale closure values
                    startLeftRef.current = valueToX(mode === "single" ? currentValueRef.current : currentRangeRef.current[0]);
                    startRightRef.current = valueToX(mode === "single" ? currentValueRef.current : currentRangeRef.current[1]);
                    leftX.setValue(startLeftRef.current);
                    rightX.setValue(startRightRef.current);
                }
            },
            onPanResponderMove: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                const dx = gestureState.dx;
                // compute new pixel pos relative to start
                if (mode === "single" || which === "single") {
                    const base = startLeftRef.current;
                    const newX = clamp(base + dx, 0, Math.max(0, trackWidthRef.current - knobSize));
                    const newVal = xToValue(newX);
                    // update internal state / callbacks
                    if (!isControlledSingle) {
                        setInternalValue(newVal);
                        currentValueRef.current = newVal; // keep ref in sync while dragging
                    } else {
                        currentValueRef.current = newVal;
                    }
                    onChange?.(newVal);
                    // update animated pos so knob and fill follow finger
                    leftX.setValue(newX);
                } else {
                    // range mode: left or right
                    if (which === "left") {
                        const base = startLeftRef.current;
                        let newX = clamp(base + dx, 0, Math.max(0, trackWidthRef.current - knobSize));
                        // ensure not to cross right knob (use current rightX value)
                        const currentRight = (rightX as any).__getValue ? (rightX as any).__getValue() : startRightRef.current;
                        newX = Math.min(newX, currentRight);
                        const newVal = xToValue(newX);
                        // update internal/range refs (keep currentRangeRef updated so release uses latest)
                        const rightVal = currentRangeRef.current[1];
                        const nextRange: [number, number] = [newVal, rightVal];
                        if (!isControlledRange) {
                            setInternalRange(nextRange);
                            currentRangeRef.current = nextRange;
                        } else {
                            currentRangeRef.current = nextRange;
                        }
                        onChangeRange?.(nextRange);
                        leftX.setValue(newX);
                    } else {
                        const base = startRightRef.current;
                        let newX = clamp(base + dx, 0, Math.max(0, trackWidthRef.current - knobSize));
                        const currentLeft = (leftX as any).__getValue ? (leftX as any).__getValue() : startLeftRef.current;
                        newX = Math.max(newX, currentLeft);
                        const newVal = xToValue(newX);
                        const leftVal = currentRangeRef.current[0];
                        const nextRange: [number, number] = [leftVal, newVal];
                        if (!isControlledRange) {
                            setInternalRange(nextRange);
                            currentRangeRef.current = nextRange;
                        } else {
                            currentRangeRef.current = nextRange;
                        }
                        onChangeRange?.(nextRange);
                        rightX.setValue(newX);
                    }
                }
            },
            onPanResponderRelease: () => {
                // clear dragging ref and state
                isDraggingRef.current = false;
                setIsDragging(false);

                // compute snap pixel positions from the latest refs (not stale closure values)
                const finalLeftVal = mode === "single" ? currentValueRef.current : currentRangeRef.current[0];
                const finalRightVal = mode === "single" ? currentValueRef.current : currentRangeRef.current[1];
                const snapLeft = valueToX(finalLeftVal);
                const snapRight = valueToX(finalRightVal);

                // animate to snapped positions for smooth finish
                Animated.parallel([
                    Animated.timing(leftX, { toValue: snapLeft, duration: 120, useNativeDriver: false }),
                    Animated.timing(rightX, { toValue: snapRight, duration: 120, useNativeDriver: false }),
                ]).start(() => {
                    // update start refs after animation
                    startLeftRef.current = snapLeft;
                    startRightRef.current = snapRight;
                });
            },
        });

    const leftResponder = useRef(createResponder(mode === "single" ? "single" : "left")).current;
    const rightResponder = useRef(createResponder("right")).current;

    // rendering positions: use Animated values directly
    const leftPos = leftX;
    const rightPos = rightX;

    const containerStyle: ViewStyle = {
        paddingVertical: 8,
    };

    // compute Animated fill left and width
    const halfKnob = knobSize / 2;
    const fillLeftAnimated = mode === "single" ? 0 : Animated.add(leftPos, halfKnob);
    const fillWidthAnimated =
        mode === "single" ? leftPos : Animated.add(Animated.subtract(rightPos, leftPos), 0);

    return (
        <View style={[styles.wrapper, containerStyle, style]} testID={testID}>
            <View style={styles.labelRow}>
                <P>{`${min}`}</P>
                <P>{`${max}`}</P>
            </View>

            <View style={[styles.trackWrap, { height }]} onLayout={onLayout}>
                <View style={[styles.track, { backgroundColor: trackBg, height }]} />

                {/* filled range */}
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            left: fillLeftAnimated as any,
                            width: fillWidthAnimated as any,
                            backgroundColor: activeColor,
                            height,
                            borderRadius: height / 2,
                        },
                    ]}
                    pointerEvents="none"
                />

                {/* Tooltip(s) shown while dragging: follow knobs */}
                {isDragging ? (
                    <>
                        {/* left tooltip */}
                        <Animated.View
                            style={[
                                styles.tooltip,
                                {
                                    transform: [{ translateX: Animated.add(leftPos, new Animated.Value(tooltipCenterOffset)) }],
                                    top: -(knobSize + 32),
                                    backgroundColor: tooltipBg,
                                },
                            ]}
                            pointerEvents="none"
                        >
                            <P themeToken="text01" style={styles.tooltipText}>
                                {mode === "single" ? String(currentValueRef.current) : String(currentRangeRef.current[0])}
                            </P>
                        </Animated.View>

                        {/* right tooltip (only for range mode) */}
                        {mode === "range" ? (
                            <Animated.View
                                style={[
                                    styles.tooltip,
                                    {
                                        transform: [{ translateX: Animated.add(rightPos, new Animated.Value(tooltipCenterOffset)) }],
                                        top: -(knobSize + 32),
                                        backgroundColor: tooltipBg,
                                    },
                                ]}
                                pointerEvents="none"
                            >
                                <P themeToken="text01" style={styles.tooltipText}>
                                    {String(currentRangeRef.current[1])}
                                </P>
                            </Animated.View>
                        ) : null}
                    </>
                ) : null}

                {/* left / single knob */}
                <Animated.View
                    {...(mode === "single" ? leftResponder.panHandlers : leftResponder.panHandlers)}
                    style={[
                        styles.knob,
                        {
                            width: knobSize,
                            height: knobSize,
                            borderRadius: knobSize / 2,
                            transform: [{ translateX: leftPos }],
                            backgroundColor: activeColor,
                            top: -(knobSize - height) / 2,
                            opacity: disabled ? 0.6 : 1,
                        },
                    ]}
                />

                {/* right knob for range */}
                {mode === "range" ? (
                    <Animated.View
                        {...rightResponder.panHandlers}
                        style={[
                            styles.knob,
                            {
                                width: knobSize,
                                height: knobSize,
                                borderRadius: knobSize / 2,
                                transform: [{ translateX: rightPos }],
                                backgroundColor: activeColor,
                                top: -(knobSize - height) / 2,
                                opacity: disabled ? 0.6 : 1,
                            },
                        ]}
                    />
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
    },
    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    trackWrap: {
        width: "100%",
        justifyContent: "center",
    },
    track: {
        position: "absolute",
        left: 0,
        right: 0,
        borderRadius: 999,
    },
    fill: {
        position: "absolute",
    },
    knob: {
        position: "absolute",
        left: 0,
        // shadow / elevation hint
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
    },
    // NEW: tooltip styles
    tooltip: {
        position: "absolute",
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: "#fff",
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    tooltipText: {
        textAlign: "center",
        fontSize: 12,
    },
});
