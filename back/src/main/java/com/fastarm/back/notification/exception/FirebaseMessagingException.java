package com.fastarm.back.notification.exception;
import com.fastarm.back.common.exception.CustomException;

public class FirebaseMessagingException  extends CustomException{
    public FirebaseMessagingException() {super(NotificationExceptionConstants.FIREBASE_MESSAGING);}
}

