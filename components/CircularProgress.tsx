import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Svg, Path, G, Circle } from "react-native-svg";

type Props = {
    style?: StyleProp<ViewStyle>;
    size: number;
    progress: number;
    progressWidth: number;
    progressColor?: string;
    progressTintColor?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
};

function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
}

function createCirclePath(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
) {
    var start = polarToCartesian(x, y, radius, endAngle * 0.9999);
    var end = polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
    ];
    return d.join(" ");
}

const CircularProgress: React.FC<Props> = ({
    size,
    progressWidth,
    progressColor,
    progressTintColor,
    backgroundColor,
    style,
    progress,
    children,
}) => {
    const radius = size / 2;

    const currentFillAngle = (360 * Math.min(100, Math.max(0, progress))) / 100;
    const circlePath = createCirclePath(
        radius,
        radius,
        radius - 4,
        0,
        currentFillAngle
    );

    const fullCirclePath = createCirclePath(radius, radius, radius - 4, 0, 360);

    return (
        <View style={style}>
            <Svg width={size} height={size}>
                <G originX={radius} originY={radius}>
                    {backgroundColor && (
                        <Circle
                            fill={backgroundColor}
                            r={radius}
                            cx={radius}
                            cy={radius}
                        />
                    )}
                    <Path
                        d={fullCirclePath}
                        stroke={progressTintColor}
                        strokeWidth={progressWidth}
                        strokeLinecap="round"
                        fill="transparent"
                    />
                    {progress > 0 && (
                        <Path
                            d={circlePath}
                            stroke={progressColor}
                            strokeWidth={progressWidth}
                            strokeLinecap="round"
                            fill="transparent"
                        />
                    )}
                </G>
            </Svg>
            {children}
        </View>
    );
};

export default CircularProgress;
