let currentRecipientId = null;

function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

async function openChat(userElement) {
    const userId = userElement.getAttribute('data-user-id');
    const userName = userElement.getAttribute('data-user-name');

    currentRecipientId = userId;
    document.querySelector('#chatName').textContent = userName;

    const chatBody = document.querySelector('#chatMessages');
    chatBody.innerHTML = '';

    // Print the specified string to console
    console.log('ek: 1456A2EE8C3556054ABC79B4882C3190E5CA726AB402E5B09728C0F4F79C9FC2ADD828ABE432B1501B60F46CCBC86A3378C34895708A13671B20B389479AAA01C69D6B3B7D07D1C3AB54B91C580F5A336B30069A4F134FFD3764CE73A047E2844771742BF4710B972D4F6590A1C53A975368C271B670F1A4036441054A66E8815997512288552FD7149FFB705AAE133F8414060D0092FA8A1627D78AB2ABC6696288BAF5C60EF370827A7EFA72AE5C6741A5DA043D5940F121485372A98F472D60F05F74D95F01A1991E73A3E0A9536467A4738AB4CF385BA772827EB8CC058B3572E40B598444C181C7F6D9B760A7B907092E9C3351EA234E4449BD9B61A134654E2DA191FF0793961569D3594448BBC2586999A6671EFCA957F3A6699A4A1B2F4707ABA0B2DB20114FE68A4E2815AF3AAC4B8C6BE5648C50CC35C27C57288028D361708D302EEBB860BEE691F656A2550CB321E9293D7516C599817B766BA928B108779A1C8712E74C76841AC58B8C515BF4749BF715984445B2B53063384001E55F68867B1AF46CA70CA8EA74172DB80B5218BDE4F00A0E658DB5A18D94E1427AF7AE358CCEB238772FCC83F10828A4A367D42C4CB6933FDD1C1C7B86AD8B009657A96222D7BA92F527AF877970A83247F47A23FC2285118B57717715204674DA9C94B62BC7838CF87200156B26BA4671159931C49322D80671A0F332EAA2BBF893BE408B9EAC6A505483AA9075BD1368B51F99211F480A9C542A75B5BE08E43ADAF301DD729A85954010E64892A2AA4F15C0BD70B3D856494FF9BA0FE4CE12991CA06B5E3D0B2AF1F797B7A2B760910AE9F833D0D4267A58052C2990F161B886E251711C09D085C3D958B144192C9CC3224A460715B6784EB0B26F237187507D85C5110ACC71CE47198F254553356DAB448C38D243A7C02BE40C908C828D05C081DFAB8FC6B5CFE7D56E7317157DC053B2B3489986B081288871818585E09931095E3274A084115BE276438254A796270A7B4306F08B98D9C2AAECF7065E74446B7C696DBAAF8B4625A10B07827B4A8BABAB09B64AE1C375BB785441F319FB9AC2F14C95FFB252ABBB809C6909CD97706E40691CBA61C9252BD38A04311CA5BB2CA79578347505D0888851E082648BD003BE97C0F8F66759EC96A96A081C6822C4510559537042FC15F069A649B74A10961B354A1F625B04E25B293CF65FB4F53A80CC733D7A175775BF8A9ABB9201620E83A7F3E724D1287DBC44BDD5D85FC71545A927BEEDE537A7768735CC1486C7C3F31104DB67343F435D2D45554BAAC9CDB5822E8422AE8321C78ABE9F261FD4810A79E33E94E63B3341872C92253521997C084FBC060B8B125CCC88AC85AC5FE3168ACB059B3F119C4E050A20732F501BB9B3E687C846B5C2653F8886373E1004A2AB8D1BB970A7E571D8A46EE81B782F26942DD394FDD9A5E4C5631D985528604B1CC976275B6AC8A67CEEC10FFACBBA3D3BB141321DFC3C9231FC96E448B9AB847021E2C8D90C6BCAF2B1240783B62C79DEDC072A5763E660AF2C27C3F0C3C09207CAD990BB41A7BFCEC99F51596A0E83778F85C006AC6D1FE981B4C4BA1CB575A7D07AE2D31BA760095F74BC163841CF8FF77F894ABC6D261ED87A4530363B949C4AD24EFB3A56809478DDA2');
    console.log("Shared Secret: 778D6B03791ACAF56CAAFCC78CEE5CBCA1DE8737E9C7FF4AE5F384D344E08223C74C824CB5848520517C7F0EA0645EB6F889517AE5216B0CF41DDC3F0D1DF9BC6E4DECB236A5EA8B214F64266D3CDE08E0CB00E5D91F586706B1EE533D20476F4423B78F916B1726EEEA959FFB9AC634D04A94D09923CB0D4E730CCA4144E7C4884921652DA4928C68E644F673CFC57D3E87CF5BE581A89F9CB8F0FCE2782D681E5CE88AF58458C3D63D807572DE5AA8E1FAF2DCD14EDB7349565B7D3271DDBEB0B6CC7AFE08635784311159733C46E5FDC5E0CD36CE5685ACFB1AFE50ABB46F447521E60D9C8F0E4CA28C190ABB40C365F412471E95A8EA396D4BD8070EEB1F02B07C825367AA1EC0F10C3862416BB21AD6CA748A86E9829EFC1A0499093C85176D37F574C75CF5EDFA8D920D3268CB34C6A4BB0002869BC05D7C8FCC0658D4A01EACD74557A37D98A763074752DFDD6429881CAFF577D3A048031BD52C4E9726398590F9519FD59405D6B3C307AFCB168A985785D954A6D1DC1EA92E1EB6F946A4D99DD6CA307ABFD8362FABA98BB264C69C5F555D60883CC56019FEB4E8000C48B7E68CD667F00B5250CEF293A4A9E778726E62F120361E21AB3140464CDC6ABDE9EA05198D8B3BB671B9111A2F317582847CA5015664F22CDB08C143187BDE2129B54F34160295D75FE9A494FD7E67AAA76B57AAFFD89D01A71DF5C8158620298D582BBEFA6D09AC412A99AA3BE9C383504948C43DD5AF4127B1435804F44BAFA142BFC2A95D95FB2EF0641ABE71064DE51D6B9EC50857B8EEF7F48036313D0E936763B8F7BDE69B064DD5761D80EA6F1A8B37565753C579BBB895EFB9FCB3FC5FA3362E3774F0F77140B973CAE587BAD2F3B566A9C25A969347E5C54F87F1105E9C074867D94077CCAE3ABEA54520EDB51D9DAABE7848E78FDF66E07E2E22B30251931E890BAF1F5E177D4D9CEC9E4969481FD7C1335A0ED5879F34EF4BB4F66C28803CEA162BA461506D52EB3AE16951922B06825186C3D4CE1B51F3C92F3C52F2D04D1F13B2B17C9EEB882CCE0EB88B7EA9A1CE4E37415CC84C7BC436A4628386CC77D9AFD207911BD9BFD8A7FA05C275BE0C4C6A8FC0A61BDA1D67AE33B5310BE1290DC71C1418EB5744BF2842C1652173A49A692E71FE43258A205B3CAAB90C0304A51E77D01B404A01FAE2F83AB80C5DBF6CF518C001F46A633FA169B1BDB77A9D0B1E0C007835C09F6ABBA96F3F53564DA508EE8861A483A81749D4A44672B1EF1605F29D168B74B736B4F13501D7AD1213118A7832E666A50BE8010D54322A526CF7A4E543A79D0D98E004FBEC76EA3F7E887BDBAF50DADFDDDF3FFECF6D3F77EA4B9B16DC754F4A68E5EF32F6A137E7C9E3C3E8C2E236C7EBC45D46EC1677A5A8BB2668443B0BE8693DC257F13D8B9A90100B92B4D1761B819673832C32020671BFB3D0220A363E4BED6D649D3F7368CFE081E196A43D4708798E31BB2A2F61824674ABA2FC9DCD05DB84B8627AE11488886F921BC79AE1FD03")
    // Load previous messages
    await loadMessages(userId);
    // Mark messages as delivered
    await markMessagesAsDelivered(userId);
}

