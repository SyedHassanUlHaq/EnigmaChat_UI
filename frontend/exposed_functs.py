from frontend.expose import Exposed

expose = Exposed()

def bind_expose_methods(window):
    # Bind exposed methods to the window
    window.expose(expose.register_user)
    window.expose(expose.authenticate_user)
    window.expose(expose.get_all_users)
    window.expose(expose.encrypt_message)
    window.expose(expose.decrypt_message)
    window.expose(expose.send_message)
    window.expose(expose.get_messages)
