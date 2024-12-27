import logging, os, webview

from globals import enigma_UI_LOGS, loglevel, windows, debug
from frontend.exposed_functs import expose


if __name__ == '__main__':
    logging.basicConfig(
        filename=os.path.join(enigma_UI_LOGS, 'enigma_UI.log'),
        filemode='w',
        format='%(asctime)s %(levelname)-8s %(filename)s %(message)s',
        datefmt='%d %b %Y %H:%M:%S',
        level=loglevel
    )
    windows['main'] = webview.create_window(
        title='Enigma UI',
        url='frontend/web/login.html',
        width=1200,
        height=600,
        resizable=False,
    )
    logging.info('Enigma UI started')
    webview.start(expose, [windows['main']], debug=debug)
