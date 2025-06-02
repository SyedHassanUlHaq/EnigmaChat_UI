import os, logging

host = "enigmachat.cfwuie0s2hc8.eu-north-1.rds.amazonaws.com"
port = "5432"
database = "enigma_ui"
user = "postgres"
password = "wq80sQlZO3GG8UuJ1LMA"

enigma_UI_ROOT = os.path.dirname(os.path.abspath(__file__))
enigma_UI_LOGS = os.path.join(enigma_UI_ROOT, 'logs')

IMAGE_ASSETS = os.path.join(enigma_UI_ROOT, 'frontend', 'assets', 'images')

# Paths
HOME = os.environ['HOME']
debug = True
loglevel = logging.DEBUG if debug else logging.INFO
windows = {}
configs = {}
stderr = {}
testlist = []

