import sys, numpy as np, cv2
from common import *

def leaf_pts(cx, cy, angle, length, width, pointed):
    pts = []
    for u in np.linspace(0, 2 * np.pi, 60):
        x = length * 0.5 * (1 - np.cos(u))
        taper = (np.sin(u / 2) ** 0.15) if not pointed else 1
        y = width * 0.5 * np.sin(u) * ((1 - 0.15 * np.cos(u)) if not pointed else (np.sin(u / 2) ** 0.0) * (1 - abs(np.cos(u)) ** 3 * 0.0))
        if pointed:
            # lance shape: widest a third of the way along, sharp tip
            t = x / length
            y = width * 0.5 * np.sign(np.sin(u)) * (np.sin(np.pi * t ** 0.75) ** 0.9) if 0 < t < 1 else 0
        pts.append((x, y))
    ca, sa = np.cos(angle), np.sin(angle)
    return [(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in pts]

def sprig(seed=1, n=1024, kind='eucalyptus'):
    rng = np.random.default_rng(seed)
    V = np.zeros((n, n), np.float32)
    A = np.zeros((n, n), np.float32)
    y, x = np.mgrid[0:n, 0:n].astype(np.float32)
    bend = rng.uniform(-0.12, 0.12) * n
    stem = [(n / 2 + bend * (t ** 2) * (1 if t else 0) - bend * 0.3, n * (0.95 - 0.78 * t)) for t in np.linspace(0, 1, 80)]
    line = np.zeros((n, n), np.uint8)
    cv2.polylines(line, [np.round(np.array(stem) * 16).astype(np.int32)], False, 255, thickness=int(n * 0.008), lineType=cv2.LINE_AA, shift=4)
    S = line.astype(np.float32) / 255
    V = V * (1 - S) + 0.45 * S
    A = np.maximum(A, S)
    count = 9 if kind == 'eucalyptus' else 11
    for i in range(count):
        t = 0.06 + 0.9 * i / (count - 1)
        idx = min(79, int(t * 79))
        sx, sy = stem[idx]
        nx_, ny_ = stem[min(79, idx + 1)]
        tangent = np.arctan2(ny_ - sy, nx_ - sx)
        side = 1 if i % 2 == 0 else -1
        grow = 1 - 0.45 * t
        if kind == 'eucalyptus':
            length, width = n * 0.2 * grow, n * 0.17 * grow
            angle = tangent + side * rng.uniform(1.15, 1.5)
            pts = leaf_pts(sx, sy, angle, length, width, False)
        else:
            length, width = n * 0.3 * grow, n * 0.1 * grow
            angle = tangent + side * rng.uniform(0.55, 0.85)
            pts = leaf_pts(sx, sy, angle, length, width, True)
        M = fill(n, pts)
        V *= 1 - 0.35 * blur(M, n * 0.01) * (1 - M)
        ddx, ddy = x - sx, y - sy
        along = np.clip((ddx * np.cos(angle) + ddy * np.sin(angle)) / length, 0, 1)
        across = (-ddx * np.sin(angle) + ddy * np.cos(angle)) / (width * 0.5)
        lit = 0.78 + 0.22 * np.clip(-across * side * 0.6 + 0.4, 0, 1)            # one half of the leaf catches more light
        val = (0.62 + 0.3 * np.sin(np.pi * along) ** 0.5) * lit
        val *= 1 - 0.18 * np.exp(-(across * 7) ** 2) * (along < 0.92)               # midrib
        val *= 1 - 0.12 * smooth(0.75, 1.0, np.abs(across))                          # darker rim
        val *= 0.95 + 0.08 * noise(n, 25, seed + i)
        V = V * (1 - M) + val * M
        A = np.maximum(A, M)
    return V, A

if __name__ == '__main__':
    out = sys.argv[1]
    for i, kind in enumerate(['eucalyptus', 'eucalyptus', 'ruscus', 'ruscus']):
        V, A = sprig(seed=60 + i, kind=kind)
        save(V, A, f'{out}/sprig-{i+1}.png', (256, 256))
