import os, logging

enigma_UI_ROOT = os.path.dirname(os.path.abspath(__file__))
enigma_UI_LOGS = os.path.join(enigma_UI_ROOT, 'logs')

IMAGE_ASSETS = os.path.join(enigma_UI_ROOT, 'frontend', 'assets', 'images')

# Paths
HOME = os.environ['HOME']
debug = False
loglevel = logging.DEBUG if debug else logging.INFO
windows = {}
configs = {}
stderr = {}
testlist = []

