import sys, numpy as np, cv2
from common import *

def floret(n, cx, cy, size, rot, rng):
    """One four-petal hydrangea floret: returns list of (mask, centre-of-petal) pieces."""
    pieces = []
    for k in range(4):
        a = rot + k * np.pi / 2 + rng.normal(0, 0.12)
        L = size * rng.uniform(0.85, 1.1)
        W = L * 0.82
        pts = [(L * 0.5 * (1 - np.cos(u)), W * 0.5 * np.sin(u) * (1 - 0.25 * np.cos(u))) for u in np.linspace(0, 2 * np.pi, 48)]
        ca, sa = np.cos(a), np.sin(a)
        pts = [(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in pts]
        pieces.append((fill(n, pts), a, L))
    return pieces

def hydrangea(seed=1, n=1024):
    rng = np.random.default_rng(seed)
    R = n * 0.42
    dx, dy, rho, phi = polar_grid(n)
    V = np.zeros((n, n), np.float32)
    A = np.zeros((n, n), np.float32)
    # florets scattered over a dome, back ones first
    spots = []
    tries = 0
    while len(spots) < 95 and tries < 12000:
        tries += 1
        r = R * np.sqrt(rng.random()) * 0.88
        a = rng.random() * 2 * np.pi
        x, y = n / 2 + r * np.cos(a), n / 2 + r * np.sin(a)
        if all((x - sx) ** 2 + (y - sy) ** 2 > (R * 0.135) ** 2 for sx, sy in spots):
            spots.append((x, y))
    spots.sort(key=lambda p: np.hypot(p[0] - n / 2, p[1] - n / 2), reverse=True)
    lx, ly, lz = -0.45, -0.55, 0.7
    norm = np.sqrt(lx * lx + ly * ly + lz * lz); lx, ly, lz = lx / norm, ly / norm, lz / norm
    for x, y in spots:
        d = np.hypot(x - n / 2, y - n / 2) / R
        nz = np.sqrt(max(0.05, 1 - min(d, 0.98) ** 2))
        nx, ny = (x - n / 2) / R, (y - n / 2) / R
        shade_dome = 0.72 + 0.32 * max(0, nx * lx + ny * ly + nz * lz)
        size = R * 0.16 * (0.8 + 0.2 * nz) * rng.uniform(0.9, 1.1)
        for M, a, L in floret(n, x, y, size, rng.random() * np.pi, rng):
            sh = blur(M, max(3, size * 0.12))
            V *= 1 - 0.3 * sh * (1 - M)
            ddx, ddy = dx - (x - n / 2), dy - (y - n / 2)
            along = np.clip((ddx * np.cos(a) + ddy * np.sin(a)) / L, 0, 1)
            across = np.clip((-ddx * np.sin(a) + ddy * np.cos(a)) / (L * 0.41), -1, 1)
            val = (0.7 + 0.3 * along ** 0.5) * (1 - 0.2 * across ** 2) * shade_dome
            val += 0.06 * smooth(0.75, 0.95, along)
            V = V * (1 - M) + val * M
            A = np.maximum(A, M)
        # tiny centre of the floret
        c = np.zeros((n, n), np.uint8)
        cv2.circle(c, (int(x * 16), int(y * 16)), int(size * 0.09 * 16), 255, -1, cv2.LINE_AA, 4)
        V *= 1 - 0.35 * (c.astype(np.float32) / 255)
    V *= 0.9 + 0.1 * noise(n, 30, seed)
    return V, A

if __name__ == '__main__':
    out = sys.argv[1]
    for i in range(2):
        V, A = hydrangea(seed=40 + i)
        save(V, A, f'{out}/hydrangea-{i+1}.png', (256, 256))