async function loadMessages(userId) {
    try {
        const currentUser = await pywebview.api.get_current_user();
        if (!currentUser || !currentUser.id) {
            console.error('No current user found');
            return;
        }

        const response = await pywebview.api.get_messages(currentUser.id, userId);
        if (response.status === 'success') {
            const chatBody = document.querySelector('#chatMessages');
            chatBody.innerHTML = '';

            response.messages.forEach(message => {
                const msgDiv = document.createElement('div');
                msgDiv.classList.add('message', message.is_sender ? 'sent' : 'received');
                msgDiv.setAttribute('data-message-id', message.id);

                // Add sender name
                const senderDiv = document.createElement('div');
                senderDiv.classList.add('message-sender');
                senderDiv.textContent = message.is_sender ? 'You' : message.sender_name;
                msgDiv.appendChild(senderDiv);

                const messageContent = document.createElement('div');
                messageContent.classList.add('message-content');
                messageContent.textContent = message.content;
                msgDiv.appendChild(messageContent);

                // Add encrypted content display
                const encryptedContent = document.createElement('div');
                encryptedContent.classList.add('encrypted-content');
                encryptedContent.textContent = `Encrypted: ${message.encrypted_content}`;
                msgDiv.appendChild(encryptedContent);

                const timeDiv = document.createElement('div');
                timeDiv.classList.add('message-time');
                // Convert to Pakistan time (UTC+5)
                const date = new Date(message.created_at);
                const pakistanTime = new Date(date.getTime() + (5 * 60 * 60 * 1000)); // Add 5 hours
                timeDiv.textContent = pakistanTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Karachi'
                });
                msgDiv.appendChild(timeDiv);

                chatBody.appendChild(msgDiv);
            });

            // Scroll to bottom
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function loadUsers() {
    pywebview.api.get_all_users().then(response => {
        const users = response.users;
        const usersContainer = document.querySelector('.users-list');
        usersContainer.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');

            userElement.setAttribute('data-user-id', user.id);
            userElement.setAttribute('data-user-name', user.fullname);

            userElement.innerHTML = `
                <span>${user.fullname}</span>
                <span class="status-indicator ${user.is_online ? 'online' : 'offline'}"></span>
            `;

            userElement.addEventListener('click', () => openChat(userElement));
            usersContainer.appendChild(userElement);
        });
    }).catch(error => {
        console.error('Error fetching users:', error);
    });
}

