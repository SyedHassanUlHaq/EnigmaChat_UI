import webview
from expose import Exposed

def main():
    # Create the exposed API instance
    api = Exposed()
    
    # Create the window with all exposed functions
    window = webview.create_window(
        'EnigmaChat',
        'web/index.html',
        js_api=api,
        width=1200,
        height=800,
        resizable=True,
        min_size=(800, 600)
    )
    
    # Expose all required functions
    window.expose(
        api.authenticate_user,
        api.register_user,
        api.get_all_users,
        api.send_message,
        api.get_messages,
        api.get_current_user,
        api.encrypt_message,
        api.decrypt_message
    )
    
    # Start the application
    webview.start(debug=True)

if __name__ == '__main__':
    main() 