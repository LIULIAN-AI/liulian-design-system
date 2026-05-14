// AUTO-GENERATED from src/tokens.json — DO NOT EDIT.
// Jetpack Compose tokens for liulian-ui (Android). Built by liulian-design-system/scripts/build.mjs.

package io.liulian.tokens

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

object LiulianTokens {
    object Colors {
        /** Warm paper, primary background. Never use #fff. */
        val canvasWarm = Color(0xFFFBFBFA.toInt())
        val canvasSoft = Color(0xFFF7F6F3.toInt())
        val canvasWarmer = Color(0xFFF2F0EA.toInt())
        /** Card surface; functional only. */
        val surfacePure = Color(0xFFFFFFFF.toInt())
        val surfaceShade = Color(0xFFFAFAF9.toInt())
        /** Body text. Never use #000. */
        val inkCharcoal = Color(0xFF131313.toInt())
        val inkStrong = Color(0xFF1F1F1F.toInt())
        val inkSoft = Color(0xFF34373B.toInt())
        val inkMuted = Color(0xFF666A70.toInt())
        val inkFaint = Color(0xFF94989D.toInt())
        val inkQuiet = Color(0xFFC0C2C5.toInt())
        /** Brand anchor. Spot color only. Max 2 visible per viewport on most pages. */
        val unibeRed = Color(0xFFE20613.toInt())
        /** Hover/focus/destructive-confirm. */
        val unibeRedDeep = Color(0xFFB00010.toInt())
        /** Pill backgrounds, CI band fills. */
        val unibeRedTint = Color(0xFFFDEBEC.toInt())
        val unibeRedTint2 = Color(0xFFFAD9DC.toInt())
        val unibeRedText = Color(0xFF9F2F2D.toInt())
        val statusGreen = Color(0xFF2E7D43.toInt())
        val statusGreenPale = Color(0xFFE5F0E7.toInt())
        val statusBlue = Color(0xFF1F6C9F.toInt())
        val statusBluePale = Color(0xFFE1F1FB.toInt())
        val statusAmber = Color(0xFF946400.toInt())
        val statusAmberPale = Color(0xFFFBF1D9.toInt())
        val hairline = Color(0xFFE8E7E2.toInt())
        val hairlineStrong = Color(0xFFDEDCD4.toInt())
        val hairlineStronger = Color(0xFFC9C7BF.toInt())
        val unibeSecondaryOcean = Color(0xFF0066B3.toInt())
        val unibeSecondaryGreen = Color(0xFF509A39.toInt())
        val unibeSecondaryApricot = Color(0xFFE6863A.toInt())
    }

    object Fonts {
        const val display = "Fraunces"
        const val body = "Switzer"
        const val mono = "JetBrains Mono"
    }

    object FontSize {
        val xs = 10.5.sp
        val sm = 12.sp
        val md = 13.5.sp
        val lg = 15.sp
        val xl = 18.sp
        val xl2 = 22.sp
        val xl3 = 28.sp
        val xl4 = 38.sp
        val xl5 = 56.sp
        val xl6 = 96.sp
        val display = 144.sp
    }

    object Spacing {
        val s1 = 4.dp
        val s2 = 8.dp
        val s3 = 12.dp
        val s4 = 16.dp
        val s5 = 20.dp
        val s6 = 24.dp
        val s7 = 32.dp
        val s8 = 48.dp
        val s9 = 64.dp
        val s10 = 96.dp
        val s11 = 128.dp
    }

    object Radius {
        val sm = 4.dp
        val md = 10.dp
        val lg = 14.dp
        val xl = 20.dp
        val pill = 9999.dp
    }

    object Control {
        object Height {
            val sm = 32.dp
            val md = 40.dp
            val lg = 48.dp
        }
        object PaddingX {
            val sm = 16.dp
            val md = 24.dp
            val lg = 28.dp
        }
        object IconSize {
            val sm = 14.dp
            val md = 16.dp
            val lg = 18.dp
        }
        object IconGap {
            val value = 8.dp
        }
        object ScaleActive {
            const val value = 0.98f
        }
    }

    object Focus {
        val ringWidth = 2.dp
        val ringOffset = 2.dp
    }

    object Opacity {
        const val disabled = 0.4f
        const val subtle = 0.65f
    }

    object Touch {
        val minTargetIos = 44.dp
        val minTargetAndroid = 48.dp
        val minTargetHarmony = 48.dp
    }

    object Duration {
        const val instant: Int = 80
        const val fast: Int = 180
        const val medium: Int = 300
        const val slow: Int = 600
    }

    object Easing {
        val easeOut = CubicBezierEasing(0.22f, 1f, 0.36f, 1f)
        val easeOutQuart = CubicBezierEasing(0.16f, 1f, 0.3f, 1f)
        val easeInOut = CubicBezierEasing(0.65f, 0f, 0.35f, 1f)
    }

}