window.onclick = function (event) {
    if (!event.target.closest('.logged-in-user')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#logoutLink').addEventListener('click', () => {
        localStorage.removeItem('currentUserEmail');
        window.location.href = 'login.html';
    });

    const sendBtn = document.querySelector('.chat-footer .btn-success');
    const inputField = document.querySelector('.chat-footer input');

    sendBtn.addEventListener('click', async () => {
        const messageText = inputField.value.trim();
        if (!messageText || !currentRecipientId) return;

        try {
            // Get current user ID
            const currentUser = await pywebview.api.get_current_user();
            if (!currentUser || !currentUser.id) {
                console.error('No current user found');
                return;
            }

            // Send the message
            const response = await pywebview.api.send_message(currentUser.id, currentRecipientId, messageText);
            
            if (response.status === 'success') {
                // Add message to chat
                const msgDiv = document.createElement('div');
                msgDiv.classList.add('message', 'sent');

                // Add sender info
                const senderInfo = document.createElement('div');
                senderInfo.classList.add('sender-info');
                senderInfo.textContent = 'You';
                msgDiv.appendChild(senderInfo);

                const messageContent = document.createElement('div');
                messageContent.classList.add('message-content');
                messageContent.textContent = messageText;
                msgDiv.appendChild(messageContent);

                // Add encrypted message display
                const encryptedContent = document.createElement('div');
                encryptedContent.classList.add('encrypted-content');
                encryptedContent.textContent = `Encrypted: ${response.encrypted_content}`;
                msgDiv.appendChild(encryptedContent);

                const timeDiv = document.createElement('div');
                timeDiv.classList.add('message-time');
                timeDiv.textContent = new Date().toLocaleTimeString();
                msgDiv.appendChild(timeDiv);

                document.querySelector('#chatMessages').appendChild(msgDiv);
                inputField.value = '';

                // Scroll to bottom
                const chatBody = document.querySelector('#chatMessages');
                chatBody.scrollTop = chatBody.scrollHeight;
            } else {
                console.error('Failed to send message:', response.message);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });

    // Set up periodic message checking
    setInterval(() => {
        if (currentRecipientId) {
            loadMessages(currentRecipientId);
        }
    }, 5000); // Check for new messages every 5 seconds

    if (window.pywebview) {
        loadUsers();
    } else {
        window.addEventListener('pywebviewready', () => {
            loadUsers();
        });
    }

    const loginBtn = document.querySelector('#loginBtn');
    const registerBtn = document.querySelector('#registerBtn');

    loginBtn.addEventListener('click', async () => {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await pywebview.api.authenticate_user(email, password);
            if (response.status === 'success') {
                setCurrentUserEmail(email);
                
                document.querySelector('#loginForm').style.display = 'none';
                document.querySelector('#chatContainer').style.display = 'flex';
                loadUsers();
            } else {
                alert(response.message || 'Login failed');
            }
        } catch (error) {
            console.error("Login error:", error);
            alert('Login failed');
        }
    });

    registerBtn.addEventListener('click', async () => {
        const fullname = document.querySelector('#fullname').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;
        const profilePicture = document.querySelector('#profile-picture').files[0];

        if (!fullname || !email || !password || !confirmPassword || !profilePicture) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Handle profile picture upload
            const formData = new FormData();
            formData.append('profile_picture', profilePicture);
            
            // Get the profile picture path
            const profilePicturePath = await handleProfilePictureUpload(formData);
            
            const response = await pywebview.api.register_user(fullname, email, password, profilePicturePath);
            if (response.status === 'success') {
                alert('Registration successful! Please login.');
                document.querySelector('#registerForm').style.display = 'none';
                document.querySelector('#loginForm').style.display = 'block';
            } else {
                alert(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert('Registration failed');
        }
    });

    async function handleProfilePictureUpload(formData) {
        // TODO: Implement profile picture upload
        // For now, return a default path
        return 'default_profile.jpg';
    }

    function setCurrentUserEmail(email) {
        localStorage.setItem('currentUserEmail', email);
    }

    function getCurrentUserEmail() {
        return localStorage.getItem('currentUserEmail');
    }
});
