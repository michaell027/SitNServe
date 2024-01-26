import PushNotification, {PushNotificationObject} from "react-native-push-notification";
import {useEffect, useState} from "react";
import {Button} from "react-native";

const Notification = () => {
    const [notificationId, setNotificationId] = useState<number | null>(null);
    const [message, setMessage] = useState<string>("init message");

    useEffect(() => {
        PushNotification.createChannel(
            {
                channelId: "ongoing-channel-id",
                channelName: "Ongoing Notification Channel",
                channelDescription: "A channel to show ongoing notifications",
                soundName: "default",
                importance: 4, // Importance level: 4 - PRIORITY_HIGH
                vibrate: true,
            },
            created => console.log(`createChannel returned '${created}'`)
        );

        const id = Math.floor(Math.random() * 100000); // Generate a random ID
        setNotificationId(id);

        const notification: PushNotificationObject = {
            channelId: "ongoing-channel-id",
            ongoing: true,
            title: "Ongoing Notification",
            message: message,
            id: id,
        };

        PushNotification.localNotification(notification);

        return () => {
            // Cleanup or handle component unmounting
            // @ts-ignore
            PushNotification.cancelLocalNotifications({ id: notification.id });
        };
    }, []);

    const updateNotificationMessage = () => {
        if (notificationId !== null) {
            setMessage("updated")
        }
}
return (
    <>
        <Button onPress={updateNotificationMessage} title={"Chaange"}></Button>
    </>
)
}

export default Notification;
