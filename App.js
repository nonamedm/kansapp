import * as React from 'react'; 
import { WebView } from 'react-native-webview'; 
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {
    render() { 
        var tokenValue = '';
        registerForPushNotification().then(token=>console.log(token)).catch(e=>console.log(e));
        async function registerForPushNotification() {
            const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            if (status != 'granted') {
                const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            }
            if (status != 'granted') {
                alert('기기의 토큰값을 얻는 데 실패했습니다.');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            tokenValue = token;
            // setInterval(function(){
                // sendToken(tokenValue);
            // },5000);
            
            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
            sendToken(tokenValue);

            return token;
        }
        
        async function sendPush(tokenValue) {

            // console.log("전달받은 토큰 : ",tokenValue);
            await fetch('https://api.expo.dev/v2/push/send', {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: tokenValue,
                    title: '무야호',
                    body: '그만큼 신나시는거지'
                })
            }).then((response) => response.json()).then((data) => {
                console.log(data);
            });

        }

        async function sendToken(tokenValue) {

            // console.log("전달받은 토큰 : ",tokenValue);
            // console.log(data);
            await fetch("http://www.kans.re.kr/origin_home/safety/bbs/save_token.php?token="+tokenValue)
            .then(
                // (response) => console.log(response)
                )
            .then((data) => console.log(data));

        }

        return <WebView source={{ uri: 'https://www.kans.re.kr/origin_home/safety/' }} style={{ marginTop: 20 }} />; 
   } 
}
