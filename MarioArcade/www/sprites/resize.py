from PIL import Image

img = Image.open("C:\\Users\\juanj\\Documents\\2026-1\\Visual\\VisualComputing\\MarioArcade\\www\\sprites\\initial.png")
img_resized = img.resize((800, 320))

img_resized.save("C:\\Users\\juanj\\Documents\\2026-1\\Visual\\VisualComputing\\MarioArcade\\www\\sprites\\initial.png")
