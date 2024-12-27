from frontend.expose import Exposed

expose = Exposed()

def bind_expose_methods(window):
    # Bind exposed methods to the window
    window.expose(expose.register_user)
    window.expose(expose.authenticate_user)
