import sys, numpy as np
from common import *

def rose(seed=1, n=1024, openness=1.0):
    rng = np.random.default_rng(seed)
    R = n * 0.41
    dx, dy, rho, phi = polar_grid(n)
    V = np.zeros((n, n), np.float32)
    A = np.zeros((n, n), np.float32)
    grain = noise(n, 6, seed) * 0.5 + noise(n, 40, seed + 1) * 0.5
    layers = [  # count, r1, r0, half-width, lo, hi, cup
        (5, 1.00, 0.34, 0.86, 0.72, 1.00, 0.20),
        (5, 0.86, 0.26, 0.80, 0.68, 0.99, 0.22),
        (4, 0.70, 0.18, 0.86, 0.62, 0.97, 0.26),
        (4, 0.54, 0.10, 0.92, 0.55, 0.94, 0.30),
        (3, 0.39, 0.05, 1.05, 0.48, 0.90, 0.34),
        (3, 0.26, 0.02, 1.20, 0.40, 0.84, 0.38),
        (3, 0.16, 0.00, 1.35, 0.32, 0.76, 0.40),
    ]
    rot = rng.random() * 2 * np.pi
    for li, (count, f1, f0, w, lo, hi, cup) in enumerate(layers):
        f1 = f1 * (0.82 + 0.18 * openness) if li else f1
        rot += 2.39996 + rng.normal(0, 0.25)  # roughly the golden angle between layers
        for k in range(count):
            theta = rot + k * 2 * np.pi / count + rng.normal(0, 0.08)
            r1 = R * f1 * rng.uniform(0.9, 1.06)
            r0 = R * f0
            ww = w * rng.uniform(0.92, 1.08)
            # petal outline: base, left edge, wavy rounded tip, right edge
            pts = []
            skew = rng.uniform(-0.25, 0.25)
            for s in np.linspace(-1, 1, 60):
                a = theta + s * ww
                rr = r1 * (1 - 0.12 * (s - skew) ** 2 + 0.035 * max(0, 1 - abs(s - skew) * 3) ** 2) + R * 0.008 * np.sin(s * 7 + seed + k)
                pts.append((n / 2 + rr * np.cos(a), n / 2 + rr * np.sin(a)))
            tip_r = r1 * (1 - 0.12 * (1 - skew) ** 2)
            for u in np.linspace(1, 0, 14)[1:]:          # curved right side down to the base
                rr = r0 + (tip_r - r0) * u
                a = theta + ww * (0.35 + 0.65 * u ** 0.45)
                pts.append((n / 2 + rr * np.cos(a), n / 2 + rr * np.sin(a)))
            for s in np.linspace(1, -1, 20):
                a = theta + s * ww * 0.35
                pts.append((n / 2 + r0 * np.cos(a), n / 2 + r0 * np.sin(a)))
            tip_l = r1 * (1 - 0.12 * (-1 - skew) ** 2)
            for u in np.linspace(0, 1, 14)[1:-1]:         # curved left side back up to the tip
                rr = r0 + (tip_l - r0) * u
                a = theta - ww * (0.35 + 0.65 * u ** 0.45)
                pts.append((n / 2 + rr * np.cos(a), n / 2 + rr * np.sin(a)))
            M = fill(n, pts)
            # soft shadow cast by this petal onto what is already beneath it
            sh = blur(M, max(4, R * 0.035 * (1.2 - li * 0.08)))
            V *= 1 - 0.5 * sh * (1 - M)
            t = np.clip((rho - r0) / max(r1 - r0, 1), 0, 1)
            s = np.clip(angdiff(phi, theta) / ww, -1, 1)
            val = lo + (hi - lo) * t ** 0.65
            val *= 1 - cup * s ** 2
            edge = smooth(0.86, 0.97, t) * (1 - smooth(0.97, 1.0, t))
            val += 0.12 * edge * (1 - 0.6 * s ** 2)                      # light catching the rolled edge
            val -= 0.08 * smooth(0.97, 1.0, t)                             # the edge curling away
            val -= 0.12 * (1 - smooth(0.0, 0.3, t))                        # deep base of the petal
            val *= 0.97 + 0.06 * grain
            V = V * (1 - M) + val * M
            A = np.maximum(A, M)
    # tight dark centre swirl
    for k in range(3):
        a0 = rot + k * 2.1
        pts = [(n / 2 + R * (0.02 + 0.10 * u) * np.cos(a0 + u * 4.2), n / 2 + R * (0.02 + 0.10 * u) * np.sin(a0 + u * 4.2)) for u in np.linspace(0, 1, 40)]
        line = np.zeros((n, n), np.uint8)
        import cv2
        cv2.polylines(line, [np.round(np.array(pts) * 16).astype(np.int32)], False, 255, thickness=int(R * 0.018), lineType=cv2.LINE_AA, shift=4)
        L = blur(line.astype(np.float32) / 255, 2)
        V *= 1 - 0.32 * L
    # gentle overall light from the upper left, darker underside
    light = 1.0 + 0.10 * (-dx - dy) / (R * 1.4)
    V *= light
    V *= 0.6 + 0.4 * smooth(0.0, 0.42, rho / R)   # the cup deepens towards the centre
    V *= 1 - 0.25 * smooth(0.85, 1.02, rho / R)
    A = A * (1 - smooth(0.98, 1.05, rho / R * 0.92))
    return V, A

if __name__ == '__main__':
    out = sys.argv[1]
    for i in range(4):
        V, A = rose(seed=10 + i, openness=[1.0, 0.9, 0.8, 0.95][i])
        save(V, A, f'{out}/rose-{i+1}.png', (256, 256))
