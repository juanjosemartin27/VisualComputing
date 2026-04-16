from PIL import Image

img = Image.open("C:\\Users\\juanj\\Documents\\2026-1\\Visual\\VisualComputing\\MarioArcade\\www\\sprites\\mario-jumping-left.png")
img_resized = img.resize((900, 900))

img_resized.save("C:\\Users\\juanj\\Documents\\2026-1\\Visual\\VisualComputing\\MarioArcade\\www\\sprites\\mario-jumping-left.png")
