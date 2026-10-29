import numpy as np, cv2
from PIL import Image

def polar_grid(n, cx=None, cy=None):
    cx = n / 2 if cx is None else cx
    cy = n / 2 if cy is None else cy
    y, x = np.mgrid[0:n, 0:n].astype(np.float32)
    dx, dy = x - cx, y - cy
    return dx, dy, np.hypot(dx, dy), np.arctan2(dy, dx)

def angdiff(a, b):
    return (a - b + np.pi) % (2 * np.pi) - np.pi

def fill(n, pts):
    m = np.zeros((n, n), np.uint8)
    cv2.fillPoly(m, [np.round(np.array(pts) * 16).astype(np.int32)], 255, lineType=cv2.LINE_AA, shift=4)
    return m.astype(np.float32) / 255

def blur(a, sigma):
    k = int(sigma * 3) * 2 + 1
    return cv2.GaussianBlur(a, (k, k), sigma)

def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)

def noise(n, scale, seed):
    rng = np.random.default_rng(seed)
    small = rng.random((max(2, n // scale), max(2, n // scale))).astype(np.float32)
    return cv2.resize(small, (n, n), interpolation=cv2.INTER_CUBIC)

def save(value, alpha, path, size):
    v = np.clip(value, 0, 1)
    a = np.clip(alpha, 0, 1)
    g = Image.fromarray((v * 255).astype(np.uint8))
    al = Image.fromarray((a * 255).astype(np.uint8))
    img = Image.merge('RGBA', (g, g, g, al))
    img = img.resize(size, Image.LANCZOS)
    img.save(path)
    return img
