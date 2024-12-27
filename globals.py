import os, logging

enigma_UI_ROOT = os.path.dirname(os.path.abspath(__file__))
enigma_UI_LOGS = os.path.join(enigma_UI_ROOT, 'logs')

IMAGE_ASSETS = os.path.join(enigma_UI_ROOT, 'frontend', 'assets', 'images')

# Database Credentials
host = os.getenv("DB_HOST", "localhost")
database = os.getenv("DB_NAME", "enigma_ui")
user = os.getenv("DB_USER", "root")
password = os.getenv("DB_PASSWORD", "enigma123")
port = int(os.getenv("DB_PORT", 5432))

# Paths
HOME = os.environ['HOME']
debug = False
loglevel = logging.DEBUG if debug else logging.INFO
windows = {}
configs = {}
stderr = {}
testlist = []

