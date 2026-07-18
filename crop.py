from PIL import Image
import os

img = Image.open('/Users/advi/.gemini/antigravity-ide/brain/d1086304-a81a-4095-bdb1-d76b67777d1c/media__1784387887416.png')

# The image is 1024x531
# Let's crop the three photos roughly
# Y range for photos seems to be around 190 to 400
# X ranges: 
# 1: 28 to 336
# 2: 357 to 665
# 3: 686 to 994
# Let's try these coordinates

darpan = img.crop((28, 190, 336, 400))
bonnie = img.crop((357, 190, 665, 400))
nacim = img.crop((686, 190, 994, 400))

os.makedirs('public/images/team', exist_ok=True)
darpan.convert('RGB').save('public/images/team/darpan.jpg')
bonnie.convert('RGB').save('public/images/team/bonnie.jpg')
nacim.convert('RGB').save('public/images/team/nacim.jpg')

print("Cropped successfully!")
