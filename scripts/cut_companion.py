import os
import numpy as np
from PIL import Image
from rembg import remove, new_session


def keep_largest_blob(im):
    """Drop stray specks: keep only the largest connected opaque region."""
    a = np.array(im.split()[-1])
    mask = a > 30
    h, w = mask.shape
    labels = np.zeros((h, w), np.int32)
    cur = 0
    best_label, best_size = 0, 0
    for sy in range(h):
        for sx in range(w):
            if not mask[sy, sx] or labels[sy, sx]:
                continue
            cur += 1
            stack = [(sy, sx)]
            labels[sy, sx] = cur
            size = 0
            while stack:
                y, x = stack.pop()
                size += 1
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not labels[ny, nx]:
                        labels[ny, nx] = cur
                        stack.append((ny, nx))
            if size > best_size:
                best_size, best_label = size, cur
    arr = np.array(im)
    arr[..., 3] = np.where(labels == best_label, arr[..., 3], 0)
    return Image.fromarray(arr, "RGBA")

SRC = r"C:\Users\PC\Downloads\ChatGPT Image Jun 27, 2026, 02_16_10 PM.png"
OUT = r"C:\Users\PC\OneDrive\Desktop\Portfolio\public\companion"
os.makedirs(OUT, exist_ok=True)

# row-major order of the 3x3 grid -> mood/frame name
NAMES = ["idle", "happy", "angry", "funny", "cheeky", "smug", "surprised", "sleepy", "walk"]

img = Image.open(SRC).convert("RGBA")
W, H = img.size
cw, ch = W // 3, H // 3
inset = 6  # trim a few px so the faint grid edges don't get kept

# isnet gives crisper edges and doesn't fill concave gaps (e.g. between the legs)
session = new_session("isnet-general-use")

cut = []
for i in range(9):
    r, c = divmod(i, 3)
    box = (c * cw + inset, r * ch + inset, (c + 1) * cw - inset, (r + 1) * ch - inset)
    cell = img.crop(box)
    out = remove(cell, session=session, post_process_mask=True)
    out = keep_largest_blob(out)
    cut.append(out)

# union bounding box across all frames so feet/heads line up after trimming
bb = None
for im in cut:
    a = im.split()[-1]
    b = a.getbbox()
    if b is None:
        continue
    bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))

pad = 4
bb = (max(0, bb[0] - pad), max(0, bb[1] - pad), min(cw, bb[2] + pad), min(ch, bb[3] + pad))
print("union bbox:", bb, "-> size", bb[2] - bb[0], "x", bb[3] - bb[1])

for name, im in zip(NAMES, cut):
    im.crop(bb).save(os.path.join(OUT, name + ".png"))
    print("saved", name + ".png")
