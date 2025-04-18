from frontend.expose import Exposed

expose = Exposed()

def bind_expose_methods(window):
    # Bind exposed methods to the window
    window.expose(expose.register_user)
    window.expose(expose.authenticate_user)
    window.expose(expose.get_all_users)
    window.expose(expose.create_shared_secret)
    window.expose(expose.encrypt_message)
