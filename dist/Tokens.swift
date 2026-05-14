// AUTO-GENERATED from src/tokens.json — DO NOT EDIT.
// SwiftUI tokens for LiulianUI. Built by liulian-design-system/scripts/build.mjs.

import Foundation
import SwiftUI

public enum LiulianTokens {
    public enum Colors {
        /// Warm paper, primary background. Never use #fff.
        public static let canvasWarm: Color = Color(hex: 0xFBFBFA)
        public static let canvasSoft: Color = Color(hex: 0xF7F6F3)
        public static let canvasWarmer: Color = Color(hex: 0xF2F0EA)
        /// Card surface; functional only.
        public static let surfacePure: Color = Color(hex: 0xFFFFFF)
        public static let surfaceShade: Color = Color(hex: 0xFAFAF9)
        /// Body text. Never use #000.
        public static let inkCharcoal: Color = Color(hex: 0x131313)
        public static let inkStrong: Color = Color(hex: 0x1F1F1F)
        public static let inkSoft: Color = Color(hex: 0x34373B)
        public static let inkMuted: Color = Color(hex: 0x666A70)
        public static let inkFaint: Color = Color(hex: 0x94989D)
        public static let inkQuiet: Color = Color(hex: 0xC0C2C5)
        /// Brand anchor. Spot color only. Max 2 visible per viewport on most pages.
        public static let unibeRed: Color = Color(hex: 0xE20613)
        /// Hover/focus/destructive-confirm.
        public static let unibeRedDeep: Color = Color(hex: 0xB00010)
        /// Pill backgrounds, CI band fills.
        public static let unibeRedTint: Color = Color(hex: 0xFDEBEC)
        public static let unibeRedTint2: Color = Color(hex: 0xFAD9DC)
        public static let unibeRedText: Color = Color(hex: 0x9F2F2D)
        public static let statusGreen: Color = Color(hex: 0x2E7D43)
        public static let statusGreenPale: Color = Color(hex: 0xE5F0E7)
        public static let statusBlue: Color = Color(hex: 0x1F6C9F)
        public static let statusBluePale: Color = Color(hex: 0xE1F1FB)
        public static let statusAmber: Color = Color(hex: 0x946400)
        public static let statusAmberPale: Color = Color(hex: 0xFBF1D9)
        public static let hairline: Color = Color(hex: 0xE8E7E2)
        public static let hairlineStrong: Color = Color(hex: 0xDEDCD4)
        public static let hairlineStronger: Color = Color(hex: 0xC9C7BF)
        public static let unibeSecondaryOcean: Color = Color(hex: 0x0066B3)
        public static let unibeSecondaryGreen: Color = Color(hex: 0x509A39)
        public static let unibeSecondaryApricot: Color = Color(hex: 0xE6863A)
    }

    public enum Fonts {
        public static let display: String = "Fraunces"
        public static let displayStack: [String] = ["Fraunces","Instrument Serif","Times New Roman","serif"]
        public static let body: String = "Switzer"
        public static let bodyStack: [String] = ["Switzer","SF Pro Text","Helvetica Neue","sans-serif"]
        public static let mono: String = "JetBrains Mono"
        public static let monoStack: [String] = ["JetBrains Mono","SF Mono","ui-monospace","monospace"]
    }

    public enum FontSize {
        public static let xs: CGFloat = 10.5
        public static let sm: CGFloat = 12
        public static let md: CGFloat = 13.5
        public static let lg: CGFloat = 15
        public static let xl: CGFloat = 18
        public static let xl2: CGFloat = 22
        public static let xl3: CGFloat = 28
        public static let xl4: CGFloat = 38
        public static let xl5: CGFloat = 56
        public static let xl6: CGFloat = 96
        public static let display: CGFloat = 144
    }

    public enum Spacing {
        public static let s1: CGFloat = 4
        public static let s2: CGFloat = 8
        public static let s3: CGFloat = 12
        public static let s4: CGFloat = 16
        public static let s5: CGFloat = 20
        public static let s6: CGFloat = 24
        public static let s7: CGFloat = 32
        public static let s8: CGFloat = 48
        public static let s9: CGFloat = 64
        public static let s10: CGFloat = 96
        public static let s11: CGFloat = 128
    }

    public enum Radius {
        public static let sm: CGFloat = 4
        public static let md: CGFloat = 10
        public static let lg: CGFloat = 14
        public static let xl: CGFloat = 20
        public static let pill: CGFloat = 9999
    }

    public enum Control {
        public enum Height {
            public static let sm: CGFloat = 32
            public static let md: CGFloat = 40
            public static let lg: CGFloat = 48
        }
        public enum PaddingX {
            public static let sm: CGFloat = 16
            public static let md: CGFloat = 24
            public static let lg: CGFloat = 28
        }
        public enum IconSize {
            public static let sm: CGFloat = 14
            public static let md: CGFloat = 16
            public static let lg: CGFloat = 18
        }
        public enum IconGap {
            public static let value: CGFloat = 8
        }
        public enum ScaleActive {
            public static let value: CGFloat = 0.98
        }
    }

    public enum Focus {
        public static let ringWidth: CGFloat = 2
        public static let ringOffset: CGFloat = 2
    }

    public enum Opacity {
        public static let disabled: Double = 0.4
        public static let subtle: Double = 0.65
    }

    public enum Touch {
        public static let minTargetIos: CGFloat = 44
        public static let minTargetAndroid: CGFloat = 48
        public static let minTargetHarmony: CGFloat = 48
    }

    public enum Duration {
        public static let instant: Double = 0.080
        public static let fast: Double = 0.180
        public static let medium: Double = 0.300
        public static let slow: Double = 0.600
    }

    public enum Easing {
        public static let easeOut: (Double, Double, Double, Double) = (0.22, 1, 0.36, 1)
        public static let easeOutQuart: (Double, Double, Double, Double) = (0.16, 1, 0.3, 1)
        public static let easeInOut: (Double, Double, Double, Double) = (0.65, 0, 0.35, 1)
    }

}

// Color from 0xRRGGBB hex literal
public extension Color {
    init(hex: UInt32, opacity: Double = 1.0) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(red: r, green: g, blue: b, opacity: opacity)
    }
}
