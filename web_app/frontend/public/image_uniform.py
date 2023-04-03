"""
Script to fix all of the images in the directory to a certain size for use in the application

Requires the prediciton_api venv to be activated
"""

from PIL import Image
import os

path = "./player_images"
for file in os.listdir(path):
    img_file = path + "/" + file
    img = Image.open(img_file)
    img = img.resize((120, 120))
    img.save(img_file)


print("Images resized to 120x120")