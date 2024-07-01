import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { useEffect } from "react";

const Notification = () => {
  const notification = useSelector(({ notification }) => {
    return notification;
  });
  const resetStyle = {};
  const dispatch = useDispatch();

  useEffect(() => {
    if (notification.message) {
      const timeOutId = setTimeout(() => {
        dispatch(
          setNotification({
            message: "",
            messageTime: 0,
            messageType: resetStyle,
          }),
        );
      }, notification.messageTime * 1000);
      return () => clearTimeout(timeOutId);
    }
  }, [dispatch, notification]);

  return (
    <>
      {notification.message !== "" ? (
        <div style={notification.messageType}>{notification.message}</div>
      ) : null}
    </>
  );
};

export default Notification;
